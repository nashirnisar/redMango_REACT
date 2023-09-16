import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Header, Footer } from "../Components/Layout"; // cleaner approach than importing both separately
import {
  AccessDenied,
  AllOrders,
  AuthenticationTest,
  AuthenticationTestAdmin,
  Home,
  Login,
  MenuItemDetails,
  MenuItemList,
  MenuItemUpsert,
  MyOrders,
  NotFound,
  OrderConfirmed,
  OrderDetails,
  Payment,
  Register,
  ShoppingCart,
} from "../Pages";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetShoppingCartQuery } from "../Api/shoppingCartApi";
import { setShoppingCart } from "../Storage/Redux/shoppingCartSlice";
import jwt_decode from "jwt-decode";
import { userModel } from "../Interfaces";
import { setLoggedInUser } from "../Storage/Redux/userAuthSlice";
import { RootState } from "../Storage/Redux/store";
function App() {
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const dispatch = useDispatch();
  const [skip, setSkip] = useState(true);
  const { data, isLoading } = useGetShoppingCartQuery(userData.id, {
    skip: skip,
  });

  useEffect(() => {
    if (!isLoading) {
      dispatch(setShoppingCart(data?.result?.cartItems));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  //check wheather the user is logged in and set redux values acccordingly
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      const { fullName, id, role, email }: userModel = jwt_decode(localToken);
      dispatch(setLoggedInUser({ fullName, id, role, email }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (userData.id) {
      setSkip(false);
    }
  }, [userData.id]);

  return (
    <div>
      <Header />
      <div className="pb-5">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route
            path="/menuItemDetails/:menuItemId"
            element={<MenuItemDetails />}
          ></Route>
          <Route path="/shoppingCart" element={<ShoppingCart />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route
            path="/authentication"
            element={<AuthenticationTest />}
          ></Route>
          <Route
            path="/authorization"
            element={<AuthenticationTestAdmin />}
          ></Route>
          <Route path="/accessDenied" element={<AccessDenied />}></Route>
          <Route path="/payment" element={<Payment />}></Route>
          <Route
            path="/order/orderConfirmed/:id"
            element={<OrderConfirmed />}
          ></Route>
          <Route path="/order/myorders" element={<MyOrders />}></Route>
          <Route path="/order/allorders" element={<AllOrders />}></Route>
          <Route
            path="/order/orderDetails/:id"
            element={<OrderDetails />}
          ></Route>
          <Route
            path="/menuItem/menuItemList"
            element={<MenuItemList />}
          ></Route>
          <Route
            path="/menuItem/menuItemUpsert/:id"
            element={<MenuItemUpsert />}
          ></Route>
          <Route
            path="/menuItem/menuItemUpsert"
            element={<MenuItemUpsert />}
          ></Route>

          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
