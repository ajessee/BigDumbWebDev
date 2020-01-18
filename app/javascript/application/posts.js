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

    // This is an ugly hack to work around the fact that I don't know how to configure active storage files/attachements to preview correctly
    replaceUrlForAnimatedElements: function() {
      let attachments = document.querySelectorAll('action-text-attachment');
      attachments.forEach(function(attachment){
        let contentType = attachment.getAttribute("content-type");
        if (contentType === "image/gif") {
          const url = attachment.getAttribute("url");
          let childImg = attachment.querySelector('img');
          let parentFigure = attachment.querySelector('figure');
          childImg.setAttribute("src", url);
          childImg.style.setProperty("box-shadow", "5px 9px 15px 5px rgba(0.1, 0.1, 0.1, 0.1)");
          if (!window.utils.weMobile) {
            parentFigure.style.setProperty("padding", "0 10% 0 10%", "important")
          }
        }
        if (contentType === "video/mp4") {
          const url = attachment.getAttribute("url");
          let childImg = attachment.querySelector('img');
          childImg.remove();
          let videoEl = document.createElement('video');
          let sourceEl = document.createElement('source');
          videoEl.setAttribute("width", "80%");
          videoEl.setAttribute("height", "auto");
          videoEl.setAttribute("controls", "");
          videoEl.setAttribute("autoPlay", "");
          videoEl.setAttribute("loop", "");
          videoEl.style.setProperty("box-shadow", "5px 9px 15px 5px rgba(0.1, 0.1, 0.1, 0.1)");
          sourceEl.setAttribute("src", url);
          sourceEl.setAttribute("type", "video/mp4");
          videoEl.append(sourceEl);
          attachment.querySelector('figure').append(videoEl);
        }
      })
    },

    init: function() {
      this.showPostBody = document.querySelector('#show-post-body') ? document.querySelector('#show-post-body') : null;
      this.postContainer = document.querySelector('.post-container') ? document.querySelector('.post-container') : null;
      this.setupFullScreen();
      this.setupTags();
      this.setupCancelButtons();
      this.highlightInvalidInputs();
      this.replaceUrlForAnimatedElements();
    }

  };

  posts.init();
  window.utils.posts = posts;

  
}

document.addEventListener("DOMContentLoaded", setupPosts);