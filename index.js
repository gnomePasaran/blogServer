var express = require('express');
var application = express();
var _ = require('lodash');

var cors = require('cors');

var myBlogs = require('./data').myBlogs

application.use(cors());

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
