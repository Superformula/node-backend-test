

String.prototype.ucfirst = function(){
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

String.prototype.hyphenCamelCase = function(){
    return this.replace(/-([a-z])/g, function (s) { return s[1].toUpperCase(); });
  };

Number.prototype.withCommas = function(){
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

Array.prototype.intersect = function( a ){
  return this.filter(value => -1 !== a.indexOf(value));
};

module.exports = {};