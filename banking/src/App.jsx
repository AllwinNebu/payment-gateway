import { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    user ? <LandingPage user={user} onLogout={() => setUser(null)} onUpdateUser={setUser} /> : <LoginPage onLogin={(userData) => setUser(userData)} />
  );
}

export default App;
