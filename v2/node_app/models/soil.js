var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var s_data = new Schema({

  time : { type: String},
  val: { type: String}

});

model.exports = mongoose.model('soil_data', s_data);
