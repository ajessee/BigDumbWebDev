/* 
  On DOM content loaded, check if contacts project section is on page
  Do this so that I can reduce memory usage and only load parts of project JS that I need.
  I add contacts object to window.projects namespace, and then all properties and
  methods to that object. I store DOM elements in the object and add event listeners to elements
  the user will interact with.

  Note - I am using arrow functions. I started because I wanted to be fancy and use them everywhere,
  until I realized that I shouldn't just do something because it is cool. One issue that arises is that arrow functions are not hoisted, so I have to put the event listener at the bottom of the page. Also, arrow functions don't have a 'this' object (unless you pass it one), so 'this' === window for all these functions. This isn't a 
  problem, because I am creating an object per each project, and attaching properties and methods to that. Need to think about whether I want to refactor to use regular ol' functions, or if I can keep like this. 7/22/18, don't see the need to refactor now.

  TODO: 
    1. Set object to null on page reload to wipe from memory - is this needed?
    2. Change from arrow functions to regular functions?
*/

const loadContactsProject = () => {
  console.info("Loading Contacts Project");
  // Create object
  c = {};

  // Grab DOM elements I need
  c.firstName = document.getElementById('contact-first-name-input');
  c.lastName = document.getElementById('contact-last-name-input');
  c.phone = document.getElementById('contact-phone-input');
  c.email = document.getElementById('contact-email-input');
  c.contactForm = document.getElementById('contact-add-form');
  c.contactList = document.getElementById('contact-list');
  c.modal = document.getElementById('contact-modal');
  c.modalClose = document.getElementById('contact-modal-close');
  c.modalContent = document.getElementById('contact-modal-content');

  // ES6 class for contacts
  c.Contacts = class {
    constructor(firstName, lastName, phone, email) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.phone = phone;
      this.email = email;
      this.uuid = c.Contacts.uuidv4();
    }

    // Static method to generate UUID
    static uuidv4() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    }
  }

  /*
  ES6 Class for UI. Class with methods to interact with DOM - add contacts, delete contacts, clear fields,
  do modal stuff.
  */ 
  c.UI = class {

    addContactToList(contact) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${contact.firstName}</td>
        <td>${contact.lastName}</td>
        <td>${contact.phone}</td>
        <td>${contact.email}</td>
        <td><i class="far fa-window-close delete"></i></td>
      `;
      // Set data-uuid attribute to have unique identifier that can then be used to delete contacts
      row.setAttribute('data-uuid', contact.uuid);
      c.contactList.appendChild(row);
    }

    clearFields() {
      c.firstName.value = '';
      c.lastName.value = '';
      c.phone.value = '';
      c.email.value = '';
    }

    showModal(container) {
      c.modal.style.display = 'block';
      c.modalContent.appendChild(container);
    }

    closeModal() {
      c.modal.style.display = 'none';
      c.modalErrors = document.getElementById('content-error-list');
      c.modalErrors.remove();
    }

    deleteContact(target) {
      if (target.classList.contains('delete') || target.parentElement.classList.contains('delete')) {
        let sure = confirm('Are you sure you want to delete this contact?');
        if (sure) {
          c.Store.removeContact(target);
          target.closest('tr').remove()
        } else {
          return;
        }
      }
    }
  };

  /* 
  ES6 Class to interact with getLocalStorage object to persist data. All methods are static so we don't ever
  have to instatiate object.

  TODO: 
  1. Should I make all UI class methods static too? What is the value in instatating UI object vs static methods?
  2. Create database table and persist to DB on a per user basis. When user signs in, they will have
  their own personalized contacts app.
  */
  c.Store = class {

    static getContacts(){
      let contacts;
      if (localStorage.getItem('contacts') === null) {
        contacts = []
      }
      else {
        contacts = JSON.parse(localStorage.getItem('contacts'));
      }
      return contacts;
    }

    static displayContacts(){
      const contacts = c.Store.getContacts();
      // Instantiate new UI object
      const ui = new c.UI;
      contacts.forEach(function(contact){
        ui.addContactToList(contact);
      })
    }

    static addContact(contact){
      const contacts = c.Store.getContacts();
      contacts.push(contact);
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    static removeContact(target){
      const uuid = target.closest('tr[data-uuid]').getAttribute('data-uuid');

      const contacts = this.getContacts();

      contacts.forEach(function(contact, index) {
        // Check if we have the right contact to delete
        if (contact.uuid === uuid) {
          contacts.splice(index, 1);
        }
      })
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }

  }

  // If user clicks outside the modal dialog, close modal.
  window.addEventListener('click', function (e) {
    // If contacts project is on page, and a user clicks anywhere that isn't the dialog window (modal covers everything else)
    if (document.querySelector('#contacts-project-container') && e.target === c.modal) {
      c.modal.style.display = 'none';
      c.modalErrors = document.getElementById('content-error-list');
      c.modalErrors.remove();
    };
  })

  // Event listener on contact list element. Use event bubbling to see if they clicked on delete X
  c.contactList.addEventListener('click', function (e) {
    e.preventDefault();
    const ui = new c.UI;
    ui.deleteContact(e.target);
  })

  // When user clicks on modal close X, close modal
  c.modalClose.addEventListener('click', function (e) {
    e.preventDefault();
    const ui = new c.UI;
    ui.closeModal();
  });

  // On submit, validate all user entries, and then create contact and display
  c.contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // Instatiate new contacts object
    const contact = new c.Contacts(c.firstName.value, c.lastName.value, c.phone.value, c.email.value);
    const ui = new c.UI;
    let emptyErrors = [];
    let validationErrors = [];

    // Validate that fields are not empty, and that phone and email are in valid formats with regex
    for (prop in contact) {
      if (contact[prop] === '') {
        let labelTitle = c[prop].placeholder;
        emptyErrors.push(labelTitle)
      } else if (prop === 'phone') {
        const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
        if (!phoneRegex.test(contact[prop])) {
          validationErrors.push('Please make sure you are using a 10 digit phone number');
        }
      } else if (prop === 'email') {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(contact[prop])) {
          validationErrors.push('Please make sure you are using a valid email address');
        }
      }
    }

    // If there are any empty fields, display errors in modal dialog for user
    if (emptyErrors.length > 0) {
      let field, need;
      // Pluralize words
      if (emptyErrors.length === 1) {
        field = 'field';
        need = 'needs';
      } else {
        field = 'fields';
        need = 'need';
      }
      let message = `The following ${field} ${need} to be filled out.`;
      const container = document.createElement('div');
      const messageContainer = document.createElement('p');
      const errorList = document.createElement('ul');

      messageContainer.textContent = message;
      messageContainer.className = 'contact-error';
      emptyErrors.forEach(function (error) {
        let errorLi = document.createElement('li');
        errorLi.textContent = error;
        errorLi.className = 'contact-error';
        errorList.appendChild(errorLi);
      })
      container.id = 'content-error-list';
      container.appendChild(messageContainer);
      container.appendChild(errorList);

      ui.showModal(container);
    }

    // If there are validation errors, display errors in modal dialog for user
    if (validationErrors.length > 0) {
      let errorPlural
      if (validationErrors.length === 1) {
        errorPlural = 'error';
      } else {
        errorPlural = 'errors';
      }
      let container = document.getElementById('content-error-list');
      if (!container) {
        container = document.createElement('div');
      }
      let message = `Please review the following ${errorPlural}:`;
      const messageContainer = document.createElement('p');
      const errorList = document.createElement('ul');

      messageContainer.textContent = message;
      messageContainer.className = 'contact-error';
      validationErrors.forEach(function (error) {
        let errorLi = document.createElement('li');
        errorLi.textContent = error;
        errorLi.className = 'contact-error';
        errorList.appendChild(errorLi);
      })
      container.id = 'content-error-list';
      container.appendChild(messageContainer);
      container.appendChild(errorList);

      ui.showModal(container);
    } 
    // If all fields valid, create contact, update UI, and store in localStorage
    else if (emptyErrors.length === 0 && validationErrors.length === 0) {
      ui.addContactToList(contact);
      c.Store.addContact(contact);
      ui.clearFields();
    }

  });
  // On DOM content loaded, check to see if there are any saved contacts and display them
  c.Store.displayContacts();
  // Add contacts object to projects namespace
  window.projects.contacts = c;
}

document.addEventListener("DOMContentLoaded", function(){
  if (document.querySelector('#contacts-project-container')) {
    loadContactsProject();
  };
});
