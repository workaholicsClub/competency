const BaseModel = require('./Base');
const courseFactory = require('./Course');
const answersFactory = require('./Answers');
const professionsFactory = require('./Professions');
const searchMockData = require('../mocks/coursesSearch.json');
const professionsMockData = require('../mocks/professions.json');

test('CourseModel.interface', function () {
    let course = courseFactory({});

    expect(BaseModel.isPrototypeOf(course)).toBeTruthy();
    expect(course.addEventListener).toBeInstanceOf(Function);
    expect(course.removeEventListener).toBeInstanceOf(Function);
    expect(course.dispatchEvent).toBeInstanceOf(Function);
    expect(course.set).toBeInstanceOf(Function);
    expect(course.get).toBeInstanceOf(Function);
});

test('Course get set init', function () {
    let course = courseFactory({a: 1});

    course.set('b', 2);
    course.set('c', 3);

    expect(course.get('a')).toEqual(1);
    expect(course.get('b')).toEqual(2);
    expect(course.get('c')).toEqual(3);
});

test('Course getCompetencyAnswers', function () {
    let courseData = searchMockData.course[0];
    let professionsModel = professionsFactory(professionsMockData);
    let pythonCompetency = professionsModel.getCompetency('tester', 'python');
    let databasesCompetency = professionsModel.getCompetency('tester', 'databases');
    let course = courseFactory(courseData);
    let courseSkills = course.get('requirements');
    let expectedAnswers = [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    let answers = course.getCompetencyAnswers(courseSkills, pythonCompetency.skills);
    let noAnswers = course.getCompetencyAnswers(courseSkills, databasesCompetency.skills);
    expect(answers).toEqual(expectedAnswers);
    expect(noAnswers).toBeFalsy();
});

test('Course getRequirementsAsCompetencies', function () {
    let courseData = searchMockData.course[0];
    let professionsModel = professionsFactory(professionsMockData);
    let course = courseFactory(courseData);
    let expectedCompetencies = {
        "operatingSystems": 0.3,
        "python": 0.13
    };

    let testerCompetencies = professionsModel.getCompetencies('tester');
    let requiredCompetencies = course.getRequirementsAsCompetencies(testerCompetencies);
    expect(requiredCompetencies).toEqual(expectedCompetencies);
});

test('Course getSkillsAsCompetencies', function () {
    let courseData = searchMockData.course[0];
    let professionsModel = professionsFactory(professionsMockData);
    let course = courseFactory(courseData);
    let expectedCompetencies = {
        "baseWebDevelopment": 0.32,
        "operatingSystems": 0.09,
        "python": 0.03
    };

    let testerCompetencies = professionsModel.getCompetencies('tester');
    let skillsCompetencies = course.getSkillsAsCompetencies(testerCompetencies);
    expect(skillsCompetencies).toEqual(expectedCompetencies);
});

test('Course getSkillsAsCompetencies, проценты', function () {
    let courseData = searchMockData.course[2];
    let professionsModel = professionsFactory(professionsMockData);
    let course = courseFactory(courseData);
    let answers = answersFactory({}, {}, false, {}, false);
    let expectedPercent = 19;

    let testerCompetencies = professionsModel.getCompetencies('tester');
    let skillsCompetencies = course.getSkillsAsCompetencies(testerCompetencies);
    let ratingPercent = answers.getRatingPercent(skillsCompetencies.databases);

    expect(ratingPercent).toBeLessThanOrEqual(100);
    expect(expectedPercent).toEqual(expectedPercent);
});