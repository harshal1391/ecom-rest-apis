const express = require("express");
const router = express.Router();

//Adding cart controller
const cart = require("../controller/CartController");

//Cart Routes
router.put("/add-product", cart.addToCart);
router.get("/", cart.getCart);

module.exports = router;