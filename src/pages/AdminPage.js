// src/AdminPage.js
import React, { useState } from 'react';
import Admin from './Admin';
import Login from './AdminLogin';

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return isLoggedIn ? <Admin /> : <Login onLogin={handleLogin} />;
};

export default AdminPage;
