var express = require("express");
var router = express.Router();
var Recipe = require("../models/recipe");
var RecipeImage = require("../models/recipeImage");
var middleware = require("../middleware/index.js");
var multer = require("multer");

var storage = multer.memoryStorage();

var imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

var upload = multer({ 
  storage: storage,
  fileFilter: imageFilter,
  limits: { fieldSize: 25 * 1024 * 1024 }
});

// GET RECIPE'S IMAGE ROUTE
router.get("/images/:id", function(req, res) {
  RecipeImage.findById(req.params.id).exec(function(err, foundRecipeImage) {
    if (err || !foundRecipeImage) {
      req.flash("error", "Recipe image not found");
      res.redirect("back");
    } else {
      res.send(foundRecipeImage.image);
    }
  });
});

router.get("/", function(req, res) {
  Recipe.find({}, function(err, allRecipes) {
    if (err) {
      console.log(err);
    } else {
      res.render("recipes/index", {recipes: allRecipes});
    }
  });
});

// ADD NEW RECIPE ROUTE
router.post("/", middleware.isLoggedIn, upload.single("image"), middleware.saveImage, function(req, res) {
  var name = req.body.name;
  var ingredients = req.body.ingredients;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };

  var newRecipe = {
    name: name,
    ingredients: ingredients,
    description: description,
    author: author,
    imageId: res.locals.imageId
  };

  // create a new recipe and save to DB
  Recipe.create(newRecipe, function(err) {
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

// SHOW RECIPE PAGE ROUTE
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

// EDIT RECIPE PAGE ROUTE
router.get("/:id/edit", middleware.checkRecipeOwnership, function(req, res) {
  Recipe.findById(req.params.id, function(err, foundRecipe) {
    res.render("recipes/edit", {recipe: foundRecipe});
  });
});

// UPDATE RECIPE ROUTE
router.put("/:id", middleware.checkRecipeOwnership, upload.single("image"), function(req, res) {
  // find and update the correct recipe
  Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, updatedRecipe) {
    if (err) {
      console.log(err);
      res.redirect("/recipes");
    // update the image if an image is provided
    } else if (req.body.croppedImg64) {
      var imgBlob = Buffer.from(req.body.croppedImg64.substr("data:image/jpeg;base64".length), "base64");
      RecipeImage.findByIdAndUpdate(updatedRecipe.imageId, {image: imgBlob}, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/recipes");
        } else {
          res.redirect("/recipes/" + req.params.id);
        }
      });
    } else {
      res.redirect("/recipes/" + req.params.id);
    }
  });
});

// DESTROY RECIPE ROUTE
router.delete("/:id", middleware.checkRecipeOwnership, function(req, res) {
  Recipe.findById(req.params.id, function(err, recipe) {
    if (err) {
      res.redirect("/recipes");
    } else {
      // needed to call remove on the document object to fire pre hook (was not firing on the model)
      recipe.remove();
      res.redirect("/recipes");
    }
  });
});

module.exports = router;