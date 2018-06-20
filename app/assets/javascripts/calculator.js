const loadLoanCalc = () => {
  if (document.querySelector('#lc-project-container')){
    console.log('lets rock');
    let loadForm = document.getElementById('lc-input-form');
    console.log(loadForm);
  };
}

document.addEventListener("DOMContentLoaded", loadLoanCalc);

// For some reason DOMContentLoaded is firing early.
// document.onreadystatechange = function () {
//   if (document.readyState === "complete") {
//     loadTodo();
//   }
// }