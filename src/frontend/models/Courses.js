const BaseModel = require('./Base');
const XhrModelMixin = require('./XhrModelMixin');
const deepClone = require('../classes/deepClone.fn');

var CoursesModel = {
    init: function (props, config, xhr) {
        this.initPropsAndEvents(props);
        this.initXhr(xhr);
        this.url = '/courses/recommend';
        this.config = config;
        this.ratings = [];

        this.recommendations = [];
        this.isLoadedFlag = false;
    },

    setRatings: function (ratings) {
        this.ratings = deepClone(ratings);
    },

    getRatings: function () {
        return deepClone(this.ratings);
    },

    makeRequestUrl: function () {
        var ratings = this.getRatings();
        var competencyCodes = Object.keys(ratings);

        var queryParams = competencyCodes.reduce(function (accumulator, competencyCode) {
            accumulator.push('competency[' + competencyCode + ']=' + ratings[competencyCode]);
            return accumulator;
        }, []);
        var query = queryParams.join('&');

        return this.config.makeAbsoluteApiUrl(this.url) + '?' + query;
    },

    loadRecommendations: function () {
        this.isLoadedFlag = false;
        this.load();
    },

    afterLoad: function (xhr, event, response) {
        this.recommendations = response.course;
        this.isLoadedFlag = true;
    },

    isLoaded: function () {
        return this.isLoadedFlag;
    },

    getRecommendations: function () {
        return this.recommendations;
    }
};

CoursesModel = Object.assign(Object.create(BaseModel), CoursesModel);
CoursesModel = Object.assign(CoursesModel, XhrModelMixin);

/**
 * @param props
 * @param config
 * @param xhr
 * @returns {CoursesModel}
 */
module.exports = function (props, config, xhr) {
    if (!props) {
        props = {};
    }

    if (!xhr) {
        xhr = new XMLHttpRequest();
    }

    var courses = Object.create(CoursesModel);
    courses.init(props, config, xhr);

    return courses;
};