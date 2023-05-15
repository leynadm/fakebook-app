import React, {useState, useEffect} from "react";
import "..//styles/ShowFollowers.css";
import { useLocation } from "react-router";
import "../styles/ShowFollowers.css"
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
  orderBy,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { Link } from "react-router-dom";
interface UserData {
  id: string;
  [key: string]: any;  // Add this if there are other properties in the user data object.
}

function ShowFollowers() {

  const location = useLocation();
  const userIndividualFollowers = location.state.userIndividualFollowers
  const [userIndividualFollowersData, setUserIndividualFollowersData] = useState<UserData[]>([]);

  useEffect(()=>{

    fetchUserIndividualFollowersData()

  },[])

 
  async function getUserDocumentById(documentId:any) {

    const documentRef = doc(db,"users", documentId) // Replace with your collection name

    const snapshot = await getDoc(documentRef)

    console.log('inside get document')
    if (snapshot.exists()) {
      
      const documentData = snapshot.data();
      return { ...documentData, id: snapshot.id };
    }
    return null;
  }

  async function fetchUserIndividualFollowersData() {
    const tempData: UserData[] = [];
    for (const docId of userIndividualFollowers) {
      const documentData = await getUserDocumentById(docId);
        console.log('inside fetch')
      if (documentData) {
        tempData.push(documentData)
        console.log(documentData)
      }
    }
    setUserIndividualFollowersData(tempData); // Set the state after collecting all the data
    console.log(tempData)
  }


  return (
    <div className="show-followers-wrapper">
            <div className="search-results-title">
        These people want are following you...
        <span className="material-symbols-outlined">favorite</span>
      </div>
      {userIndividualFollowersData.map((user:UserData,index:number)=>(
        

<div key={index} className="search-result-group">
          <div className="user-result-profile-image-wrapper">
            <img
              className="user-result-profile-image"
              src={user.profileImage}
              alt="user"
            />
          </div>
          <div className="search-result-user">
            <Link
              to={`/home/results/users/${user.id}`}
              className="search-result-user-link"
            >
              {user.name && user.surname
                ? user.name + " " + user.surname
                : user.fullname}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}


export default ShowFollowers;
