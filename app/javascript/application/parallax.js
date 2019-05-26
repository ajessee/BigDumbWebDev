function setupSvg () {
  testSvg = {
    img: document.querySelector('#big-dumb-web-wev-projects-svg'),
    contain: document.querySelector('#projects-parallax-container'),
    attachToBack: function () {
      let encoded = window.btoa(this.img);
      this.contain.style.background = `url(${this.img})`;
      this.img.remove();
    } 
  }
  
  window.svg = testSvg;
}


document.addEventListener("DOMContentLoaded", setupSvg);
