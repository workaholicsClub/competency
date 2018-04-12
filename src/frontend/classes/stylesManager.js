const jss = require('jss');
const jsspreset = require('jss-preset-default').default;

let stylesManager = jss.create(jsspreset());

module.exports = stylesManager;