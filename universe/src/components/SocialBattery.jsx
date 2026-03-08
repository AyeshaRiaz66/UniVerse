import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function SocialBattery({ theme = "dark" }) {
  const isDark = theme === "dark";

  const [battery, setBattery] = useState(60);

  //  Load Battery from Firebase
  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid, "trackers", "socialBattery");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setBattery(snap.data().battery);
      } else {
        await setDoc(ref, { battery: 60 });
      }
    };

    load();
  }, []);

  //  Save Battery to Firebase
  const saveBattery = async (val) => {
    setBattery(val);
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid, "trackers", "socialBattery");
    await setDoc(ref, { battery: val });
  };

  // Battery Text Logic
  const getLabel = () => {
    if (battery <= 30) return { text: "Low", color: "#ff4d4d" };
    if (battery <= 60) return { text: "Moderate", color: "#ffa500" };
    if (battery <= 80) return { text: "Social", color: "#4dd964" };
    return { text: "Super Social", color: "#6bff6b" };
  };

  const level = getLabel();

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

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },

    badge: {
      background: level.color,
      padding: "6px 14px",
      borderRadius: "20px",
      color: "white",
      fontWeight: "bold",
      fontSize: "13px",
    },

    percent: {
      fontSize: "38px",
      fontWeight: "bold",
      marginTop: "8px",
    },

    barWrap: {
      marginTop: "12px",
      position: "relative",
    },

    barBg: {
      width: "100%",
      height: "12px",
      borderRadius: "40px",
      background: "rgba(255,255,255,0.25)",
      overflow: "hidden",
      position: "relative",
    },

    barFill: {
      height: "100%",
      width: `${battery}%`,
      background: "linear-gradient(90deg,#b6ff00,#7aff00,#5569ff)",
      transition: "0.2s",
    },

    pointer: {
      position: "absolute",
      left: `${battery}%`,
      top: "-6px",
      width: "18px",
      height: "18px",
      borderRadius: "50%",
      background: "#ffffff",
      border: "2px solid #7c4dff",
      transform: "translateX(-50%)",
      transition: "0.2s",
    },

    labels: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "12px",
      opacity: 0.8,
      marginTop: "6px",
    },

    slider: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "12px",
      opacity: 0,          
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={{ color: "#a675ff" }}>📱 Social Battery</h3>
        <span style={styles.badge}>{level.text}</span>
      </div>

      <p style={styles.percent}>{battery}%</p>

      {/* BAR WITH DRAG CONTROL */}
      <div style={styles.barWrap}>
        <div style={styles.barBg}>
          <div style={styles.barFill}></div>
          <div style={styles.pointer}></div>

          {/* Invisible draggable slider */}
          <input
            type="range"
            min="0"
            max="100"
            value={battery}
            style={styles.slider}
            onChange={(e) => saveBattery(Number(e.target.value))}
          />
        </div>

        <div style={styles.labels}>
          <span>Introverted</span>
          <span>Balanced</span>
          <span>Extroverted</span>
        </div>
      </div>
    </div>
  );
}
