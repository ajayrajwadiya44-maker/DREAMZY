"use client";

import { useState } from "react";
import Link from "next/link";

export default function CancellationPolicyPage() {
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
    <main className="cp-page">
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
      <section className="cp-hero">
        <div className="cp-eyebrow">D R E A M Z Y</div>
        <h1>Cancellation Policy</h1>
        <p>
          Clear information about when and how DREAMZY orders can be cancelled.
        </p>
        <div className="cp-date">Effective date: 23 September 2026</div>
      </section>

      <section className="cp-card">
        <p className="cp-intro">
          This Cancellation Policy explains how Dharvi Lifestyle Private
          Limited, operating the DREAMZY brand, handles customer-requested
          cancellations and cancellations made by DREAMZY for orders placed
          through the DREAMZY website.
        </p>

        <div className="cp-highlight">
          <h2>CANCELLATION WINDOW</h2>
          <p>
            On the current DREAMZY website, customers can request cancellation
            while an eligible order is in <strong>NEW</strong> or{" "}
            <strong>CONFIRMED</strong> status. Once an order has progressed to
            packing or shipping, the online cancellation option may no longer
            be available.
          </p>
        </div>

        <PolicySection title="1. Customer Cancellation">
          <p>
            A customer may cancel an eligible order through the My Orders
            section of the DREAMZY website while the order remains in NEW or
            CONFIRMED status.
          </p>
          <p>
            The cancellation option may disappear once the order has been
            PACKED, SHIPPED, DELIVERED or already CANCELLED.
          </p>
        </PolicySection>

        <PolicySection title="2. How to Cancel an Order">
          <ol>
            <li>Sign in to your DREAMZY account.</li>
            <li>Open the My Orders section.</li>
            <li>Select the order you want to cancel.</li>
            <li>Use the available CANCEL ORDER option.</li>
            <li>Confirm the cancellation request.</li>
          </ol>
          <p>
            If the cancellation option is not displayed, the order may already
            have progressed beyond the stage where online cancellation is
            available.
          </p>
        </PolicySection>

        <PolicySection title="3. Cancellation After Packing or Shipping">
          <p>
            Once an order has been PACKED or SHIPPED, DREAMZY may not be able
            to cancel it through the online order system because fulfilment or
            courier processing may already have started.
          </p>
          <p>
            If the customer receives the product and it qualifies for return,
            the request will instead be handled under the DREAMZY Return &
            Refund Policy.
          </p>
        </PolicySection>

        <PolicySection title="4. Refund After Cancellation">
          <p>
            If an eligible paid order is successfully cancelled, DREAMZY will
            process the applicable refund through the relevant payment or
            banking method, subject to payment-provider processing and
            applicable law.
          </p>
          <p>
            For COD orders that are cancelled before delivery, there is
            generally no payment to refund because payment has not yet been
            collected.
          </p>
        </PolicySection>

        <PolicySection title="5. COD Orders">
          <p>
            For Cash on Delivery orders, an eligible cancellation before
            dispatch or fulfilment may simply stop the order from being
            delivered.
          </p>
          <p>
            If a COD order has already entered fulfilment or shipping, the
            customer should contact DREAMZY promptly. Any subsequent product
            return or refund request will be considered under the applicable
            return terms.
          </p>
        </PolicySection>

        <PolicySection title="6. Cancellation by DREAMZY">
          <p>
            DREAMZY may cancel an order in circumstances such as:
          </p>
          <ul>
            <li>The ordered product is unavailable or inventory information is
              incorrect.</li>
            <li>The order cannot reasonably be fulfilled or delivered.</li>
            <li>A payment or transaction issue prevents completion of the
              order.</li>
            <li>Required customer information is incomplete or materially
              incorrect.</li>
            <li>There is a suspected fraudulent, abusive or unauthorized
              transaction.</li>
            <li>Other circumstances make fulfilment impossible or unlawful.</li>
          </ul>
          <p>
            Where a paid order is cancelled by DREAMZY, any applicable refund
            will be handled in accordance with the payment method, applicable
            terms and law.
          </p>
        </PolicySection>

        <PolicySection title="7. Product Availability">
          <p>
            DREAMZY maintains inventory information for products and
            size-specific stock. If an item becomes unavailable before
            fulfilment, DREAMZY may contact the customer regarding available
            alternatives or cancel the affected order where necessary.
          </p>
        </PolicySection>

        <PolicySection title="8. Payment Failure or Incomplete Payment">
          <p>
            An order may not be treated as successfully paid where the payment
            attempt fails, is declined, is reversed or remains incomplete.
            DREAMZY may cancel or close an order that cannot be successfully
            confirmed for fulfilment.
          </p>
        </PolicySection>

        <PolicySection title="9. Cancellation and GST / Invoice Records">
          <p>
            Where an order is cancelled before fulfilment and no completed
            taxable supply has occurred, the related order and invoice records
            will be handled according to the applicable accounting, GST and
            legal requirements.
          </p>
          <p>
            Customers should not treat an invoice number displayed in an order
            history as evidence that an order cannot be cancelled; the actual
            cancellation status and applicable tax treatment will be determined
            from the order records.
          </p>
        </PolicySection>

        <PolicySection title="10. Customer Responsibility">
          <p>
            Customers should review product, size, quantity, delivery address
            and payment details carefully before completing an order. If an
            error is noticed after placing an order, the customer should use
            the cancellation option as soon as possible while the order is
            eligible for cancellation.
          </p>
        </PolicySection>

        <PolicySection title="11. Consumer Rights">
          <p>
            Nothing in this policy is intended to exclude or restrict any
            consumer right or remedy that cannot lawfully be excluded or
            restricted under applicable Indian law.
          </p>
          <p>
            The Consumer Protection (E-Commerce) Rules, 2020 apply to goods and
            services bought or sold through digital or electronic networks and
            require e-commerce entities to provide relevant information about
            terms such as return, refund, exchange and related customer
            processes.
          </p>
        </PolicySection>

        <PolicySection title="12. Changes to This Policy">
          <p>
            DREAMZY may update this Cancellation Policy from time to time to
            reflect changes in products, operations, technology or applicable
            law. The updated version will be published on this website with
            its effective date.
          </p>
        </PolicySection>

        <PolicySection title="13. Contact Us">
          <p>
            For cancellation assistance, please contact:
          </p>
          <div className="cp-contact">
            <strong>Dharvi Lifestyle Private Limited</strong>
            <br />
            Operating Brand: DREAMZY
            <br />
            315, Nakshtra-9, Opp. Girnar Cinema,
            <br />
            Phulchhab Chowk, Rajkot - 360006, Gujarat, India
            <br />
            Email: admin@dreamzy.in
          </div>
        </PolicySection>

        <div className="cp-note">
          <strong>Important:</strong> This website policy is a business-facing
          draft and should be reviewed against DREAMZY&apos;s final commercial
          cancellation terms, payment-provider rules, GST/accounting treatment,
          courier arrangements and legal/compliance setup before launch.
        </div>
      </section>

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

      <style jsx global>{`        .cp-page {
          min-height: 100vh;
          background: #faf7f3;
          color: #542f35;
          font-family: Arial, Helvetica, sans-serif;
        }

        .cp-header {
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          background: #fffdfb;
          border-bottom: 1px solid #eadfd8;
        }

        .cp-logo {
          color: #542f35;
          text-decoration: none;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 30px;
        }

        .cp-nav {
          display: flex;
          gap: 28px;
        }

        .cp-nav a,
        .cp-footer a {
          color: #542f35;
          text-decoration: none;
          font-size: 13px;
        }

        .cp-nav a:hover,
        .cp-footer a:hover {
          opacity: 0.65;
        }

        .cp-hero {
          max-width: 900px;
          margin: 0 auto;
          padding: 68px 24px 52px;
          text-align: center;
        }

        .cp-eyebrow {
          color: #a84d5a;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 5px;
          margin-bottom: 18px;
        }

        .cp-hero h1 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(48px, 7vw, 70px);
          font-weight: 400;
          line-height: 1.05;
          letter-spacing: -2px;
        }

        .cp-hero p {
          max-width: 700px;
          margin: 22px auto 0;
          color: #76545a;
          font-size: 15px;
          line-height: 1.7;
        }

        .cp-date {
          margin-top: 14px;
          color: #a84d5a;
          font-size: 12px;
        }

        .cp-card {
          width: min(910px, calc(100% - 32px));
          margin: 0 auto 70px;
          padding: 52px;
          background: #fffdfb;
          border: 1px solid #e6d8d1;
          box-shadow: 0 14px 40px rgba(84, 47, 53, 0.04);
        }

        .cp-intro {
          margin: 0 0 32px;
          color: #5f4248;
          font-size: 15px;
          line-height: 1.9;
        }

        .cp-highlight {
          margin-bottom: 38px;
          padding: 22px 24px;
          background: #f7eee9;
          border: 1px solid #ead9d2;
        }

        .cp-highlight h2 {
          margin: 0 0 9px;
          color: #a04b57;
          font-size: 13px;
          letter-spacing: 2px;
        }

        .cp-highlight p {
          margin: 0;
          color: #65474d;
          font-size: 14px;
          line-height: 1.8;
        }

        .cp-section {
          margin-top: 34px;
          padding-top: 30px;
          border-top: 1px solid #eee3dd;
        }

        .cp-section h2 {
          margin: 0 0 13px;
          color: #542f35;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 22px;
          font-weight: 500;
        }

        .cp-section p,
        .cp-section li {
          color: #64474d;
          font-size: 14px;
          line-height: 1.85;
        }

        .cp-section p {
          margin: 0 0 13px;
        }

        .cp-section ul,
        .cp-section ol {
          margin: 8px 0 14px;
          padding-left: 24px;
        }

        .cp-section li {
          margin: 6px 0;
        }

        .cp-contact {
          margin-top: 14px;
          padding: 18px 20px;
          background: #faf4f0;
          border-left: 3px solid #a84d5a;
          color: #65474d;
          font-size: 14px;
          line-height: 1.85;
        }

        .cp-note {
          margin-top: 38px;
          padding: 20px 22px;
          background: #f9f4f1;
          border: 1px solid #e8ddd7;
          color: #76585d;
          font-size: 12px;
          line-height: 1.75;
        }

        .cp-footer {
          background: #542f35;
          color: #fff8f5;
          margin-top: 0;
          padding: 58px 7.5% 28px;
        }

        .cp-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1.4fr 1fr;
          gap: 55px;
        }

        .cp-footer-brand {
          max-width: 330px;
        }

        .cp-footer-logo-box {
          width: 74px;
          height: 74px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #faf6f1;
          border-radius: 10px;
          margin-bottom: 18px;
        }

        .cp-footer-logo-box img {
          width: 58px;
          height: 58px;
          object-fit: contain;
        }

        .cp-footer-wordmark {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 28px;
          letter-spacing: 2px;
        }

        .cp-footer-tagline {
          color: #f4dfdc;
          font-size: 14px;
          margin: 10px 0 12px;
          line-height: 1.6;
        }

        .cp-footer-description {
          color: #ddc4c2;
          font-size: 13px;
          line-height: 1.7;
          margin: 0;
        }

        .cp-footer-column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 11px;
        }

        .cp-footer-column h3 {
          margin: 0 0 8px;
          color: #fff8f5;
          font-size: 12px;
          letter-spacing: 2px;
          font-weight: 700;
        }

        .cp-footer-column a {
          color: #e5cfcc;
          text-decoration: none;
          font-size: 13px;
          transition: opacity 0.2s ease;
        }

        .cp-footer-column a:hover {
          opacity: 0.65;
        }

        .cp-footer-social a {
          font-size: 13px;
        }

        .cp-footer-bottom {
          max-width: 1200px;
          margin: 42px auto 0;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.16);
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: #cdb3b1;
          font-size: 11px;
        }

        @media (max-width: 700px) {
          .cp-header {
            height: 58px;
            padding: 0 18px;
          }

          .cp-logo {
            font-size: 25px;
          }

          .cp-nav {
            gap: 12px;
          }

          .cp-nav a {
            font-size: 11px;
          }

          .cp-hero {
            padding: 52px 18px 36px;
          }

          .cp-hero h1 {
            font-size: 45px;
            letter-spacing: -1.5px;
          }

          .cp-hero p {
            font-size: 14px;
          }

          .cp-card {
            width: calc(100% - 24px);
            padding: 30px 22px;
            margin-bottom: 45px;
          }

          .cp-highlight {
            padding: 19px;
          }

          .cp-section {
            margin-top: 28px;
            padding-top: 25px;
          }

          .cp-section h2 {
            font-size: 20px;
          }

          .cp-section p,
          .cp-section li {
            font-size: 13px;
            line-height: 1.8;
          }

          .cp-footer {
            padding: 45px 20px 25px;
          }

          .cp-footer-inner {
            grid-template-columns: 1fr 1fr;
            gap: 38px 28px;
          }

          .cp-footer-brand {
            grid-column: 1 / -1;
            max-width: 100%;
          }

          .cp-footer-bottom {
            margin-top: 35px;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
        }

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
        }`}</style>
    </main>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cp-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
