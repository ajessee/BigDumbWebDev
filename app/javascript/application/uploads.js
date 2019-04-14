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
              self.watchChooseFile();
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
      uploadButton.disabled = true;
    },

    watchChooseFile: function() {
      const chooseFile = document.querySelector('#user-image-choose-file') ? document.querySelector('#user-image-choose-file') : null;

      if (chooseFile) {
        let self = this;
        const uploadButton = document.querySelector('#edit-user-picture-button');
        this.disableUploadButton(uploadButton);
        chooseFile.addEventListener('input', function() {
          self.enableUploadButton(uploadButton);
        })
      }
    },

    init: function() {
      const userShowPartial = document.querySelector('#user-show-partial') ? document.querySelector('#user-show-partial') : null;

      if (userShowPartial) {
        this.watchShowPicture();
      }
    }

  };
  uploads.init();
  window.utils.uploads = uploads;
}

document.addEventListener("DOMContentLoaded", loadUploads);