import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./Auth";
function Feed() {
  const  {currentUser}  = useContext(AuthContext);

  const [userName, setUserName] = useState("");
  console.log(currentUser)
  useEffect(() => {
    if(currentUser){
      setUserName(currentUser.displayName)
    }
  }, [currentUser]);

  return (
    <>
      <div>Feed</div><div>{userName}</div>
    </>
  );
}

export default Feed;
