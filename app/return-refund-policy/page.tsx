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

export default function ReturnRefundPolicyPage() {
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
    <main className="rr-page">
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

      <section className="rr-hero">
        <div className="rr-eyebrow">D R E A M Z Y</div>
        <h1>Return &amp; Refund Policy</h1>
        <p>
          Clear and transparent information about returns, exchanges and
          refunds for DREAMZY orders.
        </p>
        <div className="rr-date">Effective date: 23 September 2026</div>
      </section>

      <section className="rr-card">
        <p className="rr-intro">
          This Return &amp; Refund Policy explains how Dharvi Lifestyle Private
          Limited, operating the DREAMZY brand, handles eligible returns,
          exchanges, refunds and product-related issues for purchases made
          through the DREAMZY website.
        </p>

        <div className="rr-highlight">
          <h2>RETURN ELIGIBILITY</h2>
          <p>
            Eligible products may be returned or exchanged within <strong>7 days from the date of delivery</strong>, subject to the conditions in this policy. Customers should contact DREAMZY within the applicable 7-day period to request a return or exchange.
          </p>
        </div>

        <PolicySection title="1. Eligible Return Situations">
          <p>
            Subject to the product-specific return terms, a return or exchange
            may be considered where:
          </p>
          <ul>
            <li>The product received is defective or damaged.</li>
            <li>The wrong product, size or variant was delivered.</li>
            <li>The product materially differs from the product ordered or the
              description provided on the website.</li>
            <li>The product otherwise qualifies for return under the applicable
              return terms communicated at the time of purchase.</li>
          </ul>
        </PolicySection>

        <PolicySection title="2. Product Condition for Return">
          <p>
            Where a return is permitted, the product should generally be
            returned in its original condition, with original packaging,
            labels, tags and accessories, where applicable.
          </p>
          <p>
            Products that have been worn, washed, altered, damaged after
            delivery, stained, soiled or otherwise used beyond reasonable
            inspection may not qualify for return, except where applicable law
            provides otherwise or the issue relates to a product defect or
            delivery error.
          </p>
        </PolicySection>

        <PolicySection title="3. Intimate / Hygiene Considerations">
          <p>
            Because DREAMZY sells nightwear and apparel, hygiene and product
            condition are important. Certain products may be non-returnable
            once worn, washed, altered or used, particularly where return could
            create hygiene or health concerns.
          </p>
          <p>
            Any product-specific non-returnable condition will be disclosed on
            the relevant product page or before purchase.
          </p>
        </PolicySection>

        <PolicySection title="4. Damaged, Defective or Incorrect Products">
          <p>
            If you receive a damaged, defective or incorrect product, please
            contact DREAMZY as soon as reasonably possible with your order
            number and clear photographs or other information that helps us
            verify the issue.
          </p>
          <p>
            DREAMZY may review the information, request additional photographs
            or arrange a return or replacement where appropriate.
          </p>
        </PolicySection>

        <PolicySection title="5. Return Request Process">
          <p>To request a return or exchange:</p>
          <ol>
            <li>Contact DREAMZY using the contact details provided below.</li>
            <li>Provide your order number and the product details.</li>
            <li>Explain the reason for the request.</li>
            <li>Provide photographs or other supporting information if requested.</li>
            <li>Follow the return instructions provided by DREAMZY.</li>
          </ol>
          <p>
            Please do not send a product back without receiving return
            instructions where such instructions are required.
          </p>
        </PolicySection>

        <PolicySection title="6. Exchange">
          <p>
            Where exchange is offered for a particular product, the exchange
            will be subject to product availability, size availability and the
            applicable product-specific terms.
          </p>
          <p>
            If the requested replacement is unavailable, DREAMZY may process
            another appropriate resolution, including a refund where
            applicable.
          </p>
        </PolicySection>

        <PolicySection title="7. Refunds">
          <p>
            If a refund is approved, DREAMZY will process the eligible refund
            after the required verification or return process is completed.
          </p>
          <p>
            The refundable amount may depend on the nature of the approved
            return and the applicable terms communicated for the order.
            Amounts that are not legally or contractually refundable will be
            handled in accordance with the applicable policy and law.
          </p>
        </PolicySection>

        <PolicySection title="8. COD Orders">
          <p>
            For Cash on Delivery (COD) orders, any approved refund will require
            DREAMZY to obtain the information reasonably necessary to process
            the refund through an available electronic or banking method.
          </p>
          <p>
            Customers should provide accurate refund details when requested.
            DREAMZY will not be responsible for delays caused by incorrect or
            incomplete customer-provided banking information.
          </p>
        </PolicySection>

        <PolicySection title="9. Return Shipping">
          <p>
            Where a return is approved because the product is defective,
            damaged in transit, incorrect or materially different from what was
            ordered, DREAMZY will determine the appropriate return-shipping
            arrangement based on the circumstances.
          </p>
          <p>
            For other eligible returns, any applicable return-shipping cost
            will be communicated in the relevant product or order terms before
            the return is processed.
          </p>
        </PolicySection>

        <PolicySection title="10. Refund Timing">
          <p>
            Refund timing can depend on the return verification process, the
            payment method, banking channels and other payment-service
            processing requirements. DREAMZY will initiate approved refunds
            within the applicable legal or stated timeframe, and the actual
            credit may take additional time to appear in the customer's
            account.
          </p>
        </PolicySection>

        <PolicySection title="11. Cancellation vs. Return">
          <p>
            Cancellation applies to an order before it reaches the stage where
            cancellation is no longer available. A return applies after
            delivery where the product qualifies under the applicable return
            terms.
          </p>
          <p>
            Please refer to the DREAMZY Cancellation Policy for order
            cancellation conditions.
          </p>
        </PolicySection>

        <PolicySection title="12. Non-Returnable Situations">
          <p>
            Subject to applicable law, a return may be declined where:
          </p>
          <ul>
            <li>The product does not meet the applicable return conditions.</li>
            <li>The product has been worn, washed, altered or damaged after delivery.</li>
            <li>Required tags, packaging or accessories are missing where they
              are required for the return.</li>
            <li>The return or exchange request is made more than 7 days after delivery.</li>
            <li>The issue is caused by misuse, improper care or normal wear and
              tear.</li>
          </ul>
        </PolicySection>

        <PolicySection title="13. Consumer Rights">
          <p>
            Nothing in this policy is intended to exclude or restrict any
            consumer right or remedy that cannot lawfully be excluded or
            restricted under applicable Indian law.
          </p>
          <p>
            DREAMZY aims to provide clear information about returns, refunds,
            exchanges, delivery and related terms so customers can make
            informed purchase decisions. The Consumer Protection (E-Commerce)
            Rules, 2020 require e-commerce entities to provide clear
            information about return, refund, exchange, delivery and related
            terms.
          </p>
        </PolicySection>

        <PolicySection title="14. Changes to This Policy">
          <p>
            DREAMZY may update this Return &amp; Refund Policy from time to
            time to reflect changes in products, operations, technology or
            applicable law. The updated version will be published on this
            website with its effective date.
          </p>
        </PolicySection>

        <PolicySection title="15. Contact Us">
          <p>
            For return, exchange or refund assistance, please contact:
          </p>
          <div className="rr-contact">
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

        <div className="rr-note">
          <strong>Important:</strong> This website policy is a business-facing
          draft and should be reviewed against DREAMZY&apos;s final product
          categories, hygiene/return rules, courier arrangements, payment
          providers and legal/compliance setup before launch. In particular,
          DREAMZY should publish a specific return window and product-level
          exclusions once those commercial terms are finalized.
        </div>
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
        <Link href="/cart" className="mobile-bottom-nav-item cart-active" aria-label="Cart">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 3h2.8l2.2 12.1a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.5L22 8H6" /><circle cx="10" cy="20" r="1.2" /><circle cx="18" cy="20" r="1.2" /></svg>
          <span>Cart</span>
        </Link>
      </nav>


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

      <style jsx>{`
        .rr-page {
          min-height: 100vh;
          background: #faf7f3;
          color: #542f35;
          font-family: Arial, Helvetica, sans-serif;
        }

        .rr-header {
          position: relative;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          background: #fffdfb;
          border-bottom: 1px solid #eadfd8;
        }

        .rr-logo {
          color: #542f35;
          text-decoration: none;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 30px;
          letter-spacing: -0.5px;
        }

        .rr-mobile-menu {
          display: none;
          width: 30px;
          height: 30px;
          padding: 6px;
          border: 1px solid #d9c8c2;
          background: #fffdfb;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 3px;
          cursor: pointer;
        }

        .rr-mobile-menu span {
          display: block;
          width: 13px;
          height: 1px;
          background: #542f35;
        }

        .rr-nav {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .rr-nav a {
          color: #542f35;
          text-decoration: none;
          font-size: 13px;
          letter-spacing: 0.2px;
        }

        .rr-nav a:hover {
          opacity: 0.65;
        }

        .rr-hero {
          max-width: 900px;
          margin: 0 auto;
          padding: 68px 24px 52px;
          text-align: center;
        }

        .rr-eyebrow {
          color: #a84d5a;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 5px;
          margin-bottom: 18px;
        }

        .rr-hero h1 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(48px, 7vw, 70px);
          font-weight: 400;
          line-height: 1.05;
          letter-spacing: -2px;
          color: #5a3037;
        }

        .rr-hero p {
          max-width: 700px;
          margin: 22px auto 0;
          color: #76545a;
          font-size: 15px;
          line-height: 1.7;
        }

        .rr-date {
          margin-top: 14px;
          color: #a84d5a;
          font-size: 12px;
        }

        .rr-card {
          width: min(910px, calc(100% - 32px));
          margin: 0 auto 70px;
          padding: 52px;
          background: #fffdfb;
          border: 1px solid #e6d8d1;
          box-shadow: 0 14px 40px rgba(84, 47, 53, 0.04);
        }

        .rr-intro {
          margin: 0 0 32px;
          color: #5f4248;
          font-size: 15px;
          line-height: 1.9;
        }

        .rr-highlight {
          margin: 0 0 38px;
          padding: 22px 24px;
          background: #f7eee9;
          border: 1px solid #ead9d2;
        }

        .rr-highlight h2 {
          margin: 0 0 9px;
          color: #a04b57;
          font-size: 13px;
          letter-spacing: 2px;
          font-weight: 700;
        }

        .rr-highlight p {
          margin: 0;
          color: #65474d;
          font-size: 14px;
          line-height: 1.8;
        }

        .rr-section {
          margin-top: 34px;
          padding-top: 30px;
          border-top: 1px solid #eee3dd;
        }

        .rr-section h2 {
          margin: 0 0 13px;
          color: #542f35;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 22px;
          font-weight: 500;
        }

        .rr-section p,
        .rr-section li {
          color: #64474d;
          font-size: 14px;
          line-height: 1.85;
        }

        .rr-section p {
          margin: 0 0 13px;
        }

        .rr-section ul,
        .rr-section ol {
          margin: 8px 0 14px;
          padding-left: 24px;
        }

        .rr-section li {
          margin: 6px 0;
        }

        .rr-contact {
          margin-top: 14px;
          padding: 18px 20px;
          background: #faf4f0;
          border-left: 3px solid #a84d5a;
          color: #65474d;
          font-size: 14px;
          line-height: 1.85;
        }

        .rr-note {
          margin-top: 38px;
          padding: 20px 22px;
          background: #f9f4f1;
          border: 1px solid #e8ddd7;
          color: #76585d;
          font-size: 12px;
          line-height: 1.75;
        }

        .rr-footer {
          padding: 34px 4.5% 14px;
          background: #542f35;
          color: #fff8f4;
        }

        .rr-footer-inner {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1.35fr 0.85fr;
          gap: 24px;
          align-items: start;
        }

        .rr-footer-column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          align-self: start;
        }

        .rr-footer-column h3 {
          margin: 0 0 14px;
          color: #fff8f4;
          font-size: 11px;
          letter-spacing: 3px;
          font-weight: 700;
        }

        .rr-footer-column a {
          margin: 0;
          color: #fff8f4;
          text-decoration: none;
          font-size: 14px;
          line-height: 1.2;
        }

        .rr-footer-column a:hover {
          opacity: 0.75;
        }

        .rr-footer-brand {
          min-height: auto;
          padding-left: 42px;
          border-left: 1px solid rgba(255, 248, 244, 0.65);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .rr-footer-logo {
          display: block;
          width: 240px;
          max-width: 100%;
          height: 240px;
          object-fit: contain;
          margin: 0 auto 0;
          background: transparent;
        }

        .rr-footer-brand p {
          margin: 0 0 10px;
          color: #f8e9e4;
          font-size: 16px;
          line-height: 1.6;
        }

        .rr-footer-tagline {
          margin: -6px 0 12px;
          color: #f8e9e4;
          text-align: center;
        }

        .rr-footer-nightwear {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 18px;
          letter-spacing: 6px;
          margin-bottom: 6px;
        }

        .rr-footer-motto {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 13px;
          font-style: italic;
          letter-spacing: 1.5px;
        }

        .rr-footer-motto span {
          color: #f4b5b0;
          padding: 0 5px;
        }

        .rr-footer-brand .rr-footer-support {
          color: #f8e9e4;
          font-size: 15px;
        }

        .rr-footer-support a {
          color: #f8e9e4;
          text-decoration: none;
        }

        .rr-footer-socials {
          min-height: auto;
          padding-left: 42px;
          border-left: 1px solid rgba(255, 248, 244, 0.65);
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 4px;
        }

        .rr-footer-socials a {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #fff8f4;
          text-decoration: none;
          font-size: 16px;
          line-height: 1;
        }

        .rr-social-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 23px;
          line-height: 1;
          flex: 0 0 44px;
        }

        .rr-pinterest { background: #e60023; }
        .rr-facebook { background: #1877f2; }
        .rr-instagram { background: linear-gradient(135deg, #feda75, #d62976, #4f5bd5); }
        .rr-youtube { background: #ff0000; font-size: 18px; }
        .rr-linkedin { background: #0a66c2; font-size: 17px; }

        .rr-footer-socials a:hover {
          opacity: 0.8;
        }

        .rr-footer-bottom {
          max-width: 1400px;
          margin: 14px auto 0;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 248, 244, 0.65);
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: #fff8f4;
          font-size: 14px;
        }

        @media (max-width: 1050px) {
          .rr-footer-inner {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 35px 28px;
          }

          .rr-footer-brand {
            grid-column: 1 / -1;
            border-left: 0;
            padding-left: 0;
            min-height: auto;
          }

          .rr-footer-socials {
            grid-column: 1 / -1;
            border-left: 0;
            padding-left: 0;
            min-height: auto;
            flex-direction: row;
            justify-content: center;
            flex-wrap: wrap;
          }
        }

        @media (max-width: 700px) {
          .rr-header {
            height: 58px;
            padding: 0 14px;
            justify-content: center;
          }

          .rr-mobile-menu {
            position: absolute;
            left: 14px;
            top: 14px;
            display: flex;
          }

          .rr-logo {
            font-size: 20px;
            letter-spacing: 1.5px;
          }

          .rr-nav {
            display: none;
          }

          .rr-hero {
            padding: 52px 18px 36px;
          }

          .rr-hero h1 {
            font-size: 45px;
            letter-spacing: -1.5px;
          }

          .rr-hero p {
            font-size: 14px;
          }

          .rr-card {
            width: calc(100% - 24px);
            padding: 30px 22px;
            margin-bottom: 45px;
          }

          .rr-highlight {
            padding: 19px;
          }

          .rr-section {
            margin-top: 28px;
            padding-top: 25px;
          }

          .rr-section h2 {
            font-size: 20px;
          }

          .rr-section p,
          .rr-section li {
            font-size: 13px;
            line-height: 1.8;
          }

          .rr-footer {
            padding: 42px 22px 24px;
          }

          .rr-footer-inner {
            grid-template-columns: 1fr 1fr;
            gap: 30px 24px;
          }

          .rr-footer-brand {
            grid-column: 1 / -1;
            border-left: 0;
            padding-left: 0;
          }

          .rr-footer-socials {
            grid-column: 1 / -1;
            border-left: 0;
            padding-left: 0;
            min-height: auto;
          }

          .rr-footer-logo {
            width: 260px;
            height: 260px;
          }

          .rr-footer-bottom {
            margin-top: 32px;
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
        }

        @media (max-width: 430px) {
          .rr-footer-inner {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .rr-footer-column {
            align-items: flex-start;
          }

          .rr-footer-brand {
            grid-column: auto;
            text-align: center;
            align-items: center;
          }

          .rr-footer-socials {
            grid-column: auto;
            align-items: flex-start;
          }

          .rr-footer-socials a {
            font-size: 14px;
          }

          .rr-footer-logo {
            width: 230px;
            height: 230px;
            margin-left: auto;
          }
        }
      `}</style>
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
    <section className="rr-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
