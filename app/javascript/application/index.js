// Load all the channels within this directory and all subdirectories.
// Channel files must be named *_channel.js.

const application = require.context('.', true, /.js$/)
application.keys().forEach(application)
