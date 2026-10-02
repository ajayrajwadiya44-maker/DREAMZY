"use client";

import { useState } from "react";
import Link from "next/link";

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




        /* Match the approved Home page footer on mobile only. Desktop styles stay unchanged. */
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
        }
      `}</style>
    </>
  );
}

export default function ContactPage() {
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
    <main className="ct-page">
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

        <nav className={menuOpen ? "nav open" : "nav"}>
          <Link href="/women" onClick={() => setMenuOpen(false)}>WOMEN</Link>
          <Link href="/kids" onClick={() => setMenuOpen(false)}>KIDS</Link>
          <Link href="/#new-arrivals" onClick={() => setMenuOpen(false)}>NEW ARRIVALS</Link>
          <Link href="/#best-sellers" onClick={() => setMenuOpen(false)}>BEST SELLERS</Link>
          <Link href="/#about" onClick={() => setMenuOpen(false)}>ABOUT</Link>
          <Link href="/wishlist" onClick={() => setMenuOpen(false)}>WISHLIST</Link>
          <Link href="/cart" onClick={() => setMenuOpen(false)}>CART</Link>

          <div className="mobile-account-menu">
            <button type="button" className="mobile-account-button" aria-expanded={accountOpen} onClick={() => setAccountOpen((open) => !open)}>
              <span>ACCOUNT</span>
              <span className={`account-chevron ${accountOpen ? "open" : ""}`}>⌄</span>
            </button>
            {accountOpen && (
              <div className="mobile-account-dropdown">
                <Link href="/account" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>My Account</Link>
                <Link href="/my-orders" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>My Orders</Link>
                <Link href="/account#addresses" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>My Addresses</Link>
                <Link href="/wishlist" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>Wishlist</Link>
                <div className="mobile-account-divider" />
                <button type="button" className="mobile-account-logout" onClick={logout}>Log Out</button>
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

              <button type="button" className="account-logout" onClick={logout}>
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

      <section className="ct-hero">
        <div className="ct-eyebrow">D R E A M Z Y</div>
        <h1>Contact Us</h1>
        <p>
          We&apos;re here to help with your DREAMZY orders, products and
          customer support.
        </p>
      </section>

      <section className="ct-card">
        <div className="ct-grid">
          <div className="ct-main">
            <div className="ct-label">CUSTOMER SUPPORT</div>
            <h2>How can we help?</h2>
            <p>
              If you have a question about an order, product, delivery,
              cancellation, return, refund or payment, please contact DREAMZY
              and include your order number whenever possible.
            </p>

            <div className="ct-contact-box">
              <div className="ct-contact-row">
                <span className="ct-contact-title">Email</span>
                <a href="mailto:admin@dreamzy.in">admin@dreamzy.in</a>
              </div>

              <div className="ct-contact-row">
                <span className="ct-contact-title">Brand</span>
                <span>DREAMZY</span>
              </div>

              <div className="ct-contact-row">
                <span className="ct-contact-title">Legal Entity</span>
                <span>Dharvi Lifestyle Private Limited</span>
              </div>
            </div>
          </div>

          <aside className="ct-address">
            <div className="ct-label">BUSINESS DETAILS</div>
            <h2>Our Address</h2>
            <p>
              <strong>Dharvi Lifestyle Private Limited</strong>
              <br />
              Operating Brand: DREAMZY
              <br />
              315, Nakshtra-9,
              <br />
              Opp. Girnar Cinema,
              <br />
              Phulchhab Chowk,
              <br />
              Rajkot - 360006,
              <br />
              Gujarat, India
            </p>

            <a
              className="ct-email-button"
              href="mailto:admin@dreamzy.in"
            >
              EMAIL DREAMZY
            </a>
          </aside>
        </div>

        <div className="ct-section ct-order-section">
          <div className="ct-label">ORDER ASSISTANCE</div>
          <h2>Need help with an order?</h2>
          <p>
            Have your order number and the email address used for your purchase
            ready. Choose the topic below to find the information you need.
          </p>

          <div className="ct-support-grid">
            <Link href="/shipping-policy" className="ct-support-card">
              <div className="ct-support-top">
                <span>01</span>
                <span className="ct-arrow">↗</span>
              </div>
              <strong>Shipping</strong>
              <p>Delivery, tracking and shipping information.</p>
            </Link>

            <Link href="/return-refund-policy" className="ct-support-card">
              <div className="ct-support-top">
                <span>02</span>
                <span className="ct-arrow">↗</span>
              </div>
              <strong>Returns &amp; Refunds</strong>
              <p>Return eligibility, exchanges and refund information.</p>
            </Link>

            <Link href="/cancellation-policy" className="ct-support-card">
              <div className="ct-support-top">
                <span>03</span>
                <span className="ct-arrow">↗</span>
              </div>
              <strong>Cancellation</strong>
              <p>Information about cancelling eligible orders.</p>
            </Link>

            <Link href="/terms-conditions" className="ct-support-card">
              <div className="ct-support-top">
                <span>04</span>
                <span className="ct-arrow">↗</span>
              </div>
              <strong>Terms &amp; Conditions</strong>
              <p>Website, order and customer terms.</p>
            </Link>
          </div>
        </div>

        <div className="ct-note">
          <strong>Important:</strong> Please use only the official DREAMZY
          contact details shown on this website for customer support. Do not
          share passwords, OTPs, card PINs or payment authentication codes with
          anyone claiming to represent DREAMZY.
        </div>
      </section>

      <DreamzyFooter />

      <style jsx>{`
        .ct-page {
          min-height: 100vh;
          background: #faf7f3;
          color: #542f35;
          font-family: Arial, Helvetica, sans-serif;
        }

        .ct-header {
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          background: #fffdfb;
          border-bottom: 1px solid #eadfd8;
        }

        .ct-logo {
          color: #542f35;
          text-decoration: none;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 30px;
        }

        .ct-nav {
          display: flex;
          gap: 28px;
        }

        .ct-nav a,
        .ct-footer a {
          color: #542f35;
          text-decoration: none;
          font-size: 13px;
        }

        .ct-nav a:hover,
        .ct-footer a:hover {
          opacity: 0.65;
        }

        .ct-hero {
          max-width: 900px;
          margin: 0 auto;
          padding: 68px 24px 52px;
          text-align: center;
        }

        .ct-eyebrow {
          color: #a84d5a;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 5px;
          margin-bottom: 18px;
        }

        .ct-hero h1 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(50px, 7vw, 70px);
          font-weight: 400;
          line-height: 1.05;
          letter-spacing: -2px;
        }

        .ct-hero p {
          max-width: 680px;
          margin: 22px auto 0;
          color: #76545a;
          font-size: 15px;
          line-height: 1.7;
        }

        .ct-card {
          width: min(910px, calc(100% - 32px));
          margin: 0 auto 70px;
          padding: 52px;
          background: #fffdfb;
          border: 1px solid #e6d8d1;
          box-shadow: 0 14px 40px rgba(84, 47, 53, 0.04);
        }

        .ct-grid {
          display: grid;
          grid-template-columns: 1.35fr 0.85fr;
          gap: 46px;
        }

        .ct-label {
          color: #a04b57;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          margin-bottom: 13px;
        }

        .ct-main h2,
        .ct-address h2,
        .ct-section h2 {
          margin: 0 0 14px;
          color: #542f35;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 28px;
          font-weight: 500;
        }

        .ct-main p,
        .ct-address p,
        .ct-section p {
          margin: 0;
          color: #64474d;
          font-size: 14px;
          line-height: 1.85;
        }

        .ct-contact-box {
          margin-top: 28px;
          border-top: 1px solid #eee3dd;
        }

        .ct-contact-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 16px 0;
          border-bottom: 1px solid #eee3dd;
          color: #64474d;
          font-size: 14px;
        }

        .ct-contact-title {
          color: #8b6268;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 11px;
          font-weight: 700;
        }

        .ct-contact-row a {
          color: #8f4350;
          text-decoration: none;
          font-weight: 600;
        }

        .ct-address {
          padding: 28px;
          background: #f7eee9;
          border: 1px solid #ead9d2;
        }

        .ct-address p {
          margin-bottom: 24px;
        }

        .ct-email-button {
          display: inline-flex;
          padding: 12px 17px;
          background: #542f35;
          color: #fffdfb;
          text-decoration: none;
          font-size: 11px;
          letter-spacing: 1.4px;
          font-weight: 700;
        }

        .ct-section {
          margin-top: 48px;
          padding-top: 35px;
          border-top: 1px solid #eee3dd;
        }

        .ct-order-section {
          margin-top: 48px;
          padding-top: 38px;
        }

        .ct-order-section h2 {
          margin-bottom: 10px;
        }

        .ct-support-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 28px;
        }

        .ct-support-card {
          min-height: 148px;
          padding: 22px 22px 20px;
          border: 1px solid #e8ddd7;
          background: #fffdfb;
          text-decoration: none;
          color: #542f35;
          transition: border-color 0.2s ease, transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .ct-support-card:hover {
          border-color: #cdaeb0;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(84, 47, 53, 0.06);
        }

        .ct-support-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 26px;
        }

        .ct-support-top span:first-child {
          color: #a84d5a;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .ct-arrow {
          color: #a84d5a;
          font-size: 17px;
          line-height: 1;
        }

        .ct-support-card strong {
          display: block;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 20px;
          font-weight: 500;
          line-height: 1.2;
        }

        .ct-support-card p {
          margin: 9px 0 0;
          color: #76585d;
          font-size: 12px;
          line-height: 1.6;
          max-width: 250px;
        }

        .ct-note {
          margin-top: 38px;
          padding: 20px 22px;
          background: #f9f4f1;
          border: 1px solid #e8ddd7;
          color: #76585d;
          font-size: 12px;
          line-height: 1.75;
        }

        .ct-footer {
          width: 100%;
          margin: 0;
          padding: 55px 7.5% 25px;
          background: #542f35;
          color: #fff7f2;
        }

        .ct-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.7fr 1fr 1.35fr 1fr;
          gap: 55px;
        }

        .ct-footer-brand {
          max-width: 330px;
        }

        .ct-footer-logo-box {
          width: 58px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff7f2;
          border-radius: 10px;
          margin-bottom: 15px;
        }

        .ct-footer-logo-box img {
          width: 42px;
          height: 42px;
          object-fit: contain;
        }

        .ct-footer-wordmark {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 25px;
          letter-spacing: 2px;
          color: #fff7f2;
        }

        .ct-footer-tagline {
          margin: 10px 0 8px;
          color: #f3dfe0;
          font-size: 13px;
        }

        .ct-footer-description {
          margin: 0;
          color: #d9bfc2;
          font-size: 12px;
          line-height: 1.7;
        }

        .ct-footer-column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }

        .ct-footer-column h3 {
          margin: 0 0 8px;
          color: #fff7f2;
          font-size: 11px;
          letter-spacing: 2px;
          font-weight: 700;
        }

        .ct-footer-column a {
          color: #e2cacc;
          text-decoration: none;
          font-size: 12px;
          transition: opacity 0.2s ease;
        }

        .ct-footer-column a:hover {
          opacity: 0.7;
        }

        .ct-footer-bottom {
          max-width: 1200px;
          margin: 42px auto 0;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 247, 242, 0.18);
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: #cdb3b6;
          font-size: 11px;
        }

        @media (max-width: 760px) {
          .ct-header {
            height: 58px;
            padding: 0 18px;
          }

          .ct-logo {
            font-size: 25px;
          }

          .ct-nav {
            gap: 12px;
          }

          .ct-nav a {
            font-size: 11px;
          }

          .ct-hero {
            padding: 52px 18px 36px;
          }

          .ct-hero h1 {
            font-size: 48px;
            letter-spacing: -1.5px;
          }

          .ct-hero p {
            font-size: 14px;
          }

          .ct-card {
            width: calc(100% - 24px);
            padding: 30px 22px;
            margin-bottom: 45px;
          }

          .ct-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .ct-main h2,
          .ct-address h2,
          .ct-section h2 {
            font-size: 24px;
          }

          .ct-contact-row {
            align-items: flex-start;
            flex-direction: column;
            gap: 7px;
          }

          .ct-support-grid {
            grid-template-columns: 1fr;
          }

          .ct-support-card {
            min-height: 132px;
          }

          .ct-footer {
            width: calc(100% - 24px);
          }
        }

        @media (max-width: 480px) {
          .ct-footer-inner {
            grid-template-columns: 1fr;
          }

          .ct-nav {
            gap: 8px;
          }

          .ct-nav a {
            font-size: 10px;
          }

          .ct-support-grid {
            grid-template-columns: 1fr;
          }

          .ct-hero h1 {
            font-size: 42px;
          }
        }
      `}</style>

      <style jsx global>{`
        .header {
          height: 72px;
          width: 100%;
          box-sizing: border-box;
          background: #fffdfb;
          border-bottom: 1px solid #eadfd8;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 42px;
          position: relative;
          z-index: 200;
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

        .account-menu-wrap { position: relative; margin-left: 8px; }
        .account-button {
          display: inline-flex; align-items: center; gap: 9px; border: 0;
          background: transparent; color: #542f35; padding: 7px 2px; font: inherit;
          font-size: 11px; letter-spacing: 1.2px; cursor: pointer; white-space: nowrap;
        }
        .account-chevron { font-size: 18px; line-height: 1; transform: translateY(-2px); transition: transform 0.18s ease; }
        .account-chevron.open { transform: rotate(180deg) translateY(2px); }
        .account-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0; width: 255px;
          background: #fffdfb; border: 1px solid #eadfd8;
          box-shadow: 0 12px 28px rgba(84, 47, 53, 0.12); z-index: 300; overflow: hidden;
        }
        .account-dropdown::before {
          content: ""; position: absolute; top: -7px; right: 26px; width: 13px; height: 13px;
          background: #fffdfb; border-left: 1px solid #eadfd8; border-top: 1px solid #eadfd8;
          transform: rotate(45deg);
        }
        .account-dropdown a, .account-logout {
          width: 100%; min-height: 58px; display: flex; align-items: center; gap: 17px;
          padding: 0 20px; border: 0; background: transparent; color: #3f3032;
          text-decoration: none; font: inherit; font-size: 14px; letter-spacing: 0;
          text-align: left; cursor: pointer; position: relative; z-index: 1; box-sizing: border-box;
        }
        .account-dropdown a:hover, .account-logout:hover { background: #faf3ef; }
        .account-dropdown-icon {
          width: 28px; height: 28px; flex: 0 0 28px; display: inline-flex;
          align-items: center; justify-content: center; color: #542f35;
        }
        .account-dropdown-icon svg { width: 26px; height: 26px; }
        .account-dropdown-divider { height: 1px; background: #eadfd8; margin: 0; }

        .cart-mobile-header, .cart-mobile-logo, .cart-menu-button, .cart-mobile-menu,
        .cart-desktop-logo, .cart-desktop-continue { display: none; }

        @media (max-width: 1100px) and (min-width: 901px) {
          .header { padding: 0 24px; }
          .nav { gap: 15px; }
          .nav a, .account-button { font-size: 10px; letter-spacing: 0.8px; }
        }


        .mobile-account-menu { display: none; }

        @media (max-width: 900px) {
          .header { height: 64px; padding: 0 18px; position: relative; }
          .menu-button { display: flex; align-items: center; justify-content: center; flex: 0 0 auto; width: 36px; height: 36px; padding: 0; }
          .logo { position: absolute; left: 50%; transform: translateX(-50%); font-size: 25px; letter-spacing: 2px; }
          .account-menu-wrap { display: none; }
          .nav {
            display: none !important; position: absolute; top: 64px; left: 0; right: 0; width: 100%;
            max-width: none; box-sizing: border-box; background: #fffdfb; border-bottom: 1px solid #eadfd8;
            padding: 10px 18px 16px; flex-direction: column; align-items: stretch; gap: 0; margin: 0;
            box-shadow: 0 8px 20px rgba(84, 47, 53, 0.08); z-index: 300;
          }
          .nav.open { display: flex !important; }
          .nav a { width: 100%; box-sizing: border-box; padding: 14px 4px; border-bottom: 1px solid #f0e7e2; font-size: 12px; letter-spacing: 1.2px; text-align: left; }
          .mobile-account-menu { display: block; width: 100%; }
          .mobile-account-button { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 14px 4px; border: 0; border-bottom: 1px solid #f0e7e2; background: transparent; color: #542f35; font: inherit; font-size: 12px; letter-spacing: 1.2px; text-align: left; cursor: pointer; }
          .mobile-account-dropdown { width: 100%; margin: 4px 0 8px; background: #fffdfb; border: 1px solid #eadfd8; box-shadow: 0 5px 14px rgba(84,47,53,.07); }
          .mobile-account-dropdown a, .mobile-account-logout { width: 100%; min-height: 48px; display: flex; align-items: center; padding: 0 14px; border: 0; border-bottom: 1px solid #eadfd8; background: transparent; color: #3f3032; text-decoration: none; font: inherit; font-size: 14px; text-align: left; cursor: pointer; }
          .mobile-account-divider { height: 1px; background: #eadfd8; }
        }

        @media (max-width: 600px) {
          .header { height: 60px; padding: 0 14px; }
          .logo { font-size: 22px; letter-spacing: 2px; }
          .menu-button { width: 34px; height: 34px; }
          .nav { top: 60px; }
        }

        .cart-mobile-header,
        .cart-mobile-logo,
        .cart-menu-button,
        .cart-mobile-menu {
          display: none;
        }

        .cart-desktop-logo,
        .cart-desktop-continue {
          display: block;
        }

        @media (max-width: 900px) {
          .cart-header {
            height: 64px !important;
            padding: 0 18px !important;
            position: relative !important;
            z-index: 100 !important;
          }

          .cart-mobile-header {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
          }

          .cart-mobile-logo {
            display: block;
            color: #542f35;
            text-decoration: none;
            font-family: Georgia, serif;
            font-size: 20px;
            letter-spacing: 2.5px;
          }

          .cart-menu-button {
            display: flex;
            width: 38px;
            height: 36px;
            padding: 6px 2px;
            border: 0;
            background: transparent;
            flex-direction: column;
            justify-content: center;
            gap: 5px;
            cursor: pointer;
          }

          .cart-menu-button span {
            display: block;
            width: 22px;
            height: 1.5px;
            background: #542f35;
          }

          .cart-desktop-logo,
          .cart-desktop-continue {
            display: none;
          }

          .cart-mobile-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            display: flex;
            flex-direction: column;
            background: #fbf6f1;
            border-top: 1px solid #eaded8;
            border-bottom: 1px solid #eaded8;
            box-shadow: 0 8px 18px rgba(84,47,53,.10);
          }

          .cart-mobile-menu a {
            display: block;
            padding: 14px 20px;
            color: #542f35;
            text-decoration: none;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 14px;
            letter-spacing: 1px;
            border-bottom: 1px solid #eaded8;
          }

          .cart-mobile-menu a:last-child {
            border-bottom: 0;
          }
      `}</style>
    </main>
  );
}
