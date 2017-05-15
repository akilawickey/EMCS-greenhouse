var express = require('express');
var app = express();
app.listen(1212);
app.get('/', function (req,res) {
  console.log('connected');
})
app.get('/sensor/:temp/:hmdt', function(req, res) {
     var t = req.params.temp;
     var h = req.params.hmdt;
     console.log(t);
     console.log(h);
});
