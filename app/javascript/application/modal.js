import { isAbsolute } from "path";

const setUpModal = () => {

  console.log("modal.js");

  const mainBody = document.querySelector("#main-body-section");
  const modal = document.querySelector(".modal");
  const modalContent = document.querySelector(".modal-content");
  

  const modalOn = () => {
    modal.style.display = "block";
    modalContent.style.display = "block";
    mainBody.classList.remove("modalUnblur");
    mainBody.classList.add("modalBlur");
    mainBody.style.overflow = "hidden";
    mainBody.style.position = "absolute";
    modalContent.classList.add("grow");
    if (modalContent.classList.contains("shrink")) {
      modalContent.classList.remove("shrink");
    }
  }

  const modalOff = () => {
    let closeModal = (e) => {
      if (e.animationName === "shrink") {
        mainBody.classList.remove("modalBlur");
        
        mainBody.style.overflow = "";
        mainBody.style.position = "";
        modal.style.display = "none";
        modalContent.style.display = "none";
      }
    }
    modalContent.classList.remove("grow");
    modalContent.addEventListener("webkitAnimationEnd", closeModal);
    mainBody.classList.add("modalUnblur");
    modalContent.classList.add("shrink");
  }

  window.modalOn = modalOn;
  window.modalOff = modalOff;
}

document.addEventListener("DOMContentLoaded", setUpModal);