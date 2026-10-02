"use client";

import { useState } from "react";

export default function AdminLogoutButton() {
  const [loading, setLoading] = useState(false);

  async function logout() {
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      window.location.href = "/admin-login";
    } catch (error) {
      console.error("Admin logout failed:", error);
      setLoading(false);
      alert("Unable to log out. Please try again.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={logout}
        disabled={loading}
        className="dreamzy-admin-logout"
      >
        {loading ? "LOGGING OUT..." : "LOG OUT"}
      </button>

      <style jsx>{`
        .dreamzy-admin-logout {
          position: static;
          flex: 0 0 auto;
          align-self: center;
          height: 36px;
          padding: 0 13px;
          border: 1px solid #cdb9b5;
          background: #542f35;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.8px;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 3px 10px rgba(84, 47, 53, 0.12);
        }

        .dreamzy-admin-logout:hover:not(:disabled) {
          background: #6a3a42;
        }

        .dreamzy-admin-logout:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        @media (max-width: 1050px) {
          .dreamzy-admin-logout {
            align-self: flex-end;
          }
        }

        @media (max-width: 600px) {
          .dreamzy-admin-logout {
            height: 34px;
            padding: 0 12px;
          }
        }
      `}</style>
    </>
  );
}
