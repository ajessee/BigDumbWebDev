const setUpNav = () => {

  const iconNames = ['projects', 'resources', 'blog', 'github', 'twitter', 'linkedin'];

  // make sure we are on main page, so we don't run unneccesary javascript on any subpages
  if (document.querySelector('#about-me-container')) {

  console.log("navigation.js");

  const navbar = document.querySelector("#main-nav");
  const navbarOffsetTop = navbar.offsetTop;
  const navbarOffsetHeight = navbar.offsetHeight;

  const iconScale = (event, element, scale, translate) => {
    if (event) {

      let eventType = event.type;

      if (event.target.parentElement.classList.contains("navbar-fixed")) {

        let operators = {
          multiply: function(a,b) {return a * b},
          divide: function(a,b) {return a / b},
        }

        let parensRegex = /\((.*)\)/;
        let iconEl = event.target.querySelector(".icon-grow");
        let scaleAttrValue = iconEl.getAttribute("transform");
        let scaleValue = parseFloat(scaleAttrValue.match(parensRegex).pop());

        let newScaleValue;
        if (eventType === "mouseenter") {
          newScaleValue = operators.multiply(scaleValue, 1.2).toString();
        }
        else {
          newScaleValue = operators.divide(scaleValue, 1.2).toString();
        }
        if (!translate) {
          iconEl.setAttribute("transform", `scale(${newScaleValue}) translate(50)`);
        }
        else {
          iconEl.setAttribute("transform", `scale(${newScaleValue})`);
        }
        
        
      }
      else{
        event.target.querySelector(".icon-grow").setAttribute("transform", `scale(${scale})`);
      }
    }
    else if (element) {
      element.setAttribute("transform", `scale(${scale}) translate(${translate})`);
    }
  }

  const scrollTo = (e) => {
    let strSpliceIndex = e.target.closest('div').id.search('-');
    let name = e.target.closest('div').id.slice(0, strSpliceIndex);
    document.querySelector('#' + name +'-container').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  window.onscroll = () => {

    const allIcons = document.querySelectorAll(".icon-grow");
    const allIconLabels = document.querySelectorAll(".icon-label");
    const bdwdIcon = document.querySelector("#bdwdIcon");

    const scaleNavbar = (scale, translate) => {
      allIcons.forEach(function(icon){
        iconScale(null, icon, scale, translate)
    })
    }

    const toggleIconLabels = (display) => {
      allIconLabels.forEach(function(label){
        label.style.display = display;
    })
    }

    if (window.scrollY > navbarOffsetTop) {
      navbar.classList.add("navbar-fixed");
      scaleNavbar("0.5", "50");
      toggleIconLabels("none");
      bdwdIcon.style.display = "block";
    }
    else if (window.scrollY < (navbarOffsetTop - navbarOffsetHeight)) {
      navbar.classList.remove("navbar-fixed");
      scaleNavbar("1", "0");
      toggleIconLabels("block");
      bdwdIcon.style.display = "none";
    }
  }
  
  iconNames.forEach((name) => {
    let element = document.querySelector('#' + name + '-icon');
    let mobileView = window.matchMedia('(max-width : 767px)').matches;
    if (!mobileView) {
      element.addEventListener('mouseenter', function(event){
        iconScale(event, null, "1.3")
      });
      element.addEventListener('mouseleave', function(event) {
        iconScale(event, null, "1")
      });
    }
    if (name === 'projects' || name === 'resources' || name === 'blog' || name === 'home') {
      element.addEventListener('click', scrollTo);
    }
  });
  }
}

document.addEventListener("DOMContentLoaded", setUpNav);
