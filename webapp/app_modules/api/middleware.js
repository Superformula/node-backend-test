module.exports = {

  weight: 0,

  action: function( app ){

    // @todo OAuth2 authentication, rate limiting, account status verification



    // request helper methods
    app.use(function( req , res , next ){

      req.getFullUrl = function(){
        return this.protocol + '://' + this.get('host');
      };

      res.apiResponse = { 
        data: null, 
        links: {
          self: req.getFullUrl() + req.originalUrl
        }
      };

      next();
    });    

    return app;
  }
};