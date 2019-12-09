const
  gulp  = require('gulp'),
  del = require('del'),
  plugins = require('gulp-load-plugins')(),
  syncOpts = {
    proxy       : 'dev.drama',
    files       : [
      'dist/**/*',
      'src/data.php'
    ],
    watchEvents : ['add', 'change', 'unlink', 'addDir', 'unlinkDir'],
    open        : false,
    notify      : false,
    ghostMode   : false,
    ui: {
      port: 8001
    }
  }
;
var browsersync = false;
console.log(plugins);


gulp.task('css-prod', () => {
  return gulp.src('./src/scss/app.scss')
  .pipe(plugins.sass())
  .pipe(plugins.groupCssMediaQueries())
  .pipe(plugins.autoprefixer({
    overrideBrowserslist: ['last 2 versions', '> 2%']
  }))
  .pipe(plugins.cssnano())
  .pipe(gulp.dest('./dist/assets/css/'));
});

gulp.task('css-dev', () => {
  return gulp.src('./src/scss/app.scss')
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.sass())
  .pipe(plugins.sourcemaps.write('.'))
  .pipe(gulp.dest('./dist/assets/css/'))
});

gulp.task('js-prod', () => {
  return gulp.src('./src/js/*.js')
  .pipe(plugins.deporder())
  .pipe(plugins.concat('app.js'))
  .pipe(plugins.babel({
			presets: ['@babel/env']
		}))
  .pipe(plugins.uglify({
    compress: {
      drop_console: true
    }
  }))
  .pipe(gulp.dest('./dist/assets/js/'));
});

gulp.task('js-dev', () => {
  return gulp.src('./src/js/*.js')
  .pipe(plugins.deporder())
  .pipe(plugins.concat('app.js'))
  .pipe(plugins.babel({
			presets: ['@babel/env']
		}))
  .pipe(gulp.dest('./dist/assets/js/'));
});

gulp.task('browsersync', () => {
  if (browsersync === false) {
    browsersync = require('browser-sync').create();
    browsersync.init(syncOpts);
  }
});

gulp.task('php', () => {
  return gulp.src('./src/templates/*.php')
  .pipe(plugins.php2html())
  .pipe(plugins.beautify.html({ indent_size: 2 }))
  .pipe(gulp.dest('./dist'))
});

gulp.task('imgs', () => {
  return gulp.src('./src/imgs/*')
  .pipe(gulp.dest('./dist/assets/imgs/'))
});

gulp.task('clean', () => {
  return del([
    './dist/*.html',
    './dist/assets/**/*'
  ])
});

gulp.task('watch:css', () => {
  gulp.watch('./src/scss/*.scss', gulp.series('css-dev', 'imgs'));
});

gulp.task('watch:js', () => {
  gulp.watch('./src/js/*.js', gulp.series('js-dev'));
});

gulp.task('watch:php', () => {
  gulp.watch('./src/templates/*.php', gulp.series('php'));
});

gulp.task('watch', gulp.parallel('watch:css', 'watch:js', 'watch:php'));
gulp.task('build', gulp.series('clean','php','imgs','css-prod','js-prod'));
gulp.task('default', gulp.parallel('browsersync','watch'));
