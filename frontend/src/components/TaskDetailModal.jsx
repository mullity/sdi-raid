import { useState, useEffect } from 'react';
import Modal from './Modal';
import './TaskDetailModal.css';

function TaskDetailModal({ isOpen, onClose, taskNumber }) {
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    if (isOpen && taskNumber) {
      fetchTaskDetails();
    }
  }, [isOpen, taskNumber]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch task details from CAR API
      const response = await fetch(`http://localhost:3001/api/tasks/car/${taskNumber}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setTaskData(data.individualTask);
        generateQRCode(taskNumber);
      } else {
        throw new Error('Failed to fetch task details');
      }
    } catch (err) {
      console.error('Error fetching task details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (taskNum) => {
    try {
      // Generate QR code for task access
      const response = await fetch(`http://localhost:3001/api/qr/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: `${window.location.origin}/task/${taskNum}`,
          size: 150
        }),
        credentials: 'include'
      });

      if (response.ok) {
        const qrData = await response.json();
        setQrCode(qrData.qrCode);
      }
    } catch (err) {
      console.warn('Failed to generate QR code:', err);
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/car/${taskNumber}/pdf`, {
        credentials: 'include'
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${taskNumber}-task.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to download PDF');
      }
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const renderTaskSteps = (steps) => {
    return steps.map((step) => (
      <div key={step.sortOrder} className={`task-step level-${step.stepLevel}`}>
        <div className="step-header">
          <span className="step-id">{step.stepDisplayId}</span>
          <h4 className="step-title">{step.stepTitle}</h4>
        </div>
        {step.statements?.note && (
          <div className="step-note">
            <strong>Note:</strong> {step.statements.note}
          </div>
        )}
        {step.childSteps && step.childSteps.length > 0 && (
          <div className="child-steps">
            {renderTaskSteps(step.childSteps)}
          </div>
        )}
      </div>
    ));
  };

  const renderEquipment = (equipment) => {
    return equipment.map((item, index) => (
      <div key={index} className="equipment-item">
        <span className="equipment-name">{item.name}</span>
        <span className="equipment-quantity">Qty: {item.quantity}</span>
        {item.description && (
          <span className="equipment-description">{item.description}</span>
        )}
      </div>
    ));
  };

  const renderReferences = (references) => {
    return references.map((ref, index) => (
      <div key={index} className={`reference-item ${ref.isPrimary ? 'primary' : ''}`}>
        <span className="reference-id">{ref.id}</span>
        <span className="reference-title">{ref.title}</span>
        {ref.isPrimary && <span className="primary-badge">Primary</span>}
      </div>
    ));
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskData ? `${taskData.generalInformation.number} - ${taskData.generalInformation.title}` : 'Task Details'}
    >
      <div className="task-detail-content">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading task details from CAR...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>Error: {error}</p>
            <button onClick={fetchTaskDetails} className="retry-button">
              Retry
            </button>
          </div>
        )}

        {taskData && (
          <>
            <div className="task-header-section">
              <div className="task-info-grid">
                <div className="task-info-item">
                  <label>Task Number:</label>
                  <span>{taskData.generalInformation.number}</span>
                </div>
                <div className="task-info-item">
                  <label>Component:</label>
                  <span>{taskData.generalInformation.component}</span>
                </div>
                <div className="task-info-item">
                  <label>Task Type:</label>
                  <span>{taskData.generalInformation.taskType}</span>
                </div>
                <div className="task-info-item">
                  <label>Status:</label>
                  <span className={`status-badge ${taskData.generalInformation.status.toLowerCase()}`}>
                    {taskData.generalInformation.status}
                  </span>
                </div>
              </div>

              <div className="task-actions">
                <button onClick={downloadPDF} className="download-pdf-btn">
                  📄 Download PDF
                </button>
                {qrCode && (
                  <div className="qr-code-section">
                    <img src={qrCode} alt="QR Code for task access" className="qr-code" />
                    <span className="qr-label">Quick Access</span>
                  </div>
                )}
              </div>
            </div>

            <div className="task-section">
              <h3>Condition</h3>
              <p className="condition-text">{taskData.conditionAndStandard.condition}</p>
            </div>

            <div className="task-section">
              <h3>Standard</h3>
              <p className="standard-text">{taskData.conditionAndStandard.standard}</p>
            </div>

            <div className="task-section">
              <h3>Performance Steps</h3>
              <div className="task-steps">
                {renderTaskSteps(taskData.taskSteps)}
              </div>
            </div>

            <div className="task-section">
              <h3>Evaluation</h3>
              <div className="evaluation-section">
                <h4>Guidance</h4>
                <p>{taskData.taskEvaluation.guidance}</p>
                <h4>Preparation</h4>
                <p>{taskData.taskEvaluation.preparation}</p>

                <h4>Performance Measures</h4>
                <div className="performance-measures">
                  {taskData.taskMeasure.map((measure) => (
                    <div key={measure.sortOrder} className="measure-item">
                      <span className="measure-id">{measure.displayMeasId}</span>
                      <span className="measure-title">{measure.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {taskData.equipment && taskData.equipment.length > 0 && (
              <div className="task-section">
                <h3>Required Equipment</h3>
                <div className="equipment-list">
                  {renderEquipment(taskData.equipment)}
                </div>
              </div>
            )}

            {taskData.references && taskData.references.length > 0 && (
              <div className="task-section">
                <h3>References</h3>
                <div className="references-list">
                  {renderReferences(taskData.references)}
                </div>
              </div>
            )}

            {taskData.knowledge && taskData.knowledge.length > 0 && (
              <div className="task-section">
                <h3>Required Knowledge</h3>
                <div className="knowledge-list">
                  {taskData.knowledge.map((item, index) => (
                    <div key={index} className="knowledge-item">
                      {item.knowledgeName}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {taskData.skill && taskData.skill.length > 0 && (
              <div className="task-section">
                <h3>Required Skills</h3>
                <div className="skills-list">
                  {taskData.skill.map((item, index) => (
                    <div key={index} className="skill-item">
                      {item.skillName}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {taskData.statements && (
              <div className="task-section">
                <h3>Additional Information</h3>
                {taskData.statements.safety && (
                  <div className="statement-item">
                    <h4>Safety Considerations</h4>
                    <p>{taskData.statements.safety}</p>
                  </div>
                )}
                {taskData.statements.environmental && (
                  <div className="statement-item">
                    <h4>Environmental Considerations</h4>
                    <p>{taskData.statements.environmental}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}

export default TaskDetailModal;