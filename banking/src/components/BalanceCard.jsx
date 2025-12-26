import { useState } from 'react';

const BalanceCard = ({ balance }) => {
    const [isVisible, setIsVisible] = useState(true);

    const formattedBalance = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(balance || 0);

    return (
        <div className="balance-card" style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--glass-shadow)',
            borderRadius: '24px',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '220px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 60%)',
                opacity: 0.2,
                pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontWeight: 500
                }}>
                    Total Balance
                </span>
                <button
                    onClick={() => setIsVisible(!isVisible)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '4px',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    title={isVisible ? "Hide Balance" : "Show Balance"}
                >
                    {isVisible ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07-2.3 2.3"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    )}
                </button>
            </div>

            <div style={{
                fontSize: '3.5rem',
                fontWeight: 700,
                margin: '0.5rem 0',
                color: 'var(--text-primary)',
                letterSpacing: '-1px'
            }}>
                {isVisible ? formattedBalance : '••••••••'}
            </div>


        </div>
    );
};

export default BalanceCard;
