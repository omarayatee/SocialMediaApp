import React, { useContext } from "react";

import { Navigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function AuthProtectedRoutes({ children }) {
  const { userToken } = useContext(AuthContext);
  if (userToken !== null) {
    return <Navigate to={"/home"} />;
  }
  return <>{children}</>;
}