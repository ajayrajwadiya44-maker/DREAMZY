"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Item = {
  id?: string;
  name?: string;
  price?: number;
  size?: string;
  quantity?: number;
  image?: string;
};

type Order = {
  orderNumber: string;
  createdAt?: string;
  paymentMethod: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  pincode: string;
  items: Item[];
  subtotal: number;
  taxableSubtotal?: number;
  gstRate?: number;
  gstAmount?: number;
  shipping: number;
  total: number;
  status: string;
};

function text(value: unknown) {
  return value === undefined || value === null ? "" : String(value).trim();
}

function number(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function normalize(raw: any): Order | null {
  if (!raw || typeof raw !== "object") return null;

  const customer = raw.customer || raw.customerDetails || {};
  const address = raw.deliveryAddress || raw.shippingAddress || {};

  const fullName = text(
    customer.fullName || customer.name || raw.fullName || raw.name
  );
  const parts = fullName.split(/\s+/).filter(Boolean);

  const itemsSource = Array.isArray(raw.items)
    ? raw.items
    : Array.isArray(raw.cart)
    ? raw.cart
    : [];

  const items = itemsSource.map((item: any) => ({
    id: text(item.id),
    name: text(item.name || item.productName) || "Product",
    price: number(item.price || item.amount),
    size: text(item.size || item.selectedSize),
    quantity: number(item.quantity || item.qty) || 1,
    image: text(item.image || item.imageUrl || item.productImage),
  }));

  const orderNumber = text(
    raw.orderNumber || raw.orderNo || raw.orderId || raw.id
  );

  if (!orderNumber) return null;

  return {
    orderNumber,
    createdAt: text(raw.createdAt),
    paymentMethod: text(
      raw.paymentMethod || raw.payment || "Cash on Delivery"
    ),
    firstName: text(raw.firstName || customer.firstName || parts[0]),
    lastName: text(
      raw.lastName || customer.lastName || parts.slice(1).join(" ")
    ),
    mobile: text(
      raw.mobile || raw.phone || customer.mobile || customer.phone
    ),
    email: text(raw.email || customer.email),
    address: text(
      raw.address ||
        raw.addressLine1 ||
        customer.address ||
        address.address ||
        address.addressLine1
    ),
    apartment: text(
      raw.apartment ||
        customer.apartment ||
        address.apartment ||
        raw.addressLine2 ||
        address.addressLine2
    ),
    city: text(raw.city || customer.city || address.city),
    state: text(raw.state || customer.state || address.state),
    pincode: text(
      raw.pincode ||
        raw.pinCode ||
        raw.zip ||
        customer.pincode ||
        address.pincode ||
        address.pinCode
    ),
    items,
    subtotal: number(raw.subtotal),
    taxableSubtotal:
      raw.taxableSubtotal !== undefined
        ? number(raw.taxableSubtotal)
        : undefined,
    gstRate:
      raw.gstRate !== undefined ? number(raw.gstRate) : undefined,
    gstAmount:
      raw.gstAmount !== undefined ? number(raw.gstAmount) : undefined,
    shipping: number(raw.shipping),
    total: number(raw.total || raw.grandTotal || raw.amount),
    status: text(raw.status) || "NEW",
  };
}

function readLastOrder(): Order | null {
  try {
    const last = JSON.parse(
      localStorage.getItem("dreamzy-last-order") || "null"
    );
    const normalizedLast = normalize(last);
    if (normalizedLast) return normalizedLast;
  } catch (error) {
    console.error("Could not read dreamzy-last-order:", error);
  }

  try {
    const stored = JSON.parse(
      localStorage.getItem("dreamzy-orders") || "[]"
    );

    if (Array.isArray(stored) && stored.length > 0) {
      return normalize(stored[0]);
    }
  } catch (error) {
    console.error("Could not read dreamzy-orders:", error);
  }

  return null;
}

function money(value: number) {
  return `₹${number(value).toLocaleString("en-IN")}`;
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
              <Link href="/privacy-policy">
                Privacy Policy <b>›</b>
              </Link>
              <Link href="/terms-conditions">
                Terms &amp; Conditions <b>›</b>
              </Link>
              <Link href="/shipping-policy">
                Shipping Policy <b>›</b>
              </Link>
              <Link href="/return-refund-policy">
                Return &amp; Refund <b>›</b>
              </Link>
              <Link href="/cancellation-policy">
                Cancellation Policy <b>›</b>
              </Link>
              <Link href="/contact">
                Contact Us <b>›</b>
              </Link>
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
                <a href="#" aria-label="Facebook">
                  f
                </a>
                <a href="#" aria-label="YouTube">
                  ▶
                </a>
                <a href="#" aria-label="Pinterest">
                  p
                </a>
              </div>
            </div>
          </div>

          <div className="dreamzy-footer-bottom">
            <span>© 2026 DREAMZY. All Rights Reserved.</span>
            <span>♥ Designed for Sweeter Tomorrows</span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
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

        @media (max-width: 600px) {
          .dreamzy-footer {
            padding: 15px 3px 92px !important;
          }

          .dreamzy-footer-top {
            grid-template-columns: 156px minmax(0, 1fr) !important;
            grid-template-areas:
              "logo follow"
              "logo brand"
              "links links" !important;
            gap: 10px 12px !important;
            align-items: start !important;
            padding-bottom: 14px !important;
          }

          .dreamzy-footer-logo-wrap {
            grid-area: logo;
            width: 156px !important;
            max-width: 156px !important;
            padding: 6px !important;
            justify-self: start !important;
            align-self: center !important;
          }

          .dreamzy-footer-logo-image {
            width: 100% !important;
            max-height: 150px !important;
            object-fit: contain !important;
          }

          .dreamzy-footer-brand {
            grid-area: brand;
            text-align: left !important;
          }

          .dreamzy-footer-follow {
            grid-area: follow;
            border-left: 0 !important;
            border-top: 1px solid rgba(255, 220, 215, 0.34) !important;
            padding: 0 !important;
            align-self: start !important;
            justify-content: flex-start !important;
          }

          .dreamzy-footer-wordmark {
            font-size: 23px !important;
            letter-spacing: 1.5px !important;
          }

          .dreamzy-footer-tagline {
            margin: 5px 0 0 !important;
            max-width: 170px !important;
            font-size: 10px !important;
            line-height: 1.35 !important;
          }

          .dreamzy-footer-rule {
            width: 46px !important;
            margin: 8px 0 !important;
          }

          .dreamzy-footer-copy {
            max-width: 180px !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            font-size: 9px !important;
            line-height: 1.4 !important;
          }

          .dreamzy-footer-shop-links {
            gap: 7px 10px !important;
            margin-top: 9px !important;
            justify-content: flex-start !important;
          }

          .dreamzy-footer-shop-links a {
            gap: 4px !important;
            font-size: 9px !important;
          }

          .dreamzy-footer-shop-links span {
            font-size: 12px !important;
          }

          .dreamzy-footer-heading {
            font-size: 8px !important;
            letter-spacing: 2px !important;
            margin-bottom: 7px !important;
          }

          .dreamzy-footer-social {
            gap: 6px !important;
          }

          .dreamzy-footer-social a {
            width: 30px !important;
            height: 30px !important;
            font-size: 12px !important;
          }

          .dreamzy-footer-links {
            grid-area: links;
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            column-gap: 8px;
            border-left: 0 !important;
            border-top: 1px solid rgba(255, 220, 215, 0.34);
            padding: 10px 0 0 !important;
          }

          .dreamzy-footer-links .dreamzy-footer-heading {
            grid-column: 1 / -1;
          }

          .dreamzy-footer-links a {
            padding: 4px 0 !important;
            font-size: 8px !important;
            white-space: normal !important;
          }

          .dreamzy-footer-links b {
            font-size: 12px !important;
          }

          .dreamzy-footer-bottom {
            padding-top: 9px !important;
            gap: 4px !important;
            flex-direction: column !important;
            text-align: center !important;
            font-size: 8px !important;
          }
        }
      `}</style>
    </>
  );
}



export default function OrderSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  function logout() {
    localStorage.removeItem("dreamzy-account");
    window.dispatchEvent(new Event("dreamzy-account-updated"));
    setMenuOpen(false);
    setAccountOpen(false);
    window.location.href = "/";
  }

  useEffect(() => {
    setOrder(readLastOrder());
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f8f1eb",
          color: "#321d21",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        Loading your order...
      </main>
    );
  }

  if (!order) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f8f1eb",
          color: "#321d21",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <header className="header">
        <button
          type="button"
          className="menu-button"
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

        <Link href="/" className="logo">DREAMZY</Link>

        <nav
          className={menuOpen ? "nav open" : "nav"}
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
                  <span className="account-dropdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
                      <path d="M5.5 20c.7-3.5 3-5.2 6.5-5.2s5.8 1.7 6.5 5.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span>My Account</span>
                </Link>
                <Link href="/account#orders" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  <span className="account-dropdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 8.5 12 5l7 3.5v8L12 20l-7-3.5v-8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                      <path d="m5 8.5 7 4 7-4M12 12.5V20" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>My Orders</span>
                </Link>
                <Link href="/account#addresses" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  <span className="account-dropdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11Z" stroke="currentColor" strokeWidth="1.7" />
                      <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.7" />
                    </svg>
                  </span>
                  <span>My Addresses</span>
                </Link>
                <Link href="/wishlist" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  <span className="account-dropdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.8 8.8c0 5.5-8.8 10-8.8 10s-8.8-4.5-8.8-10A4.7 4.7 0 0 1 8 4c1.5 0 3 .8 4 2.1C13 4.8 14.5 4 16 4a4.7 4.7 0 0 1 4.8 4.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>Wishlist</span>
                </Link>
                <div className="account-dropdown-divider" />
                <button type="button" className="mobile-account-logout" onClick={logout}>
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

              <Link href="/account#orders" onClick={() => setAccountOpen(false)}>
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

        <section className="success-empty">
          <div className="success-kicker">DREAMZY</div>
          <h1>No recent order found</h1>
          <p>
            We could not find a recent order on this browser. Please return to
            the store and place your order again.
          </p>
          <Link href="/" className="success-primary-button">
            BACK TO STORE
          </Link>
        </section>

        <DreamzyFooter />

        <style jsx global>{`
        .header {
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

        .logo {
          font-family: Georgia, serif;
          font-size: 29px;
          letter-spacing: 3px;
          color: #542f35;
          text-decoration: none;
          white-space: nowrap;
        }

        .menu-button {
          width: 36px;
          height: 36px;
          border: 1px solid #bda9a6;
          background: #fffdfb;
          color: #542f35;
          font-size: 18px;
          cursor: pointer;
          display: none;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 27px;
          margin-left: auto;
        }

        .nav a {
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

        @media (max-width: 900px) {
          .header {
            height: 64px;
            padding: 0 18px;
            position: relative;
          }
          .menu-button {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto;
            width: 36px;
            height: 36px;
            padding: 0;
          }
          .logo {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            font-size: 25px;
            letter-spacing: 2px;
          }
          .account-menu-wrap {
            display: none;
          }
          .nav {
            display: none !important;
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            width: 100%;
            max-width: none;
            background: #fffdfb;
            border-bottom: 1px solid #eadfd8;
            padding: 5px 18px 8px;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            box-shadow: 0 8px 20px rgba(84, 47, 53, 0.08);
            z-index: 100;
          }
          .nav.open {
            display: flex !important;
          }
          .nav a,
          .nav button {
            width: 100%;
            padding: 9px 4px !important;
            border-bottom: 1px solid #f0e7e2;
            font-size: 12px !important;
            letter-spacing: 1.2px !important;
            text-align: left;
          }
        }

        @media (max-width: 600px) {
          .header {
            height: 64px;
            padding: 0 18px;
            position: relative;
          }
          .logo {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            font-size: 25px;
            letter-spacing: 2px;
          }
          .menu-button {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto;
            width: 36px;
            height: 36px;
            padding: 0;
          }
          .nav {
            display: none !important;
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            width: 100%;
            max-width: none;
            background: #fffdfb;
            border-bottom: 1px solid #eadfd8;
            padding: 5px 18px 8px;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            box-shadow: 0 8px 20px rgba(84, 47, 53, 0.08);
            z-index: 100;
          }
        }

          .success-header {
            min-height: 72px;
            padding: 0 7%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #eadbd4;
            background: #fffaf6;
          }

          .success-logo {
            font-family: Georgia, serif;
            font-size: 30px;
            letter-spacing: 4px;
            color: #542f35;
            text-decoration: none;
          }

          .success-header-link {
            color: #542f35;
            font-size: 11px;
            letter-spacing: 2px;
            text-decoration: none;
          }

          .success-empty {
            max-width: 760px;
            margin: 0 auto;
            padding: 110px 24px;
            text-align: center;
          }

          .success-kicker {
            color: #9b6870;
            font-size: 10px;
            letter-spacing: 4px;
          }

          .success-empty h1 {
            margin: 16px 0 12px;
            font-family: Georgia, serif;
            font-size: 46px;
            font-weight: 400;
          }

          .success-empty p {
            max-width: 560px;
            margin: 0 auto 28px;
            color: #765d60;
            line-height: 1.7;
          }

          .success-primary-button {
            display: inline-flex;
            min-height: 48px;
            padding: 0 28px;
            align-items: center;
            justify-content: center;
            background: #542f35;
            color: #fff;
            text-decoration: none;
            font-size: 12px;
            letter-spacing: 1.5px;
          }

          @media (max-width: 650px) {
            .success-header {
              min-height: 58px;
              padding: 0 16px;
            }

            .success-logo {
              font-size: 20px;
              letter-spacing: 2px;
            }

            .success-header-link {
              font-size: 8px;
              letter-spacing: 1px;
            }

            .success-empty {
              padding: 75px 20px;
            }

            .success-empty h1 {
              font-size: 34px;
            }
          }
        `}</style>
      </main>
    );
  }

  const customerName =
    `${order.firstName} ${order.lastName}`.trim() || "Customer";

  const addressLines = [
    order.address,
    order.apartment,
    [order.city, order.state].filter(Boolean).join(", "),
    order.pincode ? `PIN - ${order.pincode}` : "",
  ].filter(Boolean);

  const taxableValue =
    order.taxableSubtotal ??
    (order.gstAmount
      ? order.subtotal - order.gstAmount
      : order.subtotal / 1.05);

  const gstAmount =
    order.gstAmount ?? order.subtotal - order.subtotal / 1.05;

  return (
    <main className="success-page">
      <header className="header">
        <button
          type="button"
          className="menu-button"
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

        <Link href="/" className="logo">DREAMZY</Link>

        <nav
          className={menuOpen ? "nav open" : "nav"}
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
                  <span className="account-dropdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
                      <path d="M5.5 20c.7-3.5 3-5.2 6.5-5.2s5.8 1.7 6.5 5.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span>My Account</span>
                </Link>
                <Link href="/account#orders" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  <span className="account-dropdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 8.5 12 5l7 3.5v8L12 20l-7-3.5v-8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                      <path d="m5 8.5 7 4 7-4M12 12.5V20" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>My Orders</span>
                </Link>
                <Link href="/account#addresses" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  <span className="account-dropdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11Z" stroke="currentColor" strokeWidth="1.7" />
                      <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.7" />
                    </svg>
                  </span>
                  <span>My Addresses</span>
                </Link>
                <Link href="/wishlist" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  <span className="account-dropdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.8 8.8c0 5.5-8.8 10-8.8 10s-8.8-4.5-8.8-10A4.7 4.7 0 0 1 8 4c1.5 0 3 .8 4 2.1C13 4.8 14.5 4 16 4a4.7 4.7 0 0 1 4.8 4.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>Wishlist</span>
                </Link>
                <div className="account-dropdown-divider" />
                <button type="button" className="mobile-account-logout" onClick={logout}>
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

              <Link href="/account#orders" onClick={() => setAccountOpen(false)}>
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

      <section className="success-hero">
        <div className="success-check">✓</div>
        <div className="success-kicker">DREAMZY ORDER CONFIRMED</div>
        <h1>Thank You for Your Order</h1>
        <p className="success-intro">
          Your order has been placed successfully. We’re getting your DREAMZY
          nightwear ready for a beautiful night.
        </p>

        <div className="success-order-number">
          <span>ORDER NUMBER</span>
          <strong>{order.orderNumber}</strong>
        </div>
      </section>

      <section className="success-content">
        <div className="success-main-card">
          <div className="success-section-kicker">ORDER DETAILS</div>
          <h2>Your Order</h2>

          <div className="success-items">
            {order.items.map((item, index) => (
              <div
                className="success-item"
                key={`${item.id || item.name || "item"}-${index}`}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name || "DREAMZY product"}
                    className="success-item-image"
                  />
                ) : (
                  <div className="success-item-placeholder" />
                )}

                <div className="success-item-info">
                  <h3>{item.name || "Product"}</h3>
                  <p>
                    Size: {item.size || "—"} &nbsp;•&nbsp; Qty:{" "}
                    {item.quantity || 1}
                  </p>
                  <strong>{money((item.price || 0) * (item.quantity || 1))}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="success-summary">
            <div>
              <span>Taxable Value</span>
              <strong>{money(taxableValue)}</strong>
            </div>
            <div>
              <span>GST ({order.gstRate ?? 5}%)</span>
              <strong>{money(gstAmount)}</strong>
            </div>
            <div>
              <span>Subtotal</span>
              <strong>{money(order.subtotal)}</strong>
            </div>
            <div>
              <span>Shipping</span>
              <strong>{order.shipping > 0 ? money(order.shipping) : money(0)}</strong>
            </div>
            <div className="success-total">
              <span>Total</span>
              <strong>{money(order.total)}</strong>
            </div>
          </div>
        </div>

        <aside className="success-side">
          <div className="success-info-card">
            <div className="success-section-kicker">PAYMENT</div>
            <h3>
              {order.paymentMethod.toLowerCase().includes("cash") ||
              order.paymentMethod.toLowerCase().includes("cod")
                ? "Cash on Delivery"
                : order.paymentMethod}
            </h3>
            <p>
              {order.paymentMethod.toLowerCase().includes("cash") ||
              order.paymentMethod.toLowerCase().includes("cod")
                ? "Please pay when your DREAMZY order arrives."
                : "Your payment has been recorded with your order."}
            </p>
          </div>

          <div className="success-info-card">
            <div className="success-section-kicker">DELIVERY TO</div>
            <h3>{customerName}</h3>
            <p>{order.mobile}</p>
            {order.email && <p>{order.email}</p>}
            <div className="success-address">
              {addressLines.length > 0
                ? addressLines.map((line, index) => (
                    <div key={`${line}-${index}`}>{line}</div>
                  ))
                : "Delivery address saved with your order."}
            </div>
          </div>

          <div className="success-info-card">
            <div className="success-section-kicker">ORDER STATUS</div>
            <div className="success-status">ORDER PLACED</div>
            <p>
              We’ll update your order status as it moves through packing and
              delivery.
            </p>
          </div>
        </aside>
      </section>

      <section className="success-actions">
        <Link href="/account" className="success-secondary-button">
          VIEW MY ORDERS
        </Link>
        <Link href="/women" className="success-primary-button">
          CONTINUE SHOPPING
        </Link>
      </section>

      <section className="success-promise">
        <div className="success-section-kicker">THE DREAMZY PROMISE</div>
        <h2>Softer Nights. Brighter Tomorrows.</h2>
        <p>
          Thank you for choosing DREAMZY. We hope your new nightwear makes
          every evening feel a little more special.
        </p>
      </section>

      <DreamzyFooter />

      <nav className="mobile-bottom-nav" aria-label="Mobile quick navigation">
        <Link href="/" className="mobile-bottom-nav-item" aria-label="Home">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 10.8 12 3l9 7.8v9a1.2 1.2 0 0 1-1.2 1.2h-5.1v-6.4H9.3V21H4.2A1.2 1.2 0 0 1 3 19.8v-9Z" />
          </svg>
          <span>Home</span>
        </Link>

        <Link href="/#best-sellers" className="mobile-bottom-nav-item" aria-label="Offers">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5" y="2.5" width="14" height="19" rx="3" />
            <path d="m10 8 5 4-5 4V8Z" />
          </svg>
          <span>Offers</span>
        </Link>

        <button
          type="button"
          className="mobile-bottom-nav-item mobile-bottom-nav-button"
          aria-label="Categories"
          aria-expanded={categoriesOpen}
          onClick={() => setCategoriesOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1.2" />
            <rect x="14" y="3" width="7" height="7" rx="1.2" />
            <rect x="3" y="14" width="7" height="7" rx="1.2" />
            <rect x="14" y="14" width="7" height="7" rx="1.2" />
          </svg>
          <span>Categories</span>
        </button>

        <Link href="/account" className="mobile-bottom-nav-item" aria-label="Account">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="7" r="3.5" />
            <path d="M4 21v-2.2a5.3 5.3 0 0 1 5.3-5.3h5.4a5.3 5.3 0 0 1 5.3 5.3V21H4Z" />
          </svg>
          <span>Account</span>
        </Link>

        <Link href="/cart" className="mobile-bottom-nav-item" aria-label="Cart">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2.5 3h2.8l2.2 12.5h10.8L20.5 7H6" />
            <circle cx="9" cy="20" r="1.3" />
            <circle cx="17.5" cy="20" r="1.3" />
          </svg>
          <span>Cart</span>
        </Link>
      </nav>

      {categoriesOpen && (
        <div
          className="mobile-category-backdrop"
          onClick={() => setCategoriesOpen(false)}
        >
          <div
            className="mobile-category-choice"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-category-choice-heading">SHOP COLLECTIONS</div>
            <Link href="/women" onClick={() => setCategoriesOpen(false)}>
              <span>♀</span>
              <strong>Women’s Collection</strong>
              <span>›</span>
            </Link>
            <Link href="/kids" onClick={() => setCategoriesOpen(false)}>
              <span>♧</span>
              <strong>Kids Collection</strong>
              <span>›</span>
            </Link>
          </div>
        </div>
      )}

      <style jsx global>{`
        .mobile-bottom-nav {
          display: none;
        }

        @media (max-width: 600px) {
          .mobile-bottom-nav {
            position: fixed;
            left: 3%;
            right: 3%;
            bottom: max(8px, env(safe-area-inset-bottom));
            z-index: 999;
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            align-items: stretch;
            min-height: 62px;
            padding: 5px 4px;
            border: 1px solid rgba(84, 47, 53, 0.18);
            border-radius: 40px;
            background: rgba(255, 253, 251, 0.96);
            box-shadow: 0 5px 24px rgba(55, 35, 38, 0.18);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
          }

          .mobile-bottom-nav-item {
            display: flex;
            min-width: 0;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            border-radius: 28px;
            color: #292629;
            text-decoration: none;
            font-size: 10px;
            line-height: 1.05;
            padding: 3px 1px;
          }

          .mobile-bottom-nav-item svg {
            width: 22px;
            height: 22px;
            fill: none;
            stroke: currentColor;
            stroke-width: 1.8;
            stroke-linecap: round;
            stroke-linejoin: round;
            flex-shrink: 0;
          }

          .mobile-bottom-nav-item:first-child svg {
            fill: currentColor;
            stroke: currentColor;
          }

          .mobile-bottom-nav-item:first-child svg path {
            fill: currentColor;
          }

          .mobile-bottom-nav-item:active {
            background: #f2e7e7;
          }

          .mobile-bottom-nav-button {
            appearance: none;
            -webkit-appearance: none;
            border: 0;
            background: transparent;
            font-family: inherit;
            cursor: pointer;
          }

          .mobile-category-backdrop {
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            padding: 0 14px calc(78px + env(safe-area-inset-bottom));
            background: rgba(28, 19, 21, 0.22);
          }

          .mobile-category-choice {
            width: min(100%, 360px);
            padding: 16px;
            border: 1px solid rgba(84, 47, 53, 0.16);
            border-radius: 18px;
            background: #fffdfb;
            box-shadow: 0 10px 32px rgba(35, 20, 23, 0.2);
          }

          .mobile-category-choice-heading {
            margin: 0 0 10px;
            color: #542f35;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: .16em;
            text-align: center;
            text-transform: uppercase;
          }

          .mobile-category-choice a {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 14px 10px;
            border-top: 1px solid #eadfda;
            color: #542f35;
            font-size: 14px;
            text-decoration: none;
          }

          .mobile-category-choice a span {
            font-size: 22px;
            line-height: 1;
          }
        }

        .header {
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

        .logo {
          font-family: Georgia, serif;
          font-size: 29px;
          letter-spacing: 3px;
          color: #542f35;
          text-decoration: none;
          white-space: nowrap;
        }

        .menu-button {
          width: 36px;
          height: 36px;
          border: 1px solid #bda9a6;
          background: #fffdfb;
          color: #542f35;
          font-size: 18px;
          cursor: pointer;
          display: none;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 27px;
          margin-left: auto;
        }

        .nav a {
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

        @media (max-width: 900px) {
          .header {
            height: 64px;
            padding: 0 18px;
            position: relative;
          }
          .menu-button {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto;
            width: 36px;
            height: 36px;
            padding: 0;
          }
          .logo {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            font-size: 25px;
            letter-spacing: 2px;
          }
          .account-menu-wrap {
            display: none;
          }
          .nav {
            display: none !important;
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            width: 100%;
            max-width: none;
            background: #fffdfb;
            border-bottom: 1px solid #eadfd8;
            padding: 5px 18px 8px;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            box-shadow: 0 8px 20px rgba(84, 47, 53, 0.08);
            z-index: 100;
          }
          .nav.open {
            display: flex !important;
          }
          .nav a,
          .nav button {
            width: 100%;
            padding: 9px 4px !important;
            border-bottom: 1px solid #f0e7e2;
            font-size: 12px !important;
            letter-spacing: 1.2px !important;
            text-align: left;
          }
        }

        @media (max-width: 600px) {
          .header {
            height: 64px;
            padding: 0 18px;
            position: relative;
          }
          .logo {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            font-size: 25px;
            letter-spacing: 2px;
          }
          .menu-button {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto;
            width: 36px;
            height: 36px;
            padding: 0;
          }
          .nav {
            display: none !important;
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            width: 100%;
            max-width: none;
            background: #fffdfb;
            border-bottom: 1px solid #eadfd8;
            padding: 5px 18px 8px;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            box-shadow: 0 8px 20px rgba(84, 47, 53, 0.08);
            z-index: 100;
          }
        }

        .success-page {
          min-height: 100vh;
          background: #f8f1eb;
          color: #321d21;
          font-family: Arial, Helvetica, sans-serif;
        }

        .success-header {
          height: 72px;
          width: 100%;
          padding: 0 42px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid #eadfd8;
          background: #fffdfb;
          position: relative;
          z-index: 20;
        }

        .success-logo {
          font-family: Georgia, serif;
          font-size: 29px;
          letter-spacing: 3px;
          color: #542f35;
          text-decoration: none;
          white-space: nowrap;
        }

        .success-menu-button {
          width: 36px;
          height: 36px;
          border: 1px solid #bda9a6;
          background: #fffdfb;
          color: #542f35;
          font-size: 18px;
          cursor: pointer;
          display: none;
        }

        .success-nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 27px;
          margin-left: auto;
        }

        .success-nav a {
          color: #542f35;
          text-decoration: none;
          font-size: 11px;
          letter-spacing: 1.2px;
          white-space: nowrap;
        }

        .success-account-wrap {
          position: relative;
          margin-left: 8px;
        }

        .success-account-button {
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

        .success-account-chevron {
          font-size: 18px;
          line-height: 1;
          transform: translateY(-2px);
          transition: transform 0.18s ease;
        }

        .success-account-chevron.open {
          transform: rotate(180deg) translateY(2px);
        }

        .success-account-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 225px;
          background: #fffdfb;
          border: 1px solid #eadfd8;
          box-shadow: 0 12px 28px rgba(84, 47, 53, 0.12);
          z-index: 200;
          overflow: hidden;
        }

        .success-account-dropdown a,
        .success-account-dropdown button {
          width: 100%;
          min-height: 48px;
          display: flex;
          align-items: center;
          padding: 0 18px;
          border: 0;
          border-bottom: 1px solid #f0e7e2;
          background: transparent;
          color: #3f3032;
          text-decoration: none;
          font: inherit;
          font-size: 13px;
          text-align: left;
          cursor: pointer;
        }

        .success-account-dropdown a:hover,
        .success-account-dropdown button:hover {
          background: #faf3ef;
        }

        .success-hero {
          max-width: 900px;
          margin: 0 auto;
          padding: 76px 24px 52px;
          text-align: center;
        }

        .success-check {
          width: 58px;
          height: 58px;
          margin: 0 auto 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #542f35;
          border-radius: 50%;
          color: #542f35;
          font-size: 25px;
        }

        .success-kicker,
        .success-section-kicker {
          color: #9b6870;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 4px;
        }

        .success-hero h1 {
          margin: 14px 0 14px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 48px;
          line-height: 1.08;
          font-weight: 400;
          color: #542f35;
        }

        .success-intro {
          max-width: 650px;
          margin: 0 auto;
          color: #765d60;
          font-size: 15px;
          line-height: 1.7;
        }

        .success-order-number {
          display: inline-flex;
          flex-direction: column;
          gap: 7px;
          margin-top: 28px;
          padding: 16px 28px;
          border: 1px solid #dfcec7;
          background: #fffaf6;
        }

        .success-order-number span {
          color: #9b6870;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .success-order-number strong {
          font-family: Georgia, serif;
          color: #542f35;
          font-size: 20px;
          letter-spacing: 1px;
        }

        .success-content {
          width: min(1120px, 90%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.35fr 0.75fr;
          gap: 24px;
          align-items: start;
        }

        .success-main-card,
        .success-info-card {
          background: #fffaf6;
          border: 1px solid #e1d2cb;
        }

        .success-main-card {
          padding: 30px;
        }

        .success-main-card h2 {
          margin: 9px 0 24px;
          font-family: Georgia, serif;
          font-size: 28px;
          font-weight: 400;
          color: #542f35;
        }

        .success-items {
          border-top: 1px solid #eadbd4;
        }

        .success-item {
          display: flex;
          gap: 18px;
          padding: 20px 0;
          border-bottom: 1px solid #eadbd4;
        }

        .success-item-image,
        .success-item-placeholder {
          width: 110px;
          height: 125px;
          flex: 0 0 110px;
          object-fit: cover;
          background: #f1e3dd;
        }

        .success-item-info {
          min-width: 0;
          padding-top: 5px;
        }

        .success-item-info h3 {
          margin: 0 0 8px;
          font-family: Georgia, serif;
          font-size: 21px;
          line-height: 1.2;
          font-weight: 400;
          color: #542f35;
        }

        .success-item-info p {
          margin: 0 0 9px;
          color: #765d60;
          font-size: 13px;
        }

        .success-item-info strong {
          color: #542f35;
          font-size: 15px;
        }

        .success-summary {
          margin-top: 22px;
        }

        .success-summary > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 8px 0;
          color: #765d60;
          font-size: 13px;
        }

        .success-summary strong {
          color: #542f35;
        }

        .success-summary .success-total {
          margin-top: 9px;
          padding-top: 15px;
          border-top: 2px solid #542f35;
          color: #542f35;
          font-size: 17px;
        }

        .success-total strong {
          font-size: 20px;
        }

        .success-side {
          display: grid;
          gap: 16px;
        }

        .success-info-card {
          padding: 24px;
        }

        .success-info-card h3 {
          margin: 9px 0 7px;
          font-family: Georgia, serif;
          font-size: 21px;
          font-weight: 400;
          color: #542f35;
        }

        .success-info-card p {
          margin: 5px 0;
          color: #765d60;
          font-size: 13px;
          line-height: 1.6;
        }

        .success-address {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #eadbd4;
          color: #765d60;
          font-size: 13px;
          line-height: 1.65;
        }

        .success-status {
          display: inline-flex;
          margin-top: 8px;
          padding: 7px 12px;
          background: #efe1c5;
          color: #542f35;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.4px;
        }

        .success-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          padding: 34px 24px 76px;
        }

        .success-primary-button,
        .success-secondary-button {
          min-height: 48px;
          padding: 0 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.4px;
          box-sizing: border-box;
        }

        .success-primary-button {
          background: #542f35;
          color: #fff;
          border: 1px solid #542f35;
        }

        .success-secondary-button {
          background: transparent;
          color: #542f35;
          border: 1px solid #542f35;
        }

        .success-promise {
          padding: 0 24px 76px;
          text-align: center;
        }

        .success-promise h2 {
          margin: 10px 0 10px;
          font-family: Georgia, serif;
          font-size: 32px;
          font-weight: 400;
          color: #542f35;
        }

        .success-promise p {
          max-width: 620px;
          margin: 0 auto;
          color: #765d60;
          font-size: 13px;
          line-height: 1.7;
        }

        @media (max-width: 900px) {
          .success-content {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          .success-header {
            height: 64px;
            padding: 0 18px;
          }

          .success-menu-button {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto;
            padding: 0;
          }

          .success-logo {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            font-size: 25px;
            letter-spacing: 2px;
          }

          .success-account-wrap {
            display: none;
          }

          .success-nav {
            display: none !important;
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            width: 100%;
            background: #fffdfb;
            border-bottom: 1px solid #eadfd8;
            padding: 5px 18px 8px;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            box-shadow: 0 8px 20px rgba(84, 47, 53, 0.08);
            z-index: 100;
          }

          .success-nav.open {
            display: flex !important;
          }

          .success-nav a {
            width: 100%;
            padding: 14px 4px;
            border-bottom: 1px solid #f0e7e2;
            font-size: 12px;
            letter-spacing: 1.2px;
            text-align: left;
          }
        }

        @media (max-width: 650px) {

          .success-hero {
            padding: 30px 14px 24px;
          }

          .success-check {
            width: 48px;
            height: 48px;
            margin-bottom: 12px;
            font-size: 21px;
          }

          .success-hero h1 {
            font-size: 35px;
            line-height: 1.08;
          }

          .success-intro {
            font-size: 13px;
          }

          .success-order-number {
            width: 100%;
            box-sizing: border-box;
            padding: 10px 14px;
          }

          .success-content {
            width: calc(100% - 20px);
            gap: 10px;
          }

          .success-main-card {
            padding: 16px 14px;
          }

          .success-main-card h2 {
            font-size: 25px;
          }

          .success-item {
            gap: 12px;
            padding: 10px 0;
          }

          .success-item-image,
          .success-item-placeholder {
            width: 88px;
            height: 105px;
            flex-basis: 88px;
          }

          .success-item-info h3 {
            font-size: 17px;
          }

          .success-item-info p {
            font-size: 11px;
          }

          .success-info-card {
            padding: 14px;
          }

          .success-actions {
            flex-direction: column;
            padding: 18px 14px 35px;
          }

          .success-primary-button,
          .success-secondary-button {
            width: 100%;
          }

          .success-promise {
            padding: 0 14px 35px;
          }

          .success-promise h2 {
            font-size: 27px;
          }
        }


        /* Account menu inside the mobile hamburger navigation. */
        .mobile-account-menu {
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
            padding: 9px 4px !important;
            border: 0;
            border-bottom: 1px solid #f0e7e2;
            background: transparent;
            color: #542f35;
            font: inherit;
            font-size: 12px !important;
            letter-spacing: 1.2px !important;
            text-align: left;
            cursor: pointer;
          }

          .mobile-account-dropdown {
            width: 100%;
            background: #fffdfb;
            border: 1px solid #eadfd8;
            margin: 4px 0 8px;
            box-shadow: 0 5px 14px rgba(84, 47, 53, 0.07);
          }

          .mobile-account-dropdown a,
          .mobile-account-dropdown .mobile-account-logout {
            width: 100%;
            min-height: 48px;
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 0 14px !important;
            border: 0;
            border-bottom: 1px solid #eadfd8;
            background: transparent;
            color: #3f3032;
            text-decoration: none;
            font: inherit;
            font-size: 14px !important;
            letter-spacing: 0 !important;
            text-align: left;
            cursor: pointer;
          }

          .mobile-account-dropdown .account-dropdown-icon {
            width: 26px;
            height: 26px;
            flex: 0 0 26px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #542f35;
          }

          .mobile-account-dropdown .account-dropdown-icon svg {
            width: 24px;
            height: 24px;
          }

          .mobile-account-dropdown .account-dropdown-divider {
            height: 1px;
            background: #eadfd8;
          }
        }
      `}</style>
    </main>
  );
}
