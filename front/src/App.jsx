import React, { useState } from "react";
import SiegeScreen from "./views/SiegeScreen";
import { HiMenu } from "react-icons/hi";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("siege");

  return (
    <div className="min-h-screen flex flex-col">
      {/* 상단바 */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">공성전</h1>
        {/* 햄버거 버튼 오른쪽 */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          <HiMenu size={28} />
        </button>
      </nav>

      {/* 슬라이드 메뉴 (오른쪽에서 등장) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
          ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 flex flex-col space-y-4">
          <button
            className="text-gray-700 hover:text-blue-600 text-lg font-medium"
            onClick={() => {
              setCurrentScreen("siege");
              setMenuOpen(false);
            }}
          >
            공성전
          </button>
          {/* 추후 메뉴 추가 가능 */}
        </div>
      </div>

      {/* 오버레이 (투명도 낮춤, 클릭하면 닫힘) */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* 메인 화면 */}
      <main className="flex-1 p-6">
        {currentScreen === "siege" && <SiegeScreen />}
      </main>
    </div>
  );
}