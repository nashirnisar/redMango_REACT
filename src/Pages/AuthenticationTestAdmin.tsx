import React from "react";
import { withAdminAuth } from "../HOC";

function AuthenticationTestAdmin() {
  return <div>this page can be only accessed by the role of ADMIN</div>;
}

export default withAdminAuth(AuthenticationTestAdmin);
