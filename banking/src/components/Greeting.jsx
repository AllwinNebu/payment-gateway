import { useState, useEffect } from 'react';

const Greeting = ({ username }) => {
    const [greeting, setGreeting] = useState('Good Morning');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    return (
        <div className="greeting-container" style={{
            marginBottom: '2rem',
            animation: 'fadeIn 0.5s ease-out'
        }}>
            <h2 style={{
                color: 'var(--text-secondary)',
                fontSize: '1.1rem',
                fontWeight: 400,
                margin: 0
            }}>
                {greeting}, {username || 'User'}
            </h2>
            <h1 style={{
                marginTop: '0.25rem',
                fontSize: '2.5rem',
                background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
            }}>
                Welcome Back
            </h1>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default Greeting;
