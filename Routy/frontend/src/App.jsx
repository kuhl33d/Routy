import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Parent from "./pages/Parent/Parent";
// import School from "./pages/School/School";
import { Schools } from './pages/Schools';
import Admin from "./pages/Admin/Admin";
import "bootstrap/dist/css/bootstrap.min.css";
import { Overview } from './pages/Overview';
import { Routes as RoutesPage } from './pages/Routes';
import { Users } from './pages/Users';
import { Settings } from './pages/Settings';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/parent" element={<Parent />} />
        {/* <Route path="/school" element={<School />} /> */}
        <Route path="/schools" element={<Schools />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}

export default App;
