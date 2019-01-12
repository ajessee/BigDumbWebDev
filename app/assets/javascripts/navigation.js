const setUpNav = () => {

  const iconNames = ['projects', 'resources', 'blog', 'github', 'twitter', 'linkedin'];

  // make sure we are on main page, so we don't run unneccesary javascript on any subpages
  if (document.querySelector('#about-me-container')) {

  console.log("navigation.js");

  const navbar = document.querySelector("#main-nav");
  const navbarOffsetTop = navbar.offsetTop;
  const navbarOffsetHeight = navbar.offsetHeight;

  const grow = (e) => {
    e.target.children[1].children[0].setAttribute("transform", "scale(1.3)");
  }

  const shrink = (e) => {
    e.target.children[1].children[0].setAttribute("transform", "scale(1)");
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

    let scrollingDown;
    let tempScrollY = 0;

    (window.scrollY > tempScrollY) ? scrollingDown = true : scrollingDown = false;

    if (window.scrollY >= navbarOffsetTop) {
      navbar.classList.add("navbar-fixed");
    }
    else if (window.scrollY <= navbarOffsetTop) {
      navbar.classList.remove("navbar-fixed");
    }
  }
  
  iconNames.forEach((name) => {
    let element = document.querySelector('#' + name + '-icon');
    let mobileView = window.matchMedia('(max-width : 767px)').matches;
    if (!mobileView) {
      element.addEventListener('mouseenter', grow);
      element.addEventListener('mouseleave', shrink);
    }
    if (name === 'projects' || name === 'resources' || name === 'blog') {
      element.addEventListener('click', scrollTo);
    }
  });
  }
}

document.addEventListener("DOMContentLoaded", setUpNav);
