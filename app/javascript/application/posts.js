function setFullScreenToggle() {

  console.log("Setup Posts Full Screen Toggle");

  const posts = {

    init: function() {

      let self = this;

      this.postBody = document.querySelector('#show-post-body') ? document.querySelector('#show-post-body') : null;

      if (this.postBody) {

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
            if (self.postBody.requestFullscreen) {
              self.postBody.requestFullscreen();
            } else if (self.postBody.mozRequestFullScreen) {
              self.postBody.mozRequestFullScreen();
            } else if (self.postBody.webkitRequestFullscreen) {
              self.postBody.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (self.postBody.msRequestFullscreen) {
              self.postBody.msRequestFullscreen();
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
    }

  };

  posts.init();
  window.utils.posts = posts;

  
}

document.addEventListener("DOMContentLoaded", setFullScreenToggle);