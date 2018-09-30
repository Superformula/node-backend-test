module.exports = {

  weight: 0,

  action: function( app ){

    // @todo OAuth2 authentication, rate limiting, account status verification



    // request helper methods
    app.use(function( req , res , next ){

      res.apiResponse = { 
        data: null, 
        links: {
          self: req.protocol + '://' + req.get('host') + req.originalUrl
        }
      };

      next();
    });    

    return app;
  }
};