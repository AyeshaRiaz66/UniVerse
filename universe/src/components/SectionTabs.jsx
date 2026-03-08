import React from "react";

export default function SectionTabs({ theme = "dark", active, setActive }) {

  const isDark = theme === "dark";

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "academic", label: "Academic", icon: "🎓" },
    { id: "finance", label: "Finance", icon: "💲" },
    { id: "health", label: "Health", icon: "❤️" },
    { id: "social", label: "Social", icon: "🤍" },
    { id: "tools", label: "Tools", icon: "⚡" },
  ];

  const container = {
    marginTop: "18px",
    padding: "14px 18px",
    borderRadius: "18px",
    background: isDark
      ? "linear-gradient(145deg,#0b1025,#0b1440)"
      : "linear-gradient(145deg,#ffffff,#e8eeff)",
    border: "1px solid rgba(255,255,255,0.15)",
    transition: "0.3s",
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
    gap: "14px",
    width: "100%",
  };

  const tabStyle = (selected) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    borderRadius: "50px",
    padding: "12px 0",
    cursor: "pointer",
    fontSize: "16px",

    border: selected
      ? "2px solid rgba(255,255,255,0.8)"
      : "1px solid rgba(255,255,255,0.25)",

    background: selected
      ? "linear-gradient(145deg,#7c4dff,#b26bff)"
      : "transparent",

    color: selected
      ? "white"
      : isDark
      ? "white"
      : "black",

    transition: "0.3s",
  });

  return (
    <div style={container}>
      <div style={grid}>
        {tabs.map((t) => (
          <div
            key={t.id}
            style={tabStyle(active === t.id)}
            onClick={() => setActive(t.id)}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
