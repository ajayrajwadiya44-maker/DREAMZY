"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Order = {
  orderNumber: string;
  createdAt?: string;
  firstName?: string;
  lastName?: string;
  customer?: string;
  email?: string;
  mobile?: string;
  phone?: string;
  total?: number;
  status?: string;
};

type Customer = {
  key: string;
  name: string;
  email: string;
  mobile: string;
  orders: number;
  spent: number;
  active: boolean;
  lastOrder?: string;
  lastDate?: string;
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
    firstName: raw.firstName || "",
    lastName: raw.lastName || "",
    customer: raw.customerName || raw.customer || raw.name || "",
    email: raw.email || raw.customerEmail || "",
    mobile: raw.mobile || raw.phone || raw.customerMobile || "",
    phone: raw.phone || "",
    total: Number(raw.total || raw.grandTotal || raw.amount) || 0,
    status: String(raw.status || "NEW"),
  };
}

export default function AdminCustomersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [hiddenCustomerKeys, setHiddenCustomerKeys] = useState<string[]>([]);

  function refresh() {
    const raw = readJSON("dreamzy-orders", []);
    const normalized = Array.isArray(raw)
      ? (raw.map(normalizeOrder).filter(Boolean) as Order[])
      : [];
    setOrders(normalized);
    setLoaded(true);
  }

  useEffect(() => {
    refresh();
    try {
      const savedHiddenCustomers = readJSON("dreamzy-hidden-customers", []);
      if (Array.isArray(savedHiddenCustomers)) {
        setHiddenCustomerKeys(savedHiddenCustomers.map((key) => String(key)));
      }
    } catch {
      setHiddenCustomerKeys([]);
    }
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

  const customers = useMemo<Customer[]>(() => {
    const map = new Map<string, Customer>();

    for (const order of orders) {
      const email = String(order.email || "").trim().toLowerCase();
      const mobile = String(order.mobile || order.phone || "").trim();
      const name =
        `${order.firstName || ""} ${order.lastName || ""}`.trim() ||
        order.customer ||
        "Customer";
      const key = email || mobile || name.toLowerCase();
      if (!key) continue;

      const existing = map.get(key);
      if (existing) {
        existing.orders += 1;
        if (order.status !== "CANCELLED") {
          existing.active = true;
          existing.spent += Number(order.total || 0);
        }

        const currentTime = new Date(existing.lastDate || 0).getTime();
        const newTime = new Date(order.createdAt || 0).getTime();
        if (newTime > currentTime) {
          existing.lastOrder = order.orderNumber;
          existing.lastDate = order.createdAt;
          existing.name = name;
        }
      } else {
        map.set(key, {
          key,
          name,
          email: order.email || "",
          mobile: order.mobile || order.phone || "",
          orders: 1,
          spent: order.status === "CANCELLED" ? 0 : Number(order.total || 0),
          active: order.status !== "CANCELLED",
          lastOrder: order.orderNumber,
          lastDate: order.createdAt,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => b.spent - a.spent);
  }, [orders]);

  // Customer removal is a soft delete: hide the customer from this list while
  // keeping order records intact for order history, invoices, and reporting.
  const visibleCustomers = customers.filter(
    (customer) => !hiddenCustomerKeys.includes(customer.key)
  );

  function removeCustomer(customer: Customer) {
    const confirmed = window.confirm(
      `Remove ${customer.name} from the Admin Customers list? Their orders and invoices will be kept.`
    );
    if (!confirmed) return;

    const nextHiddenKeys = Array.from(new Set([...hiddenCustomerKeys, customer.key]));
    try {
      window.localStorage.setItem(
        "dreamzy-hidden-customers",
        JSON.stringify(nextHiddenKeys)
      );
      setHiddenCustomerKeys(nextHiddenKeys);
    } catch {
      window.alert("The customer could not be removed. Please check browser storage and try again.");
    }
  }

  const filtered = visibleCustomers.filter((customer) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [customer.name, customer.email, customer.mobile, customer.lastOrder].some(
      (value) => String(value || "").toLowerCase().includes(q)
    );
  });

  return (
    <main className="customers-page">
      <section className="customers-content">
        <div className="heading-row">
          <div>
            <div className="eyebrow">CUSTOMER MANAGEMENT</div>
            <h1>Customers</h1>
            <p>View customer activity from DREAMZY orders.</p>
          </div>
          <button onClick={refresh} type="button">REFRESH</button>
        </div>

        <div className="summary">
          <div><span>TOTAL CUSTOMERS</span><strong>{visibleCustomers.length}</strong></div>
          <div><span>TOTAL ORDERS</span><strong>{orders.length}</strong></div>
          <div><span>ACTIVE CUSTOMERS</span><strong>{customers.filter((customer) => customer.active).length}</strong></div>
        </div>

        <div className="controls">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, email, mobile or order..."
          />
        </div>

        {!loaded ? (
          <div className="empty">Loading customers...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <h2>No customers found</h2>
            <p>Customers will appear here after orders are placed.</p>
          </div>
        ) : (
          <div className="customer-list">
            {filtered.map((customer) => (
              <div key={customer.key} className="customer-card">
                <Link
                  href={`/admin/customers/${encodeURIComponent(customer.key)}`}
                  className="customer-details-link"
                >
                  <div className="customer-top">
                    <div>
                      <div className="customer-name">{customer.name}</div>
                      <div className="customer-contact">
                        {customer.email || "No email"}
                        {customer.mobile ? ` • ${customer.mobile}` : ""}
                      </div>
                    </div>
                    <span className="view-link">VIEW CUSTOMER →</span>
                  </div>

                  <div className="customer-stats">
                    <div><span>ORDERS</span><strong>{customer.orders}</strong></div>
                    <div><span>SPENT</span><strong>{money(customer.spent)}</strong></div>
                    <div><span>LAST ORDER</span><strong>{customer.lastOrder || "—"}</strong></div>
                  </div>
                </Link>
                <div className="customer-actions">
                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => removeCustomer(customer)}
                    aria-label={`Remove ${customer.name} from customer list`}
                  >
                    DELETE CUSTOMER
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <style jsx>{`
        .customers-page { min-height:100vh; background:#faf6f1; color:#542f35; font-family:Arial,sans-serif; }
        .customers-content { max-width:1250px; margin:0 auto; padding:45px 28px 80px; }
        .heading-row { display:flex; justify-content:space-between; align-items:end; gap:20px; margin-bottom:28px; }
        .eyebrow { color:#987276; font-size:10px; font-weight:700; letter-spacing:2.5px; }
        h1,h2 { font-family:Georgia,serif; font-weight:400; }
        h1 { font-size:48px; margin:10px 0 6px; }
        .heading-row p { margin:0; color:#80676a; }
        button { height:44px; border:1px solid #cdb9b5; background:#fffdfb; color:#542f35; padding:0 18px; font-weight:700; cursor:pointer; }
        .summary { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:22px; }
        .summary div { background:#fffdfb; border:1px solid #eadfd8; padding:20px; }
        .summary span { display:block; color:#987276; font-size:9px; font-weight:700; letter-spacing:1.6px; }
        .summary strong { display:block; font-family:Georgia,serif; font-size:28px; margin-top:12px; }
        .controls { margin-bottom:18px; }
        input { width:100%; box-sizing:border-box; height:48px; padding:0 14px; border:1px solid #d9cbc7; background:#fffdfb; color:#542f35; outline:none; }
        .customer-list { display:grid; gap:12px; }
        .customer-card { display:block; background:#fffdfb; border:1px solid #eadfd8; padding:22px; color:inherit; transition:border-color .2s, transform .2s; }
        .customer-card:hover { border-color:#c9aaa3; }
        .customer-details-link { display:block; color:inherit; text-decoration:none; }
        .customer-details-link:hover .view-link { color:#805057; }
        .customer-actions { display:flex; justify-content:flex-end; margin-top:16px; padding-top:14px; border-top:1px solid #eee3de; }
        .delete-button { height:36px; border:1px solid #a65b62; background:#fffdfb; color:#9b343d; padding:0 14px; font-size:10px; letter-spacing:1px; font-weight:700; cursor:pointer; }
        .delete-button:hover { background:#fff1f1; }
        .customer-top { display:flex; justify-content:space-between; align-items:flex-start; gap:18px; }
        .customer-name { font-family:Georgia,serif; font-size:24px; }
        .customer-contact { color:#80676a; font-size:12px; margin-top:6px; }
        .view-link { flex:0 0 auto; font-size:9px; font-weight:700; letter-spacing:1px; border-bottom:1px solid #542f35; }
        .customer-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:18px; padding-top:16px; border-top:1px solid #eee3de; }
        .customer-stats span { display:block; color:#987276; font-size:8px; font-weight:700; letter-spacing:1.3px; }
        .customer-stats strong { display:block; margin-top:7px; font-size:13px; word-break:break-word; }
        .empty { background:#fffdfb; border:1px solid #eadfd8; padding:60px 20px; text-align:center; color:#80676a; }
        .empty h2 { color:#542f35; font-size:30px; margin:0 0 8px; }
        .empty p { margin:0; }
        @media(max-width:700px){ .customers-content{padding:32px 16px 60px;} .heading-row{flex-direction:column;align-items:stretch;} h1{font-size:38px;} button{width:100%;} .summary{grid-template-columns:1fr;} .customer-top{flex-direction:column;} .view-link{align-self:flex-start;} .customer-stats{grid-template-columns:1fr 1fr;} }
        @media(max-width:480px){ .customer-card{padding:18px;} .customer-stats{grid-template-columns:1fr;} .customer-actions{justify-content:stretch;} .delete-button{width:100%;} }
      `}</style>
    </main>
  );
}
