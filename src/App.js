import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import { AuthProvider } from "./components/Auth";
import SignUp from "./components/SignUp";
import Feed from "./components/Feed";
import PrivateRoute from "./components/PrivateRoute";
import LoginRoute from "./components/LoginRoute";
function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            
            <Route path="/" element={<Home />} />

            <Route element={<PrivateRoute />}>
              <Route element={<Feed />} path="/feed" />
            </Route>
            
            <Route element={<LoginRoute />}>
              <Route element={<Login />} path="/login" />
            </Route>
            
            {/* 
            <Route path="/login" element={<Login />} />
            */}      
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
