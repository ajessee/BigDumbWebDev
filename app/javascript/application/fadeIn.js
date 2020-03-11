const fadeIn = (array) => {

  if (document.querySelector('#landing-page-container')) {

    if (event.target.location.pathname === '/scroll3d') return;

    console.info("Loading Landing Page Animations Module");

    const introElements = [
      ['fade-in-big', 'bigDumbWebDev'],
      ['fade-in-dumb', 'questionMark'],
      ['fade-in-web', 'computer'],
      ['fade-in-dev', 'redX']
    ];

    const angerElements = ['radioactive', 'bomb', 'fire', 'fist', 'angryFace']

    const morseCode = document.querySelector('#morseCode');

    const morseCodeChildren = [].slice.call(morseCode.children);

    const keyboard = document.querySelector('#keyboardKeys');

    const keyboardKeys = [].slice.call(keyboard.children);

    const greenCheck = document.querySelector('#greenCheck');

    const questionMark = document.querySelector('#questionMark');

    const dropArrow = document.querySelector('#arrow');

    const fadeInAnimationPromise = new Promise((resolve, reject) => {
      introElements.forEach((element, index, array) => {
        let titleEl = document.querySelector('#' + element[0]);
        let imageEl = document.querySelector('#' + element[1]);
        let interv = (index + 1) * 1000;
        setTimeout(() => {
          titleEl.style.opacity = 1;
          imageEl.style.visibility = 'visible';
          if (index === (array.length - 1)) {
            setTimeout(() => {
              questionMark.style.visibility = 'hidden';
              resolve();
            }, 1000)
          }
        }, interv);
      })
    })

    const flashRedX = () => {
      return new Promise((resolve, reject) => {
        morseCodeChildren.forEach((child) => {
          child.style.visibility = 'hidden';
        })
        keyboardKeys.forEach((child) => {
          child.style.fill = 'rgb(216, 216, 216)';
        })
        redX.style.visibility = 'visible';
        redX.style.animation = 'redXFlash linear 1s 3';
        angerElements.forEach((element, index, array) => {
          let angerEl = document.querySelector('#' + element);
          let interv = (index + 1) * 500;
          setTimeout(function () {
            angerEl.style.visibility = 'visible';
          }, interv)
        })
        setTimeout(() => {
          angerElements.forEach((element) => {
            let angerEl = document.querySelector('#' + element);
            angerEl.style.visibility = 'hidden';
          })
          resolve();
        }, 3000)
      })
    }

    const typeCode = () => {
      return new Promise((resolve, reject) => {
        redX.style.visibility = 'hidden';
        morseCodeChildren.forEach((element, index, array) => {
          let interv = (index + 1) * 200;
          let randomKey = keyboardKeys[Math.floor(Math.random() * keyboardKeys.length)]
          setTimeout(function () {
            element.style.visibility = 'visible';
            randomKey.style.fill = 'rgb(155, 155, 155)';
            if (index === (array.length - 1)) {
              setTimeout(() => {
                resolve();
              }, 500)
            }
          }, interv)
        })

      })
    }

    const flashGreenCheck = () => {
      return new Promise((resolve, reject) => {
        morseCodeChildren.forEach((child) => {
          child.style.visibility = 'hidden';
        })
        keyboardKeys.forEach((child) => {
          child.style.fill = 'rgb(216, 216, 216)';
        })
        greenCheck.style.visibility = 'visible';
        greenCheck.style.animation = 'flash linear 1s 1';
        setTimeout(() => {
          resolve();
        }, 1000)
      })
    }

    const arrowScrollDown = (e) => {
      document.querySelector('#about-me-container').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    const arrowAnimation = () => {
      return new Promise((resolve, reject) => {
        dropArrow.addEventListener('click', arrowScrollDown);
        dropArrow.style.opacity = '1';
        dropArrow.style.animation = 'drop 1.5s ease-out forwards';
        resolve();
      })
    }

    fadeInAnimationPromise.then(result => typeCode()).then(result => flashRedX()).then(result => typeCode()).then(result => flashGreenCheck()).then(result => arrowAnimation())
  }
};

document.addEventListener("DOMContentLoaded", fadeIn);

// let tempScrollY = 0;

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