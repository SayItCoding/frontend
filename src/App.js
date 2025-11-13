//import React from "react";
// App.js
import React, { useEffect, useState } from "react"; // ← useEffect 반드시 import

import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { User, Code, LogIn } from 'lucide-react';
import EntryMission from "./pages/EntryMission.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

import { initSound } from "./soundSetup";

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    /*
    <div style={{ padding: "2rem" }}>
      <h1>홈</h1>
      <Link to="/mission">EntryJS 화면으로 이동</Link>
      <br />
      <Link to="/login">로그인 화면으로 이동</Link>
    </div>
  );
  */
 <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-white font-bold text-xl hover:text-emerald-300 transition-colors">
            프롬프트 코드
          </Link>
          
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 border border-white/20"
              >
                <User size={20} />
                <span>Profile</span>
              </button>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300"
              >
                <LogIn size={20} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen px-6 pt-24">
        <div className="text-center space-y-8 max-w-4xl">
          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-500 to-cyan-600 animate-pulse">
              프롬프트 코드
            </h1>
            <p className="text-xl md:text-2xl text-emerald-300 font-light">
              자연어 코딩 교육 플랫폼
            </p>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            자유롭게 프로그램을 만들고 공부해보기
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <button 
              onClick={() => navigate('/mission')}
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2">
                <Code size={24} />
                <span>코딩 학습 시작하기</span>
              </div>
            </button>
            
            {!isLoggedIn && (
              <button 
                onClick={() => navigate('/signup')}
                className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                회원가입하기
              </button>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
            {[
              { title: '빠른 개발', desc: 'Rapid Development', icon: '⚡' },
              { title: '직관적 UI', desc: 'Intuitive Interface', icon: '🎨' },
              { title: '강력한 도구', desc: 'Powerful Tools', icon: '🚀' }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-emerald-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
      </div>
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
