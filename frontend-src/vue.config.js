module.exports = {
    publicPath: '/',
    outputDir: '../public/',
    assetsDir: 'vue',
    pages: {
        add_edu_item: {
            entry: 'src/add_edu_item.js',
            template: 'page_templates/add_edu_item.html',
            filename: 'add_edu_item.html',
        },
        courses: {
            entry: 'src/courses.js',
            template: 'page_templates/courses.html',
            filename: 'courses.html',
        },
        item: {
            entry: 'src/itemPage.js',
            template: 'page_templates/itemPage.html',
            filename: 'item.html',
        },
    }
};