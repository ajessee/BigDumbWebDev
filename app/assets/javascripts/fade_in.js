// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.


const scrollDown = (e) => {
  console.log(e.target);
  document.querySelector('#about-me-container').scrollIntoView({
    behavior: 'smooth'
  });
}

const fadeInHeaders = () => {
  const dropArrow = document.querySelector('.arrow');
  const fadeInName = document.querySelector("#fade-in-name");
  const fadeInTitle = document.querySelector("#fade-in-title");
  console.log("DOM fully loaded and parsed");
  setTimeout(function () {
    fadeInName.style.opacity = 1;
  }, 1000)
  setTimeout(function () {
    fadeInTitle.style.opacity = 1;
  }, 2000)
  dropArrow.addEventListener('click', scrollDown);
};

document.addEventListener("DOMContentLoaded", fadeInHeaders);

let tempScrollY = 0;

window.onscroll = function () {
  const fadeName = document.querySelector("#fade-in-name");
  const fadeTitle = document.querySelector("#fade-in-title");
  const fadeBackground = document.querySelector("#background-image-container");
  let scrollingDown;

  (window.scrollY > tempScrollY) ? scrollingDown = true : scrollingDown = false;
  tempScrollY = window.scrollY;

  if (window.scrollY > 50 && window.scrollY < 99 && scrollingDown) {
    fadeName.style.transition = 'opacity 1.5s'
    fadeTitle.style.transition = 'opacity 1.5s'
    fadeBackground.style.transition = 'opacity 1s'
    fadeName.style.opacity = 0;
    fadeTitle.style.opacity = 0;
    fadeBackground.style.opacity = 0.8;
    console.log('down 50')
  } else if (window.scrollY > 50 && window.scrollY < 99 && !scrollingDown) {
    fadeName.style.transition = 'opacity 1.5s'
    fadeTitle.style.transition = 'opacity 1.5s'
    fadeName.style.opacity = 1;
    fadeTitle.style.opacity = 1;
    fadeBackground.style.opacity = 1;
    console.log('up 50')
  }
  else if (window.scrollY > 100  && window.scrollY < 199 && scrollingDown) {
    fadeBackground.style.opacity = 0.7;
    console.log('down 100');
  }
  else if (window.scrollY > 100  && window.scrollY < 199  && !scrollingDown) {
    fadeBackground.style.opacity = 0.8;
    console.log('up 100')
  }
  else if (window.scrollY > 200 && window.scrollY < 399 && scrollingDown) {
    fadeBackground.style.opacity = 0.6;
    console.log('down 200');
  }
  else if (window.scrollY > 200 && window.scrollY < 399 && !scrollingDown) {
    fadeBackground.style.opacity = 0.7;
    console.log('up 200')
  }



}