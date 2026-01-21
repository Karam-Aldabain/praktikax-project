import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import ScrollReveal from "./components/ScrollReveal";
import CountUp from "./components/CountUp";
import Carousel from "./components/Carousel";
import { useDocumentMeta } from "./hooks/useDocumentMeta";

function Homepage({ isLoggedIn, role, loading }) {
  useDocumentMeta({
    title: "PraktikaX | Where learning meets real work",
    description:
      "PraktikaX connects learners, institutions, and industry partners through internships, bootcamps, and real-world training.",
    schema: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "PraktikaX",
      url: "https://praktikax.example",
      description:
        "PraktikaX connects learners, institutions, and industry partners through internships, bootcamps, and real-world training.",
    },
  });

  const [submitted, setSubmitted] = useState(false);
  const canManagePrograms = ["super_admin", "content_manager"].includes(role);

  const programCards = [
    {
      title: "Industry Internships",
      text: "Apply to live roles with partner companies and mentors.",
      path: "/industry-internships",
    },
    {
      title: "Co-Hosted Programs",
      text: "Universities and employers co-build pathways with PraktikaX.",
      path: "/co-hosted-programs",
    },
    {
      title: "Custom Training",
      text: "Upskill teams with tailored tracks and measurable outcomes.",
      path: "/custom-training",
    },
    {
      title: "Industrial Courses",
      text: "Employer-reviewed courses with project-driven learning.",
      path: "/industrial-courses",
    },
    {
      title: "Bootcamps",
      text: "Intensive cohorts built for fast career changes.",
      path: "/bootcamps",
    },
    {
      title: "Career Tracks",
      text: "Guided, role-based learning journeys built with mentors.",
      path: "/career-tracks",
    },
    {
      title: "Workshops & Masterclasses",
      text: "Short, live sessions with industry leaders.",
      path: "/workshops-masterclasses",
    },
    {
      title: "Career Mentorship",
      text: "1:1 mentorship with people who hire.",
      path: "/career-mentorship",
    },
  ];

  const insightSlides = [
    "92% of learners complete their first real deliverable within 6 weeks.",
    "Partner companies report 3x faster onboarding readiness.",
    "Mentor-led cohorts show 28% higher placement rates.",
  ];

  return (
    <div className="home-page">
      <header className="hero-section hero-section--home">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="hero-kicker">PraktikaX - Where learning meets real work</p>
              <h1 className="hero-title">
                Build career-ready skills with real industry briefs.
              </h1>
              <p className="hero-subtitle">
                PraktikaX links learners, institutions, and employers through internships,
                co-hosted programs, bootcamps, and mentorship.
              </p>
              <div className="hero-actions">
                <NavLink to="/industry-internships" className="btn btn-primary btn-lg">
                  Explore internships
                </NavLink>
                {!isLoggedIn ? (
                  <NavLink to="/signup" className="btn btn-outline-primary btn-lg">
                    Join PraktikaX
                  </NavLink>
                ) : (
                  <NavLink to="/profile" className="btn btn-outline-primary btn-lg">
                    View dashboard
                  </NavLink>
                )}
              </div>
              {loading && <p className="text-muted mt-3 mb-0">Loading your account...</p>}
            </div>
            <div className="hero-panel">
              <div className="hero-panel__card">
                <h4>Why PraktikaX</h4>
                <ul>
                  <li>
                    <strong>Real briefs</strong>
                    <span>Industry partners submit live project needs.</span>
                  </li>
                  <li>
                    <strong>Mentor-led sprints</strong>
                    <span>Weekly delivery and feedback loops.</span>
                  </li>
                  <li>
                    <strong>Verified outcomes</strong>
                    <span>Portfolio evidence and partner validation.</span>
                  </li>
                </ul>
                <div className="hero-panel__cta">
                  {canManagePrograms ? (
                    <div className="d-flex flex-wrap gap-2">
                      <NavLink to="/admin" className="btn btn-outline-light btn-sm">
                        Manage programs
                      </NavLink>
                      <NavLink to="/admin" className="btn btn-light btn-sm">
                        Add program
                      </NavLink>
                    </div>
                  ) : (
                    <NavLink to="/login" className="btn btn-outline-light btn-sm">
                      Partner access
                    </NavLink>
                  )}
                </div>
              </div>
              <div className="hero-panel__badge">Trusted by 70+ partners</div>
            </div>
          </div>
        </div>
      </header>

      <section className="section-pad">
        <div className="container">
          <ScrollReveal>
            <div className="section-title">
              <h2>Choose your learning format</h2>
              <p>Each path includes dynamic content, mentor guidance, and verified outcomes.</p>
            </div>
            <div className="program-grid">
              {programCards.map((card) => (
                <NavLink key={card.title} to={card.path} className="program-card">
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <span className="program-link">Explore</span>
                </NavLink>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-pad section-contrast">
        <div className="container">
          <ScrollReveal>
            <div className="stat-grid">
              <div className="stat-tile">
                <CountUp value={120} suffix="+" />
                <span>Industry tracks</span>
              </div>
              <div className="stat-tile">
                <CountUp value={86} suffix="%" />
                <span>Placement readiness</span>
              </div>
              <div className="stat-tile">
                <CountUp value={450} suffix="+" />
                <span>Live mentors</span>
              </div>
              <div className="stat-tile">
                <CountUp value={38} suffix="k" />
                <span>Learning hours</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="section-title">
            <h2>Evidence-led learning</h2>
            <p>Data-backed delivery across every program format.</p>
          </div>
          <Carousel items={insightSlides} />
        </div>
      </section>

      <section className="section-pad section-form">
        <div className="container">
          <div className="form-shell">
            <div className="form-copy">
              <h3>Start a partnership call</h3>
              <p>Tell us what you want to build and we will map the right program.</p>
              <ul className="form-benefits">
                <li>Program blueprint in 72 hours</li>
                <li>Dedicated onboarding lead</li>
                <li>Partner dashboard preview</li>
              </ul>
            </div>
            <form
              className="form-card"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">Organization</label>
                  <input className="form-control" placeholder="Company or institution" required />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Contact email</label>
                  <input type="email" className="form-control" placeholder="you@domain.com" required />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Program interest</label>
                  <select className="form-select" required>
                    <option value="">Select one</option>
                    {programCards.map((card) => (
                      <option key={card.title} value={card.title}>
                        {card.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Notes</label>
                  <textarea className="form-control" rows="4" placeholder="Share goals or timelines" />
                </div>
              </div>
              <div className="form-check mt-3">
                <input className="form-check-input" type="checkbox" id="home-captcha" required />
                <label className="form-check-label" htmlFor="home-captcha">
                  I am not a robot
                </label>
              </div>
              <button type="submit" className="btn btn-primary w-100 mt-3">
                Request a call
              </button>
              {submitted && (
                <div className="alert alert-success mt-3 mb-0">
                  Thanks! We will follow up with a program plan.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
