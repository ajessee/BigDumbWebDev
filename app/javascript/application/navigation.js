const setUpNav = () => {

  console.log("navigation.js");

  const mainBodyContainer = document.querySelector("#main-body-container");
  const aboutMeContainer = document.querySelector("#about-me-container") ? document.querySelector("#about-me-container") : null;
  const navbar = document.querySelector("#main-nav");
  const htmlDoc = document.querySelector('html');
  const iconNames = ['projects', 'resources', 'blog', 'github', 'twitter', 'linkedin', 'home'];
  const iconImageContainers = document.querySelectorAll(".icon-image");
  const bdwdIcon = document.querySelector("#home-icon");
  let navbarOffsetTop = navbar.offsetTop;
  let navbarOffsetHeight = navbar.offsetHeight;
  let navbarShrunk = false;
  let mobileView = window.matchMedia('(max-width : 767px)').matches;

  // Used for scaling down the icons in the navbar when we make it fixed, or for pulsing the icons on hover.
  const iconScale = (event, element, scale, translate) => {
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

      } 
      else {
        event.target.querySelector(".icon-grow").setAttribute("transform", `scale(${scale})`);
      }
    } else if (element) {
      element.classList.contains('home') ? scale = "0.8" : null;
      element.setAttribute("transform", `scale(${scale}) translate(${translate})`);
    }
  }

  // Scroll to part of main page
  const scrollTo = (e) => {
    let strSpliceIndex = e.target.closest('div').id.search('-');
    let name = e.target.closest('div').id.slice(0, strSpliceIndex);
    document.querySelector('#' + name + '-container').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  // Scale up or down the icons in the navbar
  const scaleNavbar = (scale, translate) => {
    const allIcons = document.querySelectorAll(".icon-grow");
    allIcons.forEach(function (icon) {
        iconScale(null, icon, scale, translate)
    })
  }

  // Turn on/off icon labels. TODO: Add tooltips on hover.
  const toggleIconLabels = (isOn) => {
    iconImageContainers.forEach(function (container) {
      let label = container.querySelector('p');
      if (isOn) {
        label.classList.contains('tooltip-text') ? label.classList.remove('tooltip-text') : null;
        label.classList.add('icon-label');
      } else {
        label.classList.contains('icon-label') ? label.classList.remove('icon-label') : null;
        label.classList.add('tooltip-text');
      }
    })
  }

  // If we are on the main page, we use scrollIntoView API. If not, we add matching href to controller.
  const setupHrefsForIcons = (mainPage) => {
    iconNames.forEach((name) => {
    let element = document.querySelector('#' + name + '-icon');
    if (name === 'projects' || name === 'resources' || name === 'blog') {
      if (mainPage) {
        element.addEventListener('click', scrollTo);
      }
      else {
        // TODO: Undo this once resources and blog are setup
        name === "resources" || name === "blog" ? name = "" : null;
        element.querySelector("a").href = "/" + name;
      }
    }
    else if (name === "home") {
      if (mainPage) {
        element.addEventListener('click', function(){
          document.querySelector('#main-body-container').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        });
      }
      else {
        element.querySelector("a").href = "/";
      }
    }
    });
  }

  // Add event listeners to pulse icon sizes on hover;
  iconNames.forEach((name) => {
    let element = document.querySelector('#' + name + '-icon');

    if (element.querySelector("svg") && !element.querySelector("svg").classList.contains("icon-grow")) {
      element.querySelector("svg").classList.add("icon-grow", "home");
    }

    if (!mobileView) {
      element.addEventListener('mouseenter', function (event) {
        iconScale(event, null, "1.3")
      });
      element.addEventListener('mouseleave', function (event) {
        iconScale(event, null, "1")
      });
    }

  });

  // Check if the page innerHeight + scroll Y is greater than the document body offsetHeight (if true, means there is not enough content to scroll).
  const atBottomOfPage = () => {
    return (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
  }

  const showNav = (mainPage) => {
    if (!mainPage) {
      navbar.style.display = "grid";
    }
    mainBodyContainer.append(navbar);
    navbar.classList.add("navbar-fixed");
    scaleNavbar("0.5", "0");
    toggleIconLabels(false);
    bdwdIcon.style.display = "block";
    navbarShrunk = true;
  }

  const hideNav = (mainPage) => {
    if (!mainPage) {
      navbar.style.display = "none";
    }
    aboutMeContainer.append(navbar);
    navbar.classList.remove("navbar-fixed");
    scaleNavbar("1", "0");
    toggleIconLabels(true);
    bdwdIcon.style.display = "none";
    navbarShrunk = false;
  }


  const onScroll = (mainPage) => {
    let marker,
      delta;

    // This determines at what scrollY coordinate the nav will show / shrink. Conditional on main page or nah.
    if (mainPage) {
      marker = navbarOffsetTop;
      delta = navbarOffsetTop - navbarOffsetHeight;
    } else {
      marker = navbarOffsetHeight;
      delta = navbarOffsetHeight;
    }

    if (window.scrollY > marker && !navbarShrunk && !mobileView) {
      showNav(mainPage);
    } else if (window.scrollY < delta && navbarShrunk && !mobileView) {
      hideNav(mainPage);
    }
  }

  /* This is the entry point to establishing navigation behavior. On the main page, the nav is embedded in the 'about me' section; once a user scrolls past that point then the nav will be fixed to the top of the screen and the icons will be scaled down. On all other pages, we check to see if there is enough content to scroll. If so, we show the nav shortly after the user starts scrolling. Otherwise, we show the nav right away.
  */
  if (document.querySelector('#about-me-container')) {
    setupHrefsForIcons(true);
    document.addEventListener("scroll", function(e){
      onScroll(true);
    });
  } else {
    /* Fontawesome loads it's icons asyncronously, and aren't ready when DOMContentLoaded. They don't provide an event system to hook into, but they do change the class on the HTML document based on the current status of load. I'm using a mutation observer to 'listen' to when the complete class gets added, and at that point I check if we need to show the nav or add the scroll event listener.
    */
    const mutationCallback = (mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class' && mutation.target.classList.contains('fontawesome-i2svg-complete')) {
          if (atBottomOfPage()) {
            showNav(false);
          }
          else {
            navbar.style.display = "none";
            document.addEventListener("scroll", function (e) {
              onScroll(false);
            });
          }
        }
      }
    }

    const observer = new MutationObserver(mutationCallback);
    observer.observe(htmlDoc, {attributes: true})
    setupHrefsForIcons();
  }
}

document.addEventListener("DOMContentLoaded", setUpNav);