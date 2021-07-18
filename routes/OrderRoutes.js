const express = require("express");
const router = express.Router();

//Adding cart controller
const order = require("../controller/OrderController");

//Cart Routes
router.post("/place-order", order.placeOrder);
router.get("/:orderId", order.getOrder);
router.get("/", order.getAllOrders);

module.exports = router;
