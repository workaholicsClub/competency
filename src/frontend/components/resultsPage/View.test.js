const resultFactory = require('./View');
const stylesManager = require('../../classes/stylesManager');

function getViewModel() {
    return {
        "allCompetencies": [
            {
                "name": "Качество кода",
                "code": "codeQuality",
                "rating": 4,
                "ratingPercent": 100
            }
        ],
        "professionName": "Тестировщик (Python)",
        "professionCompetencies": [
            {
                "name": "Качество кода",
                "code": "codeQuality",
                "average": {
                    "lower": 25,
                    "upper": 50,
                    "average": 38,
                    "diff": -19
                },
                "rating": 0.25,
                "ratingPercent": 6
            },
            {
                "name": "Основы веб-программирования",
                "code": "baseWebDevelopment",
                "average": {
                    "lower": 25,
                    "upper": 50,
                    "average": 38,
                    "diff": false
                },
                "rating": false,
                "ratingPercent": false
            },
            {
                "name": "Операционная система",
                "code": "operatingSystems",
                "average": {
                    "lower": 25,
                    "upper": 50,
                    "average": 38,
                    "diff": -19
                },
                "rating": 0.25,
                "ratingPercent": 6
            }
        ]
    };
}

test('ResultView.render и createDOM', function () {
    let DOMElement = document.createElement('div');
    let viewModel = getViewModel();

    let resultView = resultFactory(DOMElement, stylesManager);
    let resultDOM = resultView.createDOM(viewModel);
    resultView.render(viewModel);

    expect(resultDOM).toBeInstanceOf(HTMLElement);
    expect(DOMElement.innerHTML).not.toEqual('');
    expect(DOMElement.innerHTML.indexOf('null')).toBe(-1);
    expect(DOMElement.innerHTML.indexOf('Качество кода')).toBeGreaterThan(0);
});

test('ResultView.getters', function () {
    let DOMElement = document.createElement('div');
    let viewModel = getViewModel();

    let resultView = resultFactory(DOMElement, stylesManager);
    resultView.render(viewModel);

    let saveButton = resultView.getSaveButton();
    let subscribeForm = resultView.getSubscribeForm();

    expect(saveButton).toBeInstanceOf(HTMLElement);
    expect(subscribeForm).toBeInstanceOf(HTMLFormElement);
});