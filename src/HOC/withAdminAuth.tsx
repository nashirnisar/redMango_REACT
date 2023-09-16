import { SD_ROLES } from "../Utility/SD";
import jwt_decode from "jwt-decode";
const withAdminAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const accessToken = localStorage.getItem("token") ?? "";
    if (!accessToken) {
      window.location.replace("/login"); // Redirect to login if no token
      return null;
    }

    const decode: { role: string } = jwt_decode(accessToken);
    if (decode.role !== SD_ROLES.ADMIN) {
      window.location.replace("/accessDenied"); // Redirect to accessDenied if role is not ADMIN
      return null;
    }

    return <WrappedComponent {...props} />; // Allow access to component if role is ADMIN
  };
};

export default withAdminAuth;
