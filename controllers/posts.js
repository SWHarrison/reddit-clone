const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment')

module.exports = app => {

    app.get('/', (req, res) => {
        var currentUser = req.user;
        console.log(req.user)

        Post.find({})
            .then(posts => {
                res.render("posts-index", { posts, currentUser });
            })
            .catch(err => {
                console.log(err.message);
            });
    });

    // NEW
    app.get('/posts/new', (req, res) => {
        var currentUser = req.user;
        res.render('posts-new', {currentUser});
    })

    // CREATE

    /*app.post('/posts/new', (req, res) => {
        // INSTANTIATE INSTANCE OF POST MODEL
        if(req.user){
            const post = new Post(req.body);
            post.author = req.user._id

            // SAVE INSTANCE OF POST MODEL TO DB
            Post.create((err, post) => {
            // REDIRECT TO THE ROOT
                return res.redirect(`/`);
            })

            post.save();
        }*/

    //});
    app.post("/posts", (req, res) => {
        console.log(req.user)
        if (req.user) {
            var post = new Post(req.body);
            post.author = req.user._id;
            console.log(post.author)

            post
              .save()
              .then(post => {
                return User.findById(req.user._id);
              })
              .then(user => {
                user.posts.unshift(post);
                user.save();
                // REDIRECT TO THE NEW POST
                res.redirect("/posts/" + post._id);
              })
              .catch(err => {
                console.log("failed!")
                console.log(err.message);
              });
        } else {
            console.log("failed authentication!")
            return res.status(401); // UNAUTHORIZED
        }
    });

    //Old code with attempt to add comment authors
    /*app.get("/posts/:id", function(req, res) {
        var currentUser = req.user;
        // LOOK UP THE POST
        Post.findById(req.params.id).populate('comments').then((post) => {
            User.findById(post.author).populate('author').then((author) => {
                User.findById(post.comments).populate('commentAuthor').then((authorComments) => {
                    console.log(author)
                    res.render("post-show", { post, currentUser, author, authorComments})
                }) .catch((err) =>{
                    console.log(err.message)
                })
            }).catch((err) => {
                console.log(err.message)
            })
        }).catch((err) => {
            console.log(err.message)
        })
    });*/

    //Code from https://github.com/MakeFang/RedditClone
    app.get('/posts/:postId', (req,res)=>{
        var currentUser = req.user;
        Post.findById(req.params.postId)
        .populate('author', 'username')
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                model: 'User'
            }
        })
        .then((post)=>{
            console.log(post);
            res.render('post-show', {post: post, currentUser});
        })
        .catch((err)=>{
            console.log(err.message);
        })
    })

    // SUBREDDIT
    app.get("/n/:subreddit", function(req, res) {
        var currentUser = req.user;
        Post.find({ subreddit: req.params.subreddit })
        .then(posts => {
            res.render("posts-index", { posts , currentUser});
        })
        .catch(err => {
            console.log(err);
        });
    });
};
