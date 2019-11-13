const loadAutoPostSaver = function() {
  console.log("Loading Post Auto Saver");
  // Declare UI element variables to be able to do cool stuff to them!
  saver = {}
  saver.trix = document.querySelector("trix-editor");
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
        title: window.utils.postAutoSaver.currentTitle || window.utils.postAutoSaver.originalTitle,
        content: document.querySelector("trix-editor").value,
        tags: window.utils.postAutoSaver.currentTags || window.utils.postAutoSaver.originalTags,
        published: window.utils.postAutoSaver.currentPublishedState ? window.utils.postAutoSaver.currentPublishedState.toString() || window.utils.postAutoSaver.originalPublishedState.toString() : false
      },
      savedContent: savedContent
    }
    return payload;
  }

  saver.getSavedContent = function (blogId) {
    return JSON.parse(localStorage.getItem(blogId)) || null;
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
        return response.text();
      })
      .then(function(data){
          if (window.utils.weLargeScreen.matches) {
            window.utils.modal.diffModal = window.utils.modal.openModal('block', '0%', 3, 3, 12, 12, null, null, true);
          } else if (window.utils.weTablet.matches || window.utils.weMobile.matches) {
            window.utils.modal.diffModal = window.utils.modal.openModal('block', '0%', 1, 1, 16, 16, null, null, true);
          } else {
            window.utils.modal.diffModal = window.utils.modal.openModal('block', '0%', 3, 3, 12, 12, null, null, true);
          }
          // Setup modal window, insert new user signup partial
        
          window.utils.modal.diffModal.insertAdjacentHTML('beforeend', data);
          window.utils.modal.diffModal.style.overflowY = "auto";

          let savedButton = document.querySelector('#use-saved-version-button');
          let currentButton = document.querySelector('#use-current-version-button');
          let buttons = [savedButton, currentButton]

          let setUpdateContentListeners = (button) => {
            button.addEventListener("click", function(event){
              let choice = confirm("Are you sure you want to use this version?");
              if (choice) {
                let content = event.target.getAttribute("data-content");
                let editor = document.querySelector("trix-editor").editor;
                editor.loadHTML('');
                editor.loadHTML(content);
                window.utils.modal.closeModal(event);
                let blogId = document.querySelector("trix-editor").getAttribute("input");
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
    if (!window.utils.postAutoSaver.unsavedChangesCached) {
      console.log('Auto-save blog content to local storage');
      let blogContent = document.querySelector("trix-editor").value;
      let blogId = document.querySelector("trix-editor").getAttribute("input");
      let storageObject = {
        title: window.utils.postAutoSaver.currentTitle || window.utils.postAutoSaver.originalTitle,
        content: blogContent,
        tags: window.utils.postAutoSaver.currentTags || window.utils.postAutoSaver.originalTags,
        published: window.utils.postAutoSaver.currentPublishedState ? window.utils.postAutoSaver.currentPublishedState.toString() || window.utils.postAutoSaver.originalPublishedState.toString() : false
      };
      localStorage.setItem(blogId, JSON.stringify(storageObject));
      window.utils.postAutoSaver.unsavedChangesCached = true;
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
    let unsavedTitleChanges = window.utils.postAutoSaver.currentTitle ? window.utils.postAutoSaver.currentTitle != window.utils.postAutoSaver.originalTitle : false;
    let unsavedTagChanges = window.utils.postAutoSaver.currentTags ? window.utils.postAutoSaver.currentTags != window.utils.postAutoSaver.originalTags : false;
    let unsavedContentChanges = !window.utils.postAutoSaver.originalDocument.isEqualTo(window.utils.postAutoSaver.editor.getDocument());
    let unsavedPublishedState = window.utils.postAutoSaver.currentPublishedState != window.utils.postAutoSaver.originalPublishedState;
    window.utils.postAutoSaver.hasUnsavedChanges = unsavedTitleChanges || unsavedTagChanges || unsavedContentChanges || unsavedPublishedState;

    window.utils.postAutoSaver.hasUnsavedChanges ? 
    window.utils.postAutoSaver.toggleSaveButton(true) : 
    window.utils.postAutoSaver.toggleSaveButton(false) 
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
      let blogId = document.querySelector("trix-editor").getAttribute("input");
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