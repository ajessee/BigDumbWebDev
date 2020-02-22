const setUpNav = () => {

  console.log("Loading Navigation Module");

  const nav = {
    mobileView: window.matchMedia('(max-width : 767px)').matches,
    prevScrollpos: window.pageYOffset,
    firstChromeAutoScroll: 2,

    onScroll: function (mainPage) {

        if (this.firstChromeAutoScroll) {
          this.firstChromeAutoScroll -= 1;
          return;
        }

        let currentScrollPos = window.pageYOffset;
        if (this.prevScrollpos > currentScrollPos) {
          this.navButtonContainer.style.top = "0";
        } else {
          this.navButtonContainer.style.top = "-20%";
        }
        this.prevScrollpos = currentScrollPos;

        if (mainPage) {
          if (currentScrollPos == 0){
            this.navButtonContainer.style.top = "-20%";
          } 
        }
    },

    slideInMenuToggle: function () {
      if (this.slideInMenu.classList.contains('menu-closed')) {
        this.slideInMenu.classList.remove('menu-closed');
        this.slideInMenu.style.boxShadow = '-7px 0px 22px 0px rgba(0,0,0,0.3)';
        this.closeNavMenuButton.style.display = 'block';
        if (window.utils.mobileScreenDetected) {
          document.body.style.top = `-${window.scrollY}px`;
          document.body.style.position = 'fixed';
        }
        this.navMenuOpen = true;
      } else {
        this.slideInMenu.classList.add('menu-closed');
        this.closeNavMenuButton.style.display = 'none';
        if (window.utils.mobileScreenDetected) {
          const scrollY = document.body.style.top;
          document.body.style.position = '';
          document.body.style.top = '';
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
        this.navMenuOpen = false;
      }
    },

    setupScrollTo: function (labelArr) {
      labelArr.forEach(label => {
        let button = document.querySelector(`#${label}-icon`);
        let container = document.querySelector(`#${label}-container`);
        button.addEventListener("click", function (e) {
          container.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        });
      });
    },

    toggleNavButton: function (show) {
      if (show) {
        this.navButtonContainer.style.top = "0";
      } else {
        this.navButtonContainer.style.top = "-20%";
      }
    },

    init: function (notNew) {
      let self = this;
      this.navButtonContainer = document.querySelector('#nav-button-container');
      this.slideInMenu = document.querySelector('#nav-slide-in-menu');
      this.closeNavMenuButton = document.querySelector('#close-nav-menu-button');
      this.aboutMeContainer = document.querySelector('#about-me-container') ? document.querySelector('#about-me-container') : null;
      this.httpErrorContainer = document.querySelector(".http-error-container") ? document.querySelector(".http-error-container") : null;
      this.slideInMenu.addEventListener("transitionend", function (e) {
        if (self.slideInMenu.classList.contains('menu-closed') && e.propertyName !== "filter") {
          self.slideInMenu.style.boxShadow = 'none';
        }
      });

      this.navButtonContainer.addEventListener("click", function (e) {
        self.navButtonContainer.style.transition = "left 0.3s";
        self.navButtonContainer.style.left = "-20%";
        self.slideInMenuToggle();
      });
      this.closeNavMenuButton.addEventListener("click", function (e) {
        self.navButtonContainer.style.transition = "left 0.5s";
        self.navButtonContainer.style.left = "0";
          self.navButtonContainer.addEventListener("transitionend", function (e) {
            self.navButtonContainer.style.transition = "top 0.6s";
          }, {once: true})
        self.slideInMenuToggle();
      })

      if (this.aboutMeContainer) {
        this.setupScrollTo(['projects', 'blog']);
      } else if (this.httpErrorContainer) {
        return;
      }
      window.addEventListener("scroll", function (e) {
        self.onScroll(self.aboutMeContainer);
      });
      if (window.innerHeight === document.body.scrollHeight || document.body.scrollHeight <= window.innerHeight + 300 ) {
        self.navButtonContainer.style.transition = "none";
        this.toggleNavButton(true);
      }

    }
  };
  nav.init();
  // If we've redirected a user to the root path with login === true params, click the login link.
  if (document.querySelector("#nav-menu-login") && window.utils.getUrlVars().login === "true") {
    document.querySelector("#nav-menu-login a").click();
  }

  window.utils.navigation = nav;
}

document.addEventListener("DOMContentLoaded", setUpNav);