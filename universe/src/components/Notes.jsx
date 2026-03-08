import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";

export default function Notes({ theme = "dark" }) {
  const defaultText = `
# Study Notes

## Mathematics - Calculus


## Physics - Motion


---

## Quick Reminders


> "Education is the most powerful weapon which you can use to change the world."
- Nelson Mandela
`;

  const [text, setText] = useState(defaultText);
  const [isEditing, setIsEditing] = useState(false);

  const user = auth.currentUser;

  // LOAD NOTES 
  useEffect(() => {
    const loadNotes = async () => {
      if (!user) return;

      const ref = doc(db, "users", user.uid, "notes", "main");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setText(snap.data().content);
      }
    };

    loadNotes();
  }, []);

  // SAVE NOTES
  const saveNotes = async (value) => {
    if (!user) return;

    const ref = doc(db, "users", user.uid, "notes", "main");

    await setDoc(ref, {
      content: value,
      updatedAt: Date.now(),
    });
  };

  const handleChange = (value) => {
    setText(value);
    saveNotes(value);
  };

  //   UI STYLES
  const isDark = theme === "dark";

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
      width: "450px",
      transition: "0.3s",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
    },

    title: {
      color: isDark ? "#c77dff" : "#5e3bff",
      fontSize: "22px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },

    toggleBtn: {
      padding: "8px 18px",
      borderRadius: "16px",
      border: isDark
        ? "1px solid rgba(255,255,255,0.3)"
        : "1px solid rgba(0,0,0,0.4)",
      background: "transparent",
      color: isDark ? "white" : "black",
      cursor: "pointer",
    },

    box: {
      borderRadius: "14px",
      border: isDark
        ? "1px solid rgba(255,255,255,0.2)"
        : "1px solid rgba(0,0,0,0.25)",
      padding: "12px",
      height: "320px",
      overflowY: "auto",
      background: isDark
        ? "rgba(0,0,0,0.25)"
        : "rgba(0,0,0,0.08)",
      whiteSpace: "pre-wrap",
    },

    textarea: {
      width: "100%",
      height: "100%",
      background: "transparent",
      border: "none",
      outline: "none",
      color: isDark ? "white" : "black",
      resize: "none",
      fontSize: "14px",
    },

    tip: {
      marginTop: "8px",
      fontSize: "12px",
      color: isDark ? "#bbb" : "#555",
    },
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>📄 Notes</h2>

        <button
          style={styles.toggleBtn}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "👁 Preview" : "✏ Edit"}
        </button>
      </div>

      {/* Content */}
      <div style={styles.box}>
        {isEditing ? (
          <textarea
            style={styles.textarea}
            value={text}
            onChange={(e) => handleChange(e.target.value)}
          />
        ) : (
          <div style={{ fontSize: "14px" }}>{text}</div>
        )}
      </div>

      <p style={styles.tip}>💡 Notes auto-save & support Markdown</p>
    </div>
  );
}
