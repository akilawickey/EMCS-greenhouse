/**
 * Module dependencies.
 */
var express = require('express'),
api = require('./routes/api');
var methodOverride = require('method-override')
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var router = express.Router();  
var mqtt = require('mqtt');
var path = require('path');
var sys = require('util');
var net = require('net');
var mongoose = require('mongoose');
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
      // name: {
      //   first: String,
      //   last: { type: String, trim: true }
      // },
      rule_name : { type: String},
      actuator_type: { type: String},
      from: { type: String},
      to: { type: String}

    });
    var mqtt_status = new mongoose.Schema({
      // name: {
      //   first: String,
      //   last: { type: String, trim: true }
      // },
      rule_name : { type: String},
      actuator_type: { type: String},
      from: { type: String},
      to: { type: String}

    });



    // Compiles the schema into a model, opening (or creating, if
    // nonexistent) the 'PowerUsers' collection in the MongoDB database
    var PUser = mongoose.model('data_store', userSchema);
    var PUser2 = mongoose.model('mqtt_store', mqtt_status);



// // create a socket object that listens on port 5000
var io = require('socket.io')(http);
 
// create an mqtt client object and connect to the mqtt broker
var client = mqtt.connect('mqtt://localhost');
 
     http.listen((process.env.PORT || 1212), function(){
      // console.log(process.env.PORT);
      console.log('--------------------IOT Greenhouse Server Started---------------------------');
    });
    


router.use("/public",function(req,res){

      res.sendFile(path + "index.html");

});

app.use("/public",router);

app.use(express.static(__dirname + '/public'));

    /*Create http server*/
app.get('/public', function(req, res){

    res.sendFile(__dirname + '/index.html');

});

// Configuration  

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

app.use(methodOverride('X-HTTP-Method-Override'))
app.use(allowCrossDomain)
// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }))

// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))

// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// JSON API
app.get('/switches', api.switches);
app.get('/switches/:id', api.switch);
app.post('/switches', api.addSwitch);
app.put('/switches/:id', api.editSwitch);
app.put('/switches', api.editAllSwitches);
app.delete('/switches/:id', api.deleteSwitch);

// setInterval(function () {
// io.emit('chat message', 'hello'); 

// }, 1000);


io.sockets.on('connection', function (socket) {
    // socket connection indicates what mqtt topic to subscribe to in data.topic
    // socket.on('subscribe', function (data) {
    //     console.log('Subscribing to '+data.topic);
    //     socket.join(data.topic);
    //     // client.subscribe(data.topic);
    // });
    // when socket connection publishes a message, forward that message
    // the the mqtt broker
    socket.on('publish', function (data) {
        console.log('Publishing to '+data.topic);
        client.publish(data.topic,data.payload);
    });
    socket.on('rule_config_data', function (data) {
        // console.log(data.rulename,data.actuator,data.from,data.to);
        // client.publish(data.topic,data.payload);
             // send to database
        var newrow = new PUser ({
            rule_name: data.rulename,
            actuator_type: data.actuator,
            from: data.from,
            to: data.to
        });
        newrow.save(function (err) {if (err) console.log ('Error on save!')});
    });
});

// listen to messages coming from the mqtt broker
client.on('message', function (topic, payload, packet) {
    console.log(topic+'='+payload);
    io.emit('mqtt',{'topic':String(topic),'payload':String(payload)});
});
