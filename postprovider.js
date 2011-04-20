var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_blog');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var Comments = new Schema({
    person     : String
  , comment    : String
  , created_at : Date
});

var Post = new Schema({
    author      : ObjectId
  , title       : String
  , body        : String
  , created_at  : Date
  , comments    : [Comments]
});

mongoose.model('Post', Post);
var Post = mongoose.model('Post');

PostProvider = function(){};

//Find all posts
PostProvider.prototype.findAll = function(callback) {
  Post.find({}, function (err, posts) {
    callback( null, posts )
  });  
};

//Find post by ID
PostProvider.prototype.findById = function(id, callback) {
  Post.findById(id, function (err, post) {
    if (!err) {
	  callback(null, post);
	}
  });
};

//Update post by ID
PostProvider.prototype.updateById = function(id, body, callback) {
  Post.findById(id, function (err, post) {
    if (!err) {
	  post.title = body.title;
	  post.body = body.body;
	  post.save(function (err) {
	    callback();
	  });
	}
  });
};

//Create a new post
PostProvider.prototype.save = function(params, callback) {
  var post = new Post({title: params['title'], body: params['body'], created_at: new Date()});
  post.save(function (err) {
    callback();
  });
};

//Add comment to post
PostProvider.prototype.addCommentToPost = function(postId, comment, callback) {
  this.findById(postId, function(error, post) {
    if(error){
	  callback(error)
	}
    else {
	  post.comments.push(comment);
	  post.save(function (err) {
	    if(!err){
		  callback();
	    }	
	  });
    }
  });
};

exports.PostProvider = PostProvider;
