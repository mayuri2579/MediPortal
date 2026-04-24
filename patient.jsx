import React, { useState } from 'react';
import { 
  User, Phone, Mail, Calendar, Activity, 
  ShieldAlert, ChevronRight, ChevronLeft, CheckCircle,
  FileText, ClipboardList 
} from 'lucide-react';
import './patient.css';

const PatientForm = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dob: '', gender: '',
    email: '', phone: '', address: '', city: '',
    zipCode: '', emergencyName: '', emergencyRelationship: '',
    emergencyPhone: '', bloodGroup: '', allergies: '',
    medications: '', insuranceProvider: '', insuranceId: '',
    history: [], otherHistory: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (condition) => {
    setFormData(prev => {
      const history = prev.history.includes(condition)
        ? prev.history.filter(item => item !== condition)
        : [...prev.history, condition];
      return { ...prev, history };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Using 127.0.0.1 is more reliable than localhost on many Windows environments
      const response = await fetch('http://127.0.0.1:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitted(true);
      } else {
        alert("Registration failed: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Backend se connect nahi ho pa raha! Pehle terminal mein 'node index.cjs' start karein.");
    } finally {
      setLoading(false);
    }
  };

  const commonConditions = [
    "Diabetes", "Hypertension", "Asthma", "Heart Disease", 
    "Thyroid Disorder", "Arthritis", "Anxiety/Depression", "Kidney Disease"
  ];

  const isStepValid = () => {
    if (step === 1) {
      return formData.firstName && formData.lastName && formData.dob && formData.gender && formData.email && formData.phone;
    }
    if (step === 2) {
      return formData.emergencyName && formData.emergencyRelationship && formData.emergencyPhone;
    }
    return true;
  };

  const nextStep = () => {
    if (isStepValid()) {
      setStep(s => s + 1);
    } else {
      alert("Please fill in all required fields before continuing.");
    }
  };

  if (submitted) {
    return (
      <div className="card success-card">
        <div className="success-icon-wrapper">
          <CheckCircle size={48} color="#16a34a" />
        </div>
        <h2>Registration Complete!</h2>
        <p>
          Thank you, <strong>{formData.firstName}</strong>. Your patient record has been successfully created.
        </p>
        <button onClick={() => window.location.reload()} className="btn-primary full-width">
          Register Another Patient
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="header">
        <div className="brand">
          <Activity color="#2563eb" size={32} />
          <h1>HealthGate Medical Center</h1>
        </div>
        <p className="subtitle">New Patient Registration Portal</p>
        
        <div className="progress-bar">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-num">{step > 1 ? <CheckCircle size={16} /> : '1'}</span>
            <span className="step-label">Personal</span>
          </div>
          <div className="step-divider" />
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-num">{step > 2 ? <CheckCircle size={16} /> : '2'}</span>
            <span className="step-label">Emergency</span>
          </div>
          <div className="step-divider" />
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-num">3</span>
            <span className="step-label">Medical</span>
          </div>
        </div>
      </div>

      <div className="form-body">
        <form onSubmit={handleSubmit}>
          
          {step === 1 && (
            <div className="animate-fade">
              <div className="grid">
                <div className="input-group">
                  <label className="label">First Name</label>
                  <div className="input-wrapper">
                    <User className="input-icon" size={18} />
                    <input required name="firstName" value={formData.firstName} onChange={handleChange} className="input input-with-icon" placeholder="John" />
                  </div>
                </div>
                <div className="input-group">
                  <label className="label">Last Name</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleChange} className="input" placeholder="Doe" />
                </div>
              </div>

              <div className="grid">
                <div className="input-group">
                  <label className="label">Date of Birth</label>
                  <div className="input-wrapper">
                    <Calendar className="input-icon" size={18} />
                    <input required type="date" name="dob" value={formData.dob} onChange={handleChange} className="input input-with-icon" />
                  </div>
                </div>
                <div className="input-group">
                  <label className="label">Gender Identity</label>
                  <select required name="gender" value={formData.gender} onChange={handleChange} className="input select-input">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid">
                <div className="input-group">
                  <label className="label">Email Address</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={18} />
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="input input-with-icon" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="input-group">
                  <label className="label">Phone Number</label>
                  <div className="input-wrapper">
                    <Phone className="input-icon" size={18} />
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input input-with-icon" placeholder="1234567890" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade">
              <div className="alert-box">
                <ShieldAlert size={20} />
                <p>Emergency contact information is vital for patient safety.</p>
              </div>
              
              <div className="grid">
                <div className="input-group">
                  <label className="label">Contact Name</label>
                  <input required name="emergencyName" value={formData.emergencyName} onChange={handleChange} className="input" placeholder="Full Name" />
                </div>
                <div className="input-group">
                  <label className="label">Relationship</label>
                  <input required name="emergencyRelationship" value={formData.emergencyRelationship} onChange={handleChange} className="input" placeholder="e.g. Spouse" />
                </div>
              </div>

              <div className="input-group">
                <label className="label">Emergency Phone</label>
                <input required name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} className="input" placeholder="1234567890" />
              </div>

              <div className="section-divider">
                <h3 className="section-title"><FileText size={20} /> Insurance Information</h3>
                <div className="grid">
                  <div className="input-group">
                    <label className="label">Provider Name</label>
                    <input name="insuranceProvider" value={formData.insuranceProvider} onChange={handleChange} className="input" placeholder="e.g. BlueCross" />
                  </div>
                  <div className="input-group">
                    <label className="label">Policy Number</label>
                    <input name="insuranceId" value={formData.insuranceId} onChange={handleChange} className="input" placeholder="ABC-123456" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade">
              <div className="grid">
                <div className="input-group">
                    <label className="label">Blood Group</label>
                    <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="input select-input">
                    <option value="">Select Group</option>
                    <option value="A+">A+</option><option value="B+">B+</option>
                    <option value="O+">O+</option><option value="AB+">AB+</option>
                    </select>
                </div>
              </div>

              <div className="section-divider">
                <h3 className="section-title"><ClipboardList size={20} /> Past Medical History</h3>
                <div className="checkbox-grid">
                  {commonConditions.map((cond) => (
                    <label key={cond} className="history-item">
                      <input type="checkbox" checked={formData.history.includes(cond)} onChange={() => handleCheckboxChange(cond)} />
                      <span>{cond}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label className="label">Current Medications</label>
                <textarea name="medications" rows="2" value={formData.medications} onChange={handleChange} className="input" placeholder="List medications..." />
              </div>

              <div className="consent-box">
                <label>
                  <input type="checkbox" required />
                  <span>I certify that the information provided is accurate.</span>
                </label>
              </div>
            </div>
          )}

          <div className="navigation-footer">
            {step > 1 && (
              <button type="button" onClick={() => setStep(s => s - 1)} className="btn-secondary">
                <ChevronLeft size={20} /> Back
              </button>
            )}

            {step < 3 ? (
              <button type="button" onClick={nextStep} className="btn-primary" style={{marginLeft: 'auto'}}>
                Continue <ChevronRight size={20} />
              </button>
            ) : (
              <button type="submit" disabled={loading} className="btn-success" style={{marginLeft: 'auto'}}>
                {loading ? "Registering..." : "Complete Registration"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;