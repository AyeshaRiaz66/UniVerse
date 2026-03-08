import StudyTimer from "./StudyTimer";
import TaskCard from "./TaskCard";

// New tools you will create
import Flashcards from "./Flashcards";
import AIBrainstormer from "./AIBrainstormer";

export default function Tools({ theme }) {
  const isDark = theme === "dark";

  return (
    <div style={{ marginTop: "25px" }}>

      {/* GRID LAYOUT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: "20px",
          alignItems: "start",
        }}
      >

        {/* LEFT SIDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/*  FLASHCARDS */}
          <Flashcards theme={theme} />

          {/* AI BRAINSTORMER */}
          <AIBrainstormer theme={theme} />
        </div>


        {/* RIGHT SIDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <StudyTimer theme={theme} />
          <TaskCard theme={theme} />
        </div>

      </div>
    </div>
  );
}
