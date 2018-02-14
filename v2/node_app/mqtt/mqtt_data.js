var mqtt = require('mqtt');
var Rules = require('../models/rules_data');
var hum = require('../models/hum');
var light = require('../models/light');
var soil = require('../models/soil');
var temp = require('../models/temp');
var mongoose = require('mongoose');

var client = mqtt.connect('mqtt://139.59.23.178');
var t_p,h_p,s_p,l_p;

var uristring = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/greenhouse';
  mongoose.connect(uristring, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

client.on('connect', function () {

  client.subscribe('temp');
  client.subscribe('hum');
  client.subscribe('light');
  client.subscribe('soil');

});

//Sensor node data
client.on('message', function (topic, message) {

  date = new Date();
  date.setHours(date.getHours() + 5);
  date.setMinutes(date.getMinutes() + 30);

  if(topic.toString() == 'temp'){
      //  console.log(topic.toString() + ' ' +  message.toString());
       t = message.toString();

       var anewrow = new temp ({
            time: date,
            val: t
        });

       if(t_p != t){
         anewrow.save(function (err) {if (err) console.log ('Error on save!')});
       }
       t_p = t;
  }
  if(topic.toString() == 'hum'){
      // console.log(topic.toString() + ' ' +  message.toString());
      h = message.toString();

        var bnewrow = new hum ({
            time: date,
            val: h
        });

        if(h_p != h){
        bnewrow.save(function (err) {if (err) console.log ('Error on save!')});
        }
        h_p = h;
  }

  if(topic.toString() == 'soil'){
      // console.log(topic.toString() + ' ' +  message.toString());
      s = message.toString();

        var cnewrow = new soil ({
            time: date,
            val: s
        });

        if(s_p != s){
        cnewrow.save(function (err) {if (err) console.log ('Error on save!')});
        }
        s_p = s;
  }

  if(topic.toString() == 'light'){
      // console.log(topic.toString() + ' ' +  message.toString());
      l = message.toString();

     var dnewrow = new light ({
            time: date,
            val: l

     });

        if(l_p != l){
        dnewrow.save(function (err) {if (err) console.log ('Error on save!')});
        }
        l_p = l;
  }

});

module.exports = client
