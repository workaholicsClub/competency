const resultFactory = require('./View');
const jss = require('jss').default;

function getViewModel() {
    return {
        'competencies': [{
            code: 'codeQuality',
            name: 'Качество кода',
            rating: 4
        }]
    };
}

test('ResultView.render и createDOM', function () {
    var DOMElement = document.createElement('div');
    var viewModel = getViewModel();

    var resultView = resultFactory(DOMElement, jss);
    var resultDOM = resultView.createDOM(viewModel);
    resultView.render(viewModel);

    expect(resultDOM).toBeInstanceOf(HTMLElement);
    expect(DOMElement.innerHTML).not.toEqual('');
    expect(DOMElement.innerHTML.indexOf('null')).toBe(-1);
    expect(DOMElement.innerHTML.indexOf('Качество кода')).toBeGreaterThan(0);
});