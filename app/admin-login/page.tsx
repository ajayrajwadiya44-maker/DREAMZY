"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!password) {
      setMessage("Please enter the admin password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Invalid admin password.");
        setLoading(false);
        return;
      }

      window.location.href = "/admin/products";
    } catch {
      setMessage("Unable to sign in. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="eyebrow">DREAMZY ADMIN</div>
        <h1>Admin Login</h1>
        <p>Sign in to manage products and orders.</p>

        <form onSubmit={handleSubmit}>
          <label>
            ADMIN PASSWORD
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter admin password"
              autoComplete="current-password"
              autoFocus
            />
          </label>

          {message && <div className="login-message">{message}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <a href="/">← Back to DREAMZY Store</a>
      </section>

      <style>{`
        .admin-login-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 24px;
          box-sizing: border-box;
          background: #faf6f1;
          color: #542f35;
          font-family: Arial, sans-serif;
        }

        .admin-login-card {
          width: min(430px, 100%);
          box-sizing: border-box;
          background: #fffdfb;
          border: 1px solid #eadfd8;
          padding: 38px;
          box-shadow: 0 18px 50px rgba(84, 47, 53, 0.08);
        }

        .eyebrow {
          color: #987276;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        h1 {
          margin: 10px 0 8px;
          font-family: Georgia, serif;
          font-size: 42px;
          font-weight: 400;
        }

        p {
          margin: 0 0 28px;
          color: #765b5e;
          line-height: 1.5;
        }

        label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.2px;
        }

        input {
          width: 100%;
          height: 50px;
          margin-top: 8px;
          padding: 0 14px;
          box-sizing: border-box;
          border: 1px solid #d9cbc7;
          background: #fffdfb;
          color: #542f35;
          font-size: 15px;
          outline: none;
        }

        input:focus {
          border-color: #542f35;
        }

        button {
          width: 100%;
          height: 50px;
          margin-top: 16px;
          border: 0;
          background: #542f35;
          color: #fff;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .login-message {
          margin-top: 14px;
          padding: 12px;
          background: #f4e5e1;
          border: 1px solid #e1ccc6;
          color: #7d3e46;
          font-size: 13px;
        }

        a {
          display: block;
          margin-top: 22px;
          color: #542f35;
          text-align: center;
          text-decoration: none;
          font-size: 13px;
        }

        @media (max-width: 480px) {
          .admin-login-card {
            padding: 28px 22px;
          }

          h1 {
            font-size: 36px;
          }
        }
      `}</style>
    </main>
  );
}
