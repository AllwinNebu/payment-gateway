import { useState } from 'react';

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('authToken', data.token);
                onLogin(data.user);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Unable to connect to server');
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '3rem',
                borderRadius: '24px',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--glass-shadow)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Please sign in to continue</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); setError(''); }}
                            style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            placeholder="Enter username"
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            placeholder="Enter password"
                        />
                    </div>

                    {error && (
                        <div style={{
                            color: 'var(--danger)',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                            padding: '0.5rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '8px'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        style={{
                            marginTop: '0.5rem',
                            background: 'var(--accent-primary)',
                            color: 'white',
                            boxShadow: '0 4px 12px var(--accent-glow)'
                        }}
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
