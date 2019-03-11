const passwordReset = () => {

  if (document.querySelector('.edit-password-container')) {
    let modal = window.utils.modal;
    let labels = window.utils.labels;
    let notifications = window.utils.notifications;
    let passwordResetForm = document.querySelector('#password-reset-form');

    // Setup modal window, insert password reset partial
    modal.passwordResetModal = modal.openModal('block', '0%', 5, 5, 8, 9, null, null, false);
    modal.passwordResetModal.append(passwordResetForm);
    passwordResetForm.style.display = "grid";

    // Get close button and attach close modal function
    modal.passwordResetCloseButton = document.querySelector("#password-reset-close-button");
    modal.passwordResetCloseButton.addEventListener('click', function (e) {
      e.preventDefault();
      if (window.utils.modal.programaticClick) {
        window.utils.modal.programaticClick = false;
        notifications.openNotification('alert', 'Oops', 'Please reset your password or click cancel', 6000, true);
      }
      else {
        modal.passwordResetModal = null;
        window.location.replace('/');
      }
    })
    // Initialize labels component
    labels.init();
  }

}

document.addEventListener("DOMContentLoaded", passwordReset);