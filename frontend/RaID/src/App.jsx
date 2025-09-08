import { Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import Dashboard from "./routes/Dashboard";
import ThreeFiftyOne from "./routes/ThreeFiftyOne";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/350-1" element={<ThreeFiftyOne />} />
      </Route>
    </Routes>
  );
}
