
const config = require('./builder.config');


config.win.target = ['appx'];
config.win.certificateFile = undefined;

module.exports = config;

