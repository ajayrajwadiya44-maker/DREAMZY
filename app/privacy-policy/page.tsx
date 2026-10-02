"use client";
import { useState } from "react";
import Link from "next/link";

const sections = [
  {
    title: "1. Information We Collect",
    body: (
      <>
        <p>
          When you use DREAMZY, we may collect information that you provide
          directly to us, including your name, email address, mobile number,
          delivery address, city, state and pincode.
        </p>
        <p>
          When you place an order, we may also collect order information such
          as products purchased, sizes, quantities, order number, payment
          method, delivery information and transaction-related details needed
          to process and support the order.
        </p>
        <p>
          We may receive technical information associated with your use of the
          website, such as device, browser, IP address, pages visited and
          website interaction information, to the extent collected through our
          hosting, security, analytics or similar services.
        </p>
      </>
    )
  },
  {
    title: "2. How We Use Your Information",
    body: (
      <>
        <p>We may use personal information to:</p>
        <ul>
          <li>create and manage your customer account;</li>
          <li>process and fulfil orders;</li>
          <li>deliver products and provide order updates;</li>
          <li>process payments and prevent fraudulent transactions;</li>
          <li>provide customer support and respond to enquiries;</li>
          <li>manage returns, cancellations and refunds;</li>
          <li>maintain order, accounting and business records;</li>
          <li>improve website functionality, security and customer experience;</li>
          <li>send service-related communications; and</li>
          <li>send promotional communications where permitted and where the required consent has been obtained.</li>
        </ul>
      </>
    )
  },
  {
    title: "3. Orders and Payment Information",
    body: (
      <>
        <p>
          DREAMZY may use third-party payment providers when online payments
          are enabled. Payment information may be processed directly by the
          relevant payment provider in accordance with its own terms and
          privacy practices.
        </p>
        <p>
          DREAMZY does not intend to store customers' complete card numbers,
          CVV numbers or payment passwords in its own customer account records.
        </p>
        <p>
          At present, Cash on Delivery may be available for eligible orders.
          Online payment options may be introduced or changed as payment
          services are enabled.
        </p>
      </>
    )
  },
  {
    title: "4. Cookies and Similar Technologies",
    body: (
      <p>
        We may use cookies, local storage and similar technologies to keep
        your shopping cart, wishlist, account preferences and other website
        functionality working, and may use analytics or security technologies
        where enabled. You can control cookies through your browser settings,
        although disabling certain technologies may affect website
        functionality.
      </p>
    )
  },
  {
    title: "5. Sharing of Personal Information",
    body: (
      <>
        <p>
          We may share personal information only as reasonably necessary to
          operate the business, including with service providers such as
          payment processors, delivery and logistics providers, hosting
          providers, website or technology providers, customer-support
          providers, professional advisers and other vendors supporting
          DREAMZY.
        </p>
        <p>
          We may also disclose information where required by applicable law,
          legal process or a lawful request, or where reasonably necessary to
          protect the rights, safety, security or property of DREAMZY,
          customers or others.
        </p>
      </>
    )
  },
  {
    title: "6. Data Retention",
    body: (
      <p>
        We retain personal information for as long as reasonably necessary for
        the purposes for which it was collected, including order fulfilment,
        customer support, accounting, tax, legal and dispute-resolution
        requirements. Retention periods may differ depending on the type of
        information and applicable legal or business requirements.
      </p>
    )
  },
  {
    title: "7. Data Security",
    body: (
      <p>
        DREAMZY takes reasonable technical and organisational measures designed
        to protect personal information against unauthorised access, misuse,
        loss, alteration or disclosure. No internet transmission or storage
        system can be guaranteed to be completely secure.
      </p>
    )
  },
  {
    title: "8. Your Privacy Rights",
    body: (
      <>
        <p>
          Subject to applicable law and the relevant implementation timeline,
          you may have rights relating to your personal data, including rights
          to access information about processing, request correction or
          updating of inaccurate information, request deletion where applicable,
          withdraw consent where processing is based on consent, and raise a
          grievance or complaint through the applicable mechanism.
        </p>
        <p>
          Requests can be made using the contact details below. We may need to
          verify your identity before acting on a request.
        </p>
      </>
    )
  },
  {
    title: "9. Children's Privacy",
    body: (
      <p>
        DREAMZY is intended for customers who can lawfully enter into purchases
        and transactions. We do not knowingly request personal information
        from children for independent account creation or purchases. If you
        believe a child has provided personal information to us improperly,
        please contact us so that we can review the situation.
      </p>
    )
  },
  {
    title: "10. Third-Party Websites and Services",
    body: (
      <p>
        Our website may contain links or integrations to third-party websites,
        payment services, social platforms or other services. Their privacy
        practices are governed by their own policies. DREAMZY is not
        responsible for the privacy practices of third-party services that we
        do not control.
      </p>
    )
  },
  {
    title: "11. Changes to This Privacy Policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time to reflect changes
        to our services, technology, business practices or applicable law. The
        updated version will be posted on this page with a revised effective
        date where appropriate.
      </p>
    )
  },
  {
    title: "12. Contact Us",
    body: (
      <>
        <p>
          If you have a privacy question, request or grievance, please contact
          us:
        </p>
        <div className="contact-box">
          <strong>Dharvi Lifestyle Private Limited</strong>
          <br />
          Brand: DREAMZY
          <br />
          315, Nakshtra-9, Opp. Girnar Cinema, Phulchhab Chowk,
          <br />
          Rajkot - 360006, Gujarat, India
          <br />
          Email: <a href="mailto:admin@dreamzy.in">admin@dreamzy.in</a>
        </div>
      </>
    )
  }
];

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

export default function PrivacyPolicyPage() {
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
    <main className="policy-page">
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

      <section className="policy-hero">
        <div className="eyebrow">DREAMZY</div>
        <h1>Privacy Policy</h1>
        <p>How we collect, use and protect customer information.</p>
        <div className="effective">Effective date: 23 September 2026</div>
      </section>

      <section className="policy-content">
        <div className="intro">
          <p>
            This Privacy Policy explains how Dharvi Lifestyle Private Limited,
            operating the DREAMZY brand, handles personal information when you
            visit or use the DREAMZY website, create an account, place an
            order, contact us or otherwise interact with our services.
          </p>
          <p>
            We aim to handle personal data transparently and responsibly. This
            policy is intended to be read together with our Terms & Conditions,
            Shipping Policy, Return & Refund Policy and Cancellation Policy.
          </p>
        </div>

        {sections.map((section) => (
          <section className="policy-section" key={section.title}>
            <h2>{section.title}</h2>
            <div className="policy-body">{section.body}</div>
          </section>
        ))}

        <div className="policy-note">
          <strong>Important:</strong> This website policy is a business-facing
          privacy notice and should be reviewed against DREAMZY's final
          technology providers, payment gateway, analytics tools, marketing
          tools and legal/compliance setup before launch.
        </div>

        <div className="policy-links">
          <Link href="/">← BACK TO DREAMZY</Link>
          <Link href="/account">MY ACCOUNT</Link>
          <Link href="/cart">CART</Link>
        </div>
      </section>

      <DreamzyFooter />

<style jsx>{`.policy-page {
          min-height: 100vh;
          background: #faf6f1;
          color: #542f35;
          font-family: Arial, Helvetica, sans-serif;
        }

        .policy-hero {
          text-align: center;
          padding: 68px 25px 45px;
        }

        .eyebrow {
          color: #987276;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        h1 {
          margin: 12px 0 10px;
          font-family: Georgia, serif;
          font-size: 48px;
          font-weight: 400;
        }

        .policy-hero p {
          margin: 0;
          color: #765b5e;
          font-size: 15px;
        }

        .effective {
          margin-top: 12px;
          color: #987276;
          font-size: 11px;
        }

        .policy-content {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px 25px 90px;
        }

        .intro,
        .policy-section,
        .policy-note {
          background: #fffdfb;
          border: 1px solid #eadfd8;
          padding: 30px 34px;
          margin-bottom: 18px;
        }

        .intro {
          font-size: 15px;
          line-height: 1.8;
          color: #62484c;
        }

        .intro p:last-child {
          margin-bottom: 0;
        }

        .policy-section h2 {
          margin: 0 0 17px;
          font-family: Georgia, serif;
          font-size: 25px;
          font-weight: 400;
          color: #542f35;
        }

        .policy-body {
          color: #62484c;
          font-size: 14px;
          line-height: 1.8;
        }

        .policy-body p {
          margin: 0 0 14px;
        }

        .policy-body p:last-child {
          margin-bottom: 0;
        }

        .policy-body ul {
          margin: 0;
          padding-left: 22px;
        }

        .policy-body li {
          margin-bottom: 8px;
        }

        .contact-box {
          margin-top: 15px;
          padding: 18px;
          background: #faf6f1;
          border: 1px solid #eadfd8;
          line-height: 1.8;
        }

        .contact-box a {
          color: #542f35;
          font-weight: 700;
        }

        .policy-note {
          color: #765b5e;
          font-size: 12px;
          line-height: 1.7;
          background: #fbefec;
          border-color: #e3c9c2;
        }

        .policy-links {
          display: flex;
          justify-content: center;
          gap: 22px;
          flex-wrap: wrap;
          margin-top: 30px;
        }

        .policy-links a {
          color: #542f35;
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        @media (max-width: 700px) {

          .policy-hero {
            padding: 48px 20px 32px;
          }

          h1 {
            font-size: 38px;
          }

          .policy-content {
            padding: 15px 15px 60px;
          }

          .intro,
          .policy-section,
          .policy-note {
            padding: 23px 20px;
          }

          .policy-section h2 {
            font-size: 22px;
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

          .cart-section {
            padding: 50px 18px 70px !important;
          }

          .cart-title {
            font-size: 46px !important;
            line-height: 1.05 !important;
            margin-bottom: 38px !important;
          }

          .cart-layout {
            grid-template-columns: 1fr !important;
            gap: 35px !important;
          }

          .cart-item-row {
            grid-template-columns: 130px minmax(0, 1fr) !important;
            gap: 18px !important;
            padding-bottom: 24px !important;
            margin-bottom: 24px !important;
          }

          .cart-product-image {
            width: 130px !important;
            height: 160px !important;
          }

          .cart-item-info {
            min-width: 0;
          }

          .cart-item-info button:first-child {
            right: 0 !important;
            top: 0 !important;
          }

          .cart-item-info h2 {
            font-size: 22px !important;
            line-height: 1.15 !important;
            padding-right: 55px !important;
          }

          .cart-summary {
            position: static !important;
            padding: 24px !important;
            width: 100% !important;
          }
        }

        @media (max-width: 560px) {
          .cart-header {
            padding: 0 16px !important;
          }

          .cart-mobile-logo {
            font-size: 19px !important;
          }

          .cart-section {
            padding: 42px 16px 60px !important;
          }

          .cart-title {
            font-size: 42px !important;
            margin-top: 10px !important;
            margin-bottom: 34px !important;
          }

          .cart-item-row {
            grid-template-columns: 105px minmax(0, 1fr) !important;
            gap: 14px !important;
          }

          .cart-product-image {
            width: 105px !important;
            height: 135px !important;
          }

          .cart-item-info h2 {
            font-size: 20px !important;
            line-height: 1.12 !important;
            padding-right: 45px !important;
          }

          .cart-item-info .cart-quantity-placeholder {
            width: 110px !important;
          }

          .cart-summary {
            padding: 20px !important;
          }

          .cart-summary h2 {
            font-size: 23px !important;
          }
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
