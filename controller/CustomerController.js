const express = require("express");
const bcrypt = require("bcrypt");

const Customer = require("../models/Customer");

// customer signup
exports.signup = async (req, res) => {
  //validate request
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).send({
      success: false,
      message: "Username, email and password are manditory fields.",
    });
  }

  // create a customer
  let customer = new Customer({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
  });

  await Customer.findOne({ email: customer.email })
    .then(async (profile) => {
      if (!profile) {
        bcrypt.hash(customer.password, 10, async (err, hash) => {
          if (err) {
            res.status(500).send({
              success: false,
              message:
                err.message ||
                "Some error occurred while creating the customer.",
            });
          } else {
            customer.password = hash;
            await customer
              .save()
              .then(() => {
                res.status(201).send(customer);
              })
              .catch((err) => {
                res.status(500).send({
                  success: false,
                  message:
                    err.message ||
                    "Some error occurred while creating the customer.",
                });
              });
          }
        });
      } else {
        res.status(200).send("User exists");
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while creating the customer.",
      });
    });
};

//Customer Login

exports.login = async (req, res) => {
  //validate request
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      success: false,
      message: "email and password are required for login.",
    });
  }

  var customer = {};
  customer.email = req.body.email;
  customer.password = req.body.password;

  await Customer.findOne({ email: customer.email })
    .then((profile) => {
      if (!profile) {
        res.status(404).send("user not found");
      } else {
        bcrypt.compare(
          customer.password,
          profile.password,
          async (err, result) => {
            if (err) {
              res.status(500).send("Internal error  occoured");
            } else if (result == true) {
              res.status(200).send("login successful");
            } else {
              res.status(400).send("Invalid login details");
            }
          }
        );
      }
    })
    .catch((err) => {
      res.status(500).send("Internal error occoured");
    });
};

//edit profile
exports.editProfile = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).send({
      success: false,
      message: "Email is manditory to update the profile.",
    });
  }

  var customer = {};
  customer.email = req.body.email;

  Customer.findOne({ email: customer.email })
    .then((profile) => {
      if (!profile) {
        res.status(404).send("User does not exists.");
      } else {
        var name = req.body.name.trim();
        var password = req.body.password.trim();
        var phone = req.body.phone.trim();

        if (name) {
          profile.name = name;
        }

        if (password) {
          bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
              res.status(500).send({
                success: false,
                message:
                  err.message ||
                  "Some error occurred while updating customer profile.",
              });
            } else {
              profile.password = hash;
            }
          });
        }

        if (phone) {
          profile.phone = phone;
        }

        profile
          .save()
          .then(() => {
            res.status(200).send(profile);
          })
          .catch((err) => {
            res.status(500).send({
              success: false,
              message:
                err.message ||
                "Some error occurred while updating customer profile.",
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while updating customer profile.",
      });
    });
};
