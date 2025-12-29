import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="glass" style={{ padding: '2.5rem', borderRadius: '1.5rem', width: '400px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'white' }}>Admin Login</h1>
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', outline: 'none' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', outline: 'none' }}
                        />
                    </div>
                    {error && <p style={{ color: '#ff4d4d', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
                    <button className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1.1rem' }}>Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
