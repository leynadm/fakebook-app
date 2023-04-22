import React, { useRef,RefObject } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { auth } from "../config/firebase";
import "../styles/Navbar.css";
import { AuthContext } from "./Auth";

function Navbar() {
  const navRef: RefObject<HTMLHeadElement> = useRef<HTMLHeadElement>(null);

  const showNavbar = () => {
    if (navRef.current !== null) {
      navRef.current.classList.toggle("responsive_nav");
    }
  };

  return (
    <div>
      <header>
        <div>Logo</div>
        <div className="search-bar">
          <input type="text" placeholder="Search for a person..." />
          <button type="button">Submit</button>
        </div>
        <nav ref={navRef}>
          <Link to="/home">Home</Link>

          <Link to="/profile">Profile</Link>

          <div>
            <button onClick={() => auth.signOut()}>Sign Out</button>
          </div>
          <button className="nav-btn nav-close-btn" onClick={showNavbar}>
            <FaTimes />
          </button>
        </nav>
        <button className="nav-btn" onClick={showNavbar}>
          <FaBars />
        </button>
      </header>
    </div>
  );
}

export default Navbar;
