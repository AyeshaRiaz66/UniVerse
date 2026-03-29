import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function AIBrainstormer({ theme = "dark" }) {
  const isDark = theme === "dark";

  const [topic, setTopic] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const brainstorm = async () => {
    if (!topic.trim()) return alert("Please enter a topic!");

    setLoading(true);
    setResponse("");

    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyC3uX9p36sCUI2H6cI-9lPZMA9MnPaIGJg"   
      );

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const result = await model.generateContent(
        `Give short brainstorming ideas, tips and insights about: ${topic}`
      );

      setResponse(result.response.text());
    } catch (err) {
      console.log("Gemini Error → ", err);
      setResponse("❌ Something went wrong. Maybe API blocked or internet issue.");
    }

    setLoading(false);
  };

  return (
    <div style={{
      padding: "20px",
      borderRadius: "18px",
      background: isDark
        ? "linear-gradient(145deg,#0b1025,#0b1440)"
        : "linear-gradient(145deg,#ffffff,#e8eeff)",
      border: "1px solid rgba(255,255,255,0.15)",
      color: isDark ? "white" : "black",
    }}>
      
      <h3 style={{ color: "#a675ff", marginBottom: "10px" }}>⚡ AI Brainstormer</h3>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic..."
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            outline: "none",
            background: isDark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)",
            color: isDark ? "white" : "black",
          }}
        />

        <button
          onClick={brainstorm}
          disabled={loading}
          style={{
            padding: "12px 14px",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(145deg,#7c4dff,#b26bff)",
            color: "white",
            fontSize: "18px",
            opacity: loading ? 0.6 : 1,
          }}
        >
          ⚡
        </button>
      </div>

      <div style={{
        marginTop: "12px",
        padding: "12px",
        borderRadius: "14px",
        minHeight: "130px",
        border: "1px solid rgba(255,255,255,0.2)",
        background: isDark
          ? "rgba(255,255,255,0.08)"
          : "rgba(0,0,0,0.08)",
      }}>
        {loading
          ? "🤖 Thinking..."
          : response || "AI results will appear here..."}
      </div>
    </div>
  );
}
