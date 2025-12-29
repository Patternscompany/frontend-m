import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Download, LogOut, FileText, User, Calendar, Hash, Activity } from 'lucide-react';
import { format } from 'date-fns';
import API_BASE_URL from '../config';
import Logo from '../assets/logo.png';

const Dashboard = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/registration`);
                setRegistrations(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchRegistrations();
    }, []);

    const handleDownload = async (id, name) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/registration/${id}/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${name}_Report.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            alert('Error downloading PDF');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="container">
            <header className="header">
                <div>
                    <img src={Logo} alt="Vamika Diagnostics" className="logo-img" />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Lab Management Dashboard</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }} className="header-actions">
                    <Link to="/new-registration" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                        <Plus size={18} /> New Registration
                    </Link>
                    <button onClick={handleLogout} className="btn btn-secondary" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </header>

            <div className="card" style={{ padding: '0' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={20} color="var(--primary)" /> Recent Registrations
                    </h2>
                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '1rem', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '600' }}>
                        {registrations.length} Total
                    </span>
                </div>

                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Activity className="animate-spin" size={24} style={{ marginBottom: '0.5rem' }} />
                        <p>Loading registrations...</p>
                    </div>
                ) : (
                    <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
                        <table className="app-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Patient Details</th>
                                    <th>Patient ID</th>
                                    <th>Referred By</th>
                                    <th>Amount</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map((reg) => (
                                    <tr key={reg._id}>
                                        <td data-label="Date">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Calendar size={14} color="var(--text-muted)" />
                                                <span style={{ fontSize: '0.875rem' }}>{format(new Date(reg.createdAt), 'dd MMM yyyy')}</span>
                                            </div>
                                        </td>
                                        <td data-label="Patient Details">
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                                                    <User size={14} color="var(--primary)" />
                                                    {reg.patientName}
                                                </div>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '1.4rem' }}>
                                                    {reg.age}Y / {reg.gender}
                                                </span>
                                            </div>
                                        </td>
                                        <td data-label="Patient ID">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--secondary)', fontSize: '0.875rem' }}>
                                                <Hash size={14} color="var(--text-muted)" />
                                                {reg.patientId}
                                            </div>
                                        </td>
                                        <td data-label="Referred By">
                                            <span style={{ fontSize: '0.875rem' }}>{reg.referredBy}</span>
                                        </td>
                                        <td data-label="Amount">
                                            <span className="badge badge-success">₹{reg.netAmount}</span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleDownload(reg._id, reg.patientName)}
                                                className="btn btn-secondary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                            >
                                                <Download size={14} /> Report
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {registrations.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                                <FileText size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>No registrations found.</p>
                                <Link to="/new-registration" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                    Create First Registration
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
