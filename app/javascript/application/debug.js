const setUpDebug = () => {

  console.log("Loading Debug Module");

  const debug = {
    // Check if elements exist, because if we are not in development enviornment (production), these elements will not be created.
    debugButton: document.querySelector('#debug-button-container') ? document.querySelector('#debug-button-container') : null,
    debugPanel: document.querySelector('.debug-panel') ? document.querySelector('.debug-panel') : null,
    clonedNode: null,
    openDebugPanel: (e) => {
      if (window.utils.debug.debugButton && window.utils.debug.debugPanel) {
        let modal = window.utils.modal.openModal('block', '0%', 7, 3, 1, 4, null, null, true);
        if (!window.utils.debug.clonedNode) {
          modal.appendChild(window.utils.debug.debugPanel);
          window.utils.debug.clonedNode = window.utils.debug.debugPanel.cloneNode(true);
        }
        else {
          window.utils.debug.clonedNode = window.utils.debug.debugPanel.cloneNode(true);
          modal.appendChild(window.utils.debug.clonedNode);
          // window.utils.debug.clonedNode = null;
        }
        
        window.utils.debug.debugPanel.style.display = 'block';
      }
    }
  };
  debug.debugButton.addEventListener('click', debug.openDebugPanel)
  window.utils.debug = debug;

}

document.addEventListener("DOMContentLoaded", setUpDebug);