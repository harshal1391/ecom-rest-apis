const Cart = require("../models/Cart");

//Add products to cart
exports.addToCart = function (req, res) {
  const email = req.body.email;
  const productId = req.body.productId;
  const quantity = req.body.quantity;

  Cart.findOne({ email: email }).then((cart) => {
    if (cart) {
      const index = cart.items.findIndex((item) => {
        return item.productId === productId;
      });

      if (index !== -1 && quantity <= 0) {
        cart.items.splice(index, 1);
      } else if (index !== -1) {
        cart.items[index].quantity = cart.items[index].quantity + quantity;
      } else if (quantity > 0) {
        cart.items.push({
          productId: productId,
          quantity: quantity,
        });
      }

      cart.save().then((data) => {
        res.status(200).send({
          data: data,
        });
      });
    } else {
      const newCart = {
        email: email,
        items: [
          {
            productId: productId,
            quantity: quantity,
          },
        ],
      };

      cart = new Cart(newCart);

      cart.save().then((data) => {
        res.status(200).send({
          data: data,
        });
      });
    }
  });
};


// Display cart for user
exports.getCart = function (req, res) {
    const email = req.query.email;

    Cart.findOne({ email: email })
      .then((data) => {
        if (!data) {
          return res.status(404).send({
            success: false,
            message: "No cart exists for user " + email,
          });
        }
        res.send({
          data: data,
        });
      })
      .catch((err) => {
        return res.status(500).send({
          success: false,
          message: "Error retrieving cart for " + email,
        });
      });
}