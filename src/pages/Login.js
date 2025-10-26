import React, { useState } from "react";
import "../styles/Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("⚠️ Please fill both fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("loginTime", Date.now());
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        window.location.href = "/dashboard";
      } else {
        setError(`❌ ${data.message || "Invalid credentials."}`);
      }
    } catch (err) {
      console.error(err);
      setError("⚠️ Server not reachable.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
          alt="Login Icon"
          className="login-icon"
        />
        <h2>Administrator Login Portal</h2>
        <p className="login-subtext">
          Please enter your <strong>Username</strong> and <strong>Password</strong> to Login
        </p>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <div className="error-message">{error}</div>}
      </div>

      
    </div>
  );
}
