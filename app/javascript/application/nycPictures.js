import flatpickr from "flatpickr";
const nycPicturesLoader = () => {

  if (event.target.location.pathname === '/scroll3d') return;

  const nycPicturesContainer = document.getElementById('nyc-project-container');

  if (nycPicturesContainer) {
    console.info('Loading NYC Pictures module');
    
    const flatPickerElement = document.getElementById('nyc-project-date-picker');
    const currentDay = document.getElementById('nyc-pic-current-date').value;

    flatpickr(flatPickerElement, {
      defaultDate: new Date(2016, 0, currentDay),
      minDate: new Date(2016, 0, 1),
      maxDate: new Date(2016, 0, 365),
      dateFormat: "F j, Y",
      position: 'auto center'
    });

    flatPickerElement.addEventListener("change", (e) => {
      if (e.target.value === "" || e.target.value === null || e.target.value === undefined) return;
      let oneDay = 1000 * 60 * 60 * 24;
      let selectedDay = new Date(e.target.value);
      let startDay = new Date(2016, 0, 0);
      let diff = selectedDay - startDay;
      let selectDate = Math.ceil(diff / oneDay);
      window.location.href = `/projects/a-year-in-nyc?page=${selectDate}`
    })
  }

};
document.addEventListener("DOMContentLoaded", nycPicturesLoader);
