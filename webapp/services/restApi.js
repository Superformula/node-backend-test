const app = global.__app;

module.exports = {

  init: function(){
  
  },

  getResponse: function( data ){
    return { 
      data: data, 
      links: this.getLinks()
    };
  },  

  getErrorResponse: function( errors ){

    var apiErrors = [];

    Object.keys(errors).forEach(function( fieldName ){
      apiErrors.push({
        id: fieldName,
        detail: errors[ fieldName ].message
      });
    });    

    return { 
      errors: apiErrors,
      links: this.getLinks()
    };
  },

  getLinks: function(){
    return {
      self: app.getFullUrl()
    };
  },

  getListLinks: function( path, count, offset, limit ){

    var links = this.getLinks();

    links.first = app.getFullUrl(`${path}?offset=0&limit=${limit}`);

    var lastOffset = Math.max( 0, count - limit );
    links.last = app.getFullUrl(`${path}?offset=${lastOffset}&limit=${limit}`);

    var prevOffset = offset - limit;
    if( prevOffset >= 0 )
      links.prev = app.getFullUrl(`${path}?offset=${prevOffset}&limit=${limit}`);

    var nextOffset = offset + limit;
    if( nextOffset < count )
      links.next = app.getFullUrl(`${path}?offset=${nextOffset}&limit=${limit}`);    

    return links;
  }
};
