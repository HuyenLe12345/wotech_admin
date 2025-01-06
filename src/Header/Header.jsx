import React from "react";
import { AuthContext } from "../Context/AuthContext";
import { useContext, useState, useEffect } from "react";

import { Link, Redirect } from "react-router-dom";
import Logoicon from "../Image/logo-icon.png";
import Logotext from "../Image/logo-text.png";
import Logolight from "../Image/logo-light-text.png";

function Header(props) {
  const { user } = useContext(AuthContext);
  console.log(user);
  const { loading, error, dispatch } = useContext(AuthContext);
  const [hello, setHello] = useState(localStorage.getItem("name_user"));
  // trang thái mở /đóng logout
  const [openTable, setOpenTable] = useState(false);
  const [redirect, setRedirect] = useState(false);
  // Function to toggle the logout
  const clickHandler = () => {
    setOpenTable(!openTable); // Toggle the open state
  };
  // hàm log out

  const handleLogout = () => {
    localStorage.removeItem("id_user");
    localStorage.removeItem("name_user");
    localStorage.removeItem("token");
    setHello(null);
    setOpenTable(!openTable);
    dispatch("LOGOUT");
    setRedirect(true);
  };
  useEffect(() => {
    if (user) {
      setHello(user.fullname);
    }
  }, [user]);
  // Redirect to login if logout is triggered
  if (redirect) {
    window.location.reload();
  }

  return (
    <header className="topbar" data-navbarbg="skin6">
      <nav className="navbar top-navbar navbar-expand-md">
        <div className="navbar-header" data-logobg="skin6">
          <a
            className="nav-toggler waves-effect waves-light d-block d-md-none"
            href="#"
          >
            <i className="ti-menu ti-close"></i>
          </a>

          <div className="navbar-brand">
            <Link to="/">
              {/* <b className='logo-icon'>
								<img
									src={Logoicon}
									alt='homepage'
									className='dark-logo'
								/>
								<img
									src={Logoicon}
									alt='homepage'
									className='light-logo'
								/>
							</b> */}
              <span className="logo-text">
                {/* <img
									src={Logotext}
									alt='homepage'
									className='dark-logo'
								/>
								<img
									src={Logolight}
									className='light-logo'
									alt='homepage'
								/> */}
                <span>Admin Page</span>
              </span>
            </Link>
          </div>
          {/* <a
						className='topbartoggler d-block d-md-none waves-effect waves-light'
						href='#'
						data-toggle='collapse'
						data-target='#navbarSupportedContent'
						aria-controls='navbarSupportedContent'
						aria-expanded='false'
						aria-label='Toggle navigation'>
						<i className='ti-more'></i>
					</a> */}
        </div>
        <div className="navbar-collapse collapse" id="navbarSupportedContent">
          <ul className="navbar-nav float-left mr-auto ml-3 pl-1">
            <li className="nav-item dropdown">
              {/* <a
								className='nav-link dropdown-toggle'
								href='#'
								id='navbarDropdown'
								role='button'
								data-toggle='dropdown'
								aria-haspopup='true'
								aria-expanded='false'>
								<i data-feather='settings' className='svg-icon'></i>
							</a> */}
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="#">
                  Action
                </a>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </div>
            </li>
          </ul>
          <ul className="navbar-nav float-right">
            {hello && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  // data-toggle="dropdown"
                  // aria-haspopup="true"
                  aria-expanded={openTable}
                  onClick={clickHandler}
                >
                  {/* <img
									src='../assets/images/users/IMG_6225.jpg'
									alt='user'
									className='rounded-circle'
									width='40'
								/> */}
                  <span className="ml-2 d-none d-lg-inline-block">
                    <span>Hello,</span>{" "}
                    <span className="text-dark">
                      {user
                        ? user.fullname
                        : localStorage.getItem("name_user")
                        ? localStorage.getItem("name_user")
                        : ""}
                    </span>{" "}
                    <i data-feather="chevron-down" className="svg-icon"></i>
                  </span>
                </a>
                {openTable && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-50%",
                      zIndex: 100,
                      background: "white",
                      margin: "20px",
                      width: "100%",
                      pointer: "cursor",
                    }}
                    onClick={handleLogout}
                  >
                    <a className="dropdown-item">
                      <i className="svg-icon mr-2 ml-1"></i>
                      Logout
                    </a>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
