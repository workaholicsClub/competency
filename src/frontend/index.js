const page = require('page');

const indexPageControllerFactory = require('./components/indexPage/Controller');
const indexPageViewFactory = require('./components/indexPage/View');

const testPageControllerFactory = require('./components/testPage/Controller');
const testPageViewFactory = require('./components/testPage/View');

const resultsControllerFactory = require('./components/resultsPage/Controller');
const resultsViewFactory = require('./components/resultsPage/View');

const coursesControllerFactory = require('./components/coursesPage/Controller');
const coursesViewFactory = require('./components/coursesPage/View');
const coursesListFactory = require('./components/coursesPage/CoursesListView');

const filterControllerFactory = require('./components/filter/Controller');
const filterViewFactory = require('./components/filter/View');

const notFoundControllerFactory = require('./components/notFoundPage/Controller');
const notFoundViewFactory = require('./components/notFoundPage/View');

const professionsFactory = require('./models/Professions');
const answersFactory = require('./models/SkillAnswers');
const coursesFactory = require('./models/Courses');
const filterFactory = require('./models/Filter');

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

    let stylesManager = jss.create(jsspreset());
    let rootElement = document.body;

    let config = configFactory();
    let tracker = trackerFactory(gtag, config);
    let professionsModel = professionsFactory({}, config);
    let answersModel = answersFactory({}, config);
    let coursesModel = coursesFactory({}, config);

    let coursesFilter = filterFactory({});

    page('/', function () {
        tracker.trackPageview('/');
        let indexView = indexPageViewFactory(rootElement, stylesManager);
        let indexController = indexPageControllerFactory(indexView, professionsModel);

        indexController.loadDataAndRenderIndexPage();
    });

    page('/test/:professionCode/:competencyCode?', function (context) {
        tracker.trackPageview(context.pathname);
        /**
         * @param {RouteContextHash} context
         */
        let testView = testPageViewFactory(rootElement, stylesManager);
        let testController = testPageControllerFactory(testView, professionsModel, answersModel, context.params.professionCode, context.params.competencyCode);

        testController.loadDataAndRenderIndexPage();
    });

    page('/results', function () {
        tracker.trackPageview('/results');
        let resultsView = resultsViewFactory(rootElement, stylesManager);
        let xhr = undefined;
        let resultsController = resultsControllerFactory(resultsView, professionsModel, answersModel, xhr, tracker);

        resultsController.loadDataAndRenderIndexPage();
    });

    page('/courses', function () {
        tracker.trackPageview('/courses');
        let coursesView = coursesViewFactory(rootElement, stylesManager);
        let listView = coursesListFactory(stylesManager);
        let filterView = filterViewFactory(false, stylesManager);
        let xhr = undefined;

        let filterController = filterControllerFactory(filterView, coursesFilter);

        let coursesController = coursesControllerFactory(coursesView, listView, filterController, professionsModel, answersModel, coursesModel, xhr, tracker);
        coursesController.loadDataAndRenderIndexPage();
    });

    page('*', function (context) {
        tracker.trackPageview(context.pathname);

        let view = notFoundViewFactory(rootElement, stylesManager);
        let controller = notFoundControllerFactory(view);

        controller.renderNotFoundPage();
    });

    page();
}

document.addEventListener("DOMContentLoaded", initAndGoToRoute);
