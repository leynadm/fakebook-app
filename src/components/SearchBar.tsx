import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import {User} from "../types/user"

function SearchBar() {
  const navigate = useNavigate();
  const [userToSearch, setUserToSearch] = useState("");
  const [usersFound, setUsersFound] = useState<User[]>([]);
  useEffect(() => {}, []);

  async function getUsers() {
    console.log("User to search is: " + userToSearch);
    const q = query(
      collection(db, "users"),
      where("fullname", "array-contains", userToSearch)
    );
    const querySnapshot = await getDocs(q);

    const userResults: User[] = [];

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const user = doc.data() as User;
      userResults.push(user);
      console.log(doc.id, " => ", doc.data());
    });

    setUsersFound(userResults);
    navigate("/home/results", { state: { userToSearch } });
  }

  return (
    
    <div className="search-bar">
      <input
        type="text"
        onChange={(e) => setUserToSearch(e.target.value)}
        placeholder="Search for a person..."
      />
      <button type="button" onClick={getUsers}>
        Submit
      </button>
    </div>
  );
}

export default SearchBar;
