const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        datepicker: './src/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'DatePicker',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },
    module: {
        rules: [{
                test: /\.(html|svg|hbs)$/,
                use: ['raw-loader']
            },
            {
                test: /\.scss/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                    'postcss-loader'
                ]
            }
        ]
    }
};