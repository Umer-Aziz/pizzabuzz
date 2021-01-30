const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: { type: Object, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    PaymentType: { type: String, default: "COD" },
    status: { type: String, default: "Order_Placed" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
