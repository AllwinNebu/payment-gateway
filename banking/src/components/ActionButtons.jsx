const ActionButtons = ({ onSendMoney }) => {
    const buttonStyle = {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '1.25rem',
        borderRadius: '16px',
        fontSize: '1.1rem',
        fontWeight: '600',
        border: '1px solid var(--glass-border)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
            {/* Primary Actions */}
            <div style={{ display: 'flex', gap: '1.5rem' }}>
                <button
                    onClick={onSendMoney}
                    style={{
                        ...buttonStyle,
                        background: 'var(--accent-primary)',
                        color: '#fff',
                        boxShadow: '0 4px 12px var(--accent-glow)',
                        padding: '1.5rem'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.filter = 'brightness(1.1)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.filter = 'none';
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    Send Money
                </button>

                <button
                    style={{
                        ...buttonStyle,
                        background: 'var(--glass-bg)',
                        color: 'var(--text-primary)',
                        padding: '1.5rem'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.background = 'var(--glass-bg)';
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Request
                </button>
            </div>

            {/* Secondary Actions Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem'
            }}>
                {[
                    { icon: <circle cx="12" cy="12" r="10"></circle>, label: 'Top Up' },
                    { icon: <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>, label: 'Bills' },
                    { icon: <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>, label: 'Data' },
                    { icon: <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>, label: 'Utilities' },
                    { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>, label: 'Insurance' },
                    { icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>, label: 'Charity' },
                    { icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>, label: 'Invest' },
                    { icon: <circle cx="12" cy="12" r="3"></circle>, label: 'More' }
                ].map((item, index) => (
                    <button
                        key={index}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '1rem',
                            borderRadius: '16px',
                            border: '1px solid var(--glass-border)',
                            background: 'var(--glass-bg)',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'var(--glass-bg)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {item.icon}
                        </svg>
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ActionButtons;
