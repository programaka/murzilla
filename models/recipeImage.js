var mongoose = require("mongoose");

// SCHEMA SETUP
var recipeImageSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  image: Buffer
});

module.exports = mongoose.model("RecipeImage", recipeImageSchema);