import {OrderPlace} from "./Services"
import { loadStripe } from "@stripe/stripe-js";

export async function initStripe() {
  const stripe = await loadStripe(
    "pk_test_51IInmcKtJexSjPcDQtmyMu1dg3TJ7quJ8zxNz8u0BTTAcfT4zTBQPMlxOGSIfzowSnJ5R4tBMhrLrO0C0BHZquiT00W5LKTXnZ"
  );
  let card = null;
  function mountWidget() {
    const elem = stripe.elements();
    let style = {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue",Helvetica,sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    };

    card = elem.create("card", { style, hidePostalCode: true });
    card.mount("#card-elem");
  }

  const PaymentType = document.getElementById("PaymentType");
  if (!PaymentType) {
    return;
  }
  PaymentType.addEventListener("change", (e) => {
    console.log(e.target.value);

    if (e.target.value === "card") {
      //   display widget
      mountWidget();
    } else {
      card.destroy();
    }
  });

  //call Ajax
  const cartFrom = document.getElementById("cartFrom");
  if (cartFrom) {
    cartFrom.addEventListener("submit", (e) => {
      e.preventDefault();
      let formdata = new FormData(cartFrom);
      let formObject = {};
      for (let [key, value] of formdata.entries()) {
        formObject[key] = value;
      }

      
      if(!card){
        OrderPlace(formObject);
        return;
      }

      //verify card
      stripe
        .createToken(card)
        .then((result) => {
          formObject.stripeToken=result.token.id;
          OrderPlace(formObject);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
}
