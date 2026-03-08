import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Deadlines({ theme = "dark" }) {
  const isDark = theme === "dark";

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDate, setNewDate] = useState("");

  const user = auth.currentUser;

  //  GET DAYS LEFT
  const getDaysLeft = (date) => {
    const today = new Date();
    const due = new Date(date);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  //  LOAD DEADLINES
  useEffect(() => {
    const loadDeadlines = async () => {
      if (!user) return;

      const ref = doc(db, "users", user.uid, "academic", "deadlines");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setTasks(snap.data().tasks || []);
      }
    };

    loadDeadlines();
  }, []);

  //  SAVE DEADLINES
  const saveDeadlines = async (updatedTasks) => {
    if (!user) return;

    const ref = doc(db, "users", user.uid, "academic", "deadlines");
    await setDoc(ref, {
      tasks: updatedTasks,
      updatedAt: Date.now(),
    });

    setTasks(updatedTasks);
  };

  // ADD TASK
  const addTask = async () => {
    if (!newTask || !newDate) return alert("Enter task & date");

    const updated = [
      ...tasks,
      { id: Date.now(), title: newTask, date: newDate }
    ];

    await saveDeadlines(updated);

    setNewTask("");
    setNewDate("");
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    const updated = tasks.filter(t => t.id !== id);
    await saveDeadlines(updated);
  };

  // Styles
  const cardStyle = {
    padding: "20px",
    borderRadius: "18px",
    background: isDark
      ? "linear-gradient(145deg,#0b1025,#0b1440)"
      : "linear-gradient(145deg,#ffffff,#e8eeff)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: isDark ? "white" : "black",
  };

  const taskBox = {
    padding: "18px",
    borderRadius: "18px",
    marginBottom: "14px",
    background: isDark
      ? "rgba(255,255,255,0.06)"
      : "rgba(0,0,0,0.06)",
    border: "1px solid rgba(255,255,255,0.2)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  return (
    <div style={cardStyle}>
      <h3 style={{ color: "#a970ff", marginBottom: "10px" }}>
        ⏰ Deadlines
      </h3>

      {/* ------- ADD SECTION ------- */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
        <input
          placeholder="Enter assignment..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{
            flex: 1,
            borderRadius: "10px",
            padding: "10px",
            border: "none",
            outline: "none",
          }}
        />

        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          style={{
            borderRadius: "10px",
            padding: "10px",
            border: "none",
            outline: "none",
          }}
        />

        <button
          onClick={addTask}
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            border: "none",
            background: "#b26bff",
            color: "white",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {/* ------- DEADLINE LIST ------- */}
      {tasks.map((t) => {
        const days = getDaysLeft(t.date);

        const color =
          days <= 3 ? "red" :
          days <= 7 ? "orange" :
          "lightgreen";

        return (
          <div key={t.id} style={taskBox}>
            <div>
              <strong>{t.title}</strong>
              <p style={{ opacity: 0.7 }}>
                Due on {t.date}
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <h3 style={{ color }}>
                {days > 0 ? days : 0}
              </h3>
              <p style={{ opacity: 0.7 }}>days left</p>

              {/* Delete Button */}
              <button
                onClick={() => deleteTask(t.id)}
                style={{
                  marginTop: "6px",
                  background: "transparent",
                  border: "none",
                  color: "tomato",
                  cursor: "pointer",
                }}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
