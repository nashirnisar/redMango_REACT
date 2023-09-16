import React, { useState } from "react";
import { orderSummaryProps } from "./orderSummaryProps";
import { cartItemModel } from "../../../Interfaces";
import { getStatusColor } from "../../../Helper";
import { useNavigate } from "react-router-dom";
import { SD_ROLES, SD_Status } from "../../../Utility/SD";
import { useSelector } from "react-redux";
import { RootState } from "../../../Storage/Redux/store";
import { useUpdateOrderHeaderMutation } from "../../../Api/orderApi";
import { MainLoader } from "../Common";

function OrderSummary({ data, userInput }: orderSummaryProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const badgeTypeColor = getStatusColor(data.status!);
  const userData = useSelector((state: RootState) => state.userAuthStore);
  const [updateOrderHeader] = useUpdateOrderHeaderMutation();

  // Check if data and data.cartItems are defined before accessing them
  if (!data || !data.cartItems) {
    return null; // Return null or handle the case when data is not available
  }
  console.log(data.status);

  //if status is one thing then the button does other next status
  const nextStatus: any =
    data.status! === SD_Status.CONFIRMED
      ? { color: "info", value: SD_Status.BEING_COOKED }
      : data.status! === SD_Status.BEING_COOKED
      ? { color: "warning", value: SD_Status.READY_FOR_PICKUP }
      : data.status! === SD_Status.READY_FOR_PICKUP && {
          color: "success",
          value: SD_Status.COMPLETED,
        };
  const handleNextStatus = async () => {
    setIsLoading(true);
    await updateOrderHeader({
      orderHeaderId: data.id,
      status: nextStatus.value,
    });
    setIsLoading(false);
  };
  const handleCancel = async () => {
    setIsLoading(true);
    await updateOrderHeader({
      orderHeaderId: data.id,
      status: SD_Status.CANCELLED,
    });
    setIsLoading(false);
  };

  return (
    <div>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <>
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="text-success">Order Summary</h3>
            <span className={`btn btn-outline-${badgeTypeColor} fs-6`}>
              {data?.status ? data.status : "Order Not Placed"}
            </span>
          </div>
          <div className="mt-3">
            <div className="border py-3 px-2">Name : {userInput.name} </div>
            <div className="border py-3 px-2">Email : {userInput.email} </div>
            <div className="border py-3 px-2">
              Phone : {userInput.phoneNumber}{" "}
            </div>
            <div className="border py-3 px-2">
              <h4 className="text-success">Menu Items</h4>
              <div className="p-3">
                {data.cartItems.map(
                  (cartItem: cartItemModel, index: number) => {
                    return (
                      <div className="d-flex" key={index}>
                        <div className="d-flex w-100 justify-content-between">
                          <p>{cartItem?.menuItem?.name}</p>
                          <p>
                            ${cartItem?.menuItem?.price} x {cartItem?.quantity}{" "}
                            =
                          </p>
                        </div>
                        <p style={{ width: "70px", textAlign: "right" }}>
                          $
                          {(cartItem?.menuItem?.price ?? 0) *
                            (cartItem?.quantity ?? 0)}
                        </p>
                      </div>
                    );
                  }
                )}
                <hr />
                <h4 className="text-danger" style={{ textAlign: "right" }}>
                  ${data?.cartTotal?.toFixed(2)}
                </h4>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
              >
                Back to Orders
              </button>
              {userData.role === SD_ROLES.ADMIN && (
                <div className="d-flex">
                  {/* only show cancel when not completed or cancelled */}
                  {data.status! !== SD_Status.COMPLETED &&
                    data.status! !== SD_Status.CANCELLED && (
                      <button
                        className="btn btn-danger mx-2"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    )}

                  <button
                    className={`btn btn-${nextStatus.color}`}
                    onClick={handleNextStatus}
                  >
                    {nextStatus.value}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default OrderSummary;
