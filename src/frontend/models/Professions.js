const BaseModel = require('./Base');
const XhrModelMixin = require('./XhrModelMixin');
const deepClone = require('../classes/deepClone.fn');

/**
 * @typedef {Object} CompetencyHash
 * @property {number} id
 * @property {string} code
 * @property {string} name
 * @property {string} level1
 * @property {string} level2
 * @property {string} level3
 * @property {string} level4
 */

/**
 * @typedef {Object} GroupHash
 * @property {number} id
 * @property {string} code
 * @property {string} name
 * @property {CompetencyHash[]} competencies
 */

/**
 * @typedef {Object} ProfessionHash
 * @property {number} id
 * @property {string} code
 * @property {string} name
 * @property {number} competencyCount
 * @property {number} courseCount
 * @property {GroupHash[]} groups
 */

let ProfessionsModel = {
    init: function (props, config, xhr, professionCode) {
        this.initPropsAndEvents(props);
        this.initXhr(xhr);
        this.config = config;
        this.url = '/profession';
        this.professionCode = professionCode;

        /**
         * @property {ProfessionHash[]} professions
         */
        this.professions = this.get('profession') || [];

    },

    makeRequestUrl: function () {
        return this.config.makeAbsoluteApiUrl(this.url);
    },

    isLoaded: function () {
        return (this.professions instanceof Array) && (this.professions.length > 0);
    },

    afterLoad: function (xhr, event, response) {
        this.setPropsWithoutEvent(response);
        this.professions = this.get('profession');
    },

    /**
     * @returns {ProfessionHash[]|boolean}
     */
    getProfessions: function () {
        if (!this.professions) {
            return false;
        }

        var professionsModel = this;

        return this.professions.reduce(function (accumulator, currentProfession) {
            /**
             * @param {ProfessionHash} currentProfession
             */

            accumulator.push({
                code: currentProfession.code,
                name: currentProfession.name,
                competencyCount: currentProfession.competencyCount,
                courseCount: currentProfession.courseCount,
                timeToFill: professionsModel.getTimeToFillProfession(currentProfession.code)
            });

            return accumulator;
        }, []);
    },

    /**
     * @param {string} professionCode
     * @returns {ProfessionHash|boolean}
     */
    getProfession: function (professionCode) {
        var profession;

        for (var index = 0; index < this.professions.length; index++) {
            profession = this.professions[index];
            if (profession.code === professionCode) {
                return deepClone(profession);
            }
        }

        return false;
    },

    getTimeToFillProfession: function (professionCode) {
        var profession = this.getProfession(professionCode);
        if (!profession) {
            return false;
        }

        var minutesToFillCompetency = 1.5;
        var minutesToFill = Math.round(profession.competencyCount * minutesToFillCompetency);

        return minutesToFill;
    },

    /**
     * @param {string} professionCode
     * @returns {CompetencyHash[]|boolean}
     */
    getCompetencies: function (professionCode) {
        var profession = this.getProfession(professionCode);
        if (!profession) {
            return false;
        }

        return profession.groups.reduce(function (accumulator, currentGroup) {
            accumulator = accumulator.concat( deepClone(currentGroup.competencies) );
            return accumulator;
        }, []);
    },

    /**
     * @param {string} professionCode
     * @param {string} competencyCode
     * @returns {*}
     */
    getCompetencyAndIndex: function (professionCode, competencyCode) {
        var competencies = this.getCompetencies(professionCode);
        var competency;

        for (var index = 0; index < competencies.length; index++) {
            competency = competencies[index];
            if (competency.code === competencyCode) {
                return {competency: deepClone(competency), index: index};
            }
        }

        return false;
    },

    /**
     * @param professionCode
     * @param competencyCode
     * @returns {CompetencyHash}
     */
    getCompetency: function (professionCode, competencyCode) {
        var competencyAndIndex = this.getCompetencyAndIndex(professionCode, competencyCode);
        return competencyAndIndex.competency;
    },

    /**
     * @param {string} competencyCode
     * @returns {CompetencyHash|boolean}
     */
    getAnyProfessionCompetency: function (competencyCode) {
        var professions = this.getProfessions();

        for (var index in professions) {
            var profession = professions[index];

            var competency = this.getCompetency(profession.code, competencyCode);
            if (competency) {
                return competency;
            }
        }

        return false;
    },

    /**
     * @param professionCode
     * @param competencyCode
     * @returns {number}
     */
    getCompetencyIndex: function (professionCode, competencyCode) {
        var competencyAndIndex = this.getCompetencyAndIndex(professionCode, competencyCode);
        return competencyAndIndex.index;
    },

    setProfessionCode: function (professionCode) {
        this.professionCode = professionCode;
    },

    getProfessionCode: function () {
        return this.professionCode;
    }
};

ProfessionsModel = Object.assign(Object.create(BaseModel), ProfessionsModel);
ProfessionsModel = Object.assign(ProfessionsModel, XhrModelMixin);

/**
 * @param {Object} props
 * @param {Config} config
 * @param {XMLHttpRequest} xhr
 * @param {string} professionCode
 * @returns {ProfessionsModel}
 */
module.exports = function (props, config, xhr, professionCode) {
    if (!props) {
        props = {};
    }

    if (!xhr) {
        xhr = new XMLHttpRequest();
    }

    var professions = Object.create(ProfessionsModel);
    professions.init(props, config, xhr, professionCode);

    return professions;
};