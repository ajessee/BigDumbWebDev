const setUpDebug = () => {

  console.log("debug.js");

  // Check if elements exist, because if we are not in development enviornment (production), these elements will not be created.
  const debugButton = document.querySelector('#debug-button-container') ? document.querySelector('#debug-button-container') : null;
  const debugPanel = document.getElementById('debug-panel') ? document.getElementById('debug-panel') : null;
  
  
  if (debugButton && debugPanel) {
  
    const openDebugPanel = () => {
      window.utils.modal.openModal('block', '0%', 7, 3, 1, 4, null, null, true);
      window.utils.modal.modalContent.appendChild(debugPanel);
      debugPanel.style.display = 'block';
    }
  
    debugButton.addEventListener('click', openDebugPanel)
  }
}

document.addEventListener("DOMContentLoaded", setUpDebug);