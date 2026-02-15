import { useEffect, useState } from "react";

const STORAGE_KEY = "url-health-history";

/**
 * URL Health Checker UI:
 * - Sends checks to POST /api/check
 * - Renders latest result
 * - Persists recent checks in localStorage
 */
function App() {
  const [url, setUrl] = useState("");
  const [timeoutMs, setTimeoutMs] = useState(4000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setHistory(parsed);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, timeoutMs: Number(timeoutMs) })
      });

      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Request failed.");
      }

      setResult(payload);
      setHistory((prev) => [payload, ...prev].slice(0, 8));
    } catch (err) {
      setError(err.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="card">
        <h1>URL Health Checker</h1>
        <p className="subtext">Check HTTP status, response time, and final URL after redirects.</p>

        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="url">URL</label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />

          <label htmlFor="timeoutMs">Timeout (ms)</label>
          <input
            id="timeoutMs"
            type="number"
            min="500"
            max="20000"
            step="100"
            value={timeoutMs}
            onChange={(e) => setTimeoutMs(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Checking..." : "Check URL"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {result && (
          <article className="result">
            <h2>Latest Result</h2>
            <ul>
              <li>
                <strong>Status:</strong> {result.status}
              </li>
              <li>
                <strong>Response Time:</strong> {result.responseTimeMs} ms
              </li>
              <li>
                <strong>Final URL:</strong> <a href={result.finalUrl}>{result.finalUrl}</a>
              </li>
              <li>
                <strong>Checked At:</strong> {new Date(result.checkedAt).toLocaleString()}
              </li>
            </ul>
          </article>
        )}

        <section className="history">
          <h2>Recent Checks</h2>
          {history.length === 0 ? (
            <p className="subtext">No history yet.</p>
          ) : (
            <ul>
              {history.map((item, index) => (
                <li key={`${item.checkedAt}-${index}`}>
                  <span>{item.status}</span>
                  <span>{item.responseTimeMs} ms</span>
                  <span title={item.finalUrl}>{item.finalUrl}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
