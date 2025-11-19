import React, { useState } from "react";
import "./AIAssistant.css";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <div className="ai-button" onClick={() => setOpen(true)}>
        🤖
      </div>

      {/* Chat Window */}
      {open && (
        <div className="ai-window">
          <div className="ai-header">
            <span>AI Assistant</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          <div className="ai-body">
            <p>Hi! How can I assist you today?</p>
          </div>

          <div className="ai-input">
            <input placeholder="Type your message..." />
            <button>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
