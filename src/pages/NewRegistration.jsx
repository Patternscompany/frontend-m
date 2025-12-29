import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Save, Eye } from 'lucide-react';
import API_BASE_URL from '../config';

const commonTests = [
  { testName: 'Complete Blood Picture (CBP)', price: 200 },
  { testName: 'Complete Urine Examination (CUE)', price: 100 },
  { testName: 'Erythrocyte Sedimentation Rate (ESR)', price: 100 },
  { testName: 'HIV 1 and 2 Antibodies By Elisa, Serum', price: 400 },
  { testName: 'Hepatitis B Surface Antigen (HbsAg) By Elisa, Serum', price: 350 },
  { testName: 'Glucose Fasting (FBS)', price: 100 },
];

const NewRegistration = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: 'Male',
    referredBy: '',
    tests: [{ testName: '', price: '' }],
    discount: 0
  });
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTestChange = (index, field, value) => {
    const newTests = [...formData.tests];
    newTests[index][field] = value;
    setFormData({ ...formData, tests: newTests });
  };

  const addTest = (test = { testName: '', price: '' }) => {
    const newTests = [...formData.tests];
    // If the last test row is empty, replace it, otherwise append
    if (newTests.length === 1 && !newTests[0].testName && !newTests[0].price) {
      newTests[0] = test;
    } else {
      newTests.push(test);
    }
    setFormData({ ...formData, tests: newTests });
  };

  const removeTest = (index) => {
    const newTests = formData.tests.filter((_, i) => i !== index);
    if (newTests.length === 0) newTests.push({ testName: '', price: '' });
    setFormData({ ...formData, tests: newTests });
  };

  const totalAmount = formData.tests.reduce((sum, test) => sum + (Number(test.price) || 0), 0);
  const netAmount = totalAmount - (Number(formData.discount) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        totalAmount,
        netAmount,
        discount: Number(formData.discount)
      };
      await axios.post(`${API_BASE_URL}/registration`, dataToSubmit);
      navigate('/dashboard');
    } catch (err) {
      alert('Error saving registration');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button type="button" onClick={() => navigate('/dashboard')} className="btn" style={{ background: 'white', color: 'var(--text)' }}><ArrowLeft /></button>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Vamika Diagnostics - New Registration</h1>
      </div>

      <div style={{ marginBottom: '2rem' }} className="glass">
        <h4 style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Quick Add Common Tests</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '1rem' }}>
          {commonTests.map((test, i) => (
            <button
              key={i}
              type="button"
              onClick={() => addTest(test)}
              className="btn"
              style={{ background: '#e2e8f0', fontSize: '0.85rem' }}
            >
              + {test.testName} (₹{test.price})
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Patient Name</label>
            <input required name="patientName" value={formData.patientName} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Age</label>
            <input required type="number" name="age" value={formData.age} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Referred By</label>
            <input required name="referredBy" value={formData.referredBy} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Tests & Pricing
            <button type="button" onClick={() => addTest()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
              <Plus size={16} /> Add Custom Test
            </button>
          </h3>
          {formData.tests.map((test, index) => (
            <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
              <input placeholder="Test Name" value={test.testName} onChange={(e) => handleTestChange(index, 'testName', e.target.value)} style={{ flex: 2, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} required />
              <input placeholder="Price" type="number" value={test.price} onChange={(e) => handleTestChange(index, 'price', e.target.value)} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} required />
              {formData.tests.length > 1 && (
                <button type="button" onClick={() => removeTest(index)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={20} /></button>
              )}
            </div>
          ))}
        </div>

        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem', maxWidth: '300px', marginLeft: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Total:</span>
            <span style={{ fontWeight: 'bold' }}>₹{totalAmount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
            <span>Discount:</span>
            <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} style={{ width: '100px', textAlign: 'right', padding: '0.3rem', borderRadius: '0.4rem', border: '1px solid var(--border)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', color: 'var(--primary)', borderTop: '1px solid var(--border)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ fontWeight: 'bold' }}>Net Payable:</span>
            <span style={{ fontWeight: 'bold' }}>₹{netAmount}</span>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => setShowPreview(true)} className="btn" style={{ background: '#64748b', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Eye size={20} /> Preview</button>
          <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem' }}><Save size={20} /> Submit & Generate Bill</button>
        </div>
      </form>

      {showPreview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass" style={{ background: 'white', padding: '2rem', borderRadius: '1rem', width: '90%', maxWidth: '600px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Registration Preview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <p><strong>Patient:</strong> {formData.patientName}</p>
              <p><strong>Age/Gender:</strong> {formData.age} / {formData.gender}</p>
              <p><strong>Refer By:</strong> {formData.referredBy}</p>
            </div>
            <table style={{ width: '100%', marginBottom: '1.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Test</th>
                  <th style={{ textAlign: 'right', padding: '0.5rem' }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {formData.tests.map((t, i) => (
                  <tr key={i}>
                    <td style={{ padding: '0.5rem' }}>{t.testName}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right' }}>₹{t.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: 'right', fontSize: '1.1rem' }}>
              <p>Total: ₹{totalAmount}</p>
              <p>Discount: ₹{formData.discount}</p>
              <p style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Net: ₹{netAmount}</p>
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button type="button" onClick={() => setShowPreview(false)} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewRegistration;
