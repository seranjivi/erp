import React, { useState } from 'react';
import LifecycleModal5 from './LifecycleModal (5).jsx';
import SalesRequirements from './P010-SalesRequirements (2).jsx';
import SOW from './P020-SOW (1).jsx';
import Projects from './P030-Projects.jsx';
import UserManagement from './P040-UserManagement.jsx';
import Timesheet from './P060-Timesheet (1).jsx';
import ResourceAllocation from './P090-ResourceAllocation (1).jsx';
import ResourceRequest from './ResourceRequest.jsx';

const appContainerStyle = {
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#f5f5f5',
  minHeight: '100vh',
  padding: '10px'
};


const navStyle = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginBottom: '20px'
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500'
};

const buttonActiveStyle = {
  ...buttonStyle,
  backgroundColor: '#0056b3'
};

const componentContainerStyle = {
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  minHeight: '600px'
};

const componentTitleStyle = {
  padding: '15px 20px',
  backgroundColor: '#f8f9fa',
  borderBottom: '1px solid #dee2e6',
  fontSize: '18px',
  fontWeight: '600',
  color: '#333'
};

const componentWrapperStyle = {
  padding: '20px',
  height: '600px',
  overflow: 'auto'
};

function App() {
  const [activeComponent, setActiveComponent] = useState('lifecycle5');

  const components = [
    { id: 'lifecycle5', name: 'Lifecycle Modal', component: LifecycleModal5 },
    { id: 'sales', name: 'Sales Requirements', component: SalesRequirements },
    { id: 'sow', name: 'Statement of Work', component: SOW },
    { id: 'projects', name: 'Projects', component: Projects },
    { id: 'users', name: 'User Management', component: UserManagement },
    { id: 'timesheet', name: 'Timesheet', component: Timesheet },
    { id: 'resources', name: 'Resource Allocation', component: ResourceAllocation },
    { id: 'request', name: 'Resource Request', component: ResourceRequest }
  ];

  const ActiveComponent = components.find(c => c.id === activeComponent)?.component;

  return (
    <div style={appContainerStyle}>
      <div style={navStyle}>
        {components.map(comp => (
          <button
            key={comp.id}
            style={activeComponent === comp.id ? buttonActiveStyle : buttonStyle}
            onClick={() => setActiveComponent(comp.id)}
          >
            {comp.name}
          </button>
        ))}
      </div>

      <div style={componentContainerStyle}>
        <div style={componentTitleStyle}>
          {components.find(c => c.id === activeComponent)?.name}
        </div>
        <div style={componentWrapperStyle}>
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
}

export default App;
