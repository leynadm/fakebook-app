import { Timestamp } from "firebase/firestore";

export type PostData = {
    userID: string; 
    text: string;
    createdAt?: Date; 
    image:string,
    name?:string
    surname?:string,
    timestamp?:any
    profileImage:string
  };