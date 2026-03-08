import StudyTimer from "./StudyTimer";
import Notes from "./Notes";
import GpaTracker from "./GpaTracker";
import Deadlines from "./Deadlines";
import QuickLinks from "./QuickLinks";   

export default function Academic({ theme }) {
  const isDark = theme === "dark";

  const cardStyle = {
    padding: "20px",
    borderRadius: "18px",
    background: isDark
      ? "linear-gradient(145deg,#0b1025,#0b1440)"
      : "linear-gradient(145deg,#ffffff,#e8eeff)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: isDark ? "white" : "black",
  };

  return (
    <div style={{ marginTop: "25px" }}>

      {/* ====== GRID LAYOUT ====== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.7fr 1fr",
          gap: "20px",
        }}
      >

        {/* LEFT SIDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* GPA TRACKER */}
          <GpaTracker theme={theme} />

          {/* DEADLINES */}
          <Deadlines theme={theme} />

          {/* QUICK LINKS */}
          <QuickLinks theme={theme} />
        </div>

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <StudyTimer theme={theme} />
          <Notes theme={theme} />
        </div>

      </div>
    </div>
  );
}
