// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

const scrollDown = (e) => {
  console.log(e.target);
  document.querySelector('#about-me-container').scrollIntoView({ behavior: 'smooth' })
}
const fadeInHeaders = () => {

  console.log("DOM fully loaded and parsed");

  const fadeInName = document.querySelector("#fade-in-name");

  const fadeInTitle = document.querySelector("#fade-in-title");

  const dropArrow = document.querySelector('.arrow');
  
  setTimeout(function(){ 
    fadeInName.style.opacity = 1;
  }, 1000)

  setTimeout(function(){ 
    fadeInTitle.style.opacity = 1;
  }, 2000)

  // setTimeout(function(){ 
  //   dropArrow.style.opacity = 1;
  // }, 5000)

  dropArrow.addEventListener('click', scrollDown);

};


document.addEventListener("DOMContentLoaded", fadeInHeaders);

// $(window).scroll(function(){
//   $(".arrow").css("opacity", 1 - $(window).scrollTop() / 250); 
// //250 is fade pixels
// });


