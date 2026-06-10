import React, { useState, useEffect } from 'react';
import LoginScreen from './pages/LoginScreen';
import AuthScreen from './pages/AuthScreen';
import ChatScreen from './pages/ChatScreen';

function App() {
  const [screen, setScreen] = useState('login');
  const [masterVerified, setMasterVerified] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedMaster = localStorage.getItem('master_verified');
    const savedUser = localStorage.getItem('current_user');
    
    if (savedMaster === 'true') {
      setMasterVerified(true);
      if (savedUser) {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[savedUser]) {
          setUser(users[savedUser]);
          setScreen('chat');
        }
      } else {
        setScreen('auth');
      }
    }
  }, []);

  const handleMasterPassword = () => {
    setMasterVerified(true);
    localStorage.setItem('master_verified', 'true');
    setScreen('auth');
  };

  const handleAuth = (userData) => {
    setUser(userData);
    localStorage.setItem('current_user', userData.username);
    setScreen('chat');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('current_user');
    localStorage.removeItem('master_verified');
    setMasterVerified(false);
    setScreen('login');
  };

  return (
    <div className="h-screen w-screen bg-white">
      {!masterVerified && <LoginScreen onSuccess={handleMasterPassword} />}
      {masterVerified && !user && <AuthScreen onSuccess={handleAuth} />}
      {masterVerified && user && <ChatScreen user={user} onLogout={handleLogout} />}
    </div>
  );
}

export default App;
