const path = require( 'path' );
const CKEditorWebpackPlugin = require( '@ckeditor/ckeditor5-dev-webpack-plugin' );
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );

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
        collection: {
            entry: 'src/collectionPage.js',
            template: 'page_templates/collection.html',
            filename: 'collection.html',
        },
        kupioxa: {
            entry: 'src/kupioxaPage.js',
            template: 'page_templates/kupioxa.html',
            filename: 'kupioxa.html',
        },
        steepest: {
            entry: 'src/steepestPage.js',
            template: 'page_templates/steepest.html',
            filename: 'steepest.html',
        },
        ducks: {
            entry: 'src/ducksPage.js',
            template: 'page_templates/ducks.html',
            filename: 'ducks.html',
        },
        slope: {
            entry: 'src/slopePage.js',
            template: 'page_templates/slope.html',
            filename: 'slope.html',
        },
    },

    transpileDependencies: [
        /ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/,
    ],

    configureWebpack: {
        plugins: [
            new CKEditorWebpackPlugin( {
                language: 'en'
            } )
        ]
    },

    devServer: {
        hot: false,
        liveReload: false
    },

    chainWebpack: config => {
        const svgRule = config.module.rule( 'svg' );

        svgRule.exclude.add( path.join( __dirname, 'node_modules', '@ckeditor' ) );

        config.module
            .rule( 'cke-svg' )
            .test( /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/ )
            .use( 'raw-loader' )
            .loader( 'raw-loader' );

        config.module
            .rule( 'cke-css' )
            .test( /ckeditor5-[^/\\]+[/\\].+\.css$/ )
            .use( 'postcss-loader' )
            .loader( 'postcss-loader' )
            .tap( () => {
                return styles.getPostCssConfig( {
                    themeImporter: {
                        themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' ),
                    },
                    minify: true
                } );
            } );
    }
};