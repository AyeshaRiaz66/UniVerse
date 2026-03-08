import MoodTracker from "./MoodTracker";
import DailyHabits from "./DailyHabits";
import WaterIntake from "./WaterIntake";
import SleepQuality from "./SleepQuality";
import MealPlanner from "./MealPlanner";

export default function Health({ theme }) {
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
          <WaterIntake theme={theme} />
          <SleepQuality theme={theme} />
          <MealPlanner theme={theme} />
        </div>

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <MoodTracker theme={theme} />
          <DailyHabits theme={theme} />
        </div>
      </div>
    </div>
  );
}
