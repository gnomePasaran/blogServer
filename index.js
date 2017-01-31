var express = require('express');
var application = express();

var cors = require('cors');

var myBlogs = require('./data').myBlogs

application.use(cors());

application.get('/', function(req, res) {
  res.json(myBlogs);
});

application.get('/posts/:id', function(req, res) {
  res.json(myBlogs[req.params.id - 1]);
});

application.listen(3001, function() {
  console.log('Listen on 3001 port!')
});