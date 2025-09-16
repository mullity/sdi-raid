// src/routes/AmmoCalculator.jsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useOutletContext } from "react-router-dom";
import "./AmmoCalculator.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

function parseResponse(data) {
  if (Array.isArray(data) && data[0] && "dodic" in data[0] && "quantity" in data[0]) {
    return { mode: "rollup", rollup: data, platforms: [] };
  }
  if (Array.isArray(data) && data[0] && "lin" in data[0] && Array.isArray(data[0].ammo)) {
    return { mode: "lin", rollup: [], platforms: data };
  }
  if (data && Array.isArray(data.items)) return parseResponse(data.items);
  return { mode: "unknown", rollup: [], platforms: [] };
}

export default function AmmoCalculator() {
  const { selectedUIC: headerUIC } = useOutletContext() || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const queryUIC = searchParams.get("uic");
  const [uic, setUic] = useState(queryUIC || headerUIC || "WAZMB0");

  const [iterationsCount, setIterationsCount] = useState(1);
  const [roundingStep, setRoundingStep] = useState(10);

  const [mode, setMode] = useState("rollup");
  const [rollupRows, setRollupRows] = useState([]);
  const [platformRows, setPlatformRows] = useState([]);
  const [platformCounts, setPlatformCounts] = useState({});
  const [selectedDodics, setSelectedDodics] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!queryUIC && headerUIC && headerUIC !== uic) {
      setUic(headerUIC);
    }
  }, [headerUIC, queryUIC, uic]);

  useEffect(() => {
    setSearchParams(previous => {
      const next = new URLSearchParams(previous);
      next.set("uic", uic);
      return next;
    });
  }, [uic, setSearchParams]);

  async function fetchRollup(currentUic) {
    const url = new URL(`${API_BASE}/training/rollup`);
    if (currentUic) url.searchParams.set("uic", currentUic);
    url.searchParams.set("ammoRollup", "true");
    url.searchParams.set("vehicleRollup", "true");
    url.searchParams.set("breakdown", "lin");
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async function refreshData() {
    try {
      setLoading(true);
      setErrorMessage(null);
      const data = await fetchRollup(uic);
      const parsed = parseResponse(data);
      setMode(parsed.mode);
      if (parsed.mode === "rollup") {
        const sorted = [...parsed.rollup].sort((a, b) => String(a.dodic).localeCompare(String(b.dodic)));
        setRollupRows(sorted);
        setSelectedDodics(new Set(sorted.map(row => row.dodic)));
        setPlatformRows([]);
        setPlatformCounts({});
      } else if (parsed.mode === "lin") {
        const sortedPlatforms = [...parsed.platforms].sort((a, b) =>
          String(a.name || a.lin).localeCompare(String(b.name || b.lin))
        );
        setPlatformRows(sortedPlatforms);
        const initialCounts = {};
        sortedPlatforms.forEach(platform => {
          initialCounts[platform.lin] = 0;
        });
        setPlatformCounts(initialCounts);
        const allDodics = new Set();
        sortedPlatforms.forEach(platform => platform.ammo.forEach(item => allDodics.add(item.dodic)));
        setSelectedDodics(allDodics);
        setRollupRows([]);
      } else {
        setMode("rollup");
        setRollupRows([]);
        setPlatformRows([]);
        setPlatformCounts({});
        setSelectedDodics(new Set());
      }
    } catch (error) {
      setErrorMessage(error.message || String(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshData();
  }, [uic]);

  function toggleDodicSelection(dodic) {
    setSelectedDodics(previous => {
      const next = new Set(previous);
      if (next.has(dodic)) next.delete(dodic);
      else next.add(dodic);
      return next;
    });
  }

  function setPlatformCount(lin, value) {
    const numeric = Math.max(0, Number(value || 0));
    setPlatformCounts(previous => ({ ...previous, [lin]: numeric }));
  }

  const computedRollup = useMemo(() => {
    if (mode !== "rollup") return [];
    const iterationsNumber = Math.max(0, Number(iterationsCount || 0));
    const step = Math.max(1, Number(roundingStep || 1));
    const roundUp = value => (step > 1 ? Math.ceil(value / step) * step : Math.ceil(value));
    return rollupRows
      .filter(row => selectedDodics.has(row.dodic))
      .map(row => {
        const baseQuantity = Number(row.quantity || 0);
        const totalQuantity = roundUp(baseQuantity * iterationsNumber);
        return {
          dodic: row.dodic,
          nomenclature: row.nomenclature,
          baseQuantity,
          iterationsNumber,
          totalQuantity
        };
      });
  }, [mode, rollupRows, selectedDodics, iterationsCount, roundingStep]);

  const computedLin = useMemo(() => {
    if (mode !== "lin") return [];
    const iterationsNumber = Math.max(0, Number(iterationsCount || 0));
    const step = Math.max(1, Number(roundingStep || 1));
    const roundUp = value => (step > 1 ? Math.ceil(value / step) * step : Math.ceil(value));
    const rawTotalsByDodic = new Map();
    for (const platform of platformRows) {
      const unitsForPlatform = Math.max(0, Number(platformCounts[platform.lin] || 0));
      if (!unitsForPlatform) continue;
      for (const ammoItem of platform.ammo || []) {
        if (!selectedDodics.has(ammoItem.dodic)) continue;
        let perUnitBaseline = null;
        if (ammoItem.perUnit != null) perUnitBaseline = Number(ammoItem.perUnit);
        else if (ammoItem.per_vehicle != null) perUnitBaseline = Number(ammoItem.per_vehicle);
        else if ("quantity" in ammoItem && ("units" in platform || "unitCount" in platform)) {
          const platformUnitsInBaseline = Number(platform.units ?? platform.unitCount ?? 0);
          perUnitBaseline = platformUnitsInBaseline > 0 ? Number(ammoItem.quantity || 0) / platformUnitsInBaseline : null;
        }
        if (perUnitBaseline == null) continue;
        const addition = perUnitBaseline * unitsForPlatform * iterationsNumber;
        if (!rawTotalsByDodic.has(ammoItem.dodic)) {
          rawTotalsByDodic.set(ammoItem.dodic, { dodic: ammoItem.dodic, nomenclature: ammoItem.nomenclature, raw: 0 });
        }
        rawTotalsByDodic.get(ammoItem.dodic).raw += addition;
      }
    }
    const totals = Array.from(rawTotalsByDodic.values()).map(row => ({
      dodic: row.dodic,
      nomenclature: row.nomenclature,
      totalQuantity: roundUp(row.raw),
      rawQuantity: row.raw
    }));
    const knownDodics = new Set(totals.map(row => row.dodic));
    const allDodics = new Set();
    platformRows.forEach(platform => platform.ammo?.forEach(item => allDodics.add(item.dodic)));
    selectedDodics.forEach(dodic => {
      if (!knownDodics.has(dodic) && allDodics.has(dodic)) {
        const samplePlatform = platformRows.find(p => p.ammo?.some(a => a.dodic === dodic));
        const sampleAmmo = samplePlatform?.ammo?.find(a => a.dodic === dodic);
        totals.push({
          dodic,
          nomenclature: sampleAmmo?.nomenclature || dodic,
          totalQuantity: 0,
          rawQuantity: 0
        });
      }
    });
    totals.sort((a, b) => String(a.dodic).localeCompare(String(b.dodic)));
    return totals;
  }, [mode, platformRows, platformCounts, iterationsCount, roundingStep, selectedDodics]);

  const grandTotal = useMemo(() => {
    const rows = mode === "lin" ? computedLin : computedRollup;
    return rows.reduce((sum, row) => sum + (row.totalQuantity ?? 0), 0);
  }, [mode, computedLin, computedRollup]);

  function exportCSV() {
    const rows = mode === "lin" ? computedLin : computedRollup;
    const header = mode === "lin"
      ? ["DODIC", "Nomenclature", "TotalQty", "Raw"]
      : ["DODIC", "Nomenclature", "BaseQty", "Iterations", "TotalQty"];
    const lines = [header.join(",")].concat(
      rows.map(row => {
        const safeName = `"${(row.nomenclature || "").replaceAll('"', '""')}"`;
        return mode === "lin"
          ? [row.dodic, safeName, row.totalQuantity, Math.round(row.rawQuantity ?? 0)].join(",")
          : [row.dodic, safeName, row.baseQuantity, row.iterationsNumber, row.totalQuantity].join(",");
      })
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ammo-calculator-${uic}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    URL.revokeObjectURL(url);
    anchor.remove();
  }

  return (
    <div className="page-container">
      <div className="toolbar">
        <h1 className="title">Ammo Calculator</h1>
        <div className="toolbar-actions">
          <button onClick={exportCSV} className="button">Export CSV</button>
        </div>
      </div>

      <div className="controls-grid">
        <label className="control">
          <span className="label-text">UIC</span>
          <input
            className="input"
            value={uic}
            onChange={event => setUic(event.target.value.trim().toUpperCase())}
          />
        </label>

        <label className="control">
          <span className="label-text">Iterations</span>
          <input
            type="number"
            min={0}
            className="input"
            value={iterationsCount}
            onChange={event => setIterationsCount(event.target.value)}
          />
        </label>

        <label className="control">
          <span className="label-text">Round totals to</span>
          <input
            type="number"
            min={1}
            className="input"
            value={roundingStep}
            onChange={event => setRoundingStep(event.target.value)}
          />
        </label>
      </div>

      {loading && <div className="status-text">Loading…</div>}
      {errorMessage && <div className="error-text">Error: {errorMessage}</div>}

      {!loading && !errorMessage && (
        <>
          {mode === "lin" ? (
            <>
              <div className="section">
                <div className="section-title">Platform / Vehicle Mix</div>
                <div className="card-grid">
                  {platformRows.map(platform => (
                    <div key={platform.lin} className="card">
                      <div className="card-title">
                        <span className="muted">{platform.lin}</span> {platform.name || platform.lin}
                      </div>
                      <label className="control narrow">
                        <span className="label-text">Units</span>
                        <input
                          type="number"
                          min={0}
                          className="input"
                          value={platformCounts[platform.lin] ?? 0}
                          onChange={event => setPlatformCount(platform.lin, event.target.value)}
                        />
                      </label>
                      <div className="muted small">
                        Rounds: {platform.ammo?.map(item => item.dodic).join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section">
                <div className="section-title">Round Types</div>
                <div className="checkbox-list">
                  {Array.from(new Set(platformRows.flatMap(platform => platform.ammo?.map(item => item.dodic) || [])))
                    .sort()
                    .map(dodic => {
                      const platformSample = platformRows.find(p => p.ammo?.some(a => a.dodic === dodic));
                      const ammoSample = platformSample?.ammo?.find(a => a.dodic === dodic);
                      return (
                        <label key={dodic} className="checkbox-item">
                          <input
                            type="checkbox"
                            checked={selectedDodics.has(dodic)}
                            onChange={() => toggleDodicSelection(dodic)}
                          />
                          <span className="checkbox-text">
                            <b>{dodic}</b> — {ammoSample?.nomenclature || dodic}
                          </span>
                        </label>
                      );
                    })}
                </div>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th className="th left">DODIC</th>
                    <th className="th left">Nomenclature</th>
                    <th className="th right">Total Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {computedLin.map(row => (
                    <tr key={row.dodic}>
                      <td className="td">{row.dodic}</td>
                      <td className="td">{row.nomenclature}</td>
                      <td className="td right strong">{row.totalQuantity.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="td" colSpan={2}><b>Grand Total</b></td>
                    <td className="td right strong">{grandTotal.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </>
          ) : (
            <>
              <div className="section">
                <div className="section-title">Round Types</div>
                <div className="checkbox-list">
                  {rollupRows.map(row => (
                    <label key={row.dodic} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedDodics.has(row.dodic)}
                        onChange={() => toggleDodicSelection(row.dodic)}
                      />
                      <span className="checkbox-text">
                        <b>{row.dodic}</b> — {row.nomenclature}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th className="th left">DODIC</th>
                    <th className="th left">Nomenclature</th>
                    <th className="th right">Base Qty</th>
                    <th className="th right">Iterations</th>
                    <th className="th right">Total Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {computedRollup.map(row => (
                    <tr key={row.dodic}>
                      <td className="td">{row.dodic}</td>
                      <td className="td">{row.nomenclature}</td>
                      <td className="td right">{row.baseQuantity.toLocaleString()}</td>
                      <td className="td right">{row.iterationsNumber}</td>
                      <td className="td right strong">{row.totalQuantity.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="td" colSpan={4}><b>Grand Total</b></td>
                    <td className="td right strong">{grandTotal.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </>
          )}
        </>
      )}
    </div>
  );
}
