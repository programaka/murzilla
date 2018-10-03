var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");

var seedDb = require("./seeds");

var commentRoutes = require("./routes/comments");
var recipeRoutes = require("./routes/recipes");
var indexRoutes = require("./routes/index");

var User = require("./models/user");

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "Once again Rusty wins cutest dog!",
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// variables passed to every single template
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

mongoose.connect("mongodb://localhost:27017/murzilla", {useNewUrlParser: true});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
//seedDb();

app.use("/", indexRoutes);
app.use("/recipes", recipeRoutes);
app.use("/recipes/:id/comments", commentRoutes);


app.listen(3000);

// add landing page
// add recipes page that list all recipes with images
// include bootstrap with cdn link
// setup new campground post route
// add in body-parser
// setup route to show form
// add basic unstyled form

// there are conventions name rest on how to name routes