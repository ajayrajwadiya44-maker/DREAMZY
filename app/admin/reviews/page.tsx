 "use client";

import { useEffect, useMemo, useState } from "react";

type Review = {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  review: string;
  createdAt: string;
  verifiedPurchase: boolean;
  visible?: boolean;
};

function readReviews(): Review[] {
  try {
    const raw = JSON.parse(localStorage.getItem("dreamzy-reviews") || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.map((item) => ({
      ...item,
      visible: item.visible !== false,
    }));
  } catch {
    return [];
  }
}

function moneyDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function stars(rating: number) {
  return "★★★★★".split("").map((star, index) => (
    <span key={index} style={{ color: index < rating ? "#a46a45" : "#d8c8c3" }}>
      {star}
    </span>
  ));
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("ALL");
  const [visibilityFilter, setVisibilityFilter] = useState("ALL");
  const [message, setMessage] = useState("");

  function loadReviews() {
    setReviews(readReviews());
  }

  useEffect(() => {
    loadReviews();

    const refresh = () => loadReviews();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("dreamzy-reviews-updated", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("dreamzy-reviews-updated", refresh);
    };
  }, []);

  function saveReviews(next: Review[]) {
    setReviews(next);
    localStorage.setItem("dreamzy-reviews", JSON.stringify(next));
    window.dispatchEvent(new Event("dreamzy-reviews-updated"));
  }

  function toggleVisibility(id: string) {
    const next = reviews.map((item) =>
      item.id === id ? { ...item, visible: item.visible === false } : item
    );
    saveReviews(next);
    setMessage("Review visibility updated.");
    window.setTimeout(() => setMessage(""), 1800);
  }

  function deleteReview(id: string) {
    const review = reviews.find((item) => item.id === id);
    if (!review) return;

    if (
      !window.confirm(
        `Delete the review from ${review.customerName || "this customer"}?`
      )
    ) {
      return;
    }

    saveReviews(reviews.filter((item) => item.id !== id));
    setMessage("Review deleted.");
    window.setTimeout(() => setMessage(""), 1800);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return reviews.filter((item) => {
      const matchesSearch =
        !q ||
        item.productName.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.orderNumber.toLowerCase().includes(q) ||
        item.review.toLowerCase().includes(q);

      const matchesRating =
        ratingFilter === "ALL" ||
        Number(item.rating) === Number(ratingFilter);

      const matchesVisibility =
        visibilityFilter === "ALL" ||
        (visibilityFilter === "VISIBLE" && item.visible !== false) ||
        (visibilityFilter === "HIDDEN" && item.visible === false);

      return matchesSearch && matchesRating && matchesVisibility;
    });
  }, [reviews, search, ratingFilter, visibilityFilter]);

  const visibleCount = reviews.filter((item) => item.visible !== false).length;
  const hiddenCount = reviews.filter((item) => item.visible === false).length;

  return (
    <main className="admin-reviews-page">
      {message && <div className="toast">{message}</div>}

      <section className="admin-reviews-content">
        <div className="page-heading">
          <div>
            <div className="eyebrow">CUSTOMER FEEDBACK</div>
            <h1>Product Reviews</h1>
            <p>
              Review customer feedback and control which reviews are visible
              on the DREAMZY store.
            </p>
          </div>

          <button type="button" onClick={loadReviews} className="refresh-button">
            REFRESH
          </button>
        </div>

        <div className="stats">
          <div className="stat-card">
            <span>TOTAL REVIEWS</span>
            <strong>{reviews.length}</strong>
          </div>
          <div className="stat-card">
            <span>VISIBLE</span>
            <strong>{visibleCount}</strong>
          </div>
          <div className="stat-card">
            <span>HIDDEN</span>
            <strong>{hiddenCount}</strong>
          </div>
        </div>

        <div className="controls">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search product, customer, order or review..."
          />

          <select
            value={ratingFilter}
            onChange={(event) => setRatingFilter(event.target.value)}
          >
            <option value="ALL">All ratings</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>

          <select
            value={visibilityFilter}
            onChange={(event) => setVisibilityFilter(event.target.value)}
          >
            <option value="ALL">All reviews</option>
            <option value="VISIBLE">Visible</option>
            <option value="HIDDEN">Hidden</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <h2>No reviews found</h2>
            <p>
              Reviews submitted by customers will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="review-list">
            {filtered.map((item) => (
              <article className={`review-card ${item.visible === false ? "hidden-card" : ""}`} key={item.id}>
                <div className="review-top">
                  <div>
                    <div className="product-name">{item.productName}</div>
                    <div className="order-number">
                      ORDER {item.orderNumber || "—"}
                    </div>
                  </div>

                  <div className="rating">
                    {stars(Number(item.rating || 0))}
                    <strong>{Number(item.rating || 0)}.0</strong>
                  </div>
                </div>

                <div className="review-text">“{item.review}”</div>

                <div className="review-meta">
                  <div>
                    <strong>{item.customerName || "Customer"}</strong>
                    {item.verifiedPurchase && (
                      <span className="verified">✓ VERIFIED PURCHASE</span>
                    )}
                  </div>

                  <span>{moneyDate(item.createdAt)}</span>
                </div>

                <div className="review-actions">
                  <span className={item.visible === false ? "status hidden" : "status"}>
                    {item.visible === false ? "HIDDEN FROM STORE" : "VISIBLE ON STORE"}
                  </span>

                  <button type="button" onClick={() => toggleVisibility(item.id)}>
                    {item.visible === false ? "SHOW REVIEW" : "HIDE REVIEW"}
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteReview(item.id)}
                  >
                    DELETE
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <style jsx>{`
        .admin-reviews-page {
          min-height: 100vh;
          background: #faf6f1;
          color: #542f35;
          font-family: Arial, Helvetica, sans-serif;
        }

        .admin-reviews-content {
          max-width: 1250px;
          margin: 0 auto;
          padding: 42px 5% 90px;
        }

        .page-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 25px;
          margin-bottom: 28px;
        }

        .eyebrow {
          color: #8d6268;
          font-size: 10px;
          letter-spacing: 2.5px;
          font-weight: 700;
        }

        h1 {
          font-family: Georgia, serif;
          font-weight: 400;
          font-size: 42px;
          margin: 8px 0;
        }

        .page-heading p {
          color: #765d60;
          margin: 0;
          line-height: 1.6;
          font-size: 13px;
        }

        .refresh-button {
          border: 0;
          background: #542f35;
          color: white;
          padding: 13px 20px;
          cursor: pointer;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: #fffaf6;
          border: 1px solid #e1d2cb;
          padding: 20px;
        }

        .stat-card span {
          color: #8d6268;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .stat-card strong {
          display: block;
          font-family: Georgia, serif;
          font-weight: 400;
          font-size: 30px;
          margin-top: 8px;
        }

        .controls {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }

        .controls input,
        .controls select {
          box-sizing: border-box;
          padding: 13px 14px;
          border: 1px solid #d9c5bd;
          background: #fffaf6;
          color: #321d21;
          font-family: Arial, sans-serif;
        }

        .controls input {
          flex: 1 1 360px;
          min-width: 240px;
        }

        .controls select {
          min-width: 150px;
        }

        .review-list {
          display: grid;
          gap: 16px;
        }

        .review-card {
          background: #fffaf6;
          border: 1px solid #e1d2cb;
          padding: 22px;
        }

        .hidden-card {
          opacity: .72;
        }

        .review-top {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-start;
          padding-bottom: 14px;
          border-bottom: 1px solid #eadbd4;
        }

        .product-name {
          font-family: Georgia, serif;
          font-size: 21px;
        }

        .order-number {
          color: #8d6268;
          font-size: 9px;
          letter-spacing: 1.2px;
          margin-top: 6px;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          font-size: 13px;
        }

        .rating span {
          letter-spacing: 1px;
        }

        .review-text {
          color: #765d60;
          font-size: 14px;
          line-height: 1.75;
          padding: 17px 0;
        }

        .review-meta {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          color: #765d60;
          font-size: 11px;
          align-items: center;
        }

        .review-meta strong {
          color: #542f35;
          margin-right: 9px;
        }

        .verified {
          display: inline-block;
          color: #35633b;
          background: #e4efe4;
          padding: 5px 7px;
          font-size: 7px;
          font-weight: 700;
          letter-spacing: .7px;
        }

        .review-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          flex-wrap: wrap;
          border-top: 1px solid #eadbd4;
          margin-top: 17px;
          padding-top: 14px;
        }

        .status {
          margin-right: auto;
          color: #35633b;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .status.hidden {
          color: #8d6268;
        }

        .review-actions button {
          border: 1px solid #542f35;
          background: #542f35;
          color: #fff;
          padding: 9px 12px;
          cursor: pointer;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .8px;
        }

        .review-actions .delete-button {
          background: #fffaf6;
          color: #8a3038;
          border-color: #c9aaa8;
        }

        .empty {
          background: #fffaf6;
          border: 1px solid #e1d2cb;
          text-align: center;
          padding: 70px 20px;
        }

        .empty h2 {
          font-family: Georgia, serif;
          font-weight: 400;
          font-size: 30px;
        }

        .empty p {
          color: #765d60;
        }

        .toast {
          position: fixed;
          top: 22px;
          right: 22px;
          z-index: 1000;
          background: #542f35;
          color: #fff;
          padding: 12px 18px;
          box-shadow: 0 8px 25px rgba(84,47,53,.18);
          font-size: 12px;
        }

        @media (max-width: 700px) {

          .admin-reviews-content {
            padding: 30px 14px 70px;
          }

          .page-heading {
            align-items: stretch;
            flex-direction: column;
          }

          h1 {
            font-size: 34px;
          }

          .refresh-button {
            width: 100%;
          }

          .stats {
            grid-template-columns: 1fr;
          }

          .controls {
            flex-direction: column;
          }

          .controls input,
          .controls select {
            width: 100%;
            min-width: 0;
          }

          .review-top {
            flex-direction: column;
          }

          .rating {
            width: 100%;
          }

          .review-meta {
            align-items: flex-start;
            flex-direction: column;
          }

          .review-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .status {
            margin-right: 0;
            margin-bottom: 3px;
          }

          .review-actions button {
            width: 100%;
          }

          .toast {
            left: 14px;
            right: 14px;
            top: 14px;
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
