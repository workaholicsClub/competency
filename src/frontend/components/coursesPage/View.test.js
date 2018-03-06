const coursesViewFactory = require('./View');
const jss = require('jss').default;

function getViewModel() {
    return {
    };
}

test('CoursesView.render и createDOM', function () {
    var DOMElement = document.createElement('div');
    var viewModel = getViewModel();

    var coursesView = coursesViewFactory(DOMElement, jss);
    var coursesDOM = coursesView.createDOM(viewModel);
    coursesView.render(viewModel);

    expect(coursesDOM).toBeInstanceOf(HTMLElement);
    expect(DOMElement.innerHTML).not.toEqual('');
    expect(DOMElement.innerHTML.indexOf('null')).toBe(-1);
    expect(DOMElement.innerHTML.indexOf('Поиск курсов')).toBeGreaterThan(0);
});

test('CoursesView.getters', function () {
    var DOMElement = document.createElement('div');
    var viewModel = getViewModel();

    var coursesView = coursesViewFactory(DOMElement, jss);
    coursesView.render(viewModel);

    var coursesContainer = coursesView.getCoursesContainer();
    var filterContainer = coursesView.getFilterContainer();

    expect(coursesContainer).toBeInstanceOf(HTMLElement);
    expect(filterContainer).toBeInstanceOf(HTMLElement);
});