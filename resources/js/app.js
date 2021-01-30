import axios from "axios";
import Noty from "noty";
import moment from "moment";
import initAdmin from "./admin";

let addToCart = document.querySelectorAll(".add-cart");
let Cart_Counter = document.getElementById("CartCounter");

function UpdateCart(pizza) {
  axios
    .post("/update-cart", pizza)
    .then((res) => {
      Cart_Counter.innerText = res.data.totalQty;
      new Noty({
        type: "success",
        timeout: 2000,
        text: "item added to cart",
        progressBar: false,
      }).show();
    })
    .catch((err) => {
      new Noty({
        type: "error",
        timeout: 2000,
        text: "Something went wrong",
        progressBar: false,
      }).show();
    });
}

addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let pizza = JSON.parse(btn.dataset.pizza);
    UpdateCart(pizza);
  });
});

//removing alert messge for order pizzaz

const alertMsg = document.getElementById("success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}


//update order Status
let Orderstatus = document.querySelectorAll(".statusLine");
let HiddenInput = document.getElementById("InputHidden");
let order = HiddenInput ? HiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement("small");

function UpdateStatus(order) {
  Orderstatus.forEach((status)=>{
    status.classList.remove("step-completed");
    status.classList.remove("current");
  })
  let StepCompleted = true;
  Orderstatus.forEach((status) => {
    let getData = status.dataset.status;
    if (StepCompleted) {
      status.classList.add("step-completed");
    }
    if (getData === order.status) {
      StepCompleted = false;
      time.innerText = moment(order.updatedAt).format("hh:mm A");
      status.appendChild(time);
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add("current");
      }
    }
  });
}
UpdateStatus(order);

   let socket = io();
   initAdmin(socket);
   //join socket
   if(order){

       socket.emit('join',`order_${order._id}`);
   }
   let adminpath=window.location.pathname;
   console.log(adminpath);
   if(adminpath.includes('admin')){
     socket.emit('join',"adminRoom");
   }

   socket.on('orderUpdated',(data)=>{
       const updatedOrder={...order }
       updatedOrder.updatedAt=moment().format();
       updatedOrder.status=data.status;
       UpdateStatus(updatedOrder);
       new Noty({
        type: "success",
        timeout: 2000,
        text: "Order Updated",
        progressBar: false,
      }).show();
       
   })

