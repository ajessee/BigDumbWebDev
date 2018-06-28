const loadnumberGuesser = () => {
  if (document.querySelector('#ng-project-container')) {
    setNGVariables();
  };
}

const setNGVariables = () => {
  ng = {};

  ng.storedMin = sessionStorage.getItem('ng-min');
  ng.storedMax = sessionStorage.getItem('ng-max');
  ng.storedGuess = sessionStorage.getItem('ng-guess');
  ng.min = ng.storedMin ? parseInt(ng.storedMin) : 1;
  ng.max = ng.storedMax ? parseInt(ng.storedMax) : 100;
  ng.guessesLeft = ng.storedGuess ? parseInt(ng.storedGuess) : 5;
  ng.allGuesses = [];
  ng.UIcontainer = document.getElementById('ng-container');
  ng.UIsettingsBtn = document.getElementById('ng-settings-btn');
  ng.UIsettings = document.getElementById('ng-settings');
  ng.UIsettingsSave = document.getElementById('ng-settings-save-btn');
  ng.UIhint = document.getElementById('ng-hint-btn');
  ng.UImin = document.getElementById('ng-min-num');
  ng.UIsetMin = document.getElementById('ng-set-min');
  ng.UImax = document.getElementById('ng-max-num');
  ng.UIsetMax = document.getElementById('ng-set-max');
  ng.UIsetGuesses = document.getElementById('ng-set-guesses');
  ng.UIguessInput = document.getElementById('ng-guess-input');
  ng.UIguessBtn = document.getElementById('ng-guess-btn');
  ng.UImessage = document.getElementById('ng-message');
  ng.UIyodaStart = document.getElementById('ng-yoda-start');
  ng.UIyodaTryAgain = document.getElementById('ng-yoda-try-again');
  ng.UIyodaLose = document.getElementById('ng-yoda-lose');
  ng.UIyodaWin = document.getElementById('ng-yoda-win');
  ng.UIyodaAll = document.querySelectorAll('.ng-yoda-images');
  ng.UImin.textContent = ng.min;
  ng.UImax.textContent = ng.max;

  ng.setMessage = (msg, color) => {
    ng.UImessage.style.color = color;
    ng.UImessage.textContent = msg;
  }

  ng.gameOver = (won, msg) => {
    let color;
    won ? color = 'green' : color = 'red';
    ng.UIguessInput.disabled = true;
    ng.UIguessInput.style.borderColor = color;
    ng.UImessage.style.color = color;
    ng.setMessage(msg)
    ng.UIguessBtn.value = 'Try Again';
    ng.UIguessBtn.className += 'ng-play-again';
  }

  ng.getRandomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  ng.winningNum = ng.getRandomNum(ng.min, ng.max);

  ng.UIcontainer.addEventListener('mousedown', function (e) {
    if (e.target.className === 'ng-play-again') {
      window.location.reload();
    }
  })

  ng.UIsettingsBtn.addEventListener('click', function (e) {
    if (this.className === 'ng-settings-cancel') {
      this.classList.replace('ng-settings-cancel', 'ng-settings-set');
      ng.UIsettings.style.display = 'none';
      ng.UIyodaStart.style.display = 'flex';
      ng.UIsettingsBtn.value = 'Settings';
      return;
    } else if (e.target.className === 'ng-settings-set') {}
    this.classList.replace('ng-settings-set', 'ng-settings-cancel');
    this.value = 'Cancel';
    ng.UIyodaAll.forEach(function (yoda) {
      yoda.style.display = 'none';
    })
    ng.UIsettings.style.display = 'grid';
    return;
  })

  ng.UIsettingsSave.addEventListener('click', function (e) {
    sessionStorage.setItem('ng-min', ng.UIsetMin.value);
    sessionStorage.setItem('ng-max', ng.UIsetMax.value);
    sessionStorage.setItem('ng-guess', ng.UIsetGuesses.value);
    window.location.reload();
  })

  ng.UIhint.addEventListener('click', function (e) {
    let hint;
    let lessThanGuesses = ng.allGuesses.filter((g)=>{return g < ng.winningNum}).sort((a,b) => {return a - b }).join(', ');
    let greaterThanGuesses = ng.allGuesses.filter((g)=>{return g > ng.winningNum}).sort((a,b) => {return a - b }).join(', ');
    hint = `${lessThanGuesses ? lessThanGuesses + ' < ' : ''} ? ${greaterThanGuesses ? ' < ' + greaterThanGuesses : ''}`;
    ng.setMessage(hint, 'orange');
    this.style.display = 'none';
  })

  ng.UIguessBtn.addEventListener('click', function () {
    let guess = parseInt(ng.UIguessInput.value);
    ng.allGuesses.push(guess);
    if (isNaN(guess) || guess < ng.min || guess > ng.max) {
      ng.setMessage(`Follow instructions, you must. Enter a number between ${ng.min} and ${ng.max}`, 'red');
      return;
    }
    if (guess === ng.winningNum) {
      ng.UIyodaAll.forEach(function (yoda) {
        yoda.style.display = 'none';
      })
      ng.UIyodaWin.style.display = 'flex';
      ng.UIhint.style.display = 'none';
      ng.gameOver(true, `Chosen well my young padawan, you have! The correct answer, ${ng.winningNum} is. Yeesssssss.`)
    } else {
      ng.guessesLeft -= 1;
      if (!ng.guessesLeft) {
        ng.UIyodaAll.forEach(function (yoda) {
          yoda.style.display = 'none';
        })
        ng.UIyodaLose.style.display = 'flex';
        ng.UIhint.style.display = 'none';
        ng.gameOver(false, `Out of guesses, you are. The right answer, ${ng.winningNum} was. Try again!`)
      } else {
        ng.UIyodaAll.forEach(function (yoda) {
          yoda.style.display = 'none';
        })
        ng.UIyodaTryAgain.style.display = 'flex';
        ng.UIguessInput.style.borderColor = 'red';
        ng.UIguessInput.value = '';
        let pluralize;
        ng.guessesLeft === 1 ? pluralize = 'try' : pluralize = 'tries';
        ng.setMessage(`The correct answer ${guess} is not. ${ng.guessesLeft} ${pluralize} left, you have.`, 'red');
        ng.UIhint.style.display = 'block';
      }
    }
  })
  window.projects.numberGuesser = ng;
}

document.addEventListener("DOMContentLoaded", loadnumberGuesser);