const loadUploads = () => {
  console.log("Loading Uploads Module");

  uploads = {

    watchShowPicture: function () {
      const showPicture = document.querySelector('#user-show-picture') ? document.querySelector('#user-show-picture') : null;
      let self = this;

      if (showPicture) {
        const update = function (mutationsList, observer) {
          for(var mutation of mutationsList) {
            if (mutation.type == 'childList') {
              const uploadButton = document.querySelector('#edit-user-picture-button');
              self.disableUploadButton(uploadButton);
            }
        }
        };
        const config = { attributes: true, childList: true, subtree: true };
        const observer = new MutationObserver(update);
        observer.observe(showPicture, config);
      }
    },

    enableUploadButton: function (uploadButton) {
      uploadButton.classList.remove('disabled-button');
      uploadButton.classList.add('submit-close-buttons');
      uploadButton.disabled = false;
    },

    disableUploadButton: function (uploadButton) {
      uploadButton.classList.add('disabled-button');
      uploadButton.disabled = true;
    },

    watchChooseFile: function() {
      const chooseFile = document.querySelector('input#user-image-choose-file') ? document.querySelector('input#user-image-choose-file') : null;



      if (chooseFile) {
        let self = this;
        const uploadButton = document.querySelector('#edit-user-picture-button');
        this.disableUploadButton(uploadButton);
        chooseFile.addEventListener('change', function() {
          self.enableUploadButton(uploadButton);
          if (this.files.length) {
            let cancelButton = document.querySelector('#cancel-user-picure-edit');
            cancelButton.style.display = "inline-block";
            cancelButton.addEventListener('click', function(e){
              event.preventDefault();
              document.querySelector('#add-user-image').reset();
              this.style.display = "none";
              self.disableUploadButton(uploadButton);
            })
          }
        })
      }
    },

    init: function() {
      let self = this;
      const userShowPartial = document.querySelector('#user-show-partial') ? document.querySelector('#user-show-partial') : null;
      if (userShowPartial) {
        this.watchShowPicture();
        this.watchChooseFile();
      }
    }

  };
  uploads.init();
  window.utils.uploads = uploads;
}

document.addEventListener("DOMContentLoaded", loadUploads);