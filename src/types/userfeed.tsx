import { Timestamp } from "firebase/firestore";

export type UserFeed = {
    id?: string |undefined;
    userID: string|undefined; 
    text: string|undefined;
    createdAt: Timestamp|Date|undefined; 
    image:string|undefined,
    name?:string|undefined
    surname?:string|undefined,
    timestamp:Timestamp|undefined
  };

