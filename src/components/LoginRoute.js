import React, { useContext } from "react";
import {  Navigate, Outlet } from "react-router";
import { AuthContext } from "./Auth";

const LoginRoute = () => {
  const { currentUser } = useContext(AuthContext);
  
  return currentUser ? <Outlet /> : <Navigate to={"/feed"} />;
};
export default LoginRoute;
