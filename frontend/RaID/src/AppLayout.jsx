import { NavLink, Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div>
      <header>
        <h1>R.a.I.D — Dashboard</h1>
        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>{" | "}
          <NavLink to="/350-1">350-1</NavLink>
        </nav>
      </header>

      <div>
        <aside>
          <SectionLink label="Medical" disabled />
          <SectionLink label="Equipment" disabled />
          <SectionLink label="Training" disabled />
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SectionLink({ to = "#", label, disabled }) {
  if (disabled) return <div>{label}</div>;
  return <NavLink to={to}>{label}</NavLink>;
}
