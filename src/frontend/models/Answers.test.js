const BaseModel = require('./Base');
const answersFactory = require('./Answers');

test('AnswersModel.interface', function () {
    var answersModel = answersFactory({});

    expect(BaseModel.isPrototypeOf(answersModel)).toBeTruthy();
    expect(answersModel.addEventListener).toBeInstanceOf(Function);
    expect(answersModel.removeEventListener).toBeInstanceOf(Function);
    expect(answersModel.dispatchEvent).toBeInstanceOf(Function);
    expect(answersModel.set).toBeInstanceOf(Function);
    expect(answersModel.get).toBeInstanceOf(Function);
});

test('AnswersModel.getCompetencyRating', function () {
    var answers = answersFactory({});

    answers.set('competencyA', [5, 5, 4, 2]);
    answers.set('competencyB', [3, 5, 5, 4]);
    answers.set('competencyC', [1, 1, 1, 1]);
    answers.set('competencyD', [0, 0, 0, 0]);
    answers.set('competencyE', [0, 0, 0]);
    answers.set('competencyF', 'z');
    answers.set('competencyG', false);

    expect(answers.getCompetencyRating('competencyA')).toEqual(4);
    expect(answers.getCompetencyRating('competencyB')).toEqual(4.25);
    expect(answers.getCompetencyRating('competencyC')).toEqual(1);
    expect(answers.getCompetencyRating('competencyD')).toBeFalsy();
    expect(answers.getCompetencyRating('competencyE')).toBeFalsy();
    expect(answers.getCompetencyRating('competencyF')).toBeFalsy();
    expect(answers.getCompetencyRating('competencyG')).toBeFalsy();
    expect(answers.getCompetencyRating('competencyH')).toBeFalsy();
});

test('AnswersModel.getAllRatings', function () {
    var answers = answersFactory({});
    var expectedRatings = {
        "competencyA": 4,
        "competencyB": 4.25,
        "competencyC": 1,
        "competencyD": false,
        "competencyE": false
    };

    answers.set('competencyA', [5, 5, 4, 2]);
    answers.set('competencyB', [3, 5, 5, 4]);
    answers.set('competencyC', [1, 1, 1, 1]);
    answers.set('competencyD', [0, 0, 0, 0]);
    answers.set('competencyE', false);

    expect(answers.getAllRatings()).toEqual(expectedRatings);
});