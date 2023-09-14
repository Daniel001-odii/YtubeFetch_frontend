  
  //asking users for feedback?
  let user_downloads = Number(localStorage.getItem("user_downloads"));

function checkVisits(){
  if(user_downloads >= 0){
    user_downloads++;
    localStorage.setItem("user_downloads", String(user_downloads));
    if(user_downloads%3 == 0){alert("please we need your feedback!")};

  }else if(localStorage.getItem("user_downloads" == null)){localStorage.setItem("user_downloads", "0")};
  };

console.log("number of visits: ", localStorage.getItem("user_downloads"));


const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))



const downloadModal = new bootstrap.Modal(document.getElementById('downloadModal'));
const downloadProgressBar = document.getElementById('downloadProgressBar');
const downloadStatus = document.getElementById('downloadStatus');



  
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
    const api_url = "https://ytubefetch.com/app"






function fetchVideoInfo() {
        // checkVisits();

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
                        console.log(data.error);
                        if(data.error){showError(data.error)};
                        
                        data.resolutions.forEach(resolution => {
                            const row = document.createElement('tr');

                            const resolutionCell = document.createElement('td');

                            function checkAudio(){
                            const hasAudio = resolution.hasAudio;
                            if(hasAudio == false){return " <i data-bs-toggle='tooltip' data-bs-placement='top' data-bs-title='Tooltip on top' style='color:red' class='bi bi-volume-mute-fill'></i>"}else{return " "};
                            };

                            resolutionCell.innerHTML = resolution.format + "-" + `<span class="badge bg-success">${resolution.resolution}</span>` + checkAudio();
                            row.appendChild(resolutionCell);

                            const sizeCell = document.createElement('td');
                            sizeCell.innerHTML = `${Math.round(resolution.size_mb * 100) / 100} MB`;
                            row.appendChild(sizeCell);

                            const downloadCell = document.createElement('td');
                            const downloadLink = document.createElement('a');
                            downloadLink.setAttribute("class", "download_btn");
                            downloadLink.setAttribute("data-filename", "example.mp4");
                            if(resolution.resolution == null){
                                downloadLink.style.display = "none !important";
                                downloadLink.href = "/#";
                                downloadLink.target = null;
                                downloadLink.download = false;
                                downloadLink.onclick = function(){showError( "Sorry that format is not downloadable!")} 
                            }else{downloadLink.href = `${api_url}${resolution.download_link}`;
                            downloadLink.href = `${api_url}${resolution.download_link}`;
                            downloadLink.download = true;
                            // downloadLink.target = "download_success.html";
                            downloadLink.innerHTML = "<i class='bi bi-cloud-arrow-down-fill'></i> <small>download</small>";
                            downloadCell.appendChild(downloadLink);
                            row.appendChild(downloadCell);
                            tableBody.appendChild(row);
                            }
                        });
                        const thumbnailImg = document.getElementById('thumbnailImg');
                        thumbnailImg.src = data.thumbnail_url;
                        const vidTitle = document.getElementById("videoTitle");
                        vidTitle.textContent = data.title;


                        // Populate audio formats
                // Display best audio download if available
                if (data.audio) {
                    // console.log("audio file found!")
                    const audioRow = document.createElement('tr');

                    const audioFormatCell = document.createElement('td');
                    audioFormatCell.innerHTML = "<span  class='badge bg-info'>Audio <i class='bi bi-soundwave'></i></span> - " + data.audio.format;
                    audioRow.appendChild(audioFormatCell);

                    const audioSizeCell = document.createElement('td');
                    audioSizeCell.innerHTML = `${Math.round(data.audio.size_mb * 100) / 100} MB`;
                    audioRow.appendChild(audioSizeCell);

                    const audioDownloadCell = document.createElement('td');
                    const audioDownloadLink = document.createElement('a');
                    audioDownloadLink.setAttribute("class", "download_btn");
                    // audioDownloadLink.setAttribute("id", "audio_download");
                    audioDownloadLink.href = `${api_url}${data.audio.download_link}`;
                    audioDownloadLink.innerHTML = "<i class='bi bi-cloud-arrow-down-fill'></i> <small>download</small>";
                    audioDownloadLink.target = "download_success.html";
                    audioDownloadLink.download = true;
                    audioDownloadCell.appendChild(audioDownloadLink);
                    audioRow.appendChild(audioDownloadCell);

                    tableBody.appendChild(audioRow);
                }else{console.log("no audio file found!")};


                // change button color when download has been initiated.....
                const downloadButton = document.getElementsByClassName("download_btn");
                for (const element of downloadButton) {
                    element.addEventListener('click', function(event){
                        element.style.background = "grey";
                        event.preventDefault();

                        console.log(element.href);
                        showDownloadProgress(element);
                    }) ;
                    };
                  

                        //re-enable all things new as a new creature wey you be :)....
                        getVidBtn.innerHTML = "Get New video";
                        getVidBtn.disabled = false;
                        yt_vid_details.style.display = "block";



                       // Get the current date and time
                        const currentDate = new Date();

                        // Format it in standard form
                        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
                        const formattedDate = currentDate.toLocaleString('en-US', options);

                        // Display the formatted date and time
                        // document.getElementById('datetime').textContent = formattedDate;

                        const input_box = document.getElementById("urlInput");
                        let buttons = document.getElementsByClassName("download_btn");

                        // Load the existing user record from local storage or create an empty array if it doesn't exist
                        let temp_store = JSON.parse(localStorage.getItem("user_record")) || [];

                        for (let i = 0; i < buttons.length; i++) {
                            buttons[i].onclick = function () {
                                const record = {
                                    "youtube_url": document.getElementById('urlInput').value,
                                    "download_url": buttons[i].href,
                                    "date_and_time": formattedDate,
                                    "thumbnail": data.thumbnail_url,
                                };

                                // Push the record to the temp_store array
                                temp_store.push(record);

                                // Store the temp_store array as a JSON string in local storage
                                localStorage.setItem("user_record", JSON.stringify(temp_store));
                            };
                        }
                        
                    })
                    .catch(error => {
                         //re-enable all things new as a new creature wey you be :)....
                         getVidBtn.innerHTML = "Get New video";
                        getVidBtn.disabled = false;

                        // showError( `Error fetching video info: ${error}`);
                        console.log("this is the real error: " + error)
                        
                        // console.error('Error fetching video info:', error);
                    });



                    
                    

            }
        }
    }


    let activeDownload = null; // Global variable to track the active download

    function showDownloadProgress(downloadLink) {
        // Check if there's an active download, and if so, cancel it
        if (activeDownload) {
          activeDownload.cancel();
          activeDownload = null;
        }
      
        // Show the download progress modal
        downloadModal.show();
      
        // Create an anchor element for triggering the download
        const downloadAnchor = document.createElement('a');
        downloadAnchor.style.display = 'none'; // Hide the anchor element
      
        // Append the anchor to the document body
        document.body.appendChild(downloadAnchor);
      
        // Start the download
        fetch(downloadLink.href)
          .then(response => {
            const contentLength = response.headers.get('Content-Length');
            let downloaded = 0;
      
            const reader = response.body.getReader();
      
            function processResult(result) {
              if (result.done) {
                // Download completed
                downloadStatus.textContent = 'Download completed.';
                setTimeout(() => {
                  downloadModal.hide();
                  downloadAnchor.remove(); // Remove the anchor element
                }, 1000); // Hide the modal after 1 second
                return;
              }
      
              // Update progress bar and status
              downloaded += result.value.length;
              const progress = (downloaded / contentLength) * 100;
              downloadProgressBar.style.width = progress + '%';
              downloadProgressBar.textContent = progress.toFixed(2) + '%';
              downloadStatus.textContent = `Downloading... ${downloaded} / ${contentLength} bytes`;
      
              // Continue reading
              return reader.read().then(processResult);
            }
      
            activeDownload = {
              cancel: () => {
                reader.cancel();
                downloadStatus.textContent = 'Download completed.';
                downloadProgressBar.style.width = '100%';
                setTimeout(() => {
                  downloadModal.hide();
                  downloadAnchor.remove(); // Remove the anchor element
                }, 1000); // Hide the modal after 1 second
              }
            };
      
            reader.read().then(processResult);
      
            // Set the anchor's attributes to trigger the download
            downloadAnchor.href = downloadLink.href;
            downloadAnchor.download = downloadLink.getAttribute('data-filename'); // Set the download file name
            downloadAnchor.click(); // Simulate a click to trigger the download
          })
          .catch(error => {
            // Handle download errors here
            downloadStatus.textContent = 'Download failed.';
            console.error('Download error:', error);
          });
      }
    