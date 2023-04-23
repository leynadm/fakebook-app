import React, { useState, useEffect, useContext,ChangeEvent } from "react";
import { AuthContext } from "./Auth";
import "../styles/SignUp.css";
import { auth, db } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

function SignUp() {
  const { currentUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [sex, setSex] = useState("");

  const handleSexChange = (e:ChangeEvent<HTMLInputElement>) => {
    setSex(e.target.value);
  };

  async function addMyDocument() {
    await setDoc(doc(db, "users", "Me"), {
      name: "Me",
    });
  }

  function isFirebaseError(error: unknown): error is { code: string; message: string } {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      "message" in error &&
      typeof (error as any).code === "string" &&
      typeof (error as any).message === "string"
    );
  }
  

  const handleSignUp = async (e:ChangeEvent<HTMLFormElement>) => {
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
        fullname: name + " " + surname
      });
    } catch (error) {
      if (isFirebaseError(error)) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(email, password);
      } else {
        console.log("An unknown error occurred:", error);
      }
  };
  }
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
      <div>Sign Up</div>
      <div>Is fast and easy.</div>
      <form onSubmit={handleSignUp}>
        <div className="name-details">
          <input
            type="text"
            name="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Add your first name here"
          />
          <input
            type="text"
            name="surname"
            onChange={(e) => setSurname(e.target.value)}
            placeholder="Add your last name here"
          />
        </div>
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
        <div className="other-details">
          <label>
            When are you born?
            <input
              type="date"
              name="birthdate"
              onChange={(e) => setBirthdate(e.target.value)}
              placeholder="Add your email address here"
            />
          </label>
          <fieldset>
            <legend>Select your sex</legend>

            <div>
              <input
                type="radio"
                id="male"
                name="male"
                value="male"
                checked={sex === "male"}
                onChange={handleSexChange}
              />
              <label htmlFor="male">Male</label>
            </div>

            <div>
              <input
                type="radio"
                id="female"
                name="female"
                value="female"
                checked={sex === "female"}
                onChange={handleSexChange}
              />
              <label htmlFor="female">Female</label>
            </div>
          </fieldset>
        </div>
        <button type="submit">Create my Account</button>
        <button onClick={addMyDocument}>Register my data!</button>
      </form>
    </div>
  );
}

export default SignUp;
