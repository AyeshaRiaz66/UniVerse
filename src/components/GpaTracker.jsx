import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function GpaTracker({ theme = "dark" }) {
  const isDark = theme === "dark";

  const [currentGpa, setCurrentGpa] = useState(3.7);
  const [targetGpa, setTargetGpa] = useState(4.0);

  const user = auth.currentUser;
  const progress = Math.min(Math.round((currentGpa / targetGpa) * 100), 100);

  //  LOAD GPA FROM FIRESTORE
  useEffect(() => {
    const loadGpa = async () => {
      if (!user) return;

      const ref = doc(db, "users", user.uid, "academic", "gpa");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setCurrentGpa(data.currentGpa || 0);
        setTargetGpa(data.targetGpa || 4.0);
      }
    };

    loadGpa();
  }, []);

  //  SAVE GPA TO FIRESTORE
  const saveGpa = async (updatedData) => {
    if (!user) return;

    const ref = doc(db, "users", user.uid, "academic", "gpa");

    await setDoc(ref, {
      currentGpa,
      targetGpa,
      ...updatedData,
      updatedAt: Date.now(),
    });
  };

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "18px",
        background: isDark
          ? "linear-gradient(145deg,#0b1025,#0b1440)"
          : "linear-gradient(145deg,#ffffff,#dae3ff)",
        border: "1px solid rgba(255,255,255,0.18)",
        color: isDark ? "white" : "black",
      }}
    >
      {/* TITLE */}
      <h2
        style={{
          fontSize: "20px",
          color: "#9d8bff",
          marginBottom: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        🎓 GPA Tracker
      </h2>

      {/* TOP ROW */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "18px",
        }}
      >
        {/* LEFT - CURRENT GPA */}
        <div>
          <p style={{ fontSize: "14px", marginBottom: "6px" }}>
            Current GPA
          </p>

          <div
            style={{
              width: "70px",
              height: "55px",
              borderRadius: "12px",
              background: "linear-gradient(145deg,#7c4dff,#b26bff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            <input
              type="number"
              min={0}
              max={4}
              step="0.1"
              value={currentGpa}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setCurrentGpa(value);
                saveGpa({ currentGpa: value });
              }}
              style={{
                width: "65px",
                background: "transparent",
                border: "none",
                color: "white",
                textAlign: "center",
                fontSize: "20px",
                fontWeight: "bold",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* RIGHT – TARGET GPA */}
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "14px", marginBottom: "6px" }}>Target</p>

          <input
            type="number"
            min={0}
            max={4}
            step="0.1"
            value={targetGpa}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setTargetGpa(value);
              saveGpa({ targetGpa: value });
            }}
            style={{
              width: "70px",
              background: "transparent",
              border: "none",
              fontSize: "28px",
              fontWeight: "bold",
              color: isDark ? "white" : "black",
              textAlign: "right",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* PROGRESS BAR TITLE */}
      <p style={{ fontSize: "14px", marginBottom: "8px" }}>Progress</p>

      {/* BAR */}
      <div
        style={{
          width: "100%",
          height: "12px",
          borderRadius: "50px",
          background: "rgba(255,255,255,0.15)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "linear-gradient(90deg,#7c4dff,#b26bff)",
            transition: "0.4s",
          }}
        ></div>
      </div>

      {/* PERCENT TEXT */}
      <p
        style={{
          textAlign: "right",
          marginTop: "5px",
          fontSize: "13px",
          opacity: 0.85,
        }}
      >
        {progress}%
      </p>
    </div>
  );
}
