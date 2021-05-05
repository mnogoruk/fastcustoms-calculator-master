const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InterpolateHtmlPlugin = require('interpolate-html-plugin')
require('dotenv').config()

const PUBLIC_PATH = '/';


module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist'), // base path where to send compiled assets
        publicPath: PUBLIC_PATH // base path where referenced files will be looked for
    },
    devServer: {
        contentBase: path.join(__dirname, './'), // where dev server will look for static files, not compiled
        publicPath: PUBLIC_PATH, //relative path to output path where devserver will look for compiled files
        hot: true,
        disableHostCheck: true,
        host: process.env.HOST,
        port: process.env.PORT,
        useLocalIp: false,
        open: process.env.BROWSER,
        historyApiFallback: true
    },
    resolve: {
        extensions: ['*', '.js', '.tsx'],
        alias: {
            '@': path.resolve(__dirname, 'src'), // shortcut to reference src folder from anywhere
            "./images/layers.png$": path.resolve(
                __dirname,
                "./node_modules/leaflet/dist/images/layers.png"
            ),
            "./images/layers-2x.png$": path.resolve(
                __dirname,
                "./node_modules/leaflet/dist/images/layers-2x.png"
            ),
            "./images/marker-icon.png$": path.resolve(
                __dirname,
                "./node_modules/leaflet/dist/images/marker-icon.png"
            ),
            "./images/marker-icon-2x.png$": path.resolve(
                __dirname,
                "./node_modules/leaflet/dist/images/marker-icon-2x.png"
            ),
            "./images/marker-shadow.png$": path.resolve(
                __dirname,
                "./node_modules/leaflet/dist/images/marker-shadow.png"
            )
        }
    },
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif)$/i, 
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[ext]'
                }
            },
            {
                test: /\leaflet.css$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"}
                ]
            },
            {
                // compile es6 jsx into normal ES5
                test: /\.(js|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(css)$/,
                exclude: /\leaflet.css$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                ]
            },
            {
                test: /\.svg$/,
                use: [
                    {
                      loader: 'svg-url-loader',
                      options: {
                        limit: 10000,
                      },
                    },
                  ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html",
            title: process.env.REACT_APP_TITLE
        }),
        new InterpolateHtmlPlugin({
            'PWA_TITLE': process.env.REACT_APP_TITLE,
            'PWA_VERSION': process.env.REACT_APP_VERSION
          })      
    ]
}