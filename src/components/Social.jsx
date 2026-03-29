import MoodTracker from "./MoodTracker";
import Notes from "./Notes";

import SocialBattery from "./SocialBattery";
import TodaysWin from "./TodaysWin";
import CoffeeCounter from "./CoffeeCounter";

export default function Social({ theme }) {
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
          
          {/*  SOCIAL BATTERY */}
          <SocialBattery theme={theme} />

          {/* TODAY'S WIN */}
          <TodaysWin theme={theme} />

          {/* COFFEE COUNTER */}
          <CoffeeCounter theme={theme} />
        </div>

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <MoodTracker theme={theme} />
          <Notes theme={theme} />
        </div>

      </div>
    </div>
  );
}
