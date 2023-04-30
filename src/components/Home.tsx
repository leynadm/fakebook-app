import Navbar from "./Navbar";
import HomeContent from "./HomeContent";
import { Routes, Route } from "react-router-dom";
import SearchResults from "./SearchResults";
import Profile from "./Profile";
import { PostContextProvider } from "./PostContext";
import SearchProfile from "./SearchProfile";
import "../styles/Home.css"

const Home = () => {
  return (
    <div className="home-wrapper">
      <PostContextProvider>
        <Navbar />
        <Routes>
          <Route element={<SearchProfile />} path="/results/users/:id" />
          <Route path="/" element={<HomeContent />} index />
          <Route path="results" element={<SearchResults />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </PostContextProvider>
    </div>
  );
};

export default Home;
