const loadAutoPostSaver = () => {
  console.log("Loading Post Auto Saver");
  // Declare UI element variables to be able to do cool stuff to them!
  saver = {}
  saver.isDirty = false;
  saver.saveButton = document.querySelector('#new-post-submit-button') || document.querySelector('#edit-post-submit-button');

  saver.checkForSavedPost = () => {
    console.log('Checking for saved post');
    let blogId = document.querySelector("trix-editor").getAttribute("input");
    let savedContent = JSON.parse(localStorage.getItem(blogId));
    let authenToken = document.querySelector('input[name="authenticity_token"]').value;
    if (savedContent) {
      let currentContent = document.querySelector("trix-editor").value;
      let payload = {
        "currentContent": currentContent,
        "savedContent": savedContent.content
      }
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
          throw new Error('No delta between current content and saved content');
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

          // let delNodes= document.querySelector('div.diff del').childNodes;
          // let insNodes = document.querySelector('div.diff ins').childNodes;
          
          // let updateNodes = (nodes) => {
          //   let htmlString = "";
          //   nodes.forEach((node) => {
          //     if (node.nodeType === 3) {
          //       htmlString += node.wholeText
          //     }
          //     else {
          //       newString = "<strong>" + node.innerText + "</strong>";
          //       htmlString += newString;
          //     }
          //   })
          //   return htmlString;
          // }
          
          // document.querySelector('div.diff del').innerHTML = updateNodes(delNodes);
          // document.querySelector('div.diff ins').innerHTML = updateNodes(insNodes);

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
                window.utils.postAutoSaver.isDirty = false;
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

  saver.saveToLocalStorage = () => {
    if (window.utils.postAutoSaver.isDirty) {
      console.log('Auto-save blog content to local storage');
      let blogContent = document.querySelector("trix-editor").value;
      let blogId = document.querySelector("trix-editor").getAttribute("input");
      let storageObject = {content: blogContent};
      localStorage.setItem(blogId, JSON.stringify(storageObject));
      window.utils.postAutoSaver.isDirty = false;
    }
  }

  saver.setupTimer = () => {
    setInterval(function(){ 
      window.utils.postAutoSaver.saveToLocalStorage();
    }, 20000);
  };

  // Declare function to add (load) event listeners to elements
  saver.loadEventListeners = () => {
    // Listen for change in trix field
    document.addEventListener("trix-change", function(event) {
      window.utils.postAutoSaver.isDirty = true;
    })

    window.utils.postAutoSaver.saveButton.addEventListener("click", function (event) {
      let blogId = document.querySelector("trix-editor").getAttribute("input");
      localStorage.removeItem(blogId);
      window.utils.postAutoSaver.isDirty = false;
    })

  }

  saver.init = function() {
    this.loadEventListeners();
    this.setupTimer();
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