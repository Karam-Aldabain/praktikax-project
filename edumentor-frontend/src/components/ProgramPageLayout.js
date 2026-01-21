import React, { useContext, useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import Carousel from "./Carousel";
import CountUp from "./CountUp";
import ScrollReveal from "./ScrollReveal";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { api } from "../api";
import RecaptchaV2 from "./RecaptchaV2";
import { AuthContext } from "../App";

const buildSchema = (page) => {
  const base = {
    "@context": "https://schema.org",
    name: page.hero?.title,
    description: page.meta?.description,
    provider: {
      "@type": "Organization",
      name: "PraktikaX",
    },
  };
  if (page.meta?.schemaType === "Event") {
    return {
      "@type": "Event",
      ...base,
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    };
  }
  if (page.meta?.schemaType === "Course") {
    return {
      "@type": "Course",
      ...base,
    };
  }
  return {
    "@type": "Organization",
    ...base,
  };
};

export default function ProgramPageLayout({
  page,
  slug,
  children,
  prefill = null,
  showAdminActions = true,
}) {
  const { role } = useContext(AuthContext);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formState, setFormState] = useState(() => (prefill ? { ...prefill } : {}));
  const canManagePrograms = ["super_admin", "content_manager"].includes(role);
  const schema = useMemo(() => buildSchema(page), [page]);
  const formFields = useMemo(() => {
    const base = page.form?.fields || [];
    const needsProgram = prefill?.program && !base.some((field) => field.name === "program");
    if (needsProgram) {
      return [
        { name: "program", label: "Selected program", type: "text", required: true, readOnly: true },
        ...base,
      ];
    }
    return base;
  }, [page.form?.fields, prefill?.program]);
  const captchaId = `${slug || page.key || "page"}-captcha`;

  useEffect(() => {
    if (!prefill) return;
    setFormState((prev) => ({ ...prev, ...prefill }));
  }, [prefill]);

  useEffect(() => {
    const loadCsrf = async () => {
      try {
        const res = await api.getCsrfToken();
        if (res?.csrf_token) {
          setFormState((prev) => ({ ...prev, csrf_token: res.csrf_token }));
        }
      } catch (err) {
        setError("Unable to initialize form security.");
      }
    };
    loadCsrf();
  }, []);

  useDocumentMeta({
    title: page.meta?.title,
    description: page.meta?.description,
    schema,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!formState.captcha_token) {
      setError("Please complete the CAPTCHA.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = new FormData();
      if (formState.csrf_token) {
        payload.append("csrf_token", formState.csrf_token);
      }
      formFields.forEach((field) => {
        const value = formState[field.name];
        if (value !== undefined && value !== null && value !== "") {
          payload.append(field.name, value);
        }
      });
      payload.append("captcha_token", formState.captcha_token || "confirmed");
      await api.submitForm(slug || page?.slug, payload, formState.csrf_token);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`program-page program-page--${page.hero?.background || "default"}`}>
      <header className="program-hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="section-title d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                <div>
                  <p className="hero-kicker">{page.hero?.kicker}</p>
                  <h1 className="hero-title">{page.hero?.title}</h1>
                  <p className="hero-subtitle">{page.hero?.subtitle}</p>
                  <div className="hero-actions">
                    <a className="btn btn-primary btn-lg" href="#program-form">
                      Get started
                    </a>
                    <a className="btn btn-outline-primary btn-lg" href="#program-form">
                      Talk to us
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-panel">
              {showAdminActions && canManagePrograms && (
                <div className="d-flex flex-wrap justify-content-end gap-2 mb-3">
                  <NavLink to="/admin" className="btn btn-outline-primary btn-sm">
                    Manage programs
                  </NavLink>
                  <NavLink to="/admin" className="btn btn-primary btn-sm">
                    Add program
                  </NavLink>
                </div>
              )}
              <div className="hero-panel__card">
                <h4 className="hero-panel__title">Program highlights</h4>
                <ul className="hero-panel__list">
                  {page.highlights?.slice(0, 3).map((item) => (
                    <li key={item.title}>
                      <strong>{item.title}</strong>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="section-pad">
        <div className="container">
          <ScrollReveal>
            <div className="stat-grid">
              {page.stats?.map((stat) => (
                <div className="stat-tile" key={stat.label}>
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix ?? (stat.label.includes("Avg.") ? "%" : "+")}
                  />
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-pad section-contrast">
        <div className="container">
          <ScrollReveal>
            <div className="highlight-grid">
              {page.highlights?.map((item) => (
                <div className="highlight-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {page.carousel && (
        <section className="section-pad">
          <div className="container">
            <div className="section-title">
              <h2>{page.carousel.title}</h2>
              <p>Rotating insights from program partners and mentors.</p>
            </div>
            <Carousel items={page.carousel.items} />
          </div>
        </section>
      )}

      {page.timeline && (
        <section className="section-pad section-muted">
          <div className="container">
            <div className="section-title">
              <h2>Bootcamp timeline</h2>
              <p>Progress markers from onboarding to hiring.</p>
            </div>
            <div className="timeline">
              {page.timeline.map((item, index) => (
                <ScrollReveal key={item.title} className="timeline-item">
                  <div className="timeline-index">{index + 1}</div>
                  <div className="timeline-content">
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.richText && (
        <section className="section-pad">
          <div className="container">
            <div
              className="rich-text"
              dangerouslySetInnerHTML={{ __html: page.richText }}
            />
          </div>
        </section>
      )}

      {children && (
        <section className="section-pad">
          <div className="container">{children}</div>
        </section>
      )}

      <section className="section-pad section-form">
        <div className="container" id="program-form">
          <div className="form-shell">
            <div className="form-copy">
              <h3>{page.form?.title}</h3>
              <p>{page.form?.description}</p>
              <ul className="form-benefits">
                <li>Dedicated onboarding specialist</li>
                <li>Response in 48 hours</li>
                <li>Access to partner network</li>
              </ul>
            </div>
            <form className="form-card" onSubmit={handleSubmit}>
              <div className="row g-3">
                {formFields.map((field) => {
                  const isTextarea = field.type === "textarea";
                  const isSelect = field.type === "select";
                  const isFile = field.type === "file";
                  return (
                    <div className="col-12" key={field.name}>
                      <label className="form-label fw-semibold">{field.label}</label>
                      {isTextarea ? (
                        <textarea
                          className="form-control"
                          rows="4"
                          placeholder={field.placeholder}
                          required={field.required}
                          value={formState[field.name] || ""}
                          onChange={(event) =>
                            setFormState((prev) => ({
                              ...prev,
                              [field.name]: event.target.value,
                            }))
                          }
                        />
                      ) : isSelect ? (
                        <select
                          className="form-select"
                          required={field.required}
                          value={formState[field.name] || ""}
                          onChange={(event) =>
                            setFormState((prev) => ({
                              ...prev,
                              [field.name]: event.target.value,
                            }))
                          }
                        >
                          <option value="">Select one</option>
                          {field.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="form-control"
                          type={isFile ? "file" : field.type}
                          accept={field.accept}
                          placeholder={field.placeholder}
                          required={field.required}
                          readOnly={field.readOnly}
                          value={!isFile ? formState[field.name] || "" : undefined}
                          onChange={(event) =>
                            setFormState((prev) => ({
                              ...prev,
                              [field.name]: isFile ? event.target.files?.[0] : event.target.value,
                            }))
                          }
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-3">
                <RecaptchaV2
                  captchaId={captchaId}
                  onChange={(token) =>
                    setFormState((prev) => ({ ...prev, captcha_token: token }))
                  }
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 mt-3" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit request"}
              </button>
              {submitted && (
                <div className="alert alert-success mt-3 mb-0">
                  Thanks! We will reach out with next steps.
                </div>
              )}
              {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
              {formState && (
                <p className="form-note">
                  By submitting, you agree to PraktikaX privacy and data policies.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
