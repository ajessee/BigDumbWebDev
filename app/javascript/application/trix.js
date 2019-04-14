const setUpTrixHelper = () => {
  console.log("Loading Trix Helper Module");

  const trix = {
    
    trixOnEditorReady: function() {
      this.trixAddAttachmentButtonToToolbar();
    },

    trixAddAttachmentButtonToToolbar: function() {
      let trixBlockButtons = document.querySelector(".trix-button-group--block-tools");
      let self = this;
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
        .addEventListener("click", self.trixAddAttachment)
    },

    trixAddAttachment: function() {
      const fileInput = document.createElement("input");
    
      fileInput.setAttribute("type", "file");
      fileInput.setAttribute("accept", ".jpg, .png, .gif");
      fileInput.setAttribute("multiple", "");
    
      fileInput.addEventListener("change", () => {
        const {files} = fileInput;
        Array.from(files).forEach(window.utils.trixHelper.insertAttachment)
      });
    
      fileInput.click()
    },

    insertAttachment: (file) => {
      const trixEditor = document.querySelector("trix-editor").editor;
      trixEditor.insertFile(file);
    },

    init: function() {
      if (document.querySelector('trix-toolbar')) {
        this.trixOnEditorReady();
      }
    }

  }
  trix.init();
  window.utils.trixHelper = trix;
}

document.addEventListener("DOMContentLoaded", setUpTrixHelper);