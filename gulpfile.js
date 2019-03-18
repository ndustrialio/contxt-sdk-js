const del = require('del');
const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const babelConfig = require('./package.json').babel;

function _build({ destination, moduleType }) {
  return gulp
    .src('src/**/*.js', { ignore: 'src/**/*.spec.js' })
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: babelConfig.presets.map((presetConfig) => {
          const hasOptions = Array.isArray(presetConfig);
          const presetName = hasOptions ? presetConfig[0] : presetConfig;
          const presetOptions = hasOptions ? presetConfig[1] : undefined;

          if (presetName !== 'env') {
            return presetConfig;
          }

          return [
            presetName,
            {
              ...presetOptions,
              modules: moduleType
            }
          ];
        })
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destination));
}

function cjs() {
  return _build({ destination: 'lib', moduleType: 'commonjs' });
}

function clean(cb) {
  return del(['esm/**/*', 'lib/**/*']);
}

function esm() {
  return _build({ destination: 'esm', moduleType: false });
}

function watchModules() {
  return gulp.watch('./src/**/*', gulp.parallel(cjs, esm));
}

exports.build = gulp.series(clean, gulp.parallel(cjs, esm));
exports.clean = clean;
exports.cjs = cjs;
exports.esm = esm;
exports.watch = gulp.series(clean, cjs, esm, watchModules);
