//import React from "react";
// App.js
import React, { useEffect } from "react"; // ← useEffect 반드시 import

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EntryMission from "./pages/EntryMission.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

import { initSound } from "./soundSetup";

function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>홈</h1>
      <Link to="/mission">EntryJS 화면으로 이동</Link>
      <br />
      <Link to="/login">로그인 화면으로 이동</Link>
    </div>
  );
}

export default function App() {

  //여기서 soundSetup사용하는데 필요 없으면 지워도 됨
  useEffect(() => {
    initSound(); // 앱 로드 시 SoundJS 초기화
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mission" element={<EntryMission />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}
