import { useState, useRef, useEffect } from 'react';

const ProfileMenu = ({ username, onLogout, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const initial = username ? username[0].toUpperCase() : 'U';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={menuRef} style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                    border: '2px solid var(--glass-border)',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                    boxShadow: '0 4px 12px var(--accent-glow)'
                }}
            >
                {initial}
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    width: '200px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '16px',
                    padding: '0.5rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    zIndex: 100,
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{username || 'User'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{username || 'user'}@bank.com</div>
                    </div>

                    <button
                        onClick={() => {
                            setIsOpen(false);
                            if (onNavigate) onNavigate('settings');
                        }}
                        style={{
                            width: '100%',
                            textAlign: 'left',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                        onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseOut={(e) => e.target.style.background = 'transparent'}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        Settings
                    </button>

                    <button
                        onClick={onLogout}
                        style={{
                            width: '100%',
                            textAlign: 'left',
                            background: 'transparent',
                            color: 'var(--danger)',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginTop: '0.25rem'
                        }}
                        onMouseOver={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                        onMouseOut={(e) => e.target.style.background = 'transparent'}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;
