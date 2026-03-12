import React, { useState } from 'react';
import LifecycleModal5 from './LifecycleModal (5).jsx';
import SalesRequirements from './P010-SalesRequirements (2).jsx';
import SOW from './P020-SOW (1).jsx';
import Projects from './P030-Projects.jsx';
import UserManagement from './P040-UserManagement.jsx';
import Timesheet from './P060-Timesheet (1).jsx';
import ResourceAllocation from './P090-ResourceAllocation (1).jsx';
import ResourceRequest from './ResourceRequest.jsx';
import Login from './P000-Login.jsx';
import Notifications from './P070-Notifications.jsx';
import Settings from './P110-Settings (1).jsx';
import RolePermission from './P060-RolePermission.jsx';
import HROnboarding from './P100-HROnboarding.jsx';
import InvoiceRequest from './P-INV-InvoiceRequest (1).jsx';

const appContainerStyle = {
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#2c3e50',
  minHeight: '100vh',
  padding: '10px',
  margin: 0,
  width: '100%',
  display: 'flex',
  flexDirection: 'column'
};


const navStyle = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
  width: "100%"
};

const dropdownStyle = {
  padding: "10px 18px",
  fontSize: "14px",
  fontWeight: "600",
  border: "none",
  borderRadius: "8px",
  background: "linear-gradient(90deg,#6D5DF6,#8A63F7)",
  color: "#ffffff",
  cursor: "pointer",
  minWidth: "180px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
};

const dropdownContainerStyle = {
  position: 'relative',
  display: 'inline-block'
};

const dropdownListStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  background: '#6D5DF6',
  borderRadius: '8px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
  zIndex: 1000,
  marginTop: '4px',
  overflow: 'hidden'
};

const dropdownItemStyle = {
  padding: '10px 18px',
  color: '#ffffff',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  transition: 'background-color 0.2s ease',
  border: 'none',
  background: 'transparent'
};

const dropdownItemHoverStyle = {
  ...dropdownItemStyle,
  backgroundColor: 'rgba(255,255,255,0.1)'
};

const dropdownOptionsStyle = {
  background: '#6D5DF6',
  color: "#ffffff"
};

const componentContainerStyle = {
  backgroundColor: '#6D5DF6',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  minHeight: '600px',
  width: '100%',
  maxWidth: 'none'
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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const components = [
    { id: 'lifecycle5', name: 'Lifecycle Modal', component: LifecycleModal5 },
    { id: 'sales', name: 'Sales Requirements', component: SalesRequirements },
    { id: 'sow', name: 'Statement of Work', component: SOW },
    { id: 'projects', name: 'Projects', component: Projects },
    { id: 'users', name: 'User Management', component: UserManagement },
    { id: 'timesheet', name: 'Timesheet', component: Timesheet },
    { id: 'resources', name: 'Resource Allocation', component: ResourceAllocation },
    { id: 'request', name: 'Resource Request', component: ResourceRequest },
    { id: 'login', name: 'Login', component: Login },
    { id: 'notifications', name: 'Notifications', component: Notifications },
    { id: 'settings', name: 'Settings', component: Settings },
    { id: 'roles', name: 'Role Permission', component: RolePermission },
    { id: 'hr', name: 'HR Onboarding', component: HROnboarding },
    { id: 'invoice', name: 'Invoice Request', component: InvoiceRequest }
  ];

  const ActiveComponent = components.find(c => c.id === activeComponent)?.component;
  const selectedComponent = components.find(c => c.id === activeComponent)?.name || 'Select a page...';

  const handleSelect = (componentId) => {
    setActiveComponent(componentId);
    setDropdownOpen(false);
  };

  return (
    <div style={appContainerStyle}>
      <div style={navStyle}>
        <div style={dropdownContainerStyle}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={dropdownStyle}
          >
            {selectedComponent}
            <span style={{marginLeft: '6px'}}>▼</span>
          </button>
          {dropdownOpen && (
            <div style={dropdownListStyle}>
              {components.map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => handleSelect(comp.id)}
                  style={dropdownItemStyle}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  {comp.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={componentContainerStyle}>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}

export default App;
