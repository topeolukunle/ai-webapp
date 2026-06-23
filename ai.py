import json
import os
import base64
import boto3
from botocore.config import Config

s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")

bedrock = boto3.client(
    "bedrock-runtime",
    config=Config(read_timeout=20, connect_timeout=5)
)

def lambda_handler(event, context):
    print("EVENT:", json.dumps(event))

    query_params = event.get("queryStringParameters") or {}
    image_id = query_params.get("imageId")

    if not image_id and event.get("body"):
        try:
            body_data = json.loads(event["body"])
            image_id = body_data.get("imageId")
        except (json.JSONDecodeError, TypeError):
            pass

    if not image_id:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": "imageId is required"})
        }

    table = dynamodb.Table(os.environ["DYNAMODB_TABLE"])
    bucket = os.environ["WEBSITE_ASSETS_BUCKET"]

    try:
        s3_object = s3.get_object(Bucket=bucket, Key=image_id)
        image_bytes = s3_object["Body"].read()
        image_b64 = base64.b64encode(image_bytes).decode("utf-8")

        content_type = s3_object.get("ContentType", "image/jpeg")
        nova_format = "jpeg"
        if "png" in content_type:
            nova_format = "png"
        elif "gif" in content_type:
            nova_format = "gif"
        elif "webp" in content_type:
            nova_format = "webp"

        # Nova's request format - different structure from Claude's Messages API
        request_body = {
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "image": {
                                "format": nova_format,
                                "source": {"bytes": image_b64}
                            }
                        },
                        {
                            "text": "Describe this image in one short paragraph."
                        }
                    ]
                }
            ],
            "inferenceConfig": {"maxTokens": 300}
        }

        response = bedrock.invoke_model(
            modelId="amazon.nova-lite-v1:0",
            body=json.dumps(request_body)
        )
        result = json.loads(response["body"].read())
        description = result["output"]["message"]["content"][0]["text"]

        table.update_item(
            Key={"ImageKey": image_id},
            UpdateExpression="SET AI_Description = :d",
            ExpressionAttributeValues={":d": description}
        )

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "imageId": image_id,
                "status": "success",
                "message": "AI description generated successfully",
                "description": description
            })
        }

    except Exception as e:
        print(f"Error: {e}")
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)})
        }
