const listViewFactory = require('./CoursesListView');
const jss = require('jss').default;

test('CoursesView.createDOM', function () {
    var coursesView = listViewFactory(jss);
    var viewDOM = coursesView.createDOM({});
    expect(viewDOM).toBeInstanceOf(HTMLElement);
});
