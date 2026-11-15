
import {
  LayoutDashboard,
  Server,
  Activity,
  Settings,
  Shield,
  Zap
} from "lucide-react";

import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <div className="logo-icon">
          <Zap size={22} />
        </div>
        <h2>API Monitor</h2>
      </div>

      <p className="sidebar-heading">MAIN MENU</p>

      <nav className="sidebar-nav">

        <a href="/" className="nav-item active">
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </a>

        <a href="/apis" className="nav-item">
          <Server size={19} />
          <span>API Management</span>
        </a>

        <a href="/monitoring" className="nav-item">
          <Activity size={19} />
          <span>Monitoring</span>
        </a>

      </nav>

      <div className="sidebar-bottom">
        <p className="sidebar-heading">PREFERENCES</p>

        <a href="/security" className="nav-item">
          <Shield size={19} />
          <span>Security</span>
        </a>

        <a href="/settings" className="nav-item">
          <Settings size={19} />
          <span>Settings</span>
        </a>
      </div>

      <div className="sidebar-footer">
        <span className="status-dot"></span>
        System Operational
      </div>

    </aside>
  );
}

export default Sidebar;
