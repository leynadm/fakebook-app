import React, { useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { AuthContext } from "./Auth";
import Navbar from "./Navbar";
const Home = () => {
  const { currentUser } = useContext(AuthContext);

  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.displayName);
    }
    console.log(userName)
}, [currentUser]);
 

  return (
    <div>
      <div>Home</div>
      <div>{userName}</div>
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
};

export default Home;
