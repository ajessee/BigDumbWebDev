/* 
  On DOM content loaded, check if number guesser project section is on page
  I do this so that I can reduce memory usage and only load parts of project JS that I need.
  I add numberGuesser object to window.projects namespace, and then all properties and
  methods to that object. I store DOM elements in the object and add event listeners to elements
  the user will interact with.

  Note - I am using arrow functions. I started because I wanted to be fancy and use them everywhere,
  until I realized that I shouldn't just do something because it is cool. One issue that arises is that arrow functions are not hoisted, so I have to put the event listener at the bottom of the page. Also, arrow functions don't have a 'this' object (unless you pass it one), so 'this' === window for all these functions. This isn't a 
  problem, because I am creating an object per each project, and attaching properties and methods to that. Need to think about whether I want to refactor to use regular ol' functions, or if I can keep like this. 7/22/18, don't see the need to refactor now.

  Todo:
    1. Set object to null on page reload to wipe from memory - is this needed?
    2. Refactor to ES6 classes
    3. Change from arrow functions to regular functions?
    4. Make images responsive for mobile
*/

const loadNumberGuesserProject = () => {
  console.log("Loading Number Guesser Project");
  ng = {};

  // Get stored data, UI elements
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

  // On mousedown for play again button, reload page
  ng.UIcontainer.addEventListener('mousedown', function (e) {
    if (e.target.className === 'ng-play-again') {
      window.location.reload();
    }
  })

  // Event listener for settings button. Toggle show/hide of settings
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

  // Allow user to set parameters for game
  ng.UIsettingsSave.addEventListener('click', function (e) {
    sessionStorage.setItem('ng-min', ng.UIsetMin.value);
    sessionStorage.setItem('ng-max', ng.UIsetMax.value);
    sessionStorage.setItem('ng-guess', ng.UIsetGuesses.value);
    window.location.reload();
  })

  // Give user hint. Cache and display relative position of current guess with all past guesses
  ng.UIhint.addEventListener('click', function (e) {
    let hint;
    let lessThanGuesses = ng.allGuesses.filter((g)=>{return g < ng.winningNum}).sort((a,b) => {return a - b }).join(', ');
    let greaterThanGuesses = ng.allGuesses.filter((g)=>{return g > ng.winningNum}).sort((a,b) => {return a - b }).join(', ');
    hint = `${lessThanGuesses ? lessThanGuesses + ' < ' : ''} ? ${greaterThanGuesses ? ' < ' + greaterThanGuesses : ''}`;
    ng.setMessage(hint, 'orange');
    this.style.display = 'none';
  })

  // Event listener for 'Submit button', logic for testing if guess if correct/incorrect, display different Yoda GIFs based on outcome 
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
  // Add number guesser object to project namespace
  window.projects.numberGuesser = ng;
}

document.addEventListener("DOMContentLoaded", function(){
  if (document.querySelector('#ng-project-container')) {
    loadNumberGuesserProject();
  };
});