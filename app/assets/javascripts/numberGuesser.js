const loadnumberGuesser = () => {
  if (document.querySelector('#ng-project-container')){
    setNGVariables();
  };
}

const setNGVariables = () => {
  ng = {};

  ng.min = 1;
  ng.max = 10;
  ng.guessesLeft = 3;

  ng.UIcontainer = document.getElementById('ng-container');
  ng.UImin = document.getElementById('ng-min-num');
  ng.UImax = document.getElementById('ng-max-num');
  ng.UIguessInput = document.getElementById('ng-guess-input');
  ng.UIguessBtn = document.getElementById('ng-guess-btn');
  ng.UImessage = document.getElementById('ng-message');
  ng.UIyodaStart = document.getElementById('ng-yoda-start');
  ng.UIyodaTryAgain = document.getElementById('ng-yoda-try-again');
  ng.UIyodaLose = document.getElementById('ng-yoda-lose');
  ng.UIyodaWin = document.getElementById('ng-yoda-win');
  ng.UIyodaAll = document.querySelectorAll('.ng-yoda-images');
  ng.UIhint = document.getElementById('ng-hint-btn');

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

  ng.UIcontainer.addEventListener('mousedown', function(e){
    if(e.target.className === 'ng-play-again') {
      window.location.reload();
    }
  })

  ng.UIhint.addEventListener('click', function(e){
    if(e.target.className === 'ng-play-again') {
      window.location.reload();
    }
  })

  ng.UIguessBtn.addEventListener('click', function(){
    let guess = parseInt(ng.UIguessInput.value);

    if (isNaN(guess) || guess < ng.min || guess > ng.max) {
      ng.setMessage(`Follow instructions, you must. Enter a number between ${ng.min} and ${ng.max}`, 'red');
      return;
    }

    if (guess === ng.winningNum) {
      ng.UIyodaAll.forEach(function(yoda){
        yoda.style.display = 'none';
      })
      ng.UIyodaWin.style.display = 'block';
      ng.gameOver(true, `Chosen well my young padawan, you have! The correct answer, ${ng.winningNum} is. Yeesssssss.`)
    }
    else {
      ng.guessesLeft -=1;

      if (!ng.guessesLeft) {
        ng.UIyodaAll.forEach(function(yoda){
          yoda.style.display = 'none';
        })
        ng.UIyodaLose.style.display = 'block';
        ng.gameOver(false, `Out of guesses, you are. The right answer, ${ng.winningNum} was. Try again! Hmmmmmm.`)
      }
      else {
        ng.UIyodaAll.forEach(function(yoda){
          yoda.style.display = 'none';
        })
        ng.UIyodaTryAgain.style.display = 'block';
        ng.UIguessInput.style.borderColor = 'red';
        ng.UIguessInput.value = '';
        let pluralize;
        ng.guessesLeft === 1 ? pluralize = 'try': pluralize = 'tries';
        ng.setMessage(`The correct answer ${guess} is not. ${ng.guessesLeft} ${pluralize} left, you have.`, 'red');
      }
    }
  })
}

document.addEventListener("DOMContentLoaded", loadnumberGuesser);