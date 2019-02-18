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

document.addEventListener("DOMContentLoaded", setProjectsGrid);


