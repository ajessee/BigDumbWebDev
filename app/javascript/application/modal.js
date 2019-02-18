const setUpModal = () => {

  console.log("Loading Modal Module");

  const modal = {

    mainBody: document.querySelector("#main-body-container"),
    modalDiv: document.querySelector("#modal"),
    modalContent: document.querySelector("#modal-content"),
    modalCloseButton: document.querySelector("#close-modal"),
    overlay: document.querySelector("#overlay"),
    // TODO: Setup method to indicate whether modal is open so that you can gracefully close that modal and open another one.

    // The overlay, which is the modalContent's parent, has 8 rows and 8 columns
    openModal: function (display, borderRadius, rowStart, columnStart, rowSpan, columnSpan, subRows, subColumns, closeButton) {
      this.modalContent.innerHTML = "";
      this.modalDiv.style.display = "block";
      this.mainBody.classList.contains("modalUnblur") ? this.mainBody.classList.remove("modalUnblur") : null;
      this.mainBody.classList.add("modalBlur");
      this.mainBody.style.overflow = "hidden";
      this.mainBody.style.position = "absolute";
      this.modalContent.classList.contains("shrink") ? this.modalContent.classList.remove("shrink") : null;
      this.modalContent.classList.add("grow");
      this.modalContent.style.display = `${display}`;
      this.modalContent.style.borderRadius = `${borderRadius}`;
      this.modalContent.style.gridArea = `${rowStart} / ${columnStart} / span ${rowSpan} / span ${columnSpan}`;
      if (display === "grid" && subRows && subColumns) {
        this.modalContent.style.gridTemplateRows = `repeat(${subRows}, 1fr)`;
        this.modalContent.style.gridTemplateColumns = `repeat(${subColumns}, 1fr)`;
      }
      closeButton ? this.modalContent.appendChild(this.modalCloseButton) : null;
    },

    closeModal: () => {
      modal.modalContent.classList.remove("grow");
      modal.mainBody.classList.add("modalUnblur");
      modal.modalContent.classList.add("shrink");
      modal.modalContent.innerHTML = "";
    },

    animationDone: (e) => {
      if (e.animationName === "shrink") {
        modal.mainBody.classList.remove("modalBlur");
        modal.mainBody.style.overflow = "";
        modal.mainBody.style.position = "";
        modal.modalDiv.style.display = "none";
        modal.modalContent.style.display = "none";
        modal.modalCloseButton.style.display = "none";
      } else if (e.animationName === "grow") {
        modal.modalCloseButton.style.display = "block";
      }
    },

    clickOverlay: (e) => {
      if (e.target === overlay) {
        modal.closeModal();
      }
    }
  }

  modal.modalContent.addEventListener("webkitAnimationEnd", modal.animationDone);
  modal.modalCloseButton.addEventListener("click", modal.closeModal);
  modal.overlay.addEventListener("click", modal.clickOverlay);

  window.utils.modal = modal;
}

document.addEventListener("DOMContentLoaded", setUpModal);