import React, { useState, useEffect, useContext } from "react";
import "../styles/SearchResults.css";
import { useLocation } from "react-router";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Link } from "react-router-dom";

interface UserResult {
  name: string;
  surname: string;
  id?: string;
  profileImage:string
}

function SearchResults() {
  const location = useLocation();
  const userToSearch = location.state?.userToSearch || "";
  const [listOfUsers, setListOfUsers] = useState<UserResult[]>([]);

  useEffect(() => {
    if (userToSearch) {
      getUsers();
    }
  }, [userToSearch]);

  async function getUsers() {
    console.log("User to search is: " + userToSearch);
    
    let q = query(collection(db, "users"));
    console.log(q)
    if (userToSearch!=="") {
      q = query(collection(db, "users"), where("fullname", "array-contains", userToSearch));
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
    console.log('logging in user results')
    console.log(userResults)
    setListOfUsers(userResults);
    console.log(userResults);
  }
  

  return (
    <div className="search-results-wrapper">

      {listOfUsers.map((userResult, index) => (
        <div key={index} className="search-result-group">
          
          <div className="user-result-profile-image-wrapper">
          <img className="user-result-profile-image" src={userResult.profileImage} alt="user"/>
          </div>
          <div className="search-result-user">
            <Link to={`users/${userResult.id}`} className="search-result-user-link">
              {userResult.name} {userResult.surname}
            </Link>
          </div>

          <div>
            <button type="button" className="search-result-follow-btn">Follow</button>
            
          </div>
          <div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
