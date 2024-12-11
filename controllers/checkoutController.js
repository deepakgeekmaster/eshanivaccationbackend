const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Function to create a Stripe Checkout session
exports.createCheckoutSession = async (req, res) => {
  try {
    const { totalAmount, propertyName, nights } = req.body; // Get the total amount, property name, and nights from frontend

    // Create the Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aed",
            product_data: {
              name: propertyName,
            },
            unit_amount: totalAmount * 100, // Convert to the smallest currency unit (cents)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    // Return the session ID to the client
    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).send("Internal Server Error");
  }
};
