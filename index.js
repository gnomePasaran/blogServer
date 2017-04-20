var express = require('express');
var application = express();
var _ = require('lodash');

var cors = require('cors');

var myBlogs = require('./data').myBlogs;
var myComments = require('./comments').myComments;

application.use(cors());

var bodyParser = require('body-parser');
application.use(bodyParser.json());

application.get('/', function(req, res) {
  pageId = req.query.page ? parseInt(req.query.page) : 1
  result = {
    items: myBlogs.slice((pageId - 1) * 3, 3 * (pageId)),
    count: myBlogs.length
  };
  res.json(result);
});

application.post('/post/:id/like', function(req, res) {
  item = myBlogs[req.params.id - 1];
  item.meta.count++;
  res.json(item);
});

application.post('/post/:id/edit', function(req, res) {
  var result = req.body;
  var error = {};

  if (result.title < 5) {
    error.title = 'Should be longer the 5 symbols!';
  }
  if (result.createdAt === '') {
    error.createdAt = 'Required!';
  }
  if (result.autor === '') {
    error.author = 'Required!';
  }

  if (error.length > 0)
    result['error'] = error;

  res.json(result);
});

application.get('/post/:id/comments', function(req, res) {
  var result = _.compact(_.map(myComments, function(comment) {
    if (comment.user_id == req.params.id)
      return comment;
  }));

  return setTimeout(function() { return res.json(result); }, 5000);
});

application.post('/post/:id/comments/new', function(req, res) {
  var result = req.body;
  var error = {};

  if (result.text < 5) {
    error.text = 'Should be longer then 5 symbols!';
  }
  if (result.phone === '') {
    error.phone = 'Required!';
  }

  if (error.length > 0)
    result['error'] = error;

  result['id'] = Math.floor(Math.random() * (1000 - 10)) + 10;
  result['user_id'] = req.params.id;

  res.json(result);
});

application.get('/post/:id', function(req, res) {
  res.json(myBlogs[req.params.id - 1]);
});

application.get('/search', function(req, res) {
  var rgxp = new RegExp(req.query.q, 'i');
  var foundBlogs = _.filter(myBlogs,
    function (blog) {
      if (blog.text.search(rgxp) > 0)
        return blog;
    });

  res.json(foundBlogs);
});

application.listen(3001, function() {
  console.log('Listen on 3001 port!')
});
