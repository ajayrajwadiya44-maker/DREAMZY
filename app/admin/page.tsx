"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  category: "Women" | "Kids";
  price: number;
  stock: number;
  sizes: string[];
  sizeStock: Record<string, number>;
  active: boolean;
};

type OrderItem = {
  id?: string;
  productId?: string;
  name?: string;
  price?: number;
  size?: string;
  quantity?: number;
};

type Order = {
  orderNumber: string;
  createdAt?: string;
  firstName?: string;
  lastName?: string;
  customer?: string;
  total: number;
  status: string;
  items: OrderItem[];
};

function money(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function readJSON(key: string, fallback: any) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeProduct(raw: any): Product {
  const sizes =
    Array.isArray(raw?.sizes) && raw.sizes.length
      ? raw.sizes.map((s: any) => String(s))
      : ["M"];

  const incoming =
    raw?.sizeStock && typeof raw.sizeStock === "object"
      ? raw.sizeStock
      : {};

  const sizeStock: Record<string, number> = {};
  sizes.forEach((size: string) => {
    const value = Number(incoming[size]);
    sizeStock[size] = Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
  });

  const stock = sizes.reduce(
    (sum: number, size: string) => sum + Number(sizeStock[size] || 0),
    0
  );

  return {
    id: String(raw?.id ?? ""),
    name: String(raw?.name ?? "DREAMZY Product"),
    category: raw?.category === "Kids" ? "Kids" : "Women",
    price: Number(raw?.price) || 0,
    stock,
    sizes,
    sizeStock,
    active: raw?.active !== false,
  };
}

function normalizeOrder(raw: any): Order | null {
  if (!raw || typeof raw !== "object") return null;

  const itemsSource = Array.isArray(raw.items) ? raw.items : [];
  const items = itemsSource.map((item: any) => ({
    id: item?.id ? String(item.id) : undefined,
    productId: item?.productId ? String(item.productId) : undefined,
    name: item?.name || item?.productName || "Product",
    price: Number(item?.price) || 0,
    size: item?.size || item?.selectedSize || "",
    quantity: Number(item?.quantity || item?.qty) || 1,
  }));

  const orderNumber = String(
    raw.orderNumber || raw.orderNo || raw.orderId || raw.id || ""
  );

  if (!orderNumber) return null;

  return {
    orderNumber,
    createdAt: raw.createdAt,
    firstName: raw.firstName || "",
    lastName: raw.lastName || "",
    customer:
      raw.customerName ||
      raw.customer ||
      raw.name ||
      "",
    total: Number(raw.total || raw.grandTotal || raw.amount) || 0,
    status: String(raw.status || "NEW"),
    items,
  };
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  function refresh() {
    const rawProducts = readJSON("dreamzy-products", []);
    const rawOrders = readJSON("dreamzy-orders", []);
    const rawReviews = readJSON("dreamzy-reviews", []);

    const customerKeys = new Set<string>();
    if (Array.isArray(rawOrders)) {
      rawOrders.forEach((order: any) => {
        const key = String(
          order?.email ||
          order?.mobile ||
          order?.phone ||
          `${order?.firstName || ""} ${order?.lastName || ""}`.trim() ||
          order?.customer ||
          order?.customerName ||
          ""
        ).trim().toLowerCase();
        if (key) customerKeys.add(key);
      });
    }
    setCustomerCount(customerKeys.size);
    setReviewCount(Array.isArray(rawReviews) ? rawReviews.length : 0);

    setProducts(
      Array.isArray(rawProducts) ? rawProducts.map(normalizeProduct) : []
    );

    const normalizedOrders = Array.isArray(rawOrders)
      ? rawOrders.map(normalizeOrder).filter(Boolean) as Order[]
      : [];

    setOrders(normalizedOrders);
    setLoaded(true);
  }

  useEffect(() => {
    refresh();

    const onProducts = () => refresh();
    const onOrders = () => refresh();
    const onReviews = () => refresh();

    window.addEventListener("dreamzy-products-updated", onProducts);
    window.addEventListener("dreamzy-orders-updated", onOrders);
    window.addEventListener("dreamzy-reviews-updated", onReviews);
    window.addEventListener("storage", onProducts);
    window.addEventListener("storage", onOrders);
    window.addEventListener("storage", onReviews);

    return () => {
      window.removeEventListener("dreamzy-products-updated", onProducts);
      window.removeEventListener("dreamzy-orders-updated", onOrders);
      window.removeEventListener("dreamzy-reviews-updated", onReviews);
      window.removeEventListener("storage", onProducts);
      window.removeEventListener("storage", onOrders);
      window.removeEventListener("storage", onReviews);
    };
  }, []);

  const stats = useMemo(() => {
    const salesOrders = orders.filter((order) => order.status !== "CANCELLED");
    const totalSales = salesOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

    // Monthly figures use each order's saved createdAt date.
    const now = new Date();
    const thisMonthOrders = orders.filter((order) => {
      if (!order.createdAt) return false;
      const createdAt = new Date(order.createdAt);
      return (
        !Number.isNaN(createdAt.getTime()) &&
        createdAt.getFullYear() === now.getFullYear() &&
        createdAt.getMonth() === now.getMonth()
      );
    });
    const thisMonthSales = thisMonthOrders
      .filter((order) => order.status !== "CANCELLED")
      .reduce((sum, order) => sum + Number(order.total || 0), 0);

    const newOrders = orders.filter((o) => o.status === "NEW").length;
    const confirmed = orders.filter((o) => o.status === "CONFIRMED").length;
    const packed = orders.filter((o) => o.status === "PACKED").length;
    const shipped = orders.filter((o) => o.status === "SHIPPED").length;
    const delivered = orders.filter((o) => o.status === "DELIVERED").length;
    const cancelled = orders.filter((o) => o.status === "CANCELLED").length;

    const lowStockSizes = products.reduce((count, product) => {
      return (
        count +
        product.sizes.filter(
          (size) => Number(product.sizeStock[size] || 0) > 0 &&
                    Number(product.sizeStock[size] || 0) <= 4
        ).length
      );
    }, 0);

    const outOfStockSizes = products.reduce((count, product) => {
      return (
        count +
        product.sizes.filter(
          (size) => Number(product.sizeStock[size] || 0) <= 0
        ).length
      );
    }, 0);

    // Count a product as low stock only when at least one size has
    // a positive quantity of 1–4. Zero-stock sizes are counted separately
    // as out of stock and should not inflate the low-stock product total.
    const lowStockProducts = products.filter((product) =>
      product.sizes.some((size) => {
        const quantity = Number(product.sizeStock[size] || 0);
        return quantity > 0 && quantity <= 4;
      })
    ).length;

    return {
      totalSales,
      thisMonthSales,
      thisMonthOrders: thisMonthOrders.length,
      newOrders,
      confirmed,
      packed,
      shipped,
      delivered,
      cancelled,
      lowStockProducts,
      lowStockSizes,
      outOfStockSizes,
      activeProducts: products.filter((p) => p.active).length,
    };
  }, [products, orders]);

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    )
    .slice(0, 5);

  const lowStockProducts = products
    .filter((product) =>
      product.sizes.some(
        (size) => Number(product.sizeStock[size] || 0) <= 4
      )
    )
    .slice(0, 6);

  return (
    <main className="dashboard-page">
      <section className="dashboard-content">
        <div className="dashboard-title-row">
          <div>
            <div className="dashboard-section-label">STORE OVERVIEW</div>
            <h1>Dashboard</h1>
            <p>Manage your DREAMZY store from one place.</p>
          </div>

          <button type="button" onClick={refresh} className="refresh-button">
            REFRESH
          </button>
        </div>

        {!loaded ? (
          <div className="loading">Loading dashboard...</div>
        ) : (
          <>
            <div className="stat-grid">
              <div className="stat-card">
                <span>TOTAL ORDERS</span>
                <strong>{orders.length}</strong>
              </div>
              <div className="stat-card">
                <span>TOTAL SALES</span>
                <strong>{money(stats.totalSales)}</strong>
              </div>
              <div className="stat-card">
                <span>THIS MONTH'S SALES</span>
                <strong>{money(stats.thisMonthSales)}</strong>
              </div>
              <div className="stat-card">
                <span>THIS MONTH'S ORDERS</span>
                <strong>{stats.thisMonthOrders}</strong>
              </div>
              <div className="stat-card">
                <span>NEW ORDERS</span>
                <strong>{stats.newOrders}</strong>
              </div>
              <div className="stat-card">
                <span>DELIVERED</span>
                <strong>{stats.delivered}</strong>
              </div>
              <div className="stat-card">
                <span>ACTIVE PRODUCTS</span>
                <strong>{stats.activeProducts}</strong>
              </div>
              <div className="stat-card warning-card">
                <span>LOW STOCK PRODUCTS</span>
                <strong>{stats.lowStockProducts}</strong>
              </div>
              <div className="stat-card stat-card-link">
                <Link href="/admin/customers">
                  <span>CUSTOMERS</span>
                  <strong>{customerCount}</strong>
                  <small>VIEW CUSTOMERS →</small>
                </Link>
              </div>
              <div className="stat-card stat-card-link">
                <Link href="/admin/reviews">
                  <span>REVIEWS</span>
                  <strong>{reviewCount}</strong>
                  <small>VIEW REVIEWS →</small>
                </Link>
              </div>
            </div>

            <div className="two-column">
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <div className="dashboard-section-label">ORDER PIPELINE</div>
                    <h2>Order Status</h2>
                  </div>
                  <a href="/admin/orders">VIEW ALL</a>
                </div>

                <div className="status-list">
                  <div><span>NEW</span><strong>{stats.newOrders}</strong></div>
                  <div><span>CONFIRMED</span><strong>{stats.confirmed}</strong></div>
                  <div><span>PACKED</span><strong>{stats.packed}</strong></div>
                  <div><span>SHIPPED</span><strong>{stats.shipped}</strong></div>
                  <div><span>DELIVERED</span><strong>{stats.delivered}</strong></div>
                  <div className="cancelled"><span>CANCELLED</span><strong>{stats.cancelled}</strong></div>
                </div>
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <div className="dashboard-section-label">INVENTORY</div>
                    <h2>Stock Health</h2>
                  </div>
                  <Link href="/admin/products">PRODUCTS</Link>
                </div>

                <div className="inventory-summary">
                  <div>
                    <strong>{stats.lowStockSizes}</strong>
                    <span>Low-stock sizes</span>
                  </div>
                  <div>
                    <strong>{stats.outOfStockSizes}</strong>
                    <span>Out-of-stock sizes</span>
                  </div>
                </div>

                <div className="stock-list">
                  {lowStockProducts.length === 0 ? (
                    <div className="healthy">✓ All sizes have healthy stock.</div>
                  ) : (
                    lowStockProducts.map((product) => (
                      <div key={product.id} className="stock-product">
                        <div>
                          <strong>{product.name}</strong>
                          <small>{product.category}</small>
                        </div>
                        <div className="stock-sizes">
                          {product.sizes
                            .filter(
                              (size) =>
                                Number(product.sizeStock[size] || 0) <= 4
                            )
                            .map((size) => (
                              <span
                                key={size}
                                className={
                                  Number(product.sizeStock[size] || 0) === 0
                                    ? "out"
                                    : "low"
                                }
                              >
                                {size}: {product.sizeStock[size] || 0}
                              </span>
                            ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            <section className="panel recent-panel">
              <div className="panel-heading">
                <div>
                  <div className="dashboard-section-label">LATEST ACTIVITY</div>
                  <h2>Recent Orders</h2>
                </div>
                <Link href="/admin/orders">VIEW ORDERS</Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="empty">No orders yet.</div>
              ) : (
                <div className="orders-list">
                  {recentOrders.map((order) => {
                    const name =
                      `${order.firstName || ""} ${order.lastName || ""}`.trim() ||
                      order.customer ||
                      "Customer";

                    return (
                      <div className="order-row" key={order.orderNumber}>
                        <div>
                          <strong>{order.orderNumber}</strong>
                          <span>{name}</span>
                        </div>
                        <div className="order-meta">
                          <span className={`status status-${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                          <strong className="dashboard-number">{money(order.total)}</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <div className="quick-actions">
              <Link href="/admin/products">+ MANAGE PRODUCTS</Link>
              <Link href="/admin/orders">VIEW ORDERS</Link>
              <Link href="/">VIEW STORE</Link>
            </div>
          </>
        )}
      </section>

      <footer className="dashboard-footer">
        DREAMZY ADMIN • STORE DASHBOARD
      </footer>

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          background: #faf6f1;
          color: #542f35;
          font-family: Arial, sans-serif;
        }

        .dashboard-content {
          max-width: 1250px;
          margin: 0 auto;
          padding: 45px 28px 80px;
        }

        .dashboard-title-row {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 20px;
          margin-bottom: 28px;
        }

        .dashboard-section-label {
          color: #987276;
        }

        h1,
        h2 {
          font-family: Georgia, serif;
          font-weight: 400;
        }

        h1 {
          font-size: 48px;
          margin: 10px 0 6px;
        }

        .dashboard-title-row p {
          color: #80676a;
          margin: 0;
        }

        .refresh-button {
          height: 44px;
          border: 1px solid #cdb9b5;
          background: #fffdfb;
          color: #542f35;
          padding: 0 18px;
          cursor: pointer;
          font-weight: 700;
        }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
          margin-bottom: 22px;
        }

        .stat-card {
          background: #fffdfb;
          border: 1px solid #eadfd8;
          padding: 20px;
          min-height: 105px;
        }

        .stat-card span {
          display: block;
          font-size: 9px;
          letter-spacing: 1.6px;
          color: #987276;
          font-weight: 700;
        }

        .stat-card strong {
          display: block;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 27px;
          font-weight: 400;
          font-variant-numeric: tabular-nums;
          margin-top: 14px;
        }

        .stat-card-link { box-sizing: border-box; transition: border-color .2s ease, transform .2s ease; }
        .stat-card-link:hover { border-color: #c9aaa3; transform: translateY(-2px); }
        .stat-card-link a { display: flex; flex-direction: column; min-height: 105px; color: #542f35; text-decoration: none; }
        .stat-card-link small { display:block; margin-top:12px; font-size:8px; line-height:1.3; letter-spacing:1px; font-weight:700; color:#987276; }

        .warning-card {
          background: #fff9ed;
        }

        .two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
          margin-bottom: 22px;
        }

        .panel {
          background: #fffdfb;
          border: 1px solid #eadfd8;
          padding: 25px;
        }

        .panel-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .panel-heading h2 {
          margin: 7px 0 0;
          font-size: 28px;
        }

        .panel-heading a {
          color: #542f35;
          border-bottom: 1px solid #542f35;
        }

        .status-list {
          display: grid;
          gap: 0;
        }

        .status-list div {
          display: flex;
          justify-content: space-between;
          padding: 13px 0;
          border-bottom: 1px solid #eee3de;
          font-size: 12px;
          letter-spacing: 1px;
        }

        .status-list strong {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 15px;
          font-weight: 400;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0;
        }

        .status-list .cancelled {
          color: #8a3f45;
        }

        .inventory-summary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 18px;
        }

        .inventory-summary div {
          background: #faf6f1;
          border: 1px solid #eadfd8;
          padding: 15px;
        }

        .inventory-summary strong {
          display: block;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 28px;
          font-weight: 400;
          font-variant-numeric: tabular-nums;
        }

        .inventory-summary span {
          color: #80676a;
          font-size: 11px;
        }

        .stock-list {
          display: grid;
          gap: 10px;
        }

        .stock-product {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          border-bottom: 1px solid #eee3de;
          padding: 10px 0;
        }

        .stock-product strong,
        .stock-product small {
          display: block;
        }

        .stock-product strong {
          font-size: 13px;
        }

        .stock-product small {
          color: #987276;
          margin-top: 4px;
          font-size: 10px;
        }

        .stock-sizes {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .stock-sizes span {
          padding: 5px 7px;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 9px;
          font-weight: 400;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }

        .stock-sizes .low {
          background: #f5e6c8;
          color: #8a5a18;
        }

        .stock-sizes .out {
          background: #f3d7d7;
          color: #8a3038;
        }

        .healthy,
        .empty {
          padding: 25px 0;
          color: #35633b;
          font-size: 13px;
        }

        .empty {
          color: #80676a;
        }

        .recent-panel {
          margin-bottom: 22px;
        }

        .orders-list {
          display: grid;
        }

        .order-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding: 15px 0;
          border-bottom: 1px solid #eee3de;
        }

        .order-row > div:first-child strong,
        .order-row > div:first-child span {
          display: block;
        }

        .order-row > div:first-child strong {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 14px;
          font-weight: 400;
          font-variant-numeric: tabular-nums;
        }

        .order-row > div:first-child span {
          color: #80676a;
          font-size: 12px;
          margin-top: 4px;
        }

        .order-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dashboard-number {
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 400;
          font-variant-numeric: tabular-nums;
        }

        .status {
          padding: 5px 8px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .5px;
          background: #eee2dc;
          color: #542f35;
        }

        .status-delivered {
          background: #e4efe4;
          color: #35633b;
        }

        .status-cancelled {
          background: #f3d7d7;
          color: #8a3038;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .quick-actions a {
          text-align: center;
          text-decoration: none;
          background: #542f35;
          color: #fff;
          padding: 16px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .dashboard-footer {
          text-align: center;
          padding: 30px 20px;
          color: #987276;
          font-size: 11px;
          letter-spacing: 1px;
        }

        .loading {
          background: #fffdfb;
          border: 1px solid #eadfd8;
          padding: 60px;
          text-align: center;
        }

        @media (max-width: 1050px) {
          .stat-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 760px) {
          .dashboard-title-row {
            flex-direction: column;
            align-items: stretch;
          }

          .dashboard-content {
            padding: 32px 16px 60px;
          }

          h1 {
            font-size: 38px;
          }

          .two-column {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 520px) {
          .stat-grid {
            grid-template-columns: 1fr 1fr;
          }

          .stat-card {
            padding: 16px;
          }

          .stat-card strong {
            font-size: 23px;
          }

          .panel {
            padding: 18px;
          }

          .stock-product,
          .order-row {
            align-items: flex-start;
            flex-direction: column;
          }

          .stock-sizes,
          .order-meta {
            justify-content: flex-start;
          }

          .inventory-summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
