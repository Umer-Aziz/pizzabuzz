const Order = require("../../../models/Order");
const moment = require("moment");
function OrderController() {
  return {
    store(req, res) {
      //validate request

      const { phone, address } = req.body;
      if (!phone || !address) {
        req.flash("error", "All fields are required");
        return res.redirect("/cart");
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

          Order.populate(result,{path:"customerId"},(err,PlaceOrder)=>{
            req.flash("success", "Order Placed Successfully");
            delete req.session.cart;
            //Emit Event
             
            const eventEmitter = req.app.get("eventEmitter");
            eventEmitter.emit("orderPlace",PlaceOrder);
  
            return res.redirect("/customer/orders");
          })
        
        })
        .catch((err) => {
          req.flash("error", "Something Went Wrong");
          return res.redirect("/cart");
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
 async ShowOrder(req,res){
  
      const order= await Order.findById(req.params.id)
    //check authorize user
    if(req.user._id.toString() === order.customerId.toString()){

    return  res.render('customers/singleOrder',{order})

    }
    return  res.redirect("/");

    }
  };
}

module.exports = OrderController;
