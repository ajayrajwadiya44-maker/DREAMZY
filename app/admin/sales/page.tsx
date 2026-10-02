"use client";

import { useEffect, useMemo, useState } from "react";

type Item = {
  productId?: string;
  name?: string;
  price?: number;
  quantity?: number;
};

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
  items: Item[];
};

type Product = {
  id?: string;
  name?: string;
  category?: string;
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

  const items = Array.isArray(raw.items)
    ? raw.items.map((item: any) => ({
        productId: item?.productId ? String(item.productId) : undefined,
        name: item?.name || item?.productName || "Product",
        price: Number(item?.price || item?.amount) || 0,
        quantity: Number(item?.quantity || item?.qty) || 1,
      }))
    : [];

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
    items,
  };
}

function money(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function AdminSalesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [range, setRange] = useState("ALL");

  function refresh() {
    const rawOrders = readJSON("dreamzy-orders", []);
    const rawProducts = readJSON("dreamzy-products", []);

    setOrders(
      Array.isArray(rawOrders)
        ? (rawOrders.map(normalizeOrder).filter(Boolean) as Order[])
        : []
    );
    setProducts(Array.isArray(rawProducts) ? rawProducts : []);
    setLoaded(true);
  }

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("dreamzy-orders-updated", handler);
    window.addEventListener("dreamzy-products-updated", handler);
    window.addEventListener("storage", handler);
    window.addEventListener("focus", handler);

    return () => {
      window.removeEventListener("dreamzy-orders-updated", handler);
      window.removeEventListener("dreamzy-products-updated", handler);
      window.removeEventListener("storage", handler);
      window.removeEventListener("focus", handler);
    };
  }, []);

  const report = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    if (range === "7") start.setDate(start.getDate() - 6);
    if (range === "30") start.setDate(start.getDate() - 29);
    if (range === "90") start.setDate(start.getDate() - 89);
    start.setHours(0, 0, 0, 0);

    const inRange = (o: Order) => {
      if (range === "ALL") return true;
      const t = new Date(o.createdAt || 0).getTime();
      return Number.isFinite(t) && t >= start.getTime();
    };

    const rangedOrders = orders.filter(inRange);
    const validOrders = rangedOrders.filter((o) => o.status !== "CANCELLED");
    const cancelledOrders = rangedOrders.filter((o) => o.status === "CANCELLED");

    const totalSales = validOrders.reduce((sum, o) => sum + o.total, 0);
    const gstCollected = validOrders.reduce((sum, o) => {
      if (o.gstAmount !== undefined) return sum + o.gstAmount;
      const subtotal = o.subtotal || o.total;
      return sum + (o.gstInclusive ? subtotal - subtotal / 1.05 : 0);
    }, 0);
    const salesBeforeGST = validOrders.reduce((sum, o) => {
      if (o.taxableSubtotal !== undefined) return sum + o.taxableSubtotal;
      if (o.gstAmount !== undefined) return sum + ((o.subtotal || o.total) - o.gstAmount);
      const subtotal = o.subtotal || o.total;
      return sum + (o.gstInclusive ? subtotal / 1.05 : subtotal);
    }, 0);
    const averageOrderValue = validOrders.length ? totalSales / validOrders.length : 0;

    const productMap = new Map<string, string>();
    products.forEach((p) => {
      const key = String(p.id || p.name || "").toLowerCase();
      if (key) productMap.set(key, String(p.category || ""));
      if (p.name) productMap.set(p.name.toLowerCase(), String(p.category || ""));
    });

    let womenSales = 0;
    let kidsSales = 0;

    validOrders.forEach((order) => {
      order.items.forEach((item) => {
        const category =
          productMap.get(String(item.productId || "").toLowerCase()) ||
          productMap.get(String(item.name || "").toLowerCase()) ||
          "";

        const lineTotal = Number(item.price || 0) * Number(item.quantity || 1);
        if (category === "Kids") kidsSales += lineTotal;
        else if (category === "Women") womenSales += lineTotal;
      });
    });

    const delivered = validOrders.filter((o) => o.status === "DELIVERED").length;

    const productMapSales = new Map<string, { name: string; units: number; revenue: number }>();
    validOrders.forEach((order) => {
      order.items.forEach((item) => {
        const key = String(item.productId || item.name || "product").toLowerCase();
        const existing = productMapSales.get(key) || {
          name: String(item.name || "Product"),
          units: 0,
          revenue: 0,
        };
        existing.units += Number(item.quantity || 1);
        existing.revenue += Number(item.price || 0) * Number(item.quantity || 1);
        productMapSales.set(key, existing);
      });
    });

    const topProducts = Array.from(productMapSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const recent = [...validOrders]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 10);

    return {
      totalSales,
      salesBeforeGST,
      gstCollected,
      validOrders: validOrders.length,
      cancelledOrders: cancelledOrders.length,
      delivered,
      averageOrderValue,
      womenSales,
      kidsSales,
      topProducts,
      recent,
    };
  }, [orders, products]);

  return (
    <main className="sales-page">
      <section className="sales-content">
        <div className="heading-row">
          <div>
            <div className="eyebrow">STORE PERFORMANCE</div>
            <h1>Sales & Revenue</h1>
            <p>Review DREAMZY sales performance from your store orders.</p>
          </div>
          <button type="button" onClick={refresh}>REFRESH</button>
        </div>
        <div className="filters">
          <span>REPORT PERIOD</span>
          {[
            ["ALL", "All time"],
            ["7", "Last 7 days"],
            ["30", "Last 30 days"],
            ["90", "Last 90 days"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={range === value ? "active" : ""}
              onClick={() => setRange(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {!loaded ? (
          <div className="empty">Loading sales report...</div>
        ) : (
          <>
            <div className="summary">
              <div><span>SALES BEFORE GST</span><strong>{money(report.salesBeforeGST)}</strong></div>
              <div><span>GST COLLECTED</span><strong>{money(report.gstCollected)}</strong></div>
              <div><span>TOTAL INCLUDING GST</span><strong>{money(report.totalSales)}</strong></div>
              <div><span>ACTIVE ORDERS</span><strong>{report.validOrders}</strong></div>
              <div><span>AVERAGE ORDER VALUE</span><strong>{money(report.averageOrderValue)}</strong></div>
              <div><span>DELIVERED ORDERS</span><strong>{report.delivered}</strong></div>
              <div><span>CANCELLED ORDERS</span><strong>{report.cancelledOrders}</strong></div>
            </div>

            <div className="category-grid">
              <div className="category-card">
                <span>WOMEN</span>
                <strong>{money(report.womenSales)}</strong>
                <small>Sales by product line</small>
              </div>
              <div className="category-card">
                <span>KIDS</span>
                <strong>{money(report.kidsSales)}</strong>
                <small>Sales by product line</small>
              </div>
            </div>

            <section className="panel top-products">
              <div className="panel-heading">
                <div>
                  <div className="eyebrow">PRODUCT PERFORMANCE</div>
                  <h2>Top Products</h2>
                </div>
              </div>
              {report.topProducts.length === 0 ? (
                <div className="empty-inner">No product sales yet.</div>
              ) : (
                <div className="top-product-list">
                  {report.topProducts.map((item) => (
                    <div className="top-product-row" key={item.name}>
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.units} unit{item.units === 1 ? "" : "s"} sold</span>
                      </div>
                      <strong>{money(item.revenue)}</strong>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <div className="eyebrow">LATEST ACTIVITY</div>
                  <h2>Recent Sales</h2>
                </div>
              </div>

              {report.recent.length === 0 ? (
                <div className="empty-inner">No sales yet.</div>
              ) : (
                <div className="sales-list">
                  {report.recent.map((order) => (
                    <div className="sale-row" key={order.orderNumber}>
                      <div>
                        <strong>{order.orderNumber}</strong>
                        <span>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-IN")
                            : "—"}
                        </span>
                      </div>
                      <div className="sale-right">
                        <span className={`status status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                        <strong>{money(order.total)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </section>

      <style jsx>{`
        .sales-page{min-height:100vh;background:#faf6f1;color:#542f35;font-family:Arial,sans-serif}
        .sales-content{max-width:1250px;margin:0 auto;padding:45px 28px 80px}
        .heading-row{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:28px}
        .eyebrow{color:#987276;font-size:10px;font-weight:700;letter-spacing:2.5px}
        h1,h2{font-family:Arial,Helvetica,sans-serif;font-weight:400}
        h1{font-size:48px;margin:10px 0 6px}
        h2{font-size:30px;margin:8px 0 0}
        .heading-row p{margin:0;color:#80676a}
        button{height:44px;border:1px solid #cdb9b5;background:#fffdfb;color:#542f35;padding:0 18px;font-weight:700;cursor:pointer}
        .filters{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:22px}
        .filters>span{font-size:9px;font-weight:700;letter-spacing:1.8px;color:#987276;margin-right:4px}
        .filters button{height:36px;padding:0 14px;border:1px solid #eadfd8;background:#fffdfb;color:#80676a;font-size:11px;font-weight:700;cursor:pointer}
        .filters button.active{background:#542f35;color:#fffdfb;border-color:#542f35}
        .summary{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:22px}
        .summary>div,.category-card,.panel{background:#fffdfb;border:1px solid #eadfd8}
        .summary>div{padding:20px;min-height:105px}
        .summary span,.category-card span{display:block;color:#987276;font-size:9px;font-weight:700;letter-spacing:1.6px}
        .summary strong,.category-card strong{display:block;font-family:Arial,Helvetica,sans-serif;font-size:26px;margin-top:13px}
        .category-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin-bottom:24px}
        .category-card{
          padding:28px 26px;
          min-height:150px;
          height:auto;
          box-sizing:border-box;
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:flex-start;
          align-self:stretch;
        }
        .category-card span{
          display:block;
          color:#987276;
          font-size:9px;
          font-weight:700;
          letter-spacing:2px;
          line-height:1.2;
          margin:0 0 10px;
        }
        .category-card strong{
          display:block;
          color:#542f35;
          font-family:Arial, Helvetica, sans-serif;
          font-size:32px;
          font-weight:600;
          line-height:1.05;
          letter-spacing:-0.4px;
          margin:0;
        }
        .category-card small{
          display:block;
          margin:9px 0 0;
          color:#80676a;
          font-size:11px;
          line-height:1.4;
        }
        @media(max-width:700px){
          .category-grid{grid-template-columns:1fr;gap:12px}
          .category-card{min-height:125px;padding:20px 22px}
          .category-card strong{font-size:28px}
        }
        .panel{padding:25px}
        .panel + .panel{margin-top:24px}
        .panel-heading{margin-bottom:18px}
        .top-product-list{display:grid}
        .top-product-row{display:flex;justify-content:space-between;align-items:center;gap:15px;padding:15px 0;border-bottom:1px solid #eee3de}
        .top-product-row span{display:block;font-size:11px;color:#80676a;margin-top:4px}
        .top-product-row>strong{font-family:Arial,Helvetica,sans-serif;font-size:20px}
        .sales-list{display:grid}
        .sale-row{display:flex;justify-content:space-between;align-items:center;gap:15px;padding:16px 0;border-bottom:1px solid #eee3de}
        .sale-row>div:first-child strong,.sale-row>div:first-child span{display:block}
        .sale-row>div:first-child span{font-size:11px;color:#80676a;margin-top:4px}
        .sale-right{display:flex;align-items:center;gap:12px}
        .status{padding:5px 8px;font-size:9px;font-weight:700;letter-spacing:.5px;background:#eee2dc}
        .status-delivered{background:#e4efe4;color:#35633b}
        .status-cancelled{background:#f3d7d7;color:#8a3038}
        .empty,.empty-inner{background:#fffdfb;border:1px solid #eadfd8;padding:60px;text-align:center;color:#80676a}
        .empty-inner{border:0;padding:30px 0}
        @media(max-width:900px){.summary{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:700px){.sales-content{padding:32px 16px 60px}.heading-row{flex-direction:column;align-items:stretch}h1{font-size:38px}button{width:100%}.summary,.category-grid{grid-template-columns:1fr}.panel{padding:18px}.sale-row{align-items:flex-start;flex-direction:column}.sale-right{justify-content:flex-start;flex-wrap:wrap}}
      `}</style>
    </main>
  );
}
