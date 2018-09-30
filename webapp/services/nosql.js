const path = require('path');
const mongoose = require('mongoose');
const app = global.__app;

module.exports = {

  models: {},

  init: function(){
    mongoose.connect( process.env.MONGODB_DSN, { useNewUrlParser: true } );

    if( app.appModules )
      this.loadAppModules( app.appModules );    
  },

  loadAppModules: function( appModules ){

    var models = {};

    appModules.forEach(function( appModule ){
      models[ appModule.name ] = require( path.join( appModule.path , 'models' ))( this );
    });

    this.models = models;
  }
};
    

