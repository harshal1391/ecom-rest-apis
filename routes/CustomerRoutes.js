const express = require("express");
const router = express.Router();

// include product controller
const product = require("../controller/ProductController");
const customer = require("../controller/CustomerController");

// routes
router.post('/signup', customer.signup);
router.post('/login', customer.login);
router.put('/edit-profile', customer.editProfile);

// routes
router.get("/products", product.getAllProducts);
router.get("/products/:id", product.getProdDetails);

module.exports = router;
