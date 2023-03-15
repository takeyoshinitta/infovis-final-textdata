const fileInput = document.getElementById('file-input');

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('file', file);

  fetch('/process_file', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    alert(data.contents);
  })
  .catch(error => console.error(error));
});
