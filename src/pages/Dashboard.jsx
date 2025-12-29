import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Download, LogOut, FileText, User, Calendar } from 'lucide-react';
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
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                        <img src={Logo} alt="" className='' style={{ width: '150px' }} />
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Lab Management Dashboard</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/new-registration" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={20} /> New Registration
                    </Link>
                    <button onClick={handleLogout} className="btn" style={{ backgroundColor: 'var(--danger)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </header>

            <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={24} /> Recent Registrations
                </h2>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                                    <th style={{ padding: '1rem' }}>Date</th>
                                    <th style={{ padding: '1rem' }}>ID</th>
                                    <th style={{ padding: '1rem' }}>Patient Name</th>
                                    <th style={{ padding: '1rem' }}>Referred By</th>
                                    <th style={{ padding: '1rem' }}>Net Amount</th>
                                    <th style={{ padding: '1rem' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map((reg) => (
                                    <tr key={reg._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Calendar size={16} color="var(--text-muted)" />
                                                {format(new Date(reg.createdAt), 'dd MMM yyyy')}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>{reg.patientId}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <User size={16} color="var(--text-muted)" />
                                                {reg.patientName} ( {reg.age}Y / {reg.gender} )
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{reg.referredBy}</td>
                                        <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--success)' }}>₹{reg.netAmount}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <button
                                                onClick={() => handleDownload(reg._id, reg.patientName)}
                                                className="btn"
                                                style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                            >
                                                <Download size={16} /> Download
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {registrations.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No registrations found.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
