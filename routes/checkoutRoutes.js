const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");

// Define the route to create a checkout session
router.post("/create-checkout-session", checkoutController.createCheckoutSession);

module.exports = router;
