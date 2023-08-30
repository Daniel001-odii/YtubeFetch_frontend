  let getVidBtn = document.getElementById("getVidBtn");
    const yt_vid_details = document.getElementById("yt_vid_details");
    yt_vid_details.style.display = "none";


    const error_screen = document.getElementById("message_box");

    function showError(message){
        error_screen.innerHTML = `
    <div class="alert alert-warning d-flex align-items-center alert-dismissible fade show" role="alert" id="noLinkAlert">
        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>
        <div>
           ${message}
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;

    setInterval(function(){error_screen.innerHTML = ''}, 8000);
    }

    // const api_url = "http://127.0.0.1:5000"
    const api_url = "https://techzone-form-ccb2240b74a4.herokuapp.com"

     function fetchVideoInfo() {
        if(document.getElementById('urlInput').value == ""){
           showError("Oops, looks like you forgot to paste your link");
        }
        else{
        ///show loading state to users so they can be happy.....
        /// disable the download button to avoid excessive sending of requests.....
            getVidBtn.innerHTML = "<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>"
            getVidBtn.disabled = true;

            
            const url = document.getElementById('urlInput').value;
            if (url) {
                fetch(`${api_url}/api/video_info?url=${encodeURIComponent(url)}`)
                    .then(response => response.json())
                    .then(data => {
                        const resolutionsList = document.getElementById('resolutionsList');
                        const sizeList = document.getElementById('sizeList');
                        const tableBody = document.getElementById('tableBody');
                        tableBody.innerHTML = ''; // Clear the table body before populating new data
                        // console.log("this is the returned data: " + data.audio_formats)
                        data.resolutions.forEach(resolution => {
                            const row = document.createElement('tr');

                            const resolutionCell = document.createElement('td');
                            resolutionCell.innerHTML = resolution.format + "-" + `<span class="badge bg-success">${resolution.resolution}</span>` ;
                            row.appendChild(resolutionCell);

                            const sizeCell = document.createElement('td');
                            sizeCell.innerHTML = `${Math.round(resolution.size_mb * 100) / 100} MB`;
                            row.appendChild(sizeCell);

                            const downloadCell = document.createElement('td');
                            const downloadLink = document.createElement('a');
                            downloadLink.setAttribute("class", "download_btn");
                            if(resolution.resolution == null){
                                downloadLink.style.display = "none !important";
                                downloadLink.href = "/#";
                                downloadLink.target = null;
                                downloadLink.download = false;
                                downloadLink.onclick = function(){showError( "Sorry that format is not downloadable!")} 
                            }else{downloadLink.href = `${api_url}${resolution.download_link}`;
                            downloadLink.download = true;
                            downloadLink.target = "_blank";
                            
                           
                            downloadLink.innerHTML = "<i class='bi bi-cloud-arrow-down-fill'></i> <small>download</small>";
                            downloadCell.appendChild(downloadLink);
                            row.appendChild(downloadCell);
                            tableBody.appendChild(row);
                            }
                        });
                        const thumbnailImg = document.getElementById('thumbnailImg');
                        thumbnailImg.src = data.thumbnail_url;


                        // Populate audio formats
                // Display best audio download if available
                if (data.audio) {
                    console.log("audio file found!")
                    const audioRow = document.createElement('tr');

                    const audioFormatCell = document.createElement('td');
                    audioFormatCell.innerHTML = "<span class='badge bg-info text-dark'>Audio</span> - " + data.audio.format;
                    audioRow.appendChild(audioFormatCell);

                    const audioSizeCell = document.createElement('td');
                    audioSizeCell.innerHTML = `${Math.round(data.audio.size_mb * 100) / 100} MB`;
                    audioRow.appendChild(audioSizeCell);

                    const audioDownloadCell = document.createElement('td');
                    const audioDownloadLink = document.createElement('a');
                    audioDownloadLink.setAttribute("class", "download_btn");
                    audioDownloadLink.href = `${api_url}${data.audio.download_link}`;
                    audioDownloadLink.innerHTML = "<i class='bi bi-cloud-arrow-down-fill'></i> <small>download</small>";
                    audioDownloadLink.target = "_blank";
                    audioDownloadLink.download = true;
                    audioDownloadCell.appendChild(audioDownloadLink);
                    audioRow.appendChild(audioDownloadCell);

                    tableBody.appendChild(audioRow);
                }else{console.log("no audio file found!")}


                        //re-enable all things new as a new creature wey you be :)....
                        getVidBtn.innerHTML = "Get New video";
                        getVidBtn.disabled = false;
                        yt_vid_details.style.display = "block";
                        
                    })
                    .catch(error => {
                         //re-enable all things new as a new creature wey you be :)....
                         getVidBtn.innerHTML = "Get New video";
                        getVidBtn.disabled = false;

                        showError( `Error fetching video info: ${error}`);
                        
                        // console.error('Error fetching video info:', error);
                    });
            }
        }
    }




