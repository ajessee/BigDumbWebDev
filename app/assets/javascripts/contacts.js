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
          target.parentElement.parentElement.remove()
        } else {
          return;
        }
      }
    }
  };

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
      ui.clearFields();
    }

  });

  window.projects.contacts = c;
}

document.addEventListener("DOMContentLoaded", loadContacts);