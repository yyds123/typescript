const path = require('path') // 引用path模块
//引入插件
const htmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
module.exports = {  // 这里是common.js语法
    // 入口文件
    entry:"./src/index.ts",
    // 打包后的出口文件
    output:{
        // 输出的路径  是绝对路径(导入path模块) 这里是用node来做的
        path:path.resolve(__dirname,'build'),
        // 输出的文件名称
        filename:'bundle.js',
        //为了兼容ie，不使用箭头函数
        environment:{
            arrowFunction:false
        },
    },
    //打包所使用的模块
    module: {
        //指定加载的规则
        rules: [
            {
                //指定规则生效的文件
                test: /\.ts$/,
                use: [
                    {
                        loader: "babel-loader",
                        //设置Babel
                        options: {
                            //设置预定义的环境
                            presets:[
                                [
                                    //指定环境的插件
                                    "@babel/preset-env",
                                    //配置信息
                                    {
                                        targets:{
                                            "chrome":"88"//浏览器内核版本
                                        },
                                        "corejs":"3",
                                        //使用corejs的方式
                                        "useBuiltIns":"usage"//按需引入
                                    }
                                ]
                            ]
                        }
                    },
                    'ts-loader'],
                exclude: /node_modules/
            },
            {
                test:/\.less$/,
                use:[
                    'style-loader',
                    'css-loader',
                    //引入postcss解决css兼容性问题
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions:{
                                plugin:[
                                    [
                                        'postcss-preset-env',
                                        {
                                            'browsers':'last 2 versions'//兼容浏览器最新的两个版本
                                        }
                                    ],
                                ]
                            }
                        }
                    },
                    'less-loader'
                ]
            }
        ],

    },
    //设置插件
    plugins: [
        new CleanWebpackPlugin(),
        new htmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    //设置引用模块，设置后该后缀的文件可以使用模块化
    resolve: {
        extensions: ['.ts','.js']
    },
    // 使用开发模式打包
    mode:"development"
}
