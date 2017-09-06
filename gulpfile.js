let gulp = require("gulp");
let gutil = require("gulp-util");
let merge = require("merge-stream");
let pump = require("pump");

let babel = require("gulp-babel");
let babelConfig = babel({
    "plugins": ["transform-es2015-modules-commonjs", "transform-decorators-legacy"]
});

let uglify = require("gulp-uglify");
let webpacks = require("webpack-stream");
let webpack = require("webpack");

gulp.task("client", ["vue"]);

gulp.task("vue", () => {
    return pump([
        gulp.src("src/client/index.js"),
        webpacks({
            watch: gutil.env.watch ? true : false,
            output: {
                filename: "index.js",
            },
            resolve: {
                alias: {
                    'vue$': 'vue/dist/vue.esm.js',
                },
            },
            module: {
                rules: [
                    {
                        test: /\.vue$/,
                        loader: 'vue-loader',
                    },
                    {
                        test: /\.js$/,
                        loader: 'babel-loader',
                    },
                ],
            },
            plugins: [
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: '"development"'
                    }
                })
            ]
        }),
        gulp.dest("client"),
    ]);
});

gulp.task("server", () => {
    return gulp.src(["src/shared/**/*.js", "src/server/**/*.js"])
        .pipe(babelConfig)
        .pipe(gulp.dest("server"));
});

gulp.task("default", ["server", "client"]);
