import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Save, Eye, ClipboardList, Beaker, BadgeIndianRupee, User } from 'lucide-react';
import API_BASE_URL from '../config';
import Logo from '../assets/logo.png';

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
  const [loading, setLoading] = useState(false);
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
    if (newTests.length === 1 && !newTests[0].testName && !newTests[0].price) {
      newTests[0] = { ...test };
    } else {
      newTests.push({ ...test });
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
    setLoading(true);
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
      alert('Error saving registration. Please check your data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            <ArrowLeft size={18} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 className="font-heading" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>New Registration</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Register a new patient and select tests</p>
          </div>
        </div>
        <img src={Logo} alt="Vamika Diagnostics" className="logo-img" />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="var(--primary)" /> Patient Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label className="input-label">Patient Name</label>
                <input required name="patientName" placeholder="Full Name" value={formData.patientName} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label className="input-label">Age</label>
                <input required type="number" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label className="input-label">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="input-group" style={{ gridColumn: 'span 2', marginBottom: '0' }}>
                <label className="input-label">Referred By</label>
                <input required name="referredBy" placeholder="Doctor or Clinic Name" value={formData.referredBy} onChange={handleInputChange} />
              </div>
            </div>
          </section>

          <section className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ClipboardList size={18} color="var(--primary)" /> Quick Add Tests
              </h3>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {commonTests.map((test, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => addTest(test)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                >
                  + {test.testName}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <section className="card" style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Beaker size={18} color="var(--primary)" /> Selected Tests
                </h3>
                <button type="button" onClick={() => addTest()} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                  <Plus size={14} /> Custom Test
                </button>
              </div>

              <div style={{ marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {formData.tests.map((test, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <input placeholder="Test Name" value={test.testName} onChange={(e) => handleTestChange(index, 'testName', e.target.value)} required />
                    </div>
                    <div style={{ width: '100px' }}>
                      <input placeholder="Price" type="number" value={test.price} onChange={(e) => handleTestChange(index, 'price', e.target.value)} required />
                    </div>
                    {formData.tests.length > 1 && (
                      <button type="button" onClick={() => removeTest(index)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.75rem 0' }}>
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ background: 'var(--background)', padding: '1.25rem', borderRadius: '0.75rem', marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                  <span style={{ fontWeight: '600' }}>₹{totalAmount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Discount (₹)</span>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    style={{ width: '90px', padding: '0.4rem', textAlign: 'right', fontSize: '0.875rem' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', color: 'var(--primary)', borderTop: '2px dashed var(--border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                  <span style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <BadgeIndianRupee size={20} /> Total Payable
                  </span>
                  <span style={{ fontWeight: '800' }}>₹{netAmount}</span>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowPreview(true)} className="btn btn-secondary" style={{ flex: 1 }}>
                  <Eye size={18} /> Preview
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
                  {loading ? 'Processing...' : (
                    <><Save size={18} /> Submit & Generate</>
                  )}
                </button>
              </div>
              </section>
        </div>
      </form>

      {showPreview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1.5rem' }}>
          <div className="card" style={{ background: 'white', width: '100%', maxWidth: '600px', maxHeight: '90vh', padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 className="font-heading" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Registration Summary</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Please verify the details before final submission</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '0.75rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Patient Name</p>
                  <p style={{ fontWeight: '600' }}>{formData.patientName || '-'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Age / Gender</p>
                  <p style={{ fontWeight: '600' }}>{formData.age || '-'} / {formData.gender}</p>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Referred By</p>
                  <p style={{ fontWeight: '600' }}>{formData.referredBy || '-'}</p>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.875rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ClipboardList size={16} color="var(--primary)" /> Selected Tests
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem 0', color: 'var(--text-muted)', fontSize: '0.75rem' }}>TEST NAME</th>
                      <th style={{ textAlign: 'right', padding: '0.75rem 0', color: 'var(--text-muted)', fontSize: '0.75rem' }}>PRICE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.tests.map((t, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '0.75rem 0', fontSize: '0.9375rem' }}>{t.testName}</td>
                        <td style={{ padding: '0.75rem 0', textAlign: 'right', fontSize: '0.9375rem', fontWeight: '500' }}>₹{t.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', borderTop: '2px solid var(--background)', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <span>Subtotal:</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <span>Discount:</span>
                  <span>- ₹{formData.discount}</span>
                </div>
                <div style={{ display: 'flex', gap: '2rem', color: 'var(--primary)', fontSize: '1.25rem', fontWeight: '800', marginTop: '0.25rem' }}>
                  <span>Net Payable:</span>
                  <span>₹{netAmount}</span>
                </div>
              </div>
            </div>

            <div style={{ padding: '1.5rem', background: '#f8fafc', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              <button type="button" onClick={() => setShowPreview(false)} className="btn btn-primary" style={{ padding: '0.75rem 3rem' }}>
                Go Back to Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewRegistration;
