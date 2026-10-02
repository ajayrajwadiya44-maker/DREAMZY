"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  category: "Women" | "Kids";
  image: string;
  sizes: string[];
  sizeStock?: Record<string, number>;
  tag: string;
  stock: number;
  active: boolean;
};

type Review = {
  id: string;
  productId?: string;
  productName?: string;
  rating: number;
  visible?: boolean;
};

const fallbackWomen: Product[] = [
  { id: "101", name: "Floral Dream Pajama Set", price: 1499, category: "Women", image: "/women-1.jpg", sizes: ["S","M","L","XL"], tag: "NEW", stock: 20, active: true },
  { id: "102", name: "Lavender Comfort Nightdress", price: 1299, category: "Women", image: "/women-2.jpg", sizes: ["S","M","L","XL"], tag: "BESTSELLER", stock: 20, active: true },
  { id: "103", name: "Blossom Nightwear Set", price: 1599, category: "Women", image: "/women-3.jpg", sizes: ["S","M","L","XL"], tag: "NEW", stock: 20, active: true },
];

const fallbackKids: Product[] = [
  { id: "201", name: "Little Dreamer Pajama Set", price: 999, category: "Kids", image: "/kids-1.jpg", sizes: ["2-3Y","4-5Y","6-7Y","8-9Y","10-11Y"], tag: "NEW", stock: 20, active: true },
  { id: "202", name: "Sweet Dreams Nightdress", price: 899, category: "Kids", image: "/kids-2.jpg", sizes: ["2-3Y","4-5Y","6-7Y","8-9Y","10-11Y"], tag: "BESTSELLER", stock: 20, active: true },
  { id: "203", name: "Moonlight Kids Nightwear", price: 1099, category: "Kids", image: "/kids-3.jpg", sizes: ["2-3Y","4-5Y","6-7Y","8-9Y","10-11Y"], tag: "NEW", stock: 20, active: true },
];

export default function HomePage() {
  const [women, setWomen] = useState<Product[]>(fallbackWomen);
  const [kids, setKids] = useState<Product[]>(fallbackKids);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [cartMessage, setCartMessage] = useState<{ productId: string; text: string } | null>(null);

  function loadReviews() {
    try {
      const raw = JSON.parse(window.localStorage.getItem("dreamzy-reviews") || "[]");
      setReviews(
        Array.isArray(raw)
          ? raw.map((review: Review) => ({
              ...review,
              visible: review.visible !== false,
            }))
          : []
      );
    } catch {
      setReviews([]);
    }
  }

  function getProductRating(productId: string, productName: string) {
    const normalizeName = (value: string | undefined) =>
      String(value || "").trim().toLowerCase().replace(/\s+/g, " ");

    const targetName = normalizeName(productName);
    const visibleReviews = reviews.filter((review) => {
      if (review.visible === false) return false;

      const sameId =
        review.productId !== undefined &&
        String(review.productId) === String(productId);
      const sameName =
        targetName !== "" && normalizeName(review.productName) === targetName;

      return sameId || sameName;
    });

    if (visibleReviews.length === 0) return null;

    const average =
      visibleReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
      visibleReviews.length;

    return { average, count: visibleReviews.length };
  }

  useEffect(() => {
    function loadCatalog() {
      try {
        const raw = window.localStorage.getItem("dreamzy-products");

        if (raw) {
          const saved = JSON.parse(raw);

          if (Array.isArray(saved)) {
            const activeWomen = saved.filter(
              (p: Product) => p.category === "Women" && p.active !== false
            );
            const activeKids = saved.filter(
              (p: Product) => p.category === "Kids" && p.active !== false
            );

            setWomen(activeWomen.length > 0 ? activeWomen.slice(0, 3) : fallbackWomen);
            setKids(activeKids.length > 0 ? activeKids.slice(0, 3) : fallbackKids);
            return;
          }
        }
      } catch (error) {
        console.error("DREAMZY catalog error:", error);
      }

      setWomen(fallbackWomen);
      setKids(fallbackKids);
    }

    function refreshAll() {
      loadCatalog();
      loadReviews();
    }

    refreshAll();
    window.addEventListener("focus", refreshAll);
    window.addEventListener("storage", refreshAll);
    window.addEventListener("dreamzy-products-updated", loadCatalog);
    window.addEventListener("dreamzy-reviews-updated", loadReviews);

    return () => {
      window.removeEventListener("focus", refreshAll);
      window.removeEventListener("storage", refreshAll);
      window.removeEventListener("dreamzy-products-updated", loadCatalog);
      window.removeEventListener("dreamzy-reviews-updated", loadReviews);
    };
  }, []);

  function logout() {
    localStorage.removeItem("dreamzy-account");
    window.dispatchEvent(new Event("dreamzy-account-updated"));
    setMenuOpen(false);
    window.location.href = "/";
  }

  const allProducts = [...women, ...kids];
  const taggedBestSellers = allProducts.filter((product) =>
    /best.?seller/i.test(String(product.tag || ""))
  );
  const bestSellers = (taggedBestSellers.length > 0 ? taggedBestSellers : allProducts).slice(0, 3);

  function getSelectedSize(product: Product) {
    const sizes = Array.isArray(product.sizes) ? product.sizes : [];
    const selected = selectedSizes[String(product.id)];
    if (selected && sizes.includes(selected) && Number(product.sizeStock?.[selected] ?? product.stock ?? 0) > 0) return selected;
    return sizes.find((size) => Number(product.sizeStock?.[size] ?? product.stock ?? 0) > 0) || sizes[0] || "M";
  }

  function addHomeProductToCart(product: Product) {
    const size = getSelectedSize(product);
    const available = Math.max(0, Number(product.sizeStock?.[size] ?? product.stock ?? 0));
    if (available <= 0) {
      setCartMessage({ productId: String(product.id), text: `Size ${size} is out of stock.` });
      return;
    }

    try {
      const current = JSON.parse(window.localStorage.getItem("dreamzy-cart") || "[]");
      const cart = Array.isArray(current) ? current : [];
      const id = `${product.id}-${size}`;
      const existing = cart.find((item: any) => String(item.id) === id);
      if (Number(existing?.quantity || 0) >= available) {
        setCartMessage({ productId: String(product.id), text: `Only ${available} available in size ${size}.` });
        return;
      }
      const next = existing
        ? cart.map((item: any) => String(item.id) === id ? { ...item, quantity: Number(item.quantity || 0) + 1 } : item)
        : [...cart, { id, productId: product.id, name: product.name, price: product.price, image: product.image, size, quantity: 1 }];
      window.localStorage.setItem("dreamzy-cart", JSON.stringify(next));
      window.location.href = "/cart";
    } catch {
      setCartMessage({ productId: String(product.id), text: "Could not add this item to your cart. Please try again." });
    }
  }

  function renderHomeProductCard(product: Product, key: string) {
    const sizes = Array.isArray(product.sizes) ? product.sizes : [];
    const selectedSize = getSelectedSize(product);
    const rating = getProductRating(product.id, product.name);
    const average = rating?.average ?? 0;
    const count = rating?.count ?? 0;
    const availableForSelected = Number(product.sizeStock?.[selectedSize] ?? product.stock ?? 0);

    return (
      <article key={key} className="product-card">
        <Link href={`/product/${product.id}`} className="product-image product-image-link" aria-label={`View ${product.name}`}>
          <img src={product.image} alt={product.name} />
          <span className="tag">{product.tag}</span>
          <span className="heart" aria-hidden="true">♡</span>
        </Link>
        <div className="product-info">
          <div className="product-info-main">
            <div className="product-info-copy">
              <Link href={`/product/${product.id}`} className="product-name product-name-link">{product.name}</Link>
              <div className="price">₹{Number(product.price).toLocaleString("en-IN")}</div>
            </div>
            <div className="product-rating" aria-label={count > 0 ? `${average.toFixed(1)} out of 5 from ${count} reviews` : "No reviews yet"}>
              <div className="product-rating-stars">
                {Array.from({ length: 5 }, (_, index) => (
                  <span key={index} className={index < Math.round(average) && count > 0 ? "filled" : "empty"}>★</span>
                ))}
              </div>
              <div className="product-rating-count">
                {count > 0 ? `${average.toFixed(1)} · ${count} ${count === 1 ? "review" : "reviews"}` : "No reviews yet"}
              </div>
            </div>
          </div>
          <div className="home-size-label">SELECT SIZE</div>
          <div className="home-size-options" aria-label={`Choose size for ${product.name}`}>
            {sizes.map((size) => {
              const stock = Math.max(0, Number(product.sizeStock?.[size] ?? product.stock ?? 0));
              return (
                <button
                  key={size}
                  type="button"
                  className={`home-size-button ${selectedSize === size ? "selected" : ""}`}
                  disabled={stock <= 0}
                  title={stock <= 0 ? `${size} is out of stock` : `Select size ${size}`}
                  onClick={() => {
                    setSelectedSizes((current) => ({ ...current, [String(product.id)]: size }));
                    setCartMessage(null);
                  }}
                >
                  {size}
                </button>
              );
            })}
          </div>
          {cartMessage?.productId === String(product.id) && (
            <div className="home-cart-message" role="status">{cartMessage.text}</div>
          )}
          <button
            type="button"
            className="home-add-to-cart"
            disabled={availableForSelected <= 0}
            onClick={() => addHomeProductToCart(product)}
          >
            {availableForSelected > 0 ? "ADD TO CART" : "SOLD OUT"}
          </button>
        </div>
      </article>
    );
  }

  return (
    <main className="home-page">
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
          <a href="#new-arrivals" onClick={() => setMenuOpen(false)}>NEW ARRIVALS</a>
          <a href="#best-sellers" onClick={() => setMenuOpen(false)}>BEST SELLERS</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>ABOUT</a>
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

      <section className="hero">
        <div className="hero-image">
          <img src="/hero.png" alt="DREAMZY premium nightwear" />
        </div>

        <div className="hero-content">
          <div className="eyebrow">DREAMZY · PREMIUM NIGHTWEAR</div>

          <h1>
            Softer
            <br />
            Nights.
            <br />
            Brighter
            <br />
            Tomorrows.
          </h1>

          <p>
            Premium nightwear designed for comfort, softness and beautiful
            everyday moments.
          </p>

          <div className="hero-buttons">
            <Link href="/women" className="primary-button">SHOP WOMEN</Link>
            <Link href="/kids" className="secondary-button">SHOP KIDS</Link>
          </div>
        </div>
      </section>

      <section id="new-arrivals" className="products-section">
        <div className="section-heading">
          <div className="eyebrow">DREAMZY WOMEN</div>
          <h2>New Arrivals</h2>
          <p>Discover the latest styles from DREAMZY.</p>
        </div>

        <div className="product-grid">
          {women.map((product) => renderHomeProductCard(product, `new-${product.id}`))}
        </div>

        <div className="view-all">
          <Link href="/women">VIEW WOMEN COLLECTION</Link>
        </div>
      </section>

      <section id="best-sellers" className="products-section">
        <div className="section-heading">
          <div className="eyebrow">CUSTOMER FAVOURITES</div>
          <h2>Best Sellers</h2>
          <p>Discover the DREAMZY styles customers love.</p>
        </div>

        <div className="product-grid">
          {bestSellers.map((product) => renderHomeProductCard(product, `best-${product.id}`))}
        </div>
      </section>

      <section id="women-collection" className="products-section">
        <div className="section-heading">
          <div className="eyebrow">DREAMZY WOMEN</div>
          <h2>Women's Collection</h2>
          <p>Explore elegant and comfortable styles for women.</p>
        </div>

        <div className="product-grid">
          {women.map((product) => renderHomeProductCard(product, `women-${product.id}`))}
        </div>

        <div className="view-all">
          <Link href="/women">SHOP WOMEN COLLECTION</Link>
        </div>
      </section>

      <section id="kids-collection" className="products-section kids-products">
        <div className="section-heading">
          <div className="eyebrow">DREAMZY KIDS</div>
          <h2>Kids Collection</h2>
          <p>Soft, playful and comfortable nightwear for little dreamers.</p>
        </div>

        <div className="product-grid">
          {kids.map((product) => renderHomeProductCard(product, `kids-${product.id}`))}
        </div>

        <div className="view-all">
          <Link href="/kids">SHOP ALL KIDS</Link>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="eyebrow">THE DREAMZY PROMISE</div>
        <h2>Made for your most comfortable moments.</h2>
        <p>
          Thoughtfully selected nightwear with a soft, premium feel — designed
          to make every evening feel a little more special.
        </p>
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
              Women&apos;s Collection
              <span aria-hidden="true">›</span>
            </Link>
            <Link href="/kids" onClick={() => setCategoriesOpen(false)}>
              Kids Collection
              <span aria-hidden="true">›</span>
            </Link>
          </div>
        </div>
      )}

      <nav className="mobile-bottom-nav" aria-label="Mobile quick navigation">
          <Link href="/" className="mobile-bottom-nav-item active" aria-label="Home">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 10.8 12 3l9 7.8v9a1.2 1.2 0 0 1-1.2 1.2h-5.1v-6.4H9.3V21H4.2A1.2 1.2 0 0 1 3 19.8v-9Z" />
            </svg>
            <span>Home</span>
          </Link>
          <Link href="#best-sellers" className="mobile-bottom-nav-item" aria-label="Offers">
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
              <path d="M2.5 3h2.8l2.2 12.1a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.5L22 8H6" />
              <circle cx="10" cy="20" r="1.2" />
              <circle cx="18" cy="20" r="1.2" />
            </svg>
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
          overflow-x: hidden;
          background: #faf6f1;
        }

        .home-page {
          min-height: 100vh;
          background: #faf6f1;
          color: #542f35;
          font-family: Arial, sans-serif;
        }

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

          .mobile-bottom-nav-item.active {
            color: #542f35;
            background: #f2e7e7;
            font-weight: 600;
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
            letter-spacing: 0.16em;
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

        .product-image-link {
          display: block;
          color: inherit;
          text-decoration: none;
        }

        .product-name-link {
          display: block;
          color: inherit;
          text-decoration: none;
        }

        .home-size-label {
          margin-top: 15px;
          margin-bottom: 7px;
          font-size: 9px;
          letter-spacing: 1.4px;
          color: #765b5e;
        }

        .home-size-options {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .home-size-button {
          min-width: 32px;
          min-height: 30px;
          padding: 5px 8px;
          border: 1px solid #dfd0c9;
          background: #fffdfb;
          color: #542f35;
          font-size: 10px;
          cursor: pointer;
        }

        .home-size-button.selected {
          background: #542f35;
          border-color: #542f35;
          color: #fffdfb;
        }

        .home-size-button:disabled {
          color: #b8aaa5;
          background: #f3eeea;
          border-color: #e8dfda;
          text-decoration: line-through;
          cursor: not-allowed;
          opacity: 0.75;
        }

        .home-add-to-cart {
          width: 100%;
          margin-top: 12px;
          padding: 12px 10px;
          border: 1px solid #542f35;
          background: #542f35;
          color: #fffdfb;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
        }

        .home-add-to-cart:disabled {
          background: #b8aaa5;
          border-color: #b8aaa5;
          cursor: not-allowed;
        }

        .home-cart-message {
          margin-top: 8px;
          color: #9b3939;
          font-size: 11px;
          line-height: 1.4;
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

          .home-size-options {
            gap: 4px;
          }

          .home-size-button {
            min-width: 28px;
            padding: 5px 6px;
          }

          .home-add-to-cart {
            padding: 10px 6px;
            font-size: 10px;
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
            margin-top: 18px;
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

          /* Mobile hero: wording on the left, image on the right.
             These overrides are limited to screens up to 600px. */
          .hero {
            display: grid;
            grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
            grid-template-rows: minmax(300px, auto);
            min-height: 0;
            width: 100%;
            align-items: stretch;
          }

          .hero-content {
            order: 2;
            width: 100%;
            min-width: 0;
            padding: 18px 12px;
            align-items: flex-start;
            justify-content: center;
            text-align: left;
          }

          .hero-image {
            order: 1;
            width: 100%;
            min-width: 0;
            min-height: 300px;
            overflow: hidden;
            background: #ead8d0;
          }

          .hero-image img {
            display: block;
            width: 100%;
            height: 100%;
            min-height: 300px;
            max-height: 420px;
            aspect-ratio: auto;
            object-fit: cover;
            object-position: 78% center;
          }

          .hero-content .eyebrow {
            font-size: 6px;
            letter-spacing: 1px;
            line-height: 1.4;
          }

          .hero-content h1 {
            font-size: clamp(18px, 5.2vw, 26px);
            line-height: 1.02;
            margin: 10px 0 8px;
          }

          .hero-content p {
            font-size: 9px;
            line-height: 1.4;
          }

          .hero-buttons {
            width: 100%;
            max-width: none;
            margin-top: 10px;
            flex-direction: column;
            gap: 5px;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
            min-width: 0;
            flex: none;
            padding: 7px 4px;
            font-size: 7px;
            letter-spacing: 0.5px;
            text-align: center;
          }

          .products-section {
            padding: 24px 10px;
          }

          .product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
            align-items: stretch;
          }

          .product-card {
            display: flex;
            flex-direction: column;
            height: 100%;
            min-width: 0;
          }

          .product-image {
            width: 100%;
            height: auto;
            aspect-ratio: 0.88;
          }

          .product-info {
            display: flex;
            flex: 1;
            flex-direction: column;
            min-width: 0;
            padding: 9px 8px 10px;
          }

          .product-info-main {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 3px;
          }

          .product-info-copy {
            order: 1;
            width: 100%;
          }

          .product-rating {
            order: 0;
            text-align: left;
            padding-top: 0;
            white-space: normal;
          }

          .product-rating-stars {
            justify-content: flex-start;
            font-size: 11px;
            gap: 1px;
          }

          .product-rating-count {
            display: inline;
            margin-left: 4px;
            margin-top: 0;
            font-size: 9px;
          }

          .product-name {
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: 12px;
            line-height: 1.3;
            margin: 3px 0 4px;
            overflow-wrap: anywhere;
          }

          .price {
            font-size: 13px;
            line-height: 1.3;
          }

          .home-size-label {
            margin-top: 9px;
            margin-bottom: 5px;
            font-size: 8px;
            letter-spacing: 0.8px;
          }

          .home-size-options {
            display: flex;
            flex-wrap: nowrap;
            gap: 4px;
            width: 100%;
            margin-bottom: 8px;
          }

          .home-size-button {
            flex: 1 1 0;
            min-width: 0;
            min-height: 27px;
            padding: 4px 0;
            font-size: 9px;
          }

          .home-add-to-cart {
            display: block;
            width: 100%;
            flex-shrink: 0;
            margin-top: 0;
            padding: 9px 4px;
            font-size: 9px;
            letter-spacing: 0.6px;
          }

          .home-cart-message {
            font-size: 9px;
            overflow-wrap: anywhere;
          }

          .tag {
            top: 7px;
            left: 7px;
            padding: 5px 7px;
            font-size: 8px;
          }

          .heart {
            top: 7px !important;
            right: 7px !important;
            width: 28px;
            height: 28px;
            font-size: 16px;
          }

          .section-heading {
            margin-bottom: 16px;
          }

          .section-heading h2,
          .about-section h2 {
            font-size: 32px;
          }

          .about-section {
            padding: 48px 20px;
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

        /* Compact mobile footer only; desktop footer remains unchanged. */
        @media (max-width: 600px) {
          .dreamzy-footer {
            padding: 22px 12px 14px;
          }

          .dreamzy-footer-top {
            display: grid;
            grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
            gap: 16px 12px;
            align-items: center;
            padding-bottom: 18px;
          }

          .dreamzy-footer-logo-wrap {
            width: 100%;
            max-width: none;
            padding: 6px;
            justify-self: stretch;
          }

          .dreamzy-footer-logo-image {
            width: 100%;
            max-height: 135px;
            object-fit: contain;
          }

          .dreamzy-footer-brand {
            text-align: left;
            min-width: 0;
          }

          .dreamzy-footer-wordmark {
            font-size: 25px;
            letter-spacing: 1px;
          }

          .dreamzy-footer-tagline {
            margin-top: 8px;
            font-size: 11px;
            line-height: 1.35;
          }

          .dreamzy-footer-copy {
            margin-top: 10px;
            font-size: 11px;
            line-height: 1.4;
          }

          .dreamzy-footer-rule {
            margin: 12px 0;
          }

          .dreamzy-footer-shop-links {
            justify-content: flex-start;
            gap: 8px 10px;
            margin-top: 12px;
          }

          .dreamzy-footer-shop-links a {
            font-size: 10px;
            white-space: nowrap;
          }

          .dreamzy-footer-links {
            grid-column: 1 / -1;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            gap: 4px 14px;
            border-left: 0;
            border-top: 1px solid rgba(255, 220, 215, 0.34);
            padding: 14px 0 0;
            justify-content: flex-start;
          }

          .dreamzy-footer-links .dreamzy-footer-heading {
            flex: 0 0 100%;
            width: 100%;
            margin-bottom: 4px;
          }

          .dreamzy-footer-follow {
            grid-column: 1 / -1;
            border-left: 0;
            border-top: 1px solid rgba(255, 220, 215, 0.34);
            padding: 14px 0 0;
            justify-content: flex-start;
          }

          .dreamzy-footer-heading {
            font-size: 9px;
            letter-spacing: 2px;
            margin-bottom: 8px;
          }

          .dreamzy-footer-links a {
            display: inline-flex;
            width: auto;
            flex: 0 0 auto;
            font-size: 10px;
            padding: 5px 0;
            gap: 4px;
            white-space: nowrap;
          }

          .dreamzy-footer-links b {
            display: none;
          }

          .dreamzy-footer-social {
            justify-content: flex-start;
            gap: 7px;
          }

          .dreamzy-footer-social a {
            width: 32px;
            height: 32px;
            font-size: 12px;
          }

          .dreamzy-footer-bottom {
            padding-top: 12px;
            flex-direction: column;
            text-align: center;
            gap: 6px;
            font-size: 9px;
            line-height: 1.4;
          }
        }


        /* Approved Home page footer layout: logo, brand, quick links, and social links in four columns. */
        .dreamzy-footer {
          padding-top: 26px;
          padding-bottom: 22px;
        }

        .dreamzy-footer-top {
          display: grid;
          grid-template-columns: minmax(220px, 1.05fr) minmax(260px, 1.15fr) minmax(220px, 0.85fr) minmax(150px, 0.55fr);
          grid-template-areas: "logo brand links follow";
          column-gap: 34px;
          row-gap: 0;
          align-items: center;
          padding-bottom: 46px;
        }

        .dreamzy-footer-logo-wrap {
          grid-area: logo;
          width: 100%;
          max-width: 365px;
          justify-self: center;
        }

        .dreamzy-footer-brand {
          grid-area: brand;
          min-width: 0;
        }

        .dreamzy-footer-follow {
          grid-area: follow;
          align-self: stretch;
          border-left: 1px solid rgba(255, 220, 215, 0.34);
          border-top: 0;
          padding: 0 0 0 30px;
          justify-content: center;
        }

        .dreamzy-footer-links {
          grid-area: links;
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;
          align-items: stretch;
          justify-content: center;
          gap: 0;
          border-left: 1px solid rgba(255, 220, 215, 0.34);
          border-top: 0;
          padding: 0 0 0 30px;
        }

        .dreamzy-footer-links .dreamzy-footer-heading {
          flex: 0 0 auto;
          width: 100%;
          margin-bottom: 16px;
        }

        .dreamzy-footer-links a {
          display: flex;
          width: 100%;
          flex: 0 0 auto;
          justify-content: space-between;
          gap: 15px;
          padding: 8px 0;
          white-space: nowrap;
        }

        .dreamzy-footer-links b {
          display: inline;
        }

        .dreamzy-footer-bottom {
          justify-content: space-between;
          flex-direction: row;
          text-align: left;
          gap: 20px;
          padding-top: 22px;
        }

        @media (max-width: 1050px) {
          .dreamzy-footer-top {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            grid-template-areas:
              "logo brand"
              "links follow";
            column-gap: 28px;
            row-gap: 30px;
            padding-bottom: 30px;
          }

          .dreamzy-footer-links,
          .dreamzy-footer-follow {
            border-left: 0;
            border-top: 1px solid rgba(255, 220, 215, 0.34);
            padding: 24px 0 0;
          }

          .dreamzy-footer-bottom {
            flex-direction: row;
            text-align: left;
          }
        }

        @media (max-width: 600px) {
          .dreamzy-footer {
            padding: 16px 10px 12px;
          }

          .dreamzy-footer-top {
            grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
            grid-template-areas:
              "logo follow"
              "logo brand"
              "links links";
            column-gap: 12px;
            row-gap: 8px;
            align-items: center;
            padding-bottom: 12px;
          }

          .dreamzy-footer-logo-wrap {
            width: 100%;
            max-width: none;
            padding: 5px;
            align-self: center;
          }

          .dreamzy-footer-logo-image {
            width: 100%;
            max-height: 135px;
            object-fit: contain;
          }

          .dreamzy-footer-follow {
            grid-area: follow;
            align-self: end;
            padding: 0;
            margin: 0;
          }

          .dreamzy-footer-heading {
            font-size: 9px;
            letter-spacing: 2px;
            margin-bottom: 7px;
          }

          .dreamzy-footer-social {
            justify-content: flex-start;
            gap: 6px;
          }

          .dreamzy-footer-social a {
            width: 30px;
            height: 30px;
            font-size: 12px;
          }

          .dreamzy-footer-brand {
            grid-area: brand;
            text-align: left;
            min-width: 0;
          }

          .dreamzy-footer-wordmark {
            font-size: 23px;
            letter-spacing: 1px;
          }

          .dreamzy-footer-tagline {
            margin-top: 6px;
            font-size: 10px;
            line-height: 1.35;
          }

          .dreamzy-footer-rule {
            margin: 8px 0;
          }

          .dreamzy-footer-copy {
            margin-top: 7px;
            font-size: 10px;
            line-height: 1.35;
          }

          .dreamzy-footer-shop-links {
            justify-content: flex-start;
            gap: 7px 9px;
            margin-top: 9px;
          }

          .dreamzy-footer-shop-links a {
            font-size: 9px;
            white-space: nowrap;
          }

          .dreamzy-footer-links {
            grid-area: links;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            align-items: center;
            justify-content: stretch;
            gap: 6px 8px;
            padding: 12px 0 0;
            margin-top: 2px;
          }

          .dreamzy-footer-links .dreamzy-footer-heading {
            grid-column: 1 / -1;
            width: 100%;
            margin-bottom: 2px;
          }

          .dreamzy-footer-links a {
            display: inline-flex;
            width: 100%;
            min-width: 0;
            justify-content: flex-start;
            font-size: 10px;
            padding: 4px 0;
            gap: 3px;
            white-space: nowrap;
          }

          .dreamzy-footer-links b {
            display: none;
          }

          .dreamzy-footer-bottom {
            padding-top: 10px;
            flex-direction: column;
            text-align: center;
            gap: 5px;
            font-size: 9px;
            line-height: 1.35;
          }
        }


        /* Reduce excess vertical space around The DREAMZY Promise on mobile only. */
        @media (max-width: 600px) {
          .about-section {
            padding: 30px 20px 32px;
          }

          .about-section h2 {
            margin: 8px 0;
            line-height: 1.15;
          }

          .about-section p {
            margin: 8px 0 0;
            line-height: 1.6;
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
            padding: 14px 4px !important;
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

          .mobile-account-dropdown a:hover,
          .mobile-account-dropdown .mobile-account-logout:hover {
            background: #faf3ef;
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


        /* Compact the mobile bottom bar and keep footer content clear of it. */
        @media (max-width: 600px) {
          .dreamzy-footer {
            padding-bottom: 96px;
          }
        }

      `}</style></main>
  );
}
