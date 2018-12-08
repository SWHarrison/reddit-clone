const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();

chai.use(chaiHttp);

// Import the Post model from our models folder so we
// we can use it in our tests.
const Post = require("../models/post");

describe('Posts', ()=>{

    var post = { title: "post title", url: "https://www.google.com", summary: "post summary" };
    before(done => {
        .post("post")
        .send({ username: "testone", password: "password" })
        .end(function(err, res) {
            done();
        });
    });
    it("should create with valid attributes at POST /posts", done => {

        Post.findOneAndRemove(post, function() {

        Post.find(function(err, posts) {
            var postCount = posts.count;
            console.log("test")


            chai
                .request("localhost:3000")
                .post("/posts/new")
                .send(post)
                .then(res => {
                    Post.find(function(err, post) {
                        postCount.should.be.equal(posts.length - 1);
                        res.should.have.status(200);
                        console.log("test")
                        return done();
                    });
                })
                .catch(err => {
                    return done(err);
                });
        });
      });
    });
})
