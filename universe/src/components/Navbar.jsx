import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";   // ensure correct path

export default function Navbar({
  showLogout = false,
  theme = "dark",
  toggleTheme,
}) {
  const isDark = theme === "dark";

  const handleLogout = async () => {
    try {
      await signOut(auth);

      
      localStorage.removeItem("universe_section");

      
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const styles = {
    nav: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 18px",
      borderRadius: "18px",
      background: isDark
        ? "linear-gradient(145deg,#0b1025,#0b1440)"
        : "linear-gradient(145deg,#ffffff,#dfe7ff,#cbd8ff)",
      boxShadow: isDark
        ? "0 0 25px rgba(124,77,255,0.25)"
        : "0 0 25px rgba(100,120,255,0.35)",
      border: "1px solid rgba(255,255,255,0.15)",
      color: isDark ? "white" : "black",
      transition: "0.3s",
    },

    left: { display: "flex", alignItems: "center", gap: "12px" },

    logoBox: {
      width: "48px",
      height: "48px",
      borderRadius: "14px",
      background: isDark
        ? "linear-gradient(145deg,#7c4dff,#b26bff)"
        : "linear-gradient(145deg,#4a6cff,#8aa4ff)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "22px",
    },

    title: { fontSize: "24px", fontWeight: "bold" },

    subtitle: {
      fontSize: "12px",
      opacity: 0.7,
      marginTop: "-4px",
    },

    right: { display: "flex", gap: "14px", alignItems: "center" },

    roundBtn: {
      width: "42px",
      height: "42px",
      borderRadius: "50%",
      border: "1px solid rgba(255,255,255,0.3)",
      background: isDark
        ? "linear-gradient(145deg,#0b1025,#0b1440)"
        : "linear-gradient(145deg,#ffffff,#dfe6ff)",
      color: isDark ? "white" : "black",
      fontSize: "20px",
      cursor: "pointer",
      transition: "0.3s",
    },
  };

  return (
    <div style={styles.nav}>
      {/* LEFT */}
      <div style={styles.left}>
        <div style={styles.logoBox}>✨</div>

        <div>
          <div style={styles.title}>UniVerse</div>
          <div style={styles.subtitle}>Your Student Productivity Hub</div>
        </div>
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        {/* THEME BUTTON */}
        <button style={styles.roundBtn} onClick={toggleTheme}>
          {isDark ? "🌞" : "🌙"}
        </button>

        {/* LOGOUT BUTTON */}
        {showLogout && (
          <button
            style={styles.roundBtn}
            title="Logout"
            onClick={handleLogout}
          >
            ⏻
          </button>
        )}
      </div>
    </div>
  );
}
