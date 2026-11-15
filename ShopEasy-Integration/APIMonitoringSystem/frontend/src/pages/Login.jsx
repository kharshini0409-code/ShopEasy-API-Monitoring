
import { useState } from "react";
import api from "../services/api";
import "./Login.css";

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isRegister) {
        // Register new user
        await api.post("/api/auth/register", {
          name,
          email,
          password
        });

        setSuccess("Account created successfully! Please log in.");

        setIsRegister(false);
        setName("");
        setPassword("");

      } else {
        // Login existing user
        const response = await api.post("/api/auth/login", {
          email,
          password
        });

        const token =
          response.data.token ||
          response.data.accessToken ||
          response.data.jwtToken;

        if (!token) {
          throw new Error("JWT token not found in response.");
        }

        localStorage.setItem("token", token);
        onLogin();
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <form className="login-card" onSubmit={handleSubmit}>

        <div className="login-logo">
          <h1>API Monitor</h1>

          <p>
            {isRegister
              ? "Create your account to get started"
              : "Welcome back! Sign in to continue."}
          </p>
        </div>

        {isRegister && (
          <div className="login-form-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="login-form-group">
          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="login-form-group">
          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>

        {error && (
          <div className="login-error">
            {typeof error === "string" ? error : JSON.stringify(error)}
          </div>
        )}

        {success && (
          <div className="login-success">
            {success}
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : isRegister
              ? "Create Account"
              : "Sign In"}
        </button>

        <div className="login-toggle">
          {isRegister
            ? "Already have an account?"
            : "New user?"}

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setSuccess("");
            }}
          >
            {isRegister ? "Sign In" : "Create Account"}
          </button>
        </div>

      </form>

    </div>
  );
}

export default Login;
