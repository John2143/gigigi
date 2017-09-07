let gulp = require("gulp");
let gutil = require("gulp-util");
let concat = require("gulp-concat");
let browserify = require("browserify");
let fs = require("fs");

let babel = require("gulp-babel");
let babelConfig = babel({
    "plugins": ["transform-es2015-modules-commonjs", "transform-decorators-legacy"]
});

let sourcemaps = require("gulp-sourcemaps");
let source = require("vinyl-source-stream");
let buffer = require("vinyl-buffer");

let isProduction = !!gutil.env.prod;
let watch = !!gutil.env.watch;

gulp.task("client", ["vue", "css"]);

gulp.task("vue", () => {
    let src = "./src/client/index.js"
    let br = browserify(src, {debug: !isProduction})
        .transform("babelify", {presets: ["es2015"], sourceMaps: !isProduction})
        .transform("vueify");

    if(isProduction){
        br = br.transform(require("envify/custom")({
                NODE_ENV: isProduction ? "production" : "development",
            }), {global: true})
            .transform("uglifyify", {global: true});
    }

    br = br.bundle();

    if(!isProduction){
        br = br.pipe(source("index.js"))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write("./"));
    }

    return br
        .pipe(gulp.dest("./client"));
});

gulp.task("css", () => {
    return gulp.src("src/client/**/*.css")
        .pipe(concat("index.css"))
        .pipe(gulp.dest("client"));
});

gulp.task("server", () => {
    return gulp.src(["src/shared/**/*.js", "src/server/**/*.js"])
        .pipe(babelConfig)
        .pipe(gulp.dest("server"));
});

gulp.task("watchclient", ["watchshared"], () => {
    gulp.watch("./src/client/**/*.vue", ["vue"]);
    gulp.watch("./src/client/**/*.js", ["vue"]);
    gulp.watch("./src/client/**/*.css", ["css"]);
});

gulp.task("watchshared", () => {
    console.log("run");
    gulp.watch("./src/shared/**/*.js", ["server", "vue"]);
});

gulp.task("watchserver", ["watchshared"], () => {
    gulp.watch("./src/server/**/*.js", ["server"]);
});

gulp.task("default", ["server", "client"]);

gulp.task("watch", ["watchserver", "watchclient"]);
