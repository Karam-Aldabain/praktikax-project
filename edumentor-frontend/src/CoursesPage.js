import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgramPageLayout from "./components/ProgramPageLayout";
import { getProgramPage } from "./data/programPages";
import { api } from "./api";
import { AuthContext } from "./App";

const normalize = (value) => String(value || "").trim().toLowerCase();

const matchesCategory = (category, target) => {
  const normalized = normalize(category);
  const desired = normalize(target);
  if (!normalized || !desired) return false;
  if (normalized === desired) return true;
  if (normalized === `${desired}s`) return true;
  return false;
};

const formatBadge = (category, value) => {
  const amount = Number(value || 0);
  if (normalize(category) === "course") {
    return amount === 0 ? "Free" : `$${amount.toFixed(2)}`;
  }
  return amount === 0 ? "Unpaid" : `$${amount.toFixed(2)}/month`;
};

function ProgramCatalogPage({
  pageKey,
  category,
  title,
  description,
  searchPlaceholder,
  emptyDefault,
  ctaLabel,
}) {
  const page = useMemo(() => getProgramPage(pageKey), [pageKey]);
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.listPrograms();
        const list = res?.programs || [];
        setPrograms(list.filter((item) => matchesCategory(item.category, category)));
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category]);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visiblePrograms =
    normalizedSearch.length === 0
      ? programs
      : programs.filter((p) => {
          const titleMatch = (p.title || "").toLowerCase();
          const descriptionMatch = (p.description || "").toLowerCase();
          const companyMatch = (p.partner || "").toLowerCase();
          return (
            titleMatch.includes(normalizedSearch) ||
            descriptionMatch.includes(normalizedSearch) ||
            companyMatch.includes(normalizedSearch)
          );
        });

  const prefill = useMemo(
    () => (selectedProgram ? { program: selectedProgram } : null),
    [selectedProgram]
  );

  return (
    <ProgramPageLayout page={page} slug={pageKey} prefill={prefill} showAdminActions={false}>
      <div className="programs-shell">
        <div className="section-title d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          {["super_admin", "content_manager"].includes(role) && (
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => navigate("/admin")}
              >
                Manage programs
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/admin")}
              >
                Add program
              </button>
            </div>
          )}
        </div>

        <div className="program-toolbar">
          <form
            className="d-flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              setSearchTerm(searchQuery.trim());
            }}
          >
            <input
              className="form-control form-control-sm"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={searchPlaceholder}
            />
            <button type="submit" className="btn btn-outline-light btn-sm">
              Search
            </button>
            {searchTerm && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setSearchTerm("");
                  setSearchQuery("");
                }}
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {message && <div className="alert alert-info">{message}</div>}
        {loading && <div className="text-muted">Loading programs...</div>}

        <div className="row g-4">
          {visiblePrograms.map((program) => (
            <div key={program.id} className="col-md-4">
              <div className="card program-card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="pill">
                      {formatBadge(category, program.stipend)}
                    </span>
                    <span className="text-muted small">{program.partner || "Partner"}</span>
                  </div>
                  <h5 className="card-title">{program.title}</h5>
                  <p className="card-text flex-grow-1">
                    {program.description || "No description available."}
                  </p>
                  <div className="mt-3 d-flex gap-2 flex-wrap">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setSelectedProgram(program.title);
                        document
                          .getElementById("program-form")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      {ctaLabel}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!loading && visiblePrograms.length === 0 && (
            <div className="col-12 text-muted">
              {searchTerm ? "No programs match your search." : emptyDefault}
            </div>
          )}
        </div>
      </div>
    </ProgramPageLayout>
  );
}

export function IndustryInternshipsPage() {
  return (
    <ProgramCatalogPage
      pageKey="industry-internships"
      category="Internship"
      title="Open internship briefs"
      description="Apply to active briefs or partner with us to publish new internships."
      searchPlaceholder="Search internships"
      emptyDefault="No internship programs available yet."
      ctaLabel="Apply"
    />
  );
}

export function IndustrialCoursesPage() {
  return (
    <ProgramCatalogPage
      pageKey="industrial-courses"
      category="Course"
      title="Industrial course catalog"
      description="Explore employer-reviewed courses and request a tailored path."
      searchPlaceholder="Search courses"
      emptyDefault="No courses available yet."
      ctaLabel="Request info"
    />
  );
}

export default IndustryInternshipsPage;
