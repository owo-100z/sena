import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";

export default function UsersPopup({ id, mode, user, onClose }) {
  const [edtUser, setUser] = useState({});
  useEffect(() => {
    setUser({...user});
  }, [user])

  const save = async () => {
    if (utils.isEmpty(edtUser.username)) {
        alert('이름을 입력하세요');
        return;
    }

    const res = await comm.api('/guild/users', { method: 'POST', body: edtUser });

    if (res.status === 'success') {
      document.getElementById(`${id}-close`).click();
      if (onClose) onClose();
    } else {
      alert(`오류가 발생했습니다. ${res.message}`);
    }
  }

  const del = async () => {
    if (!confirm('삭제하시겠습니까??')) return;

    const res = await comm.api(`/guild/users/${user.id}`, { method: 'DELETE' });

    if (res.status === 'success') {
      document.getElementById(`${id}-close`).click();
      if (onClose) onClose();
    } else {
      alert(`오류가 발생했습니다. ${res.message}`);
    }
  }

  return (
    <Modal
      id={id}
      title={mode === "C" ? '등록' : "수정"}
      body={
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 mt-4 gap-4">
          <label className="floating-label">
            <span>유저명</span>
            <input type="text" placeholder="유저명" className="input w-full" value={edtUser?.username || ''} readOnly={user?.username} onChange={(e) => {setUser({...edtUser, username: e.target.value})}} />
          </label>
          <label className="floating-label">
            <span>레벨</span>
            <input type="number" placeholder="숫자만 입력" className="input w-full" value={edtUser?.lv || ''} onChange={(e) => {setUser({...edtUser, lv: e.target.value})}}/>
          </label>
          <label className="floating-label">
            <span>비고</span>
            <input type="text" placeholder="비고 입력" className="input w-full" value={edtUser?.remarks || ''} onChange={(e) => {setUser({...edtUser, remarks: e.target.value})}}/>
          </label>
        </fieldset>
      }
      actions={
        <>
          {mode === 'U' && (
            <button className="btn btn-secondary" onClick={del}>삭제</button>
          )}
          <button className="btn" onClick={save}>저장</button>
        </>
      }
    />
  )
}