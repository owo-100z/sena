import React, { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    init();
  }, []);
  
  const init = async () => {
    const res = await comm.api("/health");
    comm.log("Health Check Response:", res);
    setStatus(res.status);
    setMessage(res.data || res.error || "");
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>API Health Check</h1>
      <p>Status: <strong>{status}</strong></p>
      {message && <p>Message: {typeof message === 'string' ? message : JSON.stringify(message)}</p>}
    </div>
  );
}

export default App;