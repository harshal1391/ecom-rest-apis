const mongoose = require ("mongoose");

const Schema = mongoose.Schema;

var Item = new Schema({
    productId: {type: String, required: true},
    quantity: {type: Number, required: true, min: 1}
});

const Cart = new Schema({
  email: { type: String, required: true },
  items: [Item]
});

module.exports = mongoose.model('Cart', Cart);