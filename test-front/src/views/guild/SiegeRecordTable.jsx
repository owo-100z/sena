import React, { useState, useEffect, useCallback } from "react";

const today = dayjs().format('YYYY-MM-DD');
const std_dt = dayjs().add(-1, 'day').format('YYYY-MM-DD');

export default function SiegeRecord() {
  const [users, setUsers] = useState([]);
  const [stdDate, setStdDate] = useState(std_dt);

  useEffect(() => {
    selectUsers();
  }, []);

  const selectUsers = async () => {
    const res = await comm.api("/guild/users");
    if (res?.status === 'success') {
      setUsers(res.data);
    }
  };

  const save = async () => {
    const saveArr = users.filter(t => !utils.isEmpty(t.score));

    if (saveArr.length === 0) {
      alert('점수를 입력해주세요');
      return;
    }

    let success = [];
    let fail = [];

    for (const param of saveArr) {
      const req = {
        userId: param.id,
        stdDate: stdDate.replace(/[^0-9]/g, ''),
        score: param.score,
        remarks: param.remarks2,
      }

      comm.log(req);

      const res = await comm.api('/guild/siege', { method: 'POST', body: req });

      if (res.status === 'success') {
        success.push(res);
      } else {
        fail.push(res);
        break;
      }
    }

    if (fail.length > 0) {
      alert('오류가 발생했습니다.');
      comm.log(fail);
    } else {
      alert('저장되었습니다.');
    }

    selectUsers();
  }

  return (
    <div className="flex-wrap justify-items-end text-end">
        <input type="date" className="input" value={stdDate} onChange={(e) => setStdDate(e.target.value)} />
      <button className="btn ml-1" onClick={selectUsers}>초기화</button>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs sm:w-sm md:w-md lg:w-xl xl:w-3xl border p-4 mt-3">
        {users && users.map((v, i) => (
            <div key={i} className="bg-base-200 w-full grid grid-cols-1 md:grid-cols-3 gap-1">
                <span className="input w-full text-left">{v.username}</span>
                <label className="floating-label">
                    <span>점수</span>
                    <input type="text" placeholder="점수" className="input w-full" value={v.score || ''} onChange={(e) => setUsers(prev => prev.map((item, idx) =>
                                                                                                                            idx === i ? { ...item, score: e.target.value.replace(/[^0-9]/g, '') } : item
                                                                                                                            ))} />
                </label>
                <label className="floating-label">
                    <span>비고</span>
                    <input type="text" placeholder="비고" className="input w-full" value={v.remarks2 || ''} onChange={(e) => setUsers(prev => prev.map((item, idx) =>
                                                                                                                            idx === i ? { ...item, remarks2: e.target.value.replace(/[^0-9]/g, '') } : item
                                                                                                                            ))} />
                </label>
            </div>
        ))}
        <button className="btn" onClick={save}>저장</button>
      </fieldset>
    </div>
  )
}