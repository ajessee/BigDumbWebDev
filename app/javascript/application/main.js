console.log("Creating Global Namespaces");

window.projects = {};

window.utils = {
  getUrlVars: function () {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
      vars[key] = value;
    });
    return vars;
  },

  htmlDecode: function (input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  },

  mobileScreenDetected: window.matchMedia("(max-width: 767px)").matches,
  tabletScreenDetected: window.matchMedia("(min-width: 768px)").matches,
  fullScreenDetected: window.matchMedia("(min-width: 1501px)").matches,
  
  createGUID: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
       var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
       return v.toString(16);
    });
 }
};

window.utils.elements = {};

window.utils.tempVars = {
  vh: window.innerHeight * 0.01
};

document.documentElement.style.setProperty('--vh', `${window.utils.tempVars.vh}px`);

// recalculate the --vh viewHeight CSS variable on window resize
window.addEventListener('resize', () => {
  window.utils.tempVars.vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${window.utils.tempVars.vh}px`);
});