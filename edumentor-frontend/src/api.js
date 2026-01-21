const defaultHost =
  typeof window !== "undefined" && window.location?.hostname
    ? window.location.hostname
    : "localhost";
const API_BASE =
  process.env.REACT_APP_API_BASE || `http://${defaultHost}:8080/api`;

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function apiRequest(path, { method = "GET", body, token, headers: extraHeaders } = {}) {
  const isFormData = body instanceof FormData;
  const headers = { ...(extraHeaders || {}) };
  if (!isFormData) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }
  if (token) headers.Authorization = `Bearer ${token}`;

  const payload =
    headers["Content-Type"] === "application/json" && body && !isFormData
      ? JSON.stringify(body)
      : body;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: payload,
    credentials: "include",
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }
  if (!res.ok) {
    const fallback = text || res.statusText || "Request failed";
    const detail = data?.detail || data?.error || fallback;
    const msg = Array.isArray(detail) ? detail[0]?.msg || fallback : detail;
    throw new ApiError(msg, res.status);
  }
  return data;
}

export const api = {
  login: async (email, password) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
    }),
  register: (email, fullName, password) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: { email, full_name: fullName, password },
    }),
  logout: (token) => apiRequest("/auth/logout", { method: "POST", token }),
  listPages: () => apiRequest("/pages"),
  getPage: (slug) => apiRequest(`/pages/${slug}`),
  submitForm: (slug, formData, csrfToken) =>
    apiRequest(`/pages/${slug}/submit`, {
      method: "POST",
      body: formData,
      headers: csrfToken ? { "X-CSRF-Token": csrfToken } : undefined,
    }),
  getCsrfToken: () => apiRequest("/csrf"),
  adminStats: (token) => apiRequest("/admin/stats", { token }),
  adminPages: (token) => apiRequest("/admin/pages", { token }),
  adminCreatePage: (page, token) =>
    apiRequest("/admin/pages", { method: "POST", body: page, token }),
  adminUpdatePage: (id, page, token) =>
    apiRequest(`/admin/pages/${id}`, { method: "PUT", body: page, token }),
  adminDeletePage: (id, token) =>
    apiRequest(`/admin/pages/${id}`, { method: "DELETE", token }),
  adminSubmissions: (token) => apiRequest("/admin/submissions", { token }),
  adminExportSubmissions: (token) =>
    apiRequest("/admin/submissions/export", { token }),
  adminUsers: (token) => apiRequest("/admin/users", { token }),
  adminUpdateRole: (userId, role, token) =>
    apiRequest(`/admin/users/${userId}/role`, {
      method: "PATCH",
      body: { role },
      token,
    }),
  adminTracks: (token) => apiRequest("/admin/tracks", { token }),
  adminCreateTrack: (track, token) =>
    apiRequest("/admin/tracks", { method: "POST", body: track, token }),
  adminUpdateTrack: (id, track, token) =>
    apiRequest(`/admin/tracks/${id}`, { method: "PUT", body: track, token }),
  adminDeleteTrack: (id, token) =>
    apiRequest(`/admin/tracks/${id}`, { method: "DELETE", token }),
  adminMedia: (token) => apiRequest("/admin/media", { token }),
  adminUploadMedia: (file, token) => {
    const payload = new FormData();
    payload.append("file", file);
    return apiRequest("/admin/media", { method: "POST", body: payload, token });
  },
  adminDeleteMedia: (id, token) =>
    apiRequest(`/admin/media/${id}`, { method: "DELETE", token }),
  adminPartnerAssignments: (token) => apiRequest("/admin/partner-assignments", { token }),
  adminSavePartnerAssignments: (userId, pageIds, token) =>
    apiRequest("/admin/partner-assignments", {
      method: "POST",
      body: { user_id: userId, page_ids: pageIds },
      token,
    }),
  partnerOverview: (token) => apiRequest("/partner/overview", { token }),
  partnerSubmissions: (token) => apiRequest("/partner/submissions", { token }),
  listPrograms: () => apiRequest("/programs"),
  adminPrograms: (token) => apiRequest("/admin/programs", { token }),
  adminCreateProgram: (program, token) =>
    apiRequest("/admin/programs", { method: "POST", body: program, token }),
  adminUpdateProgram: (id, program, token) =>
    apiRequest(`/admin/programs/${id}`, { method: "PUT", body: program, token }),
  adminDeleteProgram: (id, token) =>
    apiRequest(`/admin/programs/${id}`, { method: "DELETE", token }),
};
