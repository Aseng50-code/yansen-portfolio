import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import CVBuilder from "./components/CVBuilder";
import Templates from "./components/Templates";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import Login from "./components/Login";
import Payment from "./components/Payment";
import JobBoardWithSocial from "./components/JobBoardWithSocial";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/builder" element={<CVBuilder />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/jobs" element={<JobBoardWithSocial />} />
          <Route path="/login" element={<Login />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;