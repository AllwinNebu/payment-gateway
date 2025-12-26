import { useState } from 'react';

const TransactionModal = ({ isOpen, onClose, onSend }) => {
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSend(amount, recipient);
            setAmount('');
            setRecipient('');
            onClose();
        } catch (error) {
            console.error("Transaction failed", error);
            alert("Transaction failed. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '24px',
                padding: '2rem',
                width: '100%',
                maxWidth: '400px',
                boxShadow: 'var(--glass-shadow)',
                color: 'var(--text-primary)'
            }}>
                <h2 style={{ marginTop: 0, marginBottom: '1.5rem', textAlign: 'center' }}>Send Money</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Recipient Name</label>
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            required
                            placeholder="e.g. John Doe"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Amount ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            placeholder="0.00"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: 'white',
                                fontSize: '1.5rem',
                                outline: 'none',
                                fontWeight: 'bold'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '1px solid var(--glass-border)',
                                background: 'transparent',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: 600
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'var(--accent-primary)',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: 600,
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Sending...' : 'Send Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
