const gulp = require("gulp");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const tailwindcss = require("tailwindcss");
const cleanCSS = require("clean-css");

const cssOptions = {
  compatibility: "*", // (default) - Internet Explorer 10+ compatibility mode
  inline: ["all"], // enables all inlining, same as ['local', 'remote']
  level: 2, // Optimization levels. The level option can be either 0, 1 (default), or 2, e.g.
};

gulp.task("copy:all", function () {
  return gulp
    .src(["./src/**/*", "!./src/assets/scss"])
    .pipe(gulp.dest("./dist"));
});

gulp.task("sass", function () {
  // generate tailwind
  return gulp
    .src(["./src/assets/scss/*.scss"])
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))

    .pipe(postcss([tailwindcss("./tailwind.config.js"), autoprefixer()]))
    .pipe(gulp.dest("./dist/assets/css"))
    .on("data", function (file) {
      const buferFile = new cleanCSS(cssOptions).minify(file.contents);
      return (file.contents = Buffer.from(buferFile.styles));
    })
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./dist/assets/css"));
});

gulp.task("default", () => {
  gulp.watch(
    ["./src/assets/scss/*.scss", "./src/*.html"],
    { ignoreInitial: false },
    gulp.parallel("sass")
  );
  gulp.watch(
    ["./src/assets/images/**/*", "./src/index.html"],
    { ignoreInitial: false },
    gulp.series(["copy:all"])
  );
});


gulp.task('build', gulp.series('copy:all', 'sass'));
