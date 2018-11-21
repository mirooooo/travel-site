// build.js is used for preparing our files go live.... Creating 'dist' folder and storing all minified uglyfied files there



var gulp = require("gulp");
// imagemin- minification images
var imagemin = require('gulp-imagemin');
// del - delete a folder
var del = require('del');
// usemin - Bundeling css and js files----- have to rap up in sandwich your css and js files in index.html 
var usemin = require('gulp-usemin');
// cssnano - minification css file
var cssnano = require('gulp-cssnano');
// ===========================
var rev = require('gulp-rev');
// for minification-compresing javascript
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();


gulp.task('previewDist', function () {
    browserSync.init({
        notify: false,
        server: {
            baseDir: "dist"
        }
    });
});



gulp.task('deleteDistFolder', function () {
    return del('./dist');
});

gulp.task("optimizeImages", ['deleteDistFolder', 'icons'], function () {
    return gulp.src(["./app/assets/images/**/*", "!./app/assets/images/icons", "!./app/assets/images/icons/**/*"])
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            multipass: true
        }))
        .pipe(gulp.dest("./dist/assets/images"));
});

gulp.task('usemin', ['deleteDistFolder', 'styles', 'scripts'], function () {
    return gulp.src('./app/index.html')
        .pipe(usemin({
            css: [function () {
                return rev()
            }, function () {
                return cssnano()
            }],
            js: [function () {
                return rev()
            }, function () {
                return uglify()
            }]
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task("build", ['deleteDistFolder', 'optimizeImages', 'usemin']);