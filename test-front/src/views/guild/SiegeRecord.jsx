import React, { useState, useEffect, useCallback } from "react";

const today = dayjs().format('YYYY-MM-DD');
const std_dt = dayjs().add(-1, 'day').format('YYYY-MM-DD');

export default function SiegeRecord() {
  const [users, setUsers] = useState([]);
  const [edtUser, setUser] = useState('');

  const [inpScore, setInpScore] = useState([]);

  const initInputField = useCallback((init = 1) => {
    setInpScore([]);
    for (let i=0; i<init; i++) {
      addInputField();
    }
  }, []);

  useEffect(() => {
    setUser('');
    selectUsers();
    initInputField();
  }, [initInputField]);

  const selectUsers = async () => {
    const res = await comm.api("/guild/users");
    if (res?.status === 'success') {
      setUsers(res.data);
    }
  };

  const stdInitInput = () => {
    const std = inpScore.length > 0 ? inpScore[0].stdDate : std_dt;
    setInpScore(prev => prev.map((item, idx) => { return { ...item, stdDate: dayjs(std).add(idx, 'day').format('YYYY-MM-DD') } }));
  }

  const addInputField = () => {
    setInpScore(prev => [
      ...prev,
      { stdDate: std_dt }
    ]);
  }

  const save = async () => {
    const saveArr = inpScore.filter(t => !utils.isEmpty(t.stdDate) && !utils.isEmpty(t.score));

    comm.log(edtUser);

    if (utils.isEmpty(edtUser)) {
      alert('유저를 선택해주세요');
      return;
    }

    if (saveArr.length === 0) {
      alert('점수를 입력해주세요');
      return;
    }

    let success = [];
    let fail = [];

    for (const param of saveArr) {
      param.userId = edtUser;
      param.stdDate = param.stdDate.replace(/[^0-9]/g, '');

      comm.log(param);
      const res = await comm.api('/guild/siege', { method: 'POST', body: param });

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

    document.getElementById('filter_check').click();
    initInputField();
  }

  return (
    <div className="flex-wrap justify-items-end text-end">
      <button className="btn" onClick={() => {stdInitInput()}}>기준일세팅</button>
      <button className="btn ml-1" onClick={addInputField}>추가</button>
      <button className="btn ml-1" onClick={() => {initInputField(1)}}>초기화</button>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs sm:w-sm md:w-md lg:w-xl xl:w-3xl border p-4 mt-3 max-h-40 overflow-y-auto">
        <div className="filter flex justify-start">
          <input id="filter_check" className="btn filter-reset" type="radio" name="metaframeworks" aria-label="All" onClick={() => {setUser('')}}/>
          {users.map((v, i) => (
            <input key={i} className="btn" type="radio" name="metaframeworks" aria-label={v.username} onClick={() => {setUser(v.id)}}/>
          ))}
        </div>
      </fieldset>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs sm:w-sm md:w-md lg:w-xl xl:w-3xl border p-4 mt-3">
        {inpScore && inpScore.map((v, i) => (
          <div key={i} className="bg-base-200 w-full grid grid-cols-1 md:grid-cols-3 gap-1">
            <input type="date" className="input w-full" value={v.stdDate} onChange={(e) => setInpScore(prev => prev.map((item, idx) =>
                                                                                                      idx === i ? { ...item, stdDate: e.target.value } : item
                                                                                                    ))} />
            <label className="floating-label">
              <span>점수</span>
              <input type="text" placeholder="점수" className="input w-full" value={v.score || ''} onChange={(e) => setInpScore(prev => prev.map((item, idx) =>
                                                                                                                      idx === i ? { ...item, score: e.target.value.replace(/[^0-9]/g, '') } : item
                                                                                                                    ))} />
            </label>
            <label className="floating-label">
              <span>비고</span>
              <input type="text" placeholder="비고 입력" className="input w-full" value={v.remarks || ''} onChange={(e) => setInpScore(prev => prev.map((item, idx) =>
                                                                                                                                  idx === i ? { ...item, remarks: e.target.value } : item
                                                                                                                                 ))} />
            </label>
          </div>
        ))}
        <button className="btn" onClick={save}>저장</button>
      </fieldset>
    </div>
  )
}