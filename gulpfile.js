/* eslint-disable */

var browserify = require('browserify'),
    browserSync = require('browser-sync'),
    buffer = require('vinyl-buffer'),
    del = require('del'),
    extend = require('extend'),
    fs = require('fs'),
    gutil = require('gulp-util'),
    path = require('path'),
    plugins = require('gulp-load-plugins')(),
    runSequence = require('run-sequence'),
    source = require('vinyl-source-stream'),
    watchify = require('watchify'),
    gulp = require('gulp');

var environment = 'production',
    dest = {
        production: "deploy",
        development: ".tmp"
    },
    assets = {
        scripts: "./src/scripts",
        styles: "./src/styles",
        images: "./src/images",
        fonts: "./src/fonts",
        icons: "./src/icons",
        pages: "./src/pages"
    };

function destination(p) {
    return path.join(dest[environment], (p || ''));
}

function productionOnly(cb, opts) {
    if (environment === 'production') {
        return cb(opts);
    }

    return gutil.noop();
}

function developmentOnly(cb, opts) {
    if (environment === 'development') {
        return cb(opts);
    }

    return gutil.noop();
}

// ---------------------
// Cleanup
// ---------------------

gulp.task('clean', function(cb) {
    del([destination()], cb);
});

// ---------------------
// Static files
// ---------------------
gulp.task('iconfont', function() {
    return gulp.src([assets.icons + '/*.svg'])
        .pipe( plugins.iconfont({
            fontName: 'icons',
            appendCodepoints: true
        }))
        .pipe( gulp.dest(destination('assets/icons')) );
});

gulp.task('fonts', function() {
    return gulp.src([assets.fonts + '/**/*.*'])
        .pipe( gulp.dest(destination('assets/fonts')) );
});

gulp.task('images', function() {
    return gulp.src([assets.images + '/**/*.*'])
        .pipe( gulp.dest(destination('assets/images')) );
});

gulp.task('styles', function() {
    return gulp.src(assets.styles + '/**/*.scss')
        .pipe(plugins.plumber())
        .pipe(plugins.sass({ errLogToConsole: true }))
        .pipe(plugins.autoprefixer(['> 1%', 'last 2 versions']))
        .pipe(productionOnly(plugins.minifyCss))
        .pipe(gulp.dest(destination('assets/styles')))
        .pipe(developmentOnly(browserSync.reload, { stream: true }));
});

gulp.task('pages', function(){
    return gulp.src(assets.pages + '/**/*.hbs')
        .pipe(plugins.compileHandlebars({},{
            ignorePartials: true,
            batch: ['src/pages/partials']
        }))
        .pipe( plugins.rename({extname: '.html'}))
        .pipe(gulp.dest(destination()))
        .pipe(developmentOnly(browserSync.reload, { stream: true }));
});


// ---------------------
// Scripts
// ---------------------
gulp.task('scripts:vendor', function(){
    return gulp.src(assets.scripts + '/vendor/**/*.*')
        .pipe(gulp.dest(destination('scripts/vendor')));
});

gulp.task('scripts:build', function() {
    var bundler;
    var entry = assets.scripts + '/main.js';

    if (environment === 'development') {
        bundler = watchify(browserify(entry, watchify.args));
        bundler.on('update', rebundle);
    } else {
        bundler = browserify(entry);
    }

    function rebundle() {
        gutil.log('rebundle');
        return bundler.bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source('main.js'))
            .pipe(buffer())
            .pipe(productionOnly(plugins.uglify))
            .pipe(gulp.dest(destination('/scripts')))
            .pipe(developmentOnly(browserSync.reload, { stream: true }));
    }

    return rebundle();
});

// ---------------------
// Development Server
// ---------------------
gulp.task('server', function(){
    browserSync({
        server: {
            baseDir: destination()
        }
    });
});

// ---------------------
// User facing tasks
// ---------------------
gulp.task('watch', function() {
    gulp.watch(assets.images + '/**/*.*', ['images']);
    gulp.watch(assets.styles + '/**/*.scss', ['styles']);
    gulp.watch(assets.icons + '/*.svg', ['iconfont']);
    gulp.watch(assets.fonts + '/**/*.*', ['fonts']);
    gulp.watch(assets.pages + '/**/*.hbs', ['pages']);
});

gulp.task('build', function(callback) {
    runSequence('clean',
        ['styles', 'images', 'iconfont', 'fonts', 'pages', 'scripts:build', 'scripts:vendor'],
        callback);
});

gulp.task('dev', function(callback) {
    environment = 'development';
    runSequence('default', 'server', 'watch',  callback);
});

gulp.task('default', ['build']);
