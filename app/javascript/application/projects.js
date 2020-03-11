// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

function setProjects() {

  if (event.target.location.pathname === '/scroll3d') return;

  console.info("Loading Projects Module");

  const projects = {

    allProjectsContainer: document.getElementById('all-projects-container'),

    projectsIFrame: document.getElementById('scroll3d-iframe'),

    setupUrlSlider: function() {
      let sliderInput = document.querySelector('input#project_external_url');
      let externalUrlField = document.getElementById('new-project-url') || document.getElementById('edit-project-url');
      let checkboxInfo = document.getElementById('new-project-info-box') || document.getElementById('edit-project-info-box');

      sliderInput.addEventListener('change', function(e){
        if (e.target.checked) {
          externalUrlField.style.display = "block";
          checkboxInfo.style.display = "none";
        } else {
          externalUrlField.style.display = "none";
          checkboxInfo.style.display = "block";
        }
      })
    },

    checkUrlField: function() {
      let externalUrlField = document.getElementById('new-project-url') || document.getElementById('edit-project-url');
      let value = externalUrlField.querySelector('input').value
      if (value === "") {
        externalUrlField.style.display = "none";
      }
    },

    setUpProjectGrid: function() {
      const projectCards = document.querySelectorAll('.project-card');
      const numberOfCards = projectCards.length;
      const numberOfRows = Math.ceil(numberOfCards / 3);
  
      this.allProjectsContainer.style.setProperty('grid-template-rows', `repeat(${numberOfRows}, auto)`)
    },

    wakeSleepingHerokuProjects: function (iframe) {
      let mainWindow = window;
      let nyCycleLink = document.querySelector('#nycycle-link');
      let headUpLink = document.querySelector('#headup-link');
      if (iframe) {
        nyCycleLink = event.target.body.querySelector('#nycycle-link');
        headUpLink = event.target.body.querySelector('#headup-link');
        mainWindow = window.parent;
      } 
      const notifications = mainWindow.utils.notifications;

      if (nyCycleLink) {
        this.nyCycleLinkReady = false;
        // Ping server to wake up
        fetch('https://nycycle-1.herokuapp.com/', {
          method: 'GET',
          mode: 'no-cors'
        }).then(function(){
          this.nyCycleLinkReady = true;
        }.bind(this))
        // Setup notification to run if server is not ready
        nyCycleLink.addEventListener('click', function (e){
          if (window.utils.projects.nyCycleLinkReady) return;
          e.preventDefault();
          notifications.openNotification('alert', 'This will take a second...', `NYCycle is hosted on a free service, so it can take up to 10 seconds to load initially. Close this notification and we\'ll take you there`, 6000, true)
          .then(function() {
            mainWindow.location.assign(nyCycleLink.href);
          })
        });
      }

      
      if (headUpLink) {
        this.headUpLinkReady = false;
        // Ping server to wake up
        fetch('https://head-up.herokuapp.com/', {
          method: 'GET',
          mode: 'no-cors'
        }).then(function(){
          this.headUpLinkReady = true;
        }.bind(this))
        // Setup notification to run if server is not ready
        headUpLink.addEventListener('click', function (e){
          if (window.utils.projects.headUpLinkReady) return;
          e.preventDefault();
          notifications.openNotification('alert', 'This will take a second...', `Head Up is hosted on a free service, so it can take up to 10 seconds to load initially. Close this notification and we\'ll take you there`, 6000, true)
          .then(function() {
            mainWindow.location.assign(headUpLink.href);
          })
        });
      }
    },

    init: function() {
      if (this.allProjectsContainer) {
        this.setUpProjectGrid();
        this.wakeSleepingHerokuProjects();
      };

      if (event.target.location.pathname === '/scroll3d') {
        this.wakeSleepingHerokuProjects(true);
      }
      
    }
  };

  window.utils.projects = projects;
  projects.init();

}


document.addEventListener("DOMContentLoaded", setProjects);


