var map = {}; // You could also use an array
// TODO: Finish this up
onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
    
    if (map[16] && map[83]) {
      console.log("shift + s");
      document.getElementById("signin-icon").children[0].click();

    }

    if (map[16] && map[76]) {
      console.log("shift + l");
      document.getElementById("login-icon").children[0].click();

    }
    /* insert conditional here */
}