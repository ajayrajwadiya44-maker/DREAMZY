"use client";

import Link from "next/link";

export default function DreamzyFooter() {
  return (
    <footer className="dreamzy-shared-footer">
      <div className="dreamzy-shared-inner">
        <div className="dreamzy-shared-top">
          <div className="dreamzy-shared-logo-wrap">
            <img src="/dreamzy-logo.png" alt="DREAMZY Nightwear" />
          </div>

          <div className="dreamzy-shared-brand">
            <div className="dreamzy-shared-wordmark">DREAMZY</div>
            <p>Premium nightwear for beautiful nights.</p>
            <div className="dreamzy-shared-rule" />
            <small>
              Comfortable. Stylish. Thoughtfully made for you and your little
              ones.
            </small>

            <div className="dreamzy-shared-shop">
              <Link href="/women">♀ Women</Link>
              <Link href="/kids">♧ Kids</Link>
              <Link href="/wishlist">♡ Wishlist</Link>
              <Link href="/cart">🛒 Cart</Link>
              <Link href="/account">♙ Account</Link>
            </div>
          </div>

          <div className="dreamzy-shared-links">
            <div>QUICK LINKS</div>
            <Link href="/privacy-policy">Privacy Policy <span>›</span></Link>
            <Link href="/terms-conditions">Terms &amp; Conditions <span>›</span></Link>
            <Link href="/shipping-policy">Shipping Policy <span>›</span></Link>
            <Link href="/return-refund-policy">Return &amp; Refund <span>›</span></Link>
            <Link href="/cancellation-policy">Cancellation Policy <span>›</span></Link>
            <Link href="/contact">Contact Us <span>›</span></Link>
          </div>

          <div className="dreamzy-shared-social">
            <div>FOLLOW US</div>
            <div className="dreamzy-shared-social-row">
              <a href="https://www.instagram.com/dreamzy_in/" target="_blank" rel="noreferrer" aria-label="Instagram">◎</a>
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="YouTube">▶</a>
              <a href="#" aria-label="Pinterest">p</a>
            </div>
          </div>
        </div>

        <div className="dreamzy-shared-bottom">
          <span>© 2026 DREAMZY. All Rights Reserved.</span>
          <span>♥ Designed for Sweeter Tomorrows</span>
        </div>
      </div>

      <style jsx>{`
        .dreamzy-shared-footer {
          width: 100%;
          background: #542f35;
          color: #fff8f4;
          padding: 55px 42px 24px;
          box-sizing: border-box;
        }
        .dreamzy-shared-inner {
          width: min(1380px, 100%);
          margin: 0 auto;
        }
        .dreamzy-shared-top {
          display: grid;
          grid-template-columns: 1.05fr 1.15fr 0.85fr 0.55fr;
          gap: 42px;
          align-items: center;
          padding-bottom: 44px;
        }
        .dreamzy-shared-logo-wrap {
          background: #fffaf6;
          padding: 14px;
          width: 100%;
          max-width: 390px;
          box-sizing: border-box;
        }
        .dreamzy-shared-logo-wrap img {
          display: block;
          width: 100%;
          height: auto;
          max-height: 310px;
          object-fit: contain;
        }
        .dreamzy-shared-wordmark {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 40px;
          letter-spacing: 2px;
          line-height: 1;
        }
        .dreamzy-shared-brand p {
          margin: 15px 0 0;
          font-size: 17px;
          line-height: 1.5;
        }
        .dreamzy-shared-rule {
          width: 78px;
          height: 1px;
          background: rgba(255, 221, 216, 0.75);
          margin: 25px 0 21px;
        }
        .dreamzy-shared-brand small {
          display: block;
          max-width: 390px;
          color: #ead8d5;
          font-size: 14px;
          line-height: 1.7;
        }
        .dreamzy-shared-shop {
          display: flex;
          flex-wrap: wrap;
          gap: 17px 24px;
          margin-top: 25px;
        }
        .dreamzy-shared-shop a,
        .dreamzy-shared-links a {
          color: #fff8f4;
          text-decoration: none;
          font-size: 12px;
        }
        .dreamzy-shared-links {
          border-left: 1px solid rgba(255, 220, 215, 0.34);
          padding-left: 28px;
          display: flex;
          flex-direction: column;
        }
        .dreamzy-shared-links > div,
        .dreamzy-shared-social > div:first-child {
          color: #f2cfca;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 4px;
          margin-bottom: 14px;
        }
        .dreamzy-shared-links a {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 8px 0;
        }
        .dreamzy-shared-links span {
          color: #eab8b2;
          font-size: 18px;
        }
        .dreamzy-shared-social {
          border-left: 1px solid rgba(255, 220, 215, 0.34);
          padding-left: 28px;
          align-self: stretch;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .dreamzy-shared-social-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .dreamzy-shared-social-row a {
          width: 44px;
          height: 44px;
          border: 1px solid rgba(244, 190, 184, 0.85);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff8f4;
          text-decoration: none;
          font-weight: 600;
          font-size: 18px;
        }
        .dreamzy-shared-bottom {
          border-top: 1px solid rgba(255, 220, 215, 0.34);
          padding-top: 22px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: #d8c3c0;
          font-size: 11px;
        }

        @media (max-width: 1050px) {
          .dreamzy-shared-top {
            grid-template-columns: 1fr 1fr;
          }
          .dreamzy-shared-links,
          .dreamzy-shared-social {
            border-left: 0;
            border-top: 1px solid rgba(255, 220, 215, 0.34);
            padding: 25px 0 0;
          }
        }

        @media (max-width: 650px) {
          .dreamzy-shared-footer {
            padding: 38px 18px 22px;
          }
          .dreamzy-shared-top {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .dreamzy-shared-logo-wrap {
            width: min(100%, 330px);
            justify-self: center;
          }
          .dreamzy-shared-brand {
            text-align: center;
          }
          .dreamzy-shared-rule {
            margin-left: auto;
            margin-right: auto;
          }
          .dreamzy-shared-shop {
            justify-content: center;
          }
          .dreamzy-shared-links,
          .dreamzy-shared-social {
            padding-top: 24px;
          }
          .dreamzy-shared-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
