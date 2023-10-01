const { body, validationResult } = require("express-validator");
var Recipe = require("../models/recipe");
var async = require("async");

let nextId = 3; //sloppy implementation but running out of time

// Display list of all recipes
exports.recipes_list = function (req, res, next) {
  Recipe.find()
    .exec(function (err, recipes) {
      if (err) {
        err.status = 404;
        return next(err);
      }
      // Successful
      res.json(200, {    
        recipes 
      })
    });
};

// Display detail page for a specific recipe
exports.recipe_detail = function (req, res, next) {
  async.parallel(
    {
      recipe: function (callback) {
        Recipe.find({ id: req.params.id })
          .exec(callback);
      }
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.recipe == null) {
        // No results.
        var err = new Error("Recipe not found");
        err.status = 404;
        return next(err);
      }
      // Successful
      res.json(200, {
        messages : "Recipe details by id",
        recipe: results.recipe,
      });
    }
  );
};

// Handle Recipe create on POST
exports.recipes_create_post = [
  // Validate and sanitize fields
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage("title must be specified."),
  body("making_time")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("making_time must be specified."),
  body("serves")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage("serves must be specified."),
  body("ingredients")
    .trim()
    .isLength({ min: 1, max: 300 })
    .escape()
    .withMessage("ingredients must be specified."),
  body("cost")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("cost must be specified."),
  body("created_at", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("updated_at", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
    
  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors.
      res.json(200, {
        messages : "Recipe creation failed!",
        required : "title, making_time, serves, ingredients, cost"
      });

    } else {
      // Data is valid

      // Create an Recipe object
      var recipe = new Recipe({
        id: nextId++, //sloppy implementation but running out of time
        title: req.body.title,
        making_time: req.body.making_time,
        serves: req.body.serves,
        ingredients: req.body.ingredients,
        cost: req.body.cost,
        created_at: req.body.created_at,
        updated_at: req.body.updated_at,
      });
      recipe.save(function (err) {
        if (err) {
          return next(err);
        }
        // Successful
        res.json(200, {
          messages : "Recipe successfully created!",
          recipe: recipe,
        });
      });
    }
  },
];

exports.recipe_delete_post = function (req, res, next) {
  async.parallel(
    {
      recipe: function (callback) {
        Recipe.find({ id: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      // Success
      // Delete object
      Recipe.findOneAndDelete({id : req.params.id}, (err, results) => {
        if (err) return next(err);
        if (!results.length){
          res.json(200, {
            messages : "No Recipe found",
          })
        }
        // Success
        res.json(200, {
          messages : "Recipe successfully removed",
        });
      });
    }
  );
};

exports.recipe_update_post = [
  // Validate and sanitize fields.
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage("title must be specified."),
  body("making_time")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("making_time must be specified."),
  body("serves")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage("serves must be specified."),
  body("ingredients")
    .trim()
    .isLength({ min: 1, max: 300 })
    .escape()
    .withMessage("ingredients must be specified."),
  body("cost")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("cost must be specified."),
  body("created_at", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("updated_at", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors.
      res.json(200, {
        messages : "Recipe creation failed!",
        required : "title, making_time, serves, ingredients, cost"
      });

    } else {
      // Create a Recipe object with escaped/trimmed data
      var recipe = new Recipe({
        id: req.params.id, //sloppy implementation but running out of time
        title: req.body.title,
        making_time: req.body.making_time,
        serves: req.body.serves,
        ingredients: req.body.ingredients,
        cost: req.body.cost,
        created_at: req.body.created_at,
        updated_at: req.body.updated_at,
      });
      // Data from form is valid. Update the record.
      Recipe.findOneAndUpdate({id : req.params.id}, recipe, {}, function (err) {
        if (err) {
          return next(err);
        }
        // Successful
        res.json(200, {
          messages : "Recipe successfully updated!",
          recipe: recipe,
        });
      });
    }
  },
];