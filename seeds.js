var mongoose = require("mongoose");
var Recipe = require("./models/recipe");
var Comment = require("./models/comment");

var data = [
  {
    name: "Peach Crostata",
    image: "img/peach_crostata.jpg",
    description: "Step 1 cook the dough /n Step 2 prepare peaches \n dfdsf"
  },
  {
    name: "Chocolate cheesecake",
    image: "img/chocolate_cheesecake.png",
    description: "I can't do it right now cause my baking plate is broken"
  },
  {
    name: "Moscow Mule",
    image: "https://images.unsplash.com/photo-1513416543495-10c173ed9908?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=aff0b38f8272e060f9c4430aa661e24f&auto=format&fit=crop&w=800&q=60",
    description: "downloaded from the internet"
  },
  {
    name: "Fries",
    image: "https://images.unsplash.com/photo-1463183665146-ce2ed31df6b0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=fe40be6b5c3edf307203998bd94d250f&auto=format&fit=crop&w=500&q=60",
    description: "classic"
  }
]

function seedDb() {
  // Remove all recipes
  Recipe.remove({}, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Removed all recipes!");
    }

    // add a few recipes
    data.forEach(function(seed) {
      Recipe.create(seed, function(err, recipe) {
        if (err) {
          console.log(err);
        } else {
          console.log("added a recipe: " + seed.name);

          // create a comment
          Comment.create(
            {
              text: "This is a great recipe, but I've added way more sugar cause I like it sweet!",
              author: "Uliana"
            }, function(err, comment) {
              if (err) {
                console.log(err);
              } else {
                recipe.comments.push(comment);
                recipe.save();
                console.log("Created new comment");
              }
            });
        }
      });
    });
  });
}

module.exports = seedDb; 
