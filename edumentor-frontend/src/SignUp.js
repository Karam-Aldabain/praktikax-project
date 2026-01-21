import React, { useContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import { AuthContext } from "./App";

export default function SignUp() {
  const { signup } = useContext(AuthContext);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLocalError("");
      await signup(email, fullName, password);
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
                <p className="auth-card__eyebrow">Get started</p>
                <h1 className="auth-card__title">Create your account</h1>
                <p className="auth-card__subtitle">
                  Join cohorts building real-world outcomes with PraktikaX.
                </p>
              </div>

              {localError && <div className="alert alert-danger">{localError}</div>}

              <form onSubmit={handleSignup}>
                <div className="mb-3 text-start">
                  <label htmlFor="name" className="form-label fw-semibold">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3 text-start">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3 text-start">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                  Create Account
                </button>
              </form>

              <div className="auth-footer">
                <small className="text-muted">Already have an account?</small>
                <NavLink to="/login" className="text-primary fw-semibold ms-2">
                  Sign In
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
