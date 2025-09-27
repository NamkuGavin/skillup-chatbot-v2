"use client";
import { useState, useRef } from "react";

export default function InputForm({ onSendMessage, onQuickAction, isLoading }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const quickActions = [
    { label: "Analisis Skill Tech", action: "skill_analysis" },
    { label: "Latihan Wawancara", action: "interview_practice" },
    { label: "Tips Karir Pemula", action: "career_tips" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  return (
    <div className="input-area">
      <form onSubmit={handleSubmit} className="input-form">
        <textarea
          ref={textareaRef}
          className="message-input"
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Tanya tentang pengembangan karir, atau latihan wawancara..."
          disabled={isLoading}
          rows={1}
        />
        <button
          type="submit"
          className="send-button"
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? "Mengirim..." : "Kirim"}
        </button>
      </form>

      <div className="quick-actions">
        {quickActions.map((quickAction) => (
          <button
            key={quickAction.action}
            className="quick-action-btn"
            onClick={() => onQuickAction(quickAction.action)}
            disabled={isLoading}
          >
            {quickAction.label}
          </button>
        ))}
      </div>
    </div>
  );
}
