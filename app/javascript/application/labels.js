const setUpLabels = () => {

  const labels = {

    // add active class and placeholder 
    handleFocus: (e) => {
      const target = e.target;
      target.parentNode.classList.add('active');
    },

    // remove active class and placeholder
    handleBlur: (e) => {
      const target = e.target;
      if (!target.value) {
        target.parentNode.classList.remove('active');
      }
    },

    // register events
    bindEvents: (element) => {
      const floatField = element.querySelector('input');
      floatField.addEventListener('focus', window.utils.labels.handleFocus);
      floatField.addEventListener('blur', window.utils.labels.handleBlur);
    },

    // get DOM elements
    init: () => {
      const floatContainers = document.querySelectorAll('.float-container');

      floatContainers.forEach((element) => {
        if (element.querySelector('input').value) {
          element.classList.add('active');
        }

        window.utils.labels.bindEvents(element);
      });
    }
  };

  window.utils.labels = labels;
}
document.addEventListener("DOMContentLoaded", setUpLabels);