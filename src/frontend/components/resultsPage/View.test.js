const resultFactory = require('./View');
const jss = require('jss').default;

function getViewModel() {
    return {
        'allCompetencies': [{
            code: 'codeQuality',
            name: 'Качество кода',
            rating: 4
        }]
    };
}

test('ResultView.render и createDOM', function () {
    let DOMElement = document.createElement('div');
    let viewModel = getViewModel();

    let resultView = resultFactory(DOMElement, jss);
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

    let resultView = resultFactory(DOMElement, jss);
    resultView.render(viewModel);

    let saveButton = resultView.getSaveButton();
    let subscribeForm = resultView.getSubscribeForm();

    expect(saveButton).toBeInstanceOf(HTMLElement);
    expect(subscribeForm).toBeInstanceOf(HTMLFormElement);
});