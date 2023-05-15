import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/SearchBar.css";
import { User } from "../types/user";

function SearchBar() {
  const navigate = useNavigate();
  const [userToSearch, setUserToSearch] = useState("");
  const [usersFound, setUsersFound] = useState<User[]>([]);
  useEffect(() => {}, []);

  async function getUsers() {

    console.log("User to search is: " + userToSearch);

    let q;

    if (userToSearch !== "") {

      console.log('value of userToSearch:' + userToSearch)
      q = query(
        collection(db, "users"),
        where('fullname', 'array-contains', userToSearch),

      );
    } else {
      q = query(collection(db, "users"), limit(25));
    }


    const querySnapshot = await getDocs(q);
    console.log(querySnapshot)
    
    const userResults: User[] = [];

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const user = doc.data() as User;
      user.id = doc.id; // Add this line to set the 'id' property
      userResults.push(user);
    });
    
    console.log(userResults);
    setUsersFound(userResults);

    navigate("/home/results", { state: { usersFound: userResults } });
  }

  return (
    <div className="search-bar">
      <input
        className="search-bar-input"
        type="text"
        onChange={(e) => setUserToSearch(e.target.value)}
        placeholder="Search for a person..."
      />
      <button className="bar-button" type="button" onClick={getUsers}>
        <span className="material-symbols-outlined">search</span>
      </button>
    </div>
  );
}

export default SearchBar;
