// all the middleware goes here
var middlewareObj = {};
var Recipe = require("../models/recipe");
var Comment = require("../models/comment");

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