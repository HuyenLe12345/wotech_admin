import React from "react";
import Header from "../Header/Header.jsx";
import Menu from "../Menu/Menu";
const Layout = ({ children }) => {
  return (
    <div
      id="main-wrapper"
      data-theme="light"
      data-layout="vertical"
      data-navbarbg="skin6"
      data-sidebartype="full"
      data-sidebar-position="fixed"
      data-header-position="fixed"
      data-boxed-layout="full"
    >
      <Header />
      <Menu />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
