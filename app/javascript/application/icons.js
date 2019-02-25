const setUpIcons = () => {

  // TODO: Once I figure out what I want to do with users on the site, figure out the nav and then use this module to dynamically load icons.

  console.log("Loading Icon Module");

  const icons = {

    allIcons: [
      {
        name: 'projects',
        className: 'icon-grow fas fa-code fa-5x',
        href: null
      },
      {
        name: 'resources',
        className: 'icon-grow fas fa-list-ul fa-5x',
        href: null
      },
      {
        name: 'blog',
        className: 'icon-grow fas fa-bullhorn fa-5x',
        href: null
      },
      {
        name: 'github',
        className: 'icon-grow fab fa-github fa-5x',
        href: 'https://github.com/ajessee'
      },
      {
        name: 'twitter',
        className: 'icon-grow fab fa-twitter fa-5x',
        href: 'https://twitter.com/bigdumbwebdev'
      },
      {
        name: 'linkedin',
        className: 'icon-grow fab fa-linkedin-in fa-5x',
        href: 'https://www.linkedin.com/in/andrejessee/'
      },
      {
        name: 'home',
        className: '',
        href: null
      },
      {
        name: 'login',
        className: 'icon-grow fas fa-sign-in-alt fa-5x',
        href: null
      },
      {
        name: 'logout',
        className: 'icon-grow fas fa-sign-out-alt fa-5x',
        href: null
      },
      {
        name: 'profile',
        className: 'icon-grow fas fa-code fa-5x',
        href: null
      }
    ],

    aboutMeIconNames: ['projects', 'resources', 'blog', 'github', 'twitter', 'linkedin', 'home', 'login', 'logout'],
    fixedNavbarIconNames: ['projects', 'resources', 'blog', 'login', 'logout'],
    iconNames: ['projects', 'resources', 'blog', 'github', 'twitter', 'linkedin', 'home', 'login', 'logout'],
    bdwdIcon: document.querySelector("#home-icon"),
   
  }

  window.utils.icons = nav;
}

// document.addEventListener("DOMContentLoaded", setUpIcons);