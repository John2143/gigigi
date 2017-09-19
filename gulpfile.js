let fs = require("fs");

let gulp = require("gulp");
let babel = require("gulp-babel");
let changed = require("gulp-changed");
let gutil = require("gulp-util");
let concat = require("gulp-concat");
let plumber = require("gulp-plumber");

let rollup = require("rollup");
let rollupBabel = require("rollup-plugin-babel");
let rollupVue = require("rollup-plugin-vue2");
let rollupResolve = require("rollup-plugin-node-resolve");
let rollupReplace = require("rollup-plugin-replace");
let rollupUglify = require("rollup-plugin-uglify");

let isProduction = !!gutil.env.prod;
let watch = !!gutil.env.watch;

gulp.task("client", ["vue", "css"]);

gulp.task("vue", async () => {
    const bundle = await rollup.rollup({
        input: "./src/client/index.js",
        sourcemap: true,
        banner: `
            /*wow banner so cool*/
        `,
        plugins: [
            rollupReplace({
                "process.env.NODE_ENV": isProduction ? '"production"' : '"development"',
                "SERVER": false,
                "CLIENT": true,
                "PRODUCTION": isProduction,
            }),
            rollupResolve({
                browser: true,
            }),
            rollupVue(),
            isProduction && rollupBabel({
                presets: [
                    ["env", {
                        targets: {
                            browsers: ["last 3 versions", "IE 11"],
                        },
                        useBuiltIns: true,
                        modules: false,
                    }],
                ],
                plugins: [
                    //"external-helpers"
                ]
            }),
            isProduction && rollupUglify({
            }),
        ]
    });

    await bundle.write({
        file: "./client/index.js",
        format: "iife",
        name: "index",
        sourcemap: true
    });
});

gulp.task("css", () => {
    return gulp.src("src/client/**/*.css")
        .pipe(changed("client"))
        .pipe(concat("index.css"))
        .pipe(gulp.dest("client"));
});

let taskHasError;
let chalk = require("chalk");
function handleError(e){
    taskHasError = true;
    if(e.name === "SyntaxError"){
        handleSyntaxError(e);
    }else{
        gutil.log(chalk`{red ${e}}`);
    }
}

function handleSyntaxError(e){
    let message = /(.+?): ([^(]+)/g.exec(e.message);
    if(message){
        gutil.log(chalk`{red ${e.name}} in {grey ${message[1]}} at {bold.cyan ${e.loc.line}}:{bold.cyan ${e.loc.column}}`);
        gutil.log(chalk`{red.bold ${message[2]}}\n${e.codeFrame}\n`);
    }else{
        gutil.log(chalk.red(e.message) + "\n" + e.codeFrame + "\n");
    }
}

gulp.task("server", () => {
    taskHasError = false;
    return gulp.src(["src/shared/**/*.js", "src/server/**/*.js"])
        .pipe(plumber(handleError))
        .pipe(changed("server"))
        .pipe(babel({
            presets: [
                ["env", {
                    targets: {
                        node: "current"
                    },
                    useBuiltIns: true
                }],
            ],
            plugins: [
                "transform-decorators-legacy",
            ]
        }))
        .pipe(gulp.dest("server"))
        .on("end", x => {
            if(taskHasError){
                gutil.log(chalk`{red Build failed.}`);
            }else{
                gutil.log(chalk`{green Build completed sucessfully.}`);
            }
        });
});

gulp.task("watchclient", () => {
    gulp.watch("./src/client/**/*.vue", ["vue"]);
    gulp.watch("./src/client/**/*.js", ["vue"]);
    gulp.watch("./src/client/**/*.css", ["css"]);
    gulp.watch("./src/shared/**/*.js", ["vue"]);
});

gulp.task("watchserver", () => {
    gulp.watch("./src/server/**/*.js", ["server"]);
    gulp.watch("./src/shared/**/*.js", ["server"]);
});

gulp.task("default", ["server", "client"]);

gulp.task("watch", ["watchserver", "watchclient"]);
