import React, { useState, useEffect, useContext,ChangeEvent } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { AuthContext } from "./Auth";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
//import { useHistory } from "react-router-dom";

function Login() {
  const userAuth = getAuth();
  const provider = new GoogleAuthProvider();
  const { currentUser } = useContext(AuthContext);
  //const history = useHistory()
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignUpClick() {
    navigate("/signup");
  };

  function SignInWithGoogle() {
    signInWithPopup(userAuth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        
        if(credential){
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log(user);
  
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        }

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

  /* Sign in with email and password */

  function handleLogIn(e:ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  return (
    <div className="login-wrapper">
      <div>Stalkbook</div>
      <div>Find out who's stalking you and stalk them back!</div>
      <div></div>
      <div></div>
      <form onSubmit={handleLogIn}>
        <input
          type="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Add your email address here"
        />
        <input
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Add your password here"
        />
        <button type="submit">Login</button>
      </form>
      <div>You can also...</div>
      <button type="button" onClick={SignInWithGoogle}>
        LOG IN WITH GOOGLE
      </button>
      <div>
        Don't have an account?{" "}
        <span>
          <button type="button" onClick={handleSignUpClick}>
            Sign Up Here!
          </button>
        </span>
      </div>
    </div>
  );
}

export default Login;
