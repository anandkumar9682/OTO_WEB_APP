import React, { useEffect, useState } from 'react';

const Toast = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        backgroundColor: '#333',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: 5,
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
        zIndex: 9999,
      }}
    >
      {message}
      <button
        style={{ marginLeft: 10, background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
        onClick={() => {
          setVisible(false);
          onClose();
        }}
      >
        ✖
      </button>
    </div>
  );
};

export default Toast;
