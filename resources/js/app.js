import axios from "axios";
import Noty from "noty";

let addToCart=document.querySelectorAll(".add-cart");
let Cart_Counter=document.getElementById("CartCounter");

function UpdateCart(pizza){
axios.post("/update-cart",pizza).then(res =>{
     Cart_Counter.innerText=res.data.totalQty;
    new Noty({
        type:"success",
        timeout:2000,
        text:"item added to cart",
        progressBar:false
    }).show();
}).catch(err => {
    new Noty({
        type:"error",
        timeout:2000,
        text:"Something went wrong",
        progressBar:false
    }).show();
})
}

addToCart.forEach(btn => {
    
    btn.addEventListener("click",(e)=>{
        let pizza=JSON.parse(btn.dataset.pizza);
        UpdateCart(pizza);
        
    })
});