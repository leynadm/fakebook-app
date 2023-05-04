import React, { useState, ChangeEvent, useEffect } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  getAdditionalUserInfo
} from "firebase/auth";
import { auth,db  } from "../config/firebase";
import { AuthContext } from "./Auth";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { setDoc, doc, arrayUnion,getDoc} from "firebase/firestore";
import { User } from "../types/user";
  
function Login() {
  const userAuth = getAuth();
  const provider = new GoogleAuthProvider();
  //const history = useHistory()
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [slogan, setSlogan] = useState("");

  function handleSignUpClick() {
    navigate("/signup");
  }

  useEffect(() => {
    setSlogan(pickRandomSlogan());
  }, []);

  function pickRandomSlogan() {
    const slogansList = [
      "Because who needs real friends?",
      "Where pretending is encouraged!",
      "Because reality is overrated!",
      "Your online pretend alter ego awaits.",
      "All the likes, none of the authenticity.",
      "Where your profile is your work of fiction.",
      "Why be real when you can pretend?",
      "The fake it 'til you make it platform.",
      "Pretend to be whoever you want to be.",
      "The land of fake smiles and perfect selfies.",
      "No lies needed, just a funny profile.",
      "Humorous profiles, hilarious friends.",
      "Satirical friends are the best kind.",
      "Fakery allowed, for humor and parody.",
      "A social app for funny fakes, not for true fakes.",
      "Parody your profile, make parody friends.",
      "Sarcasm and satire, mild fakeness required.",
      "Create a new persona and make parody friends.",
    ];
    const randomIndex = Math.floor(Math.random() * slogansList.length);
    return slogansList[randomIndex];
  }

  function SignInWithGoogle() {
    signInWithPopup(userAuth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);

        if (credential) {
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log('logging in result:')
          console.log(result)
          const newUserCheck = getAdditionalUserInfo(result)
          if(newUserCheck?.isNewUser){
            createUserDoc(user.uid,user.displayName)
          }
           // Query the users collection to retrieve the document with the given userID
           
           
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


  async function createUserDoc(userID:string, fullname:string|null){
    
    const userDoc = await getDoc(doc(db, "users", userID));

    if (!userDoc.exists()) {
 
    await setDoc(doc(db, "users", userID), {
      sex: "",
      birthdate: new Date(1800, 1, 30),
      name: "",
      surname: "",
      bio: "",
      verified: false,
      fullname: arrayUnion("","",fullname),
      profileImage:"https://firebasestorage.googleapis.com/v0/b/stalkbook-99d40.appspot.com/o/default-images%2Fdefault-profile-picture.jpg?alt=media&token=0f487134-f813-4975-836c-f32df2eded81",
      coverImage:"https://firebasestorage.googleapis.com/v0/b/stalkbook-99d40.appspot.com/o/default-images%2Fdefault-cover-picture.jpeg?alt=media&token=e9306795-fffe-4c3e-9a18-3678c8b87cc8"
    });
    
  };

  

  }





  /* Sign in with email and password */

  function handleLogIn(e: ChangeEvent<HTMLFormElement>) {
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

      <div className="login-wrapper-top">
        <div className="brand-name">fakebook</div>
        <div className="brand-slogan">{slogan}</div>

        <form onSubmit={handleLogIn}>
          
          <div className="login-group">
            <input
            className="login-input"
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="login-highlight"></span>
            <span className="login-bar"></span>
            <label className="login-label">Your email address</label>
          </div>

          <div className="login-group">
            <input
              className="login-input"
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="login-highlight"></span>
            <span className="login-bar"></span>
            <label className="login-label">Your password</label>
          </div>
          <button className="login-btn" type="submit">
            Log In
          </button>
        </form>
        <div className="login-additional-options">You can also...</div>
        <button
          className="google-login-btn"
          type="button"
          onClick={SignInWithGoogle}
        >
          LOG IN WITH GOOGLE
        </button>
        <div className="login-signup-option">
          Don't have an account?{" "}
          <span>
            <button
              className="signup-btn"
              type="button"
              onClick={handleSignUpClick}
            >
              Click to sign up!
            </button>
          </span>
        </div>
      </div>

      <div className="login-wrapper-bottom">
        <div className="login-wrapper-info">This app has been created by Daniel Matei (me)<br></br> as the final project of The Odin Project's Javascript module.<br></br><br></br> I would claim that all rights are reserved, but the truth is I didn't reserve any. <br></br> You are welcome to join the app and use it in good faith.<br></br><br></br>You can check my github or LinkedIn profiles to get in touch,<br></br> or email me at matei_daniel@outlook.com.</div>
      </div>
    </div>
  );
}

export default Login;
