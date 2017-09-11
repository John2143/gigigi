let gulp = require("gulp");
let gutil = require("gulp-util");
let concat = require("gulp-concat");
let browserify = require("browserify");
let fs = require("fs");

let babel = require("gulp-babel");
let sourcemaps = require("gulp-sourcemaps");
let source = require("vinyl-source-stream");
let buffer = require("vinyl-buffer");
let changed = require("gulp-changed");

let isProduction = !!gutil.env.prod;
let watch = !!gutil.env.watch;

gulp.task("client", ["vue", "css"]);

gulp.task("vue", () => {
    let src = "./src/client/index.js"
    let br = browserify(src, {debug: !isProduction})
        .transform("babelify", {presets: [
            ["env", {
                targets: {
                    browsers: isProduction ? ["last 3 versions", "IE 11"] : ["last 1 version"]
                },
                useBuiltIns: true
            }],
        ], sourceMaps: isProduction ? undefined : true})
        .transform("vueify");

    if(isProduction){
        br = br.transform(require("envify/custom")({
                NODE_ENV: "production",
            }), {global: true})
            .transform("uglifyify", {global: true});
    }

    br = br.bundle()
        .pipe(source("index.js"));

    if(!isProduction){
        br.pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write("./"));
    }

    return br
        .pipe(gulp.dest("client"));
});

gulp.task("css", () => {
    return gulp.src("src/client/**/*.css")
        .pipe(changed("client"))
        .pipe(concat("index.css"))
        .pipe(gulp.dest("client"));
});

gulp.task("server", () => {
    return gulp.src(["src/shared/**/*.js", "src/server/**/*.js"])
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
        .pipe(gulp.dest("server"));
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
