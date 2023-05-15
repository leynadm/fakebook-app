import React, { useEffect, useState, useContext, ChangeEvent } from "react";
import "../styles/Settings.css";
import { AuthContext } from "./Auth";

import { arrayUnion, doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";

import { db } from "../config/firebase";
import { User } from "../types/user";

function Settings() {
  const { currentUser } = useContext(AuthContext);
  const [queriedUser, setQueriedUser] = useState<User | undefined>();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [sex, setSex] = useState("");
  const [bio, setBio] = useState("");
  const [fieldToUpdate, setFieldToUpdate] = useState("");

  useEffect(() => {
    getUserData();
  }, []);

  /* 
  fullname: arrayUnion(name, surname, name + " " + surname),
  */
  async function getUserData() {
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data() as User;
      setQueriedUser(userData);
      console.log(userData);
      setName(userData.name);
      setSurname(userData.surname);
      setSex(userData.sex);
      if (userData.bio) {
        setBio(userData.bio);
      }
      const userDate = convertTimestamp(userData.birthdate);

      setBirthdate(userDate);
    }
  }

  function convertTimestamp(timestampValueToPass: any) {
    let date = timestampValueToPass.toDate();
    const isoString = date.toISOString();
    const dateString = isoString.slice(0, 10);
    return dateString;
  }

  async function updateUserData(field: string, value: any) {
    const docRef = doc(db, "users", currentUser.uid);
    let newValue = value;

    if (field === "birthdate") {
      newValue = Timestamp.fromDate(new Date(birthdate));
    } else if(field ==="name"){
      updateDoc(docRef, { 'fullname': arrayUnion(newValue,surname,newValue + " " + surname),
    });
    } else if(field === "surname"){
      updateDoc(docRef, { 'fullname': arrayUnion(name,newValue,name + " " + newValue),
    });
    }

    await updateDoc(docRef, { [field]: newValue });
    alert("Field updated succesfully!")
  }

  function handleSubmit(e: any, field: string) {
    e.preventDefault();
    let value = e.target.form[field + "-input"].value;

    updateUserData(field, value);
  }

  const handleSexChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSex(e.target.value);
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-title">Update your profile here</div>

      <form>
        <div className="field-to-update">
          <div className="edit-group">
            <input
              className="edit-input"
              type="text"
              name="name-input"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <span className="edit-highlight"></span>
            <span className="edit-bar"></span>
            <label className="edit-label">Your first name</label>
          </div>

          <div className="edit-update-btn-wrapper">
            <button
              onClick={(e) => handleSubmit(e, "name")}
              className="edit-update-btn"
            >
              Update
            </button>
          </div>
        </div>

        <div className="field-to-update">
          <div className="edit-group">
            <input
              className="edit-input"
              type="text"
              name="surname-input"
              required
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
            <span className="edit-highlight"></span>
            <span className="edit-bar"></span>
            <label className="edit-label">Your last name</label>
          </div>

          <div className="edit-update-btn-wrapper">
            <button
              className="edit-update-btn"
              onClick={(e) => handleSubmit(e, "surname")}
            >
              Update
            </button>
          </div>
        </div>

        <div className="field-to-update">
          <div className="edit-group">
            <input
              className="birthdate-input"
              type="date"
              name="birthdate-input"
              required
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
            <span className="edit-highlight"></span>
            <span className="edit-bar"></span>
            {birthdate === "" ? (
              <label className="edit-label">Your date of birth</label>
            ) : null}
          </div>

          <div className="edit-update-btn-wrapper">
            <button
              onClick={(e) => handleSubmit(e, "birthdate")}
              className="edit-update-btn"
            >
              Update
            </button>
          </div>
        </div>

        <div className="field-to-update">
          <div className="edit-group">
            <textarea
              className="bio-input"
              name="bio-input"
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <span className="edit-highlight"></span>
            <span className="edit-bar"></span>

            {bio === "" ? (
              <label className="edit-label">Your profile description</label>
            ) : null}
          </div>

          <div className="edit-update-btn-wrapper">
            <button
              onClick={(e) => handleSubmit(e, "bio")}
              className="edit-update-btn"
            >
              Update
            </button>
          </div>
        </div>

        <div className="field-to-update">
          <fieldset className="settings-fieldset">
            <legend className="settings-fieldset-legend">
              Please indicate your sex
            </legend>

            <div className="settings-fieldset-option-wrapper">
              <input
                className="settings-fieldset-option-input"
                type="radio"
                id="male"
                name="sex-input"
                value="male"
                checked={sex === "male"}
                onChange={handleSexChange}
              />
              <label className="settings-fieldset-option-label" htmlFor="male">
                Male
              </label>
            </div>

            <div className="settings-fieldset-option-wrapper">
              <input
                className="settings-fieldset-option-input"
                type="radio"
                id="female"
                name="sex-input"
                value="female"
                checked={sex === "female"}
                onChange={handleSexChange}
              />
              <label
                className="settings-fieldset-option-label"
                htmlFor="female"
              >
                Female
              </label>
            </div>
          </fieldset>
          <div className="edit-update-btn-wrapper">
            <button
              onClick={(e) => handleSubmit(e, "sex")}
              className="edit-update-btn"
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Settings;
