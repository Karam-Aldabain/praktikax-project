import React, { useContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { NavLink } from "react-router-dom";
import { AuthContext } from "./App";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLocalError("");
      await login(email, password);
    } catch (err) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="auth-card">
              <div className="auth-card__header text-center">
                <p className="auth-card__eyebrow">Welcome back</p>
                <h1 className="auth-card__title">Sign in to PraktikaX</h1>
                <p className="auth-card__subtitle">
                  Access your programs, applications, and partner updates.
                </p>
              </div>

              {localError && <div className="alert alert-danger py-2">{localError}</div>}

              <form onSubmit={handleLogin}>
                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                  Sign In
                </button>
              </form>

              <div className="auth-footer">
                <small className="text-muted">Don't have an account?</small>
                <NavLink to="/signup" className="text-primary fw-semibold ms-2">
                  Sign Up
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
