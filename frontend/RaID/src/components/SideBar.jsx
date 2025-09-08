import { useContext } from "react";
import "../CSS/SideBar.css";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";

function SideBar() {
    const navigate = useNavigate("");

    return (
        <div className="side-section">
            <aside>
                <Card onClick={() => navigate("/Priorities")}>Priorities</Card>
            </aside>
        </div>
    );
}

export default SideBar;