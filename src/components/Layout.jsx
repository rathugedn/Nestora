import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import './Layout.css';

const Layout = () => {
  const [showWarning, setShowWarning] = useState(true);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Nestora. All rights reserved.</p>
        <p>Created by DEVI.</p>
      </footer>
    </div>
  );
};

export default Layout;