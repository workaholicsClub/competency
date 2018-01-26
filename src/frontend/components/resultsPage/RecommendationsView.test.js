const footerFactory = require('./RecommendationsView');
const jss = require('jss').default;

test('RecommendationsView.createDOM', function () {
    var recommendationsView = footerFactory(jss);
    var viewDOM = recommendationsView.createDOM({});
    expect(viewDOM).toBeInstanceOf(HTMLElement);
});
