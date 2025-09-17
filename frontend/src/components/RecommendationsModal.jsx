import './RecommendationsModal.css';
import { useState, useEffect } from 'react';
//import { getRecommendations } from '../services/api';

function RecommendationsModal({ isOpen, onClose, priorityItem, unit }) {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fallback recommendation data mapping for different priority types
  const fallbackRecommendationData = {
    'Personnel Accountability': {
      title: 'Personnel Accountability',
      urgency: 'High',
      recommendations: [
        'Conduct 100% personnel accountability formation immediately',
        'Update PERSTAT (Personnel Status Report) in real-time',
        'Verify all personnel contact information is current',
        'Implement automated check-in system for personnel tracking',
        'Schedule weekly accountability formations until resolved'
      ],
      resources: [
        'AR 600-8-6 Personnel Accountability',
        'Unit SOP for Personnel Tracking',
        'Emergency Contact Database'
      ],
      timeline: '48 hours',
      impact: 'Critical for mission readiness and personnel safety'
    },
    'Medical Readiness Review': {
      title: 'Medical Readiness Review',
      urgency: 'High',
      recommendations: [
        'Schedule immediate MEDPROS updates for all personnel',
        'Coordinate with medical personnel for overdue physicals',
        'Review and update immunization records',
        'Ensure dental readiness is current for deployment',
        'Complete vision and hearing tests for critical personnel'
      ],
      resources: [
        'MEDPROS System Access',
        'Unit Medical Personnel',
        'AR 40-501 Standards of Medical Fitness'
      ],
      timeline: '7 days',
      impact: 'Required for deployment certification and personnel health'
    },
    'Training Records Update': {
      title: 'Training Records Update',
      urgency: 'Medium',
      recommendations: [
        'Audit individual training records in DTMS',
        'Update expired certifications and qualifications',
        'Schedule make-up training for deficient personnel',
        'Verify MOS-specific training requirements',
        'Document all training completions properly'
      ],
      resources: [
        'DTMS (Digital Training Management System)',
        'Training NCO Support',
        'Unit Training Schedule'
      ],
      timeline: '14 days',
      impact: 'Essential for maintaining unit training readiness'
    },
    'Equipment Maintenance': {
      title: 'Equipment Maintenance',
      urgency: 'High',
      recommendations: [
        'Conduct immediate PMCS on all critical equipment',
        'Schedule maintenance for deadline equipment',
        'Order required parts and supplies',
        'Train operators on proper maintenance procedures',
        'Implement daily equipment status reporting'
      ],
      resources: [
        'Technical Manuals (TMs)',
        'Maintenance Personnel',
        'Parts and Supply System'
      ],
      timeline: '72 hours',
      impact: 'Critical for operational capability and mission success'
    },
    'Supply Inventory': {
      title: 'Supply Inventory',
      urgency: 'High',
      recommendations: [
        'Conduct 100% sensitive items inventory',
        'Reconcile all hand receipts and property books',
        'Update supply status in automated systems',
        'Investigate and resolve any missing items',
        'Implement enhanced security measures for sensitive items'
      ],
      resources: [
        'Property Book Officer',
        'Supply Sergeant',
        'Hand Receipt Holders'
      ],
      timeline: '48 hours',
      impact: 'Required for accountability and operational readiness'
    },
    'Vehicle Inspection': {
      title: 'Vehicle Inspection',
      urgency: 'Medium',
      recommendations: [
        'Schedule quarterly vehicle safety inspections',
        'Complete pre-operation checks on all vehicles',
        'Update vehicle maintenance logs',
        'Train drivers on proper inspection procedures',
        'Coordinate with motor pool for major repairs'
      ],
      resources: [
        'Vehicle Operators',
        'Motor Pool Personnel',
        'DA Form 5988-E'
      ],
      timeline: '7 days',
      impact: 'Essential for vehicle safety and operational capability'
    },
    'Weapons Qualification': {
      title: 'Weapons Qualification',
      urgency: 'High',
      recommendations: [
        'Schedule immediate range time for overdue personnel',
        'Conduct weapons zeroing and familiarization',
        'Provide remedial marksmanship training',
        'Ensure ammunition availability for training',
        'Update qualification records in DTMS'
      ],
      resources: [
        'Range Control',
        'Ammunition Supply',
        'Marksmanship Instructors'
      ],
      timeline: '5 days',
      impact: 'Critical for combat readiness and deployment eligibility'
    },
    'PT Test Preparation': {
      title: 'PT Test Preparation',
      urgency: 'High',
      recommendations: [
        'Implement intensive AFT preparation program',
        'Schedule remedial PT for at-risk personnel',
        'Provide nutritional guidance and support',
        'Conduct practice AFT sessions weekly',
        'Monitor individual progress closely'
      ],
      resources: [
        'Master Fitness Trainers',
        'AFT Equipment',
        'Nutrition Specialists'
      ],
      timeline: '30 days',
      impact: 'Required for individual readiness and career progression'
    },
    'Mission Essential Training': {
      title: 'Mission Essential Training',
      urgency: 'Medium',
      recommendations: [
        'Review and update METL tasks for current mission',
        'Schedule collective training exercises',
        'Assess individual task proficiency',
        'Coordinate external training support',
        'Document all training completion'
      ],
      resources: [
        'Training Officers',
        'External Training Sites',
        'METL Documentation'
      ],
      timeline: '21 days',
      impact: 'Essential for mission capability and unit effectiveness'
    },
    'Medical Screening Update': {
      title: 'Medical Screening Update',
      urgency: 'High',
      recommendations: [
        'Schedule annual medical screenings for all personnel',
        'Complete required laboratory tests',
        'Update medical readiness classifications',
        'Address any medical limitations or profiles',
        'Ensure deployment medical requirements are met'
      ],
      resources: [
        'Medical Treatment Facility',
        'Unit Medical Personnel',
        'MEDPROS System'
      ],
      timeline: '14 days',
      impact: 'Critical for deployment eligibility and personnel health'
    },
    'Immunization Records': {
      title: 'Immunization Records',
      urgency: 'High',
      recommendations: [
        'Review all personnel immunization records',
        'Schedule required immunizations immediately',
        'Update MEDPROS with current immunization status',
        'Coordinate with preventive medicine for requirements',
        'Maintain proper documentation'
      ],
      resources: [
        'Preventive Medicine',
        'Medical Treatment Facility',
        'MEDPROS System'
      ],
      timeline: '7 days',
      impact: 'Required for deployment and health protection'
    },
    'Dental Readiness': {
      title: 'Dental Readiness',
      urgency: 'Medium',
      recommendations: [
        'Schedule dental examinations for all personnel',
        'Complete required dental treatments',
        'Update dental readiness classifications',
        'Prioritize personnel with dental class 3 or 4',
        'Maintain dental appointment schedule'
      ],
      resources: [
        'Dental Clinic',
        'Dental Personnel',
        'MEDPROS System'
      ],
      timeline: '30 days',
      impact: 'Important for deployment readiness and personnel health'
    },
    // Generic recommendations for items not specifically mapped
    'Unit Specific Training': {
      title: 'Unit Specific Training',
      urgency: 'Medium',
      recommendations: [
        'Review unit-specific training requirements',
        'Schedule required training sessions',
        'Update training documentation',
        'Assess personnel proficiency levels',
        'Coordinate with subject matter experts'
      ],
      resources: [
        'Training Officers',
        'Subject Matter Experts',
        'Training Materials'
      ],
      timeline: '14 days',
      impact: 'Important for unit capability and readiness'
    },
    'Crew Qualification': {
      title: 'Crew Qualification',
      urgency: 'High',
      recommendations: [
        'Schedule crew qualification training',
        'Conduct crew evaluation assessments',
        'Update crew certification records',
        'Address any training deficiencies',
        'Maintain crew readiness standards'
      ],
      resources: [
        'Qualified Instructors',
        'Training Equipment',
        'Evaluation Materials'
      ],
      timeline: '21 days',
      impact: 'Critical for operational effectiveness'
    },
    'Deployment Readiness': {
      title: 'Deployment Readiness',
      urgency: 'Critical',
      recommendations: [
        'Conduct comprehensive deployment readiness assessment',
        'Complete all deployment requirements immediately',
        'Coordinate with deployment processing station',
        'Verify all personnel and equipment readiness',
        'Update deployment status in all systems'
      ],
      resources: [
        'Deployment Processing Station',
        'S-1 Personnel',
        'Unit Deployment Manager'
      ],
      timeline: '72 hours',
      impact: 'Mission critical for deployment capability'
    },
    'Vehicle Readiness': {
      title: 'Vehicle Readiness',
      urgency: 'Low',
      recommendations: [
        'Increase preventive maintenance schedules',
        'Address parts supply chain issues',
        'Conduct vehicle inspection audits',
        'Train operators on proper vehicle care',
        'Implement vehicle lifecycle management'
      ],
      resources: [
        'Motor Pool Personnel',
        'Parts Supply System',
        'Vehicle Operators'
      ],
      timeline: '14 days',
      impact: 'Important for transportation and logistics capability'
    }
  };

  // Fetch recommendations from backend
  useEffect(() => {
    if (isOpen && priorityItem && unit) {
      setLoading(true);
      setError(null);

      getRecommendations(unit, priorityItem)
        .then(data => {
          setRecommendations(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch recommendations:', err);
          setError(err.message);
          // Fall back to hardcoded data
          const itemTitle = priorityItem.title || priorityItem.name;
          setRecommendations(fallbackRecommendationData[itemTitle] || {
            title: itemTitle,
            urgency: priorityItem.priority || 'Medium',
            recommendations: [
              'Review current status and requirements',
              'Develop action plan to address deficiencies',
              'Coordinate with relevant personnel',
              'Monitor progress regularly',
              'Update status upon completion'
            ],
            resources: [
              'Unit Leadership',
              'Subject Matter Experts',
              'Relevant Documentation'
            ],
            timeline: '7-14 days',
            impact: 'Important for unit readiness and effectiveness'
          });
          setLoading(false);
        });
    }
  }, [isOpen, priorityItem, unit]);

  if (!isOpen || !priorityItem) {
    return null;
  }

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Loading Recommendations...</h2>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="modal-body">
            <p>Fetching recommendations from backend...</p>
            {error && (
              <div className="error-message">
                <p>Error: {error}</p>
                <p>Falling back to cached recommendations...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Recommendations</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="priority-info">
            <h3 className="priority-title">{recommendations.title}</h3>
            <div className="priority-details">
              <span className={`urgency-badge urgency-${recommendations.urgency.toLowerCase()}`}>
                {recommendations.urgency} Priority
              </span>
              <span className="timeline">Timeline: {recommendations.timeline}</span>
            </div>
          </div>

          <div className="impact-section">
            <h4>Impact</h4>
            <p className="impact-text">{recommendations.impact}</p>
          </div>

          <div className="recommendations-section">
            <h4>Recommended Actions</h4>
            <div className="recommendations-list" style={{listStyle: 'none', listStyleType: 'none'}}>
              {recommendations.recommendations.map((recommendation, index) => (
                <div key={index} className="recommendation-item" style={{listStyle: 'none', listStyleType: 'none', display: 'block'}}>
                  {recommendation}
                </div>
              ))}
            </div>
          </div>

          <div className="resources-section">
            <h4>Required Resources</h4>
            <div className="resources-list">
              {recommendations.resources.map((resource, index) => (
                <div key={index} className="resource-item">
                  {resource}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="action-button primary" onClick={onClose}>
            Acknowledge
          </button>
          <button className="action-button secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecommendationsModal;