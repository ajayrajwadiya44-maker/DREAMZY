"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getCatalog, syncStoredCatalogData } from "../../lib/catalog";

type Product = {
  id: string;
  name: string;
  price: number;
  category: "Women" | "Kids";
  image: string;
  gallery?: string[];
  sizes: string[];
  sizeStock: Record<string, number>;
  tag: string;
  stock: number;
  active: boolean;
};

type Review = {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  review: string;
  createdAt: string;
  verifiedPurchase: boolean;
};

function normalizeProduct(raw: any): Product {
  const sizes =
    Array.isArray(raw?.sizes) && raw.sizes.length
      ? raw.sizes.map((s: any) => String(s).trim()).filter(Boolean)
      : ["M"];

  const incoming =
    raw?.sizeStock && typeof raw.sizeStock === "object"
      ? raw.sizeStock
      : null;

  const sizeStock: Record<string, number> = {};
  sizes.forEach((size, index) => {
    const value = incoming ? Number(incoming[size]) : NaN;
    if (Number.isFinite(value) && value >= 0) {
      sizeStock[size] = Math.floor(value);
    } else {
      const totalStock = Math.max(0, Number(raw?.stock) || 20);
      sizeStock[size] = Math.max(1, Math.floor(totalStock / Math.max(1, sizes.length)) + (index === 0 ? totalStock % Math.max(1, sizes.length) : 0));
    }
  });

  const stock = sizes.reduce(
    (sum, size) => sum + Number(sizeStock[size] || 0),
    0
  );

  return {
    id: String(raw?.id ?? ""),
    name: String(raw?.name ?? "DREAMZY Product"),
    price: Number(raw?.price) || 0,
    category: raw?.category === "Kids" ? "Kids" : "Women",
    image: String(raw?.image ?? "/women-1.jpg"),
    gallery: Array.from(new Set([
      String(raw?.image ?? "/women-1.jpg"),
      ...(Array.isArray(raw?.gallery) ? raw.gallery : []),
      ...(Array.isArray(raw?.images) ? raw.images : []),
    ].map((item: any) => String(item || "")).filter(Boolean))).slice(0, 5),
    sizes,
    sizeStock,
    tag:
      raw?.tag === "BESTSELLER"
        ? "BESTSELLER"
        : raw?.tag === "NEW"
          ? "NEW"
          : "",
    stock,
    active: raw?.active !== false,
  };
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = String(params?.id || "");

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "size" | "shipping" | "reviews">("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);

  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem("dreamzy-cart") || "[]");
      setCartItems(Array.isArray(raw) ? raw : []);
    } catch {
      setCartItems([]);
    }
  }

  function loadReviews() {
    try {
      const raw = JSON.parse(localStorage.getItem("dreamzy-reviews") || "[]");
      setReviews(Array.isArray(raw) ? raw : []);
    } catch {
      setReviews([]);
    }
  }

  function loadProduct() {
    try {
      const catalog = getCatalog();
      syncStoredCatalogData(catalog);

      const found = catalog.find(
        (item: any) =>
          String(item.id) === productId && item.active !== false
      );

      if (!found) {
        setProduct(null);
        return;
      }

      const normalized = normalizeProduct(found);
      setProduct(normalized);
      setActiveImage(0);
      try {
        const savedWishlist = JSON.parse(localStorage.getItem("dreamzy-wishlist") || "[]");
        setIsWishlisted(Array.isArray(savedWishlist) && savedWishlist.some((item: any) => String(item?.id) === String(normalized.id)));
      } catch {
        setIsWishlisted(false);
      }

      setSelectedSize((current) => {
        if (
          current &&
          normalized.sizes.includes(current) &&
          Number(normalized.sizeStock[current] || 0) > 0
        ) {
          return current;
        }

        const firstAvailable = normalized.sizes.find(
          (size) => Number(normalized.sizeStock[size] || 0) > 0
        );

        return firstAvailable || normalized.sizes[0] || "";
      });
    } catch {
      setProduct(null);
    }
  }

  useEffect(() => {
    loadProduct();
    loadReviews();
    loadCart();

    const refresh = () => {
      loadProduct();
      loadReviews();
      loadCart();
    };

    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("dreamzy-products-updated", refresh);
    window.addEventListener("dreamzy-catalog-updated", refresh);
    window.addEventListener("dreamzy-reviews-updated", refresh);
    window.addEventListener("dreamzy-cart-updated", loadCart);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("dreamzy-products-updated", refresh);
      window.removeEventListener("dreamzy-catalog-updated", refresh);
      window.removeEventListener("dreamzy-reviews-updated", refresh);
      window.removeEventListener("dreamzy-cart-updated", loadCart);
    };
  }, [productId]);

  const available = product
    ? Number(product.sizeStock[selectedSize] || 0)
    : 0;

  const alreadyInCart = Boolean(
    product &&
      selectedSize &&
      cartItems.some((item: any) =>
        String(item.productId ?? String(item.id || "").split("-")[0]) === String(product.id) &&
        String(item.size || "") === String(selectedSize) &&
        Number(item.quantity || 0) > 0
      )
  );

  const stockState = useMemo(() => {
    if (!product) return { label: "", className: "" };

    if (available <= 0) {
      return { label: "OUT OF STOCK", className: "stock-out" };
    }

    if (available <= 4) {
      return {
        label: `${available} ${available === 1 ? "unit" : "units"} left`,
        className: "stock-low",
      };
    }

    return { label: "", className: "stock-good" };
  }, [product, available]);

  const productReviews = useMemo(() => {
    if (!product) return [];
    return reviews.filter(
      (review) =>
        review.visible !== false &&
        (String(review.productId) === String(product.id) ||
          review.productName === product.name)
    );
  }, [reviews, product]);

  const averageRating = useMemo(() => {
    if (!productReviews.length) return 0;
    return (
      productReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
      productReviews.length
    );
  }, [productReviews]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return getCatalog()
      .filter((item: any) => item.active !== false && String(item.id) !== String(product.id) && item.category === product.category)
      .slice(0, 6);
  }, [product]);

  function formatReviewDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function stars(value: number) {
    const rounded = Math.round(value);
    return "★★★★★".split("").map((star, index) => (
      <span key={index} className={index < rounded ? "filled" : ""}>
        {star}
      </span>
    ));
  }

  function toggleWishlist() {
    if (!product) return;

    try {
      const raw = localStorage.getItem("dreamzy-wishlist");
      const wishlist = raw ? JSON.parse(raw) : [];
      const current = Array.isArray(wishlist) ? wishlist : [];
      const exists = current.some((item: any) => String(item?.id) === String(product.id));
      const next = exists
        ? current.filter((item: any) => String(item?.id) !== String(product.id))
        : [...current, {
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image,
            gallery: product.gallery,
            sizes: product.sizes,
            sizeStock: product.sizeStock,
            tag: product.tag,
            stock: product.stock,
            active: product.active,
          }];

      localStorage.setItem("dreamzy-wishlist", JSON.stringify(next));
      setIsWishlisted(!exists);
      window.dispatchEvent(new Event("dreamzy-wishlist-updated"));
      setMessage(exists ? "Removed from wishlist" : "Added to wishlist ♥");
      setTimeout(() => setMessage(""), 1800);
    } catch {
      setMessage("Could not update wishlist.");
    }
  }

  function addToCart(buyNow = false) {
    if (!product) return;

    if (!selectedSize || available <= 0) {
      setMessage("Please select an available size.");
      return;
    }

    if (quantity > available) {
      setMessage(`Only ${available} available in size ${selectedSize}.`);
      return;
    }

    try {
      const raw = localStorage.getItem("dreamzy-cart");
      const cart = raw ? JSON.parse(raw) : [];
      const nextCart = Array.isArray(cart) ? [...cart] : [];
      const cartId = `${product.id}-${selectedSize}`;

      const existing = nextCart.find(
        (item: any) => item.id === cartId
      );

      const currentQuantity = Number(existing?.quantity || 0);

      if (currentQuantity + quantity > available) {
        setMessage(
          `Only ${available} available in size ${selectedSize}.`
        );
        return;
      }

      if (existing) {
        existing.quantity = currentQuantity + quantity;
      } else {
        nextCart.push({
          id: cartId,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: selectedSize,
          quantity,
        });
      }

      localStorage.setItem("dreamzy-cart", JSON.stringify(nextCart));
      setCartItems(nextCart);
      window.dispatchEvent(new Event("dreamzy-cart-updated"));

      if (buyNow) {
        window.location.href = "/checkout";
      } else {
        setMessage("Added to cart ♥");
        window.dispatchEvent(new Event("dreamzy-cart-updated"));
        setTimeout(() => setMessage(""), 1800);
      }
    } catch {
      setMessage("Could not add product to cart.");
    }
  }

  function logout() {
    localStorage.removeItem("dreamzy-account");
    window.dispatchEvent(new Event("dreamzy-account-updated"));
    setMenuOpen(false);
    window.location.href = "/";
  }

  if (!product) {
    return (
      <main className="product-page">
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
              onClick={() => setAccountOpen((open) => !open)}
            >
              <span>ACCOUNT</span>
              <span className={`account-chevron ${accountOpen ? "open" : ""}`}>⌄</span>
            </button>

            {accountOpen && (
              <div className="mobile-account-dropdown">
                <Link href="/account" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  <span className="account-dropdown-icon">♙</span>
                  <span>My Account</span>
                </Link>
                <Link href="/account#orders" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  <span className="account-dropdown-icon">□</span>
                  <span>My Orders</span>
                </Link>
                <Link href="/account#addresses" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  <span className="account-dropdown-icon">⌖</span>
                  <span>My Addresses</span>
                </Link>
                <Link href="/wishlist" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  <span className="account-dropdown-icon">♡</span>
                  <span>Wishlist</span>
                </Link>
                <div className="account-dropdown-divider" />
                <button type="button" className="mobile-account-logout" onClick={logout}>
                  <span className="account-dropdown-icon">↪</span>
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

        <section className="not-found">
          <div className="eyebrow">DREAMZY</div>
          <h1>Product not found</h1>
          <p>This product is no longer available.</p>
          <Link href="/women" className="primary-link">CONTINUE SHOPPING</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="product-page">
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
              onClick={() => setAccountOpen((open) => !open)}
            >
              <span>ACCOUNT</span>
              <span className={`account-chevron ${accountOpen ? "open" : ""}`}>⌄</span>
            </button>

            {accountOpen && (
              <div className="mobile-account-dropdown">
                <Link href="/account" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  <span className="account-dropdown-icon">♙</span>
                  <span>My Account</span>
                </Link>
                <Link href="/account#orders" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  <span className="account-dropdown-icon">□</span>
                  <span>My Orders</span>
                </Link>
                <Link href="/account#addresses" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  <span className="account-dropdown-icon">⌖</span>
                  <span>My Addresses</span>
                </Link>
                <Link href="/wishlist" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  <span className="account-dropdown-icon">♡</span>
                  <span>Wishlist</span>
                </Link>
                <div className="account-dropdown-divider" />
                <button type="button" className="mobile-account-logout" onClick={logout}>
                  <span className="account-dropdown-icon">↪</span>
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

      {message && <div className="toast">{message}</div>}

      <div className="breadcrumb">
        <Link href="/">HOME</Link>
        <span>/</span>
        <Link href={product.category === "Kids" ? "/kids" : "/women"}>
          {product.category.toUpperCase()}
        </Link>
        <span>/</span>
        <span>{product.name.toUpperCase()}</span>
      </div>

      <section className="product-detail">
        <div className="product-gallery">
          <div className="main-image">
            <img src={(product.gallery?.[activeImage] || product.image)} alt={`${product.name} ${["front view", "back view", "left view", "right view", "additional view"][activeImage] || "view"}`} />
            {product.tag && <span className="product-tag">{product.tag}</span>}
            <button
              type="button"
              className={`product-image-wishlist ${isWishlisted ? "active" : ""}`}
              onClick={toggleWishlist}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={isWishlisted}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isWishlisted ? "♥" : "♡"}
            </button>
            <button
              type="button"
              className="gallery-arrow gallery-arrow-left"
              onClick={() => setActiveImage((activeImage - 1 + (product.gallery?.length || 1)) % (product.gallery?.length || 1))}
              aria-label="Previous product photo"
            >‹</button>
            <button
              type="button"
              className="gallery-arrow gallery-arrow-right"
              onClick={() => setActiveImage((activeImage + 1) % (product.gallery?.length || 1))}
              aria-label="Next product photo"
            >›</button>
            <span className="view-count">{activeImage + 1} / {product.gallery?.length || 1}</span>
          </div>
          <div className="gallery-thumbs" aria-label="Product photos">
            {(product.gallery?.length ? product.gallery.slice(0, 5) : [product.image]).map((src, index) => {
              const labels = ["Front View", "Back View", "Left View", "Right View", "Additional View"];
              return (
                <div className="gallery-thumb-wrap" key={`${src}-${index}`}>
                  <button
                    type="button"
                    className={`gallery-thumb ${activeImage === index ? "active" : ""}`}
                    onClick={() => setActiveImage(index)}
                    aria-label={`${labels[index]} of ${product.name}`}
                  >
                    <img src={src} alt={`${product.name} ${labels[index]}`} />
                  </button>
                  <span>{labels[index]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="product-info">
          <div className="eyebrow">DREAMZY {product.category.toUpperCase()}</div>

          <h1>{product.name}</h1>

          <div className="price">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </div>

          <div className="rating-summary">
            <div className="rating-stars">
              {stars(averageRating)}
            </div>
            <span>
              {productReviews.length
                ? `${averageRating.toFixed(1)} · ${productReviews.length} ${
                    productReviews.length === 1 ? "review" : "reviews"
                  }`
                : "No reviews yet"}
            </span>
          </div>

          <div className={`stock-badge ${stockState.className}`}>
            {stockState.label}
          </div>

          <div className="divider" />

          <p className="description">
            Designed for beautiful nights, this DREAMZY nightwear piece
            combines a soft, comfortable feel with an elegant everyday style.
            Perfect for relaxing at home and enjoying a comfortable night's
            sleep.
          </p>

          <div className="shipping-note">
            <strong>FREE SHIPPING</strong>
            <span>Free shipping on every DREAMZY order.</span>
          </div>

          <div className="size-section">
            <div className="field-heading">
              <span>SELECT SIZE</span>
              <span>{selectedSize ? `Size ${selectedSize}` : "Choose a size"}</span>
            </div>

            <div className="size-grid">
              {product.sizes.map((size) => {
                const sizeStock = Number(product.sizeStock[size] || 0);
                const active = selectedSize === size;

                return (
                  <button
                    key={size}
                    type="button"
                    disabled={sizeStock <= 0}
                    onClick={() => {
                      setSelectedSize(size);
                      setQuantity(1);
                      setMessage("");
                    }}
                    className={`size-button ${active ? "selected" : ""} ${
                      sizeStock <= 0 ? "disabled" : ""
                    }`}
                  >
                    {size}
                    {sizeStock <= 0 && <small>SOLD OUT</small>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="quantity-section">
            <div className="field-heading">
              <span>QUANTITY</span>
              <span>{available <= 0 ? "Unavailable" : available < 5 ? `${available} available` : ""}</span>
            </div>

            <div className="quantity-control">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((value) => Math.min(available || 1, value + 1))
                }
                disabled={quantity >= available}
              >
                +
              </button>
            </div>
          </div>

          <div className="action-buttons">
            <button
              type="button"
              className="add-button"
              disabled={available <= 0}
              onClick={() => {
                if (alreadyInCart) {
                  window.location.href = "/checkout";
                } else {
                  addToCart(false);
                }
              }}
            >
              {alreadyInCart ? "PROCEED TO CHECKOUT" : "ADD TO CART"}
            </button>

            <button
              type="button"
              className="buy-button"
              disabled={available <= 0}
              onClick={() => addToCart(true)}
            >
              BUY NOW
            </button>
          </div>

          <div className="product-points">
            <div>
              <span className="point-icon">♧</span>
              <strong>PREMIUM FABRIC</strong>
              <span>Soft &amp; Breathable</span>
            </div>
            <div>
              <span className="point-icon">⌁</span>
              <strong>LIGHTWEIGHT</strong>
              <span>All Day Comfort</span>
            </div>
            <div>
              <span className="point-icon">◇</span>
              <strong>ELEGANT DESIGN</strong>
              <span>For Everyday Wear</span>
            </div>
            <div>
              <span className="point-icon">♡</span>
              <strong>SKIN FRIENDLY</strong>
              <span>Gentle on Skin</span>
            </div>
          </div>
        </div>
      </section>

      <section className="product-description">
        <div className="description-tabs" role="tablist" aria-label="Product information">
          <button className={activeTab === "description" ? "active" : ""} type="button" onClick={() => setActiveTab("description")} role="tab" aria-selected={activeTab === "description"}>Description</button>
          <button className={activeTab === "size" ? "active" : ""} type="button" onClick={() => setActiveTab("size")} role="tab" aria-selected={activeTab === "size"}>Size Guide</button>
          <button className={activeTab === "shipping" ? "active" : ""} type="button" onClick={() => setActiveTab("shipping")} role="tab" aria-selected={activeTab === "shipping"}>Shipping &amp; Returns</button>
          <button className={activeTab === "reviews" ? "active" : ""} type="button" onClick={() => setActiveTab("reviews")} role="tab" aria-selected={activeTab === "reviews"}>Reviews</button>
        </div>

        {activeTab === "description" && (
          <div className="description-content">
            <div className="description-copy">
              <div className="eyebrow">DETAILS</div>
              <h2>Comfort for beautiful nights.</h2>
              <p>
                DREAMZY nightwear is designed around comfort, easy movement and a premium everyday look. Made with soft, breathable fabric, the {product.name} is perfect for relaxing at home or enjoying a peaceful night&apos;s sleep.
              </p>
              <ul>
                <li>Soft and breathable fabric</li>
                <li>Elegant DREAMZY design</li>
                <li>Comfortable fit for everyday wear</li>
                <li>Perfect for lounging and nightwear</li>
                <li>Premium quality stitching</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "size" && (
          <div className="info-tab-panel">
            <div className="eyebrow">SIZE GUIDE</div>
            <h2>Find your comfortable fit.</h2>
            <p>Select the size that matches your usual nightwear fit. For the best fit, check the product size options above before adding the item to your cart.</p>
            <div className="size-guide-grid">
              {product.sizes.map((size) => (
                <div className="size-guide-card" key={size}>
                  <strong>{size}</strong>
                  <span>Available: {Number(product.sizeStock[size] || 0)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="info-tab-panel">
            <div className="eyebrow">SHIPPING &amp; RETURNS</div>
            <h2>Simple, secure delivery.</h2>
            <div className="policy-grid">
              <div><strong>Free Shipping</strong><p>Free shipping on every DREAMZY order.</p></div>
              <div><strong>Easy Returns</strong><p>Returns are handled according to the DREAMZY return policy.</p></div>
              <div><strong>Secure Packaging</strong><p>Your order is carefully packed before dispatch.</p></div>
              <div><strong>Need Help?</strong><p>Contact us if you need assistance with your delivery or return.</p></div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="info-tab-panel reviews-panel">
            <div className="eyebrow">CUSTOMER REVIEWS</div>
            <h2>Reviews</h2>
            {productReviews.length === 0 ? (
              <div className="no-reviews">
                <div className="review-stars">★★★★★</div>
                <h3>Be the first to review this product.</h3>
                <p>Purchased this DREAMZY product? Once your order is delivered, you can share your experience from your order details.</p>
              </div>
            ) : (
              <div className="review-list">
                {productReviews.map((review) => (
                  <article className="review-item" key={review.id}>
                    <div className="review-item-top"><strong>{review.customerName}</strong><span>{"★".repeat(Math.max(0, Math.min(5, Number(review.rating) || 0)))}</span></div>
                    <p>{review.review}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {relatedProducts.length > 0 && (
        <section className="related-products">
          <div className="related-heading">
            <h2>You May Also Like</h2>
            <Link href={product.category === "Kids" ? "/kids" : "/women"}>View All →</Link>
          </div>
          <div className="related-grid">
            {relatedProducts.map((item: any) => (
              <Link href={`/product/${item.id}`} className="related-card" key={item.id}>
                <div className="related-image">
                  <img src={item.image} alt={item.name} />
                  <span className="related-heart">♡</span>
                </div>
                <div className="related-name">{item.name}</div>
                <div className="related-price">₹{Number(item.price).toLocaleString("en-IN")}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

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
              Women&apos;s Collection <span aria-hidden="true">›</span>
            </Link>
            <Link href="/kids" onClick={() => setCategoriesOpen(false)}>
              Kids Collection <span aria-hidden="true">›</span>
            </Link>
          </div>
        </div>
      )}



      <style jsx>{`
        .product-page {
          min-height: 100vh;
          background: #faf6f1;
          color: #542f35;
          font-family: Arial, sans-serif;
        }

        .product-header {
          background: #fffdfb;
          border-bottom: 1px solid #eadfd8;
          padding: 20px 28px;
          position: relative;
          z-index: 30;
        }

        .product-header-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .product-logo {
          color: #542f35;
          text-decoration: none;
          font-family: Georgia, serif;
          font-size: 30px;
          letter-spacing: 3px;
        }

        .product-nav {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .product-nav a,
        .product-nav button {
          color: #542f35;
          text-decoration: none;
          border: 0;
          background: transparent;
          font-size: 12px;
          letter-spacing: 1px;
          cursor: pointer;
          padding: 0;
        }

        .product-menu-button {
          display: none;
          width: 36px;
          height: 36px;
          border: 1px solid #bda9a6;
          background: #fffdfb;
          color: #542f35;
          font-size: 18px;
          cursor: pointer;
        }

        .breadcrumb {
          max-width: 1200px;
          margin: 0 auto;
          padding: 12px 25px 10px;
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
          align-items: center;
          color: #987276;
          font-size: 9px;
          letter-spacing: 1.3px;
          border-top: 1px solid #eadfd8;
          border-bottom: 1px solid #eadfd8;
          background: #faf6f1;
        }

        .breadcrumb a {
          color: #542f35;
          text-decoration: none;
        }

        .product-detail {
          max-width: 1240px;
          margin: 0 auto;
          padding: 8px 24px 72px;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(0, .92fr);
          gap: 52px;
          align-items: start;
        }

        .main-image {
          aspect-ratio: 1.05 / 1;
          background: #eee5df;
          position: relative;
          overflow: hidden;
          border: 1px solid #eadfd8;
        }

        .main-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center;
          image-rendering: auto;
          filter: none;
        }

        .gallery-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 1px solid #dfcfca;
          background: rgba(255,253,251,.94);
          color: #542f35;
          font-size: 30px;
          line-height: 1;
          cursor: pointer;
          z-index: 2;
        }

        .gallery-arrow-left { left: 18px; }
        .gallery-arrow-right { right: 18px; }

        .view-count {
          position: absolute;
          right: 16px;
          bottom: 16px;
          background: rgba(84,47,53,.86);
          color: #fff;
          padding: 7px 10px;
          font-size: 10px;
          letter-spacing: 1px;
        }

        .product-tag {
          position: absolute;
          top: 18px;
          left: 18px;
          background: #fffdfb;
          padding: 9px 12px;
          font-size: 10px;
          letter-spacing: 1.5px;
          font-weight: 700;
        }

        .gallery-thumbs {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
          margin-top: 14px;
        }

        .gallery-thumb-wrap {
          min-width: 0;
          text-align: center;
        }

        .gallery-thumb {
          width: 100%;
          border: 1px solid #e3d2cd;
          background: #fffdfb;
          padding: 0;
          cursor: pointer;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          display: block;
        }

        .gallery-thumb.active {
          border: 2px solid #542f35;
        }

        .gallery-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .gallery-thumb-wrap > span {
          display: block;
          margin-top: 7px;
          color: #765b5e;
          font-size: 10px;
          letter-spacing: .7px;
          text-transform: uppercase;
        }

        .product-info {
          padding: 12px 0;
        }

        .eyebrow {
          font-size: 10px;
          letter-spacing: 3px;
          color: #987276;
          font-weight: 700;
        }

        .product-info h1 {
          font-family: Georgia, serif;
          font-size: 46px;
          line-height: 1.08;
          font-weight: 400;
          margin: 12px 0 14px;
        }

        .price {
          font-size: 22px;
          font-weight: 700;
        }

        .stock-badge {
          display: inline-block;
          margin-top: 14px;
          padding: 7px 10px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .stock-good {
          background: #e4efe4;
          color: #35633b;
        }

        .stock-low {
          background: #f5e6c8;
          color: #8a5a18;
        }

        .stock-out {
          background: #f3d7d7;
          color: #8a3038;
        }

        .divider {
          border-top: 1px solid #eadfd8;
          margin: 25px 0;
        }

        .description {
          color: #765b5e;
          line-height: 1.8;
          font-size: 14px;
        }

        .shipping-note {
          display: flex;
          flex-direction: column;
          gap: 5px;
          background: #fffdfb;
          border: 1px solid #eadfd8;
          padding: 15px;
          margin: 22px 0;
        }

        .shipping-note strong {
          font-size: 10px;
          letter-spacing: 1.5px;
        }

        .shipping-note span {
          font-size: 12px;
          color: #80676a;
        }

        .product-wishlist-button {
          width: 100%;
          min-height: 46px;
          margin-top: 12px;
          border: 1px solid #cdb9b5;
          background: #fffdfb;
          color: #542f35;
          cursor: pointer;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.2px;
          transition: all .2s ease;
        }

        .product-wishlist-button:hover,
        .product-wishlist-button.active {
          border-color: #542f35;
          background: #f5ebe7;
        }

        .size-section,
        .quantity-section {
          margin-top: 25px;
        }

        .field-heading {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 12px;
          font-size: 10px;
          letter-spacing: 1.3px;
          font-weight: 700;
        }

        .field-heading span:last-child {
          color: #987276;
          letter-spacing: .5px;
          text-transform: none;
        }

        .size-grid {
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
        }

        .size-button {
          min-width: 58px;
          min-height: 46px;
          border: 1px solid #cdb9b5;
          background: #fffdfb;
          color: #542f35;
          cursor: pointer;
          font-weight: 700;
          position: relative;
        }

        .size-button.selected {
          background: #542f35;
          border-color: #542f35;
          color: #fff;
        }

        .size-button.disabled {
          color: #b9aaa6;
          background: #f3eeeb;
          text-decoration: line-through;
          cursor: not-allowed;
        }

        .size-button small {
          display: block;
          font-size: 6px;
          letter-spacing: .5px;
          margin-top: 2px;
          text-decoration: none;
        }

        .quantity-control {
          width: 145px;
          height: 46px;
          display: grid;
          grid-template-columns: 42px 1fr 42px;
          border: 1px solid #cdb9b5;
          background: #fffdfb;
        }

        .quantity-control button {
          border: 0;
          background: transparent;
          color: #542f35;
          font-size: 20px;
          cursor: pointer;
        }

        .quantity-control button:disabled {
          opacity: .3;
          cursor: not-allowed;
        }

        .quantity-control span {
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          border-left: 1px solid #eadfd8;
          border-right: 1px solid #eadfd8;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 28px;
        }

        .add-button,
        .buy-button {
          height: 54px;
          border: 0;
          cursor: pointer;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .add-button {
          background: #542f35;
          color: #fff;
        }

        .buy-button {
          background: #fffdfb;
          color: #542f35;
          border: 1px solid #542f35;
        }

        .add-button:disabled,
        .buy-button:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        .product-points {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 18px;
          margin-top: 28px;
          padding-top: 22px;
          border-top: 1px solid #eadfd8;
        }

        .product-points div {
          text-align: center;
          min-width: 0;
        }

        .product-points .point-icon {
          color: #542f35;
          font-size: 30px;
          line-height: 1;
          margin-bottom: 9px;
          font-family: Georgia, serif;
        }

        .product-points strong,
        .product-points div > span:last-child {
          display: block;
        }

        .product-points strong {
          font-size: 9px;
          letter-spacing: 1px;
        }

        .product-points div > span:last-child {
          margin-top: 5px;
          color: #80676a;
          font-size: 10px;
        }

        .rating-summary {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 10px;
          color: #80676a;
          font-size: 12px;
        }

        .rating-stars {
          display: inline-flex;
          gap: 1px;
          letter-spacing: 1px;
          color: #d5c6c1;
          font-size: 16px;
        }

        .rating-stars .filled {
          color: #a46a45;
        }

        .reviews-section {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px 68px;
        }

        .reviews-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          border-bottom: 1px solid #eadfd8;
          padding-bottom: 18px;
        }

        .reviews-heading h2 {
          font-family: Georgia, serif;
          font-size: 38px;
          font-weight: 400;
          margin: 8px 0 0;
        }

        .review-overview {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 2px;
        }

        .big-rating {
          font-family: Georgia, serif;
          font-size: 38px;
        }

        .rating-stars.large {
          font-size: 17px;
        }

        .review-count {
          color: #80676a;
          font-size: 11px;
          margin-top: 4px;
        }

        .no-reviews {
          text-align: center;
          padding: 45px 20px;
          border-bottom: 1px solid #eadfd8;
        }

        .no-review-stars {
          color: #d5c6c1;
          letter-spacing: 3px;
          font-size: 21px;
        }

        .no-reviews h3 {
          font-family: Georgia, serif;
          font-size: 23px;
          font-weight: 400;
          margin: 12px 0 8px;
        }

        .no-reviews p {
          max-width: 560px;
          margin: 0 auto;
          color: #80676a;
          font-size: 13px;
          line-height: 1.7;
        }

        .review-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          padding-top: 20px;
        }

        .review-card {
          background: #fffdfb;
          border: 1px solid #eadfd8;
          padding: 22px;
        }

        .review-card-top {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          align-items: center;
        }

        .review-date {
          color: #987276;
          font-size: 10px;
        }

        .review-copy {
          color: #765b5e;
          line-height: 1.75;
          font-size: 13px;
          margin: 17px 0;
        }

        .review-author {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .review-author strong {
          font-size: 11px;
        }

        .verified-badge {
          color: #35633b;
          background: #e4efe4;
          padding: 5px 7px;
          font-size: 7px;
          font-weight: 700;
          letter-spacing: .7px;
        }

        .product-description {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px 76px;
          text-align: left;
        }

        .product-description h2 {
          font-family: Georgia, serif;
          font-weight: 400;
          font-size: 34px;
          margin: 10px 0;
        }

        .product-description p {
          color: #765b5e;
          line-height: 1.8;
          font-size: 14px;
        }

        .description-tabs {
          display: flex;
          gap: 34px;
          border-bottom: 1px solid #eadfd8;
          margin-bottom: 28px;
          overflow-x: auto;
        }

        .description-tabs button {
          border: 0;
          background: transparent;
          color: #765b5e;
          padding: 14px 0 13px;
          font-size: 12px;
          cursor: pointer;
          white-space: nowrap;
        }

        .description-tabs button.active {
          color: #542f35;
          border-bottom: 2px solid #542f35;
          font-weight: 700;
        }

        .description-content {
          display: grid;
          grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr);
          gap: 58px;
          align-items: center;
          text-align: left;
          padding-top: 8px;
        }

        .info-tab-panel {
          min-height: 230px;
          padding: 12px 0 6px;
          text-align: left;
        }

        .info-tab-panel h2 {
          font-family: Georgia, serif;
          font-weight: 400;
          font-size: 31px;
          margin: 10px 0 14px;
          color: #542f35;
        }

        .info-tab-panel > p {
          color: #765b5e;
          line-height: 1.8;
          max-width: 760px;
        }

        .size-guide-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 12px;
          margin-top: 24px;
          max-width: 760px;
        }

        .size-guide-card {
          border: 1px solid #e5d6cf;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 7px;
          background: #fffdfb;
        }

        .size-guide-card strong { color: #542f35; font-size: 16px; }
        .size-guide-card span { color: #8a7777; font-size: 12px; }

        .policy-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          max-width: 850px;
          margin-top: 24px;
        }

        .policy-grid > div {
          border: 1px solid #e5d6cf;
          padding: 18px;
          background: #fffdfb;
        }

        .policy-grid strong { color: #542f35; }
        .policy-grid p { color: #765b5e; margin: 8px 0 0; line-height: 1.6; font-size: 13px; }

        .reviews-panel { text-align: left; }
        .no-reviews {
          text-align: center;
          border-top: 1px solid #eadfd8;
          border-bottom: 1px solid #eadfd8;
          padding: 48px 20px;
          margin-top: 18px;
        }
        .review-stars { color: #d9c4bc; letter-spacing: 4px; font-size: 18px; }
        .no-reviews h3 { font-family: Georgia, serif; font-size: 22px; font-weight: 400; margin: 12px 0 8px; color: #542f35; }
        .no-reviews p { color: #765b5e; max-width: 650px; margin: 0 auto; line-height: 1.7; font-size: 13px; }
        .review-list { max-width: 850px; margin-top: 20px; }
        .review-item { border-top: 1px solid #eadfd8; padding: 20px 0; }
        .review-item-top { display: flex; justify-content: space-between; gap: 20px; color: #542f35; }
        .review-item-top span { letter-spacing: 2px; }
        .review-item p { color: #765b5e; line-height: 1.7; margin: 8px 0 0; }

        .description-copy h2 {
          font-family: Georgia, serif;
          font-weight: 400;
          font-size: 31px;
          margin: 10px 0 14px;
        }

        .description-copy p {
          color: #765b5e;
          line-height: 1.8;
          font-size: 13px;
        }

        .description-copy ul {
          padding: 0;
          margin: 20px 0 0;
          list-style: none;
        }

        .description-copy li {
          color: #765b5e;
          font-size: 13px;
          margin: 9px 0;
        }

        .description-copy li::before {
          content: "✓";
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #542f35;
          color: #fff;
          font-size: 10px;
          margin-right: 10px;
        }

        .description-image {
          height: 330px;
          overflow: hidden;
          background: #eee5df;
          border: 1px solid #eadfd8;
        }

        .description-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .related-products {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px 76px;
        }

        .related-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
        }

        .related-heading h2 {
          font-family: Georgia, serif;
          font-size: 30px;
          font-weight: 400;
          margin: 0;
        }

        .related-heading a {
          color: #542f35;
          font-size: 11px;
          text-decoration: none;
          font-weight: 700;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 16px;
        }

        .related-card {
          color: #542f35;
          text-decoration: none;
          min-width: 0;
        }

        .related-image {
          position: relative;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background: #eee5df;
          border: 1px solid #eadfd8;
        }

        .related-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .related-heart {
          position: absolute;
          top: 9px;
          right: 9px;
          width: 27px;
          height: 27px;
          border-radius: 50%;
          background: #fffdfb;
          border: 1px solid #e3d2cd;
          display: grid;
          place-items: center;
          font-size: 15px;
        }

        .related-name {
          margin-top: 10px;
          font-family: Georgia, serif;
          font-size: 13px;
          line-height: 1.35;
        }

        .related-price {
          margin-top: 5px;
          font-size: 12px;
          font-weight: 700;
        }

        .primary-link {
          display: inline-block;
          margin-top: 20px;
          background: #542f35;
          color: #fff;
          text-decoration: none;
          padding: 14px 22px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .not-found {
          max-width: 700px;
          margin: 0 auto;
          padding: 120px 25px;
          text-align: center;
        }

        .not-found h1 {
          font-family: Georgia, serif;
          font-weight: 400;
          font-size: 44px;
          margin: 12px 0;
        }

        .not-found p {
          color: #765b5e;
        }

        .toast {
          position: fixed;
          top: 85px;
          right: 25px;
          z-index: 100;
          background: #542f35;
          color: #fff;
          padding: 14px 20px;
          box-shadow: 0 5px 20px rgba(0,0,0,.15);
          font-size: 14px;
        }

        .footer {
          padding: 48px 42px 24px;
          background: #542f35;
          color: #fff8f4;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        .footer-main {
          max-width: 1500px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 0.95fr 1.25fr 0.95fr;
          align-items: center;
          gap: 52px;
          padding: 0 8px 46px;
        }

        .footer-logo-panel {
          width: min(100%, 470px);
          padding: 16px;
          background: #fffaf6;
          justify-self: start;
        }

        .footer-logo-image {
          display: block;
          width: 100%;
          height: auto;
          aspect-ratio: 1 / 0.78;
          object-fit: contain;
          background: #fffaf6;
        }

        .footer-center {
          min-width: 0;
          align-self: center;
        }

        .footer-brand-title {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 43px;
          line-height: 1;
          letter-spacing: 2px;
          color: #fffaf6;
        }

        .footer-tagline {
          margin: 17px 0 0;
          max-width: 390px;
          color: #fff4ef;
          font-size: 18px;
          line-height: 1.45;
        }

        .footer-short-line {
          width: 84px;
          height: 1px;
          margin: 28px 0 22px;
          background: rgba(255, 220, 215, 0.75);
        }

        .footer-description {
          max-width: 420px;
          margin: 0;
          color: #ead8d5;
          font-size: 15px;
          line-height: 1.7;
        }

        .footer-quick-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px 14px;
          max-width: 390px;
          margin-top: 30px;
        }

        .footer-quick-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 9px;
          color: #fff8f4;
          text-decoration: none;
          font-size: 12px;
        }

        .footer-circle {
          width: 66px;
          height: 66px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(244, 190, 184, 0.9);
          border-radius: 50%;
          color: #fff7f2;
          font-size: 25px;
          line-height: 1;
        }

        .footer-quick-link:hover .footer-circle {
          background: rgba(255, 255, 255, 0.08);
        }

        .footer-right {
          padding-left: 36px;
          border-left: 1px solid rgba(255, 220, 215, 0.45);
        }

        .footer-right-label,
        .footer-follow-label {
          color: #f4d5d1;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 4px;
        }

        .footer-quick-policy {
          display: flex;
          flex-direction: column;
          margin-top: 19px;
        }

        .footer-quick-policy a {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 8px 0;
          color: #fff8f4;
          text-decoration: none;
          font-size: 14px;
        }

        .footer-quick-policy a span {
          color: #e8bcb7;
          font-size: 21px;
          line-height: 1;
        }

        .footer-quick-policy a:hover {
          color: #f4c9c4;
        }

        .footer-follow-divider {
          height: 1px;
          margin: 23px 0 21px;
          background: rgba(255, 220, 215, 0.4);
        }

        .footer-follow-label {
          margin-bottom: 15px;
        }

        .footer-social {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-social-circle {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(244, 190, 184, 0.9);
          border-radius: 50%;
          color: #fff7f2;
          text-decoration: none;
          font-size: 20px;
          font-weight: 600;
        }

        .footer-social-circle:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .footer-bottom {
          max-width: 1500px;
          margin: 0 auto;
          padding: 24px 0 0;
          border-top: 1px solid rgba(255, 220, 215, 0.4);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          color: #d8c3c0;
          font-size: 12px;
        }

        .footer-made {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer-made span {
          color: #f1b8b2;
          font-size: 16px;
        }

        @media (max-width: 900px) {
          .footer-main {
            grid-template-columns: 1fr 1fr;
            gap: 35px;
          }

          .footer-logo-panel {
            width: min(100%, 360px);
          }

          .footer-center {
            grid-column: 2;
          }

          .footer-right {
            grid-column: 1 / -1;
            padding-left: 0;
            padding-top: 28px;
            border-left: 0;
            border-top: 1px solid rgba(255, 220, 215, 0.35);
          }

          .footer-quick-policy {
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 30px;
          }

          .footer-quick-links {
            max-width: 330px;
          }
        }

        @media (max-width: 600px) {
          .footer {
            padding: 36px 18px 24px;
          }

          .footer-main {
            grid-template-columns: 1fr;
            gap: 30px;
            padding-bottom: 34px;
          }

          .footer-logo-panel {
            width: min(100%, 330px);
            justify-self: center;
          }

          .footer-center {
            grid-column: auto;
            text-align: center;
          }

          .footer-brand-title {
            font-size: 35px;
          }

          .footer-tagline,
          .footer-description {
            margin-left: auto;
            margin-right: auto;
          }

          .footer-short-line {
            margin-left: auto;
            margin-right: auto;
          }

          .footer-quick-links {
            margin-left: auto;
            margin-right: auto;
            max-width: 330px;
          }

          .footer-circle {
            width: 55px;
            height: 55px;
            font-size: 21px;
          }

          .footer-right {
            grid-column: auto;
            padding-top: 28px;
          }

          .footer-quick-policy {
            grid-template-columns: 1fr;
          }

          .footer-social {
            justify-content: flex-start;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
            padding-top: 22px;
          }
        }
        @media (max-width: 900px) {
          .product-header {
            padding: 14px 18px;
          }

          .product-menu-button {
            display: block;
          }

          .product-logo {
            font-size: 23px;
            letter-spacing: 2px;
          }

          .product-nav {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #fffdfb;
            border: 1px solid #eadfd8;
            padding: 10px 18px;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            box-shadow: 0 8px 20px rgba(84,47,53,.08);
          }

          .product-nav.open {
            display: flex;
          }

          .product-nav a,
          .product-nav button {
            padding: 14px 6px;
            border-bottom: 1px solid #f0e7e2;
            text-align: left;
          }

          .product-detail {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 18px 16px 60px;
          }

          .main-image {
            aspect-ratio: 1.05 / 1;
          }

          .main-image img {
            min-height: 0;
          }

          .gallery-thumbs {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
          margin-top: 14px;
        }

        .gallery-thumb-wrap {
          min-width: 0;
          text-align: center;
        }

        .gallery-thumb {
          width: 100%;
          border: 1px solid #e3d2cd;
          background: #fffdfb;
          padding: 0;
          cursor: pointer;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          display: block;
        }

        .gallery-thumb.active {
          border: 2px solid #542f35;
        }

        .gallery-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .gallery-thumb-wrap > span {
          display: block;
          margin-top: 7px;
          color: #765b5e;
          font-size: 10px;
          letter-spacing: .7px;
          text-transform: uppercase;
        }

        .product-info {
            padding: 10px 0;
          }

          .product-info h1 {
            font-size: 40px;
          }

          .breadcrumb {
            padding: 20px 16px 0;
          }
        }

        @media (max-width: 560px) {
          .main-image {
            aspect-ratio: 1 / 1;
          }

          .main-image img {
            min-height: 0;
          }

          .product-info h1 {
            font-size: 34px;
          }

          .action-buttons {
            grid-template-columns: 1fr;
          }

          .reviews-section {
            padding: 0 16px 60px;
          }

          .reviews-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 18px;
          }

          .review-list {
            grid-template-columns: 1fr;
          }

          .product-description {
            padding-bottom: 60px;
          }

          .description-content {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .description-image {
            height: 280px;
          }

          .related-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .product-description h2 {
            font-size: 28px;
          }

          .toast {
            left: 16px;
            right: 16px;
            top: 75px;
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
            margin-left: 0;
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
            box-sizing: border-box;
          }

          .mobile-account-menu { display: block; }
          .mobile-account-button { padding: 9px 4px !important; }
          .mobile-account-dropdown a,
          .mobile-account-logout { padding: 9px 8px !important; font-size: 11px !important; }

          .nav a:last-of-type {
            border-bottom: 1px solid #f0e7e2;
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


        /* Exact DREAMZY Home Page header styles copied for Product Detail page */
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
        .mobile-account-menu { display: none; }
        .mobile-account-button { display: flex; align-items: center; justify-content: space-between; width: 100%; border: 0; background: transparent; color: #542f35; font: inherit; cursor: pointer; }
        .mobile-account-dropdown { padding: 2px 0 6px; }
        .mobile-account-dropdown a,
        .mobile-account-logout { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 8px !important; border: 0 !important; background: transparent; color: #765b5e; text-decoration: none; font-size: 11px !important; letter-spacing: .8px !important; text-align: left; cursor: pointer; }
        .account-dropdown-icon { width: 18px; text-align: center; font-size: 16px; flex: 0 0 18px; }
        .account-dropdown-divider { height: 1px; margin: 3px 8px; background: #eadfd8; }
        .account-menu-wrap { position: relative; margin-left: 8px; }
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
        .account-chevron.open { transform: rotate(180deg) translateY(2px); }
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
        .account-dropdown a, .account-logout {
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
        .account-dropdown a:hover, .account-logout:hover { background: #faf3ef; }
        .account-dropdown-icon {
          width: 28px;
          height: 28px;
          flex: 0 0 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #542f35;
        }
        .account-dropdown-icon svg { width: 26px; height: 26px; }
        .account-dropdown-divider { height: 1px; background: #eadfd8; margin: 0; }
        @media (max-width: 900px) {
          .header { height: 64px; padding: 0 18px; position: relative; }
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
          .account-menu-wrap { display: none; }
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
            margin-left: 0;
            box-shadow: 0 8px 20px rgba(84, 47, 53, 0.08);
            z-index: 100;
          }
          .nav.open { display: flex !important; }
          .nav a, .nav button {
            width: 100%;
            padding: 14px 4px !important;
            border-bottom: 1px solid #f0e7e2;
            font-size: 12px !important;
            letter-spacing: 1.2px !important;
            text-align: left;
          }
          .nav a:last-of-type { border-bottom: 1px solid #f0e7e2; }
        }
        @media (max-width: 600px) {
          .header { height: 60px; padding: 0 14px; }
          .logo { font-size: 22px; letter-spacing: 2px; }
          .menu-button { width: 34px; height: 34px; }
          .nav { top: 60px; }
        }
      `}
      </style>

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

      `}</style>
      <style jsx global>{`
        /* Force the Product page header to use the exact Home page desktop measurements. */
        .product-page .header {
          box-sizing: border-box !important;
          height: 72px !important;
          width: 100% !important;
          background: #fffdfb !important;
          border-bottom: 1px solid #eadfd8 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 0 42px !important;
          position: relative !important;
          z-index: 20 !important;
          gap: 0 !important;
        }
        .product-page .logo {
          display: inline-block !important;
          flex: 0 0 auto !important;
          margin: 0 !important;
          padding: 0 !important;
          font-family: Georgia, serif !important;
          font-size: 29px !important;
          font-weight: 400 !important;
          line-height: normal !important;
          letter-spacing: 3px !important;
          color: #542f35 !important;
          text-decoration: none !important;
          white-space: nowrap !important;
          transform: none !important;
          position: static !important;
        }
        .product-page .menu-button {
          display: none !important;
          width: 36px !important;
          height: 36px !important;
          border: 1px solid #bda9a6 !important;
          background: #fffdfb !important;
          color: #542f35 !important;
          font-size: 18px !important;
          cursor: pointer !important;
        }
        .product-page .nav {
          display: flex !important;
          flex: 0 0 auto !important;
          align-items: center !important;
          justify-content: flex-end !important;
          gap: 27px !important;
          margin: 0 0 0 auto !important;
          padding: 0 !important;
          position: static !important;
          width: auto !important;
          max-width: none !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          flex-direction: row !important;
        }
        .product-page .nav a {
          display: inline !important;
          width: auto !important;
          margin: 0 !important;
          padding: 0 !important;
          border: 0 !important;
          color: #542f35 !important;
          text-decoration: none !important;
          font-family: Arial, sans-serif !important;
          font-size: 11px !important;
          font-weight: 400 !important;
          line-height: normal !important;
          letter-spacing: 1.2px !important;
          text-align: left !important;
          white-space: nowrap !important;
        }
        .product-page .account-menu-wrap {
          display: block !important;
          position: relative !important;
          flex: 0 0 auto !important;
          margin: 0 0 0 8px !important;
        }
        .product-page .account-button {
          display: inline-flex !important;
          align-items: center !important;
          gap: 9px !important;
          margin: 0 !important;
          border: 0 !important;
          background: transparent !important;
          color: #542f35 !important;
          padding: 7px 2px !important;
          font-family: Arial, sans-serif !important;
          font-size: 11px !important;
          font-weight: 400 !important;
          line-height: normal !important;
          letter-spacing: 1.2px !important;
          cursor: pointer !important;
          white-space: nowrap !important;
        }
        .product-page .account-chevron {
          font-size: 18px !important;
          line-height: 1 !important;
          transform: translateY(-2px) !important;
        }
        .product-page .account-chevron.open {
          transform: rotate(180deg) translateY(2px) !important;
        }
        @media (max-width: 900px) {
          .product-page .header {
            height: 64px !important;
            padding: 0 18px !important;
            position: relative !important;
          }
          .product-page .menu-button {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex: 0 0 auto !important;
            width: 36px !important;
            height: 36px !important;
            padding: 0 !important;
          }
          .product-page .logo {
            position: absolute !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            font-size: 25px !important;
            letter-spacing: 2px !important;
          }
          .product-page .account-menu-wrap { display: none !important; }
          .product-page .nav {
            display: none !important;
            position: absolute !important;
            top: 64px !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 5px 18px 8px !important;
            background: #fffdfb !important;
            border-bottom: 1px solid #eadfd8 !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0 !important;
            box-shadow: 0 8px 20px rgba(84, 47, 53, 0.08) !important;
            z-index: 100 !important;
          }
          .product-page .nav.open { display: flex !important; }
          .product-page .mobile-account-menu { display: block !important; }
          .product-page .mobile-account-button { display: flex !important; align-items: center; justify-content: space-between; width: 100%; padding: 9px 4px !important; }
          .product-page .mobile-account-dropdown a,
          .product-page .mobile-account-logout { display: flex !important; align-items: center; gap: 10px; width: 100%; padding: 9px 8px !important; border-bottom: 0 !important; font-size: 11px !important; }

          .product-page .nav a {
            display: block !important;
            width: 100% !important;
            padding: 9px 4px !important;
            border-bottom: 1px solid #f0e7e2 !important;
            font-size: 12px !important;
            letter-spacing: 1.2px !important;
            text-align: left !important;
          }
        }
        @media (max-width: 600px) {
          .product-page .header { height: 60px !important; padding: 0 14px !important; }
          .product-page .logo { font-size: 22px !important; letter-spacing: 2px !important; }
          .product-page .menu-button { width: 34px !important; height: 34px !important; }
          .product-page .nav { top: 60px !important; }
        }


        /* Compact wishlist heart and refined purchase buttons, matching Kids product cards. */
        .product-image-wishlist {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          padding: 0;
          border: 1px solid #ddceca;
          border-radius: 50%;
          background: #fffdfb;
          color: #542f35;
          box-shadow: 0 2px 8px rgba(84, 47, 53, .10);
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          transition: background .2s ease, color .2s ease, transform .2s ease;
        }

        .product-image-wishlist:hover {
          transform: translateY(-1px);
          background: #f7eeeb;
        }

        .product-image-wishlist.active {
          background: #fffdfb;
          color: #8d3347;
          border-color: #d8b8bd;
        }

        .add-button,
        .buy-button {
          height: 46px;
          font-size: 10px;
          letter-spacing: 1.1px;
          transition: background .2s ease, color .2s ease;
        }

        .add-button:hover:not(:disabled) {
          background: #6a3b43;
        }

        .buy-button:hover:not(:disabled) {
          background: #f5ebe7;
        }

        .breadcrumb a {
          display: inline-flex;
          align-items: center;
          min-height: 20px;
        }

        .breadcrumb a:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        @media (max-width: 560px) {
          .product-image-wishlist {
            top: 9px;
            right: 9px;
            width: 34px;
            height: 34px;
            font-size: 20px;
          }

          .action-buttons {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 8px;
            margin-top: 18px;
          }

          .add-button,
          .buy-button {
            width: 100%;
            height: 42px;
            min-height: 42px;
            padding: 0 6px;
            font-size: 9px;
            letter-spacing: .8px;
          }

          .breadcrumb {
            padding: 12px 10px 0 !important;
            gap: 6px;
            font-size: 8px;
            letter-spacing: .8px;
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



        /* Mobile product-detail refinements and fixed quick navigation. */
        .mobile-bottom-nav { display: none; }

        @media (max-width: 600px) {
          .product-page { padding-bottom: 0 !important; }
          .breadcrumb {
            max-width: none !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 10px 5px 9px !important;
            gap: 6px !important;
            display: flex !important;
            align-items: center !important;
            flex-wrap: nowrap !important;
            overflow: hidden !important;
            white-space: nowrap !important;
            color: #987276 !important;
            font-size: 8px !important;
            letter-spacing: .7px !important;
            line-height: 1.2 !important;
            border-bottom: 1px solid #eadfd8 !important;
            background: #faf6f1 !important;
          }
          .breadcrumb a {
            color: #987276 !important;
            flex: 0 0 auto !important;
          }
          .breadcrumb > span:last-child {
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          .product-detail {
            padding: 10px 10px 24px !important;
            gap: 10px !important;
          }
          .gallery-thumbs { gap: 6px !important; margin-top: 8px !important; }
          .gallery-thumb-wrap > span { margin-top: 4px !important; font-size: 8px !important; letter-spacing: .3px !important; }
          .product-info { padding: 6px 0 0 !important; }
          .product-info .eyebrow { font-size: 8px !important; letter-spacing: 1.6px !important; }
          .product-info h1 {
            font-size: clamp(25px, 7vw, 29px) !important;
            line-height: 1.08 !important;
            letter-spacing: -.35px !important;
            margin: 5px 0 7px !important;
          }
          .price { font-size: 19px !important; line-height: 1.2 !important; }
          .rating-summary { margin-top: 5px !important; gap: 7px !important; font-size: 11px !important; }
          .stock-badge { margin-top: 8px !important; padding: 5px 8px !important; font-size: 9px !important; }
          .divider { margin: 13px 0 !important; }
          .description { margin: 0 0 10px !important; font-size: 12px !important; line-height: 1.55 !important; }
          .shipping-note { padding: 9px 10px !important; margin: 12px 0 !important; gap: 3px !important; }
          .shipping-note strong { font-size: 9px !important; }
          .shipping-note span { font-size: 11px !important; line-height: 1.35 !important; }
          .size-section, .quantity-section { margin-top: 14px !important; }
          .field-heading { margin-bottom: 7px !important; font-size: 9px !important; letter-spacing: 1px !important; }
          .size-grid { gap: 6px !important; }
          .size-button { min-width: 45px !important; min-height: 37px !important; padding: 4px 8px !important; font-size: 12px !important; }
          .size-button small { font-size: 5px !important; }
          .quantity-control { width: 126px !important; height: 38px !important; grid-template-columns: 36px 1fr 36px !important; }
          .quantity-control button { font-size: 17px !important; }
          .quantity-control span { font-size: 13px !important; }
          .action-buttons { margin-top: 15px !important; gap: 7px !important; }
          .add-button, .buy-button { height: 38px !important; min-height: 38px !important; font-size: 8px !important; letter-spacing: .55px !important; }
          .product-points {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            gap: 7px !important;
            margin-top: 17px !important;
            padding-top: 13px !important;
          }
          .product-points .point-icon { font-size: 21px !important; margin-bottom: 5px !important; }
          .product-points strong { font-size: 7px !important; letter-spacing: .35px !important; line-height: 1.25 !important; }
          .product-points div > span:last-child { margin-top: 3px !important; font-size: 8px !important; line-height: 1.25 !important; }
          .product-description { padding: 0 10px 24px !important; }
          .description-tabs { gap: 14px !important; margin-bottom: 14px !important; }
          .description-tabs button { padding: 10px 0 9px !important; font-size: 10px !important; }
          .description-content { display: block !important; padding-top: 0 !important; }
          .description-copy h2 { font-size: 25px !important; line-height: 1.15 !important; margin: 7px 0 8px !important; }
          .description-copy p { font-size: 12px !important; line-height: 1.55 !important; margin: 0 !important; }
          .description-copy ul { margin-top: 12px !important; }
          .description-copy li { font-size: 11px !important; margin: 7px 0 !important; line-height: 1.35 !important; }
          .description-copy li::before { width: 15px !important; height: 15px !important; margin-right: 7px !important; }
          .description-image { display: none !important; }
          .related-products { padding: 0 10px 30px !important; }
          .mobile-bottom-nav {
            position: fixed !important;
            left: 3% !important;
            right: 3% !important;
            bottom: max(8px, env(safe-area-inset-bottom)) !important;
            z-index: 999 !important;
            display: grid !important;
            grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
            align-items: stretch !important;
            min-height: 62px !important;
            height: auto !important;
            padding: 5px 4px !important;
            border: 1px solid rgba(84, 47, 53, 0.18) !important;
            border-radius: 40px !important;
            background: rgba(255, 253, 251, 0.96) !important;
            box-shadow: 0 5px 24px rgba(55, 35, 38, 0.18) !important;
            backdrop-filter: blur(14px) !important;
            -webkit-backdrop-filter: blur(14px) !important;
          }
          .mobile-bottom-nav-item {
            display: flex !important;
            min-width: 0 !important;
            min-height: 0 !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 3px !important;
            border-radius: 28px !important;
            color: #292629 !important;
            text-decoration: none !important;
            font-size: 10px !important;
            line-height: 1.05 !important;
            letter-spacing: normal !important;
            padding: 3px 1px !important;
            white-space: normal !important;
          }
          .mobile-bottom-nav-item:first-child {
            background: #f3e8e9 !important;
          }
          .mobile-bottom-nav-item svg {
            width: 22px !important;
            height: 22px !important;
            fill: none !important;
            stroke: currentColor !important;
            stroke-width: 1.8 !important;
            stroke-linecap: round !important;
            stroke-linejoin: round !important;
            flex-shrink: 0 !important;
          }
          .mobile-bottom-nav-button {
            appearance: none !important;
            -webkit-appearance: none !important;
            border: 0 !important;
            background: transparent !important;
            font-family: inherit !important;
            cursor: pointer !important;
          }
          .mobile-category-backdrop {
            position: fixed !important;
            inset: 0 !important;
            z-index: 1000 !important;
            display: flex !important;
            align-items: flex-end !important;
            justify-content: center !important;
            padding: 0 14px calc(78px + env(safe-area-inset-bottom)) !important;
            background: rgba(28, 19, 21, 0.22) !important;
          }
          .mobile-category-choice {
            width: min(100%, 360px) !important;
            padding: 16px !important;
            border: 1px solid rgba(84, 47, 53, 0.16) !important;
            border-radius: 18px !important;
            background: #fffdfb !important;
            box-shadow: 0 10px 32px rgba(35, 20, 23, 0.2) !important;
          }
          .mobile-category-choice-heading {
            margin: 0 0 10px !important;
            color: #542f35 !important;
            font-size: 11px !important;
            font-weight: 600 !important;
            letter-spacing: .16em !important;
            text-align: center !important;
            text-transform: uppercase !important;
          }
          .mobile-category-choice a {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 12px !important;
            padding: 14px 10px !important;
            border-top: 1px solid #eadfda !important;
            color: #542f35 !important;
            font-size: 14px !important;
            text-decoration: none !important;
          }
          .mobile-category-choice a span {
            font-size: 22px !important;
            line-height: 1 !important;
          }
          /* Match the approved Home page mobile footer exactly:
             burgundy footer continues behind the white rounded navigation. */
          .dreamzy-footer {
            padding-bottom: 10px !important;
            background: #542f35 !important;
          }

          .mobile-bottom-nav {
            position: static !important;
            left: auto !important;
            right: auto !important;
            bottom: auto !important;
            width: calc(100% - 20px) !important;
            max-width: 420px !important;
            margin: 12px auto 0 !important;
            z-index: 999 !important;
          }

          .mobile-bottom-nav::before {
            display: none !important;
          }
        }

      `}</style>
    </main>
  );
}
