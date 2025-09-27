"use client";
import { useState } from "react";

export default function Sidebar({ context, onContextUpdate, onQuickAction }) {
  const [localContext, setLocalContext] = useState({
    targetJob: "",
    experienceLevel: "mid",
  });

  const features = [
    {
      id: "skill_analysis",
      title: "Analisis Skill",
      description: "Analisis kemampuan yang dibutuhkan untuk karir Anda",
      icon: "📊",
    },
    {
      id: "interview_practice",
      title: "Latihan Wawancara",
      description: "Simulasi wawancara dengan AI recruiter",
      icon: "💼",
    },
    {
      id: "career_tips",
      title: "Tips Karir",
      description: "Saran pengembangan karir dan skill",
      icon: "🚀",
    },
  ];

  const handleContextUpdate = () => {
    onContextUpdate(localContext);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>SkillUp AI</h1>
        <p>Asisten Pengembangan Karir</p>
      </div>

      <div className="feature-buttons">
        {features.map((feature) => (
          <button
            key={feature.id}
            className={`feature-btn ${
              context.currentFeature === feature.id ? "active" : ""
            }`}
            onClick={() => {
              onContextUpdate({ currentFeature: feature.id });
              onQuickAction(feature.id);
            }}
          >
            <span style={{ fontSize: "18px", marginRight: "8px" }}>
              {feature.icon}
            </span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: "600" }}>{feature.title}</div>
              <div style={{ fontSize: "12px", opacity: 0.7 }}>
                {feature.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="context-section">
        <h3>Setting Karir Anda</h3>

        <input
          type="text"
          placeholder="Posisi/Industri target (contoh: Software Engineer)"
          className="context-input"
          value={localContext.targetJob}
          onChange={(e) =>
            setLocalContext((prev) => ({ ...prev, targetJob: e.target.value }))
          }
        />

        <select
          className="context-input"
          value={localContext.experienceLevel}
          onChange={(e) =>
            setLocalContext((prev) => ({
              ...prev,
              experienceLevel: e.target.value,
            }))
          }
        >
          <option value="entry">Pemula (0-2 tahun)</option>
          <option value="mid">Menengah (2-5 tahun)</option>
          <option value="senior">Senior (5+ tahun)</option>
        </select>

        <button className="context-btn" onClick={handleContextUpdate}>
          Update Setting
        </button>
      </div>

      <div
        style={{
          marginTop: "20px",
          fontSize: "12px",
          color: "#64748b",
          textAlign: "center",
        }}
      >
        Powered by Gemini AI • SkillUp v1.0
      </div>
    </div>
  );
}
