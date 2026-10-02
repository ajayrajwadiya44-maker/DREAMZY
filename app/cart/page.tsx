"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCatalog, syncStoredCatalogData } from "../lib/catalog";

type CartItem = {
  id: string;
  productId?: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
};


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

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [stockMessage, setStockMessage] = useState("");

  function getAvailableStock(item: CartItem) {
    try {
      const catalog = getCatalog();
      syncStoredCatalogData(catalog);
      const product = catalog.find(
        (entry: any) =>
          String(entry.id) === String(item.productId || item.id.split("-")[0])
      );
      if (!product) return 0;
      const size = String(item.size || "");
      const bySize = product.sizeStock && Object.prototype.hasOwnProperty.call(product.sizeStock, size)
        ? Number(product.sizeStock[size])
        : Number(product.stock || 0);
      return Number.isFinite(bySize) ? Math.max(0, Math.floor(bySize)) : 0;
    } catch {
      return 0;
    }
  }

  function getProductCategory(item: CartItem) {
    try {
      const catalog = getCatalog();
      const productId = String(item.productId || item.id.split("-")[0]);
      const product = catalog.find((entry: any) => String(entry.id) === productId);
      return product?.category === "Kids" ? "DREAMZY KIDS" : "DREAMZY WOMEN";
    } catch {
      return "DREAMZY";
    }
  }

  function loadCartAndValidateStock() {
    try {
      const saved = localStorage.getItem("dreamzy-cart");
      const parsed = saved ? JSON.parse(saved) : [];
      const cart: CartItem[] = Array.isArray(parsed) ? parsed : [];

      const catalog = getCatalog();
      const validated: CartItem[] = cart.flatMap((item): CartItem[] => {
        const productId = String(item.productId || item.id.split("-")[0]);
        const product = catalog.find((entry: any) => String(entry.id) === productId);

        if (!product) return [];

        const available = getAvailableStock(item);
        const quantity =
          available > 0
            ? Math.min(Math.max(1, Number(item.quantity || 1)), available)
            : 0;

        if (quantity <= 0) return [];

        return [
          {
            ...item,
            productId: String(product.id ?? productId),
            name: String(product.name ?? item.name),
            price: Number(product.price ?? item.price),
            image: String(product.image ?? item.image),
            size: String(item.size ?? ""),
            quantity,
          },
        ];
      });

      setItems(validated);

      if (JSON.stringify(validated) !== JSON.stringify(cart)) {
        localStorage.setItem("dreamzy-cart", JSON.stringify(validated));
        window.dispatchEvent(new Event("dreamzy-cart-updated"));
      }
    } catch {
      setItems([]);
    }
    setLoaded(true);
  }

  useEffect(() => {
    loadCartAndValidateStock();

    const refresh = () => loadCartAndValidateStock();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("dreamzy-cart-updated", refresh);
    window.addEventListener("dreamzy-products-updated", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("dreamzy-cart-updated", refresh);
      window.removeEventListener("dreamzy-products-updated", refresh);
    };
  }, []);

  function saveCart(updated: CartItem[]) {
    setItems(updated);
    localStorage.setItem("dreamzy-cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("dreamzy-cart-updated"));
  }

  function increaseQuantity(id: string) {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;

    const available = getAvailableStock(item);

    if (available <= 0) {
      setStockMessage(`${item.name} (${item.size}) is out of stock.`);
      return;
    }

    if (item.quantity >= available) {
      setStockMessage(
        `Only ${available} ${available === 1 ? "unit" : "units"} available in size ${item.size}.`
      );
      return;
    }

    setStockMessage("");
    saveCart(
      items.map((entry) =>
        entry.id === id ? { ...entry, quantity: entry.quantity + 1 } : entry
      )
    );
  }

  function decreaseQuantity(id: string) {
    setStockMessage("");
    saveCart(
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  }

  function removeItem(id: string) {
    saveCart(items.filter((item) => item.id !== id));
  }

  function goToCheckout() {
    if (items.length === 0) {
      alert("Your shopping bag is empty.");
      return;
    }

    for (const item of items) {
      const available = getAvailableStock(item);

      if (available <= 0) {
        setStockMessage(`${item.name} (${item.size}) is out of stock.`);
        return;
      }

      if (item.quantity > available) {
        setStockMessage(
          `Only ${available} ${available === 1 ? "unit" : "units"} available in ${item.name} (${item.size}).`
        );
        return;
      }
    }

    setStockMessage("");
    window.location.href = "/checkout";
  }

  const subtotal = items.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );

  // DREAMZY prices are GST-inclusive.
  const gstRate = 5;
  const taxableSubtotal = subtotal / (1 + gstRate / 100);
  const gstAmount = subtotal - taxableSubtotal;

  // DREAMZY: free shipping on every order.
  const shipping: number = 0;
  const total = subtotal + shipping;

  if (!loaded) {
    return (
      <main style={loadingPage}>
        Loading your bag...
      </main>
    );
  }

  function logout() {
    localStorage.removeItem("dreamzy-account");
    window.dispatchEvent(new Event("dreamzy-account-updated"));
    setMenuOpen(false);
    setAccountOpen(false);
    window.location.href = "/";
  }

  return (
    <main style={page}>
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

      {items.length === 0 ? (
        <section style={emptySection}>
          <p style={eyebrow}>DREAMZY</p>
          <h1 className="cart-title" style={title}>Your Shopping Bag</h1>
          <p style={emptyText}>Your bag is currently empty.</p>
          <div className="cart-empty-actions">
            <a href="/" className="cart-empty-shop-button" style={shopButton}>
              CONTINUE SHOPPING
            </a>
          </div>
        </section>
      ) : (
        <section className="cart-section" style={section}>
          <p style={eyebrow}>DREAMZY</p>
          <h1 style={title}>Your Shopping Bag</h1>

          {stockMessage && (
            <div style={cartStockMessage}>{stockMessage}</div>
          )}

          <div className="cart-layout" style={layout}>
            <div>
              {items.map((item) => (
                <div key={item.id} className="cart-item-row" style={itemRow}>
                  <img className="cart-product-image" src={item.image} alt={item.name} style={productImage} />

                  <div className="cart-item-info" style={itemInfo}>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      style={removeButton}
                    >
                      REMOVE
                    </button>

                    <div style={category}>{getProductCategory(item)}</div>
                    <h2 style={productName}>{item.name}</h2>
                    <div style={sizeText}>Size: {item.size}</div>
                    <div style={priceText}>
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </div>

                    {(() => {
                      const available = getAvailableStock(item);
                      if (available >= 5) return null;
                      return (
                        <div
                          style={{
                            ...cartStockBadge,
                            background: available <= 0 ? "#f3d7d7" : "#f5e6c8",
                            color: available <= 0 ? "#8a3038" : "#8a5a18",
                          }}
                        >
                          {available <= 0
                            ? "OUT OF STOCK"
                            : `${available} ${available === 1 ? "unit" : "units"} left`}
                        </div>
                      );
                    })()}

                    <div style={quantityBox}>
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        style={quantityButton}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        style={quantityButton}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="cart-summary" style={summary}>
              <h2 style={summaryTitle}>Order Summary</h2>

              <div style={summaryRow}>
                <span>Product Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div style={summaryRow}>
                <span>GST ({gstRate}% included)</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>

              <div style={summaryRow}>
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}</span>
              </div>

              <div style={divider} />

              <div style={totalRow}>
                <strong>Total</strong>
                <strong>₹{total.toFixed(2)}</strong>
              </div>

              <p style={freeShippingNote}>
                GST INCLUDED IN PRODUCT PRICES · FREE SHIPPING
              </p>

              <button
                type="button"
                onClick={goToCheckout}
                style={checkoutButton}
              >
                PROCEED TO CHECKOUT
              </button>
            </aside>
          </div>
        </section>
      )}

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

const page = {
  minHeight: "100vh",
  background: "#fbf6f1",
  color: "#542f35",
  fontFamily: "Arial, Helvetica, sans-serif"
};

const loadingPage = {
  minHeight: "100vh",
  background: "#fbf6f1",
  color: "#542f35",
  display: "grid",
  placeItems: "center",
  fontFamily: "Arial, Helvetica, sans-serif"
};

const header = {
  height: 72,
  padding: "0 4%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid #eaded8",
  background: "#fbf6f1"
};

const logo = {
  color: "#542f35",
  textDecoration: "none",
  fontFamily: "Georgia, serif",
  fontSize: 30
};

const continueShopping = {
  color: "#542f35",
  textDecoration: "none",
  fontSize: 10,
  letterSpacing: 2
};

const section = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "75px 5% 100px"
};

const emptySection = {
  maxWidth: 900,
  margin: "0 auto",
  padding: "110px 5%",
  textAlign: "center" as const
};

const eyebrow = {
  color: "#96616a",
  fontSize: 9,
  letterSpacing: 3,
  margin: 0
};

const title = {
  fontFamily: "Georgia, serif",
  fontWeight: 400,
  fontSize: 52,
  margin: "12px 0 50px"
};

const emptyText = {
  color: "#725f60",
  fontSize: 13,
  lineHeight: 1.7
};

const shopButton = {
  display: "inline-block",
  marginTop: 24,
  padding: "16px 32px",
  background: "#542f35",
  color: "#fff",
  textDecoration: "none",
  fontSize: 9,
  letterSpacing: 2
};

const layout = {
  display: "grid",
  gridTemplateColumns: "1fr 350px",
  gap: 55,
  alignItems: "start"
};

const itemRow = {
  display: "grid",
  gridTemplateColumns: "150px 1fr",
  gap: 24,
  paddingBottom: 30,
  marginBottom: 30,
  borderBottom: "1px solid #e2d5d0"
};

const productImage = {
  width: 150,
  height: 180,
  objectFit: "cover" as const,
  background: "#eee1db"
};

const itemInfo = {
  position: "relative" as const
};

const removeButton = {
  position: "absolute" as const,
  right: 0,
  top: 0,
  border: 0,
  background: "transparent",
  color: "#8a7777",
  cursor: "pointer",
  fontSize: 9,
  letterSpacing: 1
};

const category = {
  color: "#96616a",
  fontSize: 9,
  letterSpacing: 2,
  marginBottom: 12
};

const productName = {
  fontFamily: "Georgia, serif",
  fontWeight: 400,
  fontSize: 25,
  margin: "0 0 10px",
  paddingRight: 80
};

const sizeText = {
  color: "#725f60",
  fontSize: 12,
  marginBottom: 7
};

const priceText = {
  fontSize: 13,
  marginBottom: 24
};

const quantityBox = {
  width: 120,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  border: "1px solid #d5c5bf"
};

const quantityButton = {
  width: 38,
  height: "100%",
  border: 0,
  background: "transparent",
  color: "#542f35",
  cursor: "pointer",
  fontSize: 17
};

const cartStockBadge = {
  display: "inline-block",
  width: "fit-content",
  padding: "5px 8px",
  marginBottom: 14,
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: 0.8
};

const cartStockMessage = {
  marginBottom: 24,
  padding: "12px 15px",
  border: "1px solid #e2bcbc",
  background: "#f3d7d7",
  color: "#8a3038",
  fontSize: 11,
  lineHeight: 1.5
};

const summary = {
  border: "1px solid #e2d5d0",
  background: "#fbf6f1",
  padding: 30,
  position: "sticky" as const,
  top: 95
};

const summaryTitle = {
  fontFamily: "Georgia, serif",
  fontWeight: 400,
  fontSize: 25,
  marginTop: 0
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 14,
  fontSize: 12
};

const divider = {
  height: 1,
  background: "#d8c9c3",
  margin: "24px 0"
};

const totalRow = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 17
};

const freeShippingNote = {
  color: "#8a7777",
  fontSize: 10,
  lineHeight: 1.6,
  marginTop: 12
};

const checkoutButton = {
  width: "100%",
  height: 52,
  marginTop: 24,
  border: 0,
  background: "#542f35",
  color: "#fff",
  cursor: "pointer",
  fontSize: 9,
  letterSpacing: 2
};

const footerLogo = {
  fontFamily: "Georgia, serif",
  fontSize: 35
};

const footerTagline = {
  fontSize: 11,
  opacity: 0.7
};

const footerLinks = {
  display: "flex",
  justifyContent: "center",
  gap: 30,
  flexWrap: "wrap" as const,
  margin: "30px 0 40px"
};

const footerLink = {
  color: "#f9eee8",
  textDecoration: "none",
  fontSize: 10
};

const copyright = {
  paddingTop: 22,
  borderTop: "1px solid rgba(255,255,255,0.15)",
  fontSize: 9,
  opacity: 0.55
};
