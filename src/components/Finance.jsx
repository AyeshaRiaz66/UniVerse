import TaskCard from "./TaskCard";
import DailyHabits from "./DailyHabits";
import WeeklyBudget from "./WeeklyBudget";
import Subscriptions from "./Subscriptions";

export default function Finance({ theme }) {
  const isDark = theme === "dark";

  return (
    <div style={{ marginTop: "25px" }}>

      {/* GRID LAYOUT  */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "20px",
          alignItems: "start",
        }}
      >

        {/* LEFT SIDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/*  WEEKLY BUDGET */}
          <WeeklyBudget theme={theme} />

          {/*  SUBSCRIPTIONS */}
          <Subscriptions theme={theme} />
        </div>

        {/*  RIGHT SIDE  */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/*  REUSED COMPONENTS */}
          <TaskCard theme={theme} />
          <DailyHabits theme={theme} />
        </div>

      </div>
    </div>
  );
}
