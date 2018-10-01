const path = require('path');
var express = require('express');
var app = express();
const http = require('http');
const bodyParser = require('body-parser');
const glob = require("glob");

global.__app = app;
app.basefilepath = __dirname;
app.appModulePath = path.join( __dirname , 'app_modules' );
app.appModules = [];
app.service = {};

app.requireService = function( services ){
  if( typeof services != 'object' )
    services = [ services ];

  services.forEach(function( serviceName ){
    var serviceModule = require ( path.join( __dirname , 'services' , serviceName ) );

    if( typeof serviceModule.init == 'function' )
      serviceModule.init();

    app.service[ serviceName ] = serviceModule;
  });

  if( services.length === 1)
    return app.service[ services.pop() ];  
};

// Small, globally available helper methods and functions (i.e. string pad)
app.requireService('helpers');

app.use(function( req, res, next ){

  app.getFullUrl = function( path = '' ){
    if(!path)
      path = req.originalUrl;
    return `${req.protocol}://${req.get('host')}${path}`;
  };

  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*
 * Load app modules
 */

glob.sync( path.join( app.appModulePath , '*/' ) ).forEach(function( modulePath ){
  app.appModules.push({
    name: path.basename( modulePath ),
    path: modulePath
  });
});

// Load core services
app.requireService(['nosql','restApi']);


// App module middleware
var middlewareModules = [];
app.appModules.forEach(function(appModule){
  var middlewareModule = require(path.join( appModule.path , 'middleware' ));
  middlewareModules.push( middlewareModule );
});

// Allow for middleware execution order weighting
middlewareModules.sort(function(a,b){
  var aWeight = (typeof a == 'function' ? 0 : a.weight);
  var bWeight = (typeof b == 'function' ? 0 : b.weight);

  if( aWeight == bWeight )
    return 0;

  return (aWeight > bWeight ? 1 : -1);
});

middlewareModules.forEach(function( middlewareModule ){
  var middlewareFunc = (typeof middlewareModule == 'function' ? middlewareModule : middlewareModule.action );
  middlewareFunc( app );
});

// App modules routes
app.appModules.forEach(function( appModule ){
  require(path.join( appModule.path , 'routes' ))( app );
});


// Catch 404 and other errors
app.use(function(req, res, next) {
  console.error( '%s %s' , req.method , req.path );
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  console.error( err );
  res.sendStatus(err.status || 500);
});




/*
 * Configure express and start listening
 */

app.set('port', process.env.PORT || '3000' );
app.set('interface', ( process.env.INTERFACE || '127.0.0.1' ) );
app.disabled('x-powered-by');

const server = http.createServer(app);

server.on('error', function(error) {

  console.error( error );

  if (error.syscall !== 'listen')
    throw error;

  var port = app.get('port');

  switch (error.code) {
    case 'EACCES':
      console.error('%s requires elevated privileges',port);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error('Port %s is already in use',port);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on('listening', function onListening() {
  var addr = server.address();
  var bindTypeAddr = (typeof addr === 'string' ? 'pipe ' + addr : app.get('interface') + ':' + addr.port);
  console.log('Listening on %s', bindTypeAddr);
});

server.listen( app.get('port') , app.get('interface') );
