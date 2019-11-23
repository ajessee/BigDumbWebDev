const setUpTrixHelper = () => {
  console.log("Loading Trix Helper Module");

  const trix = {
    
    trixOnEditorReady: function() {
      this.trixAddAttachmentButtonToToolbar();
      this.trixAddUnlineButtonToToolbar();
      // this.trixAddEmbedButtonToToolbar();
    },

    trixAddUnlineButtonToToolbar: function() {
      window.utils.Trix.config.textAttributes.underline = {
        style: { "textDecoration": "underline" },
        inheritable: true,
        parser: function(element) {
          var style = window.getComputedStyle(element);
          return style.textDecoration === "underline";
        }
      }
      let trixTextTools = document.querySelector(".trix-button-group--text-tools");
      let buttonHTML = '<button type="button" class="trix-button trix-button--icon trix-button--icon-underline" data-trix-attribute="underline" data-trix-action="underline" data-trix-key="u" title="Underline" tabindex="-1">Underline</button>'
      trixTextTools.children[1].insertAdjacentHTML("afterend", buttonHTML);  
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

    // TODO: When rails updates their action text to allow for static html attachments, add this back in
    // trixAddEmbedButtonToToolbar: function() {
    //   let trixLinkButtons = document.querySelector(".trix-dialog__link-fields .trix-button-group");
    //   let self = this;
    //   const inputHTML = `
    //         <button
    //         type="button"
    //         class="trix-button"
    //         id="embed-link-button"
    //         data-trix-action="x-embed" title="Embed Files"
    //         tabindex="-1"
    //       >Embed</button>
    //     `;
    //     trixLinkButtons.innerHTML += inputHTML;
    
    //     document.querySelector("#embed-link-button")
    //     .addEventListener("click", self.trixEmbedLink);
    // },

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

    // TODO: When rails updates their action text to allow for static html attachments, add this back in
    // trixEmbedLink: function(e) {
    //   const urlInput = document.querySelector(".trix-dialog__link-fields input");
    //   let embedLink = urlInput.value;
    //   let sgid = document.querySelector("#edit-post-content").getAttribute("data-sgid");
    //   let authenToken = document.querySelector('input[name="authenticity_token"]').value;
    //   // let embed = '<iframe width="420" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>'
    //   // let attachment = new window.utils.Trix.Attachment({sgid: sgid, content: embed})
    //   // let editor = document.querySelector('trix-editor').editor;
    //   // editor.insertAttachment(attachment);
    //   fetch('/get_gist', {
    //     method: 'POST',
    //     // For future reference, this is how you make a POST request to rails and authenticate it.
    //     headers: {
    //       'X-Requested-With': 'XMLHttpRequest',
    //       'X-CSRF-Token': authenToken,
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(embedLink),
    //     credentials: 'same-origin'
    //   })
    //   .then(function(response) {
    //     return response.text();
    //   })
    //   .then(function(text) {
    //     let src = 'data:text/html;charset=utf-8,' + encodeURI(text);
    //     var iframe = `<iframe id="gist-iframe" width="600" height="450" src="${src}" frameborder="0" allowfullscreen></iframe>`
    //     let editor = document.querySelector('trix-editor').editor;
    //     let attachment = new window.utils.Trix.Attachment({sgid: sgid,  content: iframe, contentType: "vnd.rubyonrails.horizontal-rule.html"});
    //     editor.insertAttachment(attachment);
    //   })
    //   // fetch(proxyUrl + embedLink)
    //   //   .then(function (data) {
    //   //     return data.text();
    //   //   })
    //   //   .then(function(text) {
    //   //     let regex = new RegExp(/\<(.+)\>/, 'g');
    //   //     let matchArray = text.match(regex);
    //   //     let cssLink = matchArray[0];
    //   //     let body = matchArray[1];
    //   //     let iFrame = document.querySelector('#gist-iframe');
    //   //     let doc = new DOMParser().parseFromString(cssLink, "text/html");
    //   //     iFrame.contentDocument.head.appendChild(doc.head.firstElementChild);
    //   //     iFrame.contentWindow.document.open();
    //   //     iFrame.contentWindow.document.write(body);
    //   //     iFrame.contentWindow.document.close();
    //   //   })
    // },

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