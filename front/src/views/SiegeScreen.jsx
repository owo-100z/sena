import React, { useState, useEffect } from "react";
import { utils } from "../assets/common/common";

const today = utils.getToday();

export default function SiegeScreen() {
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [searchOptions, setSearchOptions] = useState(false);
  const [username, setUsername] = useState("");
  const [stdDate, setStdDate] = useState(today);
  const [score, setScore] = useState(null);
  const [customScore, setCustomScore] = useState("");
  const [remarks, setRemarks] = useState("");
  const [userList, setUserList] = useState([]);

  const [searchOptionsValues, setSearchOptionsValues] = useState({
    username: "",
    fr_dt: utils.getDateDaysAgo(7),
    to_dt: today,
  });

  const options = [100000, 200000, 300000, "custom"];

  // 초기 데이터 fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { username, fr_dt, to_dt } = searchOptionsValues;
      const params = {};
      if (username) params.username = username;
      if (fr_dt) params.fr_dt = fr_dt;
      if (to_dt) params.to_dt = to_dt;

      const res = await comm.api("/users", { method: 'GET', params });

      if (res.status === "success") {
        setUserList(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (value) => {
    if (value === "custom") {
      setScore("custom");
    } else {
      setScore(value);
      setCustomScore("");
    }
  };

  const handleSave = async () => {
    try {
      const body = {
        username,
        std_date: stdDate,
        score: score === "custom" ? Number(customScore) : score,
        remarks,
      };
      const res = await comm.api("/users/siege", { method: "POST", body });
      if (res.status === "success") {
        alert("저장되었습니다.");
        fetchUsers(); // 저장 후 목록 갱신
        setUsername("");
        setStdDate(today);
        setScore(null);
        setCustomScore("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (username, std_date, id) => {
    if (!window.confirm(`정말로 ${username}님의 ${std_date} 점수를 삭제하시겠습니까?`)) {
      return;
    }
    try {
      const res = await comm.api("/users/siege/" + id, { method: "DELETE" });
      if (res.status === "success") {
        alert("삭제되었습니다.");
        fetchUsers(); // 삭제 후 목록 갱신
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* 아코디언 */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-6">
        <button
          onClick={() => setAccordionOpen(!accordionOpen)}
          className="w-full text-left px-6 py-4 flex justify-between items-center font-bold text-gray-800 hover:bg-gray-100 transition"
        >
          <span>점수 입력</span>
          <span className={`transform transition-transform ${accordionOpen ? "rotate-180" : "rotate-0"}`}>
            ▼
          </span>
        </button>

        {accordionOpen && (
          <div className="p-6 space-y-4">
            <input
              type="text"
              placeholder="유저명"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={stdDate}
              onChange={(e) => setStdDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* 점수 버튼 한 줄 */}
            <div className="flex justify-between mb-2">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`flex-1 mx-1 px-2 py-1 text-sm rounded-full border transition-all duration-200
                    ${score === option
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
                >
                  {option === "custom" ? "직접입력" : `${option.toLocaleString()}점`}
                </button>
              ))}
            </div>

            {score === "custom" && (
              <input
                type="number"
                placeholder="점수를 입력하세요"
                value={customScore}
                onChange={(e) => setCustomScore(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}

            <input
              type="text"
              placeholder="비고"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleSave}
              className="w-full mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              저장
            </button>
          </div>
        )}
      </div>

      {/* 검색조건 */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-6">
        <button
          onClick={() => setSearchOptions(!searchOptions)}
          className="w-full text-left px-6 py-4 flex justify-between items-center font-bold text-gray-800 hover:bg-gray-100 transition"
        >
          <span>검색 조건</span>
          <span
            className={`transform transition-transform ${
              searchOptions ? "rotate-180" : "rotate-0"
            }`}
          >
            ▼
          </span>
        </button>

        {searchOptions && (
          <div className="p-6 space-y-4">
            {/* 유저명 */}
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium w-20">유저명</label>
              <input
                type="text"
                placeholder="유저명"
                value={searchOptionsValues.username}
                onChange={(e) =>
                  setSearchOptionsValues({
                    ...searchOptionsValues,
                    username: e.target.value,
                  })
                }
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 조회일자 */}
            <div className="flex items-center space-x-2">
              <label className="text-gray-700 font-medium w-20">조회 일자</label>
              <input
                type="date"
                value={searchOptionsValues.fr_dt}
                onChange={(e) =>
                  setSearchOptionsValues({
                    ...searchOptionsValues,
                    fr_dt: e.target.value,
                  })
                }
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="mx-2">~</span>
              <input
                type="date"
                value={searchOptionsValues.to_dt}
                onChange={(e) =>
                  setSearchOptionsValues({
                    ...searchOptionsValues,
                    to_dt: e.target.value,
                  })
                }
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 조회 버튼 */}
            <button
              onClick={fetchUsers}
              className="w-full mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              조회
            </button>
          </div>
        )}
      </div>

      {/* 유저 목록 */}
      <div className="space-y-4">
        {userList.map((user, idx) => (
          <div
            key={idx}
            className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-800">{user.username}</p>
              <p className="text-gray-500 text-sm">
                {user.std_date} ( {user.day_of_the_week} )
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-600">
                {user.score.toLocaleString()}점
              </p>
              <p className="text-gray-500 text-sm">{user.remarks || "-"}</p>

              {/* 삭제 버튼 */}
              <button
                onClick={() => handleDelete(user.username, user.std_date, user.id)}
                className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}