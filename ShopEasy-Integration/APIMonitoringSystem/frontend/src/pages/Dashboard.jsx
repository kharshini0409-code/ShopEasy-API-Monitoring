

import { useEffect, useState } from "react";
import {
  Server,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";

import StatsCard from "../components/StatsCard";
import api from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/dashboard/statistics");
      setStats(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard statistics.");
    }
  };

  useEffect(() => {
    fetchStats();

    const interval = setInterval(fetchStats, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!stats && !error) {
    return <p>Loading dashboard...</p>;
  }

  if (error && !stats) {
    return <p>{error}</p>;
  }

  return (
    <>
      <h1>Dashboard</h1>
      <p>Monitor and manage your APIs in real time.</p>

      {error && <p>{error}</p>}

      <section className="stats-grid">
        <StatsCard
          title="Total APIs"
          value={stats.totalApis}
          icon={Server}
          color="blue"
          description="Registered APIs"
        />

        <StatsCard
          title="Total Requests"
          value={stats.totalRequests}
          icon={Activity}
          color="purple"
          description="Monitored requests"
        />

        <StatsCard
          title="Successful Requests"
          value={stats.successfulRequests}
          icon={CheckCircle}
          color="green"
          description="Successful responses"
        />

        <StatsCard
          title="Failed Requests"
          value={stats.failedRequests}
          icon={AlertCircle}
          color="red"
          description="Failed responses"
        />

        <StatsCard
          title="Average Response Time"
          value={`${Number(stats.averageResponseTimeMs).toFixed(2)} ms`}
          icon={Clock}
          color="blue"
          description="Average API response time"
        />
      </section>
    </>
  );
}

export default Dashboard;
