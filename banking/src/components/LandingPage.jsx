import { useState, useEffect, useCallback } from 'react';
import Greeting from './Greeting';
import BalanceCard from './BalanceCard';
import ActionButtons from './ActionButtons';
import TransactionHistory from './TransactionHistory';
import ProfileMenu from './ProfileMenu';
import TransactionModal from './TransactionModal';
import { api } from '../services/api';
import SettingsPage from './SettingsPage';

const LandingPage = ({ user, onLogout, onUpdateUser }) => {
    const [balance, setBalance] = useState(user?.balance || 0);
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState('dashboard');

    const fetchData = useCallback(async () => {
        if (!user?.id) return;
        try {
            const balanceData = await api.getBalance(user.id);
            setBalance(balanceData.balance);

            const txData = await api.getTransactions(user.id);
            setTransactions(txData.transactions);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSendMoney = async (amount, recipient) => {
        const result = await api.sendMoney(amount, recipient, user?.id);
        if (result && result.status === "pending_secondary_approval") {
            alert(`Transaction pending approval!\n\nPlease approve the transaction of $${amount} on your secondary device.\nTransaction ID: ${result.transaction_id}`);
        }
        await fetchData(); // Refresh data after transaction
    };

    if (currentView === 'settings') {
        return (
            <SettingsPage
                user={user}
                onBack={() => setCurrentView('dashboard')}
                onUpdateUser={onUpdateUser}
            />
        );
    }

    return (
        <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '2rem',
            minHeight: '100vh',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)',
            gap: '3rem',
            alignItems: 'start'
        }}>
            {/* Left Column */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                paddingTop: '2rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Greeting username={user?.username} />
                    {/* Mobile/Tablet Profile Menu Position */}
                    <div style={{ display: 'none', '@media (max-width: 1024px)': { display: 'block' } }}>
                        <ProfileMenu username={user?.username} onLogout={onLogout} onNavigate={setCurrentView} />
                    </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <BalanceCard balance={balance} />
                    <ActionButtons onSendMoney={() => setIsModalOpen(true)} />
                </div>


            </div>

            {/* Right Column */}
            <div style={{ height: 'calc(100vh - 4rem)', position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ alignSelf: 'flex-end' }}>
                    <ProfileMenu username={user?.username} onLogout={onLogout} onNavigate={setCurrentView} />
                </div>
                <TransactionHistory transactions={transactions} />
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSend={handleSendMoney}
            />

            <style>{`
        @media (max-width: 1024px) {
          div[style*="display: grid"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="position: sticky"] {
             position: static !important;
             height: auto !important;
          }
        }
      `}</style>
        </div>
    );
};

export default LandingPage;
