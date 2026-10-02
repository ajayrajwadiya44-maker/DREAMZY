"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Account = {
  name: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

type SavedAddress = {
  id: string;
  label: string;
  name: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

type CartItem = {
  id: string;
  productId?: string;
  name: string;
  price: number;
  image?: string;
  size?: string;
  quantity: number;
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
        .women-header {
          height: 72px;
          width: 100%;
          background: #fffdfb;
          border-bottom: 1px solid #eadfd8;
          padding: 0 42px;
          position: relative;
          z-index: 20;
          box-sizing: border-box;
        }
        .women-header-inner {
          height: 100%;
          width: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .women-logo {
          color: #542f35;
          text-decoration: none;
          font-family: Georgia, serif;
          font-size: 29px;
          letter-spacing: 3px;
          white-space: nowrap;
        }
        .women-menu-button {
          display: none;
          width: 36px;
          height: 36px;
          border: 1px solid #bda9a6;
          background: #fffdfb;
          color: #542f35;
          font-size: 18px;
          cursor: pointer;
        }
        .women-nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 27px;
          margin-left: auto;
        }
        .women-nav a,
        .women-account-button {
          color: #542f35;
          text-decoration: none;
          font-family: Arial, sans-serif;
          font-size: 11px;
          letter-spacing: 1.2px;
          white-space: nowrap;
        }
        .women-account-wrap { position: relative; }
        .women-account-button {
          border: 0;
          background: transparent;
          padding: 0;
          cursor: pointer;
        }
        .women-account-arrow { margin-left: 5px; font-size: 12px; }
        .women-account-dropdown {
          position: absolute;
          top: calc(100% + 18px);
          right: 0;
          width: 190px;
          background: #fffdfb;
          border: 1px solid #eadfd8;
          box-shadow: 0 10px 25px rgba(84,47,53,.12);
          padding: 8px 0;
          z-index: 200;
        }
        .women-account-dropdown a,
        .women-account-dropdown button {
          display: block;
          width: 100%;
          box-sizing: border-box;
          padding: 12px 16px;
          border: 0;
          background: transparent;
          color: #542f35;
          text-decoration: none;
          text-align: left;
          font-family: Arial, sans-serif;
          font-size: 12px;
          letter-spacing: .8px;
          cursor: pointer;
        }
        .women-account-dropdown a:hover,
        .women-account-dropdown button:hover { background: #faf1ed; }
        @media (max-width: 900px) {
          .women-header { height: 64px; padding: 0 18px; }
          .women-header-inner { position: relative; }
          .women-menu-button {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            flex-shrink: 0;
          }
          .women-logo {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            font-size: 25px;
            letter-spacing: 2px;
          }
          .women-nav {
            display: none !important;
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            width: 100%;
            background: #fffdfb;
            border: 1px solid #eadfd8;
            padding: 10px 18px 16px;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            box-shadow: 0 8px 20px rgba(84,47,53,.08);
            z-index: 100;
            box-sizing: border-box;
          }
          .women-nav.open { display: flex !important; }
          .women-nav a,
          .women-account-button {
            width: 100%;
            padding: 14px 4px;
            border-bottom: 1px solid #f0e7e2;
            text-align: left;
            box-sizing: border-box;
            font-size: 12px;
            letter-spacing: 1.2px;
          }
          .women-account-wrap { width: 100%; }
          .women-account-dropdown {
            position: static;
            width: 100%;
            border: 0;
            border-bottom: 1px solid #f0e7e2;
            box-shadow: none;
            padding: 0 0 4px 12px;
            background: #fffdfb;
          }
          .women-account-dropdown a,
          .women-account-dropdown button { padding: 12px 6px; font-size: 12px; }
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
      `}</style>
    </>
  );
}

export default function CheckoutPage() {
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<SavedAddress>({
    id: "",
    label: "Home",
    name: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false
  });
  const [addressMessage, setAddressMessage] = useState("");
  const [account, setAccount] = useState<Account>({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState("COD");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  useEffect(() => {
    function loadCheckoutData() {
      try {
        const accountRaw = localStorage.getItem("dreamzy-account");
        const cartRaw = localStorage.getItem("dreamzy-cart");

        if (accountRaw) {
          const saved = JSON.parse(accountRaw);
          if (saved && typeof saved === "object") {
            setAccount({
              name: saved.name || "",
              email: saved.email || "",
              mobile: saved.mobile || "",
              address: saved.address || "",
              city: saved.city || "",
              state: saved.state || "",
              pincode: saved.pincode || ""
            });
          }
        }

        const addressRaw = localStorage.getItem("dreamzy-addresses");
        if (addressRaw) {
          const savedAddressesRaw = JSON.parse(addressRaw);
          if (Array.isArray(savedAddressesRaw)) {
            const normalizedAddresses: SavedAddress[] = savedAddressesRaw.map((item: any) => ({
              id: String(item.id || `ADDR${Date.now()}`),
              label: String(item.label || "Address"),
              name: String(item.name || ""),
              mobile: String(item.mobile || ""),
              address: String(item.address || ""),
              city: String(item.city || ""),
              state: String(item.state || ""),
              pincode: String(item.pincode || ""),
              isDefault: item.isDefault === true
            }));
            setSavedAddresses(normalizedAddresses);

            const defaultAddress =
              normalizedAddresses.find((item) => item.isDefault) ||
              normalizedAddresses[0];

            if (defaultAddress) {
              setSelectedAddressId(defaultAddress.id);
            }
          } else {
            setSavedAddresses([]);
            setSelectedAddressId("");
          }
        } else {
          setSavedAddresses([]);
          setSelectedAddressId("");
        }

        if (cartRaw) {
          const savedCart = JSON.parse(cartRaw);
          if (Array.isArray(savedCart)) setCart(savedCart);
        } else {
          setCart([]);
        }
      } catch {}

      setLoading(false);
    }

    loadCheckoutData();

    window.addEventListener("focus", loadCheckoutData);
    window.addEventListener("storage", loadCheckoutData);
    window.addEventListener("dreamzy-cart-updated", loadCheckoutData);
    window.addEventListener("dreamzy-products-updated", loadCheckoutData);
    window.addEventListener("dreamzy-addresses-updated", loadCheckoutData);

    return () => {
      window.removeEventListener("focus", loadCheckoutData);
      window.removeEventListener("storage", loadCheckoutData);
      window.removeEventListener("dreamzy-cart-updated", loadCheckoutData);
      window.removeEventListener("dreamzy-products-updated", loadCheckoutData);
      window.removeEventListener("dreamzy-addresses-updated", loadCheckoutData);
    };
  }, []);

  function openAddAddress() {
    setNewAddress({
      id: "",
      label: "Home",
      name: account.name || "",
      mobile: account.mobile || "",
      address: account.address || "",
      city: account.city || "",
      state: account.state || "",
      pincode: account.pincode || "",
      isDefault: savedAddresses.length === 0
    });
    setAddressMessage("");
    setAddingAddress(true);
  }

  function saveNewAddress() {

    if (
      !newAddress.name.trim() ||
      !/^[6-9]\d{9}$/.test(newAddress.mobile.trim()) ||
      !newAddress.address.trim() ||
      !newAddress.city.trim() ||
      !newAddress.state.trim() ||
      !/^\d{6}$/.test(newAddress.pincode.trim())
    ) {
      setAddressMessage("Please complete all fields and enter valid mobile and pincode.");
      return;
    }

    const created: SavedAddress = {
      ...newAddress,
      id: `ADDR${Date.now()}`,
      label: newAddress.label.trim() || "Address",
      name: newAddress.name.trim(),
      mobile: newAddress.mobile.trim(),
      address: newAddress.address.trim(),
      city: newAddress.city.trim(),
      state: newAddress.state.trim(),
      pincode: newAddress.pincode.trim(),
      isDefault: savedAddresses.length === 0
    };

    const next = [
      ...(created.isDefault
        ? savedAddresses.map((item) => ({ ...item, isDefault: false }))
        : savedAddresses),
      created
    ];

    localStorage.setItem("dreamzy-addresses", JSON.stringify(next));
    setSavedAddresses(next);
    setSelectedAddressId(created.id);
    setAccount((current) => ({
      ...current,
      name: created.name,
      mobile: created.mobile,
      address: created.address,
      city: created.city,
      state: created.state,
      pincode: created.pincode
    }));
    setAddingAddress(false);
    setAddressMessage("");
    window.dispatchEvent(new Event("dreamzy-addresses-updated"));
  }

  function applySavedAddress(id: string) {
    const selected = savedAddresses.find((item) => item.id === id);
    if (!selected) return;

    setSelectedAddressId(id);
    setAccount((current) => ({
      ...current,
      name: selected.name,
      mobile: selected.mobile,
      address: selected.address,
      city: selected.city,
      state: selected.state,
      pincode: selected.pincode
    }));
  }

  // GST is read from the Admin Products master catalog.
  // If an older cart item has no GST settings yet, safely fall back to
  // the current DREAMZY default of 5% GST-inclusive.
  function readProductCatalog() {
    try {
      if (typeof window === "undefined") return [];
      const raw = window.localStorage.getItem("dreamzy-products");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  const productCatalog = readProductCatalog();

  const gstLines = cart.map((item) => {
    const product = productCatalog.find(
      (entry: any) =>
        String(entry.id) ===
        String(item.productId || item.id.split("-")[0])
    );

    const rate =
      Number.isFinite(Number(product?.gstRate)) && Number(product?.gstRate) >= 0
        ? Number(product.gstRate)
        : 5;

    const inclusive = product?.gstInclusive !== false;
    const hsnSac = String(product?.hsnSac || "6108");
    const linePrice = Number(item.price || 0) * Number(item.quantity || 1);

    const taxableAmount = inclusive
      ? linePrice / (1 + rate / 100)
      : linePrice;

    const gstAmount = inclusive
      ? linePrice - taxableAmount
      : linePrice * (rate / 100);

    const lineTotal = inclusive
      ? linePrice
      : linePrice + gstAmount;

    return {
      product,
      productId: item.productId || item.id.split("-")[0],
      name: item.name,
      hsnSac,
      gstRate: rate,
      gstInclusive: inclusive,
      quantity: Number(item.quantity || 1),
      taxableAmount,
      gstAmount,
      lineTotal
    };
  });

  const taxableSubtotal = gstLines.reduce(
    (sum, line) => sum + line.taxableAmount,
    0
  );

  const gstAmount = gstLines.reduce(
    (sum, line) => sum + line.gstAmount,
    0
  );

  // This is the merchandise amount before GST treatment.
  const subtotal = gstLines.reduce(
    (sum, line) => sum + line.lineTotal,
    0
  );

  // DREAMZY shipping policy: free shipping on every order.
  const shipping = 0;
  const total = subtotal + shipping;

  const gstRates = Array.from(
    new Set(gstLines.map((line) => Number(line.gstRate)))
  );
  const gstRate = gstRates.length === 1 ? gstRates[0] : undefined;
  const gstInclusive = gstLines.every((line) => line.gstInclusive);

  function updateAccount(field: keyof Account, value: string) {
    setAccount((current) => ({
      ...current,
      [field]: value
    }));
  }

  function saveAccount() {
    localStorage.setItem("dreamzy-account", JSON.stringify(account));
  }

  function validateLatestInventory(currentCart: CartItem[]) {
    try {
      const catalogRaw = localStorage.getItem("dreamzy-products");
      const catalog = catalogRaw ? JSON.parse(catalogRaw) : [];

      if (!Array.isArray(catalog)) {
        return {
          ok: false,
          message: "Product inventory could not be checked. Please try again.",
        };
      }

      for (const item of currentCart) {
        const product = catalog.find(
          (entry: any) =>
            String(entry.id) ===
            String(item.productId || item.id.split("-")[0])
        );

        if (!product || product.active === false) {
          return {
            ok: false,
            message: `${item.name} is no longer available.`,
          };
        }

        const quantity = Math.max(1, Number(item.quantity || 1));
        const size = String(item.size || product.sizes?.[0] || "M");

        if (product.sizeStock && typeof product.sizeStock === "object") {
          const available = Number(product.sizeStock[size] || 0);

          if (available <= 0) {
            return {
              ok: false,
              message: `${item.name} (${size}) is out of stock.`,
            };
          }

          if (available < quantity) {
            return {
              ok: false,
              message: `${item.name} (${size}) has only ${available} ${available === 1 ? "unit" : "units"} left in stock.`,
            };
          }
        } else {
          const available = Number(product.stock || 0);

          if (available <= 0) {
            return {
              ok: false,
              message: `${item.name} is out of stock.`,
            };
          }

          if (available < quantity) {
            return {
              ok: false,
              message: `${item.name} has only ${available} ${available === 1 ? "unit" : "units"} left in stock.`,
            };
          }
        }
      }

      return { ok: true, message: "" };
    } catch {
      return {
        ok: false,
        message: "Product inventory could not be checked. Please try again.",
      };
    }
  }

  function placeOrder(event: React.FormEvent) {
    event.preventDefault();

    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    if (
      !account.name.trim() ||
      !account.email.trim() ||
      !account.mobile.trim() ||
      !account.address.trim() ||
      !account.city.trim() ||
      !account.state.trim() ||
      !account.pincode.trim()
    ) {
      setMessage("Please complete your customer details.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(account.mobile.trim())) {
      setMessage("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(account.pincode.trim())) {
      setMessage("Please enter a valid 6-digit pincode.");
      return;
    }

    // Final stock check immediately before order placement.
    // This protects the customer from stock changes made after they opened Checkout.
    const latestInventory = validateLatestInventory(cart);

    if (!latestInventory.ok) {
      setMessage(latestInventory.message);
      return;
    }

    if (payment !== "COD") {
      setMessage("Online payment is not available yet. Please select Cash on Delivery.");
      return;
    }

    setPlacing(true);
    setMessage("");

    try {
      saveAccount();

      // Validate the latest inventory and reserve/decrement stock by size.
      // This happens only after the customer submits the order.
      const catalogRaw = localStorage.getItem("dreamzy-products");
      const catalog = catalogRaw ? JSON.parse(catalogRaw) : [];

      if (!Array.isArray(catalog)) {
        setPlacing(false);
        setMessage("Product inventory could not be checked. Please try again.");
        return;
      }

      const nextCatalog = catalog.map((product: any) => ({
        ...product,
        sizeStock: product?.sizeStock ? { ...product.sizeStock } : undefined
      }));

      for (const item of cart) {
        const product = nextCatalog.find(
          (entry: any) => String(entry.id) === String(item.productId || item.id.split("-")[0])
        );

        if (!product) {
          setPlacing(false);
          setMessage(`${item.name} is no longer available.`);
          return;
        }

        const quantity = Math.max(1, Number(item.quantity || 1));
        const size = String(item.size || product.sizes?.[0] || "M");

        if (product.sizeStock && typeof product.sizeStock === "object") {
          const available = Number(product.sizeStock[size] || 0);
          if (available < quantity) {
            setPlacing(false);
            setMessage(`${item.name} (${size}) has only ${available} left in stock.`);
            return;
          }
          product.sizeStock[size] = available - quantity;
          product.stock = Object.values(product.sizeStock as Record<string, number>)
            .reduce((sum: number, value: number) => sum + Number(value || 0), 0);
        } else {
          const available = Number(product.stock || 0);
          if (available < quantity) {
            setPlacing(false);
            setMessage(`${item.name} has only ${available} left in stock.`);
            return;
          }
          product.stock = available - quantity;
        }
      }

      localStorage.setItem("dreamzy-products", JSON.stringify(nextCatalog));
      window.dispatchEvent(new Event("dreamzy-products-updated"));

      const orderNumber =
        "DRZ" +
        Math.floor(10000000 + Math.random() * 90000000);

      const selectedSavedAddress =
        savedAddresses.find((item) => item.id === selectedAddressId) || null;

      // Snapshot the exact delivery details used for this order.
      // This keeps the order/invoice address unchanged even if the customer
      // edits their Account Profile or Saved Addresses later.
      const deliveryAddress = {
        addressId: selectedSavedAddress?.id || "",
        label: selectedSavedAddress?.label || "",
        name: account.name,
        mobile: account.mobile,
        address: account.address,
        city: account.city,
        state: account.state,
        pincode: account.pincode
      };

      const order = {
        id: orderNumber,
        orderNumber,
        customer: account.name,
        customerName: account.name,
        name: account.name,
        email: account.email,
        mobile: account.mobile,
        phone: account.mobile,
        address: account.address,
        city: account.city,
        state: account.state,
        pincode: account.pincode,
        deliveryAddress,
        customerDetails: {
          name: account.name,
          email: account.email,
          mobile: account.mobile,
          address: account.address,
          city: account.city,
          state: account.state,
          pincode: account.pincode
        },
        payment: payment,
        paymentMethod: payment,
        subtotal: Number(subtotal.toFixed(2)),
        taxableSubtotal: Number(taxableSubtotal.toFixed(2)),
        gstRate,
        gstAmount: Number(gstAmount.toFixed(2)),
        gstInclusive,
        gstBreakdown: gstLines.map((line) => ({
          productId: line.productId,
          productName: line.name,
          hsnSac: line.hsnSac,
          gstRate: line.gstRate,
          gstInclusive: line.gstInclusive,
          quantity: line.quantity,
          taxableAmount: Number(line.taxableAmount.toFixed(2)),
          gstAmount: Number(line.gstAmount.toFixed(2)),
          lineTotal: Number(line.lineTotal.toFixed(2))
        })),
        shipping,
        total: Number(total.toFixed(2)),
        status: "NEW",
        createdAt: new Date().toISOString(),
        items: cart.map((item, index) => ({
          id: item.id,
          productId: item.productId,
          name: item.name,
          price: Number(item.price),
          image: item.image,
          size: item.size,
          quantity: Number(item.quantity || 1),
          hsnSac: gstLines[index]?.hsnSac,
          gstRate: gstLines[index]?.gstRate,
          gstInclusive: gstLines[index]?.gstInclusive
        }))
      };

      let existingOrders: any[] = [];

      try {
        const rawOrders = localStorage.getItem("dreamzy-orders");
        const parsedOrders = rawOrders ? JSON.parse(rawOrders) : [];
        if (Array.isArray(parsedOrders)) existingOrders = parsedOrders;
      } catch {}

      const updatedOrders = [order, ...existingOrders];

      localStorage.setItem("dreamzy-orders", JSON.stringify(updatedOrders));
      localStorage.setItem("dreamzy-last-order", JSON.stringify(order));
      localStorage.removeItem("dreamzy-cart");

      window.dispatchEvent(new Event("dreamzy-orders-updated"));

      window.location.href = "/order-success";
    } catch {
      setPlacing(false);
      setMessage("Unable to place order. Please try again.");
    }
  }

  if (loading) {
    return (
      <main style={loadingPage}>
        Loading DREAMZY Checkout...
      </main>
    );
  }

  function logout() {
    localStorage.removeItem("dreamzy-account");
    window.dispatchEvent(new Event("dreamzy-account-updated"));
    setMenuOpen(false);
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
              <span className={`mobile-account-chevron ${accountOpen ? "open" : ""}`}>⌄</span>
            </button>

            {accountOpen && (
              <div className="mobile-account-dropdown">
                <Link href="/account" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>My Account</Link>
                <Link href="/account/orders" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>My Orders</Link>
                <Link href="/account/addresses" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>My Addresses</Link>
                <Link href="/wishlist" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>Wishlist</Link>
                <div className="mobile-account-divider" />
                <button
                  type="button"
                  className="mobile-account-logout"
                  onClick={() => {
                    setAccountOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  Log Out
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
              <Link href="/account" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
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

      <section className="checkout-hero" style={hero}>
        <div style={eyebrow}>DREAMZY CHECKOUT</div>
        <h1 className="checkout-title" style={title}>Complete Your Order</h1>
        <p style={subtitle}>A simple and secure checkout for your DREAMZY order.</p>
      </section>

      <form className="checkout-content" onSubmit={placeOrder} style={content}>
        <div>
          <section style={card}>
            <div style={eyebrow}>CUSTOMER DETAILS</div>
            <h2 style={cardTitle}>Delivery information</h2>

                          {savedAddresses.length > 0 && (
                <div className="checkout-saved-address-box" style={savedAddressBox}>
                  <div style={eyebrow}>SAVED ADDRESSES</div>
                  <div style={savedAddressHeading}>
                    <h3 style={savedAddressTitle}>Choose delivery address</h3>
                    {!addingAddress && (
                      <button type="button" onClick={openAddAddress} style={addAddressButton}>
                        + ADD NEW ADDRESS
                      </button>
                    )}
                  </div>

                  {!addingAddress && (
                    <div style={savedAddressList}>
                    {savedAddresses.map((item) => (
                      <label
                        key={item.id}
                        style={{
                          ...savedAddressOption,
                          ...(selectedAddressId === item.id ? savedAddressOptionActive : {})
                        }}
                      >
                        <input
                          type="radio"
                          name="saved-address"
                          checked={selectedAddressId === item.id}
                          onChange={() => applySavedAddress(item.id)}
                        />
                        <span style={{ minWidth: 0 }}>
                          <strong style={savedAddressName}>
                            {item.label}
                            {item.isDefault && <span style={savedAddressBadge}>DEFAULT</span>}
                          </strong>
                          <span style={savedAddressText}>
                            {item.name} · {item.mobile}<br />
                            {item.address}, {item.city}, {item.state} - {item.pincode}
                          </span>
                        </span>
                      </label>
                    ))}
                    </div>
                  )}

                  {addingAddress && (
                    <div style={newAddressForm}>
                      <div className="checkout-address-choice-row" style={addressChoiceRow}>
                        {["Home", "Office", "Other"].map((labelName) => (
                          <button
                            key={labelName}
                            type="button"
                            onClick={() => setNewAddress({ ...newAddress, label: labelName })}
                            style={{
                              ...addressChoiceButton,
                              ...(newAddress.label === labelName ? addressChoiceButtonActive : {})
                            }}
                          >
                            {labelName}
                          </button>
                        ))}
                      </div>

                      <label style={label}>
                        ADDRESS LABEL
                        <input
                          value={newAddress.label}
                          onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                          style={input}
                        />
                      </label>

                      <div style={grid}>
                        <label style={label}>
                          FULL NAME
                          <input
                            value={newAddress.name}
                            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                            style={input}
                          />
                        </label>

                        <label style={label}>
                          MOBILE NUMBER
                          <input
                            value={newAddress.mobile}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                mobile: e.target.value.replace(/\D/g, "").slice(0, 10)
                              })
                            }
                            inputMode="numeric"
                            maxLength={10}
                            style={input}
                          />
                        </label>
                      </div>

                      <label style={label}>
                        DELIVERY ADDRESS
                        <textarea
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                          style={textarea}
                        />
                      </label>

                      <div style={grid}>
                        <label style={label}>
                          CITY
                          <input
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            style={input}
                          />
                        </label>

                        <label style={label}>
                          STATE
                          <input
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            style={input}
                          />
                        </label>
                      </div>

                      <label style={label}>
                        PINCODE
                        <input
                          value={newAddress.pincode}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              pincode: e.target.value.replace(/\D/g, "").slice(0, 6)
                            })
                          }
                          inputMode="numeric"
                          maxLength={6}
                          style={input}
                        />
                      </label>

                      {addressMessage && <div style={addressError}>{addressMessage}</div>}

                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button type="button" onClick={saveNewAddress} style={placeButton}>
                          SAVE & USE ADDRESS
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAddingAddress(false);
                            setAddressMessage("");
                          }}
                          style={cancelAddressButton}
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  )}

                  <Link href="/account" style={manageAddressLink}>
                    MANAGE SAVED ADDRESSES
                  </Link>
                </div>
              )}

<div className="checkout-details-grid" style={grid}>
              <label style={label}>
                FULL NAME
                <input
                  value={account.name}
                  onChange={(e) => updateAccount("name", e.target.value)}
                  placeholder="Full name"
                  style={input}
                />
              </label>

              <label style={label}>
                EMAIL
                <input
                  type="email"
                  value={account.email}
                  onChange={(e) => updateAccount("email", e.target.value)}
                  placeholder="Email address"
                  style={input}
                />
              </label>

              <label style={label}>
                MOBILE NUMBER
                <input
                  value={account.mobile}
                  onChange={(e) => updateAccount("mobile", e.target.value)}
                  placeholder="Mobile number"
                  style={input}
                />
              </label>

              <label style={{ ...label, gridColumn: "1 / -1" }}>
                DELIVERY ADDRESS
                <textarea
                  value={account.address}
                  onChange={(e) => updateAccount("address", e.target.value)}
                  placeholder="Complete delivery address"
                  style={textarea}
                />
              </label>

              <label style={label}>
                CITY
                <input
                  value={account.city}
                  onChange={(e) => updateAccount("city", e.target.value)}
                  placeholder="City"
                  style={input}
                />
              </label>

              <label style={label}>
                STATE
                <input
                  value={account.state}
                  onChange={(e) => updateAccount("state", e.target.value)}
                  placeholder="State"
                  style={input}
                />
              </label>

              <label style={label}>
                PINCODE
                <input
                  value={account.pincode}
                  onChange={(e) =>
                    updateAccount(
                      "pincode",
                      e.target.value.replace(/\\D/g, "").slice(0, 6)
                    )
                  }
                  placeholder="6 digit pincode"
                  inputMode="numeric"
                  maxLength={6}
                  style={input}
                />
              </label>
            </div>

            <p style={profileNote}>
              Your saved DREAMZY account details are automatically filled here. You can edit them for this order.
            </p>

            <button
              type="button"
              onClick={saveAccount}
              style={smallButton}
            >
              SAVE DETAILS TO MY ACCOUNT
            </button>
          </section>

          <section style={card}>
            <div style={eyebrow}>PAYMENT METHOD</div>
            <h2 style={cardTitle}>Choose payment</h2>

            <label className="checkout-payment-option" style={paymentOption}>
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={payment === "COD"}
                onChange={() => setPayment("COD")}
              />
              <span>
                <strong>Cash on Delivery</strong>
                <small>Pay when your DREAMZY order arrives.</small>
              </span>
            </label>

            <label className="checkout-payment-option" style={{ ...paymentOption, opacity: 0.55 }}>
              <input
                type="radio"
                name="payment"
                value="ONLINE"
                disabled
                checked={false}
              />
              <span>
                <strong>UPI / Cards</strong>
                <small>Online payment will be connected with Razorpay later.</small>
              </span>
            </label>
          </section>

          {message && (
            <div style={errorBox}>
              {message}
            </div>
          )}
        </div>

        <aside className="checkout-summary" style={summary}>
          <div style={eyebrow}>YOUR ORDER</div>
          <h2 style={cardTitle}>Order summary</h2>

          {cart.length === 0 ? (
            <div style={empty}>
              <p>Your cart is empty.</p>
              <Link href="/women" style={primaryLink}>SHOP NOW</Link>
            </div>
          ) : (
            <>
              <div style={items}>
                {cart.map((item) => (
                  <div key={item.id} style={itemRow}>
                    <div style={itemImageWrap}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={itemImage} />
                      ) : (
                        <div style={noImage}>D</div>
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={itemName}>{item.name}</div>
                      <div style={itemMeta}>
                        Size: {item.size || "Standard"} · Qty: {item.quantity}
                      </div>
                    </div>

                    <strong>
                      ₹{(Number(item.price) * Number(item.quantity || 1)).toLocaleString("en-IN")}
                    </strong>
                  </div>
                ))}
              </div>

              <div style={line} />

              <div style={totalRow}>
                <span>Product Total (GST included)</span>
                <strong>₹{subtotal.toFixed(2)}</strong>
              </div>

              <div style={totalRow}>
                <span>GST ({gstRate === undefined ? "mixed rates" : `${gstRate}%`}, included — not extra)</span>
                <strong>₹{gstAmount.toFixed(2)}</strong>
              </div>

              <div style={totalRow}>
                <span>Shipping</span>
                <strong>FREE</strong>
              </div>

              <div style={grandTotal}>
                <span>TOTAL</span>
                <strong>₹{total.toLocaleString("en-IN")}</strong>
              </div>

              <button type="submit" disabled={placing} style={placeButton}>
                {placing ? "PLACING ORDER..." : "PLACE ORDER"}
              </button>

              <p style={freeShippingNote}>
                GST INCLUDED IN PRODUCT PRICES · FREE SHIPPING
              </p>

              <p style={secureNote}>
                Your order will be saved to your DREAMZY account and Admin Orders.
              </p>
            </>
          )}
        </aside>
      </form>

      <DreamzyFooter />

      <nav className="mobile-bottom-nav" aria-label="Mobile quick navigation">
        <Link href="/" className="mobile-bottom-nav-item" aria-label="Home">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 10.8 12 3l9 7.8v9a1.2 1.2 0 0 1-1.2 1.2h-5.1v-6.4H9.3V21H4.2A1.2 1.2 0 0 1 3 19.8v-9Z" />
          </svg>
          <span>Home</span>
        </Link>

        <Link href="/#best-sellers" className="mobile-bottom-nav-item" aria-label="Offers">
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
            <path d="M2.5 3h2.8l2.2 12.5h10.8L20.5 7H6" />
            <circle cx="9" cy="20" r="1.3" />
            <circle cx="17.5" cy="20" r="1.3" />
          </svg>
          <span>Cart</span>
        </Link>
      </nav>

      {categoriesOpen && (
        <div
          className="mobile-category-backdrop"
          onClick={() => setCategoriesOpen(false)}
        >
          <div
            className="mobile-category-choice"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-category-choice-heading">SHOP COLLECTIONS</div>
            <Link href="/women" onClick={() => setCategoriesOpen(false)}>
              <span>♀</span>
              <strong>Women’s Collection</strong>
              <span>›</span>
            </Link>
            <Link href="/kids" onClick={() => setCategoriesOpen(false)}>
              <span>♧</span>
              <strong>Kids Collection</strong>
              <span>›</span>
            </Link>
          </div>
        </div>
      )}

      <style jsx global>{`
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

        .mobile-account-menu,
        .mobile-account-button,
        .mobile-account-dropdown,
        .mobile-account-logout {
          display: none;
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
            box-shadow: 0 8px 20px rgba(84, 47, 53, 0.08);
            z-index: 100;
          }
          .nav.open { display: flex !important; }
          .mobile-account-menu {
            display: block;
            width: 100%;
          }
          .mobile-account-button {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
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
            box-sizing: border-box;
          }
          .mobile-account-chevron {
            font-size: 17px;
            line-height: 1;
            transition: transform 0.18s ease;
          }
          .mobile-account-chevron.open {
            transform: rotate(180deg);
          }
          .mobile-account-dropdown {
            display: block;
            width: 100%;
            padding: 0 0 4px 12px;
            border-bottom: 1px solid #f0e7e2;
            box-sizing: border-box;
          }
          .mobile-account-dropdown a,
          .mobile-account-logout {
            display: block;
            width: 100%;
            padding: 10px 6px !important;
            border: 0 !important;
            background: transparent;
            color: #542f35;
            text-decoration: none;
            font: inherit;
            font-size: 12px !important;
            letter-spacing: 0 !important;
            text-align: left;
            box-sizing: border-box;
            cursor: pointer;
          }
          .mobile-account-divider {
            height: 1px;
            background: #eadfd8;
            margin: 2px 6px;
          }
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

        .checkout-menu-button {
          display: none;
        }

        .checkout-nav {
          display: flex;
        }

        @media (max-width: 900px) {
          .checkout-header {
            padding: 14px 18px !important;
            position: relative;
            z-index: 20;
          }

          .checkout-header-inner {
            position: relative;
          }

          .checkout-menu-button {
            display: block;
            width: 36px;
            height: 36px;
            border: 1px solid #bda9a6;
            background: #fffdfb;
            color: #542f35;
            font-size: 18px;
            line-height: 1;
            cursor: pointer;
            flex-shrink: 0;
          }

          .checkout-logo {
            font-size: 23px !important;
            letter-spacing: 2px !important;
            white-space: nowrap;
          }

          .checkout-nav {
            display: none !important;
            position: absolute;
            top: 50px;
            left: 0;
            right: 0;
            background: #fffdfb;
            border: 1px solid #eadfd8;
            padding: 12px 18px;
            flex-direction: column;
            align-items: stretch;
            gap: 0 !important;
            box-shadow: 0 8px 20px rgba(84,47,53,.08);
            z-index: 100;
          }

          .checkout-nav.open {
            display: flex !important;
          }

          .checkout-nav a {
            padding: 14px 6px;
            border-bottom: 1px solid #f0e7e2;
          }

          .checkout-hero {
            padding: 48px 20px 28px !important;
          }

          .checkout-title {
            font-size: 44px !important;
            line-height: 1.08 !important;
            margin: 12px 0 !important;
          }

          .checkout-content {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            padding: 10px 16px 60px !important;
            width: 100%;
            box-sizing: border-box;
          }

          .checkout-content > div,
          .checkout-summary {
            min-width: 0;
            width: 100%;
            box-sizing: border-box;
          }

          .checkout-details-grid {
            grid-template-columns: 1fr !important;
            gap: 15px !important;
          }

          .checkout-details-grid input,
          .checkout-details-grid textarea {
            min-width: 0;
          }

          .checkout-details-grid label {
            grid-column: 1 / -1 !important;
            min-width: 0;
          }

          .checkout-details-grid input,
          .checkout-details-grid textarea {
            width: 100% !important;
            max-width: 100%;
            box-sizing: border-box;
          }

          .checkout-content section {
            padding: 22px !important;
          }

          .checkout-saved-address-box {
            width: 100%;
            box-sizing: border-box;
          }

          .checkout-address-choice-row {
            grid-template-columns: 1fr !important;
          }

          .checkout-content h2 {
            font-size: 25px !important;
            line-height: 1.15;
          }

          .checkout-payment-option {
            width: 100%;
            box-sizing: border-box;
            align-items: flex-start !important;
          }

          .checkout-payment-option span {
            min-width: 0;
          }

          .checkout-payment-option strong,
          .checkout-payment-option small {
            display: block;
            line-height: 1.35;
          }

          .checkout-payment-option small {
            margin-top: 4px;
          }

          .checkout-summary {
            position: static !important;
            top: auto !important;
            padding: 22px !important;
          }

          .checkout-summary > div {
            min-width: 0;
          }

          .checkout-summary img {
            width: 58px !important;
            height: 70px !important;
            flex-shrink: 0;
          }

          .checkout-summary strong {
            white-space: nowrap;
          }

          .checkout-footer {
            padding: 38px 20px !important;
          }
        }

        @media (max-width: 560px) {
          .checkout-header {
            padding: 12px 14px !important;
          }

          .checkout-logo {
            font-size: 22px !important;
          }

          .checkout-hero {
            padding: 42px 16px 24px !important;
          }

          .checkout-title {
            font-size: 40px !important;
          }

          .checkout-content {
            padding: 8px 12px 50px !important;
          }

          .checkout-content section,
          .checkout-summary {
            padding: 18px !important;
          }

          .checkout-content h2 {
            font-size: 23px !important;
          }

          .checkout-payment-option {
            padding: 14px !important;
          }

          .checkout-payment-option strong {
            font-size: 16px;
          }

          .checkout-payment-option small {
            font-size: 12px;
          }

          .checkout-summary .checkout-item-name {
            font-size: 14px;
          }
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
            letter-spacing: .16em;
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

           .dreamzy-footer {
            padding: 15px 3px 96px !important;
          }

          .dreamzy-footer-top {
            grid-template-columns: 156px minmax(0, 1fr) !important;
            grid-template-areas:
              "logo follow"
              "logo brand"
              "links links" !important;
            gap: 10px 12px !important;
            align-items: start !important;
            padding-bottom: 14px !important;
          }

          .dreamzy-footer-logo-wrap {
            grid-area: logo;
            width: 156px !important;
            max-width: 156px !important;
            padding: 6px !important;
            justify-self: start !important;
            align-self: center !important;
          }

          .dreamzy-footer-logo-image {
            width: 100% !important;
            max-height: 150px !important;
            object-fit: contain !important;
          }

          .dreamzy-footer-brand {
            grid-area: brand;
            text-align: left !important;
          }

          .dreamzy-footer-follow {
            grid-area: follow;
            border-left: 0 !important;
            border-top: 1px solid rgba(255, 220, 215, 0.34) !important;
            padding: 0 !important;
            align-self: start !important;
            justify-content: flex-start !important;
          }

          .dreamzy-footer-wordmark {
            font-size: 23px !important;
            letter-spacing: 1.5px !important;
          }

          .dreamzy-footer-tagline {
            margin: 5px 0 0 !important;
            max-width: 170px !important;
            font-size: 10px !important;
            line-height: 1.35 !important;
          }

          .dreamzy-footer-rule {
            width: 46px !important;
            margin: 8px 0 !important;
          }

          .dreamzy-footer-copy {
            max-width: 180px !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            font-size: 9px !important;
            line-height: 1.4 !important;
          }

          .dreamzy-footer-shop-links {
            gap: 7px 10px !important;
            margin-top: 9px !important;
            justify-content: flex-start !important;
          }

          .dreamzy-footer-shop-links a {
            gap: 4px !important;
            font-size: 9px !important;
          }

          .dreamzy-footer-shop-links span {
            font-size: 12px !important;
          }

          .dreamzy-footer-heading {
            font-size: 8px !important;
            letter-spacing: 2px !important;
            margin-bottom: 7px !important;
          }

          .dreamzy-footer-social {
            gap: 6px !important;
          }

          .dreamzy-footer-social a {
            width: 30px !important;
            height: 30px !important;
            font-size: 12px !important;
          }

          .dreamzy-footer-links {
            grid-area: links;
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            column-gap: 8px;
            border-left: 0 !important;
            border-top: 1px solid rgba(255, 220, 215, 0.34);
            padding: 10px 0 0 !important;
          }

          .dreamzy-footer-links .dreamzy-footer-heading {
            grid-column: 1 / -1;
          }

          .dreamzy-footer-links a {
            padding: 4px 0 !important;
            font-size: 8px !important;
            white-space: normal !important;
          }

          .dreamzy-footer-links b {
            font-size: 12px !important;
          }

          .dreamzy-footer-bottom {
            padding-top: 9px !important;
            gap: 4px !important;
            flex-direction: column !important;
            text-align: center !important;
            font-size: 8px !important;
          }
        }
      `}</style>
    </main>
  );
}

const page = {
  minHeight: "100vh",
  background: "#faf6f1",
  color: "#542f35",
  fontFamily: "Arial,sans-serif"
};

const loadingPage = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#faf6f1",
  color: "#542f35",
  fontFamily: "Arial,sans-serif"
};

const header = {
  background: "#fffdfb",
  borderBottom: "1px solid #eadfd8",
  padding: "18px 58px"
};

const headerInner = {
  maxWidth: 1290,
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 30
};

const logo = {
  color: "#542f35",
  textDecoration: "none",
  fontFamily: "Georgia,serif",
  fontSize: 30,
  letterSpacing: 4
};

const navWrap = {
  display: "flex",
  alignItems: "center",
  gap: 24
};

const nav = {
  color: "#542f35",
  textDecoration: "none",
  fontSize: 12,
  letterSpacing: 1,
  whiteSpace: "nowrap"
};

const hero = {
  textAlign: "center" as const,
  padding: "60px 25px 35px"
};

const eyebrow = {
  fontSize: 11,
  letterSpacing: 3,
  color: "#987276",
  fontWeight: 700
};

const title = {
  fontFamily: "Georgia,serif",
  fontWeight: 400,
  fontSize: 50,
  margin: "12px 0"
};

const subtitle = {
  color: "#765b5e"
};

const content = {
  maxWidth: 1150,
  margin: "0 auto",
  padding: "20px 25px 90px",
  display: "grid",
  gridTemplateColumns: "1fr 390px",
  gap: 25
};

const card = {
  background: "#fffdfb",
  border: "1px solid #eadfd8",
  padding: 30,
  marginBottom: 22
};

const summary = {
  background: "#fffdfb",
  border: "1px solid #eadfd8",
  padding: 30,
  height: "fit-content",
  position: "sticky" as const,
  top: 20
};

const cardTitle = {
  fontFamily: "Georgia,serif",
  fontWeight: 400,
  fontSize: 27,
  margin: "10px 0 22px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 17
};

const label = {
  display: "grid",
  gap: 7,
  fontSize: 10,
  letterSpacing: 1.5,
  fontWeight: 700
};

const input = {
  height: 48,
  border: "1px solid #d9cbc7",
  background: "#fff",
  padding: "0 14px",
  color: "#542f35",
  fontSize: 14,
  outline: "none"
};

const textarea = {
  minHeight: 105,
  border: "1px solid #d9cbc7",
  background: "#fff",
  padding: 14,
  color: "#542f35",
  fontSize: 14,
  resize: "vertical" as const,
  fontFamily: "Arial,sans-serif"
};

const profileNote = {
  margin: "15px 0 0",
  color: "#8a7072",
  fontSize: 12,
  lineHeight: 1.6
};

const smallButton = {
  marginTop: 20,
  border: "1px solid #542f35",
  background: "#fffdfb",
  color: "#542f35",
  padding: "12px 16px",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 1
};

const savedAddressHeading = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 15,
  flexWrap: "wrap" as const
};

const addAddressButton = {
  border: "1px solid #542f35",
  background: "#fffdfb",
  color: "#542f35",
  padding: "10px 13px",
  cursor: "pointer",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 1
};

const newAddressForm = {
  display: "grid",
  gap: 15,
  marginTop: 15,
  padding: 17,
  background: "#fffdfb",
  border: "1px solid #eadfd8"
};

const addressChoiceRow = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 8
};

const addressChoiceButton = {
  minHeight: 40,
  border: "1px solid #d9cbc7",
  background: "#fff",
  color: "#542f35",
  cursor: "pointer",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 1
};

const addressChoiceButtonActive = {
  border: "1px solid #542f35",
  background: "#542f35",
  color: "#fff"
};

const addressError = {
  background: "#f6e5e3",
  border: "1px solid #d9b5b0",
  color: "#7b343b",
  padding: "11px 13px",
  fontSize: 12
};

const cancelAddressButton = {
  minHeight: 52,
  border: "1px solid #542f35",
  background: "#fffdfb",
  color: "#542f35",
  padding: "0 18px",
  cursor: "pointer",
  fontWeight: 700,
  letterSpacing: 1
};

const savedAddressBox = {
  marginBottom: 22,
  padding: 20,
  background: "#faf6f1",
  border: "1px solid #eadfd8"
};

const savedAddressTitle = {
  fontFamily: "Georgia,serif",
  fontWeight: 400,
  fontSize: 22,
  margin: "8px 0 15px"
};

const savedAddressList = {
  display: "grid",
  gap: 10
};

const savedAddressOption = {
  display: "flex",
  alignItems: "flex-start",
  gap: 11,
  padding: 14,
  border: "1px solid #d9cbc7",
  background: "#fffdfb",
  cursor: "pointer"
};

const savedAddressOptionActive = {
  border: "1px solid #542f35",
  background: "#fff"
};

const savedAddressName = {
  display: "block",
  fontSize: 13,
  color: "#542f35",
  marginBottom: 5
};

const savedAddressBadge = {
  display: "inline-block",
  marginLeft: 8,
  padding: "3px 6px",
  background: "#542f35",
  color: "#fff",
  fontSize: 8,
  letterSpacing: 1
};

const savedAddressText = {
  display: "block",
  color: "#765b5e",
  fontSize: 12,
  lineHeight: 1.55
};

const manageAddressLink = {
  display: "inline-block",
  marginTop: 13,
  color: "#542f35",
  textDecoration: "none",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 1
};

const paymentOption = {
  display: "flex",
  gap: 12,
  alignItems: "flex-start",
  border: "1px solid #eadfd8",
  padding: 16,
  marginBottom: 12,
  cursor: "pointer"
};

const errorBox = {
  background: "#f6e5e3",
  border: "1px solid #d9b5b0",
  color: "#7b343b",
  padding: "14px 18px",
  marginBottom: 22
};

const items = {
  display: "grid",
  gap: 15
};

const itemRow = {
  display: "flex",
  alignItems: "center",
  gap: 12
};

const itemImageWrap = {
  width: 62,
  height: 75,
  flexShrink: 0,
  background: "#eee5df"
};

const itemImage = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const
};

const noImage = {
  height: "100%",
  display: "grid",
  placeItems: "center",
  fontFamily: "Georgia,serif",
  fontSize: 22
};

const itemName = {
  fontFamily: "Georgia,serif",
  fontSize: 16,
  marginBottom: 5
};

const itemMeta = {
  fontSize: 11,
  color: "#8a7072"
};

const line = {
  height: 1,
  background: "#eadfd8",
  margin: "20px 0"
};

const totalRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 12,
  color: "#765b5e"
};

const grandTotal = {
  display: "flex",
  justifyContent: "space-between",
  borderTop: "1px solid #eadfd8",
  paddingTop: 18,
  marginTop: 15,
  fontSize: 19
};

const placeButton = {
  width: "100%",
  height: 52,
  marginTop: 25,
  border: 0,
  background: "#542f35",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
  letterSpacing: 1
};

const freeShippingNote = {
  fontSize: 11,
  color: "#542f35",
  fontWeight: 700,
  letterSpacing: 1,
  textAlign: "center" as const,
  marginTop: 12
};

const secureNote = {
  fontSize: 11,
  color: "#8a7072",
  lineHeight: 1.5,
  textAlign: "center" as const,
  marginTop: 15
};

const empty = {
  textAlign: "center" as const,
  color: "#765b5e",
  padding: "25px 0"
};

const primaryLink = {
  display: "inline-block",
  marginTop: 10,
  padding: "12px 18px",
  background: "#542f35",
  color: "#fff",
  textDecoration: "none",
  fontSize: 11,
  fontWeight: 700
};

const footer = {
  background: "#542f35",
  color: "#fff",
  padding: "45px 25px",
  textAlign: "center" as const
};

const footerLogo = {
  fontFamily: "Georgia,serif",
  fontSize: 28,
  letterSpacing: 3
};
