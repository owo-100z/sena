import React, { useState, useEffect } from "react";

const today = dayjs().format('YYYY-MM-DD');
//const std_dt = dayjs().add(-1, 'day').format('YYYY-MM-DD');
const curr_week = dayjs().locale('ko').format('ddd');

const weeks = ['월', '화', '수', '목', '금', '토', '일'];

const getWeek = (dt) => {
  return dayjs(dt).format('ddd');
}

const getStdDt = (week) => {
  const today_of_week = getWeek(today);
  const index_of_today = weeks.findIndex(v => v === today_of_week);
  const index_of_week = weeks.findIndex(v => v === week);

  const diff = index_of_week - index_of_today;

  const result = diff <= 0 ? dayjs(today).add(diff, 'day').format('YYYY-MM-DD') : dayjs(today).add(diff - 7, 'day').format('YYYY-MM-DD');

  return result;
}

export default function Home() {
  const [selectedWeek, setSelectedWeek] = useState(curr_week);
  const [stdDate, setStdDate] = useState(today);

  const [summary, setSummary] = useState({});

  useEffect(() => {
    selectSiegeList(stdDate);
  }, [stdDate]);

  const selectSiegeList = async (stdt) => {
    const st_dt = stdt.replace(/[^0-9]/g, '');
    const res = await comm.api('/guild/siege/summary', { method: 'GET', params: {stdDate: st_dt}});

    if (res.status === "success") {
      setSummary({
        list: res?.data?.list,
        dashboard: res?.data?.dashboard[0],
      })
    }
  }

  return (
    <div className="flex w-full max-w-180 flex-col gap-1">
      <div className="grid p-3 overflow-x-auto">
        <ul className="steps z-0">
          {weeks && weeks.map((v, i) => (
            <li key={i} data-content={v} className={`step cursor-pointer ${v === selectedWeek ? 'step-secondary' : ''}`} onClick={() => {setSelectedWeek(v); setStdDate(getStdDt(v));}}></li>
          ))}
        </ul>
      </div>

      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">최고점수</div>
          <div className="stat-value">{ Number(summary.dashboard?.high_score || 0).toLocaleString() }</div>
          <div className="stat-desc">최저: { Number(summary.dashboard?.row_score || 0).toLocaleString() }</div>
        </div>

        <div className="stat">
          <div className="stat-title">참여</div>
          <div className="stat-value">{ summary.dashboard?.played || 0 }</div>
          <div className="stat-desc">미참여: { (summary.dashboard?.players || 0) - (summary.dashboard?.played || 0) }</div>
        </div>

        <div className="stat">
          <div className="stat-title">총점</div>
          <div className="stat-value">{ Number(summary.dashboard?.total_score || 0).toLocaleString() }</div>
          <div className={`stat-desc ${(summary.dashboard?.diff_score || 0) >= 0 ? 'text-primary' : 'text-error'}`}>{ Number(summary.dashboard?.diff_score || 0).toLocaleString() }</div>
        </div>
      </div>

      <strong className="text-primary">기준일: {stdDate}</strong>
      <div className="overflow-x-auto max-h-120 md:max-h-80">
        <table className="table table-xs table-pin-rows table-pin-cols z-0">
          <thead>
            <tr>
              <th></th>
              <th>유저명</th>
              <td>레벨</td>
              <td>지난주점수</td>
              <td>이번주점수</td>
              <td>점수상승</td>
              <td>지난주미참여</td>
              <td>이번주미참여</td>
            </tr>
          </thead>
          <tbody>
            { summary.list && summary.list?.map((v, i) => (
              <tr key={i}>
                <th>{i+1}</th>
                <th>{v?.username}</th>
                <td>{v?.lv}</td>
                <td>{Number(v?.pre_score || 0).toLocaleString()}</td>
                <td>{Number(v?.cur_score || 0).toLocaleString()}</td>
                <td className={(v?.diff_score || 0) < 0 ? 'text-error' : ''}>{Number(v?.diff_score || 0).toLocaleString()}</td>
                <td className={(v?.no_play_pre || 0) > 0 ? 'text-error' : ''}>{v?.no_play_pre}</td>
                <td className={(v?.no_play_cur || 0) > 0 ? 'text-error' : ''}>{v?.no_play_cur}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}