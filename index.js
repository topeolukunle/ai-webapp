document.addEventListener('DOMContentLoaded', function() {
  fetch('https://fc2ebpgorqmzacfoti3ex6iswm0kgadl.lambda-url.us-east-1.on.aws')
    .then(response => response.json())
    .then(data => {
      const gallery = document.getElementById('image-gallery');

      data.forEach(image => {
        const card = document.createElement('div');
        card.className = 'card';
        const imgElement = document.createElement('img');
        imgElement.src = image.url;
        imgElement.className = 'card-img-top';
        imgElement.alt = 'Image';
        imgElement.addEventListener('click', () => {
          enlargeImage(image.url);
          document.getElementById('generateDescription')
            .setAttribute('data-image-id', extractImageId(image.url));
        });
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        const imgDescription = document.createElement('p');
        imgDescription.className = 'card-text';
        let descriptionText = image.description;
        if (
          typeof image.description === 'object' &&
          image.description &&
          image.description.content &&
          image.description.content.length > 0
        ) {
          descriptionText = image.description.content[0].text;
        }
        imgDescription.textContent = descriptionText;
        cardBody.appendChild(imgDescription);
        card.appendChild(imgElement);
        card.appendChild(cardBody);
        gallery.appendChild(card);
      });
    })
    .catch(error => console.error('Error fetching image data:', error));

  function enlargeImage(src) {
    $('#modalImg').attr('src', src);
    $('#imageModal').modal('show');
  }

  // FIXED: strip the presigned URL's query string before extracting the key,
  // and extract the full "images/<key>" path, not just the last path segment.
  function extractImageId(imageUrl) {
    const urlWithoutQuery = imageUrl.split('?')[0];
    const match = urlWithoutQuery.match(/images\/[^/]+$/);
    return match ? match[0] : urlWithoutQuery.substring(urlWithoutQuery.lastIndexOf('/') + 1);
  }

  document.getElementById('generateDescription').addEventListener('click', function() {
    const imageId = this.getAttribute('data-image-id');
    console.log('Generating AI description for image ID:', imageId);
    this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';
    this.disabled = true;
    generateAiDescription(imageId);
  });

  function generateAiDescription(imageId) {
    const aiDescriptionEndpoint = 'https://3p6zwulkjzvtelva4vaw5qiyoy0mywxk.lambda-url.us-east-1.on.aws';
    fetch(aiDescriptionEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageId: imageId }),
    })
      .then(response => response.json())
      .then(data => {
        // FIXED: actually check for an error before declaring success
        if (data.error) {
          console.error('AI description error:', data.error);
          alert('Failed to generate AI description: ' + data.error);
        } else {
          console.log('AI description generated:', data.description);
          alert('AI Description Generated!');
        }
        document.getElementById('generateDescription').innerHTML = 'Generate AI Description';
        document.getElementById('generateDescription').disabled = false;
      })
      .catch(error => {
        console.error('Error generating AI description:', error);
        alert('Failed to generate AI description: ' + error);
        document.getElementById('generateDescription').innerHTML = 'Generate AI Description';
        document.getElementById('generateDescription').disabled = false;
      });
  }

  $('#imageModal').on('hidden.bs.modal', function () {
    window.location.reload(); // Refresh page when modal is closed
  });
});
