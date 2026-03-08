import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function SleepQuality({ theme = "dark" }) {
  const isDark = theme === "dark";

  const [hours, setHours] = useState(0);
  const today = new Date().toISOString().split("T")[0];

  //  Load Sleep Data
  useEffect(() => {
    const loadSleep = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid, "trackers", "sleep");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        // Reset if new day
        if (data.date === today) {
          setHours(data.hours || 0);
        } else {
          await setDoc(ref, { hours: 0, date: today });
          setHours(0);
        }
      } else {
        await setDoc(ref, { hours: 0, date: today });
        setHours(0);
      }
    };

    loadSleep();
  }, []);

  //  Save Sleep
  const saveSleep = async (value) => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid, "trackers", "sleep");
    await setDoc(ref, {
      hours: value,
      date: today,
    });
  };

  const handleHoursChange = (val) => {
    const value = Number(val);
    setHours(value);
    saveSleep(value);
  };

  //  Sleep Logic
  const getSleepStatus = () => {
    if (hours <= 3) return { text: "Very Poor 😴", stars: 1 };
    if (hours <= 5) return { text: "Poor 😪", stars: 2 };
    if (hours <= 6.5) return { text: "Average 🙂", stars: 3 };
    if (hours <= 7.5) return { text: "Well Rested 💤", stars: 4 };
    return { text: "Excellent 🌟", stars: 5 };
  };

  const { text, stars } = getSleepStatus();

  const styles = {
    card: {
      padding: "20px",
      borderRadius: "18px",
      background: isDark
        ? "linear-gradient(145deg,#0b1025,#0b1440)"
        : "linear-gradient(145deg,#ffffff,#e8eeff)",
      border: "1px solid rgba(255,255,255,0.15)",
      color: isDark ? "white" : "black",
    },
    title: {
      color: "#a675ff",
      marginBottom: "10px",
      fontSize: "17px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    stars: {
      fontSize: "28px",
      textAlign: "center",
      margin: "8px 0",
    },
    box: {
      marginTop: "12px",
      padding: "16px",
      borderRadius: "18px",
      background: "rgba(255,255,255,0.07)",
      border: "1px solid rgba(255,255,255,0.15)",
      textAlign: "center",
    },
    input: {
      padding: "10px",
      borderRadius: "10px",
      border: "none",
      outline: "none",
      width: "120px",
      textAlign: "center",
      background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      color: isDark ? "white" : "black",
      marginBottom: "10px",
      fontSize: "15px",
    },
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>🌙 Sleep Quality</h3>

      {/* Input Hours */}
      <div style={{ textAlign: "center" }}>
        <input
          type="number"
          step="0.1"
          min="0"
          max="12"
          style={styles.input}
          value={hours}
          onChange={(e) => handleHoursChange(e.target.value)}
        />
      </div>

      {/* Stars */}
      <div style={styles.stars}>
        {"⭐".repeat(stars)}
        {"☆".repeat(5 - stars)}
      </div>

      {/* Info */}
      <div style={styles.box}>
        <p style={{ opacity: 0.8 }}>Last Night</p>
        <h2 style={{ margin: 0 }}>{hours} hrs</h2>
        <p style={{ opacity: 0.8 }}>{text}</p>
      </div>
    </div>
  );
}
