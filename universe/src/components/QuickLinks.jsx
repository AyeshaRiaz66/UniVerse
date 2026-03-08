export default function QuickLinks({ theme = "dark" }) {
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

  const heading = {
    color: "#c77dff",
    fontSize: "22px",
    marginBottom: "14px",
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "20px",
  };

  const box = {
    padding: "18px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: isDark
      ? "rgba(255,255,255,0.06)"
      : "rgba(0,0,0,0.06)",
    textAlign: "center",
    cursor: "pointer",
    transition: "0.3s",
  };

  const label = {
    marginTop: "8px",
    fontSize: "14px",
  };

  const iconCircle = (bg) => ({
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    fontSize: "22px",
    color: "white",
    background: bg,
  });

  const links = [
    {
      name: "Library",
      icon: "📖",
      color: "linear-gradient(145deg,#ff5cd1,#b26bff)",
      url: "https://openlibrary.org/",
    },
    {
      name: "Portal",
      icon: "📘",
      color: "linear-gradient(145deg,#4facfe,#00f2fe)",
      url: "https://lms.ist.edu.pk/login/index.php?loginredirect=1",
    },
    {
      name: "Docs",
      icon: "📄",
      color: "linear-gradient(145deg,#00c851,#00ffa3)",
      url: "https://docs.google.com/",
    },
    {
      name: "LMS",
      icon: "🌐",
      color: "linear-gradient(145deg,#ff6a00,#ff3c00)",
      url: "https://lms.ist.edu.pk/login/index.php?loginredirect=1",
    },
  ];

  const openLink = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div style={cardStyle}>
      <h2 style={heading}>Quick Links</h2>

      <div style={grid}>
        {links.map((link) => (
          <div
            key={link.name}
            style={box}
            onClick={() => openLink(link.url)}
          >
            <div style={iconCircle(link.color)}>{link.icon}</div>
            <p style={label}>{link.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
