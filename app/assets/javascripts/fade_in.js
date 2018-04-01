const fadeInHeaders = () => {
  console.log("DOM loaded and parsed");
  const fadeElementsArray = ['big', 'dumb', 'web', 'dev'];

  fadeElementsArray.forEach((element, index, array) => {
    let htmlEl = document.querySelector('#fade-in-' + element);
    let interv = (index + 1) * 1000;
    console.log(htmlEl);
    console.log(interv)
    setTimeout(function () {
      htmlEl.style.opacity = 1;
    }, interv);
  })
};

document.addEventListener("DOMContentLoaded", fadeInHeaders);

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