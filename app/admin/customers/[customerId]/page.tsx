"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Item = {
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
  email?: string;
  mobile?: string;
  phone?: string;
  address?: string;
  apartment?: string;
  city?: string;
  state?: string;
  pincode?: string;
  total?: number;
  subtotal?: number;
  shipping?: number;
  status?: string;
  items: Item[];
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

  const rawItems = Array.isArray(raw.items) ? raw.items : [];
  const items = rawItems.map((item: any) => ({
    name: item?.name || item?.productName || "Product",
    price: Number(item?.price || item?.amount) || 0,
    size: item?.size || item?.selectedSize || "",
    quantity: Number(item?.quantity || item?.qty) || 1,
  }));

  return {
    orderNumber,
    createdAt: raw.createdAt,
    firstName: raw.firstName || "",
    lastName: raw.lastName || "",
    customer: raw.customerName || raw.customer || raw.name || "",
    email: raw.email || raw.customerEmail || "",
    mobile: raw.mobile || raw.phone || raw.customerMobile || "",
    phone: raw.phone || "",
    address: raw.address || raw.addressLine1 || "",
    apartment: raw.apartment || raw.addressLine2 || "",
    city: raw.city || "",
    state: raw.state || "",
    pincode: raw.pincode || raw.pinCode || raw.zip || "",
    total: Number(raw.total || raw.grandTotal || raw.amount) || 0,
    subtotal: Number(raw.subtotal) || 0,
    shipping: Number(raw.shipping) || 0,
    status: String(raw.status || "NEW"),
    items,
  };
}

function customerIdentity(order: Order) {
  const email = String(order.email || "").trim().toLowerCase();
  const mobile = String(order.mobile || order.phone || "").trim();
  const name =
    `${order.firstName || ""} ${order.lastName || ""}`.trim() ||
    order.customer ||
    "Customer";
  return {
    key: email || mobile || name.toLowerCase(),
    name,
    email: order.email || "",
    mobile: order.mobile || order.phone || "",
  };
}

export default function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const [customerId, setCustomerId] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    params.then((value) => setCustomerId(value.customerId));
  }, [params]);

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

  const customerOrders = useMemo(() => {
    if (!customerId) return [];

    // Next.js normally decodes dynamic route params automatically, but
    // support either encoded or decoded customer keys to avoid false
    // "Customer not found" results for special characters.
    const candidates = new Set<string>([customerId]);
    try {
      candidates.add(decodeURIComponent(customerId));
    } catch {
      // Keep the original candidate if it is not a valid encoded string.
    }
    try {
      candidates.add(encodeURIComponent(customerId));
    } catch {
      // Keep the original candidate if it cannot be encoded.
    }

    return orders
      .filter((order) => candidates.has(customerIdentity(order).key))
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
  }, [orders, customerId]);

  const customer = useMemo(() => {
    if (!customerOrders.length) return null;
    const identity = customerIdentity(customerOrders[0]);
    const spent = customerOrders.reduce(
      (sum, order) =>
        order.status === "CANCELLED" ? sum : sum + Number(order.total || 0),
      0
    );
    return { ...identity, spent };
  }, [customerOrders]);

  if (!loaded) {
    return <main className="page"><div className="loading">Loading customer...</div></main>;
  }

  if (!customer) {
    return (
      <main className="page">
        <section className="content">
          <Link href="/admin/customers" className="back">← BACK TO CUSTOMERS</Link>
          <div className="empty">
            <h1>Customer not found</h1>
            <p>This customer could not be found in DREAMZY orders.</p>
          </div>
        </section>
        <style jsx>{`
          .page{min-height:100vh;background:#faf6f1;color:#542f35;font-family:Arial,sans-serif}
          .content{max-width:1100px;margin:0 auto;padding:40px 28px 80px}
          .back{color:#542f35;text-decoration:none;font-size:10px;font-weight:700;letter-spacing:1px}
          .empty{margin-top:25px;background:#fffdfb;border:1px solid #eadfd8;padding:70px 20px;text-align:center}
          h1{font-family:Georgia,serif;font-weight:400}
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="content">
        <Link href="/admin/customers" className="back">← BACK TO CUSTOMERS</Link>

        <div className="heading">
          <div>
            <div className="eyebrow">CUSTOMER PROFILE</div>
            <h1>{customer.name}</h1>
            <p>{customer.email || "No email"}{customer.mobile ? ` • ${customer.mobile}` : ""}</p>
          </div>
          <button onClick={refresh}>REFRESH</button>
        </div>

        <div className="stats">
          <div><span>TOTAL ORDERS</span><strong>{customerOrders.length}</strong></div>
          <div><span>TOTAL SPENT</span><strong>{money(customer.spent)}</strong></div>
          <div><span>LAST ORDER</span><strong>{customerOrders[0]?.orderNumber || "—"}</strong></div>
        </div>

        <section className="panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">ORDER HISTORY</div>
              <h2>Customer Orders</h2>
            </div>
            <Link href="/admin/orders">VIEW ALL ORDERS</Link>
          </div>

          <div className="orders">
            {customerOrders.map((order) => (
              <article key={order.orderNumber} className="order">
                <div className="order-main">
                  <Link href={`/account/orders/${encodeURIComponent(order.orderNumber)}`} className="order-number">
                    {order.orderNumber}
                  </Link>
                  <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "—"}</span>
                </div>

                <div className="order-right">
                  <span className={`status status-${String(order.status).toLowerCase()}`}>{order.status}</span>
                  <strong>{money(order.total || 0)}</strong>
                </div>

                <div className="items">
                  {order.items.length ? order.items.map((item, index) => (
                    <div key={`${order.orderNumber}-${index}`} className="item">
                      <span>{item.name}</span>
                      <small>{item.size ? `Size ${item.size} • ` : ""}Qty {item.quantity || 1}</small>
                    </div>
                  )) : (
                    <div className="item"><span>Order items unavailable</span></div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel delivery">
          <div className="eyebrow">DELIVERY INFORMATION</div>
          <h2>Customer Details</h2>
          <div className="details">
            <div><span>EMAIL</span><strong>{customer.email || "—"}</strong></div>
            <div><span>MOBILE</span><strong>{customer.mobile || "—"}</strong></div>
            <div><span>ADDRESS</span><strong>{customerOrders[0]?.address || "—"}</strong></div>
            <div><span>AREA / CITY</span><strong>{[customerOrders[0]?.apartment, customerOrders[0]?.city].filter(Boolean).join(", ") || "—"}</strong></div>
            <div><span>STATE</span><strong>{customerOrders[0]?.state || "—"}</strong></div>
            <div><span>PINCODE</span><strong>{customerOrders[0]?.pincode || "—"}</strong></div>
          </div>
        </section>
      </section>

      <style jsx>{`
        .page{min-height:100vh;background:#faf6f1;color:#542f35;font-family:Arial,sans-serif}
        .content{max-width:1100px;margin:0 auto;padding:40px 28px 80px}
        .back{color:#542f35;text-decoration:none;font-size:10px;font-weight:700;letter-spacing:1px}
        .heading{display:flex;justify-content:space-between;align-items:end;gap:20px;margin:28px 0}
        .eyebrow{color:#987276;font-size:10px;font-weight:700;letter-spacing:2.5px}
        h1,h2{font-family:Georgia,serif;font-weight:400}
        h1{font-size:46px;margin:10px 0 6px}
        h2{font-size:28px;margin:8px 0 0}
        .heading p{margin:0;color:#80676a}
        button{height:44px;border:1px solid #cdb9b5;background:#fffdfb;color:#542f35;padding:0 18px;font-weight:700;cursor:pointer}
        .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:22px}
        .stats>div{background:#fffdfb;border:1px solid #eadfd8;padding:20px}
        .stats span,.details span{display:block;color:#987276;font-size:9px;font-weight:700;letter-spacing:1.5px}
        .stats strong{display:block;font-family:Georgia,serif;font-size:25px;margin-top:12px;word-break:break-word}
        .panel{background:#fffdfb;border:1px solid #eadfd8;padding:25px;margin-bottom:22px}
        .panel-head{display:flex;justify-content:space-between;align-items:center;gap:15px;margin-bottom:18px}
        .panel-head a{color:#542f35;font-size:10px;font-weight:700;letter-spacing:1px;text-decoration:none;border-bottom:1px solid #542f35}
        .orders{display:grid}
        .order{padding:17px 0;border-bottom:1px solid #eee3de}
        .order:last-child{border-bottom:0}
        .order-main{display:flex;align-items:center;gap:14px}
        .order-number{font-weight:700;color:#542f35;text-decoration:none}
        .order-main span{font-size:11px;color:#80676a}
        .order-right{display:flex;align-items:center;gap:12px;float:right;margin-top:-22px}
        .status{padding:5px 8px;font-size:9px;font-weight:700;letter-spacing:.5px;background:#eee2dc}
        .status-delivered{background:#e4efe4;color:#35633b}
        .status-cancelled{background:#f3d7d7;color:#8a3038}
        .items{margin-top:12px;display:grid;gap:5px}
        .item{display:flex;justify-content:space-between;gap:15px;background:#faf6f1;padding:8px 10px;font-size:12px}
        .item small{color:#80676a}
        .details{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:20px}
        .details>div{border-top:1px solid #eee3de;padding-top:12px}
        .details strong{display:block;margin-top:7px;font-size:13px;word-break:break-word}
        .loading{max-width:1100px;margin:0 auto;padding:80px 28px;text-align:center}
        @media(max-width:700px){.content{padding:30px 16px 60px}.heading{flex-direction:column;align-items:stretch}.heading button{width:100%}h1{font-size:38px}.stats{grid-template-columns:1fr}.panel{padding:18px}.panel-head{align-items:flex-start;flex-direction:column}.order-right{float:none;margin:10px 0 0}.order-main{flex-direction:column;align-items:flex-start;gap:5px}.item{flex-direction:column;gap:3px}.details{grid-template-columns:1fr}}
      `}</style>
    </main>
  );
}
