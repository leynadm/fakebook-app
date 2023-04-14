import React, { useContext, useEffect } from "react";
import {  Navigate, Outlet } from "react-router";
import { AuthContext } from "./Auth";
import {auth} from "../config/firebase"
const PrivateRoute = () => {

  const currentUser  = useContext(AuthContext);
    
  return currentUser ? <Outlet /> : <Navigate to="/login" />;

};
export default PrivateRoute;
