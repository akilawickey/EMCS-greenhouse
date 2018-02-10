var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mqtt_status = new Schema({

  time : { type: String},
  mqtt_topic : { type: String},
  status: { type: String}

});

model.exports = mongoose.model('mqtt_store', mqtt_status);
