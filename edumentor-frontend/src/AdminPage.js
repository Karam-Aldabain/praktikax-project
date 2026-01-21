import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./App";
import { api } from "./api";
import { useDocumentMeta } from "./hooks/useDocumentMeta";
import RichTextEditor from "./components/RichTextEditor";

function AdminPage() {
  const { token, role } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [pages, setPages] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ users: 0, pages: 0, submissions: 0 });
  const [message, setMessage] = useState("");
  const [selectedPageId, setSelectedPageId] = useState("");
  const [tracks, setTracks] = useState([]);
  const [media, setMedia] = useState([]);
  const [partnerAssignments, setPartnerAssignments] = useState({
    partners: [],
    pages: [],
    assignments: [],
  });
  const [selectedPartnerId, setSelectedPartnerId] = useState("");
  const [selectedPartnerPages, setSelectedPartnerPages] = useState([]);
  const [trackForm, setTrackForm] = useState({
    name: "",
    category: "",
    description: "",
    is_active: true,
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [programForm, setProgramForm] = useState({
    title: "",
    description: "",
    category: "",
    stipend: "",
    partner: "",
    start_date: "",
    published: true,
  });
  const [editingProgramId, setEditingProgramId] = useState(null);
  const [pageForm, setPageForm] = useState({
    slug: "",
    title: "",
    hero_title: "",
    hero_subtitle: "",
    hero_background: "",
    meta_title: "",
    meta_description: "",
    schema_type: "Organization",
    is_active: true,
    questions: [],
    highlights_text: "",
    highlights_active: true,
    stats_text: "",
    stats_active: true,
    carousel_title: "",
    carousel_text: "",
    carousel_active: true,
    rich_text: "",
    rich_text_active: true,
  });
  const canAccess = ["super_admin", "content_manager", "form_manager"].includes(role);
  const handleRoleChange = (userId, newRole) =>
    applyRole(userId, newRole, token, loadData, setMessage);

  const loadData = async () => {
    try {
      setMessage("");
      const [statsRes, pagesRes, subsRes, usersRes] = await Promise.all([
        api.adminStats(token),
        api.adminPages(token),
        api.adminSubmissions(token),
        api.adminUsers(token),
      ]);
      const [tracksRes, mediaRes, partnerRes, programsRes] = await Promise.all([
        api.adminTracks(token),
        api.adminMedia(token),
        api.adminPartnerAssignments(token),
        api.adminPrograms(token),
      ]);
      setStats(statsRes.stats || { users: 0, pages: 0, submissions: 0 });
      setPages(pagesRes.pages || []);
      setSubmissions(subsRes.submissions || []);
      setUsers(usersRes.users || []);
      setTracks(tracksRes.tracks || []);
      setMedia(mediaRes.media || []);
      setPartnerAssignments(partnerRes || { partners: [], pages: [], assignments: [] });
      setPrograms(programsRes.programs || []);
    } catch (err) {
      setMessage(err.message);
    }
  };

  useEffect(() => {
    if (canAccess) {
      loadData();
    } else {
      setMessage("Admins only.");
    }
  }, [role, canAccess]);

  useDocumentMeta({
    title: "Admin Studio | PraktikaX",
    description: "Manage page content, submissions, roles, and program visibility.",
  });

  const selectedPage = useMemo(
    () => pages.find((page) => String(page.id) === String(selectedPageId)),
    [pages, selectedPageId]
  );

  useEffect(() => {
    if (!selectedPage) return;
    const sections = parseSections(selectedPage.sections_json);
    const questions = (sections.find((section) => section.type === "form_questions")?.fields || []).map(
      (field, index) => ({
        name: field.name || `custom_${index + 1}`,
        label: field.label || "",
        type: field.type || "text",
        required: Boolean(field.required),
        options: Array.isArray(field.options) ? field.options.join(", ") : "",
      })
    );
    const highlights = sections.find((section) => section.type === "highlights");
    const stats = sections.find((section) => section.type === "stats");
    const carousel = sections.find((section) => section.type === "carousel");
    const richText = sections.find((section) => section.type === "rich_text");
    setPageForm({
      slug: selectedPage.slug || "",
      title: selectedPage.title || "",
      hero_title: selectedPage.hero_title || "",
      hero_subtitle: selectedPage.hero_subtitle || "",
      hero_background: selectedPage.hero_background || "",
      meta_title: selectedPage.meta_title || "",
      meta_description: selectedPage.meta_description || "",
      schema_type: selectedPage.schema_type || "Organization",
      is_active: Boolean(selectedPage.is_active),
      questions,
      highlights_text: (highlights?.items || [])
        .map((item) => `${item.title || ""}|${item.text || ""}`)
        .join("\n"),
      highlights_active: highlights?.is_active !== false,
      stats_text: (stats?.items || [])
        .map((item) => `${item.label || ""}|${item.value || ""}|${item.suffix || ""}`)
        .join("\n"),
      stats_active: stats?.is_active !== false,
      carousel_title: carousel?.title || "",
      carousel_text: (carousel?.items || []).join("\n"),
      carousel_active: carousel?.is_active !== false,
      rich_text: richText?.html || "",
      rich_text_active: richText?.is_active !== false,
    });
  }, [selectedPage]);

  useEffect(() => {
    if (!selectedPartnerId) return;
    const assigned = partnerAssignments.assignments
      .filter((item) => String(item.user_id) === String(selectedPartnerId))
      .map((item) => String(item.page_id));
    setSelectedPartnerPages(assigned);
  }, [selectedPartnerId, partnerAssignments.assignments]);

  if (!canAccess) {
    return (
      <div className="page-shell">
        <div className="container">
          <div className="alert alert-warning">Admins only.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="container">
        <h2 className="page-title">Admin Studio</h2>
        <p className="text-muted">
          Manage program content, submissions, and role-based access in one place.
        </p>
        <p className="text-muted small">
          Roles: Super Admin, Content Manager, Form Manager, Partner View, Public User.
        </p>
        {message && <div className="alert alert-info">{message}</div>}

        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="stat-card">
              <h6 className="text-uppercase">Total users</h6>
              <div className="display-6 fw-bold">{stats.users}</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <h6 className="text-uppercase">Submissions</h6>
              <div className="display-6 fw-bold">{stats.submissions}</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <h6 className="text-uppercase">Programs</h6>
              <div className="display-6 fw-bold">{stats.pages}</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <h6 className="text-uppercase">Visibility</h6>
              <div className="display-6 fw-bold">Active</div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
              <div>
                <h5 className="card-title mb-1">Pages & Form Questions</h5>
                <div className="text-muted small">
                  Manage page hero content, SEO, and application questions.
                </div>
              </div>
              <select
                className="form-select form-select-sm"
                value={selectedPageId}
                onChange={(event) => setSelectedPageId(event.target.value)}
              >
                <option value="">Select a page</option>
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.title}
                  </option>
                ))}
              </select>
            </div>

            {!selectedPage ? (
              <div className="text-muted">Select a page to edit.</div>
            ) : (
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  try {
                    const questions = pageForm.questions.map((question, index) => ({
                      name: question.name || `custom_${index + 1}`,
                      label: question.label,
                      type: question.type,
                      required: question.required,
                      options:
                        question.type === "select"
                          ? question.options.split(",").map((opt) => opt.trim()).filter(Boolean)
                          : undefined,
                    }));
                    const highlights = parseHighlights(pageForm.highlights_text);
                    const stats = parseStats(pageForm.stats_text);
                    const carouselItems = parseList(pageForm.carousel_text);
                    const sections = [
                      {
                        type: "form_questions",
                        fields: questions,
                      },
                      {
                        type: "highlights",
                        is_active: pageForm.highlights_active,
                        items: highlights,
                      },
                      {
                        type: "stats",
                        is_active: pageForm.stats_active,
                        items: stats,
                      },
                      {
                        type: "carousel",
                        is_active: pageForm.carousel_active,
                        title: pageForm.carousel_title,
                        items: carouselItems,
                      },
                      {
                        type: "rich_text",
                        is_active: pageForm.rich_text_active,
                        html: pageForm.rich_text,
                      },
                    ];
                    await api.adminUpdatePage(
                      selectedPage.id,
                      {
                        slug: pageForm.slug,
                        title: pageForm.title,
                        hero_title: pageForm.hero_title,
                        hero_subtitle: pageForm.hero_subtitle,
                        hero_background: pageForm.hero_background,
                        meta_title: pageForm.meta_title,
                        meta_description: pageForm.meta_description,
                        schema_type: pageForm.schema_type,
                        is_active: pageForm.is_active ? 1 : 0,
                        sections,
                      },
                      token
                    );
                    await loadData();
                    setMessage("Page updated.");
                  } catch (err) {
                    setMessage(err.message);
                  }
                }}
              >
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Slug</label>
                    <input
                      className="form-control form-control-sm"
                      value={pageForm.slug}
                      onChange={(event) =>
                        setPageForm((prev) => ({ ...prev, slug: event.target.value }))
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Title</label>
                    <input
                      className="form-control form-control-sm"
                      value={pageForm.title}
                      onChange={(event) =>
                        setPageForm((prev) => ({ ...prev, title: event.target.value }))
                      }
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Hero title</label>
                    <input
                      className="form-control form-control-sm"
                      value={pageForm.hero_title}
                      onChange={(event) =>
                        setPageForm((prev) => ({ ...prev, hero_title: event.target.value }))
                      }
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Hero subtitle</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="2"
                      value={pageForm.hero_subtitle}
                      onChange={(event) =>
                        setPageForm((prev) => ({ ...prev, hero_subtitle: event.target.value }))
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Hero background</label>
                    <input
                      className="form-control form-control-sm"
                      value={pageForm.hero_background}
                      onChange={(event) =>
                        setPageForm((prev) => ({ ...prev, hero_background: event.target.value }))
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Schema type</label>
                    <select
                      className="form-select form-select-sm"
                      value={pageForm.schema_type}
                      onChange={(event) =>
                        setPageForm((prev) => ({ ...prev, schema_type: event.target.value }))
                      }
                    >
                      <option value="Organization">Organization</option>
                      <option value="Course">Course</option>
                      <option value="Event">Event</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Meta title</label>
                    <input
                      className="form-control form-control-sm"
                      value={pageForm.meta_title}
                      onChange={(event) =>
                        setPageForm((prev) => ({ ...prev, meta_title: event.target.value }))
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Meta description</label>
                    <input
                      className="form-control form-control-sm"
                      value={pageForm.meta_description}
                      onChange={(event) =>
                        setPageForm((prev) => ({ ...prev, meta_description: event.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <h6 className="fw-semibold">Application questions</h6>
                  {pageForm.questions.length === 0 && (
                    <p className="text-muted">No custom questions yet.</p>
                  )}
                  {pageForm.questions.map((question, index) => (
                    <div className="card p-3 mb-2" key={`question-${index}`}>
                      <div className="row g-2">
                        <div className="col-md-4">
                          <input
                            className="form-control form-control-sm"
                            placeholder="Question label"
                            value={question.label}
                            onChange={(event) =>
                              updateQuestion(setPageForm, index, { label: event.target.value })
                            }
                          />
                        </div>
                        <div className="col-md-3">
                          <select
                            className="form-select form-select-sm"
                            value={question.type}
                            onChange={(event) =>
                              updateQuestion(setPageForm, index, { type: event.target.value })
                            }
                          >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="number">Number</option>
                            <option value="textarea">Textarea</option>
                            <option value="select">Select</option>
                            <option value="file">File</option>
                          </select>
                        </div>
                        <div className="col-md-3">
                          <input
                            className="form-control form-control-sm"
                            placeholder="Options (comma separated)"
                            value={question.options}
                            onChange={(event) =>
                              updateQuestion(setPageForm, index, { options: event.target.value })
                            }
                            disabled={question.type !== "select"}
                          />
                        </div>
                        <div className="col-md-2 d-flex align-items-center gap-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={question.required}
                            onChange={(event) =>
                              updateQuestion(setPageForm, index, { required: event.target.checked })
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm ms-auto"
                            onClick={() => removeQuestion(setPageForm, index)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => addQuestion(setPageForm)}
                  >
                    Add question
                  </button>
                </div>

                <div className="mt-4">
                  <h6 className="fw-semibold">Section visibility</h6>
                  <div className="d-flex flex-wrap gap-3">
                    {[
                      { key: "highlights_active", label: "Highlights" },
                      { key: "stats_active", label: "Stats" },
                      { key: "carousel_active", label: "Carousel" },
                      { key: "rich_text_active", label: "Rich text" },
                    ].map((item) => (
                      <label key={item.key} className="form-check d-flex gap-2 align-items-center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={pageForm[item.key]}
                          onChange={(event) =>
                            setPageForm((prev) => ({ ...prev, [item.key]: event.target.checked }))
                          }
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h6 className="fw-semibold">Highlights (title|text per line)</h6>
                  <textarea
                    className="form-control form-control-sm"
                    rows="4"
                    value={pageForm.highlights_text}
                    onChange={(event) =>
                      setPageForm((prev) => ({ ...prev, highlights_text: event.target.value }))
                    }
                  />
                </div>

                <div className="mt-4">
                  <h6 className="fw-semibold">Stats (label|value|suffix per line)</h6>
                  <textarea
                    className="form-control form-control-sm"
                    rows="4"
                    value={pageForm.stats_text}
                    onChange={(event) =>
                      setPageForm((prev) => ({ ...prev, stats_text: event.target.value }))
                    }
                  />
                </div>

                <div className="mt-4">
                  <h6 className="fw-semibold">Carousel title</h6>
                  <input
                    className="form-control form-control-sm"
                    value={pageForm.carousel_title}
                    onChange={(event) =>
                      setPageForm((prev) => ({ ...prev, carousel_title: event.target.value }))
                    }
                  />
                  <h6 className="fw-semibold mt-3">Carousel items (one per line)</h6>
                  <textarea
                    className="form-control form-control-sm"
                    rows="4"
                    value={pageForm.carousel_text}
                    onChange={(event) =>
                      setPageForm((prev) => ({ ...prev, carousel_text: event.target.value }))
                    }
                  />
                </div>

                <div className="mt-4">
                  <h6 className="fw-semibold">Rich text (HTML)</h6>
                  <RichTextEditor
                    value={pageForm.rich_text}
                    onChange={(html) => setPageForm((prev) => ({ ...prev, rich_text: html }))}
                  />
                </div>

                <div className="mt-3">
                  <button type="submit" className="btn btn-primary">
                    Save page
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h5 className="card-title">Submissions</h5>
            <div className="d-flex justify-content-end mb-2">
              <button
                className="btn btn-outline-primary btn-sm"
                type="button"
                onClick={() => downloadSubmissions(token, setMessage)}
              >
                Export CSV
              </button>
            </div>
            {submissions.length === 0 ? (
              <p className="text-muted mb-0">No submissions yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm align-middle table-theme">
                  <thead>
                    <tr>
                      <th>Page</th>
                      <th>Applicant</th>
                      <th>File</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => {
                      const data = parseJson(submission.form_data_json);
                      return (
                        <tr key={submission.id}>
                          <td>{submission.slug}</td>
                          <td>{data.fullName || data.full_name || data.email || "Applicant"}</td>
                          <td>
                            {submission.file_path ? (
                              <a href={submission.file_path} target="_blank" rel="noreferrer">
                                Download
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>{new Date(submission.created_at).toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h5 className="card-title">Program Tracks</h5>
            <form
              className="row g-2 align-items-end"
              onSubmit={async (event) => {
                event.preventDefault();
                try {
                  await api.adminCreateTrack(trackForm, token);
                  setTrackForm({ name: "", category: "", description: "", is_active: true });
                  await loadData();
                } catch (err) {
                  setMessage(err.message);
                }
              }}
            >
              <div className="col-md-3">
                <label className="form-label fw-semibold">Name</label>
                <input
                  className="form-control form-control-sm"
                  value={trackForm.name}
                  onChange={(event) =>
                    setTrackForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Category</label>
                <input
                  className="form-control form-control-sm"
                  value={trackForm.category}
                  onChange={(event) =>
                    setTrackForm((prev) => ({ ...prev, category: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Description</label>
                <input
                  className="form-control form-control-sm"
                  value={trackForm.description}
                  onChange={(event) =>
                    setTrackForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                />
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary btn-sm w-100" type="submit">
                  Add track
                </button>
              </div>
            </form>
            <div className="table-responsive mt-3">
              <table className="table table-sm align-middle table-theme">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tracks.map((track) => (
                    <tr key={track.id}>
                      <td>{track.name}</td>
                      <td>{track.category}</td>
                      <td>{track.is_active ? "Active" : "Inactive"}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          type="button"
                          onClick={() => removeTrack(track.id, token, loadData, setMessage)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h5 className="card-title">Programs (Internships & Courses)</h5>
            <form
              className="row g-2 align-items-end"
              onSubmit={async (event) => {
                event.preventDefault();
                try {
                  const payload = {
                    ...programForm,
                    stipend: Number(programForm.stipend || 0),
                    published: programForm.published ? 1 : 0,
                  };
                  if (editingProgramId) {
                    await api.adminUpdateProgram(editingProgramId, payload, token);
                  } else {
                    await api.adminCreateProgram(payload, token);
                  }
                  setProgramForm({
                    title: "",
                    description: "",
                    category: "",
                    stipend: "",
                    partner: "",
                    start_date: "",
                    published: true,
                  });
                  setEditingProgramId(null);
                  await loadData();
                } catch (err) {
                  setMessage(err.message);
                }
              }}
            >
              <div className="col-md-3">
                <label className="form-label fw-semibold">Title</label>
                <input
                  className="form-control form-control-sm"
                  value={programForm.title}
                  onChange={(event) =>
                    setProgramForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Category</label>
                <input
                  className="form-control form-control-sm"
                  value={programForm.category}
                  onChange={(event) =>
                    setProgramForm((prev) => ({ ...prev, category: event.target.value }))
                  }
                  list="program-category-options"
                  required
                />
                <datalist id="program-category-options">
                  <option value="Internship" />
                  <option value="Course" />
                </datalist>
              </div>
              <div className="col-md-2">
                <label className="form-label fw-semibold">Stipend</label>
                <input
                  className="form-control form-control-sm"
                  type="number"
                  step="0.01"
                  value={programForm.stipend}
                  onChange={(event) =>
                    setProgramForm((prev) => ({ ...prev, stipend: event.target.value }))
                  }
                />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-semibold">Partner</label>
                <input
                  className="form-control form-control-sm"
                  value={programForm.partner}
                  onChange={(event) =>
                    setProgramForm((prev) => ({ ...prev, partner: event.target.value }))
                  }
                />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-semibold">Start date</label>
                <input
                  className="form-control form-control-sm"
                  type="date"
                  value={programForm.start_date}
                  onChange={(event) =>
                    setProgramForm((prev) => ({ ...prev, start_date: event.target.value }))
                  }
                />
              </div>
              <div className="col-md-8">
                <label className="form-label fw-semibold">Description</label>
                <input
                  className="form-control form-control-sm"
                  value={programForm.description}
                  onChange={(event) =>
                    setProgramForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                />
              </div>
              <div className="col-md-2 d-flex align-items-center gap-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={programForm.published}
                  onChange={(event) =>
                    setProgramForm((prev) => ({ ...prev, published: event.target.checked }))
                  }
                />
                <label className="form-check-label">Published</label>
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary btn-sm w-100" type="submit">
                  {editingProgramId ? "Update" : "Add"}
                </button>
              </div>
            </form>
            <div className="table-responsive mt-3">
              <table className="table table-sm align-middle table-theme">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Partner</th>
                    <th>Stipend</th>
                    <th>Start</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((program) => (
                    <tr key={program.id}>
                      <td>{program.title}</td>
                      <td>{program.category}</td>
                      <td>{program.partner || "-"}</td>
                      <td>${Number(program.stipend || 0).toFixed(2)}</td>
                      <td>{program.start_date || "-"}</td>
                      <td>{program.published ? "Published" : "Draft"}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-outline-secondary btn-sm me-2"
                          type="button"
                          onClick={() => {
                            setEditingProgramId(program.id);
                            setProgramForm({
                              title: program.title || "",
                              description: program.description || "",
                              category: program.category || "",
                              stipend: program.stipend || "",
                              partner: program.partner || "",
                              start_date: program.start_date || "",
                              published: Boolean(program.published),
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          type="button"
                          onClick={() =>
                            removeProgram(program.id, token, loadData, setMessage)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h5 className="card-title">Media Library</h5>
            <form
              className="d-flex flex-wrap gap-2 align-items-center"
              onSubmit={async (event) => {
                event.preventDefault();
                if (!mediaFile) return;
                try {
                  await api.adminUploadMedia(mediaFile, token);
                  setMediaFile(null);
                  await loadData();
                } catch (err) {
                  setMessage(err.message);
                }
              }}
            >
              <input
                type="file"
                className="form-control form-control-sm"
                onChange={(event) => setMediaFile(event.target.files?.[0] || null)}
              />
              <button className="btn btn-primary btn-sm" type="submit">
                Upload
              </button>
            </form>
            <div className="table-responsive mt-3">
              <table className="table table-sm align-middle table-theme">
                <thead>
                  <tr>
                    <th>File</th>
                    <th>Type</th>
                    <th>Uploaded</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {media.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <a href={item.file_path} target="_blank" rel="noreferrer">
                          {item.file_name}
                        </a>
                      </td>
                      <td>{item.file_type}</td>
                      <td>{new Date(item.created_at).toLocaleDateString()}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          type="button"
                          onClick={() => removeMedia(item.id, token, loadData, setMessage)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h5 className="card-title">Partner Assignments</h5>
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Partner user</label>
                <select
                  className="form-select form-select-sm"
                  value={selectedPartnerId}
                  onChange={(event) => setSelectedPartnerId(event.target.value)}
                >
                  <option value="">Select a partner</option>
                  {partnerAssignments.partners.map((partner) => (
                    <option key={partner.id} value={partner.id}>
                      {partner.full_name || partner.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Assigned pages</label>
                <select
                  className="form-select form-select-sm"
                  multiple
                  size="5"
                  value={selectedPartnerPages}
                  onChange={(event) =>
                    setSelectedPartnerPages(
                      Array.from(event.target.selectedOptions, (option) => option.value)
                    )
                  }
                >
                  {partnerAssignments.pages.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-primary btn-sm w-100"
                  type="button"
                  onClick={async () => {
                    try {
                      await api.adminSavePartnerAssignments(
                        selectedPartnerId,
                        selectedPartnerPages,
                        token
                      );
                      await loadData();
                    } catch (err) {
                      setMessage(err.message);
                    }
                  }}
                  disabled={!selectedPartnerId}
                >
                  Save
                </button>
              </div>
            </div>
            <p className="text-muted small mt-2">
              Partner users will only see submissions for their assigned pages.
            </p>
          </div>
        </div>

        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h5 className="card-title">Users</h5>
            <div className="table-responsive">
              <table className="table table-sm align-middle table-theme">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.full_name || "-"}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className="badge bg-secondary text-uppercase">{u.role}</span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          {[
                            "super_admin",
                            "content_manager",
                            "form_manager",
                            "partner_view",
                            "public_user",
                          ].map((r) => (
                            <button
                              key={r}
                              className={`btn btn-outline-primary ${u.role === r ? "active" : ""}`}
                              onClick={() => handleRoleChange(u.id, r)}
                            >
                              {r.replace("_", " ")}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;

const parseSections = (raw) => {
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const parseJson = (raw) => {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const applyRole = async (userId, newRole, token, reload, setMessage) => {
  try {
    await api.adminUpdateRole(userId, newRole, token);
    await reload();
  } catch (err) {
    setMessage(err.message);
  }
};

const addQuestion = (setPageForm) => {
  setPageForm((prev) => ({
    ...prev,
    questions: [
      ...prev.questions,
      { name: "", label: "", type: "text", required: false, options: "" },
    ],
  }));
};

const updateQuestion = (setPageForm, index, patch) => {
  setPageForm((prev) => ({
    ...prev,
    questions: prev.questions.map((item, i) => (i === index ? { ...item, ...patch } : item)),
  }));
};

const removeQuestion = (setPageForm, index) => {
  setPageForm((prev) => ({
    ...prev,
    questions: prev.questions.filter((_, i) => i !== index),
  }));
};

const downloadSubmissions = async (token, setMessage) => {
  try {
    const res = await fetch("http://127.0.0.1:8080/api/admin/submissions/export", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error("Export failed.");
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "submissions.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    setMessage(err.message);
  }
};

const removeTrack = async (id, token, reload, setMessage) => {
  try {
    await api.adminDeleteTrack(id, token);
    await reload();
  } catch (err) {
    setMessage(err.message);
  }
};

const removeMedia = async (id, token, reload, setMessage) => {
  try {
    await api.adminDeleteMedia(id, token);
    await reload();
  } catch (err) {
    setMessage(err.message);
  }
};

const removeProgram = async (id, token, reload, setMessage) => {
  try {
    await api.adminDeleteProgram(id, token);
    await reload();
  } catch (err) {
    setMessage(err.message);
  }
};

const parseList = (raw) =>
  raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const parseHighlights = (raw) =>
  parseList(raw).map((line) => {
    const [title, text] = line.split("|");
    return { title: title?.trim() || "", text: text?.trim() || "" };
  });

const parseStats = (raw) =>
  parseList(raw).map((line) => {
    const [label, value, suffix] = line.split("|");
    return {
      label: label?.trim() || "",
      value: Number(value?.trim() || 0),
      suffix: suffix?.trim() || "",
    };
  });
