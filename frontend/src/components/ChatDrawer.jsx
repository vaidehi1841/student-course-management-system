import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // backend socket

export default function ChatDrawer() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    socket.on("broadcast", (m) => {
      setHistory(h => [...h, { from: "ai", text: m }]);
    });
    return () => socket.off("broadcast");
  }, []);

  function send() {
    if (!msg) return;
    setHistory(h => [...h, { from: "me", text: msg }]);
    // send via socket so other clients can see (and backend can log)
    socket.emit("notify", msg);
    // simple local AI reply (mock)
    setTimeout(() => {
      const reply = "Assistant: I can help with course & attendance questions. Try: 'How to enroll?'";
      setHistory(h => [...h, { from: "ai", text: reply }]);
    }, 800);
    setMsg("");
  }

  return (
    <div className={`chat-drawer ${open ? "open" : ""}`}>
      <button className="chat-toggle" onClick={() => setOpen(v => !v)}>AI</button>
      <div className="chat-window">
        <div className="chat-history">
          {history.map((m,i) => <div key={i} className={`chat-msg ${m.from}`}>{m.text}</div>)}
        </div>
        <div className="chat-input">
          <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Ask the assistant..." />
          <button onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}
