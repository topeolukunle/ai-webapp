# AI Image Processing Microservices on AWS

## Overview

This project demonstrates a cloud-native microservices application deployed on AWS using serverless and container technologies. The solution provides a web interface for uploading images, processing them through an AI microservice, and storing metadata in AWS services.

The project showcases Infrastructure as Code concepts, CI/CD automation, Docker containerization, networking, and modern AWS architecture.

---

## Architecture

**Frontend**

* Static HTML/CSS/JavaScript web application
* AWS Lambda Function URL
* Amazon S3 for website assets

**Backend Microservices**

* Upload Microservice
* AI Processing Microservice
* Fetch Microservice
* Push Microservice

**Storage**

* Amazon S3
* Amazon DynamoDB

---

## AWS Services Used

* AWS Lambda
* Lambda Function URLs
* Amazon S3
* Amazon DynamoDB
* IAM Roles & Policies
* Amazon ECR
* Docker
* Application Load Balancer (ALB)
* Amazon VPC
* Public & Private Subnets
* Security Groups
* CloudWatch Logs

---

## Networking

The application is deployed inside an AWS VPC using multiple Availability Zones.

```
Internet
    │
Application Load Balancer
    │
Public Subnets
    │
Docker / Lambda Services
    │
Private Subnets
    │
S3 + DynamoDB
```

This architecture provides scalability, high availability, and secure network isolation.

---

## Containerization

Docker is used to package application components into portable containers.

Benefits include:

* Consistent deployments
* Environment isolation
* Simplified testing
* Easy scalability

---

## CI/CD Pipeline

The project follows a simple Continuous Integration / Continuous Deployment workflow.

```
Developer
     │
     ▼
GitHub Repository
     │
     ▼
Build & Test
     │
     ▼
Create Deployment Package
     │
     ▼
Deploy to AWS Lambda / Docker
     │
     ▼
Application Available via Function URL / ALB
```

The deployment process automatically:

* Packages Lambda code
* Creates ZIP artifacts
* Updates AWS Lambda functions
* Waits for deployment completion
* Retrieves Function URLs
* Executes deployment validation tests

---

## Deployment

Clone the repository:

```bash
git clone <repository-url>
cd <repository>
```

Run the deployment script:

```bash
chmod +x deploy.sh
./deploy.sh
```

The script will:

* Build the Lambda package
* Deploy the AI microservices
* Wait for deployment completion
* Display Function URLs
* Execute validation tests

---

## API Test

Example request:

```text
GET /?imageId=test123
```

Example response:

```json
{
  "imageId": "test123",
  "status": "success",
  "message": "AI function executed successfully"
}
```

---

## Technologies

* Python
* AWS Lambda
* Docker
* Amazon S3
* Amazon DynamoDB
* IAM
* VPC
* Application Load Balancer
* Git
* GitHub
* Bash

---

## Project Highlights

* Microservices architecture
* Serverless deployment
* Docker containerization
* AWS networking with VPC and subnets
* Application Load Balancer integration
* Automated deployment pipeline
* Infrastructure security through IAM roles and policies
* Cloud-native scalable design

---

## Author

**Daniel F**

Cloud | DevOps | AWS | Python | Docker | CI/CD | Infrastructure Automation
