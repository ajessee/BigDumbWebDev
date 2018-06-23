const loadLoanCalc = () => {
  if (document.querySelector('#lc-project-container')){
    setLCVariables();
    let lc = window.projects.loanCalculator;
    lc.loanForm.addEventListener('submit', function (e){
      lc.errorField.style.display = 'none';
      lc.resultsCard.style.display = 'none';
      lc.mainCard.style.gridTemplateRows = '10% repeat(2, 1fr) 10%';
      lc.mainCard.style.height = '100%';
      lc.loader.style.display = 'block';
      setTimeout(lc.calculateResults, 1300);
      e.preventDefault();
    });
  };
}

const setLCVariables = () => {
  lc = {};
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

  lc.calculateResults = (e) => {

    lc.principal = parseFloat(lc.amount.value);
    lc.calculatedInterest = parseFloat(lc.interest.value) / 100 / 12;
    lc.calculatedPayments = parseFloat(lc.years.value) * 12;
  
    //Calculate monthly payment
    lc.x = Math.pow(1 + lc.calculatedInterest, lc.calculatedPayments);
    lc.monthly = (lc.principal * lc.x * lc.calculatedInterest) / (lc.x-1);
  
    if (isFinite(lc.monthly)) {
      lc.monthlyPayment.value = lc.addCommas(lc.monthly.toFixed(2));
      lc.totalPayment.value = lc.addCommas((lc.monthly * lc.calculatedPayments).toFixed(2));
      lc.totalInterest.value = lc.addCommas(((lc.monthly * lc.calculatedPayments) - lc.principal).toFixed(2));
      lc.loader.style.display = 'none';
      lc.resultsCard.style.display = 'grid';
    }
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

  window.projects.loanCalculator = lc;
}

document.addEventListener("DOMContentLoaded", loadLoanCalc);