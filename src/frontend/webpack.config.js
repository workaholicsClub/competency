const webpack = require('webpack');
const dotenv = require('dotenv');
const fs = require('fs');
const commonConfig = dotenv.parse( fs.readFileSync('../../.env') );

module.exports = {
    entry: './index.js',
    devServer: {
        headers: { 'Access-Control-Allow-Origin': '*' }
    },
    plugins: [
        new webpack.DefinePlugin({
            __STATIC_URL__: JSON.stringify(commonConfig.STATIC_URL),
            __API_URL__: JSON.stringify(commonConfig.API_URL),
            __GA_TRACKING_ID__: JSON.stringify(commonConfig.GA_TRACKING_ID),
            __AW_CAMPAIGN_ID__: JSON.stringify(commonConfig.AW_CAMPAIGN_ID),
            __AW_GOOGLE_CONVERSION_ID__: JSON.stringify(commonConfig.AW_GOOGLE_CONVERSION_ID)
        })
    ],
    output: {
        filename: '../../public/assets/index.build.js'
    }
};