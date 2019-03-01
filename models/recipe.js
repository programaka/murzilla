var mongoose = require("mongoose");
var RecipeImage = require("../models/recipeImage");

// SCHEMA SETUP
var recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: String,
  description: String,
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RecipeImage"
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

recipeSchema.pre("remove", function(next) {
  // 'this' is the recipe being removed
  RecipeImage.remove({_id: this.imageId}).exec();
  next();
});

module.exports = mongoose.model("Recipe", recipeSchema);