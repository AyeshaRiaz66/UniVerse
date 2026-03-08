import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function TaskCard({ theme = "dark" }) {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const user = auth.currentUser;
  const isDark = theme === "dark";

  // REAL-TIME LOAD TASKS
  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "tasks");

    const unsub = onSnapshot(ref, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setTasks(list);
    });

    return () => unsub();
  }, [user]);

  //  ADD TASK
  const addTask = async () => {
    if (!input.trim()) return;
    if (!user) return;

    await addDoc(collection(db, "users", user.uid, "tasks"), {
      text: input,
      completed: false,
      createdAt: new Date(),
    });

    setInput("");
  };

  //  TOGGLE TASK
  const toggleTask = async (task) => {
    await updateDoc(
      doc(db, "users", user.uid, "tasks", task.id),
      { completed: !task.completed }
    );
  };

  //  DELETE TASK
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "tasks", id));
  };

  //  UI STYLES
  const styles = {
    card: {
      padding: "20px",
      borderRadius: "18px",
      background: isDark
        ? "linear-gradient(145deg,#0b1025,#0b1440)"
        : "linear-gradient(145deg,#ffffff,#dfe7ff,#cbd8ff)",
      border: "1px solid rgba(255,255,255,0.15)",
      color: isDark ? "white" : "black",
      transition: "0.3s",
    },
    heading: {
      color: "#c77dff",
      marginBottom: "16px",
      fontSize: "26px",
      fontWeight: "600",
    },
    row: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginTop: "12px",
    },
    input: {
      flex: 1,
      padding: "14px",
      borderRadius: "30px",
      border: "1px solid rgba(255,255,255,0.2)",
      background: "transparent",
      color: "white",
      outline: "none",
      fontSize: "16px",
    },
    addBtn: {
      width: "55px",
      height: "55px",
      borderRadius: "50%",
      border: "none",
      background: "linear-gradient(145deg,#8a4dff,#c26bff)",
      color: "white",
      fontSize: "28px",
      cursor: "pointer",
    },
    task: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "12px",
      padding: "14px",
      borderRadius: "16px",
      border: "1px solid rgba(255,255,255,0.15)",
      background: "rgba(255,255,255,0.05)",
    },
    left: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      cursor: "pointer",
    },
    circle: (done) => ({
      width: "22px",
      height: "22px",
      borderRadius: "50%",
      border: done ? "6px solid #bb86ff" : "2px solid #bb86ff",
    }),
    text: (done) => ({
      textDecoration: done ? "line-through" : "none",
      color: done ? "#888" : "white",
    }),
    delete: {
      cursor: "pointer",
      fontSize: "22px",
    },
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.heading}>Tasks</h2>

      {/* Show All Tasks */}
      {tasks.map((task) => (
        <div key={task.id} style={styles.task}>
          <div
            style={styles.left}
            onClick={() => toggleTask(task)}
          >
            <div style={styles.circle(task.completed)}></div>
            <span style={styles.text(task.completed)}>
              {task.text}
            </span>
          </div>

          <span
            style={styles.delete}
            onClick={() => deleteTask(task.id)}
          >
            🗑️
          </span>
        </div>
      ))}

      {/* Input Row */}
      <div style={styles.row}>
        <input
          style={styles.input}
          placeholder="Add a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />

        <button style={styles.addBtn} onClick={addTask}>
          +
        </button>
      </div>
    </div>
  );
}
