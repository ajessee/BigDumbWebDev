const loadContacts = () => {
  if (document.querySelector('#contacts-project-container')) {
    setContactsVariables();
  };
}

const setContactsVariables = () => {
  c = {};

  c.firstNameLabel = document.getElementById('contact-first-name-label');
  c.lastNameLabel = document.getElementById('contact-last-name-label');
  c.phoneLabel = document.getElementById('contact-phone-label');
  c.emailLabel = document.getElementById('contact-email-label');
  c.firstName = document.getElementById('contact-first-name-input');
  c.lastName = document.getElementById('contact-last-name-input');
  c.phone = document.getElementById('contact-phone-input');
  c.email = document.getElementById('contact-email-input');
  c.contactForm = document.getElementById('contact-add-form');
  c.contactList = document.getElementById('contact-list');
  c.modal = document.getElementById('contact-modal');
  c.modalClose = document.getElementById('contact-modal-close');
  c.modalContent = document.getElementById('contact-modal-content');

  c.Contacts = class {
    constructor(firstName, lastName, phone, email) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.phone = phone;
      this.email = email;
      this.uuid = c.Contacts.uuidv4();
    }

    static uuidv4() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    }
  }

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
        if (contact.uuid === uuid) {
          contacts.splice(index, 1);
        }
      })
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }

  }

  window.addEventListener('click', function (e) {
    if (document.querySelector('#contacts-project-container') && e.target === c.modal) {
      c.modal.style.display = 'none';
      c.modalErrors = document.getElementById('content-error-list');
      c.modalErrors.remove();
    };
  })

  c.contactList.addEventListener('click', function (e) {
    e.preventDefault();
    const ui = new c.UI;
    ui.deleteContact(e.target);
  })

  c.modalClose.addEventListener('click', function (e) {
    e.preventDefault();
    const ui = new c.UI;
    ui.closeModal();
  });

  c.contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const contact = new c.Contacts(c.firstName.value, c.lastName.value, c.phone.value, c.email.value);
    const ui = new c.UI;
    let emptyErrors = [];
    let validationErrors = [];

    for (prop in contact) {
      if (contact[prop] === '') {
        let label = prop + 'Label';
        let labelTitle = c[label].textContent;
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

    if (emptyErrors.length > 0) {
      let field, need;
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
    } else if (emptyErrors.length === 0 && validationErrors.length === 0) {
      ui.addContactToList(contact);
      c.Store.addContact(contact);
      ui.clearFields();
    }

  });
  c.Store.displayContacts();
  window.projects.contacts = c;
}

document.addEventListener("DOMContentLoaded", loadContacts);
