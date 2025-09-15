import { useEffect, useMemo, useState } from "react";
import fakeVehicles from "../fakeVehicles.json";
import "./EquipmentDetails.css";

const FIXED_UIC = "WAZMB0";

export default function EquipmentDetails() {
  const [summary, setSummary] = useState(null);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [status, setStatus] = useState(""); // 'FMC' | 'PMC' | 'NMC' | ''
  const [q, setQ] = useState("");           // search term
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // build KPI summary from fake data once
  useEffect(() => {
    const counts = { FMC: 0, PMC: 0, NMC: 0 };
    fakeVehicles.forEach(v => counts[v.status]++);
    const total = counts.FMC + counts.PMC + counts.NMC;
    const pctFMC = total ? Math.round((counts.FMC / total) * 1000) / 10 : 0;
    setSummary({ total, counts, pctFMC });
  }, []);

  useEffect(() => {
    let data = fakeVehicles;

    data = data.filter(v => v.unit_name === FIXED_UIC);

    if (status) data = data.filter(v => v.status === status);
    if (q) data = data.filter(
      v => v.name.toLowerCase().includes(q.toLowerCase()) ||
        v.lin.toLowerCase().includes(q.toLowerCase())
    );

    setRows(data);
    setTotal(data.length);
  }, [status, q, page]);

  const StatusBadge = ({ value }) => {
    const cls = value === "FMC" ? "badge badge--ok"
      : value === "PMC" ? "badge badge--warn"
        : "badge badge--bad";
    return <span className={cls}>{value}</span>;
  };

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total]
  );

  return (
    <div className="equip-page">
      <header className="equip-header">
        <div>
          <h1>Equipment Details</h1>
          <p className="equip-sub">Equipment contributing to readiness KPI</p>
        </div>
        <div className="equip-kpi">
          <div className="kpi-number">{summary?.pctFMC ?? 0}%</div>
          <div className="kpi-label">FMC</div>
          <div className="kpi-split">
            <span>FMC {summary?.counts?.FMC ?? 0}</span>
            <span>PMC {summary?.counts?.PMC ?? 0}</span>
            <span>NMC {summary?.counts?.NMC ?? 0}</span>
          </div>
        </div>
      </header>

      <section className="equip-toolbar">
        <label>
          Status
          <select value={status} onChange={e => { setPage(1); setStatus(e.target.value); }}>
            <option value="">All</option>
            <option value="FMC">FMC</option>
            <option value="PMC">PMC</option>
            <option value="NMC">NMC</option>
          </select>
        </label>

        <div className="uic-badge">
          UIC: {FIXED_UIC}
        </div>

        <label className="search">
          Search
          <input
            value={q}
            onChange={e => { setPage(1); setQ(e.target.value); }}
            placeholder="Name or LIN"
          />
        </label>
      </section>

      <section className="equip-table-wrap">
        <table className="equip-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>LIN</th>
              <th>Status</th>
              <th>Unit</th>
              <th>Last Serviced</th>
              <th>Fuel %</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.lin}</td>
                <td><StatusBadge value={r.status} /></td>
                <td>{r.unit_name ?? r.assigned_unit_id ?? "-"}</td>
                <td>{r.date_last_serviced ? new Date(r.date_last_serviced).toLocaleDateString() : "-"}</td>
                <td>{r.fuel_level ?? "-"}</td>
                <td>
                  <button className="view">View</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan="7" className="empty">No results.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <footer className="equip-pager">
        <button
          disabled={page <= 1}
          onClick={() => setPage(p => p - 1)}
          className="pager-button"
        >
          {'\u2190'} Prev
        </button>

        <span className="pager-page">Page {page} / {totalPages}</span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(p => p + 1)}
          className="pager-button"
        >
          Next {'\u2192'}
        </button>
      </footer>
    </div>
  );
}
