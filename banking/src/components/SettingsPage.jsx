import { useState } from 'react';

const SettingsPage = ({ user, onBack, onUpdateUser }) => {
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);
        console.log(user)
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('/api/user/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: user.id,
                    username,
                    ...(password ? { password } : {})
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Profile updated successfully!');
                onUpdateUser(data.user);
                setPassword('');
            } else {
                setError(data.message || 'Update failed');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            maxWidth: '600px',
            margin: '2rem auto',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--glass-border)',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: 'var(--glass-shadow)',
            color: 'var(--text-primary)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '1rem',
                        padding: '0.5rem',
                        borderRadius: '8px'
                    }}
                    onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    Back
                </button>
                <h2 style={{ margin: '0 auto', fontSize: '1.5rem' }}>Account Settings</h2>
                <div style={{ width: '60px' }}></div> {/* Spacer for centering */}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            border: '1px solid var(--glass-border)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text-primary)',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>New Password (Optional)</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank to keep current"
                        style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            border: '1px solid var(--glass-border)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text-primary)',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                </div>



                {message && (
                    <div style={{
                        color: 'var(--success)',
                        textAlign: 'center',
                        padding: '0.75rem',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '8px'
                    }}>
                        {message}
                    </div>
                )}

                {error && (
                    <div style={{
                        color: 'var(--danger)',
                        textAlign: 'center',
                        padding: '0.75rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '8px'
                    }}>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        borderRadius: '12px',
                        background: 'var(--accent-primary)',
                        color: 'white',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: isLoading ? 'wait' : 'pointer',
                        boxShadow: '0 4px 12px var(--accent-glow)',
                        opacity: isLoading ? 0.7 : 1
                    }}
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default SettingsPage;
