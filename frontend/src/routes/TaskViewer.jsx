import { useEffect, useMemo, useState } from "react";
import { CatsRollup, TaskSet, TaskEvent, EventElement, EventResource, ResourceAmmunition, TrainingEvent, CollectiveTask, toJSON } from "../classes/taskClass"
import "./TaskViewer.css";
import { useParams, useNavigate } from "react-router-dom";


export default function TaskViewer({ inputTask = '17-CW-5969' }) {
  const navigate = useNavigate()
  const { taskId } = useParams()
  const [currentTask, setCurrentTask] = useState({})
  console.log(taskId, 'input')

  useEffect(() => {
    if (Object.keys(currentTask).length == 0 || currentTask?.metadata?.identifier != taskId) {
      fetch(`http://localhost:3001/cars/metadata?taskId=${taskId || '17-CW-5969'}`).then((res) =>
        toJSON(res.body)
          .then((taskBody) => {
            console.log(taskBody);
            return setCurrentTask(JSON.parse(taskBody))
          })
      )
    } else {
    }
  }, [taskId])

  function updateTask(newTaskId) {
    setCurrentTask({})
    navigate(`/task-viewer/${newTaskId}`)
  }
  console.log(Object.keys(currentTask), 'curtask keys')
  if (currentTask.metadata?.carId) {
    return (
      <div className="equip-page">
        <header className="equip-header">
          <div>

            <h1>{currentTask.metadata.identifier}</h1>

            <p className="equip-sub">{currentTask.metadata.title}</p>

            <a href={currentTask?.metadata?.formats?.find(item => item['path'] == 'report.pdf')?.['link']?.['href'] || currentTask['metadata']['formats'][0]['link']['href']}
              target="_blank" rel="noopener noreferrer">
                {currentTask?.metadata?.formats?.find(item => item['path'] == 'report.pdf')?.['link']?.['href'] || currentTask['metadata']['formats'][0]['link']['href'].includes('atiam') ? "Requires CAC login (Restricted Document) - " : ''}
                Get the PDF from CAR              
            </a>

            <img src={currentTask.metadata.qr.find(item => item.title == "large")['href']} />


            <ul> References from this document:
              {currentTask.references?.map((refer, index) => (<li key={index} >
                <a onClick={() => updateTask(refer.id)} style={{ cursor: 'pointer' }}>{refer.id} - {refer.title}</a>

              </li>)) || " No references found or metadata supplied"}
            </ul>


            <ul> Supporting Collective Tasks from this document:
              {currentTask.supportingCollectiveTasks?.map((refer, index) => (<li key={index} >
                <a onClick={() => updateTask(refer.number)} style={{ cursor: 'pointer' }}>{refer.number} - {refer.title}</a>

              </li>)) || " No collective tasks for this document found"}
            </ul>


            <ul> Supporting Individual Tasks from this document (Not available for online viewing):
              {currentTask.supportingIndividualTasks?.map((refer, index) => (<li key={index} >
                <a>{refer.number} - {refer.title}</a>

              </li>)) || " No individual tasks for this document found"}
            </ul>


            <ul> Supporting Collective Tasks from steps in this document:
              {currentTask.taskSteps?.map(task => {
                console.log(JSON.stringify(task.supportingCollectiveTasks))
                if (task.supportingCollectiveTasks.length > 0) {
                  return (
                    <ul>{task.stepTitle}
                      {task.supportingCollectiveTasks.map((refer, index) => (<li key={index}>
                        <a onClick={() => updateTask(refer.number)} style={{ cursor: 'pointer' }}>{refer.number} - {refer.title}</a>

                      </li>))}
                    </ul>
                  )
                }
              }) || " No steps have tasks associated"}

            </ul>


          </div>
        </header>

      </div>
    );
  }
  else {
    return (
      <div className="equip-page">
        <header className="equip-header">
          <div>
            <h1>Loading...</h1>
            <p className="equip-sub">Getting your information...</p>
          </div>
        </header>

      </div>
    )
  }

}
