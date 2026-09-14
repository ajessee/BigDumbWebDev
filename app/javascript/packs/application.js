// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

// Shakapacker doesn't auto-detect a same-named application.scss under packs/ as its own
// CSS entry the way Webpacker did - import it directly so mini-css-extract-plugin still
// emits it as part of the "application" entry, keeping stylesheet_pack_tag working.
require("./application.scss")

require("@rails/ujs").start()
require("@rails/activestorage").start()
require("channels")
require("application")
require("@rails/actiontext")
