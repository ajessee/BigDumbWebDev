const loadUploads = () => {
  if (event.target.location.pathname === '/scroll3d') return;
  console.info("Loading Uploads Module");

  uploads = {

    watchShowResource: function (...resourceNames) {
      resourceNames.forEach((resourceName) => {
        const showResource = document.querySelector(`#user-show-${resourceName}`);
        let self = this;

        if (showResource) {
          const update = function (mutationsList, observer) {
            for (var mutation of mutationsList) {
              if (mutation.type == 'childList' && mutation.addedNodes.length && mutation.target.id !== `edit-user-${resourceName}-button-container`) {
                const uploadButton = document.querySelector(`#upload-user-${resourceName}-button`);
                self.disableUploadButton(uploadButton);
                self.watchChooseFile(resourceName);
                self.setupCancelButton(uploadButton, resourceName);
              }
            }
          };
          const config = {
            attributes: true,
            childList: true,
            subtree: true
          };
          const observer = new MutationObserver(update);
          observer.observe(showResource, config);
        }
      })
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

    setupCancelButton: function (uploadButton, resourceName) {
      let self = this;
      let cancelButton = document.querySelector(`#cancel-user-${resourceName}-edit`);
      cancelButton.style.display = "inline-block";

      let cancelEventFunction = function (e) {
        event.preventDefault();
        let controls = document.querySelector(`#edit-user-${resourceName}-controls`);
        let editButtonContainer = document.querySelector(`#edit-user-${resourceName}-button-container`);
        controls.remove();
        if (resourceName === 'picture') {
          editButtonContainer.append(self.editUserPictureButton);
        } else {
          editButtonContainer.append(self.editUserResumeButton);
        }
      }
      cancelButton.addEventListener('click', cancelEventFunction, true)
    },


    watchChooseFile: function (...resourceNames) {
      resourceNames.forEach((resourceName) => {
        const chooseFile = document.querySelector(`input#user-${resourceName}-choose-file`);

        if (chooseFile) {
          let self = this;
          const uploadButton = document.querySelector(`#upload-user-${resourceName}-button`);
          this.disableUploadButton(uploadButton);
          chooseFile.addEventListener('change', function () {
            self.enableUploadButton(uploadButton);
          })
        }
      })
    },

    init: function () {
      let self = this;
      const userShowPartial = document.querySelector('#user-show-partial');
      if (userShowPartial) {
        this.watchShowResource('picture', 'resume');
        this.editUserPictureButton = document.querySelector('#edit-user-picture-button');
        this.editUserResumeButton = document.querySelector('#edit-user-resume-button');
      }
    }

  };
  uploads.init();
  window.utils.uploads = uploads;
}

document.addEventListener("DOMContentLoaded", loadUploads);