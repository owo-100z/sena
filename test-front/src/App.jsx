import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./views/Home";
import Error404 from './assets/err/Error404';
import Header from "./assets/layout/Header"

export default function App() {
  return (
    <Router>
      <Header />
      <div id="loading-overlay" className="fixed bg-black/50 z-50 flex items-center justify-center inset-0 hidden">
          <span className="loading loading-spinner loading-lg text-white"></span>
      </div>
      <main className="flex p-6 justify-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Error404 />}/>
          </Routes>
      </main>
    </Router>
  );
}