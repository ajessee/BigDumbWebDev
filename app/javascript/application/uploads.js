const loadUploads = () => {
  console.log("Loading Uploads Module");

  uploads = {

    watchShowPicture: function () {
      const showPicture = document.querySelector('#user-show-picture') ? document.querySelector('#user-show-picture') : null;
      let self = this;

      if (showPicture) {
        const update = function (mutationsList, observer) {
          for(var mutation of mutationsList) {
            if (mutation.type == 'childList' && mutation.addedNodes.length && mutation.target.id !== "edit-user-picture-button-container") {
              const uploadButton = document.querySelector('#upload-user-picture-button');
              self.disableUploadButton(uploadButton);
              self.watchChooseFile();
              self.setupCancelButton(uploadButton);
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
      if (uploadButton) {
        uploadButton.classList.add('disabled-button');
        uploadButton.disabled = true;
      }
    },

    setupCancelButton: function (uploadButton) {
      let self = this;
      let cancelButton = document.querySelector('#cancel-user-picture-edit');
      cancelButton.style.display = "inline-block";

      let cancelEventFunction = function(e){
        event.preventDefault();
        let controls = document.querySelector('#edit-user-picture-controls');
        let editButtonContainer = document.querySelector('#edit-user-picture-button-container');
        controls.remove();
        editButtonContainer.append(self.editUserPictureButton);
      }
      cancelButton.addEventListener('click', cancelEventFunction, true)
    },


    watchChooseFile: function() {
      const chooseFile = document.querySelector('input#user-image-choose-file') ? document.querySelector('input#user-image-choose-file') : null;

      if (chooseFile) {
        let self = this;
        const uploadButton = document.querySelector('#upload-user-picture-button');
        this.disableUploadButton(uploadButton);
        chooseFile.addEventListener('change', function() {
          self.enableUploadButton(uploadButton);
        })
      }
    },

    init: function() {
      let self = this;
      const userShowPartial = document.querySelector('#user-show-partial') ? document.querySelector('#user-show-partial') : null;
      if (userShowPartial) {
        this.watchShowPicture();
        this.watchChooseFile();
        this.editUserPictureButton = document.querySelector('#edit-user-picture-button') ? document.querySelector('#edit-user-picture-button') : null;
      }
    }

  };
  uploads.init();
  window.utils.uploads = uploads;
}

document.addEventListener("DOMContentLoaded", loadUploads);