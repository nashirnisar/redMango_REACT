import React, { useEffect, useState } from "react";
import { withAdminAuth } from "../../HOC";

import { useGetAllOrdersQuery } from "../../Api/orderApi";
import OrderList from "../../Components/Page/Order/OrderList";
import { MainLoader } from "../../Components/Page/Common";
import { SD_Status } from "../../Utility/SD";
import { inputHelper } from "../../Helper";
import { orderHeaderModel } from "../../Interfaces";

const filterOptions = [
  "All",
  SD_Status.CONFIRMED,
  SD_Status.BEING_COOKED,
  SD_Status.CANCELLED,
  SD_Status.READY_FOR_PICKUP,
];
function AllOrders() {
  const { data, isLoading } = useGetAllOrdersQuery("");
  const [orderData, setOrderData] = useState([]);
  const [filters, setFilters] = useState({ searchString: "", status: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const tempValue = inputHelper(e, filters);
    setFilters(tempValue);
  };

  const handleFilters = () => {
    const tempData = data.result.filter((orderData: orderHeaderModel) => {
      if (
        (orderData.pickupName &&
          orderData.pickupName.includes(filters.searchString)) ||
        (orderData.pickupEmail &&
          orderData.pickupEmail.includes(filters.searchString)) ||
        (orderData.pickupPhoneNumber &&
          orderData.pickupPhoneNumber.toString().includes(filters.searchString))
      ) {
        return true; // Include orderData if any of the conditions are met
      }
    });

    const finalArray = tempData.filter((orderData: orderHeaderModel) => {
      return filters.status !== "" ? orderData.status === filters.status : true; // Include or exclude based on status filter
    });

    // Return the finalArray or do something with it
    setOrderData(finalArray);
  };
  useEffect(() => {
    if (data) {
      setOrderData(data?.result);
    }
  }, [data]);
  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <>
          <div className="d-flex align-items-center justify-content-between mx-5 mt-5">
            <h1 className="text-success">Orders List</h1>
            <div className="d-flex" style={{ width: "40%" }}>
              <input
                onChange={handleChange}
                name="searchString"
                type="text"
                className="form-control mx-2"
                placeholder="Search Name, Email or Phone"
              />
              <select
                name="status"
                onChange={handleChange}
                className="form-select w-50 mx-2"
              >
                {filterOptions.map((item) => (
                  <option key={item} value={item === "All" ? "" : item}>
                    {item}
                  </option>
                ))}
              </select>

              <button
                className="btn btn-outline-success"
                onClick={handleFilters}
              >
                Filter
              </button>
            </div>
          </div>
          <OrderList isLoading={isLoading} orderData={orderData} />
        </>
      )}
    </>
  );
}

export default withAdminAuth(AllOrders);
