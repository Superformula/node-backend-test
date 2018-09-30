const util = require('util');
const app = global.__app;

module.exports = function( app ){

  app.get('/api/users', async function(req,res){
    
    res.status(200);
    res.json(res.apiResponse);
  });

  app.get('/api/users/:userId([0-9]+)', async function(req,res){


    res.status(200);
    res.json(res.apiResponse);
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
      res.apiResponse.errors = [];

      Object.keys(ValidationError.errors).forEach(function( fieldName ){
        res.apiResponse.errors.push({
          id: fieldName,
          detail: ValidationError.errors[ fieldName ].message
        });
      });

      res.status(400);
      return res.json(res.apiResponse);
    }

    // @todo better if the uri is not hard-coded here
    res.location(`${req.getFullUrl()}/api/users/${UserInst.id}`);

    res.apiResponse.data = UserInst.getApiObject();

    res.status(201);
    res.json(res.apiResponse);
  });

  app.patch('/api/users/:userId([0-9]+)', async function(req,res){

    // @todo update updatedAt
    // @todo updated document

    res.sendStatus(200);
    res.json(res.apiResponse);
  });  

  app.delete('/api/users/:userId([0-9]+)', async function(req,res){

    var userModels = app.service.nosql.models.user;
    let doc;

    try {

      doc = await userModels.User.findOneAndDelete({ id: req.params.userId });

    } catch ( Error ) {

      console.error( Error );
      return res.sendStatus(400);
    }

    res.sendStatus( ( doc ? 204 : 404 ));    
  });  
};
