import React, { useState } from "react";
import { inputHelper, toastNotify } from "../Helper";
import { apiResponse, userModel } from "../Interfaces";
import { useLoginUserMutation } from "../Api/authApi";
import { MiniLoader } from "../Components/Page/Common";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { setLoggedInUser } from "../Storage/Redux/userAuthSlice";
import { useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser] = useLoginUserMutation();
  const [isloading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    userName: "",
    password: "",
  });
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const response: apiResponse = await loginUser({
      userName: userInput.userName,
      password: userInput.password,
    });
    if (response.data) {
      const { token } = response.data.result;
      const { fullName, id, email, role }: userModel = jwt_decode(token);
      localStorage.setItem("token", token);
      dispatch(setLoggedInUser({ fullName, id, email, role }));
      navigate("/");
    } else if (response.error) {
      toastNotify(response.error.data?.errorMessages[0], "error");
    }
    setIsLoading(false);
  };
  return (
    <div className="container text-center">
      <form method="post" onSubmit={handleSubmit}>
        <h1 className="mt-5">Login</h1>
        <div className="mt-5">
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              className="form-control"
              name="userName"
              value={userInput.userName}
              onChange={handleUserInput}
              placeholder="Enter Username"
              required
            />
          </div>

          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="password"
              className="form-control"
              name="password"
              value={userInput.password}
              onChange={handleUserInput}
              placeholder="Enter Password"
              required
            />
          </div>
        </div>

        <div className="mt-2">
          <button
            type="submit"
            className="btn btn-success"
            style={{ width: "200px" }}
          >
            {isloading ? <MiniLoader /> : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
