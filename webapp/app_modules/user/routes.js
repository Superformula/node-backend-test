
module.exports = function( app ){

  app.get('/api/users',function(req,res){
    
    res.status(200);
    res.json(res.apiResponse);
  });

  app.get('/api/users/:userId([0-9]+)',function(req,res){


    res.status(200);
    res.json(res.apiResponse);
  });

  // read only endpoint to fetch location information based off the user's address (use NASA or Mapbox APIs)
  app.get('/api/users/:userId([0-9]+)/location',function(req,res){


    res.status(200);
    res.json(res.apiResponse);
  });

  app.post('/api/users',function(req,res){

    // @todo location header matching self link

    // @todo newly created resource

    res.status(201);
    res.json(res.apiResponse);
  });

  app.patch('/api/users/:userId([0-9]+)',function(req,res){

    // @todo update updatedAt
    // @todo updated document

    res.sendStatus(200);
    res.json(res.apiResponse);
  });  

  app.delete('/api/users/:userId([0-9]+)',function(req,res){


    res.sendStatus(204);
  });  
};


/*

// create/read/update/delete

{
  "id": "xxx",                  // user ID (must be unique)
  "name": "backend test",       // user name
  "dob": "",                    // date of birth
  "address": "",                // user address
  "description": "",            // user description
  "createdAt": ""               // user created date
  "updatedAt": ""               // user updated date
}
*/
