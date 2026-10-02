"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCatalog, syncStoredCatalogData } from "../lib/catalog";

type Product = {
  id: string;
  name: string;
  price: number;
  category: "Women" | "Kids";
  image: string;
  sizes: string[];
  tag: string;
  stock: number;
  sizeStock?: Record<string, number>;
  active: boolean;
};

const defaultProducts: Product[] = [
  { id:"201", name:"Little Dreamer Pajama Set", price:999, category:"Kids", image:"/kids-1.jpg", sizes:["2-3Y","4-5Y","6-7Y","8-9Y","10-11Y"], tag:"NEW", stock:20, active:true },
  { id:"202", name:"Sweet Dreams Nightdress", price:899, category:"Kids", image:"/kids-2.jpg", sizes:["2-3Y","4-5Y","6-7Y","8-9Y","10-11Y"], tag:"BESTSELLER", stock:20, active:true },
  { id:"203", name:"Moonlight Kids Nightwear", price:1099, category:"Kids", image:"/kids-3.jpg", sizes:["2-3Y","4-5Y","6-7Y","8-9Y","10-11Y"], tag:"NEW", stock:20, active:true }
];


function DreamzyFooter() {
  return (
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

  );
}


export default function KidsPage() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [cartItemIds, setCartItemIds] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProducts();
    loadWishlist();
    loadReviews();
    loadCart();

    const refresh = () => {
      loadProducts();
      loadWishlist();
      loadReviews();
      loadCart();
    };

    window.addEventListener("focus", refresh);
    window.addEventListener("dreamzy-products-updated", refresh);
    window.addEventListener("dreamzy-catalog-updated", refresh);
    window.addEventListener("dreamzy-wishlist-updated", refresh);
    window.addEventListener("dreamzy-reviews-updated", refresh);
    window.addEventListener("dreamzy-cart-updated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("dreamzy-products-updated", refresh);
      window.removeEventListener("dreamzy-catalog-updated", refresh);
      window.removeEventListener("dreamzy-wishlist-updated", refresh);
      window.removeEventListener("dreamzy-reviews-updated", refresh);
      window.removeEventListener("dreamzy-cart-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  function loadProducts() {
    try {
      const catalog = getCatalog();
      syncStoredCatalogData(catalog);
      const kids = catalog.filter((p) => p.category === "Kids" && p.active !== false);
      if (kids.length > 0) setProducts(kids);
    } catch {}
  }

  function loadWishlist() {
    try {
      const raw = localStorage.getItem("dreamzy-wishlist");
      if (!raw) {
        setWishlistIds([]);
        return;
      }

      const data = JSON.parse(raw);

      if (Array.isArray(data)) {
        setWishlistIds(data.map((item: Product) => String(item.id)));
      }
    } catch {
      setWishlistIds([]);
    }
  }

  function toggleWishlist(product: Product) {
    try {
      const raw = localStorage.getItem("dreamzy-wishlist");
      const current: Product[] = raw ? JSON.parse(raw) : [];

      const exists = current.some(
        (item) => String(item.id) === String(product.id)
      );

      let next: Product[];

      if (exists) {
        next = current.filter(
          (item) => String(item.id) !== String(product.id)
        );
        setMessage("Removed from wishlist");
      } else {
        next = [...current, product];
        setMessage("Added to wishlist ♥");
      }

      localStorage.setItem("dreamzy-wishlist", JSON.stringify(next));

      setWishlistIds(next.map((item) => String(item.id)));

      window.dispatchEvent(new Event("dreamzy-wishlist-updated"));

      setTimeout(() => setMessage(""), 1800);
    } catch (error) {
      console.error(error);
      setMessage("Wishlist could not be updated");
    }
  }

  function loadReviews() {
    try {
      const raw = localStorage.getItem("dreamzy-reviews");
      const parsed = raw ? JSON.parse(raw) : [];
      setReviews(Array.isArray(parsed) ? parsed : []);
    } catch {
      setReviews([]);
    }
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem("dreamzy-cart");
      const parsed = raw ? JSON.parse(raw) : [];
      const ids = Array.isArray(parsed)
        ? parsed.map((item: any) => String(item.id || `${item.productId}-${item.size || "M"}`))
        : [];
      setCartItemIds(ids);
    } catch {
      setCartItemIds([]);
    }
  }

  function getAvailableStock(product: Product, size: string): number {
    if (product.sizeStock && typeof product.sizeStock === "object") {
      const value = Number(product.sizeStock[size] ?? 0);
      return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
    }
    // Backward compatibility for older catalog entries that only store total stock.
    const total = Number(product.stock || 0);
    return Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0;
  }

  function getDefaultSize(product: Product): string {
    const sizes = product.sizes && product.sizes.length ? product.sizes : ["2-3Y"];
    return sizes.find((size) => getAvailableStock(product, size) > 0) || sizes[0] || "2-3Y";
  }

  function getSelectedSize(product: Product): string {
    return selectedSizes[product.id] || getDefaultSize(product);
  }

  function addToCart(product: Product) {
    try {
      const size = getSelectedSize(product);
      const available = getAvailableStock(product, size);
      if (available <= 0) {
        setMessage(`Size ${size} is out of stock.`);
        window.setTimeout(() => setMessage(""), 2200);
        return;
      }
      const raw = localStorage.getItem("dreamzy-cart");
      const parsed = raw ? JSON.parse(raw) : [];
      const nextCart = Array.isArray(parsed) ? [...parsed] : [];
      const cartId = `${product.id}-${size}`;
      const existing = nextCart.find(
        (item: any) => String(item.id || `${item.productId}-${item.size || "M"}`) === cartId
      );

      // Do not send stale cart items to checkout when current inventory cannot cover them.
      if (existing) {
        const existingQuantity = Math.max(1, Number(existing.quantity || 1));
        if (existingQuantity > available) {
          setMessage(`Only ${available} unit(s) of size ${size} are currently available.`);
          window.setTimeout(() => setMessage(""), 2200);
          return;
        }
        setCartItemIds(nextCart.map((item: any) => String(item.id || `${item.productId}-${item.size || "M"}`)));
        window.location.href = "/checkout";
        return;
      }

      nextCart.push({
        id: cartId,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
        quantity: 1
      });

      localStorage.setItem("dreamzy-cart", JSON.stringify(nextCart));
      setCartItemIds(nextCart.map((item: any) => String(item.id || `${item.productId}-${item.size || "M"}`)));
      window.dispatchEvent(new Event("dreamzy-cart-updated"));
      setMessage("Added to cart ♥");
      window.setTimeout(() => setMessage(""), 1800);
    } catch {
      setMessage("Could not add product to cart");
    }
  }

  function logout() {
    localStorage.removeItem("dreamzy-account");
    window.dispatchEvent(new Event("dreamzy-account-updated"));
    setMenuOpen(false);
    window.location.href = "/";
  }

  return (
    <main style={{ minHeight:"100vh", background:"#faf6f1", color:"#542f35", fontFamily:"Arial,sans-serif" }}>

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
          <Link href="/#new-arrivals" onClick={() => setMenuOpen(false)}>NEW ARRIVALS</Link>
          <Link href="/#best-sellers" onClick={() => setMenuOpen(false)}>BEST SELLERS</Link>
          <Link href="/#about" onClick={() => setMenuOpen(false)}>ABOUT</Link>
          <Link href="/wishlist" onClick={() => setMenuOpen(false)}>WISHLIST</Link>
          <Link href="/cart" onClick={() => setMenuOpen(false)}>CART</Link>
          <div className="mobile-account-menu">
            <button
              type="button"
              className="mobile-account-button"
              onClick={() => setAccountOpen((open) => !open)}
              aria-expanded={accountOpen}
            >
              <span>ACCOUNT</span>
              <span className={`account-chevron ${accountOpen ? "open" : ""}`}>⌄</span>
            </button>
            {accountOpen && (
              <div className="mobile-account-dropdown">
                <Link href="/account" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>My Account</Link>
                <Link href="/account#orders" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>My Orders</Link>
                <Link href="/account#addresses" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>My Addresses</Link>
                <Link href="/wishlist" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>Wishlist</Link>
                <button type="button" onClick={logout}>Log Out</button>
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

      {message && (
        <div style={{
          position:"fixed",
          top:85,
          right:25,
          zIndex:100,
          background:"#542f35",
          color:"#fff",
          padding:"14px 20px",
          boxShadow:"0 5px 20px rgba(0,0,0,.15)",
          fontSize:14
        }}>
          {message}
        </div>
      )}

      <section className="women-intro" style={{ textAlign:"center", padding:"65px 25px 40px" }}>
        <div style={eyebrow}>DREAMZY KIDS</div>
        <h1 className="women-heading" style={heading}>Kids' Nightwear</h1>
        <p style={{ color:"#765b5e" }}>
          Soft and comfortable nightwear made for little dreamers.
        </p>
      </section>

      <section className="women-products" style={{ maxWidth:1250, margin:"0 auto", padding:"20px 25px 90px" }}>
        <div className="women-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,minmax(0,1fr))", gap:25 }}>

          {products.map((product) => {
            const isWishlisted = wishlistIds.includes(String(product.id));
            const productReviews = reviews.filter(
              (review) =>
                review.visible !== false &&
                (String(review.productId) === String(product.id) ||
                  review.productName === product.name)
            );
            const reviewCount = productReviews.length;
            const averageRating = reviewCount
              ? productReviews.reduce(
                  (sum, review) => sum + Number(review.rating || 0),
                  0
                ) / reviewCount
              : 0;

            return (
              <article key={product.id} style={card}>

                <div style={{ height:430, position:"relative", background:"#eee5df" }}>

                  <Link
                    href={`/product/${encodeURIComponent(String(product.id))}`}
                    aria-label={`View ${product.name}`}
                    style={{ display: "block", width: "100%", height: "100%" }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={image}
                    />
                  </Link>

                  <span style={tag}>
                    {product.tag}
                  </span>

                  <button
                    type="button"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      toggleWishlist(product);
                    }}
                    style={{
                      position:"absolute",
                      top:14,
                      right:14,
                      width:46,
                      height:46,
                      borderRadius:"50%",
                      border:"1px solid #d9cbc7",
                      background:"#fff",
                      color:"#542f35",
                      cursor:"pointer",
                      fontSize:24,
                      lineHeight:"44px",
                      textAlign:"center"
                    }}
                  >
                    {isWishlisted ? "♥" : "♡"}
                  </button>

                </div>

                <div style={{ padding:22 }}>

                  <h2 style={{
                    fontFamily:"Georgia,serif",
                    fontWeight:400,
                    fontSize:22,
                    margin:"0 0 9px"
                  }}>
                    <Link
                      href={`/product/${encodeURIComponent(String(product.id))}`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {product.name}
                    </Link>
                  </h2>

                  <div className="price-rating-row">
                    <div style={{ fontWeight:700 }}>
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </div>
                    <div
                      className="card-rating"
                      aria-label={
                        reviewCount
                          ? `${averageRating.toFixed(1)} out of 5 · ${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}`
                          : "No reviews yet"
                      }
                    >
                      {reviewCount ? (
                        <>
                          <span className="card-stars">★★★★★</span>
                          <span className="card-rating-text">
                            {averageRating.toFixed(1)} · {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                          </span>
                        </>
                      ) : (
                        <span className="card-rating-text">No reviews yet</span>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop:14, marginBottom:14 }}>
                    <div style={{ fontSize:11, letterSpacing:1.2, marginBottom:8, color:"#765b5e", fontWeight:700 }}>
                      SELECT SIZE
                    </div>
                    <div role="group" aria-label={`Select size for ${product.name}`} style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                      {(product.sizes && product.sizes.length ? product.sizes : ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"]).map((size) => {
                        const selected = getSelectedSize(product) === size;
                        const available = getAvailableStock(product, size);
                        const outOfStock = available <= 0;
                        return (
                          <button
                            key={size}
                            type="button"
                            aria-pressed={selected}
                            aria-label={`${size}${outOfStock ? " size, out of stock" : ` size, ${available} available`}`}
                            title={outOfStock ? "Out of stock" : `${available} available`}
                            disabled={outOfStock}
                            onClick={() => setSelectedSizes((current) => ({ ...current, [product.id]: size }))}
                            style={{
                              minWidth:40,
                              height:34,
                              padding:"0 10px",
                              border:`1px solid ${selected ? "#542f35" : "#d9cbc7"}`,
                              background:outOfStock ? "#eee8e5" : selected ? "#542f35" : "#fffdfb",
                              color:outOfStock ? "#a69a96" : selected ? "#fff" : "#542f35",
                              cursor:outOfStock ? "not-allowed" : "pointer",
                              opacity:outOfStock ? 0.65 : 1,
                              textDecoration:outOfStock ? "line-through" : "none",
                              fontSize:12,
                              fontWeight:selected ? 700 : 400
                            }}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    disabled={getAvailableStock(product, getSelectedSize(product)) <= 0}
                    style={{
                      width:"100%",
                      height:50,
                      border:0,
                      background:getAvailableStock(product, getSelectedSize(product)) <= 0 ? "#c9bfbb" : "#542f35",
                      color:"#fff",
                      cursor:getAvailableStock(product, getSelectedSize(product)) <= 0 ? "not-allowed" : "pointer",
                      fontWeight:700,
                      letterSpacing:1
                    }}
                  >
                    {getAvailableStock(product, getSelectedSize(product)) <= 0
                      ? "OUT OF STOCK"
                      : cartItemIds.includes(`${product.id}-${getSelectedSize(product)}`)
                        ? "PROCEED TO CHECKOUT"
                        : "ADD TO CART"}
                  </button>

                </div>
              </article>
            );
          })}

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
        <Link href="/cart" className="mobile-bottom-nav-item" aria-label="Cart">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 3h2.8l2.2 12.1a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.5L22 8H6" /><circle cx="10" cy="20" r="1.2" /><circle cx="18" cy="20" r="1.2" /></svg>
          <span>Cart</span>
        </Link>
      </nav>

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
          box-sizing: border-box;
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
          box-sizing: border-box;
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
        .mobile-account-menu { display: none; }
        .mobile-account-button {
          width: 100%; border: 0; background: transparent; color: #542f35;
          padding: 9px 4px !important; font: inherit; font-size: 12px !important;
          letter-spacing: 1.2px !important; text-align: left; cursor: pointer;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid #f0e7e2; box-sizing: border-box;
        }
        .mobile-account-dropdown {
          width: 100%; padding: 0 0 4px 12px; background: #fffdfb;
          border-bottom: 1px solid #f0e7e2; box-sizing: border-box;
        }
        .mobile-account-dropdown a, .mobile-account-dropdown button {
          display: block; width: 100%; padding: 8px 6px !important;
          border: 0; background: transparent; color: #542f35;
          text-decoration: none; font: inherit; font-size: 12px !important;
          letter-spacing: 1px !important; text-align: left; cursor: pointer;
          box-sizing: border-box;
        }


        .price-rating-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 18px;
        }

        .card-rating {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
          color: #8a6d70;
          font-size: 10px;
        }

        .card-stars {
          color: #b27655;
          font-size: 11px;
          letter-spacing: 1px;
        }

        .card-rating-text {
          font-size: 10px;
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

          .mobile-account-menu { display: block; }

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
            box-sizing: border-box;
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
            box-sizing: border-box;
          }

          .women-intro {
            padding: 48px 20px 28px !important;
          }
          .women-heading {
            font-size: 46px !important;
            line-height: 1.08;
          }
          .women-products {
            padding: 12px 14px 60px !important;
          }
          .women-grid {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }
          .women-grid article > div:first-child {
            height: 390px !important;
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
        }

        @media (max-width: 560px) {
          .women-heading {
            font-size: 42px !important;
          }
          .women-grid article > div:first-child {
            height: 360px !important;
          }
          .women-grid article > div:last-child {
            padding: 18px !important;
          }
        }



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
          .dreamzy-footer { padding-bottom: 92px !important; }
        }

        /* Mobile-only Kids collection styling: match the approved Women page. */
        @media (max-width: 600px) {
          .women-products {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            padding: 18px 10px 36px !important;
          }

          .women-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 12px !important;
            align-items: stretch !important;
          }

          .women-grid article {
            display: flex !important;
            flex-direction: column !important;
            min-width: 0 !important;
            height: 100% !important;
            overflow: hidden !important;
          }

          .women-grid article > div:first-child {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 0.82 !important;
            min-height: 0 !important;
            flex: 0 0 auto !important;
          }

          .women-grid article > div:first-child a,
          .women-grid article > div:first-child img {
            width: 100% !important;
            height: 100% !important;
          }

          .women-grid article > div:first-child img {
            object-fit: cover !important;
          }

          .women-grid article > div:first-child button {
            top: 7px !important;
            right: 7px !important;
            width: 32px !important;
            height: 32px !important;
            line-height: 30px !important;
            font-size: 19px !important;
          }

          .women-grid article > div:first-child span {
            top: 7px !important;
            left: 7px !important;
            padding: 5px 6px !important;
            font-size: 8px !important;
            letter-spacing: 0.6px !important;
          }

          .women-grid article > div:nth-child(2) {
            display: flex !important;
            flex: 1 1 auto !important;
            flex-direction: column !important;
            min-width: 0 !important;
            padding: 10px 8px 9px !important;
          }

          .women-grid article h2 {
            font-size: 14px !important;
            line-height: 1.35 !important;
            margin: 0 0 7px !important;
            overflow-wrap: anywhere !important;
          }

          .women-grid .price-rating-row {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 4px !important;
            font-size: 12px !important;
          }

          .women-grid .card-rating-text {
            font-size: 9px !important;
          }

          .women-grid article > div:nth-child(2) > div:nth-of-type(2) {
            margin-top: 10px !important;
            margin-bottom: 10px !important;
          }

          .women-grid article > div:nth-child(2) > div:nth-of-type(2) > div:first-child {
            font-size: 9px !important;
            margin-bottom: 6px !important;
          }

          .women-grid article > div:nth-child(2) > div:nth-of-type(2) > div[role="group"] {
            gap: 5px !important;
          }

          .women-grid article button[aria-pressed] {
            min-width: 27px !important;
            height: 28px !important;
            padding: 0 5px !important;
            font-size: 10px !important;
          }

          .women-grid article > div:nth-child(2) > button:last-child {
            width: 100% !important;
            min-height: 36px !important;
            height: auto !important;
            padding: 9px 4px !important;
            margin-top: auto !important;
            font-size: 9px !important;
            line-height: 1.3 !important;
            letter-spacing: 0.45px !important;
            overflow-wrap: anywhere !important;
          }

          .dreamzy-footer {
            padding: 22px 12px 16px !important;
          }

          .dreamzy-footer-top {
            display: grid !important;
            grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr) !important;
            gap: 16px 12px !important;
            align-items: center !important;
            padding-bottom: 18px !important;
          }

          .dreamzy-footer-logo-wrap {
            width: 100% !important;
            max-width: none !important;
            padding: 6px !important;
            justify-self: stretch !important;
          }

          .dreamzy-footer-logo-image {
            width: 100% !important;
            max-height: 150px !important;
            object-fit: contain !important;
          }

          .dreamzy-footer-brand {
            min-width: 0 !important;
            text-align: left !important;
          }

          .dreamzy-footer-wordmark {
            font-size: 23px !important;
            letter-spacing: 1px !important;
          }

          .dreamzy-footer-tagline {
            margin-top: 7px !important;
            font-size: 10px !important;
            line-height: 1.45 !important;
          }

          .dreamzy-footer-rule {
            width: 38px !important;
            margin: 10px 0 !important;
          }

          .dreamzy-footer-copy {
            font-size: 9px !important;
            line-height: 1.55 !important;
          }

          .dreamzy-footer-shop-links {
            grid-column: 1 / -1 !important;
            justify-content: center !important;
            gap: 10px 15px !important;
            margin-top: 12px !important;
          }

          .dreamzy-footer-shop-links a {
            font-size: 10px !important;
          }

          .dreamzy-footer-links,
          .dreamzy-footer-follow {
            min-width: 0 !important;
            border-left: 0 !important;
            border-top: 1px solid rgba(255, 220, 215, 0.34) !important;
            padding: 16px 0 0 !important;
            align-self: stretch !important;
          }

          .dreamzy-footer-links {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 0 10px !important;
          }

          .dreamzy-footer-links .dreamzy-footer-heading {
            grid-column: 1 / -1 !important;
          }

          .dreamzy-footer-heading {
            font-size: 8px !important;
            letter-spacing: 2px !important;
            margin-bottom: 10px !important;
          }

          .dreamzy-footer-links a {
            min-width: 0 !important;
            white-space: normal !important;
            font-size: 9px !important;
            padding: 6px 0 !important;
            gap: 4px !important;
          }

          .dreamzy-footer-links b {
            font-size: 13px !important;
          }

          .dreamzy-footer-social {
            justify-content: flex-start !important;
            gap: 7px !important;
          }

          .dreamzy-footer-social a {
            width: 29px !important;
            height: 29px !important;
            font-size: 13px !important;
          }

          .dreamzy-footer-bottom {
            display: flex !important;
            flex-direction: column !important;
            gap: 7px !important;
            padding-top: 13px !important;
            text-align: center !important;
            font-size: 9px !important;
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
    </main>
  );
}

const nav = {
  color:"#542f35",
  textDecoration:"none",
  fontSize:12,
  letterSpacing:1
};

const eyebrow = {
  fontSize:11,
  letterSpacing:3,
  color:"#987276",
  fontWeight:700
};

const heading = {
  fontFamily:"Georgia,serif",
  fontWeight:400,
  fontSize:52,
  margin:"12px 0"
};

const card = {
  background:"#fffdfb",
  border:"1px solid #eadfd8"
};

const image = {
  width:"100%",
  height:"100%",
  objectFit:"cover" as const,
  display:"block"
};

const tag = {
  position:"absolute" as const,
  top:14,
  left:14,
  background:"#fffdfb",
  padding:"8px 11px",
  fontSize:10,
  letterSpacing:1.5
};
