    const pasteButton = document.getElementById('pasteButton');
    const inputBox = document.getElementById('urlInput');
    pasteButton.addEventListener('click', () => {
      // Check if the browser supports the Clipboard API
      if (navigator.clipboard) {
        navigator.clipboard.readText()
          .then(copiedText => {
            inputBox.value = copiedText;
          })
          .catch(error => {
            console.error('Error reading clipboard:', error);
          });
      } else {
        console.error('Clipboard API not supported');
      }
    });