var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

  date : { type: String},
  rule_name : { type: String},
  actuator_type: { type: String},
  from: { type: String},
  to: { type: String}

});

model.exports = mongoose.model('data_store', userSchema);
