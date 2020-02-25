function setupPosts() {

  console.log("Setup Posts");

  const posts = {

    setupFullScreen: function () {

      let self = this;

      if (this.showPostBody) {

        this.applyFormattingToPreBlocks = function () {
          const preElements = this.showPostBody.querySelector('.trix-content').querySelectorAll('pre');
          preElements.forEach(function (preElement) {
            const regex = /(?!lang\-\\w\*)lang-\w*\W*/gm;
            const codeElement = document.createElement('code');
            if (preElement.childNodes.length > 1) {
              console.error('<pre> element contained nested inline elements (probably styling) and could not be processed. Please remove them and try again.')
            }
            let preElementTextNode = preElement.removeChild(preElement.firstChild);
            let language = preElementTextNode.textContent.match(regex);
            if (language) {
              language = language[0].toString().trim();
              preElementTextNode.textContent = preElementTextNode.textContent.replace(language, '');
              codeElement.classList.add(language, 'line-numbers');
            }
            codeElement.append(preElementTextNode)
            preElement.append(codeElement)
          })
        };

        this.toggleLink = document.querySelector('#post-toggle-fullscreen');

        this.toggleIcons = function (expand) {
          const expandIcon = document.querySelector('#expand-post-icon');
          const shrinkIcon = document.querySelector('#shrink-post-icon');
          if (expand) {
            expandIcon.style.display = "block";
            shrinkIcon.style.display = "none";
          } else {
            expandIcon.style.display = "none";
            shrinkIcon.style.display = "block";
          }
        };

        this.toggleLink.addEventListener('click', function (e) {
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
              self.showPostBody.style.paddingBottom = '3%';
              self.showPostBody.style.backgroundColor = 'aliceblue';
            } else if (self.showPostBody.mozRequestFullScreen) {
              self.showPostBody.mozRequestFullScreen();
              self.showPostBody.style.paddingBottom = '3%';
              self.showPostBody.style.backgroundColor = 'aliceblue';
            } else if (self.showPostBody.webkitRequestFullscreen) {
              self.showPostBody.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
              self.showPostBody.style.paddingBottom = '3%';
              self.showPostBody.style.backgroundColor = 'aliceblue';
            } else if (self.showPostBody.msRequestFullscreen) {
              self.showPostBody.msRequestFullscreen();
              self.showPostBody.style.paddingBottom = '3%';
              self.showPostBody.style.backgroundColor = 'aliceblue';
            }
          }
        });

        ['webkitfullscreenchange', 'mozfullscreenchange', 'fullscreenchange', 'msfullscreenchange'].forEach(
          eventName => document.addEventListener(eventName, function (e) {
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
        tagDropDown.addEventListener('change', function (e) {
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
            if (selectionText !== "Please Select") existingTagsInputArr.push(selectionText);
          }
          existingTagsInput.value = existingTagsInputArr.join(", ")
          existingTagsInput.dispatchEvent(new Event("change"));
        })
      }

    },

    highlightInvalidInputs: function () {
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

    redirectToPost: function (postID) {
      if (postID) {
        window.location.href = '/posts/' + postID;
      } else {
        window.location.href = '/posts'
      }
    },

    setupCancelButtons: function () {

      if (this.postContainer) {
        const editPostCancelButton = document.querySelector('#edit-post-cancel-button') ? document.querySelector('#edit-post-cancel-button') : null;
        const newPostCancelButton = document.querySelector('#new-post-cancel-button') ? document.querySelector('#new-post-cancel-button') : null;

        if (editPostCancelButton) {
          editPostCancelButton.addEventListener('click', function (e) {
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
            } else {
              window.utils.posts.redirectToPost(postId);
            }
          })
        }

        if (newPostCancelButton) {
          newPostCancelButton.addEventListener('click', function (e) {
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
            } else {
              window.utils.posts.redirectToPost();
            }
          })
        }
      }

    },

    // This is an ugly hack to work around the fact that I don't know how to configure active storage files/attachements to preview correctly
    replaceUrlForAnimatedElements: function () {
      let attachments = document.querySelectorAll('action-text-attachment');
      attachments.forEach(function (attachment) {
        let contentType = attachment.getAttribute("content-type");
        if (contentType === "image/gif") {
          const url = attachment.getAttribute("url");
          let childImg = attachment.querySelector('img');
          let parentFigure = attachment.querySelector('figure');
          childImg.setAttribute("src", url);
          childImg.style.setProperty("box-shadow", "5px 9px 15px 5px rgba(0.1, 0.1, 0.1, 0.1)");
          if (!window.utils.matches) {
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
    setPostCommentsCanvas: function () {
      this.showPostsContainer = document.querySelector('#show-post-container') ? document.querySelector('#show-post-container') : null;
      this.postCommentsCanvas = document.querySelector('#post-comments-canvas') ? document.querySelector('#post-comments-canvas') : null;
      if (this.showPostsContainer && this.postCommentsCanvas) {
        let containerWidth = this.showPostsContainer.offsetWidth;
        let containerHeight = this.showPostsContainer.offsetHeight;
        this.postCommentsCanvas.setAttribute("width", containerWidth);
        this.postCommentsCanvas.setAttribute("height", containerHeight);
      }
    },
    drawConnectingLinesBetweenComments: function () {
      if (this.postCommentsCanvas) {
        let allCommentWrappers = document.querySelectorAll('.show-comment-wrapper');
        let drawIt = function (wrapper) {
          let childWrappers = wrapper.querySelectorAll('.show-comment-wrapper.nested-wrapper') ? wrapper.querySelectorAll('.show-comment-wrapper.nested-wrapper') : null;
          if (childWrappers && childWrappers.length === 0) {
            return;
          } else if (childWrappers) {
            let selfContainer = wrapper.querySelector('.show-comment-container');
            let selfX = selfContainer.getBoundingClientRect().x;
            let selfAbsMiddle = selfContainer.offsetTop + (selfContainer.getBoundingClientRect().height / 2);
            for (let child of selfContainer.parentElement.children) {
              if (child.classList.contains('nested-wrapper')) {
                let childContainer = child.querySelector('.show-comment-container');
                let childX = childContainer.getBoundingClientRect().x;
                let childAbsMiddle = childContainer.offsetTop + (childContainer.getBoundingClientRect().height / 2);
                let ctx = window.utils.posts.postCommentsCanvas.getContext('2d');
                ctx.lineWidth = 5;
                // Horizontal line from middle of parent elemtent to 32 pixels to the left
                ctx.beginPath();
                ctx.strokeStyle = '#b2becf';
                // line start
                ctx.moveTo(selfX, selfAbsMiddle);
                // line end
                ctx.lineTo(selfX - 32, selfAbsMiddle);
                ctx.stroke();
                // Vertical line from parent horizontal line down to middle of child element
                ctx.beginPath();
                ctx.strokeStyle = '#b2becf';
                // Line start (30 pixels instead of 32 to get seamless juncture)
                ctx.moveTo(selfX - 30, selfAbsMiddle);
                // Line end
                ctx.lineTo(selfX - 30, childAbsMiddle);
                ctx.stroke();
                // Horizontal line from parent element X coordinate (left edge) to left edge of child element
                ctx.beginPath();
                ctx.strokeStyle = '#b2becf';
                ctx.moveTo(selfX - 32, childAbsMiddle);
                ctx.lineTo(childX, childAbsMiddle);
                ctx.stroke();
              }
            }
          }
        }
        allCommentWrappers.forEach(drawIt)
      }
    },

    init: function () {
      this.showPostBody = document.querySelector('#show-post-body') ? document.querySelector('#show-post-body') : null;
      this.postContainer = document.querySelector('.post-container') ? document.querySelector('.post-container') : null;
      this.setupFullScreen();
      this.setupTags();
      this.setupCancelButtons();
      this.highlightInvalidInputs();
      this.replaceUrlForAnimatedElements();
      if (this.showPostBody) {
        this.applyFormattingToPreBlocks();
      }
    }
  };

  window.utils.posts = posts;
  posts.init();
}

document.addEventListener("DOMContentLoaded", setupPosts);

window.onload = function () {
  window.utils.posts.setPostCommentsCanvas();
  window.utils.posts.drawConnectingLinesBetweenComments();
}

window.onresize = function () {
  window.utils.posts.setPostCommentsCanvas();
  window.utils.posts.drawConnectingLinesBetweenComments();
}