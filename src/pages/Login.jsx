import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import Logo from '../assets/logo.png';
import { Lock, User } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '1rem'
        }}>
            <div className="card glass" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img src={Logo} alt="Vamika Diagnostics" className="logo-img" style={{ marginBottom: '1rem' }} />
                    <h1 className="font-heading" style={{ fontSize: '1.5rem', color: 'var(--secondary)' }}>Admin Portal</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Please enter your credentials</p>
                </div>
                
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label className="input-label">Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{ paddingLeft: '2.5rem' }}
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ paddingLeft: '2.5rem' }}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{ 
                            backgroundColor: '#fee2e2', 
                            color: '#b91c1c', 
                            padding: '0.75rem', 
                            borderRadius: '0.5rem', 
                            marginBottom: '1rem', 
                            fontSize: '0.875rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <button 
                        className="btn btn-primary" 
                        style={{ width: '100%', marginTop: '0.5rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
