import React, { useState, useEffect, useContext } from "react";
import "../styles/SearchResults.css"
import { useLocation } from "react-router";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "./Auth";

interface UserResult {
    name: string;
    surname: string;
  }

function SearchResults(){

    const location = useLocation();
    const userToSearch = location.state?.userToSearch || "";
    const [listOfUsers, setListOfUsers] = useState<UserResult[]>([])

    useEffect(()=>{
        if (userToSearch) {
            getUsers();
          }
    },[userToSearch])
    async function getUsers() {
        console.log("User to search is: " + userToSearch);
        const q = query(
          collection(db, "users"),
          where("fullname", "array-contains", userToSearch)
        );
        const querySnapshot = await getDocs(q);
    
        const userResults: UserResult[] = [];
    
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          const user = doc.data() as UserResult;
          userResults.push(user);
          console.log(doc.id, " => ", doc.data());
        });
        setListOfUsers(userResults);
      }

    return(
        <div className="search-results-wrapper">
            <div>People</div>
        {listOfUsers.map((userResult, index) => (
          <div key={index} className="search-result-group">
            <div>{userResult.name} {userResult.surname}</div><div><button>Add Friend</button></div>
          </div>
        ))}
      </div>
    )

}

export default SearchResults