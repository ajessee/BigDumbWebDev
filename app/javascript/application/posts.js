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
          existingTagsInput.dispatchEvent(new Event("change"));
        })
      }

    },

    highlightInvalidInputs: function() {
      let input = document.querySelector('input#post_title') ? document.querySelector('input#post_title') : null;
      if (input) {
        let wrapperDiv = input.parentElement;
        input.addEventListener("invalid", function (event) {
          if (input.validity.valueMissing) {
            input.setCustomValidity("Please enter a title for your post.");
            wrapperDiv.style.border = "2px solid red";
          } else {
            input.setCustomValidity("");
            wrapperDiv.style.border = 'none';
          }
        });
        input.addEventListener("change", function (event) {
          if (!input.validity.valueMissing) {
            wrapperDiv.style.border = 'none';
          } 
        });
      }
    },

    redirectToPost: function(postID) {
      if (postID) {
        window.location.href = '/posts/' + postID;
      }
      else {
        window.location.href = '/posts'
      }
    },

    setupCancelButtons: function () {

      if (this.postContainer) {
        const editPostCancelButton = document.querySelector('#edit-post-cancel-button') ? document.querySelector('#edit-post-cancel-button') : null;
        const newPostCancelButton = document.querySelector('#new-post-cancel-button') ? document.querySelector('#new-post-cancel-button') : null;

        if (editPostCancelButton) {
          editPostCancelButton.addEventListener('click', function(e){
            e.preventDefault()
            let postId = e.target.getAttribute('data-post-id');
            if (window.utils.postAutoSaver && window.utils.postAutoSaver.hasUnsavedChanges) {
              let choice = confirm("You have unsaved changes, are you sure?");
              if (choice == true) {
                window.utils.posts.redirectToPost(postId);
                window.utils.postAutoSaver.deleteSavedContent(window.utils.postAutoSaver.blogId);
              } else {
                return
              }
            }
            else {
              window.utils.posts.redirectToPost(postId);
            }
          })
        }

        if (newPostCancelButton) {
          newPostCancelButton.addEventListener('click', function(e){
            e.preventDefault()
            if (window.utils.postAutoSaver && window.utils.postAutoSaver.hasUnsavedChanges) {
              let choice = confirm("You have unsaved changes, are you sure?");
              if (choice == true) {
                window.utils.posts.redirectToPost();
                window.utils.posts.redirectToPost(postId);
                window.utils.postAutoSaver.deleteSavedContent(window.utils.postAutoSaver.blogId);
              } else {
                return
              }
            }
            else {
              window.utils.posts.redirectToPost();
            }
          })
        }


      }

    },

    init: function() {
      this.showPostBody = document.querySelector('#show-post-body') ? document.querySelector('#show-post-body') : null;
      this.postContainer = document.querySelector('.post-container') ? document.querySelector('.post-container') : null;
      this.setupFullScreen();
      this.setupTags();
      this.setupCancelButtons();
      this.highlightInvalidInputs();
    }

  };

  posts.init();
  window.utils.posts = posts;

  
}

document.addEventListener("DOMContentLoaded", setupPosts);