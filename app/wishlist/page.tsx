"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type WishItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  sizes?: string[];
  stock?: number;
  sizeStock?: Record<string, number>;
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  function loadWishlist() {
    try {
      const raw = window.localStorage.getItem("dreamzy-wishlist");
      const parsed = raw ? JSON.parse(raw) : [];
      const wishlistItems: WishItem[] = Array.isArray(parsed) ? parsed.map((item: any) => ({
        ...item,
        sizes: Array.isArray(item.sizes) && item.sizes.length ? item.sizes : ["S", "M", "L", "XL"],
      })) : [];
      setItems(wishlistItems);
      setSelectedSizes((current) => {
        const next = { ...current };
        wishlistItems.forEach((item) => {
          if (!next[item.id] || !item.sizes?.includes(next[item.id])) {
            const available = (item.sizes || ["S", "M", "L", "XL"]).find((size) => {
              const stock = item.sizeStock?.[size] ?? item.stock;
              return stock === undefined || Number(stock) > 0;
            });
            next[item.id] = available || item.sizes?.[0] || "M";
          }
        });
        return next;
      });
    } catch {
      setItems([]);
    }
  }

  useEffect(() => {
    loadWishlist();
    window.addEventListener("dreamzy-wishlist-updated", loadWishlist);
    window.addEventListener("focus", loadWishlist);

    return () => {
      window.removeEventListener("dreamzy-wishlist-updated", loadWishlist);
      window.removeEventListener("focus", loadWishlist);
    };
  }, []);


  function logout() {
    window.localStorage.removeItem("dreamzy-account");
    window.dispatchEvent(new Event("dreamzy-account-updated"));
    setAccountOpen(false);
    setMenuOpen(false);
    window.location.href = "/";
  }

  function removeItem(id: string) {
    const next = items.filter((item) => item.id !== id);
    setItems(next);
    window.localStorage.setItem("dreamzy-wishlist", JSON.stringify(next));
    window.dispatchEvent(new Event("dreamzy-wishlist-updated"));
  }

  function addToCart(item: WishItem) {
    let cart: any[] = [];

    try {
      const raw = window.localStorage.getItem("dreamzy-cart");
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) cart = parsed;
    } catch {
      cart = [];
    }

    const size = selectedSizes[item.id] || item.sizes?.[0] || "M";
    const availableStock = item.sizeStock?.[size] ?? item.stock;
    if (availableStock !== undefined && Number(availableStock) <= Number(cart.find((x) => x.id === `${item.id}-${size}`)?.quantity || 0)) {
      window.alert(`Size ${size} is out of stock.`);
      return;
    }
    const cartId = `${item.id}-${size}`;
    const existing = cart.find((x) => x.id === cartId);

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({
        id: cartId,
        productId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        size,
        quantity: 1,
      });
    }

    window.localStorage.setItem("dreamzy-cart", JSON.stringify(cart));
    window.location.href = "/cart";
  }

  return (
    <main style={{ minHeight: "100vh", background: "#faf6f1", color: "#542f35", fontFamily: "Arial, sans-serif" }}>
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
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setAccountOpen((open) => !open);
              }}
            >
              <span>ACCOUNT</span>
              <span aria-hidden="true">{accountOpen ? "⌃" : "⌄"}</span>
            </button>

            {accountOpen && (
              <div className="mobile-account-dropdown">
                <Link href="/account" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>My Account</Link>
                <Link href="/my-orders" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>My Orders</Link>
                <Link href="/account#addresses" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>My Addresses</Link>
                <Link href="/wishlist" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>Wishlist</Link>
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

      <section className="wishlist-section" style={{ maxWidth: 1200, margin: "0 auto", padding: "70px 28px 100px" }}>
        <div style={{ textAlign: "center", marginBottom: 45 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#987276", fontWeight: 700 }}>YOUR SAVED STYLES</div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 50, fontWeight: 400, margin: "12px 0" }}>Wishlist ♡</h1>
          <p style={{ color: "#765b5e" }}>{items.length} saved {items.length === 1 ? "item" : "items"}</p>
        </div>

        {items.length === 0 ? (
          <div style={{ background: "#fffdfb", border: "1px solid #eadfd8", textAlign: "center", padding: "70px 25px" }}>
            <div style={{ fontSize: 45 }}>♡</div>
            <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 30 }}>Your wishlist is empty</h2>
            <p style={{ color: "#765b5e" }}>Save your favorite DREAMZY styles and come back to them anytime.</p>
            <Link href="/women" style={{ display: "inline-block", marginTop: 20, background: "#542f35", color: "#fff", textDecoration: "none", padding: "15px 25px", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>
              SHOP WOMEN
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 25 }}>
            {items.map((item) => (
              <article key={item.id} className="wishlist-card" style={{ background: "#fffdfb", border: "1px solid #eadfd8" }}>
                <div style={{ height: 360, position: "relative", background: "#eee5df" }}>
                  <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <button type="button" onClick={() => removeItem(item.id)} style={{ position: "absolute", top: 14, right: 14, width: 38, height: 38, borderRadius: "50%", border: "1px solid #ddceca", background: "#fffdfb", color: "#542f35", cursor: "pointer", fontSize: 19 }}>
                    ♥
                  </button>
                </div>
                <div style={{ padding: 22 }}>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 21, marginBottom: 8 }}>{item.name}</div>
                  <div style={{ fontWeight: 700, marginBottom: 14 }}>₹{Number(item.price).toLocaleString("en-IN")}</div>
                  <div style={{ fontSize: 10, letterSpacing: 1.2, fontWeight: 700, color: "#987276", marginBottom: 8 }}>SELECT SIZE</div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                    {(item.sizes?.length ? item.sizes : ["S", "M", "L", "XL"]).map((size) => {
                      const stock = item.sizeStock?.[size] ?? item.stock;
                      const outOfStock = stock !== undefined && Number(stock) <= 0;
                      const selected = (selectedSizes[item.id] || item.sizes?.[0] || "M") === size;
                      return (
                        <button key={size} type="button" disabled={outOfStock} onClick={() => setSelectedSizes((current) => ({ ...current, [item.id]: size }))} aria-pressed={selected}
                          title={outOfStock ? `${size} is out of stock` : `Select size ${size}`}
                          style={{ minWidth: 38, height: 34, padding: "0 9px", border: `1px solid ${selected ? "#542f35" : "#ddceca"}`, background: outOfStock ? "#eee8e4" : selected ? "#542f35" : "#fffdfb", color: outOfStock ? "#a99b97" : selected ? "#fff" : "#542f35", cursor: outOfStock ? "not-allowed" : "pointer", textDecoration: outOfStock ? "line-through" : "none", fontSize: 12 }}>
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  <button type="button" onClick={() => addToCart(item)} disabled={(() => { const size = selectedSizes[item.id] || item.sizes?.[0] || "M"; const stock = item.sizeStock?.[size] ?? item.stock; return stock !== undefined && Number(stock) <= 0; })()} style={{ width: "100%", height: 48, border: 0, background: "#542f35", color: "#fff", cursor: "pointer", fontWeight: 700, letterSpacing: 1, opacity: (() => { const size = selectedSizes[item.id] || item.sizes?.[0] || "M"; const stock = item.sizeStock?.[size] ?? item.stock; return stock !== undefined && Number(stock) <= 0 ? 0.5 : 1; })() }}>
                    ADD TO CART
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
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

      {categoriesOpen && (
        <div className="mobile-category-backdrop" onClick={() => setCategoriesOpen(false)}>
          <div className="mobile-category-choice" role="dialog" aria-label="Choose a collection" onClick={(event) => event.stopPropagation()}>
            <div className="mobile-category-choice-heading">Choose a Collection</div>
            <Link href="/women" onClick={() => setCategoriesOpen(false)}>Women&apos;s Collection <span aria-hidden="true">›</span></Link>
            <Link href="/kids" onClick={() => setCategoriesOpen(false)}>Kids Collection <span aria-hidden="true">›</span></Link>
          </div>
        </div>
      )}

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          overflow-x: hidden;
          background: #faf6f1;
        }

        .home-page {
          min-height: 100vh;
          background: #faf6f1;
          color: #542f35;
          font-family: Arial, sans-serif;
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

        .mobile-account-menu,
        .mobile-account-dropdown {
          display: none;
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

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(430px, 0.92fr);
          min-height: 650px;
          background: #faf6f1;
        }

        .hero-image {
          min-width: 0;
          background: #eadbd5;
        }

        .hero-image img {
          width: 100%;
          height: 650px;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .hero-content {
          min-width: 0;
          max-width: 700px;
          padding: 70px 56px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #faf6f1;
        }

        .eyebrow {
          font-size: 11px;
          letter-spacing: 3px;
          color: #a15b63;
          font-weight: 700;
        }

        .hero-content h1 {
          font-family: Georgia, serif;
          font-size: clamp(52px, 5vw, 72px);
          line-height: 1.02;
          font-weight: 400;
          margin: 24px 0;
        }

        .hero-content p {
          color: #765b5e;
          line-height: 1.8;
          max-width: 480px;
          margin: 0;
        }

        .hero-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 25px;
        }

        .primary-button,
        .secondary-button {
          text-decoration: none;
          padding: 15px 24px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .primary-button {
          background: #542f35;
          color: #fff;
        }

        .secondary-button {
          border: 1px solid #542f35;
          color: #542f35;
        }

        .products-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 85px 36px;
        }

        .section-heading {
          text-align: center;
          margin-bottom: 38px;
        }

        .section-heading h2,
        .kids-intro h2,
        .about-section h2 {
          font-family: Georgia, serif;
          font-weight: 400;
          margin: 12px 0;
        }

        .section-heading h2 {
          font-size: 44px;
        }

        .section-heading p,
        .kids-intro p,
        .about-section p {
          color: #765b5e;
          line-height: 1.8;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .product-card {
          display: block;
          text-decoration: none;
          color: #542f35;
          background: #fffdfb;
          border: 1px solid #eadfd8;
          min-width: 0;
        }

        .product-image {
          height: 440px;
          position: relative;
          background: #eee5df;
          overflow: hidden;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .tag,
        .heart {
          position: absolute;
          background: #fffdfb;
        }

        .tag {
          top: 14px;
          left: 14px;
          padding: 8px 11px;
          font-size: 10px;
          letter-spacing: 1.5px;
        }

        .heart {
          position: absolute !important;
          top: 14px !important;
          right: 14px !important;
          left: auto !important;
          bottom: auto !important;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          z-index: 5;
        }

        .product-info {
          padding: 22px 20px 25px;
        }

        .product-info-main {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }

        .product-info-copy {
          min-width: 0;
        }

        .product-rating {
          flex: 0 0 auto;
          text-align: right;
          padding-top: 2px;
          white-space: nowrap;
        }

        .product-rating-stars {
          display: flex;
          justify-content: flex-end;
          gap: 2px;
          font-size: 13px;
          line-height: 1.2;
          letter-spacing: 1px;
        }

        .product-rating-stars .filled {
          color: #a46a45;
        }

        .product-rating-stars .empty {
          color: #d8c8c3;
        }

        .product-rating-count {
          margin-top: 4px;
          color: #765b5e;
          font-size: 10px;
          line-height: 1.4;
        }

        .product-name {
          font-family: Georgia, serif;
          font-size: 21px;
          line-height: 1.3;
          margin-bottom: 9px;
        }

        .price {
          font-weight: 700;
          font-size: 16px;
        }

        .view-all {
          text-align: center;
          margin-top: 35px;
        }

        .view-all a {
          color: #542f35;
          text-decoration: none;
          border-bottom: 1px solid #542f35;
          padding-bottom: 5px;
          font-size: 11px;
          letter-spacing: 1.5px;
        }

        .kids-intro {
          padding: 80px 30px;
          background: #f1e6e0;
          text-align: center;
        }

        .kids-intro h2 {
          font-size: 42px;
        }

        .kids-intro a {
          display: inline-block;
          margin-top: 20px;
          color: #542f35;
          text-decoration: none;
          border-bottom: 1px solid #542f35;
          padding-bottom: 5px;
          font-size: 12px;
          letter-spacing: 1.5px;
        }

        .kids-products {
          background: #fffdfb;
        }

        .about-section {
          max-width: 850px;
          margin: 0 auto;
          padding: 100px 30px;
          text-align: center;
        }

        .about-section h2 {
          font-size: 44px;
        }

        .footer-brand {
          display: flex;
          justify-content: center;
          align-items: center;
          background: #faf6f1;
          width: min(360px, 88vw);
          margin: 0 auto 34px;
          padding: 18px;
          box-sizing: border-box;
        }

        .footer-brand img {
          width: 100%;
          max-width: 300px;
          height: auto;
          display: block;
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
            padding: 10px 18px 16px;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            box-shadow: 0 8px 20px rgba(84, 47, 53, 0.08);
            z-index: 100;
          }

          .nav.open {
            display: flex !important;
          }

          .mobile-account-menu {
            display: block;
          }

          .mobile-account-button,
          .mobile-account-dropdown a,
          .mobile-account-logout {
            width: 100%;
            box-sizing: border-box;
            border: 0;
            background: transparent;
            color: #542f35;
            text-decoration: none;
            font: inherit;
            text-align: left;
            cursor: pointer;
          }

          .mobile-account-button {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 4px !important;
            border-bottom: 1px solid #f0e7e2;
            font-size: 12px !important;
            letter-spacing: 1.2px !important;
          }

          .mobile-account-dropdown {
            display: block;
            padding: 0 0 4px;
          }

          .mobile-account-dropdown a,
          .mobile-account-logout {
            display: block;
            padding: 11px 18px !important;
            border-bottom: 1px solid #f0e7e2;
            font-size: 12px !important;
            letter-spacing: 1px !important;
          }

          .mobile-account-logout {
            color: #542f35;
          }

          .nav a,
          .nav button {
            width: 100%;
            padding: 14px 4px !important;
            border-bottom: 1px solid #f0e7e2;
            font-size: 12px !important;
            letter-spacing: 1.2px !important;
            text-align: left;
          }

          .nav a:last-of-type {
            border-bottom: 1px solid #f0e7e2;
          }

          .hero {
            width: 100%;
            max-width: 100%;
            display: flex;
            flex-direction: column;
            min-height: auto;
          }

          .hero-image {
            order: 1;
            width: 100%;
            min-width: 0;
          }

          .hero-image img {
            width: 100%;
            height: min(92vw, 520px);
            min-height: 320px;
            object-fit: cover;
            object-position: center;
          }

          .hero-content {
            order: 2;
            width: 100%;
            padding: 52px 24px 46px;
            text-align: center;
            align-items: center;
          }

          .hero-content .eyebrow {
            font-size: 9px;
            letter-spacing: 2.5px;
          }

          .hero-content h1 {
            max-width: 520px;
            font-size: clamp(44px, 11vw, 62px);
            line-height: 1.02;
            margin: 18px 0;
          }

          .hero-content p {
            max-width: 520px;
            font-size: 14px;
            line-height: 1.7;
          }

          .hero-buttons {
            width: 100%;
            max-width: 420px;
            justify-content: center;
          }

          .primary-button,
          .secondary-button {
            text-align: center;
            flex: 1 1 0;
            min-width: 140px;
          }

          .products-section {
            width: 100%;
            max-width: 100%;
            margin: 0;
            padding: 64px 20px;
          }

          .kids-products {
            padding-top: 64px;
          }

          .section-heading {
            margin-bottom: 30px;
          }

          .section-heading h2,
          .about-section h2 {
            font-size: clamp(32px, 8vw, 40px);
            line-height: 1.15;
          }

          .section-heading p {
            font-size: 14px;
            margin-left: auto;
            margin-right: auto;
            max-width: 430px;
          }

          .product-grid {
            width: 100%;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .product-card {
            width: 100%;
            min-width: 0;
          }

          .product-image {
            height: auto;
            aspect-ratio: 0.82;
          }

          .product-info {
            padding: 15px 14px 18px;
          }

          .product-name {
            font-size: 16px;
            line-height: 1.3;
          }

          .price {
            font-size: 14px;
          }

          .tag {
            top: 10px;
            left: 10px;
            padding: 6px 8px;
            font-size: 8px;
          }

          .heart {
            top: 10px !important;
            right: 10px !important;
            width: 32px;
            height: 32px;
            font-size: 17px;
          }

          .view-all {
            margin-top: 28px;
          }

          .about-section {
            width: 100%;
            max-width: 850px;
            padding: 76px 24px;
          }

          .about-section p {
            font-size: 14px;
          }

          .dreamzy-footer {
            width: 100%;
            padding: 42px 20px 24px;
          }

          .dreamzy-footer-top {
            grid-template-columns: 1fr;
            gap: 30px;
            padding-bottom: 32px;
          }

          .dreamzy-footer-logo-wrap {
            width: min(100%, 330px);
            max-width: 330px;
            justify-self: center;
          }

          .dreamzy-footer-brand {
            text-align: center;
          }

          .dreamzy-footer-wordmark {
            font-size: 34px;
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
            gap: 16px 20px;
          }

          .dreamzy-footer-links,
          .dreamzy-footer-follow {
            border-left: 0;
            border-top: 1px solid rgba(255, 220, 215, 0.34);
            padding: 25px 0 0;
          }

          .dreamzy-footer-links a {
            font-size: 12px;
          }

          .dreamzy-footer-social {
            justify-content: center;
          }

          .dreamzy-footer-bottom {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }
        }

        @media (max-width: 600px) {
          .header {
            height: 60px;
            padding: 0 14px;
          }

          .logo {
            font-size: 22px;
            letter-spacing: 2px;
          }

          .menu-button {
            width: 34px;
            height: 34px;
          }

          .nav {
            top: 60px;
          }

          .hero-image img {
            height: 88vw;
            min-height: 300px;
            max-height: 440px;
          }

          .hero-content {
            padding: 44px 20px 40px;
          }

          .hero-content h1 {
            font-size: clamp(42px, 12vw, 54px);
            margin: 17px 0;
          }

          .hero-buttons {
            flex-direction: column;
            max-width: 360px;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
            flex: none;
          }

          .products-section {
            padding: 54px 14px;
          }

          .product-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .product-image {
            aspect-ratio: 0.88;
          }

          .product-name {
            font-size: 17px;
          }

          .price {
            font-size: 14px;
          }

          .section-heading {
            margin-bottom: 26px;
          }

          .section-heading h2,
          .about-section h2 {
            font-size: 32px;
          }

          .about-section {
            padding: 66px 20px;
          }

          .dreamzy-footer {
            padding: 38px 16px 22px;
          }

          .dreamzy-footer-logo-wrap {
            width: min(100%, 300px);
          }

          .dreamzy-footer-shop-links {
            gap: 14px 18px;
          }

          .dreamzy-footer-shop-links a {
            font-size: 11px;
          }

          .dreamzy-footer-bottom {
            font-size: 10px;
          }
        }

        /* Approved Women mobile treatment applied to Wishlist only. Desktop unchanged. */
        .mobile-bottom-nav { display: none; }

        @media (max-width: 600px) {
          .mobile-bottom-nav {
            position: fixed; left: 3%; right: 3%; bottom: max(8px, env(safe-area-inset-bottom));
            z-index: 999; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr));
            align-items: stretch; min-height: 62px; padding: 5px 4px;
            border: 1px solid rgba(84, 47, 53, 0.18); border-radius: 40px;
            background: rgba(255, 253, 251, 0.96); box-shadow: 0 5px 24px rgba(55, 35, 38, 0.18);
            backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          }
          .mobile-bottom-nav-item {
            display: flex; min-width: 0; flex-direction: column; align-items: center; justify-content: center;
            gap: 3px; border-radius: 28px; color: #292629; text-decoration: none;
            font-size: 10px; line-height: 1.05; padding: 3px 1px;
          }
          .mobile-bottom-nav-item svg {
            width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 1.8;
            stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0;
          }
          .mobile-bottom-nav-button { appearance: none; -webkit-appearance: none; border: 0; background: transparent; font-family: inherit; cursor: pointer; }
          .mobile-category-backdrop {
            position: fixed; inset: 0; z-index: 1000; display: flex; align-items: flex-end; justify-content: center;
            padding: 0 14px calc(78px + env(safe-area-inset-bottom)); background: rgba(28, 19, 21, 0.22);
          }
          .mobile-category-choice {
            width: min(100%, 360px); padding: 16px; border: 1px solid rgba(84, 47, 53, 0.16);
            border-radius: 18px; background: #fffdfb; box-shadow: 0 10px 32px rgba(35, 20, 23, 0.2);
          }
          .mobile-category-choice-heading { margin: 0 0 10px; color: #542f35; font-size: 11px; font-weight: 600; letter-spacing: .16em; text-align: center; text-transform: uppercase; }
          .mobile-category-choice a { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 10px; border-top: 1px solid #eadfda; color: #542f35; font-size: 14px; text-decoration: none; }
          .mobile-category-choice a span { font-size: 22px; line-height: 1; }

          .wishlist-section {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            padding: 34px 10px 36px !important;
          }

          .wishlist-section > div:first-child {
            margin-bottom: 24px !important;
          }

          .wishlist-section > div:first-child > div {
            font-size: 9px !important;
            letter-spacing: 2px !important;
          }

          .wishlist-section h1 {
            font-size: 32px !important;
            line-height: 1.15 !important;
            margin: 9px 0 !important;
          }

          .wishlist-section > div:first-child > p {
            font-size: 12px !important;
          }

          .wishlist-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 12px !important;
            align-items: stretch !important;
          }

          .wishlist-card {
            display: flex !important;
            flex-direction: column !important;
            min-width: 0 !important;
            height: 100% !important;
            overflow: hidden !important;
          }

          .wishlist-card > div:first-child {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 0.82 !important;
            min-height: 0 !important;
            flex: 0 0 auto !important;
          }

          .wishlist-card > div:first-child img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }

          .wishlist-card > div:first-child button {
            top: 7px !important;
            right: 7px !important;
            width: 32px !important;
            height: 32px !important;
            line-height: 30px !important;
            font-size: 17px !important;
          }

          .wishlist-card > div:nth-child(2) {
            display: flex !important;
            flex: 1 1 auto !important;
            flex-direction: column !important;
            min-width: 0 !important;
            padding: 10px 8px 9px !important;
          }

          .wishlist-card > div:nth-child(2) > div:first-child {
            font-size: 14px !important;
            line-height: 1.35 !important;
            margin-bottom: 7px !important;
            overflow-wrap: anywhere !important;
          }

          .wishlist-card > div:nth-child(2) > div:nth-child(2) {
            font-size: 12px !important;
            margin-bottom: 10px !important;
          }

          .wishlist-card > div:nth-child(2) > div:nth-child(3) {
            margin-top: 0 !important;
            margin-bottom: 10px !important;
          }

          .wishlist-card > div:nth-child(2) > div:nth-child(3) > div:first-child {
            font-size: 9px !important;
            margin-bottom: 6px !important;
          }

          .wishlist-card > div:nth-child(2) > div:nth-child(3) > div:last-child {
            gap: 5px !important;
          }

          .wishlist-card button[aria-pressed] {
            min-width: 27px !important;
            height: 28px !important;
            padding: 0 5px !important;
            font-size: 10px !important;
          }

          .wishlist-card > div:nth-child(2) > button:last-child {
            width: 100% !important;
            min-height: 36px !important;
            height: auto !important;
            padding: 9px 4px !important;
            margin-top: auto !important;
            font-size: 9px !important;
            line-height: 1.3 !important;
            letter-spacing: .45px !important;
            overflow-wrap: anywhere !important;
          }

          .wishlist-section > div:first-child + div:not(.wishlist-grid) {
            padding: 36px 16px !important;
          }

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
    </main>
  );
}

const nav = {
  color: "#542f35",
  textDecoration: "none",
  fontSize: 12,
  letterSpacing: 1,
};
