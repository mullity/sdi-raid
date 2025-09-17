import { useState } from 'react';
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
    // Users data
    email: '',
    username: '',
    password: '',
    roleId: '',
    unitId: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e, dataType) => {
    e.preventDefault();
    // Here you would typically send data to your backend API
    console.log(`Submitting ${dataType} data:`, formData);

    // Show success message
    setSuccessMessage(`${dataType.charAt(0).toUpperCase() + dataType.slice(1)} data submitted successfully!`);
    setTimeout(() => setSuccessMessage(''), 3000);

    // Clear form fields for the current tab
    const fieldsToReset = getFieldsForTab(dataType);
    const updatedFormData = { ...formData };
    fieldsToReset.forEach(field => {
      updatedFormData[field] = field.includes('Status') ? 'operational' : '';
    });
    setFormData(updatedFormData);
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
        return ['email', 'username', 'password', 'roleId', 'unitId'];
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
      </div>
      <button type="submit" className="submit-btn">Add Training Program</button>
    </form>
  );

  const renderUsersForm = () => (
    <form onSubmit={(e) => handleSubmit(e, 'users')} className="data-form">
      <h3>Add New User</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="e.g., user@example.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="e.g., john_doe"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter password"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="roleId">Role ID</label>
          <input
            type="text"
            id="roleId"
            name="roleId"
            value={formData.roleId}
            onChange={handleInputChange}
            placeholder="e.g., admin, user"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="unitId">Unit ID</label>
          <input
            type="text"
            id="unitId"
            name="unitId"
            value={formData.unitId}
            onChange={handleInputChange}
            placeholder="e.g., W1234A"
            required
          />
        </div>
      </div>
      <button type="submit" className="submit-btn">Add User</button>
    </form>
  );

  return (
    <div className="administrator-page">
      <div className="admin-header">
        <h1>Administrator Dashboard</h1>
        <p>Manage and input basic data for the R.a.i.D system</p>
      </div>
      {successMessage && (
        <div className="success-message">
          {successMessage}
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
        {activeTab === 'users' && renderUsersForm()}
      </div>
    </div>
  );
}

export default Administrator;