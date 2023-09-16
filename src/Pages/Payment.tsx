import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";
import { PaymentForm } from "../Components/Page/Payment";
import { OrderSummary } from "../Components/Page/Order";

function Payment() {
  const {
    state: { apiResult, userInput },
  } = useLocation();
  // Check if apiResult is defined before accessing its properties
  const stripePromise = apiResult
    ? loadStripe(
        "pk_test_51MG6xmDU3OjDrP4GJV8avgtFNNGxikOffHWtYgncDFkahat38KLX3foPPgFbk0JHNG2FmYhIpSNl2lqbnR3uEfRM00Bv0LptTW"
      )
    : null;
  const options = {
    // passing the client secret obtained from the server if apiResult is defined
    clientSecret: apiResult ? apiResult.clientSecret : "",
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <div className="container m-5 p-5">
        <div className="row">
          <div className="col-md-7">
            {/* // we passed  api response as data we can change the name of the thing we send as props  */}
            <OrderSummary data={apiResult} userInput={userInput} />
          </div>
          <div className="col-md-4 offset-md-1">
            <h1 className="text-success">Payment</h1>
            <div className="mt-5">
              <PaymentForm data={apiResult} userInput={userInput} />
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default Payment;
