import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import { AuthProvider } from "./components/Auth";
import SignUp from "./components/SignUp";
import AuthRoute from "./components/AuthRoute";

function App() {
  
  return (
    <div className="App">
      <AuthProvider>
        <Router basename="/fakebook-app">
          <Routes>
            {/* If the user is signed in and tries to access login, reroute him to home */}
            <Route element={<AuthRoute type="home" />}>
              <Route element={<Home />} path="/home/*" />
            </Route>

            {/* If the user is signed in and tries to access signup, reroute him to home */}
            <Route element={<AuthRoute type="signup" />}>
              <Route element={<SignUp />} path="/signup" />
            </Route>

            {/* If the user isn't signed him, reroute him to login */}
            <Route element={<AuthRoute type="login" />}>
              <Route element={<Login />} path="/" />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
