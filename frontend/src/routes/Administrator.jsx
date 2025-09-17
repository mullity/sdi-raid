import { useState, useEffect } from 'react';
import './Administrator.css';

function Administrator() {
  const [activeTab, setActiveTab] = useState('units');
  const [formData, setFormData] = useState({
    // Unit data
    unitName: '',
    unitUIC: '',
    unitType: '',
    parentUnit: '',
    // Personnel data
    personnelName: '',
    personnelRank: '',
    personnelMOS: '',
    personnelUnit: '',
    // Equipment data
    equipmentName: '',
    equipmentType: '',
    equipmentSerial: '',
    equipmentStatus: 'operational',
    // Training data
    trainingName: '',
    trainingType: '',
    trainingDuration: '',
    trainingRequirements: '',
    // User data
    userEmail: '',
    userUsername: '',
    userPassword: '',
    userRoleId: '',
    userUnitId: '',
    userMOS: ''
  });

  const [roles, setRoles] = useState([]);
  const [units, setUnits] = useState([]);

  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Fetch roles and units on component mount
  useEffect(() => {
    fetchRolesAndUnits();
  }, []);

  const fetchRolesAndUnits = async () => {
    try {
      const [rolesResponse, unitsResponse] = await Promise.all([
        fetch('http://localhost:3001/api/roles', { credentials: 'include' }),
        fetch('http://localhost:3001/api/units', { credentials: 'include' })
      ]);

      if (rolesResponse.ok) {
        const rolesData = await rolesResponse.json();
        setRoles(rolesData);
      }

      if (unitsResponse.ok) {
        const unitsData = await unitsResponse.json();
        setUnits(unitsData);
      }
    } catch (err) {
      console.error('Error fetching roles and units:', err);
      // Set fallback data
      setRoles([
        { id: 1, name: 'DEV' },
        { id: 2, name: 'ADMIN' },
        { id: 3, name: 'USER' }
      ]);
      setUnits([
        { id: 0, uic: 'WAMZA0', name: '160 Engineer Co' },
        { id: 1, uic: 'WAMZB0', name: '244 Signal Co' },
        { id: 2, uic: 'WAMZC0', name: '195 Infantry Co' }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleSubmit = async (e, dataType) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let endpoint = '';
      let payload = {};

      if (dataType === 'users') {
        endpoint = 'http://localhost:3001/api/users';
        payload = {
          email: formData.userEmail,
          username: formData.userUsername,
          password: formData.userPassword,
          role_id: parseInt(formData.userRoleId),
          unit_id: parseInt(formData.userUnitId),
          mos: formData.userMOS
        };
      } else if (dataType === 'training') {
        endpoint = 'http://localhost:3001/api/training';

        // Create FormData for file upload
        const formDataObj = new FormData();
        formDataObj.append('name', formData.trainingName);
        formDataObj.append('type', formData.trainingType);
        formDataObj.append('duration', formData.trainingDuration);
        formDataObj.append('requirements', formData.trainingRequirements);

        // Append files
        selectedFiles.forEach((file, index) => {
          formDataObj.append(`documents`, file);
        });

        // Handle FormData differently
        const response = await fetch(endpoint, {
          method: 'POST',
          credentials: 'include',
          body: formDataObj
        });

        if (response.ok) {
          setSuccessMessage(`Training program created successfully!`);
          setTimeout(() => setSuccessMessage(''), 3000);

          // Clear form fields
          const fieldsToReset = getFieldsForTab(dataType);
          const updatedFormData = { ...formData };
          fieldsToReset.forEach(field => {
            updatedFormData[field] = '';
          });
          setFormData(updatedFormData);
          setSelectedFiles([]);
        } else {
          const errorData = await response.text();
          setError(`Error creating training: ${errorData}`);
        }
        setLoading(false);
        return;
      } else {
        // For other data types, just log for now
        console.log(`Submitting ${dataType} data:`, formData);
        setSuccessMessage(`${dataType.charAt(0).toUpperCase() + dataType.slice(1)} data submitted successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);

        // Clear form fields for the current tab
        const fieldsToReset = getFieldsForTab(dataType);
        const updatedFormData = { ...formData };
        fieldsToReset.forEach(field => {
          updatedFormData[field] = field.includes('Status') ? 'operational' : '';
        });
        setFormData(updatedFormData);
        setSelectedFiles([]);
        setLoading(false);
        return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccessMessage(`${dataType.charAt(0).toUpperCase() + dataType.slice(1)} created successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);

        // Clear form fields for the current tab
        const fieldsToReset = getFieldsForTab(dataType);
        const updatedFormData = { ...formData };
        fieldsToReset.forEach(field => {
          updatedFormData[field] = field.includes('Status') ? 'operational' : '';
        });
        setFormData(updatedFormData);
        setSelectedFiles([]);
      } else {
        const errorData = await response.text();
        setError(`Error creating ${dataType}: ${errorData}`);
      }
    } catch (err) {
      console.error(`Error submitting ${dataType}:`, err);
      setError(`Error creating ${dataType}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getFieldsForTab = (tab) => {
    switch (tab) {
      case 'units':
        return ['unitName', 'unitUIC', 'unitType', 'parentUnit'];
      case 'personnel':
        return ['personnelName', 'personnelRank', 'personnelMOS', 'personnelUnit'];
      case 'equipment':
        return ['equipmentName', 'equipmentType', 'equipmentSerial', 'equipmentStatus'];
      case 'training':
        return ['trainingName', 'trainingType', 'trainingDuration', 'trainingRequirements'];
      case 'users':
        return ['userEmail', 'userUsername', 'userPassword', 'userRoleId', 'userUnitId', 'userMOS'];
      default:
        return [];
    }
  };

  const renderUnitForm = () => (
    <form onSubmit={(e) => handleSubmit(e, 'units')} className="data-form">
      <h3>Add New Unit</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="unitName">Unit Name</label>
          <input
            type="text"
            id="unitName"
            name="unitName"
            value={formData.unitName}
            onChange={handleInputChange}
            placeholder="e.g., 1st Battalion, 2nd Infantry Regiment"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="unitUIC">Unit Identification Code (UIC)</label>
          <input
            type="text"
            id="unitUIC"
            name="unitUIC"
            value={formData.unitUIC}
            onChange={handleInputChange}
            placeholder="e.g., W1234A"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="unitType">Unit Type</label>
          <select
            id="unitType"
            name="unitType"
            value={formData.unitType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Unit Type</option>
            <option value="infantry">Infantry</option>
            <option value="armor">Armor</option>
            <option value="artillery">Artillery</option>
            <option value="aviation">Aviation</option>
            <option value="logistics">Logistics</option>
            <option value="medical">Medical</option>
            <option value="engineering">Engineering</option>
            <option value="signal">Signal</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="parentUnit">Parent Unit</label>
          <input
            type="text"
            id="parentUnit"
            name="parentUnit"
            value={formData.parentUnit}
            onChange={handleInputChange}
            placeholder="e.g., 2nd Infantry Division"
          />
        </div>
      </div>
      <button type="submit" className="submit-btn">Add Unit</button>
    </form>
  );

  const renderPersonnelForm = () => (
    <form onSubmit={(e) => handleSubmit(e, 'personnel')} className="data-form">
      <h3>Add Personnel</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="personnelName">Full Name</label>
          <input
            type="text"
            id="personnelName"
            name="personnelName"
            value={formData.personnelName}
            onChange={handleInputChange}
            placeholder="e.g., John Smith"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="personnelRank">Rank</label>
          <select
            id="personnelRank"
            name="personnelRank"
            value={formData.personnelRank}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Rank</option>
            <option value="PVT">Private (PVT)</option>
            <option value="PV2">Private First Class (PFC)</option>
            <option value="SPC">Specialist (SPC)</option>
            <option value="CPL">Corporal (CPL)</option>
            <option value="SGT">Sergeant (SGT)</option>
            <option value="SSG">Staff Sergeant (SSG)</option>
            <option value="SFC">Sergeant First Class (SFC)</option>
            <option value="MSG">Master Sergeant (MSG)</option>
            <option value="1SG">First Sergeant (1SG)</option>
            <option value="SGM">Sergeant Major (SGM)</option>
            <option value="2LT">Second Lieutenant (2LT)</option>
            <option value="1LT">First Lieutenant (1LT)</option>
            <option value="CPT">Captain (CPT)</option>
            <option value="MAJ">Major (MAJ)</option>
            <option value="LTC">Lieutenant Colonel (LTC)</option>
            <option value="COL">Colonel (COL)</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="personnelMOS">Military Occupational Specialty (MOS)</label>
          <input
            type="text"
            id="personnelMOS"
            name="personnelMOS"
            value={formData.personnelMOS}
            onChange={handleInputChange}
            placeholder="e.g., 11B (Infantry)"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="personnelUnit">Assigned Unit</label>
          <input
            type="text"
            id="personnelUnit"
            name="personnelUnit"
            value={formData.personnelUnit}
            onChange={handleInputChange}
            placeholder="e.g., W1234A"
            required
          />
        </div>
      </div>
      <button type="submit" className="submit-btn">Add Personnel</button>
    </form>
  );

  const renderEquipmentForm = () => (
    <form onSubmit={(e) => handleSubmit(e, 'equipment')} className="data-form">
      <h3>Add Equipment</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="equipmentName">Equipment Name</label>
          <input
            type="text"
            id="equipmentName"
            name="equipmentName"
            value={formData.equipmentName}
            onChange={handleInputChange}
            placeholder="e.g., M4A1 Carbine"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="equipmentType">Equipment Type</label>
          <select
            id="equipmentType"
            name="equipmentType"
            value={formData.equipmentType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Equipment Type</option>
            <option value="weapons">Weapons</option>
            <option value="vehicles">Vehicles</option>
            <option value="communications">Communications</option>
            <option value="medical">Medical Equipment</option>
            <option value="protective">Protective Equipment</option>
            <option value="tools">Tools & Maintenance</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="equipmentSerial">Serial Number</label>
          <input
            type="text"
            id="equipmentSerial"
            name="equipmentSerial"
            value={formData.equipmentSerial}
            onChange={handleInputChange}
            placeholder="e.g., SN123456789"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="equipmentStatus">Status</label>
          <select
            id="equipmentStatus"
            name="equipmentStatus"
            value={formData.equipmentStatus}
            onChange={handleInputChange}
            required
          >
            <option value="operational">Operational</option>
            <option value="maintenance">In Maintenance</option>
            <option value="repair">Needs Repair</option>
            <option value="decommissioned">Decommissioned</option>
          </select>
        </div>
      </div>
      <button type="submit" className="submit-btn">Add Equipment</button>
    </form>
  );

  const renderTrainingForm = () => (
    <form onSubmit={(e) => handleSubmit(e, 'training')} className="data-form">
      <h3>Add Training Program</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="trainingName">Training Name</label>
          <input
            type="text"
            id="trainingName"
            name="trainingName"
            value={formData.trainingName}
            onChange={handleInputChange}
            placeholder="e.g., Combat Lifesaver Course"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="trainingType">Training Type</label>
          <select
            id="trainingType"
            name="trainingType"
            value={formData.trainingType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Training Type</option>
            <option value="combat">Combat Training</option>
            <option value="medical">Medical Training</option>
            <option value="technical">Technical Training</option>
            <option value="leadership">Leadership Training</option>
            <option value="safety">Safety Training</option>
            <option value="weapons">Weapons Training</option>
            <option value="driving">Vehicle Operations</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="trainingDuration">Duration (hours)</label>
          <input
            type="number"
            id="trainingDuration"
            name="trainingDuration"
            value={formData.trainingDuration}
            onChange={handleInputChange}
            placeholder="e.g., 40"
            min="1"
            required
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="trainingRequirements">Requirements & Prerequisites</label>
          <textarea
            id="trainingRequirements"
            name="trainingRequirements"
            value={formData.trainingRequirements}
            onChange={handleInputChange}
            placeholder="Enter training requirements, prerequisites, and any special notes..."
            rows="4"
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="trainingDocuments">Training Documents</label>
          <input
            type="file"
            id="trainingDocuments"
            name="trainingDocuments"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
            multiple
            className="file-input"
          />
          <small className="file-help">
            Upload training materials, SOPs, presentations, etc. (PDF, DOC, PPT, XLS, TXT files)
          </small>
          {selectedFiles.length > 0 && (
            <div className="selected-files">
              <h5>Selected Files:</h5>
              <ul>
                {selectedFiles.map((file, index) => (
                  <li key={index}>
                    {file.name} ({Math.round(file.size / 1024)} KB)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Creating Training Program...' : 'Add Training Program'}
      </button>
    </form>
  );

  const renderUserForm = () => (
    <form onSubmit={(e) => handleSubmit(e, 'users')} className="data-form">
      <h3>Add New User</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="userEmail">Email</label>
          <input
            type="email"
            id="userEmail"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleInputChange}
            placeholder="e.g., john.smith@army.mil"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="userUsername">Username</label>
          <input
            type="text"
            id="userUsername"
            name="userUsername"
            value={formData.userUsername}
            onChange={handleInputChange}
            placeholder="e.g., john.p.smith"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="userPassword">Password</label>
          <input
            type="password"
            id="userPassword"
            name="userPassword"
            value={formData.userPassword}
            onChange={handleInputChange}
            placeholder="Enter secure password"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="userRoleId">Role</label>
          <select
            id="userRoleId"
            name="userRoleId"
            value={formData.userRoleId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Role</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.name === 'DEV' ? 'Commander' : role.name === 'ADMIN' ? 'Administrator' : 'Viewer'}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="userUnitId">Unit</label>
          <select
            id="userUnitId"
            name="userUnitId"
            value={formData.userUnitId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Unit</option>
            {units.map(unit => (
              <option key={unit.id} value={unit.id}>
                {unit.uic} - {unit.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="userMOS">MOS (Military Occupational Specialty)</label>
          <input
            type="text"
            id="userMOS"
            name="userMOS"
            value={formData.userMOS}
            onChange={handleInputChange}
            placeholder="e.g., 11B, 12B, 25B"
            maxLength="20"
          />
        </div>
      </div>
      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Creating User...' : 'Add User'}
      </button>
    </form>
  );

  return (
    <div className="administrator-page">
      <div className="admin-header">
        <h1>Administrator Dashboard</h1>
        <p>Manage and input basic data for the R.A.I.D system</p>
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'units' ? 'active' : ''}`}
          onClick={() => setActiveTab('units')}
        >
          Units
        </button>
        <button 
          className={`tab-btn ${activeTab === 'personnel' ? 'active' : ''}`}
          onClick={() => setActiveTab('personnel')}
        >
          Personnel
        </button>
        <button 
          className={`tab-btn ${activeTab === 'equipment' ? 'active' : ''}`}
          onClick={() => setActiveTab('equipment')}
        >
          Equipment
        </button>
        <button
          className={`tab-btn ${activeTab === 'training' ? 'active' : ''}`}
          onClick={() => setActiveTab('training')}
        >
          Training
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'units' && renderUnitForm()}
        {activeTab === 'personnel' && renderPersonnelForm()}
        {activeTab === 'equipment' && renderEquipmentForm()}
        {activeTab === 'training' && renderTrainingForm()}
        {activeTab === 'users' && renderUserForm()}
      </div>
    </div>
  );
}

export default Administrator;