// all the middleware goes here
var middlewareObj = {};
var Recipe = require("../models/recipe");
var RecipeImage = require("../models/recipeImage");
var Comment = require("../models/comment");
var mongoose = require("mongoose");


middlewareObj.saveImage = function(req, res, next) {
  // remove the base64 prefex and convert the string to binary
  // the cropped image is passed in a hidden field of the form
  var imgBlob = Buffer.from(req.body.croppedImg64.substr("data:image/jpeg;base64".length), "base64");

  var imageId = mongoose.Types.ObjectId();
  res.locals.imageId = imageId;

  var image = {
    _id: imageId,
    image: imgBlob
  };

  RecipeImage.create(image, function(err) {
    if (err) {
      console.log(err);
    } else {
      next();
    }
  });
};

middlewareObj.checkRecipeOwnership = function(req, res, next) {
  // is user logged in
  if(req.isAuthenticated()) {
    Recipe.findById(req.params.id, function(err, foundRecipe) {
      if (err || !foundRecipe) {
        req.flash("error", "Recipe not found");
        res.redirect("back");
      } else {
        // does user own the recipe?
        if (foundRecipe.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  // is user logged in
  if(req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err || !foundComment) {
        req.flash("error", "Comment not found");
        res.redirect("back");
      } else {
        // does user own the comment?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/login");
};

module.exports = middlewareObj;