// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.


// Function to get number of current projects and adjust grid css accordingly to have right number of rows
// TODO: load projects dynamically from database

function setProjectsGrid() {
  console.log("Setup Projects Grid");

  const container = document.getElementById('all-projects-container');

  if (container) {

    const projectCards = document.querySelectorAll('.project-card');
    const numberOfCards = projectCards.length;
    const numberOfRows = Math.ceil(numberOfCards / 3);

    container.style.setProperty('grid-template-rows', `repeat(${numberOfRows}, auto)`)
  };
}

function setupProjectsUtils() {
  console.log("Setup Projects Utils");

  const projects = {
    setupUrlSlider: function() {
      let sliderInput = document.querySelector('input#project_external_url');
      let externalUrlField = document.getElementById('new-project-url');
      let checkboxInfo = document.getElementById('new-project-info-box');

      sliderInput.addEventListener('change', function(e){
        if (e.target.checked) {
          externalUrlField.style.display = "block";
          checkboxInfo.style.display = "none";
        } else {
          externalUrlField.style.display = "none";
          checkboxInfo.style.display = "block";
        }
      })
    }
  };

  window.utils.projects = projects;
}

document.addEventListener("DOMContentLoaded", setProjectsGrid);
document.addEventListener("DOMContentLoaded", setupProjectsUtils);


