import React from 'react';

const EnvBanner = () => {
  const env = import.meta.env.VITE_ENV;

  if (env !== 'staging') return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: '#f59e0b', // amber-500 color
      color: '#000',
      textAlign: 'center',
      padding: '6px 0',
      fontWeight: 'bold',
      zIndex: 9999,
      fontSize: '14px',
      userSelect: 'none'
    }}>
      🚧 STAGING ENVIRONMENT 🚧
    </div>
  );
};

export default EnvBanner;
