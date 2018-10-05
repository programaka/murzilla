var express = require("express");
var router = express.Router();
var Recipe = require("../models/recipe");
var middleware = require("../middleware/index.js");

router.get("/", function(req, res) {
  Recipe.find({}, function(err, allRecipes) {
    if (err) {
      console.log(err);
    } else {
      res.render("recipes/index", {recipes: allRecipes});
    }
  });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };

  var newRecipe = {
    name: name,
    image: image,
    description: description,
    author: author
  };

  // create a new recipe and save to DB
  Recipe.create(newRecipe, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/recipes");
    }
  });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("recipes/new");
});

// SHOW RECIPE ROUTE
router.get("/:id", function(req, res) {
  Recipe.findById(req.params.id).populate("comments").exec(function(err, foundRecipe) {
    if (err || !foundRecipe) {
      req.flash("error", "Recipe not found");
      res.redirect("back");
    } else {
      res.render("recipes/show", {recipe: foundRecipe});
    }
  });
});

// EDIT RECIPE ROUTE
router.get("/:id/edit", middleware.checkRecipeOwnership, function(req, res) {
  Recipe.findById(req.params.id, function(err, foundRecipe) {
    res.render("recipes/edit", {recipe: foundRecipe});
  });
});

// UPDATE RECIPE ROUTE
router.put("/:id", middleware.checkRecipeOwnership, function(req, res) {
  // find and update the correct recipe
  Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, updatedRecipe) {
    if (err) {
      res.redirect("/recipes");
    } else {
      res.redirect("/recipes/" + req.params.id);
    }
  });
});

// DESTROY RECIPE ROUTE
router.delete("/:id", middleware.checkRecipeOwnership, function(req, res) {
  Recipe.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/recipes");
    } else {
      res.redirect("/recipes");
    }
  });
});

module.exports = router;