import { useEffect, useMemo, useState } from "react";
import { CatsRollup, TaskSet, TaskEvent, EventElement, EventResource, ResourceAmmunition, TrainingEvent, CollectiveTask, toJSON } from "../classes/taskClass"
import "./TaskHome.css";
import { useParams, useNavigate } from "react-router-dom";


export default function TaskHome({ inputTask = '17-CW-5969' }) {
    const navigate = useNavigate()
    //TEMP Hardcode
    const METL = [
        {
            "number": "05-CO-3000",
            "title": "Coordinate Survivability Operations"
        },
        {
            "number": "05-CO-2012",
            "title": "Provide Engineer Support to Countermobility"
        },
        {
            "number": "05-CO-1025",
            "title": "Provide Engineer Support for Mobility Operations"
        },
        {
            "number": "05-CO-3000",
            "title": "Conduct Reconnaissance Planning"
        },
        {
            "number": "05-CO-1700",
            "title": "Provide Engineer Support to Explosive Hazards (EHs) Clearing Operations"
        },
        {
            "number": "55-CO-4830",
            "title": "Conduct Expeditionary Deployment Operations"
        }
    ]

    return (
        <div className="equip-page">
            <header className="equip-header">
                <div>
                    <h1>METL Tasks</h1>
                    <p className="equip-sub">Mission Essential Tasks for UIC: WAMZB0</p>
                    {METL.map((task, index) => (<li key={index} >
                        <a onClick={() => navigate(`/task-viewer/${task.number}`)} style={{ cursor: 'pointer' }}>{task.number} - {task.title}</a>
                    </li>))
                    }

                </div>
            </header>

        </div>
    );
}
