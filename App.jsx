import React from 'react';
import PatientForm from './patient';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <PatientForm />
      <p className="footer-text">
        Your data is encrypted and protected under HIPAA compliance guidelines.<br />
        © 2024 HealthGate Medical Systems
      </p>
    </div>
  );
};

export default App;