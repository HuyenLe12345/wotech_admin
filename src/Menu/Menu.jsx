import React, { useState } from "react";

function Menu(props) {
  // State to track whether the Tables submenu is open
  const [openTable, setOpenTable] = useState(false);

  // Function to toggle the submenu
  const clickHandler = () => {
    setOpenTable(!openTable); // Toggle the open state
  };

  return (
    <aside className="left-sidebar" data-sidebarbg="skin6">
      <div className="scroll-sidebar" data-sidebarbg="skin6">
        <nav className="sidebar-nav">
          <ul id="sidebarnav">
            <li className="sidebar-item">
              <a className="sidebar-link sidebar-link" href="/">
                <i data-feather="home" className="feather-icon"></i>
                <span className="hide-menu">Dashboard</span>
              </a>
            </li>
            <li className="list-divider"></li>

            <li className="nav-small-cap">
              <span className="hide-menu">Components</span>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link sidebar-link" href="/new">
                <i data-feather="settings" className="feather-icon"></i>
                <span className="hide-menu">New Product</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link sidebar-link" href="/chat">
                <i data-feather="message-square" className="feather-icon"></i>
                <span className="hide-menu">Customer</span>
              </a>
            </li>
            <li className="sidebar-item">
              {/* Click handler added here */}
              <a
                className="sidebar-link has-arrow"
                href="#"
                onClick={clickHandler} // Toggle submenu on click
                aria-expanded={openTable} // Update aria-expanded based on state
              >
                <i data-feather="grid" className="feather-icon"></i>
                <span className="hide-menu">Tables</span>
              </a>
              {/* Conditional rendering of the submenu */}
              {openTable && (
                <ul
                // aria-expanded={openTable}
                // className="first-level base-level-line"
                >
                  <li className="sidebar-item">
                    <a href="/users" className="sidebar-link">
                      <span className="hide-menu">Users</span>
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="/products" className="sidebar-link">
                      <span className="hide-menu">Products</span>
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="/history" className="sidebar-link">
                      <span className="hide-menu">History</span>
                    </a>
                  </li>
                </ul>
              )}
            </li>

            <li className="list-divider"></li>
            <li className="nav-small-cap">
              <span className="hide-menu">Authentication</span>
            </li>

            <li className="sidebar-item">
              <a
                className="sidebar-link sidebar-link"
                href="/login"
                aria-expanded={false}
              >
                <i data-feather="lock" className="feather-icon"></i>
                <span className="hide-menu">Login</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a
                className="sidebar-link sidebar-link"
                href="/register"
                aria-expanded={false}
              >
                <i data-feather="lock" className="feather-icon"></i>
                <span className="hide-menu">Register</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default Menu;
