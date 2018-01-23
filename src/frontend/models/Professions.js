const BaseModel = require('./Base');

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
 * @property {GroupHash[]} groups
 */

var ProfessionsModel = Object.assign(Object.create(BaseModel), {
    init: function (props, config, xhr) {
        this.initPropsAndEvents(props);
        this.xhr = xhr;
        this.config = config;
        /**
         * @property {ProfessionHash[]} professions
         */
        this.professions = this.get('profession') || [];

        this.isLoading = false;

        if (this.xhr) {
            this.bindXhrEvents();
        }
    },

    isLoaded: function () {
        return (this.professions instanceof Array) && (this.professions.length > 0);
    },

    load: function () {
        if (this.isLoading || this.isLoaded()) {
            return;
        }

        var professionsUrl = this.config.makeAbsoluteApiUrl('/profession');

        this.isLoading = true;
        this.xhr.open("GET", professionsUrl);
        this.xhr.send();
    },

    bindXhrEvents: function () {
        var professionsModel = this;
        var xhr = this.xhr;

        this.xhr.addEventListener("load", function (event) {
            professionsModel.handleLoad.call(professionsModel, xhr, event);
        });

        this.xhr.addEventListener("error", function (event) {
            professionsModel.handleLoadError.call(professionsModel, xhr, event);
        });

        this.xhr.addEventListener("abort", function (event) {
            professionsModel.handleLoadError.call(professionsModel, xhr, event);
        });
    },

    handleLoad: function (xhr, event) {
        var professionsModel = this;
        this.isLoading = false;

        try {
            var response = JSON.parse(xhr.responseText);
            this.setPropsWithoutEvent(response);
            this.professions = this.get('profession');
        }
        catch (exception) {
            professionsModel.handleLoadError.call(professionsModel, xhr, event);
        }

        this.dispatchModelEvent('load');
    },

    /**
     * @returns {ProfessionHash[]|boolean}
     */
    getProfessions: function () {
        if (!this.professions) {
            return false;
        }

        return this.professions.reduce(function (accumulator, currentProfession) {
            /**
             * @param {ProfessionHash} currentProfession
             */

            accumulator.push({
                code: currentProfession.code,
                name: currentProfession.name
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
                return profession;
            }
        }

        return false;
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
            accumulator = accumulator.concat(currentGroup.competencies);
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
                return {competency: competency, index: index};
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
     * @param professionCode
     * @param competencyCode
     * @returns {number}
     */
    getCompetencyIndex: function (professionCode, competencyCode) {
        var competencyAndIndex = this.getCompetencyAndIndex(professionCode, competencyCode);
        return competencyAndIndex.index;
    },

    handleLoadError: function (xhr, event) {
        this.isLoading = false;
        this.dispatchModelEvent('loadError');
    }
});

/**
 * @param props
 * @param config
 * @param xhr
 * @returns {ProfessionsModel}
 */
module.exports = function (props, config, xhr) {
    if (!props) {
        props = {};
    }

    if (!xhr) {
        xhr = new XMLHttpRequest();
    }

    var professions = Object.create(ProfessionsModel);
    professions.init(props, config, xhr);

    return professions;
};