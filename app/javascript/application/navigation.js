const setUpNav = () => {

  console.log("Loading Navigation Module");

  const nav = {

    mainBodyContainer: document.querySelector("#main-body-container"),
    htmlDoc: document.querySelector('html'),
    iconNames: ['projects', 'resources', 'blog', 'github', 'twitter', 'linkedin', 'home', 'login', 'logout'],
    navbarShrunk: false,
    mobileView: window.matchMedia('(max-width : 767px)').matches,

    // Used for scaling down the icons in the navbar when we make it fixed, or for pulsing the icons on hover.
    iconScale: (event, element, scale, translate) => {
      if (event) {

        let eventType = event.type;

        if (event.target.parentElement.classList.contains("navbar-fixed")) {

          let operators = {
            multiply: function (a, b) {
              return a * b
            },
            divide: function (a, b) {
              return a / b
            },
          }

          let parensRegex = /\((.*)\)/;
          let iconEl = event.target.querySelector(".icon-grow");
          let scaleAttrValue = iconEl.getAttribute("transform") ? iconEl.getAttribute("transform") : "scale(1)";
          let scaleValue = parseFloat(scaleAttrValue.match(parensRegex).pop());
          let newScaleValue;

          if (eventType === "mouseenter") {
            newScaleValue = operators.multiply(scaleValue, 1.2).toString();
          } else {
            newScaleValue = operators.divide(scaleValue, 1.2).toString();
          }

          if (!translate) {
            // I've taken translate out from current use case but will leave this here in case I want to reimplement in future
            iconEl.setAttribute("transform", `scale(${newScaleValue}) translate(0)`);
          } else {
            iconEl.setAttribute("transform", `scale(${newScaleValue})`);
          }

        } else {
          event.target.querySelector(".icon-grow").setAttribute("transform", `scale(${scale})`);
        }
      } else if (element) {
        element.classList.contains('home') ? scale = "0.8" : null;
        element.setAttribute("transform", `scale(${scale}) translate(${translate})`);
      }
    },

    // Scroll to part of main page
    scrollTo: (e) => {
      let strSpliceIndex = e.target.closest('div').id.search('-');
      let name = e.target.closest('div').id.slice(0, strSpliceIndex);
      document.querySelector('#' + name + '-container').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    },

    // Scale up or down the icons in the navbar
    scaleNavbar: function (scale, translate) {
      const allIcons = document.querySelectorAll(".icon-grow");
      allIcons.forEach(function (icon) {
        this.iconScale(null, icon, scale, translate)
      }.bind(this))
    },

    // Turn on/off icon labels. TODO: Add tooltips on hover.
    toggleIconLabels: function (isOn) {
      this.iconImageContainers.forEach(function (container) {
        let label = container.querySelector('p');
        if (isOn) {
          label.classList.contains('tooltip-text') ? label.classList.remove('tooltip-text') : null;
          label.classList.add('icon-label');
        } else {
          label.classList.contains('icon-label') ? label.classList.remove('icon-label') : null;
          label.classList.add('tooltip-text');
        }
      })
    },

    // If we are on the main page, we use scrollIntoView API. If not, we add matching href to controller.
    setupHrefsForIcons: function (mainPage) {
      this.iconNames.forEach(function (name) {
        let element = document.querySelector('#' + name + '-icon');
        if (name === 'projects' || name === 'resources' || name === 'blog') {
          if (mainPage) {
            element.addEventListener('click', this.scrollTo);
          } else {
            // TODO: Undo this once resources and blog are setup
            name === "resources" || name === "blog" ? name = "" : null;
            element.querySelector("a").href = "/" + name;
          }
        } else if (name === "home") {
          if (mainPage) {
            element.addEventListener('click', function () {
              document.querySelector('#main-body-container').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            });
          } else {
            element.querySelector("a").href = "/";
          }
        }
      }.bind(this));
    },

    // Check if the page innerHeight + scroll Y is greater than the document body offsetHeight (if true, means there is not enough content to scroll).
    atBottomOfPage: () => {
      return (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
    },

    showNav: function (mainPage) {
      if (!mainPage) {
        this.navbar.style.display = "grid";
        this.navbar.style.gridRow = "1";
      } else {
        this.mainBodyContainer.append(this.navbar);
      }
      this.navbar.classList.add("navbar-fixed");
      this.scaleNavbar("0.5", "0");
      this.toggleIconLabels(false);
      this.bdwdIcon.style.display = "block";
      this.logInOutIcon.style.display = "block";
      this.navbarShrunk = true;
    },

    hideNav: function (mainPage) {
      if (!mainPage) {
        this.navbar.style.display = "none";
      } else {
        this.navbar.style.gridRow = "2/3";
        this.aboutMeContainer.append(this.navbar);
      }
      this.navbar.classList.remove("navbar-fixed");
      this.scaleNavbar("1", "0");
      this.toggleIconLabels(true);
      this.bdwdIcon.style.display = "none";
      this.logInOutIcon.style.display = "none";
      this.navbarShrunk = false;
    },


    onScroll: function (mainPage) {
      let marker,
        delta;

      // This determines at what scrollY coordinate the nav will show / shrink. Conditional on main page or nah.
      if (mainPage) {
        marker = this.navbarOffsetTop;
        delta = this.navbarOffsetTop - this.navbarOffsetHeight;
      } else {
        marker = this.navbarOffsetHeight;
        delta = this.navbarOffsetHeight;
      }

      if (window.scrollY > marker && !this.navbarShrunk && !this.mobileView) {
        this.showNav(mainPage);
      } else if (window.scrollY < delta && this.navbarShrunk && !this.mobileView) {
        this.hideNav(mainPage);
      }
    },

    init: function () {
      let self = this;
      this.aboutMeContainer = document.querySelector("#about-me-container") ? document.querySelector("#about-me-container") : null;
      this.httpErrorContainer = document.querySelector(".http-error-container") ? document.querySelector(".http-error-container") : null;
      this.navbar = document.querySelector("#main-nav") ? document.querySelector("#main-nav") : null;
      if (this.navbar) {
        this.bdwdIcon = document.querySelector("#home-icon");
        this.logInOutIcon = document.querySelector("#login-icon") ? document.querySelector("#login-icon") : document.querySelector("#logout-icon");
        this.iconImageContainers = document.querySelectorAll(".icon-image");
        this.navbarOffsetTop = this.navbar.offsetTop;
        this.navbarOffsetHeight = this.navbar.offsetHeight;
      }
      // If we've refreshed the page, and scrollY is below the shrink nav marker, make sure that all of our icons are scaled correctly
      if (scrollY > this.navbarOffsetTop) {
        const mutationCallback2 = (mutationsList, observer) => {
          for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class' && mutation.target.classList.contains('fontawesome-i2svg-complete')) {
              this.scaleNavbar("0.5", "0");
            }
          }
        }
        const observer2 = new MutationObserver(mutationCallback2);
        observer2.observe(this.htmlDoc, {
          attributes: true
        })
      }
      /* This is the entry point to establishing navigation behavior. On the main page, the nav is embedded in the 'about me' section; once a user scrolls past that point then the nav will be fixed to the top of the screen and the icons will be scaled down. On all other pages, we check to see if there is enough content to scroll. If so, we show the nav shortly after the user starts scrolling. Otherwise, we show the nav right away.
       */
      if (this.aboutMeContainer) {
        this.setupHrefsForIcons(true);
        document.addEventListener("scroll", function (e) {
          self.onScroll(true);
        });
      } else if (this.httpErrorContainer) {
        return;
      } else {
        /* Fontawesome loads it's icons asyncronously, and aren't ready when DOMContentLoaded. They don't provide an event system to hook into, but they do change the class on the HTML document based on the current status of load. I'm using a mutation observer to 'listen' to when the complete class gets added, and at that point I check if we need to show the nav or add the scroll event listener.
         */
        const mutationCallback = (mutationsList, observer) => {
          for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class' && mutation.target.classList.contains('fontawesome-i2svg-complete')) {
              if (this.atBottomOfPage()) {
                this.showNav(false);
              } else {
                this.navbar.style.display = "none";
                document.addEventListener("scroll", function (e) {
                  self.onScroll(false);
                });
              }
            }
          }
        }

        const observer = new MutationObserver(mutationCallback);
        observer.observe(this.htmlDoc, {
          attributes: true
        })
        this.setupHrefsForIcons();
      }
      // Add event listeners to pulse icon sizes on hover;
      this.iconNames.forEach(function (name) {
        let element = document.querySelector('#' + name + '-icon');
        if (!element) {
          return
        };

        if (element.querySelector("svg") && !element.querySelector("svg").classList.contains("icon-grow")) {
          element.querySelector("svg").classList.add("icon-grow", "home");
        }

        if (!this.mobileView) {
          element.addEventListener('mouseenter', function (event) {
            self.iconScale(event, null, "1.3")
          });
          element.addEventListener('mouseleave', function (event) {
            self.iconScale(event, null, "1")
          });
        }
      });

    }
  }
  nav.init();
  // If we've redirected a user to the root path with login === true params, click the login link.
  if (document.querySelector("#login-icon") && window.utils.getUrlVars().login === "true") {
    document.querySelector("#login-icon a").click();
  }

  window.utils.navigation = nav;
}

document.addEventListener("DOMContentLoaded", setUpNav);