const loadPostAutoSaver = function() {

  console.info("Loading Post Auto Saver Module");
  // Set up main object
  saver = {}

  // Cache Trix editor instance
  saver.trix = document.querySelector(".trix-wrapper trix-editor");
  saver.editor = saver.trix.editor;
  saver.hasUnsavedChanges = false;

  // Cache Trix blog id
  saver.blogId = saver.trix.inputElement ? saver.trix.inputElement.id : null;

  // Cache if new post
  saver.newPost = document.querySelector('form.post-form').id === "new-post" ? true : false;

  // Cache title, tags, published inputs
  saver.titleInput = document.querySelector('input#post_title');
  saver.tagsInput = document.querySelector('input#existing-tags-input');
  saver.tagsSelectInput = document.querySelector('select#post_counts');
  saver.publishedInput = document.querySelector('input#post_published');

  // Cache save button, for either new or edit post form
  saver.saveButton = document.querySelector('#new-post-submit-button') || document.querySelector('#edit-post-submit-button');

  // Cache original state of title, content, tags, and whether or not post is published
  saver.originalTitle = saver.titleInput.value;
  saver.originalDocument = saver.editor ? saver.editor.getDocument() : null;
  saver.originalTags = saver.tagsInput.value;
  saver.originalPublishedState = saver.publishedInput.checked;

  // Load event listeners to save state to local storage on change for title, tags, and published. Will autosave post content every thirty seconds or on off focus.
  saver.loadEventListeners = function () {
    // Listen for when trix editor gains focus. Start 30 second timer on this event.
    document.addEventListener("trix-focus", function(event) {
      this.setupTimer();
    }.bind(this))
    // Listen for when trix editor loses focus. Autosave on this event. Stop thirty second timer on this event.
    document.addEventListener("trix-blur", function(event) {
      this.removeTimer();
      this.checkForUnsavedChanges('content');
    }.bind(this))
    // Listen for post title text input changes. Autosave on this event.
    this.titleInput.addEventListener("change", function(event) {
      this.checkForUnsavedChanges('title', event.target.value);
    }.bind(this))
    // Listen for post tags text input changes. Autosave on this event.
    this.tagsInput.addEventListener("change", function(event) {
      this.checkForUnsavedChanges('tags', event.target.value);
    }.bind(this))
    // Listen for post published? checkbox input change. Autosave on this event.
    this.publishedInput.addEventListener("change", function(event) {
      this.checkForUnsavedChanges('published', event.target.checked);
    }.bind(this))
    // Listen for main save event. Remove post state object from local storage.
    this.saveButton.addEventListener("click", function (event) {
      // TODO: Check for 200 response from post save before erasing.
      localStorage.removeItem(this.blogId);
      this.hasUnsavedChanges = false;
    }.bind(this))
  }

  saver.setupTimer = function () {
    console.info(`Post Auto Saver: 30 second content auto-save timer started`);
    if (!window.utils.modal.isModalOpen) {
      this.timer = setInterval( function () { 
        window.utils.postAutoSaver.checkForUnsavedChanges('content');
      }, 20000);
    }
  };

  saver.removeTimer = function () {
    console.info(`Post Auto Saver: 30 second content auto-save timer ended`);
    clearInterval(this.timer);
  };

  saver.saveToLocalStorage = function(elementName, newStateObject) {
    console.info(`Post Auto Saver: Saving ${elementName} to local storage`);
    let savedStateObject = this.getSavedContent(this.blogId);
    // If we already have saved state, merge new changes and resave
    if (savedStateObject) {
      let mergedObject = {...savedStateObject, ...newStateObject};
      localStorage.setItem(this.blogId, JSON.stringify(mergedObject));
      this.hasUnsavedChanges = true;
    } // Else just save directly 
    else {
      localStorage.setItem(this.blogId, JSON.stringify(newStateObject));
      this.hasUnsavedChanges = true;
    }
    console.info(`Post Auto Saver: ${elementName} successfully saved`);
  }

  saver.checkForUnsavedChanges = function(elementName, currentElementValue) {
    let newStateObject = {};
    switch (elementName) {
      case 'title':
        if (currentElementValue !== this.originalTitle) {
          this.currentTitle = currentElementValue;
          this.toggleSaveButton(true);
          newStateObject[elementName] = currentElementValue;
          this.saveToLocalStorage(elementName, newStateObject);
        }
        break;
      case 'content':
          if (!this.originalDocument.isEqualTo(this.editor.getDocument())) {
            this.toggleSaveButton(true);
            newStateObject[elementName] = this.trix.value;
            newStateObject.editorState = JSON.stringify(this.editor);
            this.saveToLocalStorage(elementName, newStateObject);
          }
        break;
      case 'tags':
          if (currentElementValue !== this.originalTags) {
            this.currentTags = currentElementValue;
            this.toggleSaveButton(true);
            newStateObject[elementName] = currentElementValue;
            this.saveToLocalStorage(elementName, newStateObject);
          }
        break;
      case 'published':
          if (currentElementValue !== this.originalPublishedState) {
            this.currentPublishedState = currentElementValue;
            this.toggleSaveButton(true);
            newStateObject[elementName] = currentElementValue;
            this.saveToLocalStorage(elementName, newStateObject);
          }
        break;
      default:
        console.error('Post Auto Saver - checkForUnsavedChanges error: please provide an element name of title, content, tags, or published.');
    }
  }

  saver.generateDiffPayload = function() {
    let savedContent = this.getSavedContent(this.blogId);
    let payload = {
      currentContent: {
        title: this.currentTitle || this.originalTitle,
        content: this.trix.value,
        tags: this.currentTags || this.originalTags,
        published: this.currentPublishedState !== undefined ? this.currentPublishedState : this.originalPublishedState,
        editorState: JSON.stringify(this.editor),
        newPost: this.newPost
      },
      savedContent: savedContent
    }
    return payload;
  }

  saver.getSavedContent = function (blogId) {
    return JSON.parse(localStorage.getItem(blogId)) || null;
  }

  saver.deleteSavedContent = function (blogId) {
    localStorage.removeItem(this.blogId);
  }

  saver.openModal = function() {
    if (window.utils.weLargeScreen.matches) {
      window.utils.modal.diffModal = window.utils.modal.openModal('block', '0%', 3, 3, 12, 12, null, null, true);
    } else if (window.utils.weTablet.matches || window.utils.weMobile.matches) {
      window.utils.modal.diffModal = window.utils.modal.openModal('block', '0%', 1, 1, 16, 16, null, null, true);
    } else {
      window.utils.modal.diffModal = window.utils.modal.openModal('block', '0%', 3, 3, 12, 12, null, null, true);
    }
    window.utils.navigation.toggleNavButton(false);
  }

  saver.checkForSavedPost = function() {
    console.info('Post Auto Saver: Checking for saved post');
    // Get Rails authenticity token
    let authenToken = document.querySelector('input[name="authenticity_token"]').value;
    // If we have saved content locally, check for diffs
    if (this.getSavedContent(this.blogId)) {
      console.info('Post Auto Saver: Saved post found. Sending current and saved content to server for diff calculations');
      let payload = window.utils.postAutoSaver.generateDiffPayload();
      fetch('/check_diffs', {
        method: 'POST',
        // This how you make a POST request to Rails and authenticate it.
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
          return response.then(Promise.reject.bind(Promise));
        } else {
          return response.json();
        }
      })
      .then(function(response){
        console.info('Post Auto Saver: Diffs response received.');
        // Setup modal window
        window.utils.postAutoSaver.openModal();
        window.utils.postAutoSaver.modalCloseButton = document.querySelector('button.close-modal');
        // Listen for modal close. Remove post state object from local storage on confirm.
        // This is a hack. The modal close process (css class changes) has already happened on click.
        // I just reopen the modal. Inelegant, but it works for now. TODO: Improve.
        window.utils.postAutoSaver.modalCloseButton.addEventListener("click", function (event) {
          let userConfirm = confirm("You have unsaved changes. If you close this window you will lose them. Are you sure?");
          if (userConfirm) {
            localStorage.removeItem(window.utils.postAutoSaver.blogId);
            this.hasUnsavedChanges = false;
          } else {
            window.utils.postAutoSaver.openModal();
            window.utils.modal.diffModal.insertAdjacentHTML('beforeend', response.partial);
            window.utils.modal.diffModal.style.overflowY = "auto";
          }
        });
        // Store reponse
        window.utils.postAutoSaver.response = response;
        // Inject partial into modal
        window.utils.modal.diffModal.insertAdjacentHTML('beforeend', response.partial);
        window.utils.modal.diffModal.style.overflowY = "auto";
        // Load diff content into modal editors. If it's a new post, will only have saved editor.
        let selectionButtonsArray = [];
        if (!window.utils.postAutoSaver.newPost) {
          // Make sure we have a diff in content
          if (!response.payload.contentDiffEmpty && response.payload.currentContent.content !== "" && response.payload.currentContent.editorState) {
            let currentEditor = document.querySelector("#current-content-trix").editor;
            let currentEditorState = response.payload.currentContent.editorState;
            currentEditor.loadJSON(JSON.parse(currentEditorState));
          }
          let currentButton = document.querySelector('#use-current-version-button');
          selectionButtonsArray.push(currentButton)
        }
        // Make sure we have a diff in content
        if (!response.payload.contentDiffEmpty && response.payload.savedContent.content !== "" && response.payload.savedContent.editorState) {
          let savedEditor = document.querySelector("#saved-content-trix").editor;
          let savedEditorState = response.payload.savedContent.editorState;
          savedEditor.loadJSON(JSON.parse(savedEditorState));
        }
        let savedButton = document.querySelector('#use-saved-version-button');
        selectionButtonsArray.push(savedButton)
        // Set event listeners on update content button(s) to grab user-select editor state and load elements into main editor.
        let setUpdateContentListeners = (button) => {
          button.addEventListener("click", function(event){
            let userConfirm = confirm("Are you sure you want to use this version?");
            if (userConfirm) {
              const buttonId = event.target.id;
              const useSavedState = buttonId.includes("saved") ? true : false;
              const cachedResponse = window.utils.postAutoSaver.response.payload;
              // Only need to inject data into editor if they are using unsaved changes.
              if (useSavedState) {
                let title = !cachedResponse.titleDiffEmpty ? cachedResponse.savedContent.title : null;
                let content = !cachedResponse.contentDiffEmpty ? cachedResponse.savedContent.editorState : null;
                let tags = !cachedResponse.tagsDiffEmpty ? cachedResponse.savedContent.tags : null;
                let published = !cachedResponse.publishedDiffEmpty ? cachedResponse.savedPublished : null;

                if (title) {
                  window.utils.postAutoSaver.titleInput.value = title;
                  window.utils.postAutoSaver.titleInput.focus();
                }
                if (content) {
                  window.utils.postAutoSaver.editor.loadHTML('');
                  window.utils.postAutoSaver.editor.loadJSON(JSON.parse(content));
                  window.utils.postAutoSaver.originalDocument = window.utils.postAutoSaver.editor.getDocument();
                }
                if (tags) {
                  window.utils.postAutoSaver.tagsInput.value = tags;
                }
                if (published) {
                  window.utils.postAutoSaver.publishedInput.checked = published;
                } 
                window.utils.notifications.openNotification('alert', 'Save your work', 'We\'ve restored your unsaved changes. Please save your changes now. ' , 6000, true);
                window.utils.postAutoSaver.toggleSaveButton(true);
              }
              // Otherwise, we will used what is in editor now
              window.utils.modal.closeModal(event);
              localStorage.removeItem(window.utils.postAutoSaver.blogId);
              this.hasUnsavedChanges = false;
            }
          })
        }
        selectionButtonsArray.forEach((button) => {
          setUpdateContentListeners(button)
        })

      })
      .catch(function(e) {
        let message = e.message || e;
        console.info("Post Auto Saver Error: " + message);
      })
    } else {
      console.info('Post Auto Saver: No saved post found');
    }

  }

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

  saver.init = function() {
    this.loadEventListeners();
    this.toggleSaveButton(false); 
    this.checkForSavedPost();
  }

  window.utils.postAutoSaver = saver;
  saver.init();
}

document.addEventListener("DOMContentLoaded", function() {
  if (document.querySelector('form#new-post') || document.querySelector('form#edit-post')) {
    loadPostAutoSaver();
  };
});