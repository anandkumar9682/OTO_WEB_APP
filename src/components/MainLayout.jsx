// src/components/MainLayout.jsx
import React from 'react';
import Header from './Header';
import LeftMenu from './LeftMenu';
import { Outlet } from 'react-router-dom';

const MainLayout = () => (
<div className="flex-container">
  <Header />
  <div className="layout-body">
    <LeftMenu />
    <div className="page-content">
      <Outlet />
    </div>
  </div>
</div>
);

export default MainLayout;
