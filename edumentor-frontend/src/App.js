import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Homepage from "./Homepage";
import Login from "./Login";
import SignUp from "./SignUp";
import IndustryInternshipsPage, { IndustrialCoursesPage } from "./CoursesPage";
import AdminPage from "./AdminPage";
import ProfilePage from "./ProfilePage";
import { api } from "./api";
import "./App.css";
import ProgramPage from "./ProgramPage";
import PartnerDashboard from "./PartnerDashboard";

export const AuthContext = React.createContext(null);

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 400);
  }, [token]);

  const handleLogin = async (email, password) => {
    setError("");
    try {
      const res = await api.login(email, password);
      setToken(res.access_token);
      localStorage.setItem("token", res.access_token);
      setUser(res.user || null);
      navigate("/");
    } catch (err) {
      if (err.status === 401) handleLogout();
      setError(err.message);
    }
  };

  const handleSignup = async (email, fullName, password) => {
    setError("");
    try {
      const res = await api.register(email, fullName, password);
      setToken(res.access_token);
      localStorage.setItem("token", res.access_token);
      setUser(res.user || null);
      navigate("/");
    } catch (err) {
      if (err.status === 401) handleLogout();
      setError(err.message);
    }
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const authValue = useMemo(
    () => ({
      token,
      user,
      isLoggedIn: !!user && !!token,
      role: user?.role || "student",
      login: handleLogin,
      signup: handleSignup,
      logout: handleLogout,
      setError,
    }),
    [token, user]
  );

  return (
    <AuthContext.Provider value={authValue}>
      <div className="app-shell">
        <Navbar isLoggedIn={!!user} role={user?.role} onLogout={handleLogout} />
        {error && (
          <div className="alert alert-danger text-center rounded-0 mb-0">
            {error}
          </div>
        )}
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <Homepage
                  isLoggedIn={!!user}
                  role={user?.role || "student"}
                  loading={loading}
                />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/industry-internships" element={<IndustryInternshipsPage />} />
            <Route path="/co-hosted-programs" element={<ProgramPage pageKey="co-hosted-programs" />} />
            <Route path="/custom-training" element={<ProgramPage pageKey="custom-training" />} />
            <Route path="/industrial-courses" element={<IndustrialCoursesPage />} />
            <Route path="/bootcamps" element={<ProgramPage pageKey="bootcamps" />} />
            <Route path="/career-tracks" element={<ProgramPage pageKey="career-tracks" />} />
            <Route path="/workshops-masterclasses" element={<ProgramPage pageKey="workshops-masterclasses" />} />
            <Route path="/career-mentorship" element={<ProgramPage pageKey="career-mentorship" />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/partner" element={<PartnerDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
}

function Navbar({ isLoggedIn, role, onLogout }) {
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Internships", path: "/industry-internships" },
    { label: "Co-Hosted", path: "/co-hosted-programs" },
    { label: "Training", path: "/custom-training" },
    { label: "Courses", path: "/industrial-courses" },
    { label: "Bootcamps", path: "/bootcamps" },
    { label: "Career Tracks", path: "/career-tracks" },
    { label: "Workshops", path: "/workshops-masterclasses" },
    { label: "Mentorship", path: "/career-mentorship" },
  ];

  return (
    <nav className="navbar navbar-expand-lg main-nav">
      <div className="container d-flex justify-content-between align-items-center">
        <NavLink to="/" className="navbar-brand brand fs-4 ms-2">
          PraktikaX
        </NavLink>

        <div className="collapse navbar-collapse justify-content-end show">
          <ul className="navbar-nav align-items-center gap-3 nav-grid">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <NavLink to={item.path} className="nav-link">
                  {item.label}
                </NavLink>
              </li>
            ))}
            {isLoggedIn && (
              <li className="nav-item">
                <NavLink to="/profile" className="nav-link">
                  Dashboard
                </NavLink>
              </li>
            )}
            {role === "admin" && (
              <li className="nav-item">
                <NavLink to="/admin" className="nav-link">
                  Admin
                </NavLink>
              </li>
            )}
            {role === "partner_view" && (
              <li className="nav-item">
                <NavLink to="/partner" className="nav-link">
                  Partner
                </NavLink>
              </li>
            )}
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className="btn btn-outline-primary px-4 py-1 rounded-pill fw-semibold">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/signup" className="btn btn-primary px-4 py-1 rounded-pill fw-semibold">
                    Sign Up
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button onClick={onLogout} className="btn btn-outline-danger fw-semibold rounded-pill px-3">
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>PraktikaX</h4>
            <p>
              Where learning meets real work. We connect learners, institutions, and
              employers through verified programs.
            </p>
          </div>
          <div>
            <h5>Programs</h5>
            <ul>
              <li>
                <NavLink to="/industry-internships">Industry Internships</NavLink>
              </li>
              <li>
                <NavLink to="/bootcamps">Bootcamps</NavLink>
              </li>
              <li>
                <NavLink to="/career-mentorship">Career Mentorship</NavLink>
              </li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li>
                <NavLink to="/co-hosted-programs">Co-Hosted Programs</NavLink>
              </li>
              <li>
                <NavLink to="/custom-training">Custom Training</NavLink>
              </li>
              <li>
                <NavLink to="/workshops-masterclasses">Workshops</NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-meta">
          <span>PraktikaX platform preview</span>
          <span>Contact: hello@praktikax.io</span>
        </div>
      </div>
    </footer>
  );
}

export default App;
