import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

export default function MoodTracker({ theme = "dark" }) {
  const moods = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😌", label: "Calm" },
    { emoji: "😡", label: "Angry" },
    { emoji: "😔", label: "Sad" },
    { emoji: "😵‍💫", label: "Stressed" },
    { emoji: "🤩", label: "Excited" },
  ];

  const [recentMoods, setRecentMoods] = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const [weeklyChart, setWeeklyChart] = useState({});
  const [streak, setStreak] = useState(0);

  const isDark = theme === "dark";

  // LOAD DATA
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "moods"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setRecentMoods(list);
      calcTodayMood(list);
      calcWeeklyChart(list);
      calcStreak(list);
    });

    return () => unsub();
  }, []);

  // ADD MOOD
  const addMood = async (mood) => {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "users", user.uid, "moods"), {
      emoji: mood.emoji,
      label: mood.label,
      date: new Date().toISOString().split("T")[0],
      createdAt: Date.now(),
    });
  };

  // DELETE MOOD
  const deleteMood = async (id) => {
    const user = auth.currentUser;
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "moods", id));
  };

  //  TODAY'S MOOD
  const calcTodayMood = (list) => {
    const today = new Date().toISOString().split("T")[0];
    const entry = list.find((m) => m.date === today);
    setTodayMood(entry || null);
  };

  // WEEKLY CHART 
  const calcWeeklyChart = (list) => {
    const now = new Date();
    const weekData = {};

    moods.forEach((m) => (weekData[m.label] = 0));

    list.forEach((m) => {
      const diff =
        (now - new Date(m.date)) / (1000 * 60 * 60 * 24);
      if (diff <= 7) weekData[m.label]++;
    });

    setWeeklyChart(weekData);
  };

  // STREAK CALCULATOR
  const calcStreak = (list) => {
    if (!list.length) return setStreak(0);

    let streakCount = 0;
    let currentDate = new Date();

    for (let m of list) {
      const moodDate = new Date(m.date);
      const diff =
        Math.floor(
          (currentDate - moodDate) / (1000 * 60 * 60 * 24)
        );

      if (diff === 0 || diff === streakCount) {
        streakCount++;
      } else break;
    }

    setStreak(streakCount);
  };

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "18px",
        background: isDark
          ? "linear-gradient(145deg,#0b1025,#0b1440)"
          : "linear-gradient(145deg,#ffffff,#dfe7ff,#cbd8ff)",
        color: isDark ? "white" : "black",
        width: "90%",
      }}
    >
      <h2 style={{ color: "#c77dff" }}>📅 Mood Tracker</h2>

      {/*  TODAY'S MOOD */}
      <div
        style={{
          padding: "14px",
          borderRadius: "14px",
          background: "rgba(255,255,255,0.1)",
          marginBottom: "15px",
        }}
      >
        <strong>⭐ Today:</strong>{" "}
        {todayMood ? (
          <>
            {todayMood.emoji} {todayMood.label}
          </>
        ) : (
          "No mood logged today"
        )}
      </div>

      {/*  STREAK */}
      <div
        style={{
          padding: "14px",
          borderRadius: "14px",
          background: "rgba(255,255,255,0.1)",
          marginBottom: "15px",
        }}
      >
        <strong>🔥 Streak:</strong> {streak} days
      </div>

      {/*  WEEKLY BAR CHART  */}
      <p>📊 Weekly Mood Chart</p>
      {Object.keys(weeklyChart).map((key) => (
        <div
          key={key}
          style={{ marginBottom: "6px", fontSize: "14px" }}
        >
          {key}
          <div
            style={{
              height: "8px",
              borderRadius: "6px",
              background: "#7c4dff",
              width: `${weeklyChart[key] * 25}px`,
            }}
          ></div>
        </div>
      ))}

      {/* Mood Buttons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "10px",
          margin: "18px 0",
        }}
      >
        {moods.map((m) => (
          <div
            key={m.label}
            onClick={() => addMood(m)}
            style={{
              textAlign: "center",
              padding: "14px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.07)",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "28px" }}>{m.emoji}</div>
            <div>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Moods */}
      <p>Recent Moods</p>
      {recentMoods.map((m) => (
        <div
          key={m.id}
          style={{
            padding: "10px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.07)",
            marginTop: "6px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>
            {m.emoji} {m.label}
          </span>
          <span>
            {m.date}
            <button
              style={{
                marginLeft: 10,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#ff7675",
              }}
              onClick={() => deleteMood(m.id)}
            >
              🗑️
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}
