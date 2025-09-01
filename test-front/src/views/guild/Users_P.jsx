import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";

export default function UsersPopup({ id, mode, user }) {
  return (
    <Modal
      id={id}
      title={mode === "C" ? '등록' : "수정"}
      body={
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 mt-4 gap-4">
          <label className="floating-label">
            <span>유저명</span>
            <input type="text" placeholder="유저명" className="input w-full" defaultValue={user?.username || ''} readOnly={user?.username} />
          </label>
          <label className="floating-label">
            <span>레벨</span>
            <input type="number" placeholder="숫자만 입력" className="input w-full" defaultValue={user?.level || ''} />
          </label>
          <label className="floating-label">
            <span>비고</span>
            <input type="text" placeholder="비고 입력" className="input w-full" defaultValue={user?.remarks || ''} />
          </label>
          <button className="btn join-item w-full">저장</button>
        </fieldset>
      }
    />
  )
}