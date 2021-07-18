const express = require("express");
const router = express.Router();

// include product controller
const product_view = require("../controller/ProductController");

// routes
router.get("/", product_view.getAllProducts);
router.post("/add", product_view.createProduct);
router.get("/:id", product_view.getProdDetails);

module.exports = router;
