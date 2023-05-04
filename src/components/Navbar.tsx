import React, { useRef, RefObject } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { auth } from "../config/firebase";
import "../styles/Navbar.css";
import SearchBar from "./SearchBar";
import FakeBookLogo from "../assets/logo-no-banner-no-background.png"
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
        <img className="top-left-logo" src={FakeBookLogo} alt="logo"/>
        <SearchBar />
        <nav ref={navRef}>
          <Link to="/home">
            <button type="button" className="nav-button">
              <span className="material-symbols-outlined nav-icon" >home</span>
            </button>
          </Link>

          <Link to="/home/profile">
            <button type="button" className="nav-button">
              <span className="material-symbols-outlined nav-icon">account_circle</span>
            </button>
          </Link>

          <Link to="/home/settings">
            <button type="button" className="nav-button">
              <span className="material-symbols-outlined nav-icon">settings</span>
            </button>
          </Link>

          <Link to="/">
            <button className="nav-button" onClick={() => auth.signOut()}>
              {" "}
              <span className="material-symbols-outlined nav-icon">logout</span>
            </button>
          </Link>
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
