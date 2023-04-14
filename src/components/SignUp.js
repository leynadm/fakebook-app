import React,{useState,useEffect,useContext} from "react";
import { AuthContext } from "./Auth";
function SignUp(){

    const { currentUser } = useContext(AuthContext);

    const [userName, setUserName] = useState("");
  
    useEffect(() => {
      if (currentUser) {
        setUserName(currentUser.displayName);
      }
      console.log(userName)
  }, [currentUser,userName]);
  
    return(
        <div>
            <div>Sign Up</div>
            <div>{userName}</div>
        </div>
    )
}

export default SignUp