const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Populate = require("../util/autopopulate");

const CommentSchema = new Schema({
    createdAt: { type: Date },
    updatedAt: { type: Date },
    content: { type: String, required: true },
    author : { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}]
});

CommentSchema.pre("save", function(next) {
  // SET createdAt AND updatedAt
  const now = new Date();
  this.updatedAt = now;

  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();
});

CommentSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author'))

module.exports = mongoose.model("Comment", CommentSchema);
