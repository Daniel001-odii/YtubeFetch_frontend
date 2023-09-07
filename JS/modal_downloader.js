// Attach a click event listener to the download links
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("download_btn")) {
        event.preventDefault(); // Prevent the default link behavior

        // Show the download progress modal
        $('#exampleModalCenter').modal('show');

        // Get the download link URL from the clicked link
        const dLoadLink = event.target.getAttribute("href");

        // Start the download using Fetch API
        fetch(dLoadLink)
            .then(response => {
                const contentDisposition = response.headers.get("content-disposition");
                let filename = "YtubeFetch Download";

                if (contentDisposition) {
                    const filenameRegex = /filename[^;=\n]*((['"]).*?\2|[^;\n]*)/;
                    const matches = contentDisposition.match(filenameRegex);
                    if (matches && matches[1]) {
                        filename = matches[1].replace(/['"]/g, "");
                    }
                }

                // Handle the case where the filename has an incorrect extension
                if (filename.endsWith(".weba")) {
                    filename = filename.slice(0, -5) + ".webm";
                }

                // Create a blob from the response content
                return response.blob().then(blob => {
                    // Create an object URL for the blob
                    const blobUrl = URL.createObjectURL(blob);

                    // Update the modal content and hide it after a short delay
                    setTimeout(() => {
                        $('#exampleModalCenter').modal('hide');

                        // Create a temporary anchor element for downloading
                        const downloadAnchor = document.createElement("a");
                        downloadAnchor.href = blobUrl;
                        downloadAnchor.download = filename;
                        downloadAnchor.target = "_blank";

                        // Trigger the click event on the anchor element to initiate the download
                        downloadAnchor.click();

                        // Revoke the blob URL to free up resources
                        URL.revokeObjectURL(blobUrl);
                    }, 1000);
                });
            })
            .catch(error => {
                console.error("Error during download:", error);
                // Handle any download errors here
            });
    }
});
