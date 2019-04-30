const
  gulp  = require('gulp'),
  plugins = require('gulp-load-plugins')(),
  syncOpts = {
    proxy       : 'dev.afept',
    files       : [
      '../../pages/**/*',
      'css/*',
      'js/*',
      'templates/**/*'
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
console.log(plugins);
var browsersync = false;


gulp.task('css-prod', () => {
  return gulp.src('./src/scss/*.scss')
  .pipe(plugins.sass())
  .pipe(plugins.groupCssMediaQueries())
  .pipe(plugins.autoprefixer({
    browsers: ['last 2 versions', '> 2%']
  }))
  .pipe(gulp.dest('./css/'));
});

gulp.task('css-dev', () => {
  return gulp.src('./src/scss/*.scss')
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.sass())
  .pipe(plugins.sourcemaps.write('.'))
  .pipe(gulp.dest('./css/'))
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
  .pipe(gulp.dest('./js/'));
});

gulp.task('js-dev', () => {
  return gulp.src('./src/js/*.js')
  .pipe(plugins.deporder())
  .pipe(plugins.concat('app.js'))
  .pipe(plugins.babel({
			presets: ['@babel/env']
		}))
  .pipe(gulp.dest('./js/'));
});

gulp.task('browsersync', () => {
  if (browsersync === false) {
    browsersync = require('browser-sync').create();
    browsersync.init(syncOpts);
  }
});

gulp.task('watch:css', () => {
  gulp.watch('./src/scss/*.scss', gulp.series('css-dev'));
});

gulp.task('watch:js', () => {
  gulp.watch('./src/js/*.js', gulp.series('js-dev'));
});

gulp.task('watch', gulp.parallel('watch:css', 'watch:js'));
gulp.task('build', gulp.parallel('css-prod','js-prod'));
gulp.task('default', gulp.parallel('browsersync','watch'));
