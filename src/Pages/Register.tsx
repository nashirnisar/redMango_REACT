import React, { useState } from "react";
import { SD_ROLES } from "../Utility/SD";
import { inputHelper, toastNotify } from "../Helper";
import { MiniLoader } from "../Components/Page/Common";
import { apiResponse } from "../Interfaces";
import { useRegisterUserMutation } from "../Api/authApi";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [registerUser] = useRegisterUserMutation();
  const [isloading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    userName: "",
    password: "",
    role: "",
    name: "",
  });
  const handleUserInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const response: apiResponse = await registerUser({
      userName: userInput.userName,
      password: userInput.password,
      role: userInput.role,
      name: userInput.name,
    });
    if (response.data) {
      toastNotify("Registration successful! Please login to continue");
      navigate("/login");
    } else if (response.error) {
      toastNotify(response.error?.data?.errorMessages[0], "error");
    }
    setIsLoading(false);
  };

  return (
    <div className="container text-center">
      <form method="post" onSubmit={handleSubmit}>
        <h1 className="mt-5">Register</h1>
        <div className="mt-5">
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Email / Username"
              name="userName"
              value={userInput.userName}
              onChange={handleUserInput}
              required
            />
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              name="name"
              value={userInput.name}
              onChange={handleUserInput}
              required
            />
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              name="password"
              value={userInput.password}
              onChange={handleUserInput}
              required
            />
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <select
              className="form-control form-select"
              name="role"
              required
              value={userInput.role}
              onChange={handleUserInput}
            >
              <option value="">--Select Role--</option>

              {/* sd static files to avoid magic strings */}

              <option value={`${SD_ROLES.CUSTOMER}`}>Customer</option>
              <option value={`${SD_ROLES.ADMIN}`}>Admin</option>
            </select>
          </div>
        </div>
        <div className="mt-5">
          <button type="submit" className="btn btn-success">
            {isloading ? <MiniLoader /> : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
