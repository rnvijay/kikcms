//////////////////////////////
// Gulp tasks
//////////////////////////////

let gulp = require('gulp');
let sourcemaps = require('gulp-sourcemaps');
let sass       = require('gulp-sass');
let postcss    = require('gulp-postcss');
let uglify     = require('gulp-uglify');
let concat     = require('gulp-concat');
let plumber    = require('gulp-plumber');

// Root folder
let rootFolder = '../resources/';

// Styles
gulp.task('styles', function () {
    return gulp.src([
        'sass/bootstrap/bootstrap-kikcms.scss',
        'sass/cms/*.scss',
        'sass/components/*.scss',
        'sass/components/**/*.scss',
        'sass/datatables/*.scss',
        'sass/tinymce/editor.scss'
    ])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss({zindex: false}))
        .pipe(concat('cms.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(rootFolder + 'css/'));
});

// Styles
gulp.task('stylesLogin', function () {
    return gulp.src([
        'sass/login/*.scss'
    ])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss({zindex: false}))
        .pipe(concat('login.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(rootFolder + 'css/'));
});

gulp.task('tinyMceContentStyle', function () {
    return gulp.src([
        'sass/tinymce/content.scss'
    ])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss({zindex: false}))
        .pipe(concat('content.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(rootFolder + 'css/tinymce'));
});

// Vendors styles
gulp.task('vendorsStyles', function () {
    return gulp.src([
        'sass/bootstrap/bootstrap.scss'
    ])
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss({zindex: false}))
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(rootFolder + 'css/'));
});

// Vendors styles
gulp.task('stylesFrontend', function () {
    return gulp.src([
        'sass/bootstrap/bootstrap.scss',
        'sass/bootstrap/bootstrap-kikcms.scss'
    ])
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss({zindex: false}))
        .pipe(concat('frontend.css'))
        .pipe(gulp.dest(rootFolder + 'css/'));
});

// Minimum requirements for the frontend
gulp.task('scriptsFrontend', function () {
    return gulp.src([])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('frontend.js'))
        .pipe(uglify())
        .pipe(gulp.dest(rootFolder + 'js/'));
});

// Scripts required for the backend
gulp.task('scriptsCms', function () {
    return gulp.src([
        'js/utils.js',
        'js/kikcms.js',
        'js/datatable/*.js',
        'js/finder/*.js',
        'js/webform/*.js',
        'js/datatables/*.js',
        'js/modules/*.js',
        'js/cms.js'
    ])
        .pipe(plumber())
        .pipe(concat('cms.js'))
        .pipe(uglify())
        .pipe(gulp.dest(rootFolder + 'js/'));
});

// scripts useful, but not required for Frontend
gulp.task('scriptsFrontend', function () {
    return gulp.src([
        'js/utils.js',
        'js/kikcms.js',
        'js/webform/webform.js'
    ])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('frontend/base.js'))
        .pipe(uglify())
        .pipe(gulp.dest(rootFolder + 'js/'));
});

// Vendors scripts Frontend
gulp.task('vendorsScriptsFrontend', function () {
    return gulp.src([
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js',
        'bower_components/bootstrap-sass/assets/javascripts/bootstrap/popover.js'
    ])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('frontend/vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest(rootFolder + 'js/'));
});

// Vendors scripts CMS
gulp.task('vendorsScriptsCms', function () {
    return gulp.src([
        'bower_components/jquery/dist/jquery.min.js',

        'bower_components/moment/min/moment.min.js',
        'bower_components/moment/locale/en-gb.js',
        'bower_components/moment/locale/nl.js',

        'bower_components/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
        'bower_components/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
        'bower_components/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
        'bower_components/bootstrap-sass/assets/javascripts/bootstrap/tab.js',
        'bower_components/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js',
        'bower_components/bootstrap-sass/assets/javascripts/bootstrap/popover.js',
        'bower_components/bootstrap-sass/assets/javascripts/bootstrap/modal.js',
        'bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
        'bower_components/typeahead.js/dist/typeahead.bundle.js'
    ])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest(rootFolder + 'js/'));
});

// Watch task
gulp.task('watch', gulp.series('styles', 'scriptsCms', function () {
    gulp.watch('sass/**/*.scss', gulp.series('styles', 'stylesLogin', 'tinyMceContentStyle'));
    gulp.watch('js/**/*.js', gulp.series('scriptsCms', 'scriptsFrontend'));
}));
