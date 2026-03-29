import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function MealPlanner({ theme = "dark" }) {
  const isDark = theme === "dark";

  const [meals, setMeals] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
  });

  //  Load Meals from Firestore
  useEffect(() => {
    const loadMeals = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid, "trackers", "meals");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setMeals(snap.data());
      } else {
        await setDoc(ref, {
          breakfast: "",
          lunch: "",
          dinner: "",
        });
      }
    };

    loadMeals();
  }, []);

  //  Save meals to Firestore
  const saveMeals = async (updatedMeals) => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid, "trackers", "meals");
    await setDoc(ref, updatedMeals);
  };

  const handleChange = (key, value) => {
    const updated = { ...meals, [key]: value };
    setMeals(updated);
    saveMeals(updated);
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

    title: {
      color: "#a675ff",
      fontSize: "18px",
      marginBottom: "15px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },

    mealBox: {
      background: "rgba(255,255,255,0.07)",
      borderRadius: "16px",
      border: "1px solid rgba(255,255,255,0.15)",
      padding: "12px",
      marginBottom: "14px",
    },

    label: {
      fontSize: "11px",
      opacity: 0.7,
      letterSpacing: "1px",
    },

    row: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },

    input: {
      marginTop: "6px",
      width: "100%",
      background: "transparent",
      border: "none",
      outline: "none",
      color: isDark ? "white" : "black",
      fontSize: "15px",
      fontWeight: "bold",
    },

    time: {
      fontSize: "12px",
      opacity: 0.8,
    },
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>🍽 Meal Planner</h3>

      {/* BREAKFAST */}
      <div style={styles.mealBox}>
        <div style={styles.row}>
          <p style={styles.label}>BREAKFAST</p>
          <span style={styles.time}>8:00 AM</span>
        </div>

        <input
          type="text"
          style={styles.input}
          placeholder="Not planned"
          value={meals.breakfast}
          onChange={(e) => handleChange("breakfast", e.target.value)}
        />
      </div>

      {/* LUNCH */}
      <div style={styles.mealBox}>
        <div style={styles.row}>
          <p style={styles.label}>LUNCH</p>
          <span style={styles.time}>1:00 PM</span>
        </div>

        <input
          type="text"
          style={styles.input}
          placeholder="Not planned"
          value={meals.lunch}
          onChange={(e) => handleChange("lunch", e.target.value)}
        />
      </div>

      {/* DINNER */}
      <div style={styles.mealBox}>
        <div style={styles.row}>
          <p style={styles.label}>DINNER</p>
          <span style={styles.time}>7:00 PM</span>
        </div>

        <input
          type="text"
          style={styles.input}
          placeholder="Not planned"
          value={meals.dinner}
          onChange={(e) => handleChange("dinner", e.target.value)}
        />
      </div>
    </div>
  );
}
