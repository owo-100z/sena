import React, { useState, useEffect } from "react";

function getNowDateTimeLocal() {
  const now = new Date();
  now.setSeconds(0, 0);
  const pad = n => n.toString().padStart(2, '0');
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const min = pad(now.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function addMinutesToDateTimeLocal(dtStr, minutes) {
  const date = dtStr ? new Date(dtStr) : new Date();
  date.setMinutes(date.getMinutes() + minutes);
  date.setSeconds(0, 0);
  const pad = n => n.toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export default function Home() {
    const [dateTime, setDateTime] = useState(getNowDateTimeLocal());
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        comm.log("ggg");
        setTimeout(() => {
            setLoaded(true);
        }, 1000);
    }, [])

    const handleAddMinutes = (min) => {
        setDateTime(dt => addMinutesToDateTimeLocal(dt, min));
    };

    const tmpStop = (is) => {
        if (is) comm.log("stop");
        else comm.log("release");
    }

    return (
        <>
            <div className="flex w-full max-w-180 flex-col gap-1">
                <div className="card bg-base-200 rounded-box grid p-3 place-items-center">
                    <div className="filter flex justify-center gap-3">
                        <input className="btn filter-reset" type="radio" name="metaframeworks" aria-label="All"/>
                        <input className="btn" type="radio" name="metaframeworks" aria-label="배민"/>
                        <input className="btn" type="radio" name="metaframeworks" aria-label="쿠팡"/>
                        <input className="btn" type="radio" name="metaframeworks" aria-label="땡겨요"/>
                    </div>
                </div>
                <div className="card bg-base-200 rounded-box grid p-3 place-items-center">
                    <div className="card-body items-center text-center">
                        <div className="join">
                            <button className="btn btn-xs" onClick={() => {handleAddMinutes(30);}}>+30분</button>
                            <button className="btn btn-xs" onClick={() => {handleAddMinutes(60);}}>+1시간</button>
                            <button className="btn btn-xs" onClick={() => {handleAddMinutes(120);}}>+2시간</button>
                            <button className="btn btn-xs" onClick={() => {setDateTime(getNowDateTimeLocal())}}>초기화</button>
                        </div>
                        <span>
                            <input type="datetime-local" className="input w-55" value={dateTime} onChange={e => setDateTime(e.target.value)} />
                            <button className="btn btn-md ml-1 bg-error/50" onClick={() => {tmpStop(true)}}>임시중지</button>
                            <button className="btn btn-md ml-1 bg-info/50" onClick={() => {tmpStop(false)}}>임시중지해제</button>
                        </span>
                    </div>
                </div>
                <div className="card bg-base-100 rounded-box grid p-3 place-items-center">
                    {!loaded && (
                        <div className="flex w-52 flex-col gap-4">
                            <div className="skeleton h-32 w-full"></div>
                        </div>
                    )}
                    {loaded && (
                        <div className="card bg-base-100 text-base-content">
                            <div className="card-body items-center text-center">
                                <h2 className="card-title">Cookies!</h2>
                                <div className="card-actions justify-end">
                                <button className="btn btn-error/50">Accept</button>
                                <button className="btn btn-info/50">Deny</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}