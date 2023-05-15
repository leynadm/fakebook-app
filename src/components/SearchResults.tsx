import React, { useState, useEffect, useContext } from "react";
import "../styles/SearchResults.css";
import { useLocation } from "react-router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { Link } from "react-router-dom";

interface UserResult {
  name: string;
  surname: string;
  id?: string;
  profileImage: string;
  fullname: [];
}

function SearchResults() {
  const location = useLocation();
  const usersFound = location.state?.usersFound || [];

  useEffect(() => {
    if (usersFound) {
      getUsers();
    }
  }, []);

  async function getUsers() {
    let q = query(collection(db, "users"));
    console.log(q);
    if (usersFound !== "") {
      q = query(
        collection(db, "users"),
        where("fullname", "array-contains", usersFound)
      );
    }

    const querySnapshot = await getDocs(q);

    const userResults: UserResult[] = [];

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const user = doc.data() as UserResult;
      user.id = doc.id;
      userResults.push(user);
      console.log(doc.id, " => ", doc.data());
    });

    console.log("logging in user results");
    console.log(userResults);
  }

  return (
    <div className="search-results-wrapper">
      <div className="search-results-title">
        We found these people for you...
        <span className="material-symbols-outlined">person_search</span>
      </div>
      {usersFound.map((userResult: UserResult, index: number) => (
        <div key={index} className="search-result-group">
          <div className="user-result-profile-image-wrapper">
            <img
              className="user-result-profile-image"
              src={userResult.profileImage}
              alt="user"
            />
          </div>
          <div className="search-result-user">
            <Link
              to={`users/${userResult.id}`}
              className="search-result-user-link"
            >
              {userResult.name && userResult.surname
                ? userResult.name + " " + userResult.surname
                : userResult.fullname}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
