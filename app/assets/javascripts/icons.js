const getIcons = () => {
  const iconNames = ['projects', 'resources', 'blog', 'github', 'twitter', 'linkedin'];

  const grow = (e) => {
    e.target.style.fontSize = '6em';
    e.target.parentElement.parentElement.style.marginBottom = "1.9%"
  }

  const shrink = (e) => {
    e.target.style.fontSize = '5em';
    e.target.parentElement.parentElement.style.marginBottom = "3%"
  }
  
  iconNames.forEach((name) => {
    let element = document.querySelector('#' + name + '-icon').children[1];
    element.addEventListener('mouseenter', grow);
    element.addEventListener('mouseleave', shrink);
  });
}

document.addEventListener("DOMContentLoaded", getIcons);
