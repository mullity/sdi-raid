import { useEffect, useMemo, useState } from "react";

import { getSnapshot } from "../services/api";
import "./TaskViewer.css";

const FIXED_UIC = "WAZMB0";

export default function TaskViewer() {
  const [summary, setSummary] = useState(null);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [status, setStatus] = useState(""); // filter dropdown
  const [q, setQ] = useState("");           // search box
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // hardcoded for now
  const defaultUnit = 1;

  // load vehicle data on page load
  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        setLoading(true);
        setError(null);

        const snapshotData = await getSnapshot(defaultUnit, true);
        const vehicleInfo = snapshotData.find(item => item.id === 'vehicle');

        if (vehicleInfo) {
          setVehicleData(vehicleInfo);

          // build the kpi numbers
          const { fmc, pmc, nmc, total } = vehicleInfo.data;
          const pctFMC = total ? Math.round((fmc / total) * 1000) / 10 : 0;
          setSummary({
            total,
            counts: { FMC: fmc, PMC: pmc, NMC: nmc },
            pctFMC
          });

          // pull out individual vehicles for the table
          const allVehicles = [];
          if (vehicleInfo.data.allVics) {
            console.log(vehicleInfo.data.allVics,'allVic')
            vehicleInfo.data.allVics.forEach((vehicle) => {
              console.log(vehicle,'vic')
              // vehicle = { name: string, data: array }               
                  allVehicles.push({
                    ...vehicle,
                    name: vehicle.name.replace(/_/g, ' ').toUpperCase(),
                    bumperNumber: vehicle.bumpernumber,
                    status: vehicle.status.toUpperCase(),
                    lin: vehicle.lin,
                    unit_name: FIXED_UIC,
                    date_last_serviced: vehicle.lastService,
                    fuel_level: vehicleInfo.data.fuellevel || 0
                  });
              })
          }

          // pad with fake data since we only get NMC vehicles from backend
          const nmcCount = allVehicles.length;
          const fakeVehiclesToAdd = fakeVehicles.slice(0, Math.max(0, total - nmcCount));

          setRows([...allVehicles]);
          setTotal(total);
        } 
        else {
          // no data from api, use fake stuff
          const counts = { FMC: 0, PMC: 0, NMC: 0 };
          fakeVehicles.forEach(v => counts[v.status]++);
          const total = counts.FMC + counts.PMC + counts.NMC;
          const pctFMC = total ? Math.round((counts.FMC / total) * 1000) / 10 : 0;
          setSummary({ total, counts, pctFMC });
          setRows(fakeVehicles);
          setTotal(fakeVehicles.length);
        }

      } catch (err) {
        console.error('Failed to fetch vehicle data:', err);
        setError(err.message);

        // api failed, just show fake data
        const counts = { FMC: 0, PMC: 0, NMC: 0 };
        fakeVehicles.forEach(v => counts[v.status]++);
        const total = counts.FMC + counts.PMC + counts.NMC;
        const pctFMC = total ? Math.round((counts.FMC / total) * 1000) / 10 : 0;
        setSummary({ total, counts, pctFMC });
        setRows(fakeVehicles);
        setTotal(fakeVehicles.length);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, []);

  useEffect(() => {
    let data = rows;

    if (status) data = data.filter(v => v.status === status);
    if (q) data = data.filter(
      v => v.name.toLowerCase().includes(q.toLowerCase()) ||
        v.lin.toLowerCase().includes(q.toLowerCase())
    );

    setFilteredRows(data);
    setTotal(data.length);
  }, [status, q, rows]);

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

  const paginatedRows = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredRows.slice(startIndex, endIndex);
  }, [filteredRows, page, pageSize]);

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

      {loading && (
        <div className="loading-message">
          Loading equipment data...
        </div>
      )}

      {error && (
        <div className="error-message">
          Error loading equipment data: {error}. Using fallback data.
        </div>
      )}

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
              <th>Bumper#</th>
              <th>LIN</th>
              <th>Status</th>
              <th>Unit</th>
              <th>Last Serviced</th>
              <th>Fuel %</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map(r => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.bumperNumber}</td>
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
            {paginatedRows.length === 0 && (
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
