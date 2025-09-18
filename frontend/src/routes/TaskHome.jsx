import { useEffect, useMemo, useState } from "react";
import { CatsRollup, TaskSet, TaskEvent, EventElement, EventResource, ResourceAmmunition, TrainingEvent, CollectiveTask, toJSON } from "../classes/taskClass"
import "./TaskHome.css";
import { useParams, useNavigate } from "react-router-dom";


export default function TaskHome({ inputTask = '17-CW-5969' }) {
  const navigate = useNavigate()

  return (
      <div className="equip-page">
        <header className="equip-header">
          <div>
            <h1>METL Tasks</h1>
            <p className="equip-sub">Mission Essential Tasks for UIC: WAMZB0</p>
            
          </div>
        </header>

      </div>
    );
  }
