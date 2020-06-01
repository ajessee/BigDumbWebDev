const giveMeDadJokes = () => {

  if (event.target.location.pathname === '/scroll3d') return;

  const dadJokeContainer = document.getElementById('dad-joke-project-container');

  if (dadJokeContainer) {
    console.info('Loading Dad Jokes Module (for your entertainment)');

    const dadJokeSetup = document.getElementById('dad-joke-setup');
    const dadJokePunchline = document.getElementById('dad-joke-punchline');
    const newJokeButton = document.getElementById('dad-joke-hit-me');
    const rimShot = document.getElementById('dad-jokes-audio-player');

    const getNewJoke = function() {
      fetch('https://us-central1-dadsofunny.cloudfunctions.net/DadJokes/random/jokes', {
        method: 'GET',
        headers: {'Accept': 'application/json'}
      })
      .then(function (response) {
        return response.json();
      })
      .then((jokeObj) => {
        dadJokeSetup.innerHTML = jokeObj.setup;
        if (dadJokePunchline.innerHTML !== "") {
          dadJokePunchline.classList.remove('dad-joke-fade-in');
          void dadJokePunchline.offsetWidth;
          dadJokePunchline.classList.add('dad-joke-fade-in');
        }
        dadJokePunchline.innerHTML = jokeObj.punchline;
        
      })
      .catch((err) => {
        console.log(err);
      });
    }
    dadJokePunchline.addEventListener('animationend', function(){
      rimShot.play();
    })
    newJokeButton.addEventListener('click', getNewJoke);
    getNewJoke();
  }

    

    

   

};
document.addEventListener("DOMContentLoaded", giveMeDadJokes);
