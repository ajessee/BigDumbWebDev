const setUpDebug = () => {
  if (event.target.location.pathname === '/scroll3d') return;

  console.info("Loading Debug Module");

  const debug = {
    // Check if elements exist, because if we are not in development enviornment (production), these elements will not be created.
    debugButton: document.querySelector('#debug-button-container'),
    debugPanel: document.querySelector('.debug-panel'),
    debugPanelOpen: false,
    openDebugPanel: (e) => {
      if (window.utils.debug.debugButton && window.utils.debug.debugPanel && !window.utils.debug.debugPanelOpen) {
        let modal;
        if (window.utils.mobileScreenDetected) {
          modal = window.utils.modal.openModal('block', '0%', 4, 1, 12, 14, null, null, true);
        } else {
          modal = window.utils.modal.openModal('block', '0%', 14, 2, 1, 14, null, null, true);
        }
        
        modal.appendChild(window.utils.debug.debugPanel);
        window.utils.debug.debugPanel.style.display = 'block';
        window.utils.debug.debugPanelOpen = true;
      }
    }
  };
  if (debug.debugButton) {
    debug.debugButton.addEventListener('click', debug.openDebugPanel)
  }
  window.utils.debug = debug;
}

document.addEventListener("DOMContentLoaded", setUpDebug);