"use client";
import { useState, useRef, useEffect } from "react";
import MessageList from "@/components/MessageList";
import InputForm from "@/components/InputForm";
import Sidebar from "@/components/SideBar";

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Halo! Saya SkillUp, asisten AI untuk pengembangan karir Anda. Bagaimana saya bisa membantu Anda hari ini?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState({
    targetJob: "",
    experienceLevel: "mid",
    currentFeature: "general",
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          context: context,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Maaf, terjadi error. Silakan coba lagi.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    const quickMessages = {
      skill_analysis:
        "Saya ingin analisis skill untuk karir di bidang technology",
      interview_practice: "Saya ingin latihan wawancara kerja",
      career_tips: "Berikan tips pengembangan karir untuk pemula",
    };

    handleSendMessage(quickMessages[action] || action);
  };

  const updateContext = (newContext) => {
    setContext((prev) => ({ ...prev, ...newContext }));
  };

  return (
    <div className="chat-app">
      <Sidebar
        context={context}
        onContextUpdate={updateContext}
        onQuickAction={handleQuickAction}
      />

      <div className="chat-area">
        <div className="chat-header">
          <h2>SkillUp Career Assistant</h2>
          <div style={{ fontSize: "14px", color: "#64748b" }}>
            {context.targetJob && `Target: ${context.targetJob} • `}
            Level: {context.experienceLevel}
          </div>
        </div>

        <MessageList messages={messages} isLoading={isLoading} />

        <InputForm
          onSendMessage={handleSendMessage}
          onQuickAction={handleQuickAction}
          isLoading={isLoading}
        />

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
