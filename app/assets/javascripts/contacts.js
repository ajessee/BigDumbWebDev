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
  c.modalText = document.getElementById('contact-modal-text');

  c.Contacts = function (firstName, lastName, phone, email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.email = email;
  }

  c.UI = function() {};

  c.UI.prototype.addContactToList = function(contact) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${contact.firstName}</td>
      <td>${contact.lastName}</td>
      <td>${contact.phone}</td>
      <td>${contact.email}</td>
      <td><a href="" class="contact-delete">X</a></td>
    `;

    c.contactList.appendChild(row);
  }

  c.UI.prototype.clearFields = function(){
    c.firstName.value = '';
    c.lastName.value = '';
    c.phone.value = '';
    c.email.value = '';
  }

  c.UI.prototype.showModal = function(message, className){
    c.modal.style.display = 'block';
    c.modalText.className = `alert ${className}`;
    c.modalText.innerHTML = message;
  }

  c.UI.prototype.closeModal = function(){
    c.modal.style.display = 'none';
  }

  window.addEventListener('click', function(e){
    if (document.querySelector('#contacts-project-container') && e.target === c.modal) {
      c.modal.style.display = 'none';
    };
  })

  c.modalClose.addEventListener('click', function(e){
    e.preventDefault();
    const ui = new c.UI;
    ui.closeModal;
  });

  c.contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    const contact = new c.Contacts(c.firstName.value, c.lastName.value, c.phone.value, c.email.value);
    const ui = new c.UI;
    let validationErrors = [];

    for (prop in contact) {
      if (contact[prop] === '') {
        let label = prop + 'Label';
        let labelTitle = c[label].textContent;
        validationErrors.push(`Please fill out the ${labelTitle} field`)
      }
    }

    if (validationErrors.length > 0) {
      let message = validationErrors.join(',');
      ui.showModal(message, 'contact-error');
    }
    else {
      ui.addContactToList(contact);
      ui.clearFields();
    }



    
  });

  window.projects.contacts = c;
}

document.addEventListener("DOMContentLoaded", loadContacts);

