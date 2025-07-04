import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './navbar'; // Adjust path as necessary

const AuthenticatedLayout = () => {
  return (
    <>
      <Navbar />
      <div className="flex-grow"> {/* This div ensures content takes remaining space */}
        <Outlet /> {/* Renders the child route component */}
      </div>
    </>
  );
};

export default AuthenticatedLayout;
