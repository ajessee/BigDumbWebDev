// In your custom js file, for example:
// /app/javascript/utils/trix.js
const trixOnEditorReady = () => {
  trixAddAttachmentButtonToToolbar();
};

const trixAddAttachmentButtonToToolbar = () => {
  let trixBlockButtons = document.querySelector(".trix-button-group--block-tools");
  const buttonHTML = `
      <button
        type="button"
        class="trix-button trix-button--icon trix-button--icon-attach-files"
        data-trix-action="x-attach" title="Attach Files"
        tabindex="-1"
      >Attach Files</button>
    `;
  trixBlockButtons.innerHTML += buttonHTML;

  document.querySelector(".trix-button--icon-attach-files")
    .addEventListener("click", trixAddAttachment)
};

const trixAddAttachment = () => {
  const fileInput = document.createElement("input");

  fileInput.setAttribute("type", "file");
  fileInput.setAttribute("accept", ".jpg, .png, .gif");
  fileInput.setAttribute("multiple", "");

  fileInput.addEventListener("change", () => {
    const {files} = fileInput;
    Array.from(files).forEach(insertAttachment)
  });

  fileInput.click()
};

const insertAttachment = (file) => {
  const trixEditor = document.querySelector("trix-editor").editor;
  trixEditor.insertFile(file);
};

document.addEventListener("DOMContentLoaded", function() {
  if (document.querySelector('trix-toolbar')) {
    trixOnEditorReady();
  }
});