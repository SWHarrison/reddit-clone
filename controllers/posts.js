const Post = require('../models/post');

module.exports = app => {

    app.get('/', (req, res) => {
        Post.find()
            .then(posts => {
                console.log(posts)
                console.log(req.cookies);
                res.render('posts-index', {posts: posts});
            })
            .catch(err => {
                console.log(err);
            });
    });

    // NEW
    app.get('/posts/new', (req, res) => {
        res.render('posts-new');
    })

    // CREATE
    app.post('/posts/new', (req, res) => {
        // INSTANTIATE INSTANCE OF POST MODEL
        const post = new Post(req.body);

        // SAVE INSTANCE OF POST MODEL TO DB
        Post.create((err, post) => {
        // REDIRECT TO THE ROOT
            return res.redirect(`/`);
        })

        post.save();
    });

    app.get("/posts/:id", function(req, res) {
        // LOOK UP THE POST
        Post.findById(req.params.id).populate('comments').then((post) => {
            res.render("post-show", { post })
        }).catch((err) => {
            console.log(err.message)
        })
    });

    // SUBREDDIT
    app.get("/n/:subreddit", function(req, res) {
        Post.find({ subreddit: req.params.subreddit })
        .then(posts => {
            res.render("posts-index", { posts });
        })
        .catch(err => {
            console.log(err);
        });
    });
};
