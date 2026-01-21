import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./App";
import { api } from "./api";

export default function PartnerDashboard() {
  const { token, isLoggedIn, role } = useContext(AuthContext);
  const [overview, setOverview] = useState({ pages: [], stats: { submissions: 0 } });
  const [submissions, setSubmissions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [ov, subs] = await Promise.all([
          api.partnerOverview(token),
          api.partnerSubmissions(token),
        ]);
        setOverview(ov);
        setSubmissions(subs.submissions || []);
      } catch (err) {
        setMessage(err.message);
      }
    };
    if (isLoggedIn) {
      load();
    }
  }, [isLoggedIn, token]);

  if (!isLoggedIn || role !== "partner_view") {
    return (
      <div className="page-shell">
        <div className="container">
          <div className="alert alert-warning">Partner access only.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="container">
        <h2 className="page-title">Partner Dashboard</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <div className="stat-card mb-4">
          <h6 className="text-uppercase">Total submissions</h6>
          <div className="display-6 fw-bold">{overview.stats?.submissions || 0}</div>
        </div>
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Recent submissions</h5>
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
      </div>
    </div>
  );
}

const parseJson = (raw) => {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};
