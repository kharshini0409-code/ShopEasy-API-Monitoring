
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Database,
  Activity,
  CheckCircle,
  Clock,
  Server
} from "lucide-react";

import "./Security.css";

function Security() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <div className="security-page">

      <div className="security-header">
        <div>
          <h1>Security</h1>
          <p>Manage and monitor your API security configuration.</p>
        </div>
      </div>

      {/* Overall security status */}

      <div className="security-overview">
        <div className="security-overview-icon">
          <ShieldCheck size={30} />
        </div>

        <div>
          <h2>API Security Overview</h2>
          <p>
            Authentication and rate-limiting protections are configured
            for your API monitoring system.
          </p>
        </div>

        <span className="security-status">
          <span className="security-dot"></span>
          Protected
        </span>
      </div>

      {/* Security feature cards */}

      <div className="security-grid">

        <div className="security-card">
          <div className="security-card-icon blue">
            <KeyRound size={22} />
          </div>

          <h3>JWT Authentication</h3>

          <p>
            JSON Web Tokens are used to authenticate users
            and protect API endpoints.
          </p>

          <span className="security-feature-status">
            <CheckCircle size={15} />
            Configured
          </span>
        </div>

        <div className="security-card">
          <div className="security-card-icon green">
            <Lock size={22} />
          </div>

          <h3>Password Encryption</h3>

          <p>
            BCrypt password hashing is used to securely
            store user passwords.
          </p>

          <span className="security-feature-status">
            <CheckCircle size={15} />
            Configured
          </span>
        </div>

        <div className="security-card">
          <div className="security-card-icon purple">
            <Database size={22} />
          </div>

          <h3>Redis Rate Limiting</h3>

          <p>
            Redis tracks request counts using API ID
            and client IP address.
          </p>

          <span className="security-feature-status">
            <CheckCircle size={15} />
            Configured
          </span>
        </div>

        <div className="security-card">
          <div className="security-card-icon orange">
            <Server size={22} />
          </div>

          <h3>Endpoint Protection</h3>

          <p>
            Spring Security protects application endpoints
            and requires authentication.
          </p>

          <span className="security-feature-status">
            <CheckCircle size={15} />
            Configured
          </span>
        </div>

      </div>

      {/* Rate limit configuration */}

      <div className="security-section">
        <div className="security-section-heading">
          <div>
            <h2>Rate Limiting Configuration</h2>
            <p>Current configured request limits.</p>
          </div>

          <Activity size={22} />
        </div>

        <div className="rate-limit-grid">

          <div className="rate-limit-item">
            <span className="rate-limit-label">
              Maximum Requests
            </span>
            <h2>10</h2>
            <p>Requests allowed</p>
          </div>

          <div className="rate-limit-item">
            <span className="rate-limit-label">
              Time Window
            </span>
            <h2>60</h2>
            <p>Seconds</p>
          </div>

          <div className="rate-limit-item">
            <span className="rate-limit-label">
              Rate Limit Scope
            </span>
            <h2>API + IP</h2>
            <p>Individual client tracking</p>
          </div>

        </div>

        <div className="rate-limit-note">
          <Clock size={18} />
          <p>
            When a client exceeds the configured limit,
            the gateway responds with HTTP 429 (Too Many Requests).
          </p>
        </div>
      </div>

      {/* Current session */}

      <div className="security-section session-section">
        <div className="security-section-heading">
          <div>
            <h2>Authentication Session</h2>
            <p>Current browser authentication information.</p>
          </div>

          <Lock size={22} />
        </div>

        <div className="session-details">
          <div>
            <span>Authentication Method</span>
            <strong>JWT Bearer Token</strong>
          </div>

          <div>
            <span>Session Status</span>
            <strong className={isAuthenticated ? "session-active" : "session-inactive"}>
              {isAuthenticated ? "Authenticated" : "Not Authenticated"}
            </strong>
          </div>

          <div>
            <span>Token Storage</span>
            <strong>Browser Local Storage</strong>
          </div>
        </div>

        <p className="security-warning">
          Your authentication token is not displayed on this page.
        </p>
      </div>

    </div>
  );
}

export default Security;
