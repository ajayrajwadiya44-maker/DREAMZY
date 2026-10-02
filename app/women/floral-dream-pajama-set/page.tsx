"use client";

import { useState } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
};

export default function ProductPage() {
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("/women-2.jpg");
  const [added, setAdded] = useState(false);

  const productImages = ["/women-2.jpg", "/women-1.jpg", "/women-3.jpg"];
  const sizes = ["S", "M", "L", "XL"];

  function addToBag() {
    try {
      const saved = window.localStorage.getItem("dreamzy-cart");
      let existing: CartItem[] = [];

      if (saved) {
        const parsed = JSON.parse(saved);
        existing = Array.isArray(parsed) ? parsed : [];
      }

      const newItem: CartItem = {
        id: "floral-dream-pajama-set-" + selectedSize,
        name: "Floral Dream Pajama Set",
        price: 1499,
        size: selectedSize,
        quantity,
        image: "/women-2.jpg",
      };

      const found = existing.find((item) => item.id === newItem.id);

      const updated: CartItem[] = found
        ? existing.map((item) =>
            item.id === newItem.id
              ? {
                  ...item,
                  quantity: Number(item.quantity || 0) + quantity,
                }
              : item
          )
        : [...existing, newItem];

      window.localStorage.setItem(
        "dreamzy-cart",
        JSON.stringify(updated)
      );

      // Let any open cart/bag UI know that the cart changed.
      window.dispatchEvent(new Event("dreamzy-cart-updated"));

      setAdded(true);

      window.setTimeout(() => {
        setAdded(false);
      }, 2200);

      return true;
    } catch (error) {
      console.error("DREAMZY cart error:", error);
      setAdded(false);
      window.alert(
        "Unable to add this product to your bag. Please refresh the page and try again."
      );
      return false;
    }
  }

  function buyNow() {
    const success = addToBag();

    if (success) {
      window.location.href = "/cart";
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fbf6f1",
        color: "#542f35",
        fontFamily: "Arial, Helvetica, sans-serif"
      }}
    >
      <header
        style={{
          height: 72,
          padding: "0 4%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #eaded8",
          background: "#fbf6f1",
          position: "sticky",
          top: 0,
          zIndex: 20
        }}
      >
        <a href="/" style={{ color: "#542f35", textDecoration: "none", fontFamily: "Georgia, serif", fontSize: 30 }}>
          DREAMZY
        </a>

        <nav style={{ display: "flex", gap: 32 }}>
          <a href="/women" style={{ color: "#8b4d57", textDecoration: "none", fontSize: 10, letterSpacing: 2 }}>WOMEN</a>
          <a href="/kids" style={{ color: "#542f35", textDecoration: "none", fontSize: 10, letterSpacing: 2 }}>KIDS</a>
          <a href="/#new-arrivals" style={{ color: "#542f35", textDecoration: "none", fontSize: 10, letterSpacing: 2 }}>NEW ARRIVALS</a>
          <a href="/#best-sellers" style={{ color: "#542f35", textDecoration: "none", fontSize: 10, letterSpacing: 2 }}>BEST SELLERS</a>
          <a href="/#about" style={{ color: "#542f35", textDecoration: "none", fontSize: 10, letterSpacing: 2 }}>ABOUT</a>
        </nav>

        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <button aria-label="Search" style={{ border: 0, background: "transparent", color: "#542f35", fontSize: 19 }}>⌕</button>
          <button aria-label="Wishlist" style={{ border: 0, background: "transparent", color: "#542f35", fontSize: 19 }}>♡</button>
          <a href="/cart" aria-label="Shopping bag" style={{ color: "#542f35", textDecoration: "none", fontSize: 19 }}>♧</a>
        </div>
      </header>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 5% 14px", fontSize: 9, letterSpacing: 1.5, color: "#927e7d" }}>
        <a href="/" style={{ color: "#725f60", textDecoration: "none" }}>HOME</a>
        <span style={{ margin: "0 9px" }}>/</span>
        <a href="/women" style={{ color: "#725f60", textDecoration: "none" }}>WOMEN</a>
        <span style={{ margin: "0 9px" }}>/</span>
        FLORAL DREAM PAJAMA SET
      </div>

      <section
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 5% 75px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(390px, 0.95fr)",
          gap: 55,
          alignItems: "start"
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "78px minmax(0, 1fr)", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {productImages.map((item) => (
              <button
                key={item}
                onClick={() => setActiveImage(item)}
                style={{
                  width: 78,
                  height: 96,
                  padding: 0,
                  overflow: "hidden",
                  cursor: "pointer",
                  background: "#eee1db",
                  border: activeImage === item ? "2px solid #542f35" : "1px solid #d8cbc6"
                }}
              >
                <img src={item} alt="DREAMZY Floral Dream Pajama Set" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </button>
            ))}
          </div>

          <div style={{ position: "relative", height: 590, overflow: "hidden", background: "#eee1db", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={activeImage} alt="DREAMZY Floral Dream Pajama Set" style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" }} />
            <span style={{ position: "absolute", top: 17, left: 17, padding: "8px 12px", background: "#fbf6f1", fontSize: 8, letterSpacing: 1.4 }}>
              NEW ARRIVAL
            </span>
            <button aria-label="Add to wishlist" style={{ position: "absolute", top: 15, right: 15, width: 38, height: 38, borderRadius: "50%", border: "none", background: "#fbf6f1", color: "#542f35", fontSize: 19 }}>
              ♡
            </button>
          </div>
        </div>

        <div style={{ paddingTop: 10 }}>
          <p style={{ margin: "0 0 15px", color: "#96616a", fontSize: 9, letterSpacing: 3 }}>DREAMZY WOMEN</p>

          <h1 style={{ margin: 0, fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 54, lineHeight: 1.02, letterSpacing: -1.5 }}>
            Floral Dream
            <br />
            Pajama Set
          </h1>

          <div style={{ display: "flex", gap: 9, marginTop: 20, fontSize: 10 }}>
            <span style={{ letterSpacing: 2 }}>★★★★★</span>
            <span>4.9</span>
            <span style={{ color: "#8a7777" }}>24 Reviews</span>
          </div>

          <div style={{ marginTop: 22, fontSize: 22 }}>₹1,499</div>

          <p style={{ margin: "5px 0 20px", color: "#8a7777", fontSize: 10 }}>Inclusive of all taxes</p>

          <div style={{ height: 1, background: "#e2d5d0" }} />

          <p style={{ margin: "22px 0 0", maxWidth: 510, color: "#725f60", fontSize: 12, lineHeight: 1.8 }}>
            Designed for peaceful evenings and beautiful mornings, our Floral Dream Pajama Set combines softness, comfort and effortless elegance.
          </p>

          <div style={{ marginTop: 25 }}>
            <div style={{ marginBottom: 12, fontSize: 9, letterSpacing: 1.5 }}>SELECT SIZE</div>
            <div style={{ display: "flex", gap: 8 }}>
              {sizes.map((item) => (
                <button
                  key={item}
                  onClick={() => setSelectedSize(item)}
                  style={{
                    width: 52,
                    height: 42,
                    border: selectedSize === item ? "1px solid #542f35" : "1px solid #d5c5bf",
                    background: selectedSize === item ? "#542f35" : "transparent",
                    color: selectedSize === item ? "#ffffff" : "#542f35",
                    cursor: "pointer",
                    fontSize: 10
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 23 }}>
            <div style={{ marginBottom: 11, fontSize: 9, letterSpacing: 1.5 }}>QUANTITY</div>
            <div style={{ width: 132, height: 42, display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #d5c5bf" }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: 40, height: "100%", border: 0, background: "transparent", color: "#542f35", fontSize: 17 }}>−</button>
              <span style={{ fontSize: 12 }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={{ width: 40, height: "100%", border: 0, background: "transparent", color: "#542f35", fontSize: 17 }}>+</button>
            </div>
          </div>

          <button
            onClick={addToBag}
            style={{
              width: "100%",
              height: 51,
              marginTop: 19,
              border: "1px solid #542f35",
              background: added ? "#7a5960" : "#542f35",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: 9,
              letterSpacing: 2
            }}
          >
            {added ? "ADDED TO BAG ✓" : "ADD TO BAG"}
          </button>

          <button
            onClick={buyNow}
            style={{
              width: "100%",
              height: 51,
              marginTop: 10,
              border: "1px solid #542f35",
              background: "transparent",
              color: "#542f35",
              cursor: "pointer",
              fontSize: 9,
              letterSpacing: 2
            }}
          >
            BUY IT NOW
          </button>

          <div style={{ marginTop: 22, borderTop: "1px solid #e2d5d0", borderBottom: "1px solid #e2d5d0" }}>
            <div style={{ padding: "13px 0", borderBottom: "1px solid #e2d5d0" }}>
              <strong style={{ fontSize: 9, letterSpacing: 1 }}>FREE SHIPPING</strong>
              <p style={{ margin: "4px 0 0", color: "#8a7777", fontSize: 10 }}>On orders above ₹999</p>
            </div>
            <div style={{ padding: "13px 0", borderBottom: "1px solid #e2d5d0" }}>
              <strong style={{ fontSize: 9, letterSpacing: 1 }}>EASY RETURNS</strong>
              <p style={{ margin: "4px 0 0", color: "#8a7777", fontSize: 10 }}>Easy returns within 7 days</p>
            </div>
            <div style={{ padding: "13px 0" }}>
              <strong style={{ fontSize: 9, letterSpacing: 1 }}>SECURE PAYMENT</strong>
              <p style={{ margin: "4px 0 0", color: "#8a7777", fontSize: 10 }}>Safe and secure checkout</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "#f7eee9", borderTop: "1px solid #e2d5d0", padding: "65px 5%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 50 }}>
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 25 }}>Description</h2>
            <p style={{ color: "#725f60", fontSize: 12, lineHeight: 1.8 }}>The Floral Dream Pajama Set is created for women who believe comfort should never compromise style.</p>
            <p style={{ color: "#725f60", fontSize: 12, lineHeight: 1.8 }}>Featuring a beautiful floral design and a relaxed silhouette, this set is perfect for sleeping, relaxing or enjoying a quiet morning at home.</p>
          </div>
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 25 }}>Product Details</h2>
            <ul style={{ color: "#725f60", fontSize: 12, lineHeight: 1.9 }}>
              <li>Premium soft fabric</li>
              <li>Relaxed comfortable fit</li>
              <li>Floral printed design</li>
              <li>Comfortable fit</li>
              <li>Soft nightwear fabric</li>
              <li>Sizes S, M, L and XL</li>
            </ul>
          </div>
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 25 }}>Care Instructions</h2>
            <ul style={{ color: "#725f60", fontSize: 12, lineHeight: 1.9 }}>
              <li>Machine wash with similar colours</li>
              <li>Use mild detergent</li>
              <li>Do not bleach</li>
              <li>Dry in shade</li>
              <li>Iron on low temperature</li>
            </ul>
          </div>
        </div>
      </section>

      <footer style={{ background: "#542f35", color: "#f9eee8", textAlign: "center", padding: "65px 20px 32px" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 35 }}>DREAMZY</div>
        <p style={{ fontSize: 11, opacity: 0.7 }}>Softer Nights ♥ Brighter Tomorrows</p>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 30, margin: "32px 0 42px" }}>
          <a href="/women" style={{ color: "#f9eee8", textDecoration: "none", fontSize: 10 }}>Women</a>
          <a href="/kids" style={{ color: "#f9eee8", textDecoration: "none", fontSize: 10 }}>Kids</a>
          <a href="/cart" style={{ color: "#f9eee8", textDecoration: "none", fontSize: 10 }}>Bag</a>
          <a href="/#about" style={{ color: "#f9eee8", textDecoration: "none", fontSize: 10 }}>About</a>
          <a href="https://www.instagram.com/dreamzy_in/" target="_blank" rel="noreferrer" style={{ color: "#f9eee8", textDecoration: "none", fontSize: 10 }}>Instagram</a>
        </div>
        <div style={{ paddingTop: 23, borderTop: "1px solid rgba(255,255,255,0.15)", fontSize: 9, opacity: 0.55 }}>
          © 2026 DREAMZY. All Rights Reserved.
        </div>
      </footer>
    </main>
  );
}
