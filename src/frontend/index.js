const page = require('page');
const indexPageControllerFactory = require('./components/indexPage/Controller');
const indexPageViewFactory = require('./components/indexPage/View');
const professionsModelFactory = require('./models/Professions');

const configFactory = require('./classes/Config');

const jss = require('jss');
const jsspreset = require('jss-preset-default').default;

const polyfillsFactory = require('./classes/Polyfills');


function initAndGoToRoute() {
    polyfillsFactory();

    var stylesManager = jss.create(jsspreset());
    var rootElement = document.body;

    var config = configFactory();
    var professionsModel = professionsModelFactory({}, config);

    page('/', function () {
        var indexView = indexPageViewFactory(rootElement, stylesManager);
        var indexController = indexPageControllerFactory(indexView, professionsModel);

        indexController.loadDataAndRenderIndexPage();
    });

    page('/test/:professionCode', function (context) {
        rootElement.innerHTML = JSON.stringify(context);
    });

    page();
}


document.addEventListener("DOMContentLoaded", initAndGoToRoute);
