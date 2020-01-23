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

  weMobile: window.matchMedia("(max-width: 767px)"),
  weTablet: window.matchMedia("(min-width: 768px)"),
  weLargeScreen: window.matchMedia("(min-width: 1501px)"),
  
  createGUID: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
       var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
       return v.toString(16);
    });
 }
};

window.utils.elements = {};