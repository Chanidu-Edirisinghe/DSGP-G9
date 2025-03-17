import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar/navbar";
import Classification from "./pages/Classification/Classification";
import Readmission from "./pages/Readmission/Readmission";
import Mortality from "./pages/Mortality/Mortality";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  // Track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <Routes>
        <Route path="/" element={<Classification />} />
        <Route path="/classification" element={<Classification />} />
        <Route
          path="/Login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/Signup"
          element={<Signup setIsAuthenticated={setIsAuthenticated} />}
        />
        {/* Protected Routes */}
        {isAuthenticated && (
          <>
            <Route path="/readmission" element={<Readmission />} />
            <Route path="/mortality" element={<Mortality />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
