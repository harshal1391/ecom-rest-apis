const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var Item = new Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const Order = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  createdDate: { type: Date, required: true },
  paymentMethod: { type: String, required: true, default: "COD" },
  address: { type: String, required: true },
  shippingMethod: { type: String, required: true, default: "Free" },
  deliveryDate: { type: Date, required: true },
  totalAmount: { type: Number, required: false },
  items: [Item],
});

module.exports = mongoose.model("Order", Order);