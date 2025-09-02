import React, { useState, useEffect, useCallback } from "react";

const today = dayjs().format('YYYY-MM-DD');

export default function SiegeRecord() {
  const [users, setUsers] = useState([]);
  const [stdDate, setStdDate] = useState(today)
  const [edtUser, setUser] = useState({stdDate: stdDate.replace(/[^0-9]/g, '')});

  
  const selectUsers = useCallback(async () => {
    const res = await comm.api("/guild/users", { method: 'GET', params: { isSiege: true, stdDate: edtUser.stdDate } });
    if (res?.status === 'success') {
      setUsers(res.data);
    }
  }, [edtUser.stdDate]);

  useEffect(() => {
    setUser({stdDate: stdDate.replace(/[^0-9]/g, '')});
    selectUsers();
  }, [stdDate, selectUsers]);
    
  const setDateTime = (date) => {
    setStdDate(date);
    comm.log(date);
  }

  const save = async () => {
    if (utils.isEmpty(edtUser.userId)) {
        alert('유저를 선택해주세요');
        return;
    }

    if (utils.isEmpty(edtUser.score)) {
        alert('점수를 입력해주세요');
        return;
    }

    const res = await comm.api('/guild/siege', { method: 'POST', body: edtUser });

    if (res.status === 'success') {
      alert('저장되었습니다.');
      document.getElementById('filter_check').click();
      selectUsers();
    } else {
      alert(`오류가 발생했습니다. ${res.message}`);
    }
  }

  return (
    <>
      <div className="flex-wrap justify-items-end text-end">
        <label className="input">
          <span className="label">기준일자</span>
          <input type="date" value={stdDate} onChange={(e) => setDateTime(e.target.value)} />
        </label>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs sm:w-sm md:w-md lg:w-xl xl:w-3xl border p-4 mt-3">
          <div className="filter flex justify-start">
            <input id="filter_check" className="btn filter-reset" type="radio" name="metaframeworks" aria-label="All" onClick={() => {setUser({...edtUser, userId: '', score: ''})}}/>
            {users.map((v, i) => (
              <input key={i} className="btn" type="radio" name="metaframeworks" aria-label={v.username} onClick={() => {setUser({...edtUser, userId: v.id, pre_score: v.score})}}/>
            ))}
          </div>
        </fieldset>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs sm:w-sm md:w-md lg:w-xl xl:w-3xl border p-4 mt-3 grid-cols-1 md:grid-cols-2 text-start">
          <div className="md:col-span-2">
            <p>지난주 기록: {edtUser.userId ? (edtUser.pre_score || '기록이 존재하지 않아요').toLocaleString() : ''} {edtUser.remarks ? ` / ${edtUser.remarks}` : ''}</p>
          </div>
          <label className="floating-label">
            <span>점수</span>
            <input type="text" placeholder="점수" className="input w-full" value={edtUser?.score || ''} onChange={(e) => {setUser({...edtUser, score: e.target.value})}} />
          </label>
          <label className="floating-label">
            <span>비고</span>
            <input type="text" placeholder="비고 입력" className="input w-full" value={edtUser?.remarks || ''} onChange={(e) => {setUser({...edtUser, remarks: e.target.value})}} />
          </label>
          <button className="btn md:col-span-2" onClick={save}>저장</button>
        </fieldset>
      </div>
    </>
  )
}