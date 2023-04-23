import Navbar from "./Navbar";
import HomeContent from "./HomeContent";
import { Routes, Route } from "react-router-dom";
import SearchResults from "./SearchResults";
import Profile from "./Profile";
const Home = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeContent />} index/>
        <Route path="results" element={<SearchResults />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default Home;
