const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const server = require('browser-sync').create();

gulp.task('css', () => gulp.src('assets/less/style.less')
  .pipe(plumber())
  .pipe(sourcemap.init())
  .pipe(less())
  .pipe(postcss([
    autoprefixer(),
  ]))
  .pipe(sourcemap.write('.'))
  .pipe(gulp.dest('assets/css'))
  .pipe(server.stream()));

gulp.task('server', () => {
  server.init({
    server: '',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch('assets/less/**/*.less', gulp.series('css'));
  gulp.watch('/*.html').on('change', server.reload);
});

gulp.task('start', gulp.series('css', 'server'));
