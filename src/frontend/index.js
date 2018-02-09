const page = require('page');

const indexPageControllerFactory = require('./components/indexPage/Controller');
const indexPageViewFactory = require('./components/indexPage/View');

const testPageControllerFactory = require('./components/testPage/Controller');
const testPageViewFactory = require('./components/testPage/View');

const resultsControllerFactory = require('./components/resultsPage/Controller');
const resultsViewFactory = require('./components/resultsPage/View');

const notFoundControllerFactory = require('./components/notFoundPage/Controller');
const notFoundViewFactory = require('./components/notFoundPage/View');

const professionsFactory = require('./models/Professions');
const answersFactory = require('./models/Answers');
const coursesFactory = require('./models/Courses');

const configFactory = require('./classes/Config');
const trackerFactory = require('./classes/GTagTracker');

const jss = require('jss');
const jsspreset = require('jss-preset-default').default;

const polyfillsFactory = require('./classes/Polyfills');

/**
 * @typedef {Object} RouteContextHash
 * @property {string} canonicalPath
 * @property {string} hash
 * @property {boolean} init
 * @property {Object.string} params
 * @property {string} path
 * @property {string} pathname
 * @property {string} querystring
 * @property {Object} state
 * @property {string} title
 */

function initAndGoToRoute() {
    polyfillsFactory();

    var stylesManager = jss.create(jsspreset());
    var rootElement = document.body;

    var config = configFactory();
    var tracker = trackerFactory(gtag, config);
    var professionsModel = professionsFactory({}, config);
    var answersModel = answersFactory({}, config);
    var coursesModel = coursesFactory({}, config);

    page('/', function () {
        tracker.trackPageview('/');
        var indexView = indexPageViewFactory(rootElement, stylesManager);
        var indexController = indexPageControllerFactory(indexView, professionsModel);

        indexController.loadDataAndRenderIndexPage();
    });

    page('/test/:professionCode/:competencyCode?', function (context) {
        tracker.trackPageview(context.pathname);
        /**
         * @param {RouteContextHash} context
         */
        var testView = testPageViewFactory(rootElement, stylesManager);
        var testController = testPageControllerFactory(testView, professionsModel, answersModel, context.params.professionCode, context.params.competencyCode);

        testController.loadDataAndRenderIndexPage();
    });

    page('/results', function () {
        tracker.trackPageview('/results');
        var resultsView = resultsViewFactory(rootElement, stylesManager);
        var xhr = undefined;
        var resultsController = resultsControllerFactory(resultsView, professionsModel, answersModel, coursesModel, xhr, tracker);

        resultsController.loadDataAndRenderIndexPage();
    });

    page('*', function (context) {
        tracker.trackPageview(context.pathname);

        var view = notFoundViewFactory(rootElement, stylesManager);
        var controller = notFoundControllerFactory(view);

        controller.renderNotFoundPage();
    });

    page();
}

document.addEventListener("DOMContentLoaded", initAndGoToRoute);
