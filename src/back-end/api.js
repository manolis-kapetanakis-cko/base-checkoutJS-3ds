const route = require("express").Router();
const { Checkout } = require("checkout-sdk-node");
const cko = new Checkout("sk_test_07fa5e52-3971-4bab-ae6b-a8e26007fccc");

route.post("/payWithToken", async (req, res) => {
  const payment = await cko.payments.request({
    source: {
      token: req.body.token
    },
    "3ds": {
      enabled: true
    },
    success_url: req.body.url + "/success",
    currency: "GBP",
    amount: 14842, // pence
    reference: "CKO.JS order"
  });
  console.log("Payment");
  console.log(payment);
  res.send(payment);
});

// Get payment details by cko-session-id
route.post("/getPaymentBySession", async (req, res) => {
  const details = await cko.payments.get(req.body.sessionId);
  res.send(details);
});

module.exports = route;
