import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function WaterIntake({ theme = "dark" }) {
  const isDark = theme === "dark";

  const MAX_GLASSES = 8;
  const [glasses, setGlasses] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  //  Load From Firebase
  useEffect(() => {
    const fetchWater = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid, "trackers", "water");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        // Reset if it's a new day
        if (data.date === today) {
          setGlasses(data.glasses || 0);
        } else {
          await setDoc(ref, { glasses: 0, date: today });
          setGlasses(0);
        }
      } else {
        await setDoc(ref, { glasses: 0, date: today });
        setGlasses(0);
      }
    };

    fetchWater();
  }, []);

  // Save to Firebase
  const saveWater = async (value) => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid, "trackers", "water");

    await setDoc(ref, {
      glasses: value,
      date: today,
    });
  };

  const addWater = async () => {
    setGlasses((prev) => {
      if (prev >= MAX_GLASSES) return prev;

      const newVal = prev + 1;
      saveWater(newVal);
      return newVal;
    });
  };

  const waterHeight = (glasses / MAX_GLASSES) * 100;

  const card = {
    padding: "20px",
    borderRadius: "18px",
    background: isDark
      ? "linear-gradient(145deg,#0b1025,#0b1440)"
      : "linear-gradient(145deg,#ffffff,#e8eeff)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: isDark ? "white" : "black",
  };

  return (
    <div style={card}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <h3 style={{ color: "#4fb8ff" }}>💧 Water Intake</h3>
        <span style={{ opacity: 0.8 }}>
          {glasses} / {MAX_GLASSES} glasses
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: "18px",
          marginTop: "10px",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "160px",
            borderRadius: "26px",
            border: "2px solid rgba(255,255,255,0.2)",
            overflow: "hidden",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: `${waterHeight}%`,
              transition: "0.4s",
              background:
                "linear-gradient(180deg,#4fd6ff,#52b5ff,#4485ff,#3f5bff)",
            }}
          />
        </div>

        <button
          onClick={addWater}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            color: "white",
            background: "linear-gradient(145deg,#7c4dff,#b26bff)",
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
