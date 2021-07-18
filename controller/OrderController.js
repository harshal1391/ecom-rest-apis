const Cart = require("../models/Cart")
const Order = require("../models/Order");
const Product = require("../models/Product")


//Display Order
exports.getOrder = (req, res) => {
  Order.findById(req.params.orderId)
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          success: false,
          message: "No order found with id " + req.params.orderId,
        });
      }
      res.send({
        data: data,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        success: false,
        message: "Error retrieving order with id " + req.params.orderId,
      });
    });
};
//Create order
exports.placeOrder = function(req, res) {
    if(!(Array.isArray(req.body.items) && req.body.items.length)) {
        res.status(400).send({
            success: false,
            message: "Empty order. No items has been added to order"
        });
    }

    const orderReq = {
        name: req.body.name,
        email: req.body.email,
        createdDate: req.body.createdDate,
        paymentMethod: req.body.paymentMethod,
        address: req.body.address,
        shippingMethod: req.body.shippingMethod,
        deliveryDate: req.body.deliveryDate,
    };

    orderReq.items = req.body.items.map(item => {
        return {
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: Number.parseInt(item.quantity),
        };
    });

    orderReq.totalAmount = req.body.items.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    const order = new Order(orderReq);

    order.save()
        .then(savedOrder => {
            const allProducts = savedOrder.items.map(item => {
                return Product.findById(item.productId).then(prod => {
                    prod.quantity = prod.quantity - item.quantity;
                    return prod.save();
                });
            });

            Promise.all(allProducts)
                .then(data => {
                    return Cart.findOne({ email: savedOrder.email })
                })
                .then(cart => {
                    cart.items = [];
                    return cart.save();
                })
                .then((data) => {
                    res.status(201).send({
                        success: true,
                        message: "Order created successfully.",
                        data: savedOrder,
                    });
                })
                .catch((err) => {
                    res.status(500).send({
                        success: false,
                        message: err.message || "Some error occurred while creating the order.",
                    });
                });
        })
        .catch((err) => {
                    res.status(500).send({
                        success: false,
                        message: err.message || "Some error occurred while creating the order.",
                    });
                });
};

//List orders for admin
exports.getAllOrders =  (req, res) => {
    const query = {};

    if (req.query.email) {
      query.email = req.query.email;
    }

    Order.find(query)
      .then((data) => {
        var message = "";
        if (data === undefined || data.length == 0)
          message = "No Order found!";
        else message = "Orders successfully retrieved";

        res.status(200).send({
          success: true,
          message: message,
          data: data,
        });
      })
      .catch((err) => {
        res.status(500).send({
          success: false,
          message:
            err.message || "Some error occurred while retrieving orders.",
        });
      });
}