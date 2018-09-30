const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

module.exports = function( nosql ){

  var userSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    dob: {
      type: String,
      required: false,
      validate: {
        validator: function(v) {
          if(!v)
            return true;
          if(!/\d{4}-\d{2}-\d{2}/.test(v))
            return false;
          return moment(v).isValid();
        },
        message: props => `The dob field should be a valid date in the format YYYY-MM-DD`      
      }
    },
    address: String,
    description: String,
    createdAt: Date,
    updatedAt: Date

  }, { timestamps: true });

  // @todo define this function elsewhere for DRY reuse in other schemas, maybe api app module middleware?
  userSchema.methods.getApiObject = function(){
    var apiData = this.toObject();
    delete apiData._id;
    delete apiData.__v;
    return apiData;
  };

  userSchema.plugin(nosql.autoIncrement.plugin, { 
    model: 'User',
    field: 'id',
    startAt: 1,
    incrementBy: 1
  });
  
  var User = mongoose.model('User', userSchema );

  return {
    User: User
  };
}