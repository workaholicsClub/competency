const BaseModel = require('./Base');
const XhrModelMixin = require('./XhrModelMixin');

const courseModelFactory = require('./Course');
const deepClone = require('../classes/deepClone.fn');

let CourseCollection = {
    init: function (props, config, xhr) {
        this.initPropsAndEvents(props);
        this.initXhr(xhr);
        this.url = '/courses/recommend';
        this.config = config;
        this.ratings = [];

        this.recommendations = [];
        this.loadedCourses = [];
        this.isLoadedFlag = false;
    },

    setRatings: function (ratings) {
        this.ratings = deepClone(ratings);
    },

    getRatings: function () {
        return deepClone(this.ratings);
    },

    makeRequestUrl: function () {
        let ratings = this.getRatings();
        let competencyCodes = Object.keys(ratings);

        let queryParams = competencyCodes.reduce(function (accumulator, competencyCode) {
            accumulator.push('competency[' + competencyCode + ']=' + ratings[competencyCode]);
            return accumulator;
        }, []);
        let query = queryParams.join('&');

        return this.config.makeAbsoluteApiUrl(this.url) + '?' + query;
    },

    loadRecommendations: function () {
        this.isLoadedFlag = false;
        this.load();
    },

    getFieldData: function (fieldCode, fieldsData) {
        return fieldsData.reduce(function (accumulator, fieldData) {
            if (fieldData.code === fieldCode) {
                return fieldData;
            }

            return accumulator;
        }, false);
    },

    getCompetencySkills: function (competencyCode, competencies) {
        let competency = this.getFieldData(competencyCode, competencies);
        return competency ? competency.skills : false;
    },

    prepareSkillsField: function (fieldCode, answersModel, fieldsData) {
        let answerCodes = answersModel.getSkillLevelsCode();
        let userSkillsFieldData = this.getFieldData(fieldCode, fieldsData);
        let professionCompetencies = userSkillsFieldData.variants;
        let context = this;
        let queryParams = [];

        professionCompetencies.forEach(function (competency) {
            let competencyCode = competency.code;
            let skills = this.getCompetencySkills(competencyCode, userSkillsFieldData.variants);
            let answers = answersModel.get(competencyCode);

            skills.forEach(function (skill, index) {
                let answer = (answers instanceof Array) ? (answers[index] || 0): 0;
                let answerCode = answerCodes[answer];

                queryParams.push( fieldCode+'['+skill.id+']='+answerCode );
            }, context);
        }, context);

        return queryParams;
    },

    makeFilterUrl: function (filterModel, answersModel, fieldsData) {
        let filterParams = filterModel.getProps();

        let queryParams = this.prepareSkillsField('userSkills', answersModel, fieldsData);;
        let context = this;

        Object.keys(filterParams).forEach(function (fieldCode) {
            let fieldData = this.getFieldData(fieldCode, fieldsData);
            if (!fieldData) {
                return false;
            }

            if (fieldCode === 'userSkills') {
                return false;
            }

            let value = filterParams[fieldCode];
            if (!value) {
                return false;
            }

            if (fieldData.type === 'competency') {
                let fieldQueryParams = this.prepareSkillsField(fieldCode, answersModel, fieldsData);
                queryParams = queryParams.concat(fieldQueryParams);

                return false;
            }

            if (fieldData.type === 'checkbox') {
                queryParams.push( fieldCode + '=' + (value ? '1' : '0') );
                return false;
            }

            if (value instanceof Array) {
                let queryParamName = fieldCode+'[]';
                value.forEach(function (arrayValue) {
                    queryParams.push( queryParamName+'='+arrayValue );
                });
            }
            else {
                queryParams.push( fieldCode+'='+value );
            }


        }, context);

        let searchBaseUrl = '/courses/search';
        let query = queryParams.join('&');

        return this.config.makeAbsoluteApiUrl(searchBaseUrl) + '?' + query;
    },

    loadFilteredCourses: function (filterModel, answersModel, fieldsData) {
        let url = this.makeFilterUrl(filterModel, answersModel, fieldsData);
        this.isLoadedFlag = false;
        this.loadCustomUrl(url);
    },

    convertToCourseModelArray: function (courses) {
        return courses.reduce(function (accumulator, courseProps) {
            accumulator.push( courseModelFactory(courseProps) );
            return accumulator;
        }, []);
    },

    convertFromCourseModelArray: function (courseModels) {
        return courseModels.reduce(function (accumulator, courseModel) {
            accumulator.push( courseModel.getProps() );
            return accumulator;
        }, []);
    },

    afterLoad: function (xhr, event, response) {
        this.recommendations = this.convertToCourseModelArray(response.course);
        this.loadedCourses = this.convertToCourseModelArray(response.course);
        this.isLoadedFlag = true;
    },

    isLoaded: function () {
        return this.isLoadedFlag;
    },

    getRecommendations: function () {
        return this.convertFromCourseModelArray(this.recommendations);
    },

    getLoadedCourses: function () {
        return this.loadedCourses;
    }
};

CourseCollection = Object.assign(Object.create(BaseModel), CourseCollection);
CourseCollection = Object.assign(CourseCollection, XhrModelMixin);

/**
 * @param props
 * @param config
 * @param xhr
 * @returns {CourseCollection}
 */
module.exports = function (props, config, xhr) {
    if (!props) {
        props = {};
    }

    if (!xhr) {
        xhr = new XMLHttpRequest();
    }

    let courses = Object.create(CourseCollection);
    courses.init(props, config, xhr);

    return courses;
};