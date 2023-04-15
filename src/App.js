import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import { AuthProvider } from "./components/Auth";
import SignUp from "./components/SignUp";
import Feed from "./components/Feed";
import HomeRoute from "./components/HomeRoute";
import LoginRoute from "./components/LoginRoute";
function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route element={<HomeRoute />}>
              <Route element={<Home />} path="/home" />
            </Route>

            <Route element={<LoginRoute />}>
              <Route element={<Login />} path="/" />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
