const fadeIn = (array) => {
  console.log("DOM loaded and parsed");

  const fadeElements = [['fade-in-big', 'bigDumbWebDev'], ['fade-in-dumb', 'questionMark'], ['fade-in-web', 'computer'], ['fade-in-dev', 'redX']];
  
  fadeElements.forEach((element, index, array) => {
    let titleEl = document.querySelector('#' + element[0]);
    let imageEl = document.querySelector('#' + element[1]);
    let interv = (index + 1) * 1000;
    setTimeout(function () {
      titleEl.style.opacity = 1;
      imageEl.style.visibility = 'visible';
    }, interv);
    
  })
};


document.addEventListener("DOMContentLoaded", fadeIn);

let tempScrollY = 0;

// window.onscroll = () => {
//   const fadeName = document.querySelector("#fade-in-name");
//   const fadeTitle = document.querySelector("#fade-in-title");
//   const fadeBackground = document.querySelector("#background-image-container");
//   let scrollingDown;

//   (window.scrollY > tempScrollY) ? scrollingDown = true : scrollingDown = false;
//   tempScrollY = window.scrollY;

//   if (window.scrollY > 50 && window.scrollY < 99 && scrollingDown) {
//     fadeName.style.transition = 'opacity 1.5s'
//     fadeTitle.style.transition = 'opacity 1.5s'
//     fadeBackground.style.transition = 'opacity 1s'
//     fadeName.style.opacity = 0;
//     fadeTitle.style.opacity = 0;
//     fadeBackground.style.opacity = 0.8;
//   } else if (window.scrollY > 50 && window.scrollY < 99 && !scrollingDown) {
//     fadeName.style.transition = 'opacity 1.5s'
//     fadeTitle.style.transition = 'opacity 1.5s'
//     fadeName.style.opacity = 1;
//     fadeTitle.style.opacity = 1;
//     fadeBackground.style.opacity = 1;
//   }
//   else if (window.scrollY > 100  && window.scrollY < 199 && scrollingDown) {
//     fadeBackground.style.opacity = 0.7;
//   }
//   else if (window.scrollY > 100  && window.scrollY < 199  && !scrollingDown) {
//     fadeBackground.style.opacity = 0.8;
//   }
//   else if (window.scrollY > 200 && window.scrollY < 399 && scrollingDown) {
//     fadeBackground.style.opacity = 0.6;
//   }
//   else if (window.scrollY > 200 && window.scrollY < 399 && !scrollingDown) {
//     fadeBackground.style.opacity = 0.7;
//   }

// }