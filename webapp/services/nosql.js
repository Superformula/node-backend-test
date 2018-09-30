const path = require('path');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const app = global.__app;

module.exports = {

  connect: null,

  autoIncrement: null,

  models: {},

  init: function(){
    mongoose.connect( process.env.MONGODB_DSN, { useNewUrlParser: true } );

    this.autoIncrement = autoIncrement;
    this.autoIncrement.initialize( mongoose.connection );

    if( app.appModules )
      this.loadAppModules( app.appModules );    
  },

  loadAppModules: function( appModules ){

    var self = this;

    appModules.forEach(function( appModule ){
      self.models[ appModule.name ] = require( path.join( appModule.path , 'models' ))( self );
    });
  }
};
    

