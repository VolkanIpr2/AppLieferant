// Spinner.js
import React from 'react';

const Spinner = () => (
  <div className="spinner" style={{
    width: '20px',
    height: '20px',
    border: '3px solid white',
    borderTop: '3px solid #007BFF',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    color: "white",
    alignSelf: "center"
  }}></div>
);

export default Spinner;