// src/pages/Login.jsx

import { useState } from "react"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulasi login sederhana
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        window.location.href = "/"
      } else {
        setError("Username atau password salah!")
        setLoading(false)
      }
    }, 800)
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Logo / Header */}
        <div style={styles.header}>
          <div style={styles.iconBox}>💰</div>
          <h1 style={styles.title}>Selamat Datang Di</h1>
          <p style={styles.subtitle}>Webiste Keuangan Orgata</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              style={styles.input}
              required
            />
          </div>

          {error && <p style={styles.error}>⚠️ {error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p style={styles.hint}>Demo: admin / admin123</p>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "20px",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  iconBox: {
    fontSize: "48px",
    marginBottom: "12px",
  },
  title: {
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "700",
    margin: "0 0 6px 0",
    letterSpacing: "1px",
  },
  subtitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "14px",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  input: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#ffffff",
    fontSize: "15px",
    outline: "none",
    transition: "border 0.2s",
  },
  error: {
    color: "#ff6b6b",
    fontSize: "13px",
    margin: "0",
    textAlign: "center",
  },
  button: {
    background: "linear-gradient(135deg, #e94560, #c23152)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "14px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    letterSpacing: "0.5px",
    marginTop: "4px",
    transition: "opacity 0.2s",
  },
  hint: {
    color: "rgba(255,255,255,0.3)",
    fontSize: "12px",
    textAlign: "center",
    marginTop: "20px",
    marginBottom: 0,
  },
}
