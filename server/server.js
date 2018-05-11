/**
 * Module dependencies.
 * Greenhouse IoT server by leafylanka
 */
'use strict';

var express = require('express'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    app = express(),
    http = require('http').Server(app),
    router = express.Router(),
    mqtt = require('mqtt'),
    path = require('path'),
    sys = require('util'),
    net = require('net'),
    mongoose = require('mongoose'),
    ObjectId = require('mongodb').ObjectID;
//create a socket object that listens on port 
var io = require('socket.io')(http);

var date;
var data = 'none'
// api = require('./routes/api');

var t_p,h_p,s_p,l_p,state_temp_time,state_hum_time,state_soil_time,state_light_time;
var t = '';
var h = '';
var s = '';
var l = '';
var count = 0;

var hum_ = [];
var light_ = [];
var temp_ = [];
var soil_ = [];

mongoose.Promise = global.Promise;

    var uristring = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/greenhouse';

      mongoose.connect(uristring, function (err, res) {
      if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      } else {
        console.log ('Succeeded connected to: ' + uristring);
      }
    });
    // This is the schema.  Note the types, validation and trim
    // statements.  They enforce useful constraints on the data.
    var userSchema = new mongoose.Schema({

      date : { type: String},
      rule_name : { type: String},
      actuator_type: { type: String},
      from: { type: String},
      to: { type: String}

    });
    var mqtt_status = new mongoose.Schema({

      time : { type: String},
      mqtt_topic : { type: String},
      status: { type: String}

    });
    var t_data = new mongoose.Schema({

      time : { type: String},
      val: { type: String}

    });
    var h_data = new mongoose.Schema({

      time : { type: String},
      val: { type: String}

    });
    var s_data = new mongoose.Schema({

      time : { type: String},
      val: { type: String}

    });
    var l_data = new mongoose.Schema({

      time : { type: String},
      val: { type: String}

    });
    // Compiles the schema into a model, opening (or creating, if
    // nonexistent) the 'PowerUsers' collection in the MongoDB database
    var PUser = mongoose.model('data_store', userSchema);
    var PUser2 = mongoose.model('mqtt_store', mqtt_status);
    var PUser3 = mongoose.model('temp_data', t_data);
    var PUser4 = mongoose.model('hum_data', h_data);
    var PUser5 = mongoose.model('soil_data', s_data);
    var PUser6  = mongoose.model('light_data', l_data);



// create an mqtt client object and connect to the mqtt broker
var client = mqtt.connect('mqtt://46.101.63.192');

http.listen((process.env.PORT || 3000), function(){
    //  http.listen((3000), function(){
      // console.log(process.env.PORT);
      console.log('----------------------------------------------------------------------------');
      console.log('----------------------------------------------------------------------------');
      console.log('----------------------------------------------------------------------------');
      console.log('--------------------IOT Greenhouse Server Started---------------------------');
      console.log('----------------------------------------------------------------------------');
      console.log('----------------------------------------------------------------------------');
      console.log('----------------------------------------------------------------------------');
});

app.use("/public",router);
app.use(express.static(__dirname + '/public'));

// ## CORS middleware
//
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // intercept OPTIONS method
    //console.log(req.method);
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(allowCrossDomain);
// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }));

// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));

// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/sensor_data', function(req, res) {
  res.json({notes: "Temp :23 Humidity :88 Light :10023 Soil :899"})
});

io.sockets.on('connection', function (socket) {
    // when socket connection publishes a message, forward that message
    // the the mqtt broker
    socket.on('publish', function (data) {
        console.log('Publishing to '+data.topic+' Status ' +data.payload);
        client.publish(data.topic,data.payload);

         var newrow1 = new PUser2 ({
            mqtt_topic: data.topic,
            status: data.payload,

        });
        newrow1.save(function (err) {if (err) console.log ('Error on save! actuator controlling error ')});
        // io.emit('mqtt',{'topic':String(data.topic),'payload':String(data.payload)});

        // PUser2.update({'mqtt_topic':'fan'},{$set:{'status':'1'}},{multi:true})
        // PUser2.update({ mqtt_topic: 'fan' }, { $set: { status: '1' }});
});

    socket.on('rule_config_data', function (data) {
        // console.log(data.rulename,data.actuator,data.from,data.to);
        // client.publish(data.topic,data.payload);
             // send to database
        var newrow = new PUser ({
            time: date,
            rule_name: data.rulename,
            actuator_type: data.actuator,
            from: data.from,
            to: data.to
        });
        newrow.save(function (err) {if (err) console.log ('Error on save!')});
    });
});

// listen to messages coming from the mqtt broker

client.on('connect', function () {

    client.subscribe('temp');
    client.subscribe('hum');
    client.subscribe('light');
    client.subscribe('soil');

});

//Sensor node data

client.on('message', function (topic, message) {
  // message is Buffer
  // console.log(topic.toString())
  // console.log(message.toString())

  // count++;
  // console.log("data count "+ count);
  date = new Date();
  date.setHours(date.getHours() + 5);
  date.setMinutes(date.getMinutes() + 30);

         // console.log(message)

  if(topic.toString() == 'temp'){
       console.log(topic.toString() + ' ' +  message.toString());
       t = message.toString();
       io.emit('mqtt','temp ' + t);

       var anewrow = new PUser3 ({
            time: date,
            val: t
        });
       // console.log(t + '\n');
       // console.log(t_p);
       if(t_p != t){
         anewrow.save(function (err) {if (err) console.log ('Error on save!')});
         // console.log("Temperature changed");
       }
       t_p = t;
  }
  if(topic.toString() == 'hum'){
      console.log(topic.toString() + ' ' +  message.toString());
      h = message.toString();
      io.emit('mqtt','hum ' + h);

        var bnewrow = new PUser4 ({
            time: date,
            val: h
        });

        if(h_p != h){
        bnewrow.save(function (err) {if (err) console.log ('Error on save!')});
        }
        h_p = h;
  }

  if(topic.toString() == 'soil'){
      console.log(topic.toString() + ' ' +  message.toString());
      s = message.toString();
      io.emit('mqtt','soil ' + s);

        var cnewrow = new PUser5 ({
            time: date,
            val: s
        });

        if(s_p != s){
        cnewrow.save(function (err) {if (err) console.log ('Error on save!')});
        }
        s_p = s;
  }

  if(topic.toString() == 'light'){
      console.log(topic.toString() + ' ' +  message.toString());
      l = message.toString();
      io.emit('mqtt','light ' + l);

             // console.log(l);

     var dnewrow = new PUser6 ({
            time: date,
            val: l

     });

        if(l_p != l){
        dnewrow.save(function (err) {if (err) console.log ('Error on save!')});
        }
        l_p = l;
  }
  // client.end()

});

//updating the gauges of the chart
// setInterval(function () {
//
//       PUser3.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
//         // console.log( post.val );
//         // io.emit('mqtt','temp ' + post.val);
//       });
//
//       PUser4.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
//         // console.log( post.val );
//         // io.emit('mqtt','hum ' + post.val);
//       });
//
//       PUser5.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
//         // console.log( post.val );
//         // io.emit('mqtt','soil ' + post.val);
//       });
//
//       PUser6.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
//         // console.log( post.val );
//         io.emit('mqtt','light ' + post.val);
//       });
//
// }, 1000);

//Get the daily sensore node data
// setInterval(function () {

//       PUser3.find({
//         _id: {
//             $gt: ObjectId.createFromTime(Date.now() / 1000 - 24 * 60 * 60)
//         }
//       },
//       function(err, post) {
//         state_temp_time = post.toString().split(',');
//         console.log(state_temp_time.substring(7,12));
//       }

//       );

// }, 5000);
_id: { $gt: ObjectId.createFromTime(Date.now() / 1000 - 24 * 60 * 60)
     }
setInterval(function () {

        PUser3.find({_id: { $gt: ObjectId.createFromTime(Date.now() / 1000 - 24 * 60 * 60)
        }},'val', function(err, data){

            state_temp_time = data.toString().split(',');
            // console.log(data);
            for(var i = 0;i<=data.length-1;i++){
              temp_[i] = state_temp_time[2*i+1].substring(7,12);
              // console.log(state_temp_time);
              if( temp_[i] == "nan' "){

                 temp_[i] = "0.0";
                 temp_.splice(i, 1);
              }
              // if (typeof(jsVar) == 'undefined') {

              // console.log(temp_[i]);

            }
              // console.log(hum_.length);
              io.emit('mqtt_data','temp ' + temp_);

        });
        PUser4.find({_id: { $gt: ObjectId.createFromTime(Date.now() / 1000 - 24 * 60 * 60)
        }},'val', function(err, data){

            state_hum_time = data.toString().split(',');
            // console.log(data);
            for(var i = 0;i<=data.length-1;i++){
              hum_[i] = state_hum_time[2*i+1].substring(7,12);
              if( hum_[i] == "nan' "){

                 hum_[i] = "0.0";
                 hum_.splice(i, 1);
              }

              // console.log(hum_[i]);

            }
              // console.log(hum_.length);
              io.emit('mqtt_data','hum ' + hum_);

        });
        PUser5.find({_id: { $gt: ObjectId.createFromTime(Date.now() / 1000 - 24 * 60 * 60)
        }},'val', function(err, data){

            state_soil_time = data.toString().split(',');
            // console.log(data);
            for(var i = 0;i<=data.length-1;i++){
              soil_[i] = state_soil_time[2*i+1].substring(7,10);
              if( soil_[i] == "nan' "){

                 soil_[i] = "0.0";
                 soil_.splice(i, 1);
              }

              // console.log(soil_[i]);

            }
              // console.log(hum_.length);
              io.emit('mqtt_data','soil ' + soil_);
              // console.log(soil_);

        });
        PUser6.find({_id: { $gt: ObjectId.createFromTime(Date.now() / 1000 - 24 * 60 * 60)
        }},'val', function(err, data){

            state_light_time = data.toString().split(',');
            // console.log(data);
            for(var i = 0;i<=data.length-1;i++){
              light_[i] = state_light_time[2*i+1].substring(7,12);
              if( light_[i] == "nan' "){

                 light_[i] = "0.0";
                 light_.splice(i, 1);
              }

              // console.log(light_[i]);

            }
              // console.log(hum_.length);
              io.emit('mqtt_data','light ' + light_);

        });


}, 10000);

// setInterval(function () {
// io.emit('mqtt', 'hello');

// }, 1000);
