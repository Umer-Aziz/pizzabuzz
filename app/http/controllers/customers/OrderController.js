const Order = require("../../../models/Order");
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
function OrderController() {
  return {
    store(req, res) {
      //validate request
      const { phone, address, stripeToken, PaymentType } = req.body;
      if (!phone || !address) {
        return res.status(422).json({ message: "All fields are required" });
      }
      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone,
        address,
      });
      order
        .save()
        .then((result) => {
          Order.populate(result, { path: "customerId" }, (err, PlaceOrder) => {
            // req.flash("success", "Order Placed Successfully");

            //  stripe payment
            if (PaymentType === "card") {
              stripe.charges
                .create({
                  amount: req.session.cart.totalPrice * 100,
                  source: stripeToken,
                  currency: "pkr",
                  description: `pizza order: ${PlaceOrder._id}`,
                })
                .then(() => {
                  PlaceOrder.paymentStatus = true;
                  PlaceOrder.PaymentType=PaymentType;
                  PlaceOrder.save()
                    .then((ord) => {
                       //Emit Event
            const eventEmitter = req.app.get("eventEmitter");
            eventEmitter.emit("orderPlace", ord);
            delete req.session.cart;
            return res.json({message:"Payment successful,Order Placed Successfully"})

                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  delete req.session.cart;
                  return res.json({ message: "Order Placed but Payment failed,Try again with valid card or pay at delivery time" });

                });
            }else{
              delete req.session.cart; 
              return res.json({ message: "Order Placed successfully" });

            }
          });
        })
        .catch((err) => {
          return res.status(500).json({ message: "Something Went Wrong" });

        });
    },
    async GetStore(req, res) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      res.header(
        "Cache-Control",
        "no-cache,private,no-store,must-revalidate,max-state=0,post-check=0, pre-check=0"
      );

      res.render("customers/orders", { orders: orders, moment: moment });
    },
    async ShowOrder(req, res) {
      const order = await Order.findById(req.params.id);
      //check authorize user
      if (req.user._id.toString() === order.customerId.toString()) {
        return res.render("customers/singleOrder", { order });
      }
      return res.redirect("/");
    },
  };
}

module.exports = OrderController;
