const express = require("express");

const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const db = require("./config/db");

const cart = require("./routes/CartRoutes");
const order = require("./routes/OrderRoutes");
const products = require("./routes/ProductsRoutes");
const customer = require("./routes/CustomerRoutes");

const app = express();

app.use(express.json());
app.use("/api/v1/admins/products", products);
app.use("/api/v1/customers", customer);
app.use("/api/v1/carts", cart);
app.use("/api/v1/orders", order);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
