/* 
  On DOM content loaded, check if loan calculator preoject section is on page
  Do this so that I can reduce memory usage and only load parts of project JS that I need.
  I add loanCalculator object to window.projects namespace, and then all properties and
  methods to that object. I store DOM elements in the object and add event listeners to elements
  the user will interact with.

  Note - I am using arrow functions. I started because I wanted to be fancy and use them everywhere,
  until I realized that I shouldn't just do something because it is cool. One issue that arises is that arrow functions are not hoisted, so I have to put the event listener at the bottom of the page. Also, arrow functions don't have a 'this' object (unless you pass it one), so 'this' === window for all these functions. This isn't a 
  problem, because I am creating an object per each project, and attaching properties and methods to that. Need to think about whether I want to refactor to use regular ol' functions, or if I can keep like this. 7/22/18, don't see the need to refactor now.

  Todo:
    1. Set object to null on page reload to wipe from memory - is this needed?
    2. Refactor to ES6 classes
    3. Change from arrow functions to regular functions?
*/

// Grab UI elements, store in object properties, add methods for calculating monthly and total payments and total interest
const loadLoanCalculatorProject = () => {
  console.log("Loading Loan Calculator Project");
  const lc = {};
  lc.loader = document.getElementById('lc-loader');
  lc.mainCard = document.getElementById('lc-card');
  lc.resultsCard = document.getElementById('lc-results');
  lc.loanForm = document.getElementById('lc-input-form');
  lc.errorField = document.getElementById('lc-errors');

  lc.amount = document.getElementById('lc-amount');
  lc.interest = document.getElementById('lc-interest');
  lc.years = document.getElementById('lc-years');
  lc.monthlyPayment = document.getElementById('lc-monthly-payment');
  lc.totalPayment = document.getElementById('lc-total-payment');
  lc.totalInterest = document.getElementById('lc-total-interest');

  lc.principal = parseFloat(lc.amount.value);
  lc.calculatedInterest = parseFloat(lc.interest.value) / 100 / 12;
  lc.calculatedPayments = parseFloat(lc.years.value) * 12;

  // Main method to calculate results
  lc.calculateResults = (e) => {

    lc.principal = parseFloat(lc.amount.value);
    lc.calculatedInterest = parseFloat(lc.interest.value) / 100 / 12;
    lc.calculatedPayments = parseFloat(lc.years.value) * 12;
  
    //Calculate monthly payment
    lc.x = Math.pow(1 + lc.calculatedInterest, lc.calculatedPayments);
    lc.monthly = (lc.principal * lc.x * lc.calculatedInterest) / (lc.x-1);
  
    // If monthly payment is finite amount (not NaN), it means inputs were valid and we can calculate and display
    // Add commas to output values for pretty formatting
    if (isFinite(lc.monthly)) {
      lc.monthlyPayment.value = lc.addCommas(lc.monthly.toFixed(2));
      lc.totalPayment.value = lc.addCommas((lc.monthly * lc.calculatedPayments).toFixed(2));
      lc.totalInterest.value = lc.addCommas(((lc.monthly * lc.calculatedPayments) - lc.principal).toFixed(2));
      lc.loader.style.display = 'none';
      lc.resultsCard.style.display = 'grid';
    }
    // Else display error message
    else {
      lc.loader.style.display = 'none';
      lc.errorField.style.display = 'block';
      lc.errorField.innerHTML = 'Oops...looks like there is something wrong with your numbers. Please check them and try again.';
      setTimeout(function(){
        lc.errorField.style.display = 'none';
        lc.mainCard.style.gridTemplateRows = '20% auto 10%';
        lc.mainCard.style.height = '70%';
      }, 3000)
    }
  }

  // Method to add commas to values > 999
  lc.addCommas = (value) => {
    let chars,
        isDec,
        dec;
    let idx = value.indexOf('.');
    if (idx > -1) {
      chars = value.substring(0, idx).split("").reverse();
      dec = value.substring(idx);
      isDec = true;
    }
    else {
      chars = value.split("").reverse();
    }
    let tempArr = [];
    for (let i = 1; i <=chars.length; i++) {
      tempArr.push(chars[i-1]);
      if (i % 3 === 0 && i != chars.length) {
        tempArr.push(",");
      }
    }
      tempArr.push("$");
    if (isDec) {
      return tempArr.reverse().join("").concat(dec);
    }
    return tempArr.reverse().join("");
  }

  // Event lister on submit button. Calculate results (with timeout to look busy), update UI
  lc.loanForm.addEventListener('submit', function (e){
    lc.errorField.style.display = 'none';
    lc.resultsCard.style.display = 'none';
    lc.mainCard.style.gridTemplateRows = '10% repeat(2, 1fr) 10%';
    lc.mainCard.style.height = '100%';
    lc.loader.style.display = 'block';
    setTimeout(lc.calculateResults, 1300);
    e.preventDefault();
  });

  // Add loan calculator object created in setLCVariables to project namespace  
  window.projects.loanCalculator = lc;
}

document.addEventListener("DOMContentLoaded", function(){
  if (document.querySelector('#lc-project-container')){
    loadLoanCalculatorProject();
  }
});