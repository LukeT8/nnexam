#! /usr/bin/env node

console.log("This script populates the recipes collection in MongoDB database.");

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect({
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var Recipe = require("./models/recipe"); // Make sure to replace with your actual model path

function createRecipe(title, making_time, serves, ingredients, cost, created_at, updated_at, cb) {
  var recipeDetail = {
    title: title,
    making_time: making_time,
    serves: serves,
    ingredients: ingredients,
    cost: cost,
    created_at: created_at,
    updated_at: updated_at,
  };

  var recipe = new Recipe(recipeDetail);
  recipe.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Recipe: " + recipe.title);
    cb(null, recipe);
  });
}

function createRecipes(cb) {
  createRecipe(
    "チキンカレー",
    "45分",
    "4人",
    "玉ねぎ,肉,スパイス",
    1000,
    new Date("2016-01-10 12:10:12"),
    new Date("2016-01-10 12:10:12"),
    cb
  );
  createRecipe(
    "オムライス",
    "30分",
    "2人",
    "玉ねぎ,卵,スパイス,醤油",
    700,
    new Date("2016-01-11 13:10:12"),
    new Date("2016-01-11 13:10:12"),
    cb
  );
}

createRecipes(function (err) {
  if (err) {
    console.error("Error creating recipes:", err);
  } else {
    console.log("Recipes have been successfully added to the database.");
  }
  // All done, disconnect from the database
  mongoose.connection.close();
});