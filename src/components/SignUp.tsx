import React, { useState, useEffect, useContext, ChangeEvent } from "react";
import { AuthContext } from "./Auth";
import "../styles/SignUp.css";
import { auth, db } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, arrayUnion } from "firebase/firestore";

function SignUp() {
  const { currentUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [sex, setSex] = useState("");

  const handleSexChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSex(e.target.value);
  };

  async function addMyDocument() {
    await setDoc(doc(db, "users", "Me"), {
      name: "Me",
    });
  }

  function isFirebaseError(
    error: unknown
  ): error is { code: string; message: string } {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      "message" in error &&
      typeof (error as any).code === "string" &&
      typeof (error as any).message === "string"
    );
  }

  const handleSignUp = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);
      const user = userCredential.user;
      console.log("SecondUserUid (user.uid): " + user.uid);
      await setDoc(doc(db, "users", user.uid), {
        sex: sex,
        birthdate: birthdate,
        name: name,
        surname: surname,
        bio: "",
        verified: false,
        fullname: arrayUnion(name, surname, name + " " + surname),
      });
    } catch (error) {
      if (isFirebaseError(error)) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(email, password);
      } else {
        console.log("An unknown error occurred:", error);
      }
    }
  };
  /* TODO: Set up verification email process
  function VerificationEmail() {
    auth.currentUser.sendEmailVerification().then(() => {
      // Email verification sent!
      console.log("Email Verification sent! Check your mail box");
      // ...
    });
  }
 */

  return (
    <div className="signup-wrapper">
      <div className="sign-up-main-text">Sign Up</div>
      <div className="sign-up-secondary-text">Is fast and easy.</div>

      <form onSubmit={handleSignUp}>
        <div className="signup-group">
          <input
            className="signup-input"
            type="text"
            name="name-input"
            required
            onChange={(e) => setName(e.target.value)}
          />
          <span className="signup-highlight"></span>
          <span className="signup-bar"></span>
          <label className="signup-label">Your first name</label>
        </div>
        
        <div className="signup-group">
          <input
            className="signup-input"
            type="text"
            name="surname-input"
            required
            onChange={(e) => setSurname(e.target.value)}
          />
          <span className="signup-highlight"></span>
          <span className="signup-bar"></span>
          <label className="signup-label">Your last name</label>
        </div>

        <div className="signup-group">
          <input
            className="signup-input"
            type="email"
            name="email-input"
          required
            onChange={(e) => setEmail(e.target.value)}
          />
          <span className="signup-highlight"></span>
          <span className="signup-bar"></span>
          <label className="signup-label">Your email</label>
        </div>

        <div className="signup-group">
          <input
            className="signup-input"
            type="password"
            name="password-input"
          required
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="signup-highlight"></span>
          <span className="signup-bar"></span>
          <label className="signup-label">Choose a password</label>
        </div>

        <div className="signup-group">
          <input
            className="signup-input"
            type="date"
            name="birthdate-input"
          required
            onChange={(e) => setBirthdate(e.target.value)}
          />
          <span className="signup-highlight"></span>
          <span className="signup-bar"></span>
          <label className="signup-label">Your date of birth</label>
        </div>

        <fieldset>
              <legend>Please indicate your sex</legend>

              <div className="option-wrapper">
                <input
                  className="option-input"
                  type="radio"
                  id="male"
                  name="male"
                  value="male"
                  checked={sex === "male"}
                  onChange={handleSexChange}
                />
                <label className="option-label" htmlFor="male">Male</label>
              </div>

              <div className="option-wrapper">
                <input
                  className="option-input"
                  type="radio"
                  id="female"
                  name="female"
                  value="female"
                  checked={sex === "female"}
                  onChange={handleSexChange}
                />
                <label className="option-label" htmlFor="female">Female</label>
              </div>
            </fieldset>        
            
        <button className="create-account-btn" type="submit">
          Create my Account
        </button>
      </form>
    </div>
  );
}

export default SignUp;
