import React from 'react'
import Footer from './../Footer/Footer';
import { Outlet } from 'react-router-dom';
import MyNavbar from './../Navbar/Navbar';

export default function Layout() {
  return (
    <>
      <MyNavbar />

      <div className="container w-{80%} mx-auto min-h-screen p-4">
        <Outlet />
      </div>

      <Footer />
    </>
  )
}
