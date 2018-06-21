const loadLoanCalc = () => {
  if (document.querySelector('#lc-project-container')){
    const loanForm = document.getElementById('lc-input-form');
    loanForm.addEventListener('submit', function (e){
      const loader = document.getElementById('lc-loader');
      const mainCard = document.getElementById('lc-card');
      const resultsCard = document.getElementById('lc-results');
      const errorField = document.getElementById('lc-errors');

      errorField.style.display = 'none';
      resultsCard.style.display = 'none';
      mainCard.style.gridTemplateRows = '10% repeat(2, 1fr) 10%';
      mainCard.style.height = '100%';
      loader.style.display = 'block';

      setTimeout(calculateResults, 1300);

      e.preventDefault();
    });
  };
}

const calculateResults = (e) => {
  
  const amount = document.getElementById('lc-amount');
  const interest = document.getElementById('lc-interest');
  const years = document.getElementById('lc-years');
  const monthlyPayment = document.getElementById('lc-monthly-payment');
  const totalPayment = document.getElementById('lc-total-payment');
  const totalInterest = document.getElementById('lc-total-interest');

  const principal = parseFloat(amount.value);
  const calculatedInterest = parseFloat(interest.value) / 100 / 12;
  const calculatedPayments = parseFloat(years.value) * 12;
  const loader = document.getElementById('lc-loader');
  const resultsCard = document.getElementById('lc-results');
  const errorField = document.getElementById('lc-errors');

  //Calculate monthly payment
  const x = Math.pow(1 + calculatedInterest, calculatedPayments);
  const monthly = (principal * x * calculatedInterest) / (x-1);

  if (isFinite(monthly)) {
    monthlyPayment.value = addCommas(monthly.toFixed(2));
    totalPayment.value = addCommas((monthly * calculatedPayments).toFixed(2));
    totalInterest.value = addCommas(((monthly * calculatedPayments) - principal).toFixed(2));
    loader.style.display = 'none';
    resultsCard.style.display = 'grid';
  }
  else {
    loader.style.display = 'none';
    errorField.style.display = 'block';
    errorField.innerHTML = 'Oops...looks like there is something wrong with your numbers. Please check them and try again.';
  }



  
}

const addCommas = (value) => {
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

document.addEventListener("DOMContentLoaded", loadLoanCalc);

// For some reason DOMContentLoaded is firing early.
// document.onreadystatechange = function () {
//   if (document.readyState === "complete") {
//     loadTodo();
//   }
// }