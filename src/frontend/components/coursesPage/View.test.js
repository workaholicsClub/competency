const h = require('hyperscript');
const coursesViewFactory = require('./View');
const jss = require('jss').default;

function getViewModel() {
    return {
    };
}

function getCoursesView(DOMElement) {
    if (!DOMElement) {
        DOMElement = document.createElement('div');
    }

    let coursesView = coursesViewFactory(DOMElement, jss);

    return coursesView;
}

test('CoursesView.render и createDOM', function () {
    let DOMElement = document.createElement('div');
    let coursesView = getCoursesView(DOMElement);
    let coursesDOM = coursesView.createDOM(getViewModel());
    coursesView.render(getViewModel());

    expect(coursesDOM).toBeInstanceOf(HTMLElement);
    expect(DOMElement.innerHTML).not.toEqual('');
    expect(DOMElement.innerHTML.indexOf('null')).toBe(-1);
    expect(DOMElement.innerHTML.indexOf('Поиск курсов')).toBeGreaterThan(0);
});

test('CoursesView.getters', function () {
    let coursesView = getCoursesView();
    coursesView.render(getViewModel());

    let coursesContainer = coursesView.getCoursesContainer();
    let filterContainer = coursesView.getFilterContainer();

    expect(coursesContainer).toBeInstanceOf(HTMLElement);
    expect(filterContainer).toBeInstanceOf(HTMLElement);
});