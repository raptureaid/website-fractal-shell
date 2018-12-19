/* Package dependencies */
  // package vars
  const pkg = require('./package.json');

  // plugins
  const argv = require('minimist')(process.argv.slice(2));
  const autoprefixer = require('autoprefixer');
  const fractal = require('@frctl/fractal').create();
  const gulp = require('gulp');
  const mandelbrot = require('@frctl/mandelbrot');
  const postcss = require('gulp-postcss');
  const sass = require('gulp-sass');
  const sourcemaps = require('gulp-sourcemaps');
  const through2 = require('through2');


/* General configuration */
  // CSS processing
  var processors = [
    autoprefixer({cascade: false})
  ];

  // Flags
  var env = argv.env || '';
  var isProduction = env.toLowerCase() === 'production';

  // Fractal
  const logger = fractal.cli.console;
  const fs = require('fs');
  const path = require('path');


/* Fractal configuration */
  // general
  fractal.set('project.title', pkg.fractal.title);

  // components
  fractal.components.set('engine', pkg.fractal.engine)
    .set('path', pkg.paths.fractal.components)
    .set('ext', pkg.fractal.ext)
    .set('default.prefix', pkg.fractal.prefix);

  // documentation
  fractal.docs.set('path', pkg.paths.fractal.docs);

  // web
  fractal.web.set('builder.dest', pkg.paths.build.fractal);


/* Gulp tasks */

  /** fractal:build
   *
   *  Generate static site files to upload to production server
   */
  gulp.task('fractal:build', function(done){
    const builder = fractal.web.builder();

    // Status updates
    builder.on('progress', (completed, total) => logger.update(`Exported ${completed} of ${total} items`, 'info'));
    builder.on('error', err=> logger.error(err.message));

    // Complete
    return builder.build().then(() => {
      logger.success(`Fractal build completed.`);
    });
  });

  /** fractal:map
   *
   *  Generate a key:value map of component names:paths.
   *  Allows Craft to route to the correct component.
   */
  gulp.task('fractal:map', function(done){
    fractal.components.load().then(() => {
      const map = {};

      for (let item of fractal.components.flatten()) {
        map[`@${item.handle}`] = path.relative(pkg.paths.fractal.components, item.viewPath);
      }

      fs.writeFileSync(pkg.paths.fractal.map, JSON.stringify(map, null, 2), 'utf8');
    });

    done();
  });

  /** fractal:start
   *
   *  Starts the fractal server with browser sync. 
   *  Reloads page when changes are detected.
   */
  gulp.task('fractal:start', function(){
    const server = fractal.web.server({
      sync: true
    });

    // Report errors
    server.on('error', err => logger.error(err.message));

    // When components change, update map
    fractal.components.on('loaded', gulp.series('fractal:map'))
      .on('updated', gulp.series('fractal:map'));

    // Report status
    return server.start().then(() => {
      logger.success(`Fractal server is now running at ${server.url}`);
    });
  });

  /** sass
   *
   *  Compile SASS file(s) into CSS
   */
  gulp.task('sass', function(done){
    var includePaths = [
      './node_modules/normalize.css'
    ];

    // Default options (development)
    var sassOptions = {
      includePaths: includePaths,
      outputStyle: 'expanded'
    };

    // Production options
    if(isProduction){
      sassOptions.outputStyle = 'compressed';
    };

    return gulp.src(pkg.paths.fractal.scss)
      .pipe(isProduction ? through2.obj() : sourcemaps.init())
      .pipe(sass.sync(sassOptions).on('error', sass.logError))
      .pipe(postcss(processors))
      .pipe(isProduction ? through2.obj() : sourcemaps.write("."))
      .pipe(gulp.dest(pkg.paths.build.css));

    done();
  });

  // default
