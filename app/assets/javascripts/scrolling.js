const setScrollingEventListeners = () => {
  const dropArrow = document.querySelector('.arrow');
  dropArrow.addEventListener('click', arrowScrollDown);
}

const arrowScrollDown = (e) => {
  console.log(e.target);
  document.querySelector('#about-me-container').scrollIntoView({
    behavior: 'smooth'
  });
}

document.addEventListener("DOMContentLoaded", setScrollingEventListeners);