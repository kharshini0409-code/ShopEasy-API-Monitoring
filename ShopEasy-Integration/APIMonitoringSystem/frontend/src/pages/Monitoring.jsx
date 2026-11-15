
import { useEffect, useState } from "react";

import {
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import StatsCard from "../components/StatsCard";
import api from "../services/api";
import "./Monitoring.css";

function Monitoring() {
  const [apis, setApis] = useState([]);
  const [selectedApi, setSelectedApi] = useState("");
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch registered APIs
  const fetchApis = async () => {
    try {
      const response = await api.get("/api/monitored-apis");

      const apiList = Array.isArray(response.data)
        ? response.data
        : [];

      setApis(apiList);
      setError("");

      if (apiList.length > 0 && !selectedApi) {
        setSelectedApi(String(apiList[0].id));
      }
    } catch (err) {
      console.error("API loading error:", err);
      setError("Unable to load registered APIs.");
      setLoading(false);
    }
  };

  // Fetch monitoring metrics
  const fetchMetrics = async (apiId) => {
    if (!apiId) return;

    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/api/monitoring/${apiId}/metrics`
      );

      setMetrics(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error("Monitoring error:", err);
      setError("Unable to load monitoring data.");
      setMetrics([]);
    } finally {
      setLoading(false);
    }
  };

  // Load APIs when component mounts
  useEffect(() => {
    fetchApis();
  }, []);

  // Load metrics whenever selected API changes
  useEffect(() => {
    if (!selectedApi) {
      setMetrics([]);
      setLoading(false);
      return;
    }

    fetchMetrics(selectedApi);

    const interval = setInterval(() => {
      fetchMetrics(selectedApi);
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedApi]);

  // Calculate statistics
  const totalRequests = metrics.length;

  const successfulRequests = metrics.filter(
    (item) => item.successful === true
  ).length;

  const failedRequests = totalRequests - successfulRequests;

  const averageResponseTime =
    totalRequests > 0
      ? metrics.reduce(
          (total, item) =>
            total + (Number(item.responseTimeMs) || 0),
          0
        ) / totalRequests
      : 0;

  // Prepare chart data
  const chartData = [...metrics]
    .reverse()
    .slice(-20)
    .map((item, index) => ({
      request: index + 1,
      responseTime: Number(item.responseTimeMs) || 0
    }));

  // Format timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return "-";

    const date = new Date(timestamp);

    return isNaN(date.getTime())
      ? "-"
      : date.toLocaleString();
  };

  return (
    <div className="monitoring-page">

      {/* Header */}
      <div className="monitoring-header">
        <div>
          <h1>API Monitoring</h1>
          <p>
            Track API performance, response times and request status.
          </p>
        </div>

        <button
          className="monitor-refresh-button"
          onClick={() => fetchMetrics(selectedApi)}
          disabled={!selectedApi || loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* API Selection */}
      <div className="monitor-filter">
        <label htmlFor="api-select">
          Select API
        </label>

        <select
          id="api-select"
          value={selectedApi}
          onChange={(e) => setSelectedApi(e.target.value)}
        >
          {apis.length === 0 && (
            <option value="">
              No APIs registered
            </option>
          )}

          {apis.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <p className="monitor-error">
          {error}
        </p>
      )}

      {/* Loading */}
      {loading ? (
        <p className="monitor-message">
          Loading monitoring data...
        </p>
      ) : !selectedApi ? (
        <p className="monitor-message">
          Register an API first to view monitoring data.
        </p>
      ) : (
        <>

          {/* Statistics Cards */}
          <section className="monitor-stats-grid">

            <StatsCard
              title="Total Requests"
              value={totalRequests}
              icon={Activity}
              color="blue"
              description="Recorded API requests"
            />

            <StatsCard
              title="Successful Requests"
              value={successfulRequests}
              icon={CheckCircle}
              color="green"
              description="Successful responses"
            />

            <StatsCard
              title="Failed Requests"
              value={failedRequests}
              icon={AlertCircle}
              color="red"
              description="Failed responses"
            />

            <StatsCard
              title="Average Response Time"
              value={`${averageResponseTime.toFixed(2)} ms`}
              icon={Clock}
              color="purple"
              description="Average recorded response time"
            />

          </section>

          {/* Response Time Chart */}
          <section className="monitor-chart-container">

            <div className="monitor-section-heading">
              <h2>Response Time Overview</h2>
              <span>Last 20 recorded requests</span>
            </div>

            {chartData.length === 0 ? (
              <p className="monitor-message">
                No request data available yet. Send a request through your API Gateway.
              </p>
            ) : (
              <div className="monitor-chart">

                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="request" />

                    <YAxis />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="responseTime"
                      name="Response Time (ms)"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={false}
                    />

                  </LineChart>
                </ResponsiveContainer>

              </div>
            )}

          </section>

          {/* Request History */}
          <section className="monitor-table-container">

            <div className="monitor-section-heading">
              <h2>Request History</h2>
              <span>{totalRequests} records</span>
            </div>

            {metrics.length === 0 ? (
              <p className="monitor-message">
                No requests recorded for this API yet.
              </p>
            ) : (
              <div className="monitor-table-scroll">

                <table>

                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Method</th>
                      <th>Status Code</th>
                      <th>Response Time</th>
                      <th>Result</th>
                    </tr>
                  </thead>

                  <tbody>
                    {metrics.map((item, index) => (
                      <tr key={item.id || index}>

                        <td>
                          {formatDate(item.timestamp)}
                        </td>

                        <td>
                          <span className="method-badge">
                            {item.httpMethod || "-"}
                          </span>
                        </td>

                        <td>
                          {item.statusCode ?? "-"}
                        </td>

                        <td>
                          {item.responseTimeMs != null
                            ? `${item.responseTimeMs} ms`
                            : "-"}
                        </td>

                        <td>
                          <span
                            className={`monitor-result ${
                              item.successful === true
                                ? "success"
                                : "failure"
                            }`}
                          >
                            {item.successful === true
                              ? "Success"
                              : "Failed"}
                          </span>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>
            )}

          </section>

        </>
      )}

    </div>
  );
}

export default Monitoring;
