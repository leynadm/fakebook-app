import React,{useState,useEffect,useContext} from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app, auth } from "../config/firebase";
import { AuthContext } from "./Auth";
import "../styles/Login.css"
function Login() {

  const userAuth = getAuth();
  const provider = new GoogleAuthProvider();

  const { currentUser } = useContext(AuthContext);

  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.displayName);
    }
    console.log(userName);
  }, [currentUser]);

  
  function SignInWithGoogle() {
    signInWithPopup(userAuth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user)
        
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  return (
    <div className="login-wrapper">
      <div>Stalkbook</div>
      <div>Find out who's stalking you and stalk them back!</div>
      <div></div>
      <div></div>
      <form>
        <input type="email" placeholder="Add your email address here" />
        <input type="password" placeholder="Add your password here" />
      </form>
      <button type="button">
        Login
      </button>
      <div>You can also...</div>
      <button type="button" onClick={SignInWithGoogle}>
        LOG IN WITH GOOGLE
      </button>
      <div>
      {userName}
      </div>
    </div>
  );
}

export default Login
