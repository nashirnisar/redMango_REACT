import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { apiResponse, cartItemModel, userModel } from "../../../Interfaces";
import { RootState } from "../../../Storage/Redux/store";
import { inputHelper } from "../../../Helper";
import { MiniLoader } from "../Common";
import { useInitiatePaymentMutation } from "../../../Api/paymentApi";
import { useNavigate } from "react-router-dom";

function CartPickUpDetails() {
  const shoppingCartFromStore: cartItemModel[] = useSelector(
    (state: RootState) => state.shoppingCartStore.cartItems ?? []
  );
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  let grandTotal = 0;
  let totalItems = 0;
  shoppingCartFromStore?.map((cartItems: cartItemModel) => {
    totalItems += cartItems.quantity ?? 0;
    grandTotal += (cartItems.menuItem?.price ?? 0) * (cartItems.quantity ?? 0);
    return null;
  });
  const [initiatePayment] = useInitiatePaymentMutation();
  const navigate = useNavigate();
  //controlled component for more than 1 input value
  const initialUserData = {
    name: userData.fullName,
    email: userData.email,
    phoneNumber: "",
  };
  const [userInput, setUserInput] = useState(initialUserData);
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };
  useEffect(() => {
    setUserInput({
      name: userData.fullName,
      email: userData.email,
      phoneNumber: "",
    });
  }, [userData]);

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const { data }: apiResponse = await initiatePayment(userData.id);
    const orderSummary = { grandTotal, totalItems };

    navigate("/payment", {
      state: { apiResult: data?.result, userInput, orderSummary },
    });
  };

  return (
    <div className="border pb-5 pt-3">
      <h1 style={{ fontWeight: "300" }} className="text-center text-success">
        Pickup Details
      </h1>
      <hr />
      <form className="col-10 mx-auto" onSubmit={handleSubmit}>
        <div className="form-group mt-3">
          Pickup Name
          <input
            type="text"
            value={userInput.name}
            className="form-control"
            placeholder="name..."
            name="name"
            onChange={handleUserInput}
            required
          />
        </div>
        <div className="form-group mt-3">
          Pickup Email
          <input
            type="email"
            value={userInput.email}
            className="form-control"
            placeholder="email..."
            name="email"
            onChange={handleUserInput}
            required
          />
        </div>

        <div className="form-group mt-3">
          Pickup Phone Number
          <input
            type="number"
            value={userInput.phoneNumber}
            className="form-control"
            placeholder="phone number..."
            name="phoneNumber"
            onChange={handleUserInput}
            required
          />
        </div>
        <div className="form-group mt-3">
          <div className="card p-3" style={{ background: "ghostwhite" }}>
            <h5>Grand Total : ${grandTotal.toFixed(2)}</h5>
            <h5>No of items : {totalItems}</h5>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-lg btn-success form-control mt-3"
          disabled={isLoading}
        >
          {isLoading ? <MiniLoader /> : "Looks Good? Place Order!"}
        </button>
      </form>
    </div>
  );
}

export default CartPickUpDetails;
