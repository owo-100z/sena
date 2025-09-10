import React, { useState, useEffect } from "react";
import UsersPopup from "@/views/guild/Users_P";
import { HiPlus } from "react-icons/hi";

export default function Users() {
  const [mode, setMode] = useState("C");
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const user_popup_id = "modal-01";

  useEffect(() => {
    selectUsers();
  }, []);

  const selectUsers = async () => {
    const res = await comm.api("/guild/users");
    console.log(res);
    if (res?.status === 'success') {
      setUsers(res.data);
    }
  }

  const showPopup = (mode, user) => {
    setMode(mode);
    setUser(user || {});
    document.getElementById(user_popup_id).showModal()
  }
  return (
    <>
      <div className="flex-wrap justify-items-end text-end">
        <div className="flex items-center mb-4 gap-4">
          <p>총원: {users.length}</p>
          <button className="btn bg-base-200 border-base-300 btn-md btn-soft hover:bg-base-300 transition-all duration-200 hover:-translate-y-1"
                  onClick={() => showPopup("C")}
          >
            <HiPlus />
          </button>
        </div>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-auto border p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {users.map((v, i) => (
              <div className="tooltip" data-tip={v.remarks} key={i}>
                <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-md xl:btn-md hover:bg-base-300 transition-all duration-200 hover:-translate-y-1 w-full justify-between"
                        onClick={() => showPopup("U", {...v})}
                >
                  {v.username}
                  <div className="badge badge-sm">Lv {v.lv}</div>
                </button>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
      <UsersPopup id={user_popup_id} mode={mode} user={user} onClose={selectUsers} />
    </>
  )
}