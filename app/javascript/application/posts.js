function setupPosts() {

  console.log("Setup Posts");

  const posts = {

    setupFullScreen: function() {

      let self = this;

      if (this.showPostBody) {

        this.toggleLink = document.querySelector('#post-toggle-fullscreen');

        this.toggleIcons = function(expand) {
          const expandIcon = document.querySelector('#expand-post-icon');
          const shrinkIcon = document.querySelector('#shrink-post-icon');
          if (expand) {
            expandIcon.style.display = "block";
            shrinkIcon.style.display = "none";
          } else {
            expandIcon.style.display = "none";
            shrinkIcon.style.display = "block";
          }

        }
    
        this.toggleLink.addEventListener('click', function(e) {
          if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
          ) {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            }
          } else {
            if (self.showPostBody.requestFullscreen) {
              self.showPostBody.requestFullscreen();
            } else if (self.showPostBody.mozRequestFullScreen) {
              self.showPostBody.mozRequestFullScreen();
            } else if (self.showPostBody.webkitRequestFullscreen) {
              self.showPostBody.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (self.showPostBody.msRequestFullscreen) {
              self.showPostBody.msRequestFullscreen();
            }
          }
        });

        ['webkitfullscreenchange', 'mozfullscreenchange', 'fullscreenchange', 'msfullscreenchange'].forEach(
          eventName => document.addEventListener(eventName, function(e) {
            const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
            if (!state) {
              self.toggleIcons(true);
            } else {
              self.toggleIcons();
            }
          })
        );
        
    
      };

    },

    setupTags: function () {

      if (this.postContainer) {
        const tagDropDown = document.querySelector('#post_counts');
        tagDropDown.addEventListener('change', function(e){
          let selectionText = e.target.options[e.target.selectedIndex].text;
          let existingTagsInput = document.querySelector('#existing-tags-input');
          let existingTagsInputArr;
          if (existingTagsInput.value === "") {
            existingTagsInputArr = [];
          } else {
            existingTagsInputArr = existingTagsInput.value.split(",");
            existingTagsInputArr = existingTagsInputArr.map(el => el.trim());
          }
          if (!existingTagsInputArr.includes(selectionText)) {
            existingTagsInputArr.push(selectionText);
          }
          existingTagsInput.value = existingTagsInputArr.join(", ")
        })
      }

    },

    setupCancelButtons: function () {

      if (this.postContainer) {
        const editPostCancelButton = document.querySelector('#edit-post-cancel-button');
        const newPostCancelButton = document.querySelector('#new-post-cancel-button');
        editPostCancelButton.addEventListener('click', function(e){
          e.preventDefault()
          let postID = e.target.getAttribute('data-post-id');
          window.location.href = '/posts/' + postID;
        })
      }

    },

    init: function() {
      this.showPostBody = document.querySelector('#show-post-body') ? document.querySelector('#show-post-body') : null;
      this.postContainer = document.querySelector('.post-container') ? document.querySelector('.post-container') : null;
      this.setupFullScreen();
      this.setupTags();
      this.setupCancelButtons();
    }

  };

  posts.init();
  window.utils.posts = posts;

  
}

document.addEventListener("DOMContentLoaded", setupPosts);