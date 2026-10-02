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

export default function TermsConditionsPage() {
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

  return (
    <main className="terms-page">
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

      <section className="terms-hero">
        <div className="terms-eyebrow">DREAMZY</div>
        <h1>Terms &amp; Conditions</h1>
        <p>Terms governing your use of the DREAMZY website and purchases.</p>
        <div className="terms-effective">Effective date: 23 September 2026</div>
      </section>

      <section className="terms-content">
        <article className="terms-card">
          <p>
            These Terms &amp; Conditions govern your access to and use of the
            DREAMZY website and your purchase of products from DREAMZY,
            operated by Dharvi Lifestyle Private Limited.
          </p>

          <p>
            By using this website, creating an account, placing an order, or
            otherwise purchasing from DREAMZY, you agree to these Terms &amp;
            Conditions. If you do not agree, please do not use the website or
            place an order.
          </p>

          <h2>1. About DREAMZY</h2>
          <p>
            DREAMZY is a nightwear brand operated by Dharvi Lifestyle Private
            Limited. Our registered address is:
          </p>
          <p className="terms-address">
            315, Nakshtra-9, Opp. Girnar Cinema, Phulchhab Chowk,
            Rajkot - 360006, Gujarat, India.
          </p>
          <p>
            Customer support: <a href="mailto:admin@dreamzy.in">admin@dreamzy.in</a>
          </p>

          <h2>2. Website Use</h2>
          <p>
            You agree to use the website only for lawful purposes and in a
            manner that does not interfere with the operation, security or
            availability of the website.
          </p>
          <p>
            You must not attempt to gain unauthorized access to accounts,
            systems or data, introduce malicious code, misuse payment
            functionality, or use the website for fraudulent or unlawful
            activity.
          </p>

          <h2>3. Product Information</h2>
          <p>
            We aim to display product descriptions, images, sizes, colours,
            prices and availability as accurately as reasonably possible.
            Actual colours may vary depending on your screen or device.
          </p>
          <p>
            Product availability and stock may change without notice. We may
            correct errors in product information, pricing or availability
            before an order is accepted or fulfilled.
          </p>

          <h2>4. Prices, GST and Shipping</h2>
          <p>
            Prices displayed on DREAMZY are in Indian Rupees (₹) and, where
            indicated at checkout, are inclusive of applicable GST.
          </p>
          <p>
            Applicable tax details may be shown in the cart, checkout, order
            details and invoice. GST treatment may depend on the applicable
            law and the information available at the time of supply.
          </p>
          <p>
            DREAMZY currently offers free shipping on every order unless a
            specific offer or checkout communication states otherwise.
          </p>

          <h2>5. Account</h2>
          <p>
            If you create a DREAMZY account, you are responsible for providing
            accurate information and for keeping your account information
            reasonably secure.
          </p>
          <p>
            You should notify us if you believe your account has been used
            without authorization.
          </p>

          <h2>6. Orders</h2>
          <p>
            When you place an order, you submit a request to purchase the
            selected products. An order may be subject to verification of
            product availability, customer information, payment details and
            other applicable checks.
          </p>
          <p>
            An order may be cancelled or declined where permitted by law,
            including where a product is unavailable, there is an obvious
            pricing or product-information error, payment cannot be
            authorized, or fraudulent activity is reasonably suspected.
          </p>
          <p>
            If an order is cancelled by us after payment has been received,
            any eligible refund will be processed using the applicable
            payment/refund method and subject to applicable law.
          </p>

          <h2>7. Payment</h2>
          <p>
            Available payment methods are shown during checkout. Payment
            processing may be provided by third-party payment service
            providers.
          </p>
          <p>
            You agree to provide accurate payment and billing information and
            authorize the applicable payment provider to process the
            transaction.
          </p>

          <h2>8. Cancellation, Returns and Refunds</h2>
          <p>
            Order cancellation, returns and refunds are governed by the
            applicable DREAMZY Cancellation Policy and Return &amp; Refund
            Policy published on this website.
          </p>
          <p>
            Please review those policies before placing an order. Nothing in
            these Terms is intended to remove or restrict any consumer right
            that cannot lawfully be excluded.
          </p>

          <h2>9. Delivery</h2>
          <p>
            We will use the delivery information supplied at checkout to
            arrange delivery. You are responsible for providing an accurate
            and complete address and reachable contact details.
          </p>
          <p>
            Delivery times may vary depending on location, courier operations,
            product availability and circumstances outside our reasonable
            control.
          </p>

          <h2>10. Intellectual Property</h2>
          <p>
            Unless otherwise stated, the DREAMZY name, logo, website design,
            product photographs, graphics, text and other original content are
            owned by or used with permission by Dharvi Lifestyle Private
            Limited and may be protected by applicable intellectual-property
            laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, sell, publish or
            commercially exploit our content without prior written permission,
            except where permitted by law.
          </p>

          <h2>11. Reviews and User Content</h2>
          <p>
            Where the website allows customers to submit reviews or other
            content, you should submit only content that is truthful, lawful
            and relevant to your genuine experience.
          </p>
          <p>
            We may moderate, hide or remove content that is unlawful,
            misleading, abusive, defamatory, infringing, irrelevant, or
            otherwise inappropriate, subject to applicable law.
          </p>

          <h2>12. Third-Party Services and Links</h2>
          <p>
            The website may use or link to third-party services, including
            payment, delivery, analytics or social-media services. Their
            services may be subject to their own terms and privacy policies.
          </p>
          <p>
            We are not responsible for the content or policies of third-party
            websites that we do not control.
          </p>

          <h2>13. Privacy</h2>
          <p>
            Your personal information is handled in accordance with the
            DREAMZY Privacy Policy. Please read the Privacy Policy to
            understand how information is collected, used, stored and shared.
          </p>

          <h2>14. Website Availability</h2>
          <p>
            We aim to keep the website available and accurate, but we do not
            guarantee uninterrupted or error-free operation at all times.
            Maintenance, technical failures, network problems and other events
            may temporarily affect availability.
          </p>

          <h2>15. Limitation of Liability</h2>
          <p>
            To the extent permitted by applicable law, DREAMZY and Dharvi
            Lifestyle Private Limited will not be responsible for indirect,
            incidental or consequential losses arising from use of the website
            or products, except where such liability cannot lawfully be
            excluded or limited.
          </p>
          <p>
            Nothing in these Terms limits liability or consumer rights where
            doing so would be unlawful.
          </p>

          <h2>16. Changes to These Terms</h2>
          <p>
            We may update these Terms &amp; Conditions from time to time to
            reflect changes to the website, products, services or applicable
            requirements. The updated version will be posted on this page with
            a revised effective date.
          </p>

          <h2>17. Governing Law and Jurisdiction</h2>
          <p>
            These Terms are intended to be governed by the laws applicable in
            India. Subject to applicable consumer-protection and other
            mandatory legal rights, disputes will be subject to the
            jurisdiction of the appropriate courts at Rajkot, Gujarat.
          </p>

          <h2>18. Contact Us</h2>
          <p>
            For questions about these Terms, an order or a customer-service
            matter, please contact:
          </p>
          <p className="terms-contact">
            <strong>Dharvi Lifestyle Private Limited</strong><br />
            DREAMZY<br />
            315, Nakshtra-9, Opp. Girnar Cinema, Phulchhab Chowk,
            Rajkot - 360006, Gujarat, India.<br />
            Email: <a href="mailto:admin@dreamzy.in">admin@dreamzy.in</a>
          </p>

          <div className="terms-note">
            <strong>Important:</strong> This Terms &amp; Conditions page is a
            business website draft prepared for DREAMZY's current e-commerce
            setup. It should be reviewed against the final return/refund
            policy, payment providers, courier arrangements, GST registration
            status and legal/compliance requirements before the website goes
            live.
          </div>
        </article>
      </section>

      <DreamzyFooter />

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
        <button type="button" className="mobile-bottom-nav-item mobile-bottom-nav-button" aria-label="Categories" aria-expanded={categoriesOpen} onClick={() => setCategoriesOpen((open) => !open)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.2" /><rect x="14" y="3" width="7" height="7" rx="1.2" /><rect x="3" y="14" width="7" height="7" rx="1.2" /><rect x="14" y="14" width="7" height="7" rx="1.2" /></svg>
          <span>Categories</span>
        </button>
        <Link href="/account" className="mobile-bottom-nav-item" aria-label="Account">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="3.5" /><path d="M4 21v-2.2a5.3 5.3 0 0 1 5.3-5.3h5.4a5.3 5.3 0 0 1 5.3 5.3V21H4Z" /></svg>
          <span>Account</span>
        </Link>
        <Link href="/cart" className="mobile-bottom-nav-item" aria-label="Cart">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 3h2.8l2.2 12.1a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.5L22 8H6" /><circle cx="10" cy="20" r="1.2" /><circle cx="18" cy="20" r="1.2" /></svg>
          <span>Cart</span>
        </Link>
      </nav>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #faf6f1;
          color: #542f35;
          font-family: Arial, Helvetica, sans-serif;
        }

        a {
          color: inherit;
        }

        .terms-page {
          min-height: 100vh;
          background: #faf6f1;
          color: #542f35;
        }

        .terms-header {
          height: 66px;
          padding: 0 7.5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fffdfb;
          border-bottom: 1px solid #eadfd8;
        }

        .terms-logo {
          text-decoration: none;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 30px;
          letter-spacing: -1px;
          color: #542f35;
        }

        nav {
          display: flex;
          align-items: center;
          gap: 25px;
        }

        nav a {
          text-decoration: none;
          font-size: 14px;
          color: #542f35;
        }

        nav a:hover {
          opacity: 0.65;
        }

        .terms-hero {
          text-align: center;
          padding: 68px 20px 55px;
        }

        .terms-eyebrow {
          font-size: 10px;
          letter-spacing: 4px;
          color: #a0646d;
          font-weight: 700;
          margin-bottom: 18px;
        }

        .terms-hero h1 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(42px, 5vw, 62px);
          font-weight: 400;
          line-height: 1.08;
        }

        .terms-hero p {
          margin: 18px auto 0;
          max-width: 650px;
          color: #765b5e;
          font-size: 15px;
          line-height: 1.7;
        }

        .terms-effective {
          margin-top: 12px;
          color: #9a6c72;
          font-size: 12px;
        }

        .terms-content {
          max-width: 950px;
          margin: 0 auto;
          padding: 0 20px 80px;
        }

        .terms-card {
          background: #fffdfb;
          border: 1px solid #eadfd8;
          padding: 48px 52px;
          box-shadow: 0 8px 30px rgba(84, 47, 53, 0.03);
        }

        .terms-card p {
          margin: 0 0 18px;
          color: #604c50;
          font-size: 15px;
          line-height: 1.85;
        }

        .terms-card h2 {
          margin: 34px 0 12px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 24px;
          font-weight: 400;
          color: #542f35;
        }

        .terms-card a {
          color: #8b4e59;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .terms-address,
        .terms-contact {
          padding: 16px 18px;
          background: #faf6f1;
          border-left: 2px solid #c9a4a8;
        }

        .terms-note {
          margin-top: 36px;
          padding: 18px 20px;
          background: #f7eee9;
          border: 1px solid #eadfd8;
          color: #6a5558;
          font-size: 13px;
          line-height: 1.7;
        }

        .terms-footer {
          padding: 52px 7.5% 28px;
          background: #542f35;
          color: #fff8f3;
        }

        .terms-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.6fr 1fr 1.35fr 1fr;
          gap: 42px;
        }

        .terms-footer-brand {
          max-width: 330px;
        }

        .terms-footer-logo-box {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff8f3;
          border-radius: 12px;
          margin-bottom: 14px;
          overflow: hidden;
        }

        .terms-footer-logo-box img {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }

        .terms-footer-wordmark {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 27px;
          letter-spacing: 2px;
          color: #fff8f3;
        }

        .terms-footer-tagline {
          color: #f0d9d4 !important;
          font-size: 13px !important;
          margin: 10px 0 8px !important;
        }

        .terms-footer-description {
          color: #e6c9c5 !important;
          font-size: 12px !important;
          line-height: 1.7;
          margin: 0 !important;
        }

        .terms-footer-column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 11px;
        }

        .terms-footer-column h3 {
          margin: 0 0 8px;
          color: #f2d7d3;
          font-size: 11px;
          letter-spacing: 2px;
        }

        .terms-footer-column a {
          font-size: 12px;
          color: #f9e9e5;
          text-decoration: none;
        }

        .terms-footer-column a:hover {
          opacity: 0.7;
        }

        .terms-footer-bottom {
          max-width: 1200px;
          margin: 42px auto 0;
          padding-top: 18px;
          border-top: 1px solid rgba(255, 248, 243, 0.18);
          display: flex;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          color: #d9b8b4;
          font-size: 11px;
        }

        @media (max-width: 700px) {
          .terms-header {
            height: auto;
            min-height: 64px;
            padding: 14px 18px;
            gap: 14px;
          }

          .terms-logo {
            font-size: 25px;
          }

          nav {
            gap: 12px;
            flex-wrap: wrap;
            justify-content: flex-end;
          }

          nav a {
            font-size: 11px;
          }

          .terms-hero {
            padding: 52px 18px 40px;
          }

          .terms-hero h1 {
            font-size: 40px;
          }

          .terms-hero p {
            font-size: 14px;
          }

          .terms-content {
            padding: 0 12px 55px;
          }

          .terms-card {
            padding: 28px 20px;
          }

          .terms-card p {
            font-size: 14px;
            line-height: 1.75;
          }

          .terms-card h2 {
            font-size: 21px;
            margin-top: 30px;
          }

          .terms-footer {
            padding: 42px 22px 24px;
          }

          .terms-footer-inner {
            grid-template-columns: 1fr 1fr;
            gap: 34px 24px;
          }

          .terms-footer-brand {
            grid-column: 1 / -1;
            max-width: 100%;
          }

          .terms-footer-bottom {
            margin-top: 32px;
            flex-direction: column;
            gap: 8px;
          }
        }


        /* EXACT CART HEADER / DESKTOP + MOBILE CSS */
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

        /* Mobile-only navigation: hidden on desktop. */
        .mobile-bottom-nav {
          display: none !important;
        }

        /* Match the approved Women page spacing and button treatment on Cart.
           Desktop remains unchanged. */
        .cart-empty-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 24px;
        }

        .cart-empty-actions .cart-empty-shop-button {
          margin-top: 0 !important;
        }

        @media (max-width: 600px) {
          .cart-empty-actions {
            gap: 8px;
            margin-top: 14px;
          }

          .cart-empty-actions .cart-empty-shop-button {
            margin-top: 0 !important;
          }

          .cart-section {
            padding: 18px 10px 36px !important;
          }

          .cart-title {
            font-size: 42px !important;
            line-height: 1.08 !important;
            margin: 10px 0 24px !important;
          }

          .cart-layout {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }

          .cart-item-row {
            grid-template-columns: 105px minmax(0, 1fr) !important;
            gap: 12px !important;
            padding-bottom: 18px !important;
            margin-bottom: 18px !important;
          }

          .cart-product-image {
            width: 105px !important;
            height: 135px !important;
          }

          .cart-item-info h2 {
            font-size: 18px !important;
            line-height: 1.18 !important;
            padding-right: 45px !important;
          }

          .cart-summary {
            position: static !important;
            width: 100% !important;
            padding: 18px !important;
          }

          .cart-summary h2 {
            margin-top: 0 !important;
            margin-bottom: 12px !important;
          }

          .cart-summary button,
          .cart-summary button[style] {
            width: 100% !important;
            min-height: 36px !important;
            height: auto !important;
            padding: 9px 4px !important;
            margin-top: 14px !important;
            border: 0 !important;
            background: #542f35 !important;
            color: #fff !important;
            font-size: 9px !important;
            line-height: 1.3 !important;
            letter-spacing: 0.45px !important;
          }

          .cart-empty-shop-button {
            display: inline-block !important;
            width: auto !important;
            min-height: 36px !important;
            height: auto !important;
            padding: 9px 18px !important;
            margin-top: 14px !important;
            font-size: 9px !important;
            line-height: 1.3 !important;
            letter-spacing: 0.45px !important;
          }

          .dreamzy-footer {
            padding-bottom: 92px !important;
          }

          /* Mobile bottom navigation — compact white pill like the Women page */
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

          .mobile-bottom-nav-item.cart-active {
            background: #f3e8e9 !important;
          }
        }
      `}</style>
    </main>
  );
}
