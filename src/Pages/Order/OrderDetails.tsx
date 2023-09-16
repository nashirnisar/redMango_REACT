import React from "react";
import { useParams } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../../Api/orderApi";
import { OrderSummary } from "../../Components/Page/Order";

function OrderDetails() {
  const { id } = useParams();
  const { data, isLoading } = useGetOrderDetailsQuery(id);
  let userInput, orderDetails;
  if (!isLoading && data?.result) {
    let result = data.result[0];
    userInput = {
      name: result.pickupName,
      email: result.pickupEmail,
      phoneNumber: result.pickupPhoneNumber,
    };
    orderDetails = {
      id: result.orderHeaderId,
      cartItems: result.orderDetails,
      cartTotal: result.orderTotal,
      status: result.status,
    };
  }

  return (
    <div
      className="container my-5 mx-auto p-5 w-100"
      style={{ maxWidth: "750px" }}
    >
      {!isLoading && orderDetails && userInput && (
        <OrderSummary data={orderDetails} userInput={userInput} />
      )}
    </div>
  );
}

export default OrderDetails;
