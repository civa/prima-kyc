import Navbar from "./Navbar";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout = ({ app, reloadStuffs }) => {
  return (
    <div>
      <Navbar app={app} reloadStuffs={reloadStuffs} />
      <Outlet />
    </div>
  );
};

export default Layout;
