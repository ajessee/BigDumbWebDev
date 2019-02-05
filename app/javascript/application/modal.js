import {
  isAbsolute
} from "path";

const setUpModal = () => {

  console.log("modal.js");

  const modal = {

    mainBody: document.querySelector("#main-body-section"),
    modalDiv: document.querySelector("#modal"),
    modalContent: document.querySelector("#modal-content"),
    modalCloseButton: document.querySelector("#close-modal"),
    overlay: document.querySelector("#overlay"),

    // The overlay, which is the modalContent's parent, has 8 rows and 8 columns
    modalOn: (display, borderRadius, rowStart, columnStart, rowSpan, columnSpan, subRows, subColumns, closeButton) => {
      modal.modalDiv.style.display = "block";
      modal.mainBody.classList.contains("modalUnblur") ? modal.mainBody.classList.remove("modalUnblur") : null;
      modal.mainBody.classList.add("modalBlur");
      modal.mainBody.style.overflow = "hidden";
      modal.mainBody.style.position = "absolute";
      modal.modalContent.classList.contains("shrink") ? modal.modalContent.classList.remove("shrink") : null;
      modal.modalContent.classList.add("grow");
      modal.modalContent.style.display = `${display}`;
      modal.modalContent.style.borderRadius = `${borderRadius}`;
      modal.modalContent.style.gridArea = `${rowStart} / ${columnStart} / span ${rowSpan} / span ${columnSpan}`;
      if (display === "grid" && subRows && subColumns) {
        modal.modalContent.style.gridTemplateRows = `repeat(${subRows}, 1fr)`;
        modal.modalContent.style.gridTemplateColumns = `repeat(${subColumns}, 1fr)`;
      }
      closeButton ? modal.modalContent.appendChild(modal.modalCloseButton) : null;
    },

    modalOff: () => {
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
        modal.modalOff();
      }
    }
  }

  modal.modalContent.addEventListener("webkitAnimationEnd", modal.animationDone);
  modal.modalCloseButton.addEventListener("click", modal.modalOff);
  modal.overlay.addEventListener("click", modal.clickOverlay);

  window.utils.modal = modal;
}

document.addEventListener("DOMContentLoaded", setUpModal);