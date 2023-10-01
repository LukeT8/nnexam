var express = require("express");
var router = express.Router();

// Require controller modules.
var recipe_controller = require("../controllers/recipeController");

// create recipe
router.post("/recipes", recipe_controller.recipes_create_post);

// list recipes
router.get("/recipes", recipe_controller.recipes_list);

// PATCH request to update recipe
router.patch("/recipe/:id/update", recipe_controller.recipe_update_post);

// POST request to delete recipe
router.post("/recipe/:id/delete", recipe_controller.recipe_delete_post);

// GET request for one recipe
router.get("/recipe/:id", recipe_controller.recipe_detail);


module.exports = router;
