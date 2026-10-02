"use client";

import { useEffect, useMemo, useState } from "react";
import { DREAMZY_INVOICE_CONFIG, GSTIN_PENDING } from "@/app/lib/invoice-config";
import Link from "next/link";
import { useParams } from "next/navigation";

type Item = {
  id?: string;
  productId?: string;
  name?: string;
  price?: number;
  size?: string;
  quantity?: number;
  image?: string;
  hsnSac?: string;
  gstRate?: number;
};

type Order = {
  orderNumber: string;
  createdAt?: string;
  paymentMethod: string;
  customer: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  pincode: string;
  deliveryAddressId?: string;
  deliveryAddressLabel?: string;
  items: Item[];
  subtotal: number;
  taxableSubtotal?: number;
  gstRate?: number;
  gstAmount?: number;
  gstInclusive?: boolean;
  shipping: number;
  total: number;
  status: string;
  invoiceNumber?: string;
};

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
};

const STEPS = ["NEW", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"];

function text(value: unknown) {
  return value === undefined || value === null ? "" : String(value).trim();
}

function number(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function normalize(raw: any): Order | null {
  if (!raw || typeof raw !== "object") return null;

  const customerObject =
    raw.customer && typeof raw.customer === "object"
      ? raw.customer
      : raw.customerDetails && typeof raw.customerDetails === "object"
        ? raw.customerDetails
        : {};

  const customerName =
    typeof raw.customer === "string"
      ? raw.customer
      : text(
          raw.customerName ||
          raw.name ||
          customerObject.fullName ||
          customerObject.name
        );

  const parts = customerName.split(/\s+/).filter(Boolean);

  const firstName = text(
    raw.firstName || customerObject.firstName || parts[0]
  );
  const lastName = text(
    raw.lastName || customerObject.lastName || parts.slice(1).join(" ")
  );

  const itemsSource = Array.isArray(raw.items)
    ? raw.items
    : Array.isArray(raw.cart)
      ? raw.cart
      : [];

  const items = itemsSource.map((item: any) => ({
    id: text(item.id),
    productId: text(item.productId),
    name: text(item.name || item.productName) || "Product",
    price: number(item.price || item.amount),
    size: text(item.size || item.selectedSize),
    quantity: number(item.quantity || item.qty) || 1,
    image: text(item.image || item.imageUrl || item.productImage),
    hsnSac: text(item.hsnSac || item.hsn || item.sac),
    gstRate:
      item.gstRate !== undefined && item.gstRate !== null
        ? number(item.gstRate)
        : undefined
  }));

  const orderNumber = text(
    raw.orderNumber || raw.orderNo || raw.orderId || raw.id
  );

  if (!orderNumber) return null;

  const delivery =
    raw.deliveryAddress || raw.shippingAddress || customerObject;

  return {
    orderNumber,
    createdAt: text(raw.createdAt),
    paymentMethod: text(
      raw.paymentMethod || raw.payment || "Cash on Delivery"
    ),
    customer: customerName,
    firstName,
    lastName,
    mobile: text(
      raw.mobile || raw.phone || customerObject.mobile || customerObject.phone
    ),
    email: text(raw.email || customerObject.email),
    address: text(
      delivery.address ||
      delivery.addressLine1 ||
      raw.address ||
      raw.addressLine1 ||
      customerObject.address
    ),
    apartment: text(
      delivery.apartment ||
      delivery.addressLine2 ||
      raw.apartment ||
      raw.addressLine2 ||
      customerObject.apartment
    ),
    city: text(
      delivery.city ||
      raw.city ||
      customerObject.city
    ),
    state: text(
      delivery.state ||
      raw.state ||
      customerObject.state
    ),
    pincode: text(
      delivery.pincode ||
      delivery.pinCode ||
      raw.pincode ||
      raw.pinCode ||
      raw.zip ||
      customerObject.pincode
    ),
    deliveryAddressId: text(delivery.addressId),
    deliveryAddressLabel: text(delivery.label),
    items,
    subtotal: number(raw.subtotal),
    taxableSubtotal:
      raw.taxableSubtotal !== undefined
        ? number(raw.taxableSubtotal)
        : undefined,
    gstRate:
      raw.gstRate !== undefined
        ? number(raw.gstRate)
        : undefined,
    gstAmount:
      raw.gstAmount !== undefined
        ? number(raw.gstAmount)
        : undefined,
    gstInclusive: raw.gstInclusive !== false,
    shipping: number(raw.shipping),
    total: number(raw.total || raw.grandTotal || raw.amount),
    status: text(raw.status) || "NEW",
    invoiceNumber: text(raw.invoiceNumber),
  };
}

function readOrders() {
  const result: Order[] = [];

  try {
    const raw = JSON.parse(localStorage.getItem("dreamzy-orders") || "[]");

    if (Array.isArray(raw)) {
      raw.forEach((item) => {
        const order = normalize(item);
        if (order) result.push(order);
      });
    }
  } catch {}

  try {
    const last = normalize(
      JSON.parse(localStorage.getItem("dreamzy-last-order") || "null")
    );

    if (last && !result.some((item) => item.orderNumber === last.orderNumber)) {
      result.unshift(last);
    }
  } catch {}

  return result;
}

function money(value: number) {
  return `₹${number(value).toLocaleString("en-IN")}`;
}

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const INVOICE_PREFIX = DREAMZY_INVOICE_CONFIG.invoicePrefix;
const INVOICE_STORAGE_KEY = "dreamzy-invoice-numbers";
const INVOICE_COUNTER_KEY = `dreamzy-invoice-counter-${DREAMZY_INVOICE_CONFIG.financialYear}`;

function getOrCreateInvoiceNumber(orderNumber: string) {
  try {
    const raw = localStorage.getItem(INVOICE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const map =
      parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? parsed
        : {};

    if (map[orderNumber]) return String(map[orderNumber]);

    let counter = Number(
      localStorage.getItem(INVOICE_COUNTER_KEY) || "0"
    );
    if (!Number.isFinite(counter) || counter < 0) counter = 0;

    const invoiceNumber =
      `${INVOICE_PREFIX}${String(Math.floor(counter) + 1).padStart(4, "0")}`;

    map[orderNumber] = invoiceNumber;

    localStorage.setItem(
      INVOICE_COUNTER_KEY,
      String(Math.floor(counter) + 1)
    );
    localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(map));

    return invoiceNumber;
  } catch {
    return `${INVOICE_PREFIX}${orderNumber}`;
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function printCustomerInvoice(order: Order) {
  const companyName = DREAMZY_INVOICE_CONFIG.legalName;
  const companyAddress = DREAMZY_INVOICE_CONFIG.registeredAddress;
  const gstin = DREAMZY_INVOICE_CONFIG.gstin;
  const invoiceNumber =
    order.invoiceNumber || getOrCreateInvoiceNumber(order.orderNumber);

  // Keep the generated invoice number permanently attached to this order.
  if (!order.invoiceNumber) {
    try {
      const rawOrders = JSON.parse(localStorage.getItem("dreamzy-orders") || "[]");
      if (Array.isArray(rawOrders)) {
        const updatedOrders = rawOrders.map((item: any) =>
          String(item?.orderNumber || item?.orderNo || item?.orderId || item?.id || "") ===
          String(order.orderNumber)
            ? { ...item, invoiceNumber }
            : item
        );
        localStorage.setItem("dreamzy-orders", JSON.stringify(updatedOrders));
      }

      const last = JSON.parse(
        localStorage.getItem("dreamzy-last-order") || "null"
      );
      if (
        last &&
        String(last.orderNumber || last.orderNo || last.orderId || last.id || "") ===
          String(order.orderNumber)
      ) {
        localStorage.setItem(
          "dreamzy-last-order",
          JSON.stringify({ ...last, invoiceNumber })
        );
      }
    } catch {}
  }

  const customerName =
    `${order.firstName} ${order.lastName}`.trim() ||
    order.customer ||
    "Customer";

  const addressLines = [
    order.address,
    order.apartment,
    [order.city, order.state].filter(Boolean).join(", "),
    order.pincode ? `PIN - ${order.pincode}` : ""
  ].filter(Boolean);

  const gstRate = order.gstRate ?? 5;
  const taxableValue =
    order.taxableSubtotal ??
    (order.gstAmount !== undefined
      ? order.subtotal - order.gstAmount
      : order.subtotal / (1 + gstRate / 100));

  const gstAmount =
    order.gstAmount ??
    order.subtotal - taxableValue;

  const isGujarat =
    ["gujarat", "gj"].includes(
      String(order.state || "").trim().toLowerCase()
    );

  const cgst = isGujarat ? gstAmount / 2 : 0;
  const sgst = isGujarat ? gstAmount / 2 : 0;
  const igst = isGujarat ? 0 : gstAmount;

  const rows = order.items.map((item) => `
    <tr>
      <td>
        <strong>${escapeHtml(item.name || "Product")}</strong>
        <div class="small">HSN/SAC: ${escapeHtml(item.hsnSac || "6108")}</div>
      </td>
      <td>${escapeHtml(item.size || "—")}</td>
      <td>${item.quantity || 1}</td>
      <td>${item.gstRate ?? gstRate}%</td>
      <td>${money((item.price || 0) * (item.quantity || 1))}</td>
    </tr>
  `).join("");

  const popup = window.open("", "_blank", "width=980,height=900");

  if (!popup) {
    window.alert("Please allow pop-ups in your browser to print the invoice.");
    return;
  }

  popup.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>DREAMZY Invoice - ${escapeHtml(invoiceNumber)}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 35px;
            color: #321d21;
            font-family: Arial, Helvetica, sans-serif;
            background: #fff;
          }
          .invoice { max-width: 900px; margin: 0 auto; }
          .top {
            display: flex;
            justify-content: space-between;
            gap: 30px;
            padding-bottom: 22px;
            border-bottom: 2px solid #542f35;
          }
          .brand {
            font-family: Georgia, serif;
            font-size: 32px;
            letter-spacing: 5px;
            color: #542f35;
          }
          .company {
            margin-top: 8px;
            font-weight: 700;
            font-size: 14px;
          }
          .muted {
            color: #765d60;
            font-size: 11px;
            line-height: 1.6;
            max-width: 430px;
          }
          h1 {
            margin: 0;
            font-size: 21px;
            letter-spacing: 1px;
            text-align: right;
          }
          .meta {
            margin-top: 8px;
            text-align: right;
            font-size: 12px;
            line-height: 1.7;
          }
          .pending {
            margin-top: 10px;
            padding: 8px 10px;
            border: 1px solid #d7b8b2;
            background: #fbefec;
            color: #7b343b;
            font-size: 10px;
            line-height: 1.45;
          }
          .columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 45px;
            margin: 28px 0;
          }
          .label {
            color: #8d6268;
            font-size: 10px;
            letter-spacing: 2px;
            margin-bottom: 8px;
          }
          .box {
            font-size: 13px;
            line-height: 1.7;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background: #542f35;
            color: white;
            text-align: left;
            padding: 10px;
            font-size: 10px;
            letter-spacing: 1px;
          }
          td {
            border-bottom: 1px solid #e5d8d2;
            padding: 11px 10px;
            font-size: 12px;
            vertical-align: top;
          }
          .small {
            margin-top: 4px;
            color: #8a7072;
            font-size: 9px;
          }
          .totals {
            margin-left: auto;
            width: 330px;
            margin-top: 22px;
          }
          .row {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            padding: 7px 0;
            font-size: 13px;
          }
          .grand {
            border-top: 2px solid #542f35;
            margin-top: 6px;
            padding-top: 12px;
            font-size: 18px;
            font-weight: 700;
          }
          .footer {
            margin-top: 45px;
            padding-top: 18px;
            border-top: 1px solid #e5d8d2;
            text-align: center;
            color: #765d60;
            font-size: 10px;
            line-height: 1.6;
          }
          @media print {
            body { padding: 0; }
            .invoice { max-width: none; }
          }
          @media (max-width: 700px) {
          .hero-bottom {
            align-items: flex-start;
          }

          .hero-invoice {
            width: 100%;
            justify-content: flex-start;
          }

          .hero-invoice-button {
            width: auto;
          }
            body { padding: 18px; }
            .top, .columns {
              grid-template-columns: 1fr;
              display: grid;
              gap: 18px;
            }
            h1, .meta { text-align: left; }
            .totals { width: 100%; }
            th, td { padding: 7px 5px; }
          }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="top">
            <div>
              <div class="brand">DREAMZY</div>
              <div class="company">${escapeHtml(companyName)}</div>
              <div class="muted">
                ${escapeHtml(companyAddress)}<br />
                GSTIN: ${escapeHtml(gstin)}
              </div>
            </div>
            <div>
              <h1>DREAMZY INVOICE</h1>
              <div class="meta">
                <strong>Invoice No.: ${escapeHtml(invoiceNumber)}</strong><br />
                Order No.: ${escapeHtml(order.orderNumber)}<br />
                Payment: ${escapeHtml(order.paymentMethod || "—")}<br />
                Date: ${escapeHtml(formatDate(order.createdAt))}
              </div>
              <div class="pending">
                GST registration is pending. This document is for testing/internal use and should not be treated as a GST tax invoice until the GST registration details are available.
              </div>
            </div>
          </div>

          <div class="columns">
            <div>
              <div class="label">BILL TO</div>
              <div class="box">
                <strong>${escapeHtml(customerName)}</strong><br />
                ${order.mobile ? `Mobile: ${escapeHtml(order.mobile)}<br />` : ""}
                ${order.email ? `Email: ${escapeHtml(order.email)}` : ""}
              </div>
            </div>
            <div>
              <div class="label">DELIVERY ADDRESS</div>
              <div class="box">
                ${addressLines.map((line) => escapeHtml(line)).join("<br />") || "—"}
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>PRODUCT / HSN</th>
                <th>SIZE</th>
                <th>QTY</th>
                <th>GST</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              ${rows || `<tr><td colspan="5">No items</td></tr>`}
            </tbody>
          </table>

          <div class="totals">
            <div class="row">
              <span>Taxable Value</span>
              <strong>${money(taxableValue)}</strong>
            </div>
            ${
              isGujarat
                ? `
                  <div class="row"><span>CGST (${gstRate / 2}%)</span><strong>${money(cgst)}</strong></div>
                  <div class="row"><span>SGST (${gstRate / 2}%)</span><strong>${money(sgst)}</strong></div>
                `
                : `
                  <div class="row"><span>IGST (${gstRate}%)</span><strong>${money(igst)}</strong></div>
                `
            }
            <div class="row"><span>Shipping</span><strong>${money(order.shipping)}</strong></div>
            <div class="row grand"><span>Total</span><strong>${money(order.total)}</strong></div>
          </div>

          <div class="footer">
            GSTIN pending — update the invoice configuration after GST registration is approved.<br />
            DREAMZY • Softer Nights. Brighter Tomorrows.
          </div>
        </div>

        <script>
          window.onload = function () {
            setTimeout(function () { window.print(); }, 250);
          };
        </script>
      </body>
    </html>
  `);

  popup.document.close();
}

function DreamzyHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  function logout() {
    localStorage.removeItem("dreamzy-account");
    window.dispatchEvent(new Event("dreamzy-account-updated"));
    setMenuOpen(false);
    setAccountOpen(false);
    window.location.href = "/";
  }

  return (
<header className="site-header">
        <button
          type="button"
          className="site-menu-button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setMenuOpen((open) => !open);
          }}
        >
          {menuOpen ? "×" : "☰"}
        </button>

        <Link href="/" className="site-logo">DREAMZY</Link>

        <nav
          className={menuOpen ? "site-nav open" : "site-nav"}
        >
          <Link href="/women" onClick={() => setMenuOpen(false)}>WOMEN</Link>
          <Link href="/kids" onClick={() => setMenuOpen(false)}>KIDS</Link>
          <a href="/#new-arrivals" onClick={() => setMenuOpen(false)}>NEW ARRIVALS</a>
          <a href="/#best-sellers" onClick={() => setMenuOpen(false)}>BEST SELLERS</a>
          <a href="/#about" onClick={() => setMenuOpen(false)}>ABOUT</a>
          <Link href="/wishlist" onClick={() => setMenuOpen(false)}>WISHLIST</Link>
          <Link href="/cart" onClick={() => setMenuOpen(false)}>CART</Link>

          <div className="mobile-account-menu">
            <button
              type="button"
              className="mobile-account-button"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((open) => !open)}
            >
              <span>ACCOUNT</span>
              <span className={`account-chevron ${accountOpen ? "open" : ""}`}>⌄</span>
            </button>

            {accountOpen && (
              <div className="mobile-account-dropdown">
                <Link href="/account" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  My Account
                </Link>
                <Link href="/my-orders" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  My Orders
                </Link>
                <Link href="/account#addresses" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  My Addresses
                </Link>
                <Link href="/wishlist" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  Wishlist
                </Link>
                <div className="mobile-account-divider" />
                <button type="button" className="mobile-account-logout" onClick={logout}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </nav>

        <div className="account-menu-wrap">
          <button
            type="button"
            className="account-button"
            aria-label="Open account menu"
            aria-expanded={accountOpen}
            onClick={() => setAccountOpen((open) => !open)}
          >
            <span>ACCOUNT</span>
            <span className={`account-chevron ${accountOpen ? "open" : ""}`}>⌄</span>
          </button>

          {accountOpen && (
            <div className="account-dropdown">
              <Link href="/account" onClick={() => setAccountOpen(false)}>
                <span className="account-dropdown-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M5.5 20c.7-3.5 3-5.2 6.5-5.2s5.8 1.7 6.5 5.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </span>
                <span>My Account</span>
              </Link>

              <Link href="/my-orders" onClick={() => setAccountOpen(false)}>
                <span className="account-dropdown-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 8.5 12 5l7 3.5v8L12 20l-7-3.5v-8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    <path d="m5 8.5 7 4 7-4M12 12.5V20" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>My Orders</span>
              </Link>

              <Link href="/account#addresses" onClick={() => setAccountOpen(false)}>
                <span className="account-dropdown-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11Z" stroke="currentColor" strokeWidth="1.7" />
                    <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                </span>
                <span>My Addresses</span>
              </Link>

              <Link href="/wishlist" onClick={() => setAccountOpen(false)}>
                <span className="account-dropdown-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.8 8.8c0 5.5-8.8 10-8.8 10s-8.8-4.5-8.8-10A4.7 4.7 0 0 1 8 4c1.5 0 3 .8 4 2.1C13 4.8 14.5 4 16 4a4.7 4.7 0 0 1 4.8 4.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>Wishlist</span>
              </Link>

              <div className="account-dropdown-divider" />

              <button
                type="button"
                className="account-logout"
                onClick={logout}
              >
                <span className="account-dropdown-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 5H5v14h5M15 8l4 4-4 4M19 12H9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </header>
  );
}

function DreamzyFooter() {
  return (
    <>
<footer className="dreamzy-footer">
        <div className="dreamzy-footer-inner">
          <div className="dreamzy-footer-top">
            <div className="dreamzy-footer-logo-wrap">
              <img
                src="/dreamzy-logo.png"
                alt="DREAMZY Nightwear"
                className="dreamzy-footer-logo-image"
              />
            </div>

            <div className="dreamzy-footer-brand">
              <div className="dreamzy-footer-wordmark">DREAMZY</div>
              <p className="dreamzy-footer-tagline">
                Premium nightwear for beautiful nights.
              </p>
              <div className="dreamzy-footer-rule" />
              <p className="dreamzy-footer-copy">
                Comfortable. Stylish. Thoughtfully made for you and your little
                ones.
              </p>

              <div className="dreamzy-footer-shop-links">
                <Link href="/women">
                  <span>♀</span>
                  Women
                </Link>
                <Link href="/kids">
                  <span>♧</span>
                  Kids
                </Link>
                <Link href="/wishlist">
                  <span>♡</span>
                  Wishlist
                </Link>
                <Link href="/cart">
                  <span>🛒</span>
                  Cart
                </Link>
                <Link href="/account">
                  <span>♙</span>
                  Account
                </Link>
              </div>
            </div>

            <div className="dreamzy-footer-links">
              <div className="dreamzy-footer-heading">QUICK LINKS</div>

              <Link href="/privacy-policy">Privacy Policy <b>›</b></Link>
              <Link href="/terms-conditions">Terms &amp; Conditions <b>›</b></Link>
              <Link href="/shipping-policy">Shipping Policy <b>›</b></Link>
              <Link href="/return-refund-policy">Return &amp; Refund <b>›</b></Link>
              <Link href="/cancellation-policy">Cancellation Policy <b>›</b></Link>
              <Link href="/contact">Contact Us <b>›</b></Link>
            </div>

            <div className="dreamzy-footer-follow">
              <div className="dreamzy-footer-heading">FOLLOW US</div>
              <div className="dreamzy-footer-social">
                <a
                  href="https://www.instagram.com/dreamzy_in/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  ◎
                </a>
                <a href="#" aria-label="Facebook">f</a>
                <a href="#" aria-label="YouTube">▶</a>
                <a href="#" aria-label="Pinterest">p</a>
              </div>
            </div>
          </div>

          <div className="dreamzy-footer-bottom">
            <span>© 2026 DREAMZY. All Rights Reserved.</span>
            <span>♥ Designed for Sweeter Tomorrows</span>
          </div>
        </div>
      </footer>
    </>
  );
}


function DreamzyMobileNavigation() {
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <>
      {categoriesOpen && (
        <div className="mobile-category-backdrop" onClick={() => setCategoriesOpen(false)}>
          <div
            className="mobile-category-choice"
            role="dialog"
            aria-label="Choose a collection"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-category-choice-heading">Choose a Collection</div>
            <Link href="/women" onClick={() => setCategoriesOpen(false)}>
              Women&apos;s Collection <span aria-hidden="true">›</span>
            </Link>
            <Link href="/kids" onClick={() => setCategoriesOpen(false)}>
              Kids Collection <span aria-hidden="true">›</span>
            </Link>
          </div>
        </div>
      )}

      <nav className="mobile-bottom-nav" aria-label="Mobile quick navigation">
        <Link href="/" className="mobile-bottom-nav-item" aria-label="Home">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.8 12 3l9 7.8v9a1.2 1.2 0 0 1-1.2 1.2h-5.1v-6.4H9.3V21H4.2A1.2 1.2 0 0 1 3 19.8v-9Z" /></svg>
          <span>Home</span>
        </Link>

        <Link href="/#best-sellers" className="mobile-bottom-nav-item" aria-label="Offers">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="2.5" width="14" height="19" rx="3" /><path d="m10 8 5 4-5 4V8Z" /></svg>
          <span>Offers</span>
        </Link>

        <button
          type="button"
          className="mobile-bottom-nav-item mobile-bottom-nav-button"
          aria-label="Categories"
          aria-expanded={categoriesOpen}
          onClick={() => setCategoriesOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.2" /><rect x="14" y="3" width="7" height="7" rx="1.2" /><rect x="3" y="14" width="7" height="7" rx="1.2" /><rect x="14" y="14" width="7" height="7" rx="1.2" /></svg>
          <span>Categories</span>
        </button>

        <Link href="/account" className="mobile-bottom-nav-item account-active" aria-label="Account">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="3.5" /><path d="M4 21v-2.2a5.3 5.3 0 0 1 5.3-5.3h5.4a5.3 5.3 0 0 1 5.3 5.3V21H4Z" /></svg>
          <span>Account</span>
        </Link>

        <Link href="/cart" className="mobile-bottom-nav-item" aria-label="Cart">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 3h2.8l2.2 12.1a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.5L22 8H6" /><circle cx="10" cy="20" r="1.2" /><circle cx="18" cy="20" r="1.2" /></svg>
          <span>Cart</span>
        </Link>
      </nav>
    </>
  );
}

export default function OrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const requestedOrder = decodeURIComponent(String(params?.orderId || ""));

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewOpen, setReviewOpen] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  function readReviews(): Review[] {
    try {
      const raw = JSON.parse(localStorage.getItem("dreamzy-reviews") || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  }

  function hasReview(item: Item) {
    return reviews.some(
      (review) =>
        review.orderNumber === requestedOrder &&
        review.productId === String(item.productId || item.id || "") &&
        review.productName === String(item.name || "Product")
    );
  }

  function submitReview(item: Item) {
    if (!order || order.status !== "DELIVERED") return;

    const productId = String(item.productId || item.id || "");
    const productName = String(item.name || "Product");

    if (hasReview(item)) {
      setReviewMessage("You have already reviewed this product.");
      return;
    }

    if (!reviewText.trim()) {
      setReviewMessage("Please write a short review.");
      return;
    }

    const review: Review = {
      id: `REV${Date.now()}`,
      orderNumber: order.orderNumber,
      productId,
      productName,
      customerName:
        `${order.firstName} ${order.lastName}`.trim() ||
        order.customer ||
        "Customer",
      rating: Math.min(5, Math.max(1, Number(reviewRating))),
      review: reviewText.trim(),
      createdAt: new Date().toISOString(),
      verifiedPurchase: true,
    };

    const next = [...readReviews(), review];
    localStorage.setItem("dreamzy-reviews", JSON.stringify(next));
    setReviews(next);
    setReviewText("");
    setReviewRating(5);
    setReviewOpen(null);
    setReviewMessage("Thank you! Your review has been submitted.");
    window.dispatchEvent(new Event("dreamzy-reviews-updated"));
  }

  function loadOrder() {
    setReviews(readReviews());
    const orders = readOrders();
    const found = orders.find(
      (item) => item.orderNumber === requestedOrder
    );

    setOrder(found || null);
    setLoading(false);
  }

  useEffect(() => {
    loadOrder();

    const refresh = () => loadOrder();

    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("dreamzy-orders-updated", refresh);

    const timer = window.setInterval(loadOrder, 2000);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("dreamzy-orders-updated", refresh);
      window.clearInterval(timer);
    };
  }, [requestedOrder]);

  const currentIndex = useMemo(() => {
    if (!order || order.status === "CANCELLED") return -1;
    return Math.max(0, STEPS.indexOf(order.status));
  }, [order]);

  if (loading) {
    return (
      <main className="order-page">
        <DreamzyHeader />
        <div className="loading">Loading order...</div>
        <DreamzyFooter />
      </main>
    );
  }

  if (!order) {
    return (
      <main className="order-page">
        <DreamzyHeader />

        <section className="not-found">
          <div className="eyebrow">DREAMZY ORDERS</div>
          <h1>Order not found</h1>
          <p>We couldn't find this order in your DREAMZY account.</p>
          <Link href="/account" className="primary-button">
            BACK TO MY ORDERS
          </Link>
        </section>
        <DreamzyFooter />
      </main>
    );
  }

  const customerName =
    `${order.firstName} ${order.lastName}`.trim() ||
    order.customer ||
    "Customer";

  return (
    <main className="order-page">
        <DreamzyHeader />

      <section className="hero">
        <div className="eyebrow">DREAMZY ORDER</div>
        <h1>{order.orderNumber}</h1>
        <div className="hero-bottom">
          <p>
            Placed on {formatDate(order.createdAt)} · {order.paymentMethod}
          </p>

          <div className="hero-invoice">
            {order.invoiceNumber && (
              <span className="invoice-number">
                INVOICE {order.invoiceNumber}
              </span>
            )}
            <button
              type="button"
              className="hero-invoice-button"
              onClick={() => printCustomerInvoice(order)}
            >
              PRINT / SAVE INVOICE
            </button>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="tracking-card">
          <div className="section-label">ORDER STATUS</div>
          <h2>
            {order.status === "CANCELLED"
              ? "Order Cancelled"
              : order.status === "DELIVERED"
                ? "Your order has been delivered"
                : `Order ${order.status}`}
          </h2>

          {order.status === "CANCELLED" ? (
            <div className="cancelled">✕ ORDER CANCELLED</div>
          ) : (
            <div className="timeline">
              {STEPS.map((step, index) => {
                const done = index <= currentIndex;
                const active = index === currentIndex;

                return (
                  <div className="step" key={step}>
                    <div
                      className={`dot ${done ? "done" : ""} ${
                        active ? "active" : ""
                      }`}
                    >
                      {done ? "✓" : index + 1}
                    </div>
                    <div className={`step-label ${active ? "current" : ""}`}>
                      {step === "NEW" ? "ORDER PLACED" : step}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="main-grid">
          <section className="card">
            <div className="section-label">ITEMS</div>
            <h2>Order items</h2>

            <div className="items">
              {order.items.length === 0 ? (
                <div className="muted">No product information available.</div>
              ) : (
                order.items.map((item, index) => (
                  <div className="item" key={`${order.orderNumber}-${index}`}>
                    {item.image ? (
                      <img src={item.image} alt={item.name || "Product"} />
                    ) : (
                      <div className="item-image" />
                    )}

                    <div className="item-info">
                      <h3>{item.name || "Product"}</h3>
                      <p>
                        Size: <strong>{item.size || "—"}</strong>
                        {" · "}
                        Qty: <strong>{item.quantity || 1}</strong>
                      </p>
                      <strong>{money(item.price || 0)}</strong>
                    </div>

                    <div className="item-total">
                      {money(
                        Number(item.price || 0) *
                        Number(item.quantity || 1)
                      )}
                    </div>

                    {order.status === "DELIVERED" && (
                      <div className="review-area">
                        {hasReview(item) ? (
                          <div className="reviewed-badge">
                            ✓ REVIEW SUBMITTED
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="review-button"
                            onClick={() => {
                              setReviewOpen(
                                String(item.productId || item.id || item.name || "")
                              );
                              setReviewMessage("");
                            }}
                          >
                            WRITE A REVIEW
                          </button>
                        )}

                        {reviewOpen ===
                          String(item.productId || item.id || item.name || "") &&
                          !hasReview(item) && (
                            <div className="review-form">
                              <div className="review-title">
                                Rate {item.name || "this product"}
                              </div>

                              <div className="stars" aria-label="Product rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    className={`star ${
                                      star <= reviewRating ? "selected" : ""
                                    }`}
                                    onClick={() => setReviewRating(star)}
                                    aria-label={`${star} star`}
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>

                              <textarea
                                value={reviewText}
                                onChange={(event) => setReviewText(event.target.value)}
                                placeholder="Share your experience with this product..."
                                maxLength={500}
                                rows={4}
                              />

                              {reviewMessage && (
                                <div className="review-message">
                                  {reviewMessage}
                                </div>
                              )}

                              <div className="review-actions">
                                <button
                                  type="button"
                                  className="secondary-review-button"
                                  onClick={() => {
                                    setReviewOpen(null);
                                    setReviewText("");
                                    setReviewMessage("");
                                  }}
                                >
                                  CANCEL
                                </button>
                                <button
                                  type="button"
                                  className="primary-review-button"
                                  onClick={() => submitReview(item)}
                                >
                                  SUBMIT REVIEW
                                </button>
                              </div>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          <aside className="side">
            <section className="card">
              <div className="section-label">ORDER SUMMARY</div>
              <h2>Payment</h2>

              <div className="summary-row">
                <span>Product Total</span>
                <strong>{money(order.subtotal)}</strong>
              </div>
              <div className="summary-row">
                <span>
                  GST ({order.gstRate ?? 5}%, {order.gstInclusive === false ? "extra" : "included"})
                </span>
                <strong>
                  {money(
                    order.gstAmount ??
                      order.subtotal -
                        (order.taxableSubtotal ??
                          order.subtotal / (1 + (order.gstRate ?? 5) / 100))
                  )}
                </strong>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <strong>{order.shipping === 0 ? "FREE" : money(order.shipping)}</strong>
              </div>
              <div className="summary-total">
                <span>TOTAL</span>
                <strong>{money(order.total)}</strong>
              </div>

              <div className="payment-box">
                <span>PAYMENT METHOD</span>
                <strong>{order.paymentMethod}</strong>
              </div>
            </section>

            <section className="card">
              <div className="section-label">DELIVERY ADDRESS</div>
              <h2>
                {order.deliveryAddressLabel
                  ? `${order.deliveryAddressLabel} · ${customerName}`
                  : customerName}
              </h2>

              <div className="order-address-note">
                Exact delivery address used for this order
              </div>

              <div className="details">
                <div><strong>Mobile</strong><span>{order.mobile || "—"}</span></div>
                <div><strong>Email</strong><span>{order.email || "—"}</span></div>
                <div>
                  <strong>Address</strong>
                  <span>
                    {order.address || "—"}
                    {order.apartment ? `, ${order.apartment}` : ""}
                    <br />
                    {order.city || "—"}, {order.state || "—"}{" "}
                    {order.pincode ? `- ${order.pincode}` : ""}
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </div>

        {reviewMessage && (
          <div className="review-global-message">{reviewMessage}</div>
        )}

        <div className="actions">
          <Link href="/account" className="secondary-button">
            ← MY ORDERS
          </Link>
          <Link href="/women" className="primary-button">
            CONTINUE SHOPPING
          </Link>
        </div>
      </section>
      <DreamzyFooter />
      <DreamzyMobileNavigation />

      <style jsx global>{`
        .order-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #faf6f1;
          color: #542f35;
          font-family: Arial, sans-serif;
        }

        .site-header {
          height: 72px;
          width: 100%;
          background: #fffdfb;
          border-bottom: 1px solid #eadfd8;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 42px;
          position: relative;
          z-index: 20;
        }

        .site-logo {
          font-family: Georgia, serif;
          font-size: 29px;
          letter-spacing: 3px;
          color: #542f35;
          text-decoration: none;
          white-space: nowrap;
        }

        .site-menu-button {
          width: 36px;
          height: 36px;
          border: 1px solid #bda9a6;
          background: #fffdfb;
          color: #542f35;
          font-size: 18px;
          cursor: pointer;
          display: none;
        }

        .site-nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 27px;
          margin-left: auto;
        }

        .site-nav a {
          color: #542f35;
          text-decoration: none;
          font-size: 11px;
          letter-spacing: 1.2px;
          white-space: nowrap;
        }

        .account-menu-wrap {
          position: relative;
          margin-left: 8px;
        }

        .account-button {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          border: 0;
          background: transparent;
          color: #542f35;
          padding: 7px 2px;
          font: inherit;
          font-size: 11px;
          letter-spacing: 1.2px;
          cursor: pointer;
          white-space: nowrap;
        }

        .account-chevron {
          font-size: 18px;
          line-height: 1;
          transform: translateY(-2px);
          transition: transform 0.18s ease;
        }

        .account-chevron.open {
          transform: rotate(180deg) translateY(2px);
        }

        .account-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 255px;
          background: #fffdfb;
          border: 1px solid #eadfd8;
          box-shadow: 0 12px 28px rgba(84, 47, 53, 0.12);
          z-index: 200;
          overflow: hidden;
        }

        .account-dropdown::before {
          content: "";
          position: absolute;
          top: -7px;
          right: 26px;
          width: 13px;
          height: 13px;
          background: #fffdfb;
          border-left: 1px solid #eadfd8;
          border-top: 1px solid #eadfd8;
          transform: rotate(45deg);
        }

        .account-dropdown a,
        .account-logout {
          width: 100%;
          min-height: 58px;
          display: flex;
          align-items: center;
          gap: 17px;
          padding: 0 20px;
          border: 0;
          background: transparent;
          color: #3f3032;
          text-decoration: none;
          font: inherit;
          font-size: 14px;
          letter-spacing: 0;
          text-align: left;
          cursor: pointer;
          position: relative;
          z-index: 1;
        }

        .account-dropdown a:hover,
        .account-logout:hover {
          background: #faf3ef;
        }

        .account-dropdown-icon {
          width: 28px;
          height: 28px;
          flex: 0 0 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #542f35;
        }

        .account-dropdown-icon svg {
          width: 26px;
          height: 26px;
        }

        .account-dropdown-divider {
          height: 1px;
          background: #eadfd8;
          margin: 0;
        }


        .site-header {
          flex: 0 0 auto;
        }
        .site-nav a:hover { opacity: 0.7; }
        @media (max-width: 900px) {
          .site-header { height: 64px; padding: 0 18px; }
          .site-menu-button { display: flex; align-items: center; justify-content: center; flex: 0 0 auto; }
          .site-nav {
            display: none;
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            padding: 14px 22px 20px;
            background: #fffdfb;
            border-bottom: 1px solid #eadfd8;
            flex-direction: column;
            align-items: flex-start;
            gap: 0;
            z-index: 100;
          }
          .site-nav.open { display: flex; }
          .site-nav a { padding: 11px 0; }
          .account-menu-wrap { display: none !important; }
          .site-account-menu-wrap { margin-left: auto; }
        }
        @media (max-width: 600px) {
          .site-header { height: 60px; padding: 0 14px; }
          .site-logo { font-size: 22px; letter-spacing: 2px; }
          .site-menu-button { width: 34px; height: 34px; }
          .site-nav { top: 60px; }
          .site-account-button { font-size: 10px; }
        }

        .dreamzy-footer {
          width: 100%;
          box-sizing: border-box;
          margin: 0;
          padding: 58px 42px 24px;
          background: #542f35;
          color: #fff8f4;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        .dreamzy-footer-inner {
          width: min(1380px, 100%);
          margin: 0 auto;
        }

        .dreamzy-footer-top {
          display: grid;
          grid-template-columns: 1.05fr 1.15fr 0.85fr 0.55fr;
          gap: 44px;
          align-items: center;
          padding-bottom: 46px;
        }

        .dreamzy-footer-logo-wrap {
          width: 100%;
          max-width: 400px;
          padding: 14px;
          box-sizing: border-box;
          background: #fffaf6;
        }

        .dreamzy-footer-logo-image {
          display: block;
          width: 100%;
          height: auto;
          max-height: 330px;
          object-fit: contain;
        }

        .dreamzy-footer-brand {
          min-width: 0;
        }

        .dreamzy-footer-wordmark {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 42px;
          line-height: 1;
          letter-spacing: 2px;
          color: #fffaf6;
        }

        .dreamzy-footer-tagline {
          margin: 16px 0 0;
          max-width: 360px;
          color: #fff4ef;
          font-size: 17px;
          line-height: 1.5;
        }

        .dreamzy-footer-rule {
          width: 78px;
          height: 1px;
          margin: 25px 0 22px;
          background: rgba(255, 221, 216, 0.75);
        }

        .dreamzy-footer-copy {
          max-width: 390px;
          margin: 0;
          color: #ead8d5;
          font-size: 14px;
          line-height: 1.75;
        }

        .dreamzy-footer-shop-links {
          display: flex;
          flex-wrap: wrap;
          gap: 20px 26px;
          margin-top: 28px;
        }

        .dreamzy-footer-shop-links a {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #fff8f4;
          text-decoration: none;
          font-size: 12px;
        }

        .dreamzy-footer-shop-links span {
          font-size: 17px;
        }

        .dreamzy-footer-shop-links a:hover,
        .dreamzy-footer-links a:hover {
          color: #f4c9c4;
        }

        .dreamzy-footer-links,
        .dreamzy-footer-follow {
          align-self: stretch;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .dreamzy-footer-links {
          border-left: 1px solid rgba(255, 220, 215, 0.34);
          padding-left: 30px;
        }

        .dreamzy-footer-heading {
          color: #f2cfca;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 4px;
          margin-bottom: 16px;
        }

        .dreamzy-footer-links a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 8px 0;
          color: #fff8f4;
          text-decoration: none;
          font-size: 13px;
          white-space: nowrap;
        }

        .dreamzy-footer-links b {
          color: #eab8b2;
          font-size: 18px;
          font-weight: 400;
        }

        .dreamzy-footer-follow {
          border-left: 1px solid rgba(255, 220, 215, 0.34);
          padding-left: 30px;
        }

        .dreamzy-footer-social {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .dreamzy-footer-social a {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(244, 190, 184, 0.85);
          border-radius: 50%;
          color: #fff8f4;
          text-decoration: none;
          font-size: 18px;
          font-weight: 600;
          box-sizing: border-box;
        }

        .dreamzy-footer-social a:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .dreamzy-footer-bottom {
          padding-top: 22px;
          border-top: 1px solid rgba(255, 220, 215, 0.34);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          color: #d8c3c0;
          font-size: 11px;
        }

        @media (max-width: 1050px) {
          .dreamzy-footer-top {
            grid-template-columns: 1fr 1fr;
            gap: 38px;
          }

          .dreamzy-footer-logo-wrap {
            max-width: 360px;
          }

          .dreamzy-footer-links {
            border-left: 0;
            border-top: 1px solid rgba(255, 220, 215, 0.34);
            padding: 28px 0 0;
          }

          .dreamzy-footer-follow {
            border-left: 0;
            border-top: 1px solid rgba(255, 220, 215, 0.34);
            padding: 28px 0 0;
          }
        }

        @media (max-width: 650px) {
          .dreamzy-footer {
            padding: 38px 18px 22px;
          }

          .dreamzy-footer-top {
            grid-template-columns: 1fr;
            gap: 30px;
            padding-bottom: 32px;
          }

          .dreamzy-footer-logo-wrap {
            width: min(100%, 330px);
            justify-self: center;
          }

          .dreamzy-footer-brand {
            text-align: center;
          }

          .dreamzy-footer-wordmark {
            font-size: 35px;
          }

          .dreamzy-footer-tagline,
          .dreamzy-footer-copy {
            margin-left: auto;
            margin-right: auto;
          }

          .dreamzy-footer-rule {
            margin-left: auto;
            margin-right: auto;
          }

          .dreamzy-footer-shop-links {
            justify-content: center;
            gap: 17px 22px;
          }

          .dreamzy-footer-links,
          .dreamzy-footer-follow {
            padding-top: 25px;
          }

          .dreamzy-footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }



        .header {
          background: #fffdfb;
          border-bottom: 1px solid #eadfd8;
          padding: 20px 28px;
        }

        .header-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .logo {
          color: #542f35;
          text-decoration: none;
          font-family: Georgia, serif;
          font-size: 29px;
          letter-spacing: 3px;
        }

        nav {
          display: flex;
          gap: 22px;
          flex-wrap: wrap;
        }

        nav a {
          color: #542f35;
          text-decoration: none;
          font-size: 11px;
          letter-spacing: 1px;
        }

        .hero {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px 25px 22px;
          min-height: 0 !important;
          height: auto !important;
          display: block !important;
          align-items: initial !important;
          justify-content: initial !important;
        }

        .eyebrow,
        .section-label {
          color: #987276;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2.5px;
        }

        .hero-bottom {
          margin-top: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
        }

        .hero-bottom p {
          margin: 0;
        }

        .hero-invoice {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .invoice-number {
          color: #987276;
          font-size: 10px;
          letter-spacing: 0.8px;
          font-weight: 700;
        }

        .hero-invoice-button {
          border: 1px solid #542f35;
          background: #542f35;
          color: #fff;
          padding: 11px 16px;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.2px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .hero-invoice-button:hover {
          background: #6b3b43;
          border-color: #6b3b43;
        }

        .hero h1 {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 42px;
          font-weight: 500;
          letter-spacing: 1.5px;
          margin: 6px 0 6px;
          word-break: break-word;
          display: block;
        }

        .hero p {
          color: #80676a;
          margin: 0;
          font-size: 13px;
        }

        .content {
          flex: 1 0 auto;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 25px 80px;
        }

        .tracking-card,
        .card {
          background: #fffdfb;
          border: 1px solid #eadfd8;
        }

        .tracking-card {
          padding: 24px 28px 27px;
          margin-bottom: 20px;
        }

        h2 {
          font-family: Georgia, serif;
          font-weight: 400;
          font-size: 26px;
          margin: 7px 0 18px;
        }

        .timeline {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0;
          position: relative;
          padding-top: 3px;
        }

        .timeline::before {
          content: "";
          position: absolute;
          left: 10%;
          right: 10%;
          top: 18px;
          height: 1px;
          background: #dfd1cc;
        }

        .step {
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .dot {
          width: 32px;
          height: 32px;
          margin: 0 auto 8px;
          border: 1px solid #d9cbc7;
          border-radius: 50%;
          background: #fffdfb;
          color: #987276;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
        }

        .dot.done {
          background: #542f35;
          border-color: #542f35;
          color: #fff;
        }

        .dot.active {
          box-shadow: 0 0 0 4px #eadfd8;
        }

        .step-label {
          font-size: 8px;
          letter-spacing: .7px;
          color: #987276;
          min-height: 20px;
        }

        .step-label.current {
          color: #542f35;
          font-weight: 700;
        }

        .cancelled {
          background: #f3d7d7;
          color: #8a3038;
          border: 1px solid #e2bcbc;
          padding: 14px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(290px, .8fr);
          gap: 20px;
          align-items: start;
        }

        .card {
          padding: 23px 25px;
          margin-bottom: 20px;
        }

        .items {
          display: grid;
        }

        .item {
          display: grid;
          grid-template-columns: 82px minmax(0, 1fr) auto;
          gap: 16px;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid #eee3de;
        }

        .item:first-child {
          padding-top: 2px;
        }

        .item:last-child {
          border-bottom: 0;
        }

        .item img,
        .item-image {
          width: 82px;
          height: 96px;
          object-fit: cover;
          background: #eee5df;
        }

        .item-info h3 {
          font-family: Georgia, serif;
          font-weight: 400;
          font-size: 18px;
          margin: 0 0 6px;
        }

        .item-info p {
          color: #80676a;
          font-size: 12px;
          margin: 0 0 7px;
        }

        .item-total {
          font-weight: 700;
          white-space: nowrap;
        }

        .summary-row,
        .summary-total {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          padding: 13px 0;
          border-bottom: 1px solid #eee3de;
        }

        .summary-row {
          color: #765b5e;
          font-size: 13px;
        }

        .summary-total {
          border-bottom: 0;
          font-size: 17px;
          padding-top: 17px;
        }

        .payment-box {
          margin-top: 18px;
          padding: 13px;
          background: #faf6f1;
          border: 1px solid #eadfd8;
        }

        .payment-box span,
        .payment-box strong {
          display: block;
        }

        .payment-box span {
          font-size: 9px;
          color: #987276;
          letter-spacing: 1.2px;
        }

        .payment-box strong {
          margin-top: 6px;
          font-size: 12px;
        }

        .order-address-note {
          margin: -8px 0 18px;
          color: #8a7072;
          font-size: 11px;
          letter-spacing: 0.4px;
        }

        .details {
          display: grid;
          gap: 15px;
        }

        .details div {
          display: grid;
          gap: 4px;
        }

        .details strong {
          font-size: 10px;
          letter-spacing: 1px;
          color: #987276;
        }

        .details span {
          font-size: 13px;
          line-height: 1.6;
          color: #765b5e;
        }

        .review-area {
          grid-column: 2 / -1;
          margin-top: 8px;
        }

        .review-button,
        .primary-review-button,
        .secondary-review-button {
          border: 0;
          cursor: pointer;
          padding: 10px 13px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .review-button,
        .primary-review-button {
          background: #542f35;
          color: #fff;
        }

        .secondary-review-button {
          background: #fffdfb;
          color: #542f35;
          border: 1px solid #542f35;
        }

        .reviewed-badge {
          display: inline-block;
          color: #35633b;
          background: #e4efe4;
          padding: 8px 10px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .8px;
        }

        .review-form {
          margin-top: 12px;
          padding: 15px;
          background: #faf6f1;
          border: 1px solid #eadfd8;
        }

        .review-title {
          font-family: Georgia, serif;
          font-size: 17px;
          margin-bottom: 9px;
        }

        .stars {
          display: flex;
          gap: 2px;
          margin-bottom: 10px;
        }

        .star {
          border: 0;
          background: transparent;
          color: #d8c8c3;
          cursor: pointer;
          font-size: 24px;
          line-height: 1;
          padding: 0 2px;
        }

        .star.selected {
          color: #a46a45;
        }

        .review-form textarea {
          width: 100%;
          box-sizing: border-box;
          resize: vertical;
          border: 1px solid #ded0ca;
          background: #fffdfb;
          color: #542f35;
          padding: 11px;
          font-family: Arial, sans-serif;
          font-size: 12px;
          outline: none;
        }

        .review-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 10px;
        }

        .review-message,
        .review-global-message {
          margin-top: 10px;
          color: #8a3038;
          font-size: 11px;
        }

        .review-global-message {
          padding: 12px 14px;
          border: 1px solid #d9c8c2;
          background: #fffdfb;
          margin-bottom: 12px;
        }

        .actions {
          display: flex;
          gap: 12px;
          margin-top: 2px;
        }

        .primary-button,
        .secondary-button {
          display: inline-block;
          text-decoration: none;
          padding: 15px 20px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-align: center;
        }

        .primary-button {
          background: #542f35;
          color: #fff;
        }

        .secondary-button {
          border: 1px solid #542f35;
          color: #542f35;
          background: #fffdfb;
        }

        .not-found {
          max-width: 700px;
          margin: 0 auto;
          padding: 120px 25px;
          text-align: center;
        }

        .not-found h1 {
          font-family: Georgia, serif;
          font-size: 42px;
          font-weight: 400;
        }

        .not-found p {
          color: #80676a;
          margin-bottom: 25px;
        }

        .loading {
          padding: 100px 25px;
          text-align: center;
          color: #80676a;
        }

        .muted {
          color: #80676a;
          padding: 20px 0;
        }

        .footer {
          background: #542f35;
          color: #fff;
          text-align: center;
          padding: 45px 25px;
        }

        .footer div {
          font-family: Georgia, serif;
          font-size: 28px;
          letter-spacing: 3px;
        }

        .footer p {
          color: #eadbd7;
          font-size: 12px;
        }

        @media (max-width: 800px) {
          .header {
            padding: 16px;
          }

          .header-inner {
            flex-direction: column;
            align-items: flex-start;
          }

          nav {
            width: 100%;
            gap: 12px 18px;
          }

          .hero {
            padding: 28px 16px 20px;
          }

          .content {
            padding: 0 16px 55px;
          }

          .main-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .timeline {
            gap: 2px;
          }

          .tracking-card,
          .card {
            padding: 18px;
          }

          .timeline::before {
            left: 8%;
            right: 8%;
          }

          .item {
            grid-template-columns: 70px 1fr;
          }

          .item img,
          .item-image {
            width: 70px;
            height: 84px;
          }

          .item-total {
            grid-column: 2;
          }

          .review-area {
            grid-column: 1 / -1;
          }

          .review-actions {
            flex-direction: column;
          }

          .review-actions button {
            width: 100%;
          }
        }

        @media (max-width: 520px) {
          .hero h1 {
            font-size: 32px;
          }

          .timeline {
            grid-template-columns: repeat(5, minmax(48px, 1fr));
            overflow-x: auto;
            padding-bottom: 2px;
          }

          .step {
            min-width: 48px;
          }

          .step-label {
            font-size: 7px;
            letter-spacing: .25px;
          }

          .dot {
            width: 27px;
            height: 27px;
          }

          .timeline::before {
            top: 16px;
          }

          .actions {
            flex-direction: column;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
            box-sizing: border-box;
          }
        }
        /* Cart-approved mobile navigation/footer additions only. */
        .mobile-account-menu,
        .mobile-bottom-nav,
        .mobile-category-backdrop {
          display: none;
        }

        @media (max-width: 900px) {
          .mobile-account-menu {
            display: block;
            width: 100%;
          }

          .mobile-account-button {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 4px;
            border: 0;
            border-bottom: 1px solid #f0e7e2;
            background: transparent;
            color: #542f35;
            font: inherit;
            font-size: 12px;
            letter-spacing: 1.2px;
            text-align: left;
            cursor: pointer;
          }

          .mobile-account-dropdown {
            width: 100%;
            margin: 4px 0 8px;
            background: #fffdfb;
            border: 1px solid #eadfd8;
            box-shadow: 0 5px 14px rgba(84,47,53,.07);
          }

          .mobile-account-dropdown a,
          .mobile-account-logout {
            width: 100%;
            min-height: 48px;
            display: flex;
            align-items: center;
            padding: 0 14px;
            border: 0;
            border-bottom: 1px solid #eadfd8;
            background: transparent;
            color: #3f3032;
            text-decoration: none;
            font: inherit;
            font-size: 14px;
            text-align: left;
            cursor: pointer;
            box-sizing: border-box;
          }

          .mobile-account-divider {
            height: 1px;
            background: #eadfd8;
          }
        }

        @media (max-width: 600px) {
          .dreamzy-footer {
            padding: 16px 10px 92px !important;
          }

          .dreamzy-footer-top {
            display: grid !important;
            grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr) !important;
            grid-template-areas:
              "logo follow"
              "logo brand"
              "links links" !important;
            column-gap: 12px !important;
            row-gap: 8px !important;
            align-items: center !important;
            padding-bottom: 12px !important;
          }

          .dreamzy-footer-logo-wrap {
            grid-area: logo !important;
            width: 100% !important;
            max-width: none !important;
            padding: 5px !important;
            justify-self: center !important;
            align-self: center !important;
          }

          .dreamzy-footer-logo-image {
            display: block !important;
            width: 100% !important;
            max-height: 135px !important;
            object-fit: contain !important;
          }

          .dreamzy-footer-follow {
            grid-area: follow !important;
            align-self: end !important;
            border: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            justify-content: center !important;
          }

          .dreamzy-footer-heading {
            font-size: 9px !important;
            letter-spacing: 2px !important;
            margin-bottom: 7px !important;
          }

          .dreamzy-footer-social {
            display: flex !important;
            justify-content: flex-start !important;
            gap: 6px !important;
          }

          .dreamzy-footer-social a {
            width: 30px !important;
            height: 30px !important;
            font-size: 12px !important;
          }

          .dreamzy-footer-brand {
            grid-area: brand !important;
            min-width: 0 !important;
            text-align: left !important;
          }

          .dreamzy-footer-wordmark {
            font-size: 23px !important;
            letter-spacing: 1px !important;
          }

          .dreamzy-footer-tagline {
            margin-top: 6px !important;
            font-size: 10px !important;
            line-height: 1.35 !important;
          }

          .dreamzy-footer-rule {
            width: 38px !important;
            margin: 8px 0 !important;
          }

          .dreamzy-footer-copy {
            margin-top: 7px !important;
            font-size: 10px !important;
            line-height: 1.35 !important;
          }

          .dreamzy-footer-shop-links {
            justify-content: flex-start !important;
            gap: 7px 9px !important;
            margin-top: 9px !important;
          }

          .dreamzy-footer-shop-links a {
            font-size: 9px !important;
            white-space: nowrap !important;
          }

          .dreamzy-footer-links {
            grid-area: links !important;
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            align-items: center !important;
            justify-content: stretch !important;
            gap: 6px 8px !important;
            border: 0 !important;
            border-top: 1px solid rgba(255, 220, 215, 0.34) !important;
            padding: 12px 0 0 !important;
            margin-top: 2px !important;
          }

          .dreamzy-footer-links .dreamzy-footer-heading {
            grid-column: 1 / -1 !important;
            width: 100% !important;
            margin-bottom: 2px !important;
          }

          .dreamzy-footer-links a {
            display: inline-flex !important;
            width: 100% !important;
            min-width: 0 !important;
            justify-content: flex-start !important;
            font-size: 10px !important;
            padding: 4px 0 !important;
            gap: 3px !important;
            white-space: nowrap !important;
          }

          .dreamzy-footer-links b {
            display: none !important;
          }

          .dreamzy-footer-bottom {
            display: flex !important;
            padding-top: 10px !important;
            flex-direction: column !important;
            text-align: center !important;
            gap: 5px !important;
            font-size: 9px !important;
            line-height: 1.35 !important;
          }

          .mobile-category-backdrop {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            padding: 0 12px 84px;
            background: rgba(84,47,53,.18);
            z-index: 10000;
          }

          .mobile-category-choice {
            width: 100%;
            max-width: 420px;
            background: #fffdfb;
            border: 1px solid #eadfd8;
            border-radius: 18px;
            box-shadow: 0 12px 30px rgba(84,47,53,.18);
            overflow: hidden;
          }

          .mobile-category-choice-heading {
            padding: 15px 18px;
            color: #542f35;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 2px;
            border-bottom: 1px solid #eadfd8;
          }

          .mobile-category-choice a {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 18px;
            color: #542f35;
            text-decoration: none;
            font-size: 12px;
            border-bottom: 1px solid #f0e7e2;
          }

          .mobile-category-choice a:last-child {
            border-bottom: 0;
          }

          .mobile-bottom-nav {
            position: fixed !important;
            left: 12px !important;
            right: 12px !important;
            bottom: 10px !important;
            width: auto !important;
            height: 62px !important;
            padding: 4px !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            display: grid !important;
            grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
            align-items: stretch !important;
            gap: 0 !important;
            background: #ffffff !important;
            border-radius: 34px !important;
            box-shadow: 0 2px 14px rgba(0, 0, 0, 0.12) !important;
            z-index: 9999 !important;
          }

          .mobile-bottom-nav-item,
          .mobile-bottom-nav-button {
            min-width: 0 !important;
            width: 100% !important;
            height: 54px !important;
            padding: 4px 2px !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 3px !important;
            border: 0 !important;
            outline: 0 !important;
            border-radius: 28px !important;
            background: transparent !important;
            color: #272326 !important;
            text-decoration: none !important;
            font-family: inherit !important;
            font-size: 10px !important;
            font-weight: 400 !important;
            line-height: 1 !important;
            letter-spacing: 0 !important;
            appearance: none !important;
            -webkit-appearance: none !important;
          }

          .mobile-bottom-nav-item svg {
            width: 20px !important;
            height: 20px !important;
            flex: 0 0 20px !important;
            display: block !important;
            fill: none !important;
            stroke: currentColor !important;
            stroke-width: 1.6 !important;
            stroke-linecap: round !important;
            stroke-linejoin: round !important;
          }

          .mobile-bottom-nav-item span {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10px !important;
            line-height: 12px !important;
            white-space: nowrap !important;
          }

          .mobile-bottom-nav-item.account-active {
            background: #f3e8e9 !important;
          }
        }


      `}</style>
    </main>
  );
}
