import React, { useState, useEffect } from "react";
import UsersPopup from "@/views/guild/Users_P";
import { HiPlus } from "react-icons/hi";

export default function Users() {
  const [mode, setMode] = useState("C");
  const [user, setUser] = useState({});
  const user_popup_id = "modal-01";

  useEffect(() => {
    selectUsers();
  }, []);

  const selectUsers = async () => {
    const res = await comm.api("/guild/users");
    console.log(res);
  }

  const showPopup = (mode, user) => {
    setMode(mode);
    setUser(user || {});
    document.getElementById(user_popup_id).showModal()
  }
  return (
    <>
      <div className="flex-wrap justify-items-end text-end">
        <button className="btn bg-base-200 border-base-300 btn-md btn-soft mb-4 hover:bg-base-300 transition-all duration-200 hover:-translate-y-1"
                onClick={() => showPopup("C")}
        >
          <HiPlus />
        </button>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-auto border p-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl hover:bg-base-300 transition-all duration-200 hover:-translate-y-1"
                    onClick={() => showPopup("U", {username: 'test', level: '3', remarks: ''})}
            >
              Responsive
            </button>
            <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl hover:bg-base-300 transition-all duration-200 hover:-translate-y-1"
                    onClick={() => showPopup("U", {username: 'test22', level: '99', remarks: ''})}
            >
              Responsive
            </button>
            <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl hover:bg-base-300 transition-all duration-200 hover:-translate-y-1">Responsive</button>
            <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl hover:bg-base-300 transition-all duration-200 hover:-translate-y-1">Responsive</button>
            <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl hover:bg-base-300 transition-all duration-200 hover:-translate-y-1">Responsive</button>
            <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl hover:bg-base-300 transition-all duration-200 hover:-translate-y-1">Responsive</button>
            <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl hover:bg-base-300 transition-all duration-200 hover:-translate-y-1">Responsive</button>
          </div>
        </fieldset>
      </div>
      <UsersPopup id={user_popup_id} mode={mode} user={user} />
    </>
  )
}