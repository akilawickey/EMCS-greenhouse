var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var t_data = new Schema({

  time : { type: String},
  val: { type: String}

});

module.exports = mongoose.model('temp_data', t_data);
