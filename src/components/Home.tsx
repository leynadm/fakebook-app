import { useContext } from "react";
import Navbar from "./Navbar";
import HomeContent from "./HomeContent";
import { Routes, Route } from "react-router-dom";
import SearchResults from "./SearchResults";
import Profile from "./Profile";
import { PostContextProvider } from "./PostContext";
import SearchProfile from "./SearchProfile";
import "../styles/Home.css"
import { useEffect } from "react";
import { AuthContext } from "./Auth";
import Settings from "./Settings";

function Home () {
  const { currentUser } = useContext(AuthContext);

  useEffect(()=>{
    console.log('loggin in the prop passed to home:')   
    
  },[])
  return (
    <div className="home-wrapper">
      <PostContextProvider>
        <Navbar />
        <Routes>
          <Route element={<SearchProfile />} path="/results/users/:id" />
          <Route path="/" element={<HomeContent />} index />
          <Route path="results" element={<SearchResults />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </PostContextProvider>
    </div>
  );
};

export default Home;
