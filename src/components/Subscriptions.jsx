import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function Subscriptions({ theme = "dark" }) {
  const isDark = theme === "dark";

  const [subs, setSubs] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const user = auth.currentUser;

  //  LOAD DATA
  useEffect(() => {
    const loadSubscriptions = async () => {
      if (!user) return;

      const ref = collection(db, "users", user.uid, "subscriptions");
      const snapshot = await getDocs(ref);

      setSubs(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    loadSubscriptions();
  }, [user]);

  // ADD SUBSCRIPTION
  const addSub = async () => {
    if (!newName || !newPrice)
      return alert("Enter subscription name & price");

    const ref = collection(db, "users", user.uid, "subscriptions");

    const newSub = {
      name: newName,
      price: parseFloat(newPrice),
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      createdAt: Date.now(),
    };

    const res = await addDoc(ref, newSub);

    setSubs([...subs, { id: res.id, ...newSub }]);

    setNewName("");
    setNewPrice("");
  };

  // DELETE SUBSCRIPTION
  const removeSub = async (id) => {
    const ref = doc(db, "users", user.uid, "subscriptions", id);
    await deleteDoc(ref);
    setSubs(subs.filter(s => s.id !== id));
  };

  //  Month Info
  const today = new Date();
  const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysLeft = totalDays - today.getDate();

  //  UI Styles
  const styles = {
    card: {
      padding: "20px",
      borderRadius: "18px",
      background: isDark
        ? "linear-gradient(145deg,#0b1025,#0b1440)"
        : "linear-gradient(145deg,#ffffff,#e8eeff)",
      border: "1px solid rgba(255,255,255,0.15)",
      color: isDark ? "white" : "black",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
    },

    title: {
      fontSize: "18px",
      color: "#a675ff",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },

    badge: {
      padding: "6px 14px",
      borderRadius: "8px",
      background: "linear-gradient(145deg,#7c4dff,#b26bff)",
      fontSize: "12px",
    },

    list: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },

    subItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 16px",
      borderRadius: "16px",
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.15)",
    },

    left: { display: "flex", alignItems: "center", gap: "10px" },

    icon: (color) => ({
      width: "35px",
      height: "35px",
      borderRadius: "50%",
      background: color,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontWeight: "bold",
      color: "white",
    }),

    removeBtn: {
      background: "transparent",
      border: "none",
      color: "#ff5b5b",
      cursor: "pointer",
      fontSize: "18px",
    },

    addBox: {
      marginTop: "12px",
      padding: "12px",
      borderRadius: "14px",
      border: "1px dashed rgba(255,255,255,0.3)",
      display: "flex",
      gap: "10px",
    },

    input: {
      flex: 1,
      padding: "8px",
      borderRadius: "8px",
      border: "none",
      outline: "none",
      background: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
      color: isDark ? "white" : "black",
    },

    addBtn: {
      padding: "8px 16px",
      borderRadius: "10px",
      border: "none",
      background: "linear-gradient(145deg,#7c4dff,#b26bff)",
      color: "white",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>📄 Subscriptions</h3>
        <div style={styles.badge}>
          Monthly • {daysLeft} days left
        </div>
      </div>

      <div style={styles.list}>
        {subs.map(s => (
          <div key={s.id} style={styles.subItem}>
            <div style={styles.left}>
              <div style={styles.icon(s.color)}>
                {s.name.charAt(0)}
              </div>

              <div>
                <p style={{ margin: 0 }}>{s.name}</p>
                <span style={{ fontSize: "12px", opacity: 0.7 }}>
                  monthly
                </span>
              </div>
            </div>

            <div>
              <strong>Rs {s.price}</strong>
              <button
                style={styles.removeBtn}
                onClick={() => removeSub(s.id)}
              >
                ✖
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.addBox}>
        <input
          style={styles.input}
          placeholder="Subscription name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Price (Rs)"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />

        <button style={styles.addBtn} onClick={addSub}>
          + Add
        </button>
      </div>
    </div>
  );
}
