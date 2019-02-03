const setUpDebug = () => {

  console.log("debug.js");

  const debugButton = document.querySelector('#debug-button-container') ? document.querySelector('#debug-button-container') : null;
  const debugPanel = document.getElementById('debug-panel') ? document.getElementById('debug-panel') : null;
  
  
  if (debugButton && debugPanel) {
  
    const openDebugPanel = () => {
      window.utils.modal.modalOn('block', '0%', 7, 3, 1, 4);
      window.utils.modal.modalContent.appendChild(debugPanel);
      debugPanel.style.display = 'block';
    }
  
    debugButton.addEventListener('click', openDebugPanel)
  }
}

document.addEventListener("DOMContentLoaded", setUpDebug);