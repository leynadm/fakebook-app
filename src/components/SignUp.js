import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./Auth";
import { auth } from "../config/firebase";

function SignUp() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div>
      <div>Sign Up</div>
      <div>Can have user name</div>
    </div>
  );
}

export default SignUp;
