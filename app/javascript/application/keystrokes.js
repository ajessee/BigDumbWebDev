var map = {}; // You could also use an array
// TODO: Finish this up
// TODO: Put in module
onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
    
    if (map[16] && map[91] && map[83]) {
      console.log("shift + command + s");
      document.getElementById("signin-icon").children[0].click();
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