// TODO: Finish this up, Put in module. Figure out what functionality I want from keyboard shortcuts.
var map = {}; // You could also use an array

onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
    
    if (map[16] && map[91] && map[83]) {
      console.log("shift + command + s");
      document.querySelector('#nav-menu-login') ? document.querySelector('#nav-menu-login').firstElementChild.click() : null;
      map = {}
    }

    // if (map[16] && map[91] && map[69]) {
    //   console.log("shift + command + e");
    //   document.getElementById("edit-profile-icon").children[0].click();
    //   map = {}
    // }

    // if (map[16] && map[91] && map[76]) {
    //   console.log("shift + command + l");
    //   document.getElementById("login-icon").children[0].click();
    // }
  
}