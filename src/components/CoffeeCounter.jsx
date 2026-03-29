import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function CoffeeCounter({ theme = "dark" }) {
  const isDark = theme === "dark";

  const [cups, setCups] = useState(0);
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  //  Load Coffee from Firestore
  useEffect(() => {
    const loadCoffee = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid, "trackers", "coffeeCounter");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        // If same day → load
        if (data.date === today) {
          setCups(data.cups || 0);
        } 
        // If old day → reset
        else {
          await setDoc(ref, { date: today, cups: 0 });
          setCups(0);
        }
      } 
      else {
        await setDoc(ref, { date: today, cups: 0 });
      }
    };

    loadCoffee();
  }, []);

  //  Save Coffee to Firestore
  const saveCoffee = async (value) => {
    setCups(value);

    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid, "trackers", "coffeeCounter");

    await setDoc(ref, {
      date: today,
      cups: value,
    });
  };

  //  Buttons
  const addCup = () => {
    if (cups >= 20) return;
    saveCoffee(cups + 1);
  };

  const removeCup = () => {
    if (cups <= 0) return;
    saveCoffee(cups - 1);
  };

  //  Styles
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
      color: "#ff9e42",
      fontSize: "18px",
      marginBottom: "10px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },

    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "10px",
    },

    btn: {
      width: "45px",
      height: "45px",
      borderRadius: "50%",
      border: "1px solid rgba(255,255,255,0.3)",
      background: "transparent",
      fontSize: "20px",
      color: isDark ? "white" : "black",
      cursor: "pointer",
    },

    center: {
      textAlign: "center",
      flex: 1,
    },

    cupsEmoji: {
      fontSize: "24px",
      marginBottom: "5px",
    },

    cupsNum: {
      fontSize: "22px",
      fontWeight: "bold",
    },

    label: {
      opacity: 0.8,
      marginTop: "-4px",
    },
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.heading}>☕ Coffee Counter</h3>

      <div style={styles.container}>
        {/* Minus Button */}
        <button style={styles.btn} onClick={removeCup}>
          –
        </button>

        {/* Center */}
        <div style={styles.center}>
          <div style={styles.cupsEmoji}>
            {Array.from({ length: cups }).map((_, i) => "☕")}
          </div>

          <div style={styles.cupsNum}>{cups}</div>
          <div style={styles.label}>cups today</div>
        </div>

        {/* Plus Button */}
        <button style={styles.btn} onClick={addCup}>
          +
        </button>
      </div>
    </div>
  );
}
