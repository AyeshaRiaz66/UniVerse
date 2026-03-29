import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query
} from "firebase/firestore";

export default function StudyTimer({ theme = "dark" }) {
  const DEFAULT_TIME = 25 * 60; 
  const [time, setTime] = useState(DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [topic, setTopic] = useState("");
  const [sessions, setSessions] = useState([]);

  // LOAD SESSIONS
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = collection(db, "users", user.uid, "studySessions");
    const q = query(ref, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      setSessions(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    });

    return () => unsub();
  }, []);

  // ---------------- TIMER ENGINE ----------------
  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => setTime((t) => t - 1), 1000);
    }

    if (time === 0 && isRunning) {
      handleSaveSession();
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, time]);

  const formatTime = () => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  //  BUTTON ACTIONS 
  const handleStart = () => {
    if (!topic.trim()) return alert("Enter what you're studying!");
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setTime(DEFAULT_TIME);
    setTopic("");
  };

  //  SAVE TO FIREBASE 
  const handleSaveSession = async () => {
    if (!topic.trim()) return alert("Enter what you're studying!");

    const studiedMinutes = Math.max(
      1,
      Math.round((DEFAULT_TIME - time) / 60)
    );

    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "users", user.uid, "studySessions"), {
      topic,
      duration: `${studiedMinutes} min`,
      createdAt: Date.now(),
    });

    handleReset();
  };

  
  const isDark = theme === "dark";

  const styles = {
    card: {
      padding: "20px",
      borderRadius: "18px",
      background: isDark
        ? "linear-gradient(145deg,#0b1025,#0b1440)"
        : "linear-gradient(145deg,#ffffff,#dfe7ff,#cbd8ff)",
      boxShadow: isDark
        ? "0 0 25px rgba(124,77,255,0.2)"
        : "0 0 25px rgba(100,120,255,0.35)",
      border: "1px solid rgba(255,255,255,0.15)",
      color: isDark ? "white" : "black",
      width: "450px",
      transition: "0.3s",
    },

    heading: {
      color: isDark ? "#c77dff" : "#5e3bff",
      fontSize: "22px",
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },

    timerBox: {
      width: "100%",
      height: "180px",
      borderRadius: "20px",
      border: "1px solid rgba(255,255,255,0.25)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "42px",
      fontWeight: "600",
      color: isDark ? "#fff" : "#000",
      marginBottom: "20px",
      background: isDark
        ? "rgba(255,255,255,0.03)"
        : "rgba(0,0,0,0.05)",
    },

    input: {
      width: "95%",
      padding: "12px",
      borderRadius: "18px",
      border: "1px solid rgba(255,255,255,0.25)",
      background: "transparent",
      color: isDark ? "white" : "black",
      outline: "none",
      textAlign: "center",
      marginBottom: "18px",
    },

    buttons: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      marginBottom: "18px",
    },

    btnPurple: {
      padding: "10px 18px",
      borderRadius: "14px",
      border: "none",
      background: "linear-gradient(145deg,#7c4dff,#b26bff)",
      color: "white",
      cursor: "pointer",
      fontSize: "16px",
    },

    resetBtn: {
      padding: "10px 18px",
      borderRadius: "14px",
      border: "none",
      background: "linear-gradient(145deg,#7c4dff,#b26bff)",
      color: "white",
      cursor: "pointer",
      fontSize: "16px",
    },

    recentTitle: {
      color: isDark ? "#ddd" : "#444",
      fontSize: "14px",
      marginBottom: "6px",
    },

    session: {
      padding: "10px",
      marginTop: "6px",
      borderRadius: "12px",
      background: isDark
        ? "rgba(255,255,255,0.07)"
        : "rgba(0,0,0,0.07)",
      border: "1px solid rgba(255,255,255,0.1)",
      display: "flex",
      justifyContent: "space-between",
      color: isDark ? "white" : "black",
    },
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.heading}>📖 Study Timer</h2>

      <div style={styles.timerBox}>{formatTime()}</div>

      <input
        style={styles.input}
        type="text"
        placeholder="What are you studying?"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <div style={styles.buttons}>
        {!isRunning ? (
          <button style={styles.btnPurple} onClick={handleStart}>
            ▶ Start
          </button>
        ) : (
          <button style={styles.btnPurple} onClick={handlePause}>
            ⏸ Pause
          </button>
        )}

        <button style={styles.resetBtn} onClick={handleReset}>
          🔄 Reset
        </button>

        <button style={styles.btnPurple} onClick={handleSaveSession}>
          💾 Save
        </button>
      </div>

      <div>
        <p style={styles.recentTitle}>Recent Sessions</p>

        {sessions.map((s) => (
          <div key={s.id} style={styles.session}>
            <span>{s.topic}</span>
            <strong>{s.duration}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
