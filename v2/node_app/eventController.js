'use strict';

var jwt = require('jsonwebtoken');

var config = require('../config'),
    db = require('../services/database'),
    Even = require('../models/event'),
    Atten = require('../models/atten');

// The Event controller.
var EventController = {};

//Creating the event
EventController.create_event = function(req,res){
  if(!req.body.eventname || !req.body.location || !req.body.time || !req.body.from || !req.body.to || !req.body.creator) {
      res.json({ message: 'Provide correct' });
  } else {
      db.sync().then(function() {
          var newEvent = {
              eventname: req.body.eventname,
              location: req.body.location,
              time: req.body.time,
              from: req.body.from,
              to: req.body.to,
              attendence: req.body.attendence,
              creator: req.body.creator
          };

          var newAtten = {
              event_id: req.body.eventname,
              user_id: req.body.creator,
              went: req.body.attendence
          };

          // return Even.create(newEvent).then(function() {
              res.status(201).json({ message: 'Event Created!' });
          // });
          Even.create(newEvent);
          Atten.create(newAtten);
              // res.status(201).json({ message: 'Event done!' });
          // });

      }).catch(function(error) {
          console.log(error);
          res.status(403).json({ message: 'fail!' });
      });
  }

}
//Getting the event data to the table
EventController.get_events = function(req, res){
        // var results = Even.findAll({ limit: 1 });
        // var jsonString = JSON.stringify(results); //convert to string to remove the sequelize specific meta data
        // var obj = JSON.parse(jsonString);
        // return Even.findAll({ limit: 10 });
        // console.log("This is testing the function");
        // res.send(obj);
        // Even.findAll().success(function (sensors) {
        //       nodedata.sensors = sensors.map(function(sensor){ return sensor.toJSON() });

        //       nodesensors.push(nodedata);
        //       res.json(nodesensors);
        // });

        Even.findAll(
          {
            limit:6,
            order: [['id', 'DESC']]
          }
        ).then(function(success){
          if(success){
            res.json(success);
          }else{
            res.send(error);
          }
        });
}
//Getting the event from certain period
EventController.view_event = function(req, res){

        var sdate = req.body.sdate,
            edate = req.body.edate,
            eid = req.body.eid;

        Even.findAll(
          {
            where:{
            eventname: eid
          }}
        ).then(function(success){
          if(success){
            // res.json(success);
            res.json({ pop: success });
          }else{
            res.send(error);
          }
        });


}

//Getting the event from client only period
EventController.view_event_client = function(req, res){

        var uname = req.body.uname;

        Atten.findAll(
          {
            where:{
            user_id: uname
          }}
        ).then(function(success){
          if(success){
            // res.json(success);
            res.json({ pop: success });
          }else{
            res.send(error);
          }
        });
}

//Getting the event from client
EventController.get_events_client = function(req, res){

        var uname = req.body.uname;
        var uid = req.body.uid;

        Atten.findAll(
          {
            where:{
            user_id: uname,
            event_id: uid
          }}
        ).then(function(success){
          if(success){
            // res.json(success);
            res.json({ message: success });
          }else{
            res.send(error);
          }
        });

}
module.exports = EventController;
