import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function TodaysWin({ theme = "dark" }) {
  const isDark = theme === "dark";

  const [input, setInput] = useState("");
  const [wins, setWins] = useState([]);

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  //  Load from Firebase
  useEffect(() => {
    const loadWins = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid, "trackers", "todaysWin");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        // If same date → load wins
        if (data.date === today) {
          setWins(data.wins || []);
        } 
        // If old date → reset wins
        else {
          await setDoc(ref, { date: today, wins: [] });
          setWins([]);
        }
      } 
      else {
        await setDoc(ref, { date: today, wins: [] });
      }
    };

    loadWins();
  }, []);

  // Save to Firebase
  const saveWins = async (updated) => {
    setWins(updated);

    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid, "trackers", "todaysWin");
    await setDoc(ref, {
      date: today,
      wins: updated,
    });
  };

  //  Add Win
  const addWin = () => {
    if (!input.trim()) return;

    const updated = [input, ...wins];
    saveWins(updated);
    setInput("");
  };

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

    heading: {
      color: "#ff73c7",
      fontSize: "18px",
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },

    inputRow: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
      marginBottom: "12px",
    },

    input: {
      flex: 1,
      padding: "12px",
      borderRadius: "50px",
      border: "none",
      outline: "none",
      background: isDark
        ? "rgba(255,255,255,0.12)"
        : "rgba(0,0,0,0.1)",
      color: isDark ? "white" : "black",
    },

    saveBtn: {
      padding: "10px 18px",
      borderRadius: "50px",
      border: "none",
      cursor: "pointer",
      background: "linear-gradient(145deg,#d65bff,#a86bff)",
      color: "white",
      fontWeight: "600",
      fontSize: "14px",
    },

    winBox: {
      padding: "12px",
      borderRadius: "14px",
      background: isDark
        ? "rgba(255,255,255,0.07)"
        : "rgba(0,0,0,0.06)",
      border: "1px solid rgba(255,255,255,0.12)",
      marginBottom: "10px",
    },
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.heading}>💗 Today's Win</h3>

      {/* Input Row */}
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          placeholder="What went well today?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button style={styles.saveBtn} onClick={addWin}>
          Save
        </button>
      </div>

      {/* Wins */}
      {wins.length === 0 && (
        <p style={{ opacity: 0.7 }}>No wins saved yet. Add one 💖</p>
      )}

      {wins.map((w, i) => (
        <div key={i} style={styles.winBox}>
          {w}
        </div>
      ))}
    </div>
  );
}
