const TransactionHistory = ({ transactions = [] }) => {
    const displayTransactions = transactions.length > 0 ? transactions : [
        { id: 0, name: 'No transactions yet', date: '', amount: 0, type: 'neutral', icon: '-' }
    ];

    return (
        <div style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--glass-border)',
            borderRadius: '24px',
            padding: '2rem',
            height: '100%',
            minHeight: '500px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Recent Transactions</h3>
                <button style={{
                    padding: '0.5rem',
                    background: 'transparent',
                    color: 'var(--accent-primary)',
                    fontSize: '0.9rem'
                }}>View All</button>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                overflowY: 'auto',
                paddingRight: '0.5rem'
            }}>
                {displayTransactions.map((tx) => (
                    <div key={tx.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        transition: 'background 0.2s',
                        cursor: 'pointer'
                    }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: tx.type === 'credit' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: tx.type === 'credit' ? 'var(--success)' : 'var(--danger)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}>
                                {tx.icon}
                            </div>
                            <div>
                                <div style={{ fontWeight: 500 }}>{tx.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{tx.date}</div>
                            </div>
                        </div>
                        <div style={{
                            fontWeight: 600,
                            color: tx.type === 'credit' ? 'var(--success)' : 'var(--text-primary)'
                        }}>
                            {tx.type === 'credit' ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionHistory;
