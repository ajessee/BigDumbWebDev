const loadContacts = () => {
  if (document.querySelector('#contacts-project-container')) {
    setContactsVariables();
  };
}

const setContactsVariables = () => {
  c = {};

  window.projects.contacts = c;
}

document.addEventListener("DOMContentLoaded", loadContacts);