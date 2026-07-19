import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      {/* Sidebar - Fixed width */}
      <Sidebar />
      
      {/* Main Content - Takes remaining space */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <main style={{ flex: 1, padding: '2.5rem', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
