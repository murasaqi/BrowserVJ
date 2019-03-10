const HtmlWebpackPlugin = require('html-webpack-plugin');
const outputDir = "docs";
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const env = process.env.NODE_ENV || 'development'
const isDevelopment = env === 'development'
const MODE = 'development';
const enabledSourceMap = (MODE === 'development');

module.exports = {
    mode: 'development',
    output: {
        path: __dirname + '/docs',
        filename: '[name]'
    },
    entry: {
        'js/main.js': './src/ts/main.ts',
        'js/childMain.js': './src/ts/childMain.ts',
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/pug/main.pug',
            inject: false
        }),

        new HtmlWebpackPlugin({
            filename: 'window.html',
            template: 'src/pug/window.pug',
            inject: false
        })
    ],

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            },
            {
                test: /\.pug$/,
                loader: ['raw-loader', 'pug-html-loader']
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // name: '../images/[name].[ext]'
                        }
                    }
                ]
            },

            {
                test: /\.scss/, // 対象となるファイルの拡張子
                use: [
                    // linkタグに出力する機能
                    'style-loader',
                    // CSSをバンドルするための機能
                    {
                        loader: 'css-loader',
                        options: {
                            // オプションでCSS内のurl()メソッドの取り込みを禁止する
                            url: false,
                            // ソースマップの利用有無
                            sourceMap: enabledSourceMap,

                            // 0 => no loaders (default);
                            // 1 => postcss-loader;
                            // 2 => postcss-loader, sass-loader
                            importLoaders: 2
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            // ソースマップの利用有無
                            sourceMap: enabledSourceMap,
                        }
                    }
                ],
            },
            {
                test: /\.(glsl|vs|fs|frag|vert)$/,
                loader: 'shader-loader'
            },
        ]
    },
    resolve: {
        extensions: [
            '.ts', '.js', '.json', '.pug', '.styl', '.glsl', '.frag', '.vert', '.scss'
        ],
    },
    devServer: {
        contentBase: path.resolve(__dirname, outputDir),
        port: 9266,
        host: "0.0.0.0"
    },
};
