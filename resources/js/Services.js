import axios from "axios";
import Noty from "noty";

export function OrderPlace(formObject){
    
    axios
    .post("/Orders", formObject)
    .then((res) => {
      new Noty({
        type: "success",
        timeout: 2000,
        text: res.data.message,
        progressBar: false,
      }).show();
      setTimeout(() => {
        window.location.href = "/customer/orders";
      }, 1000);
    })
    .catch((err) => {
      new Noty({
        type: "error",
        timeout: 2000,
        text: err.res.data.message,
        progressBar: false,
      }).show();
    });
}