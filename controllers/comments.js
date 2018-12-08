const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports = app => {

    // CREATE Comment
    app.post("/posts/:postId/comments", function(req, res) {
      // INSTANTIATE INSTANCE OF MODEL
      const comment = new Comment(req.body);
      console.log(req.params)

      // SAVE INSTANCE OF Comment MODEL TO DB
      comment
        .save()
        .then(comment => {
          return Post.findById(req.params.postId);
        })
        .then(post => {
          post.comments.unshift(comment);
          return post.save();
        })
        .then(post => {
          res.redirect(`/posts/${req.params.postId}`);
        })
        .catch(err => {
          console.log(err);
        });
    });
};
