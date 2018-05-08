const getIcons = () => {
  const iconNames = ['projects', 'resources', 'blog', 'github', 'twitter', 'linkedin'];

  const grow = (e) => {
    let parentHeight = e.target.closest('#about-me-nav').offsetHeight;
    e.target.style.fontSize = '6em';
    e.target.closest('#about-me-nav').style.height = parentHeight + 'px';
  }

  const shrink = (e) => {
    e.target.style.fontSize = '5em';
  }
  
  iconNames.forEach((name) => {
    let element = document.querySelector('#' + name + '-icon').children[1];
    element.addEventListener('mouseenter', grow);
    element.addEventListener('mouseleave', shrink);
  });
}

document.addEventListener("DOMContentLoaded", getIcons);
