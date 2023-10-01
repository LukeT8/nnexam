var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var RecipeSchema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, ref: "Title", required: true },
  making_time: { type: String, required: true },
  serves: { type: String, required: true },
  ingredients: [{ type: String, ref: "Ingredients" }],
  cost: [{ type: Number, ref: "Cost" }],
  create_at: [{ type: String, ref: "Create_at" }],
  updated_at: [{ type: String, ref: "Updated_at" }],
});

// Virtual for book's URL
RecipeSchema.virtual("url").get(function () {
  return "/recipes/" + this._id;
});

// Export model
module.exports = mongoose.model("Recipe", RecipeSchema);
