import { useState } from 'react';
import { getSnapshot, getPriority, getKPI, getModal, getUsersUIC } from '../services/api';

const ApiTestComponent = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpointName, apiCall) => {
    try {
      setLoading(true);
      const result = await apiCall();
      setTestResults(prev => ({
        ...prev,
        [endpointName]: { success: true, data: result }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [endpointName]: { success: false, error: error.message }
      }));
    } finally {
      setLoading(false);
    }
  };

  const tests = [
    {
      name: 'Snapshot',
      call: () => getSnapshot(1)
    },
    {
      name: 'Priority',
      call: () => getPriority(1)
    },
    {
      name: 'KPI',
      call: () => getKPI(1, { personnelReadinessScore: true })
    },
    {
      name: 'Modal',
      call: () => getModal(1, { vicModalValue: true })
    },
    {
      name: 'Users/UIC',
      call: () => getUsersUIC('WAMZAA')
    }
  ];

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>API Integration Test</h3>
      <p>Test the backend API endpoints:</p>

      {tests.map(test => (
        <div key={test.name} style={{ marginBottom: '10px' }}>
          <button
            onClick={() => testEndpoint(test.name, test.call)}
            disabled={loading}
          >
            Test {test.name}
          </button>

          {testResults[test.name] && (
            <div style={{
              marginLeft: '10px',
              padding: '5px',
              backgroundColor: testResults[test.name].success ? '#d4edda' : '#f8d7da',
              borderRadius: '3px',
              marginTop: '5px'
            }}>
              {testResults[test.name].success ? (
                <>
                  <strong>✅ Success!</strong>
                  <pre style={{ fontSize: '12px', maxHeight: '100px', overflow: 'auto' }}>
                    {JSON.stringify(testResults[test.name].data, null, 2)}
                  </pre>
                </>
              ) : (
                <>
                  <strong>❌ Failed:</strong> {testResults[test.name].error}
                </>
              )}
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() => {
          tests.forEach(test => testEndpoint(test.name, test.call));
        }}
        disabled={loading}
        style={{ marginTop: '10px', backgroundColor: '#007bff', color: 'white' }}
      >
        Test All Endpoints
      </button>
    </div>
  );
};

export default ApiTestComponent;