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

function money(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function normalizeOrder(raw: any): Order | null {
  if (!raw || typeof raw !== "object") return null;
  const orderNumber = String(raw.orderNumber || raw.orderNo || raw.orderId || raw.id || "");
  if (!orderNumber) return null;

  return {
    orderNumber,
    createdAt: raw.createdAt,
    total: Number(raw.total || raw.grandTotal || raw.amount) || 0,
    status: String(raw.status || "NEW"),
    items: Array.isArray(raw.items)
      ? raw.items.map((item: any) => ({
          productId: item?.productId ? String(item.productId) : undefined,
          name: item?.name || item?.productName || "Product",
          price: Number(item?.price || item?.amount) || 0,
          quantity: Number(item?.quantity || item?.qty) || 1,
        }))
      : [],
  };
}

type ProductStat = {
  key: string;
  name: string;
  category: string;
  units: number;
  revenue: number;
  orders: number;
};

export default function AdminProductPerformancePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [loaded, setLoaded] = useState(false);

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

  const stats = useMemo(() => {
    const map = new Map<string, ProductStat>();

    const productCategory = new Map<string, string>();
    products.forEach((product) => {
      const categoryValue = String(product.category || "");
      if (product.id) productCategory.set(String(product.id).toLowerCase(), categoryValue);
      if (product.name) productCategory.set(product.name.toLowerCase(), categoryValue);
    });

    orders
      .filter((order) => order.status !== "CANCELLED")
      .forEach((order) => {
        const seenInOrder = new Set<string>();

        order.items.forEach((item) => {
          const key = String(item.productId || item.name || "product").toLowerCase();
          const name = String(item.name || "Product");
          const categoryValue =
            productCategory.get(String(item.productId || "").toLowerCase()) ||
            productCategory.get(name.toLowerCase()) ||
            "Other";
          const quantity = Number(item.quantity || 1);
          const revenue = Number(item.price || 0) * quantity;

          const existing = map.get(key);
          if (existing) {
            existing.units += quantity;
            existing.revenue += revenue;
            if (!seenInOrder.has(key)) existing.orders += 1;
          } else {
            map.set(key, {
              key,
              name,
              category: categoryValue,
              units: quantity,
              revenue,
              orders: 1,
            });
          }
          seenInOrder.add(key);
        });
      });

    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }, [orders, products]);

  const filtered = stats.filter((item) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    const matchesCategory = category === "ALL" || item.category === category;
    return matchesSearch && matchesCategory;
  });

  const totals = stats.reduce(
    (acc, item) => ({
      units: acc.units + item.units,
      revenue: acc.revenue + item.revenue,
    }),
    { units: 0, revenue: 0 }
  );

  return (
    <main className="page">
      <section className="content">
        <div className="heading">
          <div>
            <div className="eyebrow">PRODUCT PERFORMANCE</div>
            <h1>Product Sales</h1>
            <p>See which DREAMZY products are generating sales.</p>
          </div>
          <button onClick={refresh}>REFRESH</button>
        </div>

        {!loaded ? (
          <div className="empty">Loading product sales...</div>
        ) : (
          <>
            <div className="summary">
              <div><span>PRODUCTS SOLD</span><strong>{stats.length}</strong></div>
              <div><span>UNITS SOLD</span><strong>{totals.units}</strong></div>
              <div><span>PRODUCT REVENUE</span><strong>{money(totals.revenue)}</strong></div>
            </div>

            <div className="controls">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search product..."
              />
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="ALL">All categories</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>

            <section className="panel">
              <div className="panel-head">
                <div>
                  <div className="eyebrow">SALES RANKING</div>
                  <h2>Products</h2>
                </div>
                <span className="count">{filtered.length} PRODUCTS</span>
              </div>

              {filtered.length === 0 ? (
                <div className="empty-inner">No product sales found.</div>
              ) : (
                <div className="table">
                  <div className="table-row header">
                    <span>PRODUCT</span>
                    <span>CATEGORY</span>
                    <span>UNITS</span>
                    <span>ORDERS</span>
                    <span>REVENUE</span>
                  </div>

                  {filtered.map((item, index) => (
                    <div className="table-row" key={item.key}>
                      <div className="product">
                        <b>#{index + 1}</b>
                        <strong>{item.name}</strong>
                      </div>
                      <span>{item.category}</span>
                      <strong>{item.units}</strong>
                      <strong>{item.orders}</strong>
                      <strong>{money(item.revenue)}</strong>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </section>

      <style jsx>{`
        .page{min-height:100vh;background:#faf6f1;color:#542f35;font-family:Arial,sans-serif}
        .content{max-width:1250px;margin:0 auto;padding:45px 28px 80px}
        .heading{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:28px}
        .eyebrow{color:#987276;font-size:10px;font-weight:700;letter-spacing:2.5px}
        h1,h2{font-family:Arial,Helvetica,sans-serif;font-weight:400}
        h1{font-size:48px;margin:10px 0 6px}
        h2{font-size:30px;margin:8px 0 0}
        .heading p{margin:0;color:#80676a}
        button{height:44px;border:1px solid #cdb9b5;background:#fffdfb;color:#542f35;padding:0 18px;font-weight:700;cursor:pointer}
        .summary{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:22px}
        .summary>div{background:#fffdfb;border:1px solid #eadfd8;padding:20px}
        .summary span{display:block;color:#987276;font-size:9px;font-weight:700;letter-spacing:1.6px}
        .summary strong{display:block;font-family:Arial,Helvetica,sans-serif;font-size:27px;margin-top:12px}
        .controls{display:grid;grid-template-columns:1fr 180px;gap:12px;margin-bottom:18px}
        input,select{width:100%;height:48px;box-sizing:border-box;border:1px solid #d9cbc7;background:#fffdfb;color:#542f35;padding:0 13px;outline:none}
        .panel{background:#fffdfb;border:1px solid #eadfd8;padding:25px}
        .panel-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
        .count{font-size:9px;font-weight:700;letter-spacing:1px;color:#987276}
        .table-row{display:grid;grid-template-columns:2fr 1fr .7fr .7fr 1fr;gap:15px;align-items:center;padding:16px 0;border-bottom:1px solid #eee3de}
        .table-row.header{color:#987276;font-size:9px;font-weight:700;letter-spacing:1.3px}
        .product{display:flex;align-items:center;gap:12px;min-width:0}
        .product b{font-size:10px;color:#987276}
        .product strong{font-family:Arial,Helvetica,sans-serif;font-size:17px;font-weight:400}
        .table-row:not(.header)>span{font-size:11px;color:#80676a}
        .table-row:not(.header)>strong{font-size:12px}
        .empty,.empty-inner{background:#fffdfb;border:1px solid #eadfd8;padding:60px;text-align:center;color:#80676a}
        .empty-inner{border:0;padding:30px}
        @media(max-width:800px){.summary{grid-template-columns:1fr}.controls{grid-template-columns:1fr}.table{overflow-x:auto}.table-row{min-width:700px}.panel{overflow:hidden}}
        @media(max-width:700px){.content{padding:32px 16px 60px}.heading{flex-direction:column;align-items:stretch}h1{font-size:38px}button{width:100%}}
      `}</style>
    </main>
  );
}
