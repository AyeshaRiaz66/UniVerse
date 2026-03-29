import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function DailyHabits({ theme = "dark" }) {
  const [input, setInput] = useState("");
  const [habits, setHabits] = useState([]);

  const emojiList = ["📚","💪","🧘‍♂️","💧","🔥","🎯","🚶‍♂️","📖","🛏️","🍎"];

  const isDark = theme === "dark";

  //  Load Habits Live From Firebase
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = collection(db, "users", user.uid, "dailyHabits");

    const unsub = onSnapshot(ref, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setHabits(list);
    });

    return () => unsub();
  }, []);

  //  Add Habit
  const addHabit = async () => {
    if (!input.trim()) return;

    const user = auth.currentUser;
    if (!user) return;

    const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];

    await addDoc(collection(db, "users", user.uid, "dailyHabits"), {
      emoji: randomEmoji,
      title: input,
      streak: 0,
      completed: false,
      createdAt: Date.now(),
    });

    setInput("");
  };

  //  Toggle Habit + Update Streak
  const toggleHabit = async (habit) => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid, "dailyHabits", habit.id);

    await updateDoc(ref, {
      completed: !habit.completed,
      streak: !habit.completed ? habit.streak + 1 : habit.streak,
    });
  };

  const completedCount = habits.filter((h) => h.completed).length;

  // Styles 
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
      width: "90%",
      transition: "0.3s",
    },

    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
    },

    heading: {
      color: isDark ? "#c77dff" : "#5e3bff",
      fontSize: "22px",
      display: "flex",
      gap: "6px",
      alignItems: "center",
    },

    addBtn: {
      width: "38px",
      height: "38px",
      borderRadius: "50%",
      border: "none",
      background: "linear-gradient(145deg,#7c4dff,#b26bff)",
      color: "white",
      cursor: "pointer",
      fontSize: "20px",
    },

    inputRow: {
      display: "flex",
      gap: "10px",
      marginBottom: "12px",
    },

    input: {
      flex: 1,
      padding: "10px 12px",
      borderRadius: "16px",
      border: isDark
        ? "1px solid rgba(255,255,255,0.2)"
        : "1px solid rgba(0,0,0,0.25)",
      background: "transparent",
      color: isDark ? "white" : "black",
      outline: "none",
    },

    addInputBtn: {
      padding: "10px 16px",
      borderRadius: "16px",
      border: "none",
      background: "linear-gradient(145deg,#7c4dff,#b26bff)",
      color: "white",
      cursor: "pointer",
    },

    habitGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2,1fr)",
      gap: "12px",
    },

    habitBox: (completed) => ({
      padding: "14px",
      borderRadius: "16px",
      background: isDark
        ? "rgba(255,255,255,0.07)"
        : "rgba(0,0,0,0.08)",
      border: completed
        ? "2px solid #2bff88"
        : isDark
        ? "1px solid rgba(255,255,255,0.2)"
        : "1px solid rgba(0,0,0,0.3)",
      cursor: "pointer",
      transition: "0.2s",
    }),

    titleRow: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "18px",
      marginBottom: "4px",
    },

    streak: {
      fontSize: "12px",
      color: isDark ? "#ccc" : "#555",
    },

    progressBox: { marginTop: "18px" },

    progressBar: {
      width: "100%",
      height: "10px",
      borderRadius: "10px",
      background: isDark
        ? "rgba(255,255,255,0.15)"
        : "rgba(0,0,0,0.2)",
      overflow: "hidden",
    },

    progressFill: {
      height: "100%",
      borderRadius: "10px",
      background: "linear-gradient(145deg,#7c4dff,#b26bff)",
      width: habits.length
        ? `${(completedCount / habits.length) * 100}%`
        : "0%",
      transition: "0.3s",
    },

    progressText: {
      marginTop: "6px",
      textAlign: "right",
      fontSize: "14px",
      color: isDark ? "#ccc" : "#444",
    },
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.headerRow}>
        <h2 style={styles.heading}>🎯 Daily Habits</h2>
        <button style={styles.addBtn} onClick={addHabit}>+</button>
      </div>

      {/* Input Field */}
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          type="text"
          placeholder="New habit..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addHabit()}
        />
        <button style={styles.addInputBtn} onClick={addHabit}>
          Add
        </button>
      </div>

      {/* Habit Cards */}
      <div style={styles.habitGrid}>
        {habits.map((habit) => (
          <div
            key={habit.id}
            style={styles.habitBox(habit.completed)}
            onClick={() => toggleHabit(habit)}
          >
            <div style={styles.titleRow}>
              <span>{habit.emoji} {habit.title}</span>
              {habit.completed && <span>✔️</span>}
            </div>
            <div style={styles.streak}>🔥 {habit.streak} day streak</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={styles.progressBox}>
        <p>Daily Progress</p>

        <div style={styles.progressBar}>
          <div style={styles.progressFill}></div>
        </div>

        <p style={styles.progressText}>
          {completedCount} / {habits.length}
        </p>
      </div>
    </div>
  );
}
