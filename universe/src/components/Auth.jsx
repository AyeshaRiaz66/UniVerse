import { useState } from "react";
import Navbar from "./Navbar.jsx";

import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";

export default function Auth({ theme = "dark", toggleTheme }) {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isDark = theme === "dark";

  const styles = {
    page: {
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: isDark
        ? "linear-gradient(180deg,#050c2c,#07103a,#0b0f3b)"
        : "linear-gradient(180deg,#ffffff,#d9e4ff,#bcd2ff)",
      color: isDark ? "white" : "black",
      transition: "0.3s",
    },
    centerBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      marginTop: "40px",
    },
    card: {
      width: "480px",
      padding: "28px",
      borderRadius: "18px",
      background: isDark
        ? "linear-gradient(145deg,#0b1025,#0b1440)"
        : "linear-gradient(145deg,#ffffff,#e8eeff)",
      border: "1px solid rgba(255,255,255,0.18)",
      transition: "0.3s",
    },
    heading: {
      fontSize: "28px",
      marginBottom: "10px",
      color: isDark ? "#c77dff" : "#5e3bff",
    },
    welcome: {
      fontSize: "15px",
      opacity: 0.9,
      marginBottom: "14px",
      lineHeight: "22px",
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "14px",
      border: isDark
        ? "1px solid rgba(255,255,255,0.3)"
        : "1px solid rgba(0,0,0,0.4)",
      background: "transparent",
      color: isDark ? "white" : "black",
      outline: "none",
      marginTop: "10px",
    },
    button: {
      width: "100%",
      padding: "12px",
      marginTop: "18px",
      borderRadius: "14px",
      border: "none",
      cursor: "pointer",
      background: "linear-gradient(145deg,#7c4dff,#b26bff)",
      color: "white",
      fontSize: "17px",
    },
    toggle: {
      marginTop: "15px",
      textAlign: "center",
      cursor: "pointer",
      color: "#b9a6ff",
      fontSize: "14px",
    },
  };

  // LOGIN
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email & password");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  // SIGNUP
  const handleSignup = async () => {
    if (!email || !password || !firstName || !lastName) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      
      await updateProfile(res.user, {
        displayName: `${firstName} ${lastName}`,
      });

      
      await setDoc(doc(db, "users", res.user.uid), {
        firstName,
        lastName,
        email,
        createdAt: new Date(),
      });

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <style>
        {`
          html, body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            background: transparent;
          }
        `}
      </style>

      <div style={styles.page}>
        {/* Navbar */}
        <div style={{ width: "1200px", maxWidth: "100%", marginTop: "15px" }}>
          <Navbar showLogout={false} theme={theme} toggleTheme={toggleTheme} />
        </div>

        {/* Auth Box */}
        <div style={styles.centerBox}>
          <div style={styles.card}>
            <h2 style={styles.heading}>
              {isLogin ? "Welcome to UniVerse 👋" : "Create Your Account ✨"}
            </h2>

            <p style={styles.welcome}>
              Your all-in-one student productivity hub to manage tasks,
              track habits, study smart, and stay motivated.
            </p>

            {!isLogin && (
              <>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </>
            )}

            <input
              style={styles.input}
              type="email"
              placeholder="Email..."
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              style={styles.input}
              type="password"
              placeholder="Password..."
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              style={styles.button}
              onClick={isLogin ? handleLogin : handleSignup}
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>

            <p style={styles.toggle} onClick={() => setIsLogin(!isLogin)}>
              {isLogin
                ? "Don't have an account? Create Account"
                : "Already registered? Login"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
