

module.exports = function( app ){

  app.get('/api/status',function( req, res ){

    // @todo health checks for service dependencies

    return res.sendStatus(200);
  });

};
