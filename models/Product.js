const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ProductSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  description: { type: String, required: false, max: 100 },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  category: { type: String, required: false, default: "Others", max: 100 },
});

// Export the model
module.exports = mongoose.model("Product", ProductSchema);
