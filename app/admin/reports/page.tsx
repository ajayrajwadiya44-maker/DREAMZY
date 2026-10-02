"use client";

import { useEffect, useMemo, useState } from "react";

type Order = {
  orderNumber: string;
  createdAt?: string;
  subtotal?: number;
  taxableSubtotal?: number;
  gstRate?: number;
  gstAmount?: number;
  gstInclusive?: boolean;
  total: number;
  status: string;
};

function readJSON(key: string, fallback: any) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeOrder(raw: any): Order | null {
  if (!raw || typeof raw !== "object") return null;
  const orderNumber = String(raw.orderNumber || raw.orderNo || raw.orderId || raw.id || "");
  if (!orderNumber) return null;
  return {
    orderNumber,
    createdAt: raw.createdAt,
    subtotal: Number(raw.subtotal) || 0,
    taxableSubtotal: raw.taxableSubtotal !== undefined ? Number(raw.taxableSubtotal) : undefined,
    gstRate: raw.gstRate !== undefined ? Number(raw.gstRate) : undefined,
    gstAmount: raw.gstAmount !== undefined ? Number(raw.gstAmount) : undefined,
    gstInclusive: raw.gstInclusive !== false,
    total: Number(raw.total || raw.grandTotal || raw.amount) || 0,
    status: String(raw.status || "NEW"),
  };
}

function money(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function dayKey(dateValue?: string) {
  if (!dateValue) return "";
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function prettyDate(key: string) {
  const [y,m,d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [range, setRange] = useState("30");
  const [loaded, setLoaded] = useState(false);

  function refresh() {
    const raw = readJSON("dreamzy-orders", []);
    setOrders(
      Array.isArray(raw)
        ? (raw.map(normalizeOrder).filter(Boolean) as Order[])
        : []
    );
    setLoaded(true);
  }

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("dreamzy-orders-updated", handler);
    window.addEventListener("storage", handler);
    window.addEventListener("focus", handler);
    return () => {
      window.removeEventListener("dreamzy-orders-updated", handler);
      window.removeEventListener("storage", handler);
      window.removeEventListener("focus", handler);
    };
  }, []);

  const report = useMemo(() => {
    const now = new Date();
    const days = Number(range);
    const start = new Date(now);
    start.setHours(0,0,0,0);
    start.setDate(start.getDate() - (days - 1));

    const filtered = orders.filter((order) => {
      if (order.status === "CANCELLED") return false;
      const time = new Date(order.createdAt || 0).getTime();
      return Number.isFinite(time) && time >= start.getTime();
    });

    const byDay = new Map<string, { orders: number; sales: number; salesBeforeGST: number; gstCollected: number }>();
    for (const order of filtered) {
      const key = dayKey(order.createdAt);
      if (!key) continue;
      const existing = byDay.get(key) || {
        orders: 0,
        sales: 0,
        salesBeforeGST: 0,
        gstCollected: 0
      };
      const gst = order.gstAmount !== undefined
        ? order.gstAmount
        : (order.gstInclusive ? (order.subtotal || order.total) - (order.subtotal || order.total) / 1.05 : 0);
      const beforeGST = order.taxableSubtotal !== undefined
        ? order.taxableSubtotal
        : order.gstAmount !== undefined
          ? (order.subtotal || order.total) - order.gstAmount
          : (order.gstInclusive ? (order.subtotal || order.total) / 1.05 : (order.subtotal || order.total));
      existing.orders += 1;
      existing.sales += order.total;
      existing.salesBeforeGST += beforeGST;
      existing.gstCollected += gst;
      byDay.set(key, existing);
    }

    const rows = Array.from(byDay.entries())
      .map(([date, value]) => ({ date, ...value }))
      .sort((a,b) => b.date.localeCompare(a.date));

    const sales = filtered.reduce((sum, order) => sum + order.total, 0);
    const gstCollected = filtered.reduce((sum, order) => {
      if (order.gstAmount !== undefined) return sum + order.gstAmount;
      const subtotal = order.subtotal || order.total;
      return sum + (order.gstInclusive ? subtotal - subtotal / 1.05 : 0);
    }, 0);
    const salesBeforeGST = filtered.reduce((sum, order) => {
      if (order.taxableSubtotal !== undefined) return sum + order.taxableSubtotal;
      if (order.gstAmount !== undefined) return sum + ((order.subtotal || order.total) - order.gstAmount);
      const subtotal = order.subtotal || order.total;
      return sum + (order.gstInclusive ? subtotal / 1.05 : subtotal);
    }, 0);

    return {
      sales,
      salesBeforeGST,
      gstCollected,
      orders: filtered.length,
      average: filtered.length ? sales / filtered.length : 0,
      rows,
    };
  }, [orders, range]);

  return (
    <main className="page">
      <section className="content">
        <div className="heading">
          <div>
            <div className="eyebrow">BUSINESS REPORTING</div>
            <h1>Sales Report</h1>
            <p>Review date-wise DREAMZY sales and order activity.</p>
          </div>
          <button onClick={refresh}>REFRESH</button>
        </div>

        <div className="controls">
          <label>
            REPORT PERIOD
            <select value={range} onChange={(e) => setRange(e.target.value)}>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last 365 days</option>
            </select>
          </label>
        </div>

        {!loaded ? (
          <div className="empty">Loading report...</div>
        ) : (
          <>
            <div className="summary">
              <div><span>SALES BEFORE GST</span><strong>{money(report.salesBeforeGST)}</strong></div>
              <div><span>GST COLLECTED</span><strong>{money(report.gstCollected)}</strong></div>
              <div><span>TOTAL INCLUDING GST</span><strong>{money(report.sales)}</strong></div>
              <div><span>ORDERS</span><strong>{report.orders}</strong></div>
              <div><span>AVERAGE ORDER VALUE</span><strong>{money(report.average)}</strong></div>
            </div>

            <section className="panel">
              <div className="panel-head">
                <div>
                  <div className="eyebrow">DATE-WISE ACTIVITY</div>
                  <h2>Daily Sales</h2>
                </div>
                <span>{report.rows.length} DAYS WITH SALES</span>
              </div>

              {report.rows.length === 0 ? (
                <div className="empty-inner">
                  No sales found for this period.
                </div>
              ) : (
                <div className="table-wrap">
                  <div className="table">
                    <div className="row header">
                      <span>DATE</span>
                      <span>ORDERS</span>
                      <span>BEFORE GST</span>
                      <span>GST</span>
                      <span>TOTAL</span>
                    </div>
                    {report.rows.map((row) => (
                      <div className="row" key={row.date}>
                        <strong>{prettyDate(row.date)}</strong>
                        <span>{row.orders}</span>
                        <strong>{money(row.salesBeforeGST)}</strong>
                        <strong>{money(row.gstCollected)}</strong>
                        <strong>{money(row.sales)}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </section>

      <style jsx>{`
        .page{min-height:100vh;background:#faf6f1;color:#542f35;font-family:Arial,sans-serif}
        .content{max-width:1100px;margin:0 auto;padding:45px 28px 80px}
        .heading{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:28px}
        .eyebrow{color:#987276;font-size:10px;font-weight:700;letter-spacing:2.5px}
        h1,h2{font-family:Arial, Helvetica, sans-serif;font-weight:400}
        h1{font-size:48px;margin:10px 0 6px}
        h2{font-size:30px;margin:8px 0 0}
        .heading p{margin:0;color:#80676a}
        button{height:44px;border:1px solid #cdb9b5;background:#fffdfb;color:#542f35;padding:0 18px;font-weight:700;cursor:pointer}
        .controls{display:flex;justify-content:flex-end;margin-bottom:18px}
        label{display:flex;align-items:center;gap:12px;color:#987276;font-size:9px;font-weight:700;letter-spacing:1.5px}
        select{height:44px;border:1px solid #d9cbc7;background:#fffdfb;color:#542f35;padding:0 14px;font-size:13px}
        .summary{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:22px}
        .summary>div{background:#fffdfb;border:1px solid #eadfd8;padding:22px}
        .summary span{display:block;color:#987276;font-size:9px;font-weight:700;letter-spacing:1.6px}
        .summary strong{display:block;font-family:Arial, Helvetica, sans-serif;font-size:28px;margin-top:12px}
        .panel{background:#fffdfb;border:1px solid #eadfd8;padding:25px}
        .panel-head{display:flex;justify-content:space-between;align-items:center;gap:15px;margin-bottom:18px}
        .panel-head>span{color:#987276;font-size:9px;font-weight:700;letter-spacing:1px}
        .row{display:grid;grid-template-columns:2fr 1fr 1fr;gap:15px;align-items:center;padding:16px 0;border-bottom:1px solid #eee3de}
        .row.header{color:#987276;font-size:9px;font-weight:700;letter-spacing:1.3px}
        .row:not(.header)>span{font-size:12px;color:#80676a}
        .empty,.empty-inner{background:#fffdfb;border:1px solid #eadfd8;padding:60px;text-align:center;color:#80676a}
        .empty-inner{border:0;padding:35px}
        @media(max-width:700px){.content{padding:32px 16px 60px}.heading{flex-direction:column;align-items:stretch}h1{font-size:38px}button{width:100%}.controls{justify-content:stretch}label{width:100%;flex-direction:column;align-items:stretch}.summary{grid-template-columns:1fr}.panel{padding:18px}.row{grid-template-columns:1.4fr .7fr 1fr}}
        .table-wrap{width:100%;overflow-x:auto}
        .table{min-width:760px;display:grid;gap:0}
        .row{display:grid;grid-template-columns:1.45fr .65fr 1.1fr 1.1fr 1.1fr;gap:15px;align-items:center;padding:15px 0;border-bottom:1px solid #eee3de}
        .row > *{min-width:0}
        .row span,.row strong{white-space:nowrap}
      `}</style>
    </main>
  );
}
