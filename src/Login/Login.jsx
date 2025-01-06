import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import UserAPI from "../API/UserAPI";
import { AuthContext } from "../Context/AuthContext";

import queryString from "query-string";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorLogin, setErrorLogin] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const { loading, error, dispatch } = useContext(AuthContext);

  const handleSubmit = () => {
    const fetchLogin = async () => {
      const params = {
        email: email,
        password: password,
      };
      console.log("PARAMS", params);
      const query = "?" + queryString.stringify(params);
      const response = await UserAPI.postLogin(query);
      console.log("response", response);
      if (response && response.error) {
        const err = response.error;
        if (err.path === "email") {
          setErrorEmail(true);
          setErrorPassword(false);
          setErrorLogin(err.msg);
        } else if (err.path === "password") {
          setErrorEmail(false);
          setErrorPassword(true);
          setErrorLogin(err.msg);
        }
      }
      if (response && response.message === "Success") {
        const user = response.user;

        setErrorEmail(false);
        setErrorPassword(false);
        setErrorLogin(null);
        localStorage.setItem("id_user", user._id);

        localStorage.setItem("name_user", user.fullname);
        localStorage.setItem("token", user.token);
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        setRedirect(true);
        return;
      }
    };
    fetchLogin();
  };

  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <div className="login">
            <div className="heading">
              <h2>Sign in</h2>
              <div>
                {errorEmail && (
                  <span className="text-danger">{errorLogin}</span>
                )}
                {errorPassword && (
                  <span className="text-danger">{errorLogin}</span>
                )}
              </div>
              <form>
                <div className="input-group input-group-lg">
                  <span className="input-group-addon">
                    <i className="fa fa-user"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="input-group input-group-lg">
                  <span className="input-group-addon">
                    <i className="fa fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {redirect && <Redirect to={`/`} />}
                <button type="button" className="float" onClick={handleSubmit}>
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
