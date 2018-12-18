/*
 *  Constants
 */
  
  // package vars
  const pkg = require('./package.json');

  // Fractal
  const fractal = require('@frctl/fractal').create();
  const logger = fractal.cli.console;
  const fs = require('fs');
  const path = require('path');

  // Fractal theme
  const mandelbrot = require('@frctl/mandelbrot');

  // Gulp
  const gulp = require('gulp');

/*
 *  Fractal configuration
 */

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

/*
 *  Gulp tasks
 */

  // fractal:start
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

  // fractal:map
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

  // default
