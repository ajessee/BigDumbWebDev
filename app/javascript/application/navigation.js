const setUpNav = () => {

  console.log("Loading Navigation Module");

  const nav = {
    mobileView: window.matchMedia('(max-width : 767px)').matches,

    onScroll: function (mainPage) {
      let offsetHeight,
          bounding,
          boundingTop;

      // This determines at what scrollY coordinate the nav will show / shrink. Conditional on main page or nah.
      if (mainPage) {
        offsetHeight = this.aboutMeContainer.offsetHeight;
        bounding = this.aboutMeContainer.getBoundingClientRect();
        boundingTop = bounding.top;
      } else {

      }

      if (offsetHeight + boundingTop < 100 && this.slideInMenu.classList.contains('menu-closed')) {
        this.navButtonContainer.style.display = "block";
      } else  {
        this.navButtonContainer.style.display = "none";
      }
    },

    slideInMenuToggle: function () {
      if (this.slideInMenu.classList.contains('menu-closed')) {
        this.slideInMenu.classList.remove('menu-closed');
        this.slideInMenu.style.boxShadow ='-7px 0px 22px 0px rgba(0,0,0,0.3)';
        this.navButtonContainer.style.display = 'none';
        this.closeNavMenuButton.style.display = 'block';
      } else {
        this.slideInMenu.classList.add('menu-closed');
        this.closeNavMenuButton.style.display = 'none';
        
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
          self.navButtonContainer.style.display = 'block';
        }
      });

      this.navButtonContainer.addEventListener("click", function (e) {
        self.slideInMenuToggle();
      });
      this.closeNavMenuButton.addEventListener("click", function(e){
        self.slideInMenuToggle();
      })
     
      if (this.aboutMeContainer) {
        this.setupScrollTo(['projects', 'blog']);
        document.addEventListener("scroll", function (e) {
          self.onScroll(true);
        });
      } else if (this.httpErrorContainer) {
        return;
      } else {
        this.navButtonContainer.style.display = "block";
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