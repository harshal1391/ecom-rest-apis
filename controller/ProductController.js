// include product model
const Product = require("../models/Product");

// create a new Product.
exports.createProduct = function (req, res) {
  // validate request
  if (!req.body.name || !req.body.price) {
    return res.status(400).send({
      success: false,
      message: "Please enter product name and price and category",
    });
  }

  // create a product
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    quantity: req.body.quantity,
    category: req.body.category,
  });

  // save product in the database.
  product
    .save()
    .then((data) => {
      res.send({
        success: true,
        message: "Product successfully created",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while creating the product.",
      });
    });
};

// retrieve and return all products.
exports.getAllProducts = (req, res) => {
  const query = {};

  if (req.query.name) {
    query.name = req.query.name;
  }

  if (req.query.category) {
    query.category = req.query.category;
  }

  Product.find(query)
    .then((data) => {
      var message = "";
      if (data === undefined || data.length == 0) message = "No product found!";
      else message = "Products successfully retrieved";

      res.send({
        success: true,
        message: message,
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while retrieving products.",
      });
    });
};

// find a single product with a id.
exports.getProdDetails = (req, res) => {
  Product.findById(req.params.id)
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          success: false,
          message: "Product not found with id " + req.params.id,
        });
      }
      res.send({
        success: true,
        message: "Product successfully retrieved",
        data: data,
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "Product not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error retrieving product with id " + req.params.id,
      });
    });
};

//search and filter data
