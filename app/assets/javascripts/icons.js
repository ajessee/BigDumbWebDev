const getIcons = () => {
  const iconNames = ['projects', 'resources', 'blog', 'github', 'twitter', 'linkedin'];

  const grow = (e) => {
    let parentHeight = e.target.closest('#about-me-nav').offsetHeight;
    e.target.children[1].children[0].setAttribute("transform", "scale(1.3)");
    e.target.closest('#about-me-nav').style.height = parentHeight + 'px';
  }

  const shrink = (e) => {
    e.target.children[1].children[0].setAttribute("transform", "scale(1)");
  }

  const scrollTo = (e) => {
    let strSpliceIndex = e.target.closest('span').id.search('-');
    let name = e.target.closest('span').id.slice(0, strSpliceIndex);
    document.querySelector('#' + name +'-container').scrollIntoView({
      behavior: 'smooth'
    });
  }
  
  iconNames.forEach((name) => {
    let element = document.querySelector('#' + name + '-icon');
    element.addEventListener('mouseenter', grow);
    element.addEventListener('mouseleave', shrink);
    if (name === 'projects' || name === 'resources' || name === 'blog') {
      element.addEventListener('click', scrollTo);
    }
  });

}

document.addEventListener("DOMContentLoaded", getIcons);
