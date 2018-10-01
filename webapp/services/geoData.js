const requestPromise = require('request-promise');
const googleMapsClient = require('@google/maps');
const app = global.__app;

module.exports = {

  gmapClient: null,

  nasaApiKey: process.env.NASA_API_KEY,

  nasaApiBaseurl: 'https://api.nasa.gov/planetary/earth/imagery/',

  init: function(){
 
    this.gmapClient = googleMapsClient.createClient({
      key: process.env.GMAP_API_KEY,
      Promise: Promise
    });
  },

  geoCode: function( address ){

    return this.gmapClient.geocode({address: address})
      .asPromise()
      .then((response) => {

        if(!response.json.results || response.json.results.length !== 1)
          return false;

        var result = response.json.results.pop();
        return result.geometry.location;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  },

  getNasaLandsatImages: function( lat , long ){

    return requestPromise({
      uri: `${this.nasaApiBaseurl}?api_key=${this.nasaApiKey}&lat=${lat}&lon=${long}`,
      json: true
      })
      .then(function( response ) {
        return response;
        return true;
      })
      .catch(function (err) {
        console.error(err);
        return false;
      });
  }
};
    

