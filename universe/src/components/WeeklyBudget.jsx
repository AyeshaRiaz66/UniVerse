import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function WeeklyBudget({ theme = "dark" }) {
  const isDark = theme === "dark";

  const [budget, setBudget] = useState(0);
  const [spent, setSpent] = useState(0);

  const user = auth.currentUser;

  // LOAD FROM FIRESTORE
  useEffect(() => {
    const loadBudget = async () => {
      if (!user) return;

      const ref = doc(db, "users", user.uid, "finance", "weeklyBudget");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setBudget(data.budget || 0);
        setSpent(data.spent || 0);
      }
    };

    loadBudget();
  }, []);

  // SAVE TO FIRESTORE
  const saveBudget = async (newBudget, newSpent) => {
    if (!user) return;

    const ref = doc(db, "users", user.uid, "finance", "weeklyBudget");
    await setDoc(ref, {
      budget: newBudget,
      spent: newSpent,
      updatedAt: Date.now(),
    });
  };

  // HANDLE CHANGES
  const handleBudgetChange = (value) => {
    const num = Number(value) || 0;
    setBudget(num);
    saveBudget(num, spent);
  };

  const handleSpentChange = (value) => {
    const num = Number(value) || 0;
    setSpent(num);
    saveBudget(budget, num);
  };

  //  CALCULATIONS
  const left = Math.max(budget - spent, 0);
  const percent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  const today = new Date();
  const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysLeft = totalDays - today.getDate();

  const dailyAvg = spent > 0 ? (spent / today.getDate()).toFixed(2) : 0;

  // UI 
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
      color: "#a675ff",
      fontSize: "18px",
      marginBottom: "15px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },

    boxes: {
      display: "flex",
      gap: "16px",
      marginTop: "18px",
    },

    box: {
      flex: 1,
      background: "rgba(255,255,255,0.07)",
      borderRadius: "16px",
      padding: "10px",
      textAlign: "center",
      border: "1px solid rgba(255,255,255,0.15)",
    },

    label: {
      fontSize: "13px",
      opacity: 0.8,
    },

    value: {
      fontSize: "22px",
      marginTop: "4px",
    },

    inputs: {
      display: "flex",
      gap: "10px",
      marginTop: "15px",
      marginBottom: "8px",
    },

    input: {
      flex: 1,
      padding: "10px",
      borderRadius: "10px",
      border: "none",
      outline: "none",
      background: isDark
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.1)",
      color: isDark ? "white" : "black",
    },

    progressWrapper: {
      marginTop: "15px",
    },

    progressBar: {
      width: "100%",
      height: "10px",
      borderRadius: "50px",
      background: "rgba(255,255,255,0.18)",
      overflow: "hidden",
    },

    fill: {
      height: "100%",
      width: `${percent}%`,
      background: "linear-gradient(90deg,#7c4dff,#b26bff)",
    },

    footer: {
      marginTop: "10px",
      display: "flex",
      justifyContent: "space-between",
      fontSize: "13px",
      opacity: 0.9,
    },
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.heading}>💰 Weekly Budget</h3>

      {/* INPUTS */}
      <div style={styles.inputs}>
        <input
          type="number"
          style={styles.input}
          value={budget}
          onChange={(e) => handleBudgetChange(e.target.value)}
          placeholder="Enter Budget (Rs)"
        />

        <input
          type="number"
          style={styles.input}
          value={spent}
          onChange={(e) => handleSpentChange(e.target.value)}
          placeholder="Enter Spending (Rs)"
        />
      </div>

      {/* TOP NUMBERS */}
      <div style={styles.boxes}>
        <div style={styles.box}>
          <p style={styles.label}>Budget</p>
          <p style={{ ...styles.value, color: "#ffffff" }}>Rs {budget}</p>
        </div>

        <div style={styles.box}>
          <p style={styles.label}>Spent</p>
          <p style={{ ...styles.value, color: "#ff5b5b" }}>Rs {spent}</p>
        </div>

        <div style={styles.box}>
          <p style={styles.label}>Left</p>
          <p style={{ ...styles.value, color: "#6bff6b" }}>Rs {left}</p>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div style={styles.progressWrapper}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Spending</span>
          <span>{Math.round(percent)}%</span>
        </div>

        <div style={styles.progressBar}>
          <div style={styles.fill}></div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={styles.footer}>
        <span>📈 Daily avg: Rs {dailyAvg}</span>
        <span>{daysLeft} days left</span>
      </div>
    </div>
  );
}
