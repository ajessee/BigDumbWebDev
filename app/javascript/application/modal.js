const setUpModal = () => {

  console.log("Loading Modal Module");

  const modal = {

    mainBody: document.querySelector("#main-body-container"),
    modalDiv: document.querySelector("#modal"),
    overlay: document.querySelector("#overlay"),
    isModalOpen: false,
    modalArray: [],

    createNewModalElements: () => {
      let modalContent = document.createElement('div');
      let closeButton = document.createElement('button');
      let closeButtonIcon = document.createElement('i');
      modalContent.setAttribute('class', 'modal-content');
      modalContent.setAttribute('draggable', 'true');
      modalContent.addEventListener('dragstart', window.utils.dragAndDrop.drag_start,false);
      closeButton.setAttribute('title', 'Close');
      closeButton.setAttribute('class', 'close-modal all-close');
      closeButtonIcon.setAttribute('class', 'fas fa-times fa-2x');
      closeButtonIcon.setAttribute('aria-hidden', 'true');
      closeButton.appendChild(closeButtonIcon);
      let elementsObject = {
        modalContent: modalContent,
        closeButton: closeButton
      }
      return elementsObject;
    },

    // The overlay, which is the modalContent's parent, has 8 rows and 8 columns
    openModal: function (display, borderRadius, rowStart, columnStart, rowSpan, columnSpan, subRows, subColumns, closeButton) {
      let elements = this.createNewModalElements();
      if (!this.isModalOpen) {
        this.modalDiv.style.display = "block";
        this.mainBody.classList.contains("modalUnblur") ? this.mainBody.classList.remove("modalUnblur") : null;
        this.mainBody.classList.add("modalBlur");
        this.mainBody.style.overflow = "hidden";
      }
      elements.modalContent.classList.contains("shrink") ? this.modalContent.classList.remove("shrink") : null;
      elements.modalContent.classList.add("grow");
      elements.modalContent.style.display = `${display}`;
      elements.modalContent.style.borderRadius = `${borderRadius}`;
      elements.modalContent.style.gridArea = `${rowStart} / ${columnStart} / span ${rowSpan} / span ${columnSpan}`;
      if (display === "grid" && subRows && subColumns) {
        elements.modalContent.style.gridTemplateRows = `repeat(${subRows}, 1fr)`;
        elements.modalContent.style.gridTemplateColumns = `repeat(${subColumns}, 1fr)`;
      }
      closeButton ? elements.modalContent.appendChild(elements.closeButton) : null;
      elements.modalContent.addEventListener("webkitAnimationEnd", this.animationDone);
      elements.closeButton.addEventListener("click", this.closeModal);
      this.overlay.appendChild(elements.modalContent);
      this.modalArray.push(elements.modalContent);
      this.isModalOpen = true;
      this.removeDrapAndDropFromInputs(elements.modalContent);
      return elements.modalContent;
    },

    removeDrapAndDropFromInputs: (modalContent) => {
      const update = function (mutationsList, observer) {
        for(var mutation of mutationsList) {
          if (mutation.type == 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType == 3) {
                const inputs = node.querySelectorAll('input').length ? node.querySelectorAll('input') : null;
                if (inputs) {
                  inputs.forEach(input => {
                    input.setAttribute('draggable', 'true');
                    input.addEventListener('dragstart', function(e) {
                      event.preventDefault();
                      event.stopPropagation()
                    })
                  })
                }
              }
            })
          }
      }
      };
      const config = { attributes: true, childList: true, subtree: true };
      const observer = new MutationObserver(update);
      observer.observe(modalContent, config);
    },

    closeModal: (e) => {
      let modalContent;
      if (e) {
        modalContent = e.target.closest('.modal-content');
      }
      let modalArray = window.utils.modal.modalArray;
      if (modalContent) {
        modalContent.classList.add("shrink");
      } else {
        window.utils.modal.programaticClick = true;
        modalArray[modalArray.length-1].querySelector('.all-close').click()
      }
      if (modalArray.length < 1) {
        modal.mainBody.classList.add("modalUnblur");
      }
      if (!window.utils.navigation.navMenuOpen) {
        window.utils.navigation.toggleNavButton(true);
      }
      
    },

    closeAllModals: function() {
      let modalArray = window.utils.modal.modalArray;
      if (modalArray.length > 0) {
        modalArray.forEach(function (modal) {
          modal.querySelector('.all-close').click()
        })
        modal.mainBody.classList.add("modalUnblur");
        this.isModalOpen = false;
      } 
    },

    animationDone: (e) => {
      let modalContent = e.target;
      let modalCloseButton = e.target.querySelector('.close-modal');
      let modalArray = window.utils.modal.modalArray;
      if (e.animationName === "shrink") {
        let idx = modalArray.findIndex(function(el){ return el === modalContent});
        modalArray.splice(idx, 1);
        modalArray.length > 0 ? window.utils.modal.isModalOpen = true : window.utils.modal.isModalOpen = false;
        modalContent.querySelector('.debug-panel') ? window.utils.debug.debugPanelOpen = false : null;
        if (modalArray.length < 1) {
          modal.mainBody.classList.remove("modalBlur");
          modal.mainBody.style.overflow = "";
          modal.mainBody.style.position = "";
          modal.modalDiv.style.display = "none";
        }
        modalContent.remove();
      } else if (e.animationName === "grow") {
        if (modalCloseButton) {
          modalCloseButton.style.display = "block";
        }
      }
    },

    clickOverlay: (e) => {
      if (e.target === overlay) {
        modal.closeModal(e);
      }
    }
  }
  modal.overlay.addEventListener("click", modal.clickOverlay);
  window.utils.modal = modal;
}
document.addEventListener("DOMContentLoaded", setUpModal);