import { useState, useEffect } from "react";

import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import Auth from "./components/Auth.jsx";
import Navbar from "./components/Navbar.jsx";
import TaskCard from "./components/TaskCard.jsx";
import StudyTimer from "./components/StudyTimer.jsx";
import MoodTracker from "./components/MoodTracker.jsx";
import DailyHabits from "./components/DailyHabits.jsx";
import Notes from "./components/Notes.jsx";
import SectionTabs from "./components/SectionTabs.jsx";
import Academic from "./components/Academic.jsx";
import Finance from "./components/Finance.jsx";
import Health from "./components/Health.jsx";
import Social from "./components/Social.jsx";
import Tools from "./components/Tools.jsx";
import AIBrainstormer from "./components/AIBrainstormer.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [theme, setTheme] = useState("dark");

  const [activeSection, setActiveSection] = useState(
    localStorage.getItem("universe_section") || "dashboard"
  );

  //  Firebase Auth + Load User Profile
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      console.log("AUTH CHECK:", currentUser);

      if (currentUser) {
        setUser(currentUser);

        try {
          const ref = doc(db, "users", currentUser.uid);
          const snap = await getDoc(ref);

          if (snap.exists()) {
            setUserData(snap.data());
          } else {
            setUserData({});
          }
        } catch (err) {
          console.error("Error loading user data:", err);
          setUserData({});
        }
      } else {
        setUser(null);
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  //  Load Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("universe_theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  //  Save Section + Scroll To Top
  useEffect(() => {
    localStorage.setItem("universe_section", activeSection);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSection]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("universe_theme", newTheme);
  };

  //  LOADING SCREEN
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            theme === "dark"
              ? "linear-gradient(180deg,#050c2c,#07103a,#0b0f3b)"
              : "linear-gradient(180deg,#ffffff,#d9e4ff,#bcd2ff)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "22px",
        }}
      >
        Please wait until we load your Universe...
      </div>
    );
  }

  // Show Auth Page Until Logged In
  if (!user) {
    return <Auth theme={theme} toggleTheme={toggleTheme} />;
  }

  const bg =
    theme === "dark"
      ? "linear-gradient(180deg,#050c2c,#07103a,#0b0f3b)"
      : "linear-gradient(180deg,#ffffff,#d9e4ff,#bcd2ff)";

  const sectionTitleMap = {
    dashboard: "Dashboard",
    academic: "Academic",
    finance: "Finance",
    health: "Health",
    social: "Social",
    tools: "Tools",
  };

  return (
    <>
      <style>
        {`
          html, body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            scroll-behavior: smooth;
          }
        `}
      </style>

      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          background: bg,
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          transition: "0.4s ease",
        }}
      >
        <div style={{ width: "1200px", maxWidth: "100%" }}>
          
          {/* NAVBAR */}
          <Navbar showLogout={true} theme={theme} toggleTheme={toggleTheme} />

          {/* SECTION TABS */}
          <SectionTabs
            theme={theme}
            active={activeSection}
            setActive={setActiveSection}
          />

          {/* GREETING */}
          <div
            style={{
              marginTop: "20px",
              padding: "18px",
              borderRadius: "18px",
              background:
                theme === "dark"
                  ? "linear-gradient(145deg,#0b1025,#0b1440)"
                  : "linear-gradient(145deg,#ffffff,#e8eeff)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: theme === "dark" ? "white" : "black",
            }}
          >
            <h2 style={{ margin: 0 }}>
              👋 Hello,{" "}
              <span style={{ color: "#c77dff" }}>
                {userData?.firstName 
                 || auth.currentUser?.displayName 
                 || auth.currentUser?.email?.split("@")[0] 
                || "Student"}

              </span>
            </h2>

            <p style={{ opacity: 0.8, marginTop: "6px" }}>
              Welcome to {sectionTitleMap[activeSection]} Section — stay
              productive and motivated! 🚀
            </p>
          </div>

          {/* DASHBOARD */}
          {activeSection === "dashboard" && (
            <div
              style={{
                marginTop: "25px",
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr",
                gap: "20px",
                alignItems: "start",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <TaskCard theme={theme} />
                <MoodTracker theme={theme} />
                <DailyHabits theme={theme} />
                
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <StudyTimer theme={theme} />
                <Notes theme={theme} />
                <AIBrainstormer theme={theme} /> 
              </div>
            </div>
          )}

          {/* OTHER SECTIONS */}
          {activeSection === "academic" && <Academic theme={theme} />}
          {activeSection === "finance" && <Finance theme={theme} />}
          {activeSection === "health" && <Health theme={theme} />}
          {activeSection === "social" && <Social theme={theme} />}
          {activeSection === "tools" && <Tools theme={theme} />}
        </div>
      </div>
    </>
  );
}

export default App;
