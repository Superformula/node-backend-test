const util = require('util');
const app = global.__app;

module.exports = function( app ){

  var restApi = app.service.restApi;

  app.get('/api/users', async function(req,res){

    var maxLimit = 100;
    var userModels = app.service.nosql.models.user;

    var offset = (req.query.offset ? Number(req.query.offset) : 0);
    var limit = (req.query.limit ? Number(req.query.limit) : maxLimit);

    if( limit < 1 || limit > maxLimit )
      limit = maxLimit;

    try {

      var docs = await userModels.User.find({}, null, { skip: offset, limit: limit });
      var docsCount = await userModels.User.countDocuments();

    } catch( Error ){

      console.error( Error );
      return res.sendStatus(400);
    }
    
    var apiResponseObject = restApi.getResponse();
    apiResponseObject.data = docs.map( (doc) => doc.getApiObject() );
    apiResponseObject.links = restApi.getListLinks( `/api/users`, docsCount, offset, limit );

    res.status(200);
    res.json( apiResponseObject );
  });


  app.get('/api/users/:userId([0-9]+)', async function(req,res){

    var userModels = app.service.nosql.models.user;

    try {

      var doc = await userModels.User.findOne({ id: req.params.userId });

    } catch( Error ){

      console.error( Error );
      return res.sendStatus(400);      
    }

    if(!doc)
      return res.sendStatus(404);

    res.status(200);
    res.json( restApi.getResponse( doc.getApiObject() ) );
  });


  // read only endpoint to fetch location information based off the user's address (use NASA or Mapbox APIs)
  app.get('/api/users/:userId([0-9]+)/location', async function(req,res){


    res.status(200);
    res.json(res.apiResponse);
  });


  app.post('/api/users', async function(req,res){

    var userModels = app.service.nosql.models.user;
    var UserInst = new userModels.User( req.body );

    try {

      await UserInst.save();

    } catch( ValidationError ) {

      console.error( ValidationError );
      res.status(400);
      return res.json(restApi.getErrorResponse( ValidationError.errors ));
    }

    res.status(201);

    var selfUrl = app.getFullUrl(`/api/users/${UserInst.id}`); // @todo better if the uri is not hard-coded here
    res.location( selfUrl );
    var apiResponseObject = restApi.getResponse( UserInst.getApiObject() );
    apiResponseObject.links.self = selfUrl;

    res.json( apiResponseObject );
  });


  app.patch('/api/users/:userId([0-9]+)', async function(req,res){

    var userModels = app.service.nosql.models.user;
    var doc;

    try {

      doc = await userModels.User.findOneAndUpdate( { id: req.params.userId }, req.body, { runValidators: true } );

    } catch ( ValidationError ) {

      console.error( Error );
      res.status(400);
      return res.json(restApi.getErrorResponse( ValidationError.errors ));
    }

    if(!doc)
      return res.sendStatus(404);

    res.status(204);
    res.json( restApi.getResponse( doc.getApiObject() ) );
  });  


  app.delete('/api/users/:userId([0-9]+)', async function(req,res){

    var userModels = app.service.nosql.models.user;
    var doc;

    try {

      doc = await userModels.User.findOneAndDelete({ id: req.params.userId });

    } catch ( Error ) {

      console.error( Error );
      return res.sendStatus(400);
    }

    res.sendStatus( ( doc ? 204 : 404 ));    
  });  
};
