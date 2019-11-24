const loadAutoPostSaver = function() {
  console.log("Loading Post Auto Saver");
  // Declare UI element variables to be able to do cool stuff to them!
  saver = {}
  saver.trix = document.querySelector(".trix-wrapper trix-editor");
  saver.editor = saver.trix.editor;
  saver.blogId = saver.trix.inputElement.id;
  saver.titleInput = document.querySelector('input#post_title');
  saver.tagsInput = document.querySelector('input#existing-tags-input');
  saver.publishedInput = document.querySelector('input#post_published');
  saver.saveButton = document.querySelector('#new-post-submit-button') || document.querySelector('#edit-post-submit-button');
  saver.originalTitle = saver.titleInput.value;
  saver.originalDocument = saver.editor.getDocument();
  saver.originalTags = saver.tagsInput.value;
  saver.originalPublishedState = saver.publishedInput.checked;
  saver.hasUnsavedChanges = false; 
  saver.unsavedChangesCached = false;

  saver.generateDiffPayload = function() {
    let savedContent = this.getSavedContent(this.blogId);
    let payload = {
      currentContent: {
        title: this.currentTitle || this.originalTitle,
        content: this.trix.value,
        tags: this.currentTags || this.originalTags,
        published: this.currentPublishedState ? this.currentPublishedState.toString() || this.originalPublishedState.toString() : false,
        editorState: JSON.stringify(this.editor)
      },
      savedContent: savedContent
    }
    return payload;
  }

  saver.getSavedContent = function (blogId) {
    return JSON.parse(localStorage.getItem(blogId)) || null;
  }

  saver.tidyHtml = function (html) {
    options = {
      "indent":"auto",
      "indent-spaces":2,
      "wrap": 120,
      "markup":true,
      "output-xml":false,
      "numeric-entities":true,
      "quote-marks":false,
      "quote-nbsp":false,
      "show-body-only":true,
      "quote-ampersand":false,
      "break-before-br":true,
      "uppercase-tags":false,
      "uppercase-attributes":false,
      "drop-font-tags":true,
      "tidy-mark":false
    }
    return tidy_html5(html, options)
  }

  saver.checkForSavedPost = function() {
    console.log('Checking for saved post');

    let authenToken = document.querySelector('input[name="authenticity_token"]').value;
    if (this.getSavedContent(this.blogId)) {
      let payload = window.utils.postAutoSaver.generateDiffPayload();
      fetch('/check_diffs', {
        method: 'POST',
        // For future reference, this is how you make a POST request to rails and authenticate it.
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-Token': authenToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'same-origin'
      })
      .then(function(response) {
        if (response.status == 204) {
          throw new Error('AutoPostSaver: No delta between current content and saved content');
        }
        return response.json();
      })
      .then(function(json){
          if (window.utils.weLargeScreen.matches) {
            window.utils.modal.diffModal = window.utils.modal.openModal('block', '0%', 3, 3, 12, 12, null, null, true);
          } else if (window.utils.weTablet.matches || window.utils.weMobile.matches) {
            window.utils.modal.diffModal = window.utils.modal.openModal('block', '0%', 1, 1, 16, 16, null, null, true);
          } else {
            window.utils.modal.diffModal = window.utils.modal.openModal('block', '0%', 3, 3, 12, 12, null, null, true);
          }
        
          window.utils.modal.diffModal.insertAdjacentHTML('beforeend', json.partial);
          window.utils.modal.diffModal.style.overflowY = "auto";
          let savedContent = document.querySelector("#saved-content-input").value;
          let currentContent = document.querySelector("#current-content-input").value;
          let savedEditor = document.querySelector("#saved-content-trix").editor;
          let currentEditor = document.querySelector("#current-content-trix").editor;
          savedEditor.loadJSON(JSON.parse(savedContent));
          currentEditor.loadJSON(JSON.parse(currentContent));

          let savedButton = document.querySelector('#use-saved-version-button');
          let currentButton = document.querySelector('#use-current-version-button');
          let buttons = [savedButton, currentButton]

          let setUpdateContentListeners = (button) => {
            button.addEventListener("click", function(event){
              let choice = confirm("Are you sure you want to use this version?");
              if (choice) {
                let buttonId = event.target.id;
                let content = buttonId.includes("saved") ? document.querySelector("#saved-content-input").value : document.querySelector("#current-content-input").value;
                let editor = document.querySelector(".trix-wrapper trix-editor").editor;
                editor.loadHTML('');
                editor.loadJSON(JSON.parse(content));
                window.utils.modal.closeModal(event);
                let blogId = document.querySelector(".trix-wrapper trix-editor").getAttribute("input");
                localStorage.removeItem(blogId);
                window.utils.postAutoSaver.unsavedChangesCached = false;
              }
              
            })
          }

          buttons.forEach((button) => {
            setUpdateContentListeners(button)
          })

      })
      .catch(function(e) {
        console.log(e.message)
      }) 
    }
  }

  saver.saveToLocalStorage = function() {
    let isModalOpen = window.utils.modal.isModalOpen;
    if (!this.unsavedChangesCached && !isModalOpen) {
      console.log('Auto-save blog content to local storage');
      let storageObject = {
        title: this.currentTitle || this.originalTitle,
        content: this.trix.value,
        tags: this.currentTags || this.originalTags,
        published: this.currentPublishedState ? this.currentPublishedState.toString() || this.originalPublishedState.toString() : false,
        editorState: JSON.stringify(this.editor)
      };
      localStorage.setItem(this.blogId, JSON.stringify(storageObject));
      this.unsavedChangesCached = true;
    }
  }

  saver.setupTimer = function() {
    setInterval(function(){ 
      window.utils.postAutoSaver.saveToLocalStorage();
    }, 20000);
  };

  saver.toggleSaveButton = (enable) => {
    if (enable) {
      window.utils.postAutoSaver.saveButton.disabled = false;
      window.utils.postAutoSaver.saveButton.style.backgroundColor = '#4CAF50';
    } 
    else {
      window.utils.postAutoSaver.saveButton.disabled = true;
      window.utils.postAutoSaver.saveButton.style.backgroundColor = 'lightgrey';
    }
  }

  saver.checkForUnsavedChanges = function() {
    let unsavedTitleChanges = this.currentTitle ? this.currentTitle != this.originalTitle : false;
    let unsavedTagChanges = this.currentTags ? this.currentTags != this.originalTags : false;
    let unsavedContentChanges = !this.originalDocument.isEqualTo(this.editor.getDocument());
    let unsavedPublishedState = this.currentPublishedState != this.originalPublishedState;
    this.hasUnsavedChanges = unsavedTitleChanges || unsavedTagChanges || unsavedContentChanges || unsavedPublishedState;

    this.hasUnsavedChanges ? 
    this.toggleSaveButton(true) : 
    this.toggleSaveButton(false) 
  }

  saver.loadEventListeners = function() {
    // Listen for change in trix field
    document.addEventListener("trix-change", function(event) {
      window.utils.postAutoSaver.unsavedChangesCached = false;
      window.utils.postAutoSaver.checkForUnsavedChanges();
    })

    window.utils.postAutoSaver.titleInput.addEventListener("change", function(event) {
      window.utils.postAutoSaver.unsavedChangesCached = false;
      window.utils.postAutoSaver.currentTitle = event.target.value;
      window.utils.postAutoSaver.checkForUnsavedChanges();
    })

    window.utils.postAutoSaver.tagsInput.addEventListener("change", function(event) {
      window.utils.postAutoSaver.unsavedChangesCached = false;
      window.utils.postAutoSaver.currentTags = event.target.value;
      window.utils.postAutoSaver.checkForUnsavedChanges();
    })

    window.utils.postAutoSaver.publishedInput.addEventListener("change", function(event) {
      window.utils.postAutoSaver.unsavedChangesCached = false;
      window.utils.postAutoSaver.currentPublishedState = event.target.checked;
      window.utils.postAutoSaver.checkForUnsavedChanges();
    })

    window.utils.postAutoSaver.saveButton.addEventListener("click", function (event) {
      let blogId = document.querySelector(".trix-wrapper trix-editor").getAttribute("input");
      localStorage.removeItem(blogId);
      window.utils.postAutoSaver.unsavedChangesCached = false;
    })

  }

  saver.init = function() {
    this.loadEventListeners();
    this.setupTimer();
    this.toggleSaveButton(false); 
    this.checkForSavedPost();
  }

  window.utils.postAutoSaver = saver;
  saver.init();
}

document.addEventListener("DOMContentLoaded", function() {
  if (document.querySelector('form#new-post') || document.querySelector('form#edit-post')) {
    loadAutoPostSaver();
  };
});