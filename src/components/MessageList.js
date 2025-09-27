"use client";
import { useEffect, useRef } from "react";

export default function MessageList({ messages, isLoading }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatContent = (content) => {
    // Simple formatting for better display
    return content.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="messages-container">
      {messages.map((message) => (
        <div key={message.id} className={`message ${message.role}`}>
          {message.role === "assistant" && (
            <div className="message-avatar">AI</div>
          )}

          <div className="message-content">
            {formatContent(message.content)}
            <div
              style={{
                fontSize: "11px",
                opacity: 0.6,
                marginTop: "5px",
                textAlign: message.role === "user" ? "right" : "left",
              }}
            >
              {message.timestamp.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {message.role === "user" && <div className="message-avatar">You</div>}
        </div>
      ))}

      {isLoading && (
        <div className="message assistant">
          <div className="message-avatar">AI</div>
          <div className="message-content">
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
