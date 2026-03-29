import { useState } from "react";

export default function Flashcards({ theme = "dark" }) {
  const isDark = theme === "dark";

  const cards = [
    // ------------------ WEB DEVELOPMENT ------------------
    { question: "What does HTML stand for?", answer: "HyperText Markup Language" },
    { question: "What does CSS stand for?", answer: "Cascading Style Sheets" },
    { question: "What is React?", answer: "A JavaScript library for building user interfaces" },
    { question: "What is JSX?", answer: "A syntax extension for JavaScript used in React" },
    { question: "What does DOM stand for?", answer: "Document Object Model" },
    { question: "What is a REST API?", answer: "An API style using HTTP requests for CRUD operations" },
    { question: "What is a responsive website?", answer: "A website that adapts to different screen sizes" },
    { question: "What is Bootstrap?", answer: "A CSS framework for building responsive web pages" },
    { question: "What is JavaScript used for?", answer: "To add interactivity to web pages" },
    { question: "What is a Framework?", answer: "A reusable code structure to simplify development" },

    // ------------------ MOBILE APP DEVELOPMENT ------------------
    { question: "What is Android Studio?", answer: "Official IDE for Android development" },
    { question: "What language is used for Android apps?", answer: "Java & Kotlin" },
    { question: "What language is used for iOS apps?", answer: "Swift" },
    { question: "What is Flutter?", answer: "A UI toolkit by Google for cross-platform apps" },
    { question: "What is React Native?", answer: "A framework to build native mobile apps using React" },
    { question: "What is APK?", answer: "Android Application Package" },
    { question: "What is Gradle?", answer: "Build automation tool for Android" },
    { question: "What is an Activity in Android?", answer: "A single screen with UI" },
    { question: "What is an Intent in Android?", answer: "A messaging object to request actions" },
    { question: "What is Firebase?", answer: "A backend platform for authentication & database" },

    // ------------------ OPERATING SYSTEMS ------------------
    { question: "What is an Operating System?", answer: "Software that manages computer hardware and software" },
    { question: "What is a Process?", answer: "A program in execution" },
    { question: "What is Multitasking?", answer: "Running multiple processes simultaneously" },
    { question: "What is Deadlock?", answer: "A situation where processes wait forever for resources" },
    { question: "What is Scheduling?", answer: "Process of deciding order of execution" },
    { question: "What is Virtual Memory?", answer: "Technique to use disk as extension of RAM" },
    { question: "What is a Kernel?", answer: "Core part of OS managing system resources" },
    { question: "What is a Thread?", answer: "Smallest unit of execution in a process" },
    { question: "What is Paging?", answer: "Memory management technique" },
    { question: "Example of OS?", answer: "Windows, Linux, macOS, Android" },

    // ------------------ COMPUTER ARCHITECTURE ------------------
    { question: "What is CPU?", answer: "Central Processing Unit" },
    { question: "What is ALU?", answer: "Arithmetic Logic Unit" },
    { question: "What is Control Unit?", answer: "Manages execution of instructions" },
    { question: "What is RAM?", answer: "Random Access Memory (Volatile Memory)" },
    { question: "What is ROM?", answer: "Read Only Memory (Non-Volatile)" },
    { question: "What is Cache Memory?", answer: "High-speed memory between CPU and RAM" },
    { question: "What is a Register?", answer: "Smallest and fastest memory in CPU" },
    { question: "What is a Bus?", answer: "A communication pathway between components" },
    { question: "What is Clock Speed?", answer: "Speed at which CPU executes instructions" },
    { question: "What is Pipeline?", answer: "Technique to execute multiple instructions simultaneously" },

    // ------------------ EXTRA GENERAL TECH ------------------
    { question: "What is Git?", answer: "A version control system" },
    { question: "What is GitHub?", answer: "A platform to host git repositories" },
    { question: "What is Cloud Computing?", answer: "Delivery of computing services over the internet" },
    { question: "What is AI?", answer: "Simulation of human intelligence in machines" },
  ];

  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const nextCard = () => {
    setShowAnswer(false);
    setIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setShowAnswer(false);
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const card = cards[index];

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "18px",
        background: isDark
          ? "linear-gradient(145deg,#0b1025,#0b1440)"
          : "linear-gradient(145deg,#ffffff,#e8eeff)",
        border: "1px solid rgba(255,255,255,0.15)",
        color: isDark ? "white" : "black",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          fontSize: "18px",
          color: "#a675ff",
        }}
      >
        <span>📖 Flashcards</span>
        <span style={{ opacity: 0.8 }}>
          {index + 1} / {cards.length}
        </span>
      </div>

      {/* Card */}
      <div
        style={{
          height: "170px",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        {showAnswer ? card.answer : card.question}
      </div>

      {/* Bottom Controls */}
      <div
        style={{
          marginTop: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >

        {/* Previous */}
        <button
          onClick={prevCard}
          style={{
            padding: "8px 16px",
            borderRadius: "20px",
            border: "none",
            background: "linear-gradient(145deg,#7c4dff,#b26bff)",
            color: "white",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          ⬅ Previous
        </button>

        {/* Show Answer */}
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          style={{
            background: "transparent",
            border: "none",
            color: isDark ? "white" : "black",
            fontSize: "14px",
            cursor: "pointer",
            opacity: 0.9,
          }}
        >
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </button>

        {/* Next */}
        <button
          onClick={nextCard}
          style={{
            padding: "8px 18px",
            borderRadius: "20px",
            border: "none",
            background: "linear-gradient(145deg,#7c4dff,#b26bff)",
            color: "white",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Next ➤
        </button>
      </div>
    </div>
  );
}
