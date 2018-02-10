var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var l_data = new Schema({

  time : { type: String},
  val: { type: String}

});

model.exports = mongoose.model('light_data', l_data);
