const BaseController = require('../base/Controller');

var TestController = {
    init: function (view, professionsModel, professionCode, competencyCode) {
        this.view = view;
        this.professionsModel = professionsModel;
        this.professionCode = professionCode;
        this.competencyCode = competencyCode;
        this.element = view.getRootElement();
        this.events = [];
    },

    initEvents: function () {
        this.events = [
            {types: ['load'], target: this.professionsModel, handler: this.renderIndexPageAfterLoad}
        ];

        this.bindEvents();
    },

    loadDataAndRenderIndexPage: function () {
        this.initEvents();

        if (this.professionsModel.isLoaded()) {
            this.renderIndexPageAfterLoad();
        }
        else {
            this.professionsModel.load();
        }
    },

    getViewModel: function () {
        var profession = this.professionsModel.getProfession(this.professionCode);
        var competencies = this.professionsModel.getCompetencies(this.professionCode);
        var currentCompetency = this.professionsModel.getCompetency(this.professionCode, this.competencyCode) || competencies[0];
        var competencyIndex = this.professionsModel.getCompetencyIndex(this.professionCode, this.competencyCode) || 0;
        var nextCompetency = competencyIndex < competencies.length - 1 ? competencies[competencyIndex+1] : false;
        var group = currentCompetency.group;

        var levels = [];
        for (var index = 1; index <= 4; index++) {
            levels.push(currentCompetency['level'+index]);
        }

        return {
            'profession': profession,
            'competencies': competencies,
            'competenciesCount': competencies.length,
            'currentCompetency': currentCompetency,
            'nextCompetency': nextCompetency,
            'nextCompetencyLink': nextCompetency ? '/test/'+profession.code+'/'+nextCompetency.code : false,
            'competencyIndex': competencyIndex,
            'competencyGroup': group,
            'levels': levels
        };
    },

    renderIndexPageAfterLoad: function () {
        this.view.render(this.getViewModel());
    }

    /**
     * @method handleEvent
     * @method bindEvents
     */
};

TestController = Object.assign(Object.create(BaseController), TestController);

/**
 * @param view
 * @param professionsModel
 * @param professionCode
 * @param competencyCode
 * @returns {TestController}
 */
module.exports = function (view, professionsModel, professionCode, competencyCode) {
    var instance = Object.create(TestController);
    instance.init(view, professionsModel, professionCode, competencyCode);

    return instance;
};