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

      if (offsetHeight + boundingTop < 0) {
        this.navButtonContainer.style.display = "block";
      } else  {
        this.navButtonContainer.style.display = "none";
      }
    },

    slideInMenuToggle: function () {
      if (this.slideInMenu.classList.contains('menu-closed')) {
        this.slideInMenu.classList.remove('menu-closed');
        this.slideInMenu.style.boxShadow ='-7px 0px 22px 0px rgba(0,0,0,0.3)';
      } else {
        this.slideInMenu.classList.add('menu-closed');
        
      }
    },

    init: function (notNew) {
      let self = this;
      this.navButtonContainer = document.querySelector('#nav-button-container');
      this.slideInMenu = document.querySelector('#nav-slide-in-menu');
      this.aboutMeContainer = document.querySelector('#about-me-container') ? document.querySelector('#about-me-container') : null;
      this.httpErrorContainer = document.querySelector(".http-error-container") ? document.querySelector(".http-error-container") : null;
      this.slideInMenu.addEventListener("transitionend", function (e) {
        if (self.slideInMenu.classList.contains('menu-closed')) {
          self.slideInMenu.style.boxShadow = 'none';
        }
      });
     
      if (this.aboutMeContainer) {
        document.addEventListener("scroll", function (e) {
          self.onScroll(true);
        });
        this.navButtonContainer.addEventListener("click", function (e) {
          self.slideInMenuToggle();
        });
      
      } else if (this.httpErrorContainer) {
        return;
      } else {
       
      }

    }
  };
  nav.init();

  window.utils.navigation = nav;
}

document.addEventListener("DOMContentLoaded", setUpNav);