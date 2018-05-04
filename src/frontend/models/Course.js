const BaseModel = require('./Base');
const answersFactory = require('./Answers');
const skillCodes = require('./Answers').skillCodes;

/**
 * @class
 * @alias BaseModel
 */
let CourseModel = {
    init: function (props, requirementsModel, skillsModel) {
        this.initPropsAndEvents(props);
        this.initRequirements(requirementsModel);
        this.initSkills(skillsModel);
    },

    initRequirements: function (requirementsModel) {
        this.requirementsModel = requirementsModel;
    },

    initSkills: function (skillsModel) {
        this.skillsModel = skillsModel;
    },

    getCompetencyAnswers: function (courseSkills, competencySkills) {
        let answers = [];
        let noAnswers = true;

        competencySkills.forEach(function (competencySkill) {
            let answer = 0;
            courseSkills.forEach(function (courseSkill) {
                if (courseSkill.id.toString() === competencySkill.id.toString()) {
                    let textAnswer = courseSkill.level;
                    answer = skillCodes.indexOf(textAnswer);
                }
            });

            noAnswers = noAnswers && answer === 0;

            answers.push(answer);
        });

        return noAnswers ? false : answers;
    },

    getRequirementsAsCompetencies: function (competencies) {
        let context = this;
        competencies.forEach(function (competency) {
            let requirementAnswers = this.getCompetencyAnswers(this.get('requirements'), competency.skills);
            if (requirementAnswers) {
                this.requirementsModel.setWithoutEvent(competency.code, requirementAnswers);
            }
        }, context);

        return this.requirementsModel.getAllRatings();
    },

    getSkillsAsCompetencies: function (competencies) {
        let context = this;
        competencies.forEach(function (competency) {
            let skillAnswers = this.getCompetencyAnswers(this.get('skills'), competency.skills);
            if (skillAnswers) {
                this.skillsModel.setWithoutEvent(competency.code, skillAnswers);
            }
        }, context);

        return this.skillsModel.getAllRatings();
    },

    getFullUrl: function (userId, sessionId) {
        let url = this.get('url');
        if (userId) {
            url += url.indexOf('?') > 0 ? '&' : '?';
            url += 'userId=' + userId;
        }

        if (sessionId) {
            url += url.indexOf('?') > 0 ? '&' : '?';
            url += 'sessionId=' + sessionId;
        }

        return url;
    }
};

CourseModel = Object.assign(Object.create(BaseModel), CourseModel);

function makeEmptyAnswersModel() {
    let props = {};
    let config = {};
    let xhr = false;
    let storage = {};
    let autoload = false;
    let instance = answersFactory(props, config, xhr, storage, autoload);

    return instance;
}


/**
 * @param props
 * @param requirementsModel
 * @param skillsModel
 * @returns {CourseModel}
 */
module.exports = function (props, requirementsModel, skillsModel) {
    if (!props) {
        props = {};
    }

    if (!requirementsModel) {
        requirementsModel = makeEmptyAnswersModel();
    }

    if (!skillsModel) {
        skillsModel = makeEmptyAnswersModel();
    }

    let instance = Object.create(CourseModel);
    instance.init(props, requirementsModel, skillsModel);

    return instance;
};