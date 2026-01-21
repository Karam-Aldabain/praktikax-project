import React, { useContext } from "react";
import { AuthContext } from "./App";
import { useDocumentMeta } from "./hooks/useDocumentMeta";

function ProfilePage() {
  const { user, isLoggedIn } = useContext(AuthContext);

  useDocumentMeta({
    title: "My Dashboard | PraktikaX",
    description: "View your applications, payments, and account activity.",
  });

  if (!isLoggedIn) {
    return (
      <div className="page-shell">
        <div className="container">
          <div className="alert alert-warning">Login to see your profile.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="container">
        <h2 className="page-title">Learner Dashboard</h2>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Account</h5>
            <p className="mb-1"><strong>Name:</strong> {user.full_name || "N/A"}</p>
            <p className="mb-1"><strong>Email:</strong> {user.email}</p>
            <p className="mb-0">
              <strong>Role:</strong>{" "}
              <span className="badge bg-secondary text-uppercase">{user.role}</span>
            </p>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Applications</h5>
            <p className="text-muted mb-0">
              Your submitted applications will appear here once the backend exposes user-specific submissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
