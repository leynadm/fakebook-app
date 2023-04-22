import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Feed from "./Feed";
const Home = () => {

/* 
  const { currentUser } = useContext(AuthContext);

  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.email);
    }

}, [currentUser, userName]);
  */

  return (
    <div>
      <Navbar/>
      <Feed/>
    </div>
  );
};

export default Home;
