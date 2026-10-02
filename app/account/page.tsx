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

type Order = {
  id?: string;
  orderNumber?: string;
  total?: number;
  status?: string;
  createdAt?: string;
  items?: Array<{
    productId?: string;
    name: string;
    price: number;
    quantity?: number;
    size?: string;
    image?: string;
  }>;
};

const emptyAccount: Account = {
  name: "",
  email: "",
  mobile: "",
  address: "",
  city: "",
  state: "",
  pincode: ""
};

const INVOICE_PREFIX = "DRZ/2026-27/";
const INVOICE_STORAGE_KEY = "dreamzy-invoice-numbers";
const INVOICE_COUNTER_KEY = "dreamzy-invoice-counter-2026-27";

function getOrCreateInvoiceNumber(orderNumber: string) {
  try {
    const raw = localStorage.getItem(INVOICE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const map =
      parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? parsed
        : {};

    if (map[orderNumber]) return String(map[orderNumber]);

    let counter = Number(
      localStorage.getItem(INVOICE_COUNTER_KEY) || "0"
    );
    if (!Number.isFinite(counter) || counter < 0) counter = 0;

    const next = Math.floor(counter) + 1;
    const invoiceNumber =
      `${INVOICE_PREFIX}${String(next).padStart(4, "0")}`;

    map[orderNumber] = invoiceNumber;
    localStorage.setItem(INVOICE_COUNTER_KEY, String(next));
    localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(map));

    return invoiceNumber;
  } catch {
    return `${INVOICE_PREFIX}${orderNumber}`;
  }
}

export default function AccountPage() {
  const [account, setAccount] = useState<Account>(emptyAccount);
  const [form, setForm] = useState<Account>(emptyAccount);
  const [loggedIn, setLoggedIn] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<SavedAddress>({
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

  useEffect(() => {
    loadAccount();
    loadOrders();
    loadAddresses();

    const refresh = () => {
      loadAccount();
      loadOrders();
      loadAddresses();
    };

    window.addEventListener("focus", refresh);
    window.addEventListener("dreamzy-account-updated", refresh);
    window.addEventListener("dreamzy-orders-updated", refresh);
    window.addEventListener("dreamzy-addresses-updated", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("dreamzy-account-updated", refresh);
      window.removeEventListener("dreamzy-orders-updated", refresh);
      window.removeEventListener("dreamzy-addresses-updated", refresh);
    };
  }, []);

  useEffect(() => {
    if (!loggedIn) return;

    const targetId = window.location.hash.slice(1);
    if (targetId !== "orders" && targetId !== "addresses") return;

    requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }, [loggedIn]);

  function loadAccount() {
    try {
      const raw = localStorage.getItem("dreamzy-account");
      const saved = raw ? JSON.parse(raw) : null;

      if (saved && saved.name) {
        const normalized: Account = {
          name: saved.name || "",
          email: saved.email || "",
          mobile: saved.mobile || "",
          address: saved.address || "",
          city: saved.city || "",
          state: saved.state || "",
          pincode: saved.pincode || ""
        };
        setAccount(normalized);
        setForm(normalized);
        setLoggedIn(true);
      } else {
        setAccount(emptyAccount);
        setForm(emptyAccount);
        setLoggedIn(false);
      }
    } catch {
      setAccount(emptyAccount);
      setForm(emptyAccount);
      setLoggedIn(false);
    }
  }

  function loadOrders() {
    try {
      const raw = localStorage.getItem("dreamzy-orders");
      const saved = raw ? JSON.parse(raw) : [];

      if (Array.isArray(saved)) {
        const normalizedOrders = saved.map((order: any) => {
            const orderNumber = String(
              order?.orderNumber ||
                order?.orderNo ||
                order?.orderId ||
                order?.id ||
                ""
            ).trim();

            if (!orderNumber) return order;

            const invoiceNumber =
              order?.invoiceNumber || getOrCreateInvoiceNumber(orderNumber);

            return {
              ...order,
              invoiceNumber
            };
          });

        // Persist invoice numbers on the actual orders so the same invoice
        // number is reused on every future visit.
        localStorage.setItem("dreamzy-orders", JSON.stringify(normalizedOrders));
        setOrders(normalizedOrders);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    }
  }

  function loadAddresses() {
    try {
      const raw = localStorage.getItem("dreamzy-addresses");
      const saved = raw ? JSON.parse(raw) : [];
      setAddresses(Array.isArray(saved) ? saved : []);
    } catch {
      setAddresses([]);
    }
  }

  function openNewAddress() {
    setEditingAddressId(null);
    // Start a new saved address with the customer's existing Account Profile details.
    setAddressForm({
      id: "",
      label: "Home",
      name: account.name || "",
      mobile: account.mobile || "",
      address: account.address || "",
      city: account.city || "",
      state: account.state || "",
      pincode: account.pincode || "",
      isDefault: addresses.length === 0
    });
    setAddressFormOpen(true);
  }

  function openEditAddress(item: SavedAddress) {
    setEditingAddressId(item.id);
    setAddressForm({ ...item });
    setAddressFormOpen(true);
  }

  function saveAddress(event: React.FormEvent) {
    event.preventDefault();

    if (
      !addressForm.name.trim() ||
      !addressForm.mobile.trim() ||
      !addressForm.address.trim() ||
      !addressForm.city.trim() ||
      !addressForm.state.trim() ||
      !/^\d{6}$/.test(addressForm.pincode.trim())
    ) {
      setMessage("Please complete all address fields and enter a valid 6 digit pincode.");
      setTimeout(() => setMessage(""), 2600);
      return;
    }

    if (!/^[6-9]\d{9}$/.test(addressForm.mobile.trim())) {
      setMessage("Please enter a valid 10 digit Indian mobile number.");
      setTimeout(() => setMessage(""), 2400);
      return;
    }

    const nextId = editingAddressId || `ADDR${Date.now()}`;
    const makeDefault = addressForm.isDefault || addresses.length === 0;

    const nextAddress: SavedAddress = {
      ...addressForm,
      id: nextId,
      label: addressForm.label.trim() || "Address",
      name: addressForm.name.trim(),
      mobile: addressForm.mobile.trim(),
      address: addressForm.address.trim(),
      city: addressForm.city.trim(),
      state: addressForm.state.trim(),
      pincode: addressForm.pincode.trim(),
      isDefault: makeDefault
    };

    const next = addresses
      .map((item) => (makeDefault ? { ...item, isDefault: false } : item))
      .filter((item) => item.id !== nextId);

    next.unshift(nextAddress);

    localStorage.setItem("dreamzy-addresses", JSON.stringify(next));
    setAddresses(next);
    setAddressFormOpen(false);
    setEditingAddressId(null);
    window.dispatchEvent(new Event("dreamzy-addresses-updated"));
    setMessage("Address saved successfully.");
    setTimeout(() => setMessage(""), 2200);
  }

  function setDefaultAddress(id: string) {
    const next = addresses.map((item) => ({
      ...item,
      isDefault: item.id === id
    }));
    localStorage.setItem("dreamzy-addresses", JSON.stringify(next));
    setAddresses(next);
    window.dispatchEvent(new Event("dreamzy-addresses-updated"));
    setMessage("Default address updated.");
    setTimeout(() => setMessage(""), 2000);
  }

  function deleteAddress(id: string) {
    const target = addresses.find((item) => item.id === id);
    if (!target) return;

    if (!window.confirm(`Delete ${target.label} address?`)) return;

    let next = addresses.filter((item) => item.id !== id);

    if (target.isDefault && next.length > 0) {
      next = next.map((item, index) => ({
        ...item,
        isDefault: index === 0
      }));
    }

    localStorage.setItem("dreamzy-addresses", JSON.stringify(next));
    setAddresses(next);
    window.dispatchEvent(new Event("dreamzy-addresses-updated"));
    setMessage("Address deleted.");
    setTimeout(() => setMessage(""), 2000);
  }

  function saveAccount(event: React.FormEvent) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.mobile.trim()) {
      setMessage("Please enter name, email and mobile number.");
      setTimeout(() => setMessage(""), 2200);
      return;
    }

    localStorage.setItem("dreamzy-account", JSON.stringify(form));
    setAccount(form);
    setLoggedIn(true);
    setEditing(false);

    // Keep the customer's default saved address synchronized with the
    // Account Profile. Historical orders are NOT changed because each order
    // stores its own deliveryAddress snapshot at checkout time.
    try {
      const rawAddresses = localStorage.getItem("dreamzy-addresses");
      const currentAddresses = rawAddresses ? JSON.parse(rawAddresses) : [];

      if (Array.isArray(currentAddresses) && currentAddresses.length > 0) {
        const hasDefault = currentAddresses.some(
          (item: any) => item?.isDefault === true
        );

        if (hasDefault) {
          const syncedAddresses = currentAddresses.map((item: any) =>
            item?.isDefault
              ? {
                  ...item,
                  name: form.name.trim(),
                  mobile: form.mobile.trim(),
                  address: form.address.trim(),
                  city: form.city.trim(),
                  state: form.state.trim(),
                  pincode: form.pincode.trim()
                }
              : item
          );

          localStorage.setItem(
            "dreamzy-addresses",
            JSON.stringify(syncedAddresses)
          );
          setAddresses(syncedAddresses);
          window.dispatchEvent(new Event("dreamzy-addresses-updated"));
        }
      }
    } catch {}

    window.dispatchEvent(new Event("dreamzy-account-updated"));

    setMessage("Account saved successfully.");
    setTimeout(() => setMessage(""), 2200);
  }

  function logout() {
    localStorage.removeItem("dreamzy-account");
    setAccount(emptyAccount);
    setForm(emptyAccount);
    setLoggedIn(false);
    setMessage("You have been logged out.");
    setTimeout(() => setMessage(""), 1800);
  }

  function cancelOrder(orderNumber: string) {
    const target = orders.find(
      (order) => (order.orderNumber || order.id) === orderNumber
    );

    if (!target) {
      setMessage("Order could not be found.");
      setTimeout(() => setMessage(""), 2200);
      return;
    }

    const status = String(target.status || "NEW").toUpperCase();

    // Customer cancellation is allowed only before packing.
    if (!["NEW", "CONFIRMED"].includes(status)) {
      setMessage(
        status === "CANCELLED"
          ? "This order is already cancelled."
          : "This order can no longer be cancelled."
      );
      setTimeout(() => setMessage(""), 2500);
      return;
    }

    if (
      !window.confirm(
        `Cancel order ${orderNumber}? Your reserved stock will be returned to inventory.`
      )
    ) {
      return;
    }

    try {
      // Restore the exact size-wise quantity reserved by this order.
      // Always read the latest saved order and inventory so we never restore
      // stock from stale React state.
      const latestOrdersRaw = localStorage.getItem("dreamzy-orders");
      const latestOrders = latestOrdersRaw ? JSON.parse(latestOrdersRaw) : [];
      const latestTarget = Array.isArray(latestOrders)
        ? latestOrders.find(
            (order: any) =>
              String(order?.orderNumber || order?.id) === String(orderNumber)
          )
        : null;
      const orderToRestore = latestTarget || target;

      const catalogRaw = localStorage.getItem("dreamzy-products");
      const catalog = catalogRaw ? JSON.parse(catalogRaw) : [];

      if (!Array.isArray(catalog)) {
        setMessage("Inventory could not be updated. Please try again.");
        return;
      }

      const nextCatalog = catalog.map((product: any) => ({
        ...product,
        sizes: Array.isArray(product?.sizes) ? [...product.sizes] : [],
        sizeStock:
          product?.sizeStock && typeof product.sizeStock === "object"
            ? { ...product.sizeStock }
            : undefined
      }));

      for (const item of orderToRestore.items || []) {
        const itemProductId = String(
          item?.productId || String(item?.id || "").split("-")[0] || ""
        );
        const itemName = String(item?.name || "").trim().toLowerCase();

        const product = nextCatalog.find((entry: any) => {
          const sameId = itemProductId && String(entry?.id) === itemProductId;
          const sameName =
            itemName && String(entry?.name || "").trim().toLowerCase() === itemName;
          return sameId || sameName;
        });

        if (!product) continue;

        const quantity = Math.max(1, Number(item?.quantity || 1));
        const requestedSize = String(item?.size || product.sizes?.[0] || "M").trim();

        if (product.sizeStock && typeof product.sizeStock === "object") {
          const matchingSize =
            Object.keys(product.sizeStock).find(
              (key) => key.trim().toLowerCase() === requestedSize.toLowerCase()
            ) || requestedSize;

          const current = Number(product.sizeStock[matchingSize] || 0);
          product.sizeStock[matchingSize] = current + quantity;
          product.stock = Object.values(
            product.sizeStock as Record<string, number>
          ).reduce(
            (sum: number, value: number) => sum + Number(value || 0),
            0
          );
        } else {
          product.stock = Number(product.stock || 0) + quantity;
        }
      }

      const updatedOrders = orders.map((order) =>
        (order.orderNumber || order.id) === orderNumber
          ? { ...order, status: "CANCELLED" }
          : order
      );

      localStorage.setItem(
        "dreamzy-products",
        JSON.stringify(nextCatalog)
      );
      localStorage.setItem(
        "dreamzy-orders",
        JSON.stringify(updatedOrders)
      );

      try {
        const last = JSON.parse(
          localStorage.getItem("dreamzy-last-order") || "null"
        );

        if (
          last &&
          String(last.orderNumber || last.id) === orderNumber
        ) {
          localStorage.setItem(
            "dreamzy-last-order",
            JSON.stringify({ ...last, status: "CANCELLED" })
          );
        }
      } catch {}

      setOrders(updatedOrders);
      window.dispatchEvent(new Event("dreamzy-products-updated"));
      window.dispatchEvent(new Event("dreamzy-orders-updated"));

      setMessage("Order cancelled and stock has been returned to inventory.");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Unable to cancel the order. Please try again.");
      setTimeout(() => setMessage(""), 2500);
    }
  }

  return (
    <main style={page}>
      <style>{`${accountResponsiveStyles}\n${accountHeaderFooterStyles}`}</style>
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
                  My Account
                </Link>
                <Link href="/my-orders" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  My Orders
                </Link>
                <Link href="/account#addresses" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  My Addresses
                </Link>
                <Link href="/wishlist" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  Wishlist
                </Link>
                <div className="mobile-account-divider" />
                <button type="button" className="mobile-account-logout" onClick={logout}>
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

      {message && <div style={toast}>{message}</div>}

      <section style={hero}>
        <div style={eyebrow}>DREAMZY CUSTOMER</div>
        <h1 style={title}>My Account</h1>
        <p style={subtitle}>Manage your details and view your DREAMZY orders.</p>
      </section>

      <section className="account-content" style={content}>
        {!loggedIn ? (
          <div style={loginCard}>
            <div style={eyebrow}>WELCOME TO DREAMZY</div>
            <h2 style={cardTitle}>Create your account</h2>
            <p style={muted}>
              Save your details for faster checkout and keep your orders together.
            </p>

            <form onSubmit={saveAccount} style={formGrid}>
              <label style={label}>
                FULL NAME
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  style={input}
                />
              </label>

              <label style={label}>
                EMAIL
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  style={input}
                />
              </label>

              <label style={label}>
                MOBILE NUMBER
                <input
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  placeholder="10 digit mobile number"
                  style={input}
                />
              </label>

              <label style={label}>
                ADDRESS
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Your delivery address"
                  style={textarea}
                />
              </label>

              <div className="account-profile-grid" style={accountProfileGrid}>
                <label style={label}>
                  CITY
                  <input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="City"
                    style={input}
                  />
                </label>

                <label style={label}>
                  STATE
                  <input
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    placeholder="State"
                    style={input}
                  />
                </label>

                <label style={label}>
                  PINCODE
                  <input
                    value={form.pincode}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        pincode: e.target.value.replace(/\D/g, "").slice(0, 6)
                      })
                    }
                    placeholder="6 digit pincode"
                    inputMode="numeric"
                    maxLength={6}
                    style={input}
                  />
                </label>
              </div>

              <button type="submit" style={primaryButton}>
                CREATE ACCOUNT
              </button>
            </form>
          </div>
        ) : (
          <div className="account-two-column" style={twoColumn}>
            <div>
              <div className="account-card" style={card}>
                <div style={cardTop}>
                  <div>
                    <div style={eyebrow}>ACCOUNT DETAILS</div>
                    <h2 style={cardTitle}>{account.name}</h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setForm(account);
                      setEditing(true);
                    }}
                    style={outlineButton}
                  >
                    EDIT
                  </button>
                </div>

                {!editing ? (
                  <div style={details}>
                    <div><strong>Email</strong><span>{account.email}</span></div>
                    <div><strong>Mobile</strong><span>{account.mobile}</span></div>
                    <div><strong>Address</strong><span>{account.address || "No address saved."}</span></div>
                    <div><strong>City</strong><span>{account.city || "Not saved."}</span></div>
                    <div><strong>State</strong><span>{account.state || "Not saved."}</span></div>
                    <div><strong>Pincode</strong><span>{account.pincode || "Not saved."}</span></div>
                  </div>
                ) : (
                  <form onSubmit={saveAccount} style={formGrid}>
                    <label style={label}>
                      FULL NAME
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={input} />
                    </label>

                    <label style={label}>
                      EMAIL
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={input} />
                    </label>

                    <label style={label}>
                      MOBILE NUMBER
                      <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} style={input} />
                    </label>

                    <label style={label}>
                      ADDRESS
                      <textarea
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        style={textarea}
                      />
                    </label>

                    <div className="account-profile-grid" style={accountProfileGrid}>
                      <label style={label}>
                        CITY
                        <input
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          placeholder="City"
                          style={input}
                        />
                      </label>

                      <label style={label}>
                        STATE
                        <input
                          value={form.state}
                          onChange={(e) => setForm({ ...form, state: e.target.value })}
                          placeholder="State"
                          style={input}
                        />
                      </label>

                      <label style={label}>
                        PINCODE
                        <input
                          value={form.pincode}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              pincode: e.target.value.replace(/\D/g, "").slice(0, 6)
                            })
                          }
                          placeholder="6 digit pincode"
                          inputMode="numeric"
                          maxLength={6}
                          style={input}
                        />
                      </label>
                    </div>

                    <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                      <button type="submit" style={primaryButton}>SAVE CHANGES</button>
                      <button type="button" onClick={() => setEditing(false)} style={outlineButton}>CANCEL</button>
                    </div>
                  </form>
                )}

                <button type="button" onClick={logout} style={logoutButton}>
                  LOG OUT
                </button>
              </div>

              <div id="addresses" className="account-card" style={{ ...card, scrollMarginTop: 24 }}>
                <div style={cardTop}>
                  <div>
                    <div style={eyebrow}>SAVED ADDRESSES</div>
                    <h2 style={cardTitle}>Delivery addresses</h2>
                  </div>
                  {!addressFormOpen && (
                    <button type="button" onClick={openNewAddress} style={primaryButton}>
                      + ADD ADDRESS
                    </button>
                  )}
                </div>

                {addressFormOpen && (
                  <form onSubmit={saveAddress} style={formGrid}>
                    <div className="account-address-labels" style={addressLabelGrid}>
                      {["Home", "Office", "Other"].map((labelName) => (
                        <button
                          key={labelName}
                          type="button"
                          onClick={() => setAddressForm({ ...addressForm, label: labelName })}
                          style={{
                            ...addressLabelButton,
                            ...(addressForm.label === labelName ? addressLabelButtonActive : {})
                          }}
                        >
                          {labelName}
                        </button>
                      ))}
                    </div>

                    <label style={label}>
                      ADDRESS LABEL
                      <input
                        value={addressForm.label}
                        onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                        placeholder="Home / Office / Other"
                        style={input}
                      />
                    </label>

                    <label style={label}>
                      FULL NAME
                      <input
                        value={addressForm.name}
                        onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                        style={input}
                      />
                    </label>

                    <label style={label}>
                      MOBILE NUMBER
                      <input
                        value={addressForm.mobile}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            mobile: e.target.value.replace(/\D/g, "").slice(0, 10)
                          })
                        }
                        inputMode="numeric"
                        maxLength={10}
                        style={input}
                      />
                    </label>

                    <label style={label}>
                      ADDRESS
                      <textarea
                        value={addressForm.address}
                        onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                        style={textarea}
                      />
                    </label>

                    <div className="account-profile-grid" style={accountProfileGrid}>
                      <label style={label}>
                        CITY
                        <input
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          style={input}
                        />
                      </label>

                      <label style={label}>
                        STATE
                        <input
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          style={input}
                        />
                      </label>

                      <label style={label}>
                        PINCODE
                        <input
                          value={addressForm.pincode}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              pincode: e.target.value.replace(/\D/g, "").slice(0, 6)
                            })
                          }
                          inputMode="numeric"
                          maxLength={6}
                          style={input}
                        />
                      </label>
                    </div>

                    <label className="address-default-check" style={defaultCheck}>
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, isDefault: e.target.checked })
                        }
                      />
                      <span>SET AS DEFAULT ADDRESS</span>
                    </label>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button type="submit" style={primaryButton}>
                        {editingAddressId ? "SAVE ADDRESS" : "ADD ADDRESS"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAddressFormOpen(false);
                          setEditingAddressId(null);
                        }}
                        style={outlineButton}
                      >
                        CANCEL
                      </button>
                    </div>
                  </form>
                )}

                {!addressFormOpen && addresses.length === 0 && (
                  <div style={emptyAddress}>
                    <p>No saved addresses yet.</p>
                    <button type="button" onClick={openNewAddress} style={outlineButton}>
                      ADD YOUR FIRST ADDRESS
                    </button>
                  </div>
                )}

                {!addressFormOpen && addresses.length > 0 && (
                  <div style={addressList}>
                    {addresses.map((item) => (
                      <div key={item.id} style={addressCard}>
                        <div className="account-address-card-top" style={addressCardTop}>
                          <div>
                            <div style={addressLabel}>
                              {item.label}
                              {item.isDefault && <span style={defaultBadge}>DEFAULT</span>}
                            </div>
                            <strong>{item.name}</strong>
                          </div>

                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <button type="button" onClick={() => openEditAddress(item)} style={smallOutlineButton}>
                              EDIT
                            </button>
                            <button type="button" onClick={() => deleteAddress(item.id)} style={smallDeleteButton}>
                              DELETE
                            </button>
                          </div>
                        </div>

                        <div style={addressText}>
                          {item.address}<br />
                          {item.city}, {item.state} - {item.pincode}<br />
                          Mobile: {item.mobile}
                        </div>

                        {!item.isDefault && (
                          <button type="button" onClick={() => setDefaultAddress(item.id)} style={defaultButton}>
                            SET AS DEFAULT
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div id="orders" className="account-card" style={{ ...card, scrollMarginTop: 24 }}>
                <div style={eyebrow}>MY ORDERS</div>
                <h2 style={cardTitle}>Order history</h2>

                {orders.length === 0 ? (
                  <div style={emptyOrder}>
                    <p>No orders found yet.</p>
                    <Link href="/women" style={primaryLink}>START SHOPPING</Link>
                  </div>
                ) : (
                  <div style={{ display:"grid", gap:14 }}>
                    {orders.map((order, index) => (
                      <div className="account-order-row" key={order.orderNumber || order.id || index} style={orderRow}>
                        <div>
                          <Link
                            href={`/account/orders/${encodeURIComponent(
                              order.orderNumber || order.id || ""
                            )}`}
                            style={{
                              color:"#542f35",
                              textDecoration:"none",
                              fontWeight:700
                            }}
                          >
                            {order.orderNumber || order.id || `ORDER ${index + 1}`}
                          </Link>
                          <div style={smallText}>
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "Recent order"}
                          </div>

                          <div
                            style={{
                              marginTop: 6,
                              color: "#987276",
                              fontSize: 10,
                              letterSpacing: 0.7,
                              fontWeight: 700
                            }}
                          >
                            INVOICE{" "}
                            {order.invoiceNumber || "Not assigned"}
                          </div>
                        </div>

                        <div className="account-order-actions">
                          <div style={{ textAlign:"right" }}>
                            <strong>₹{Number(order.total || 0).toLocaleString("en-IN")}</strong>
                            <div style={smallText}>{order.status || "NEW"}</div>
                          </div>

                          <Link
                            href={`/account/orders/${encodeURIComponent(
                              order.orderNumber || order.id || ""
                            )}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minHeight: 38,
                              padding: "0 13px",
                              border: "1px solid #542f35",
                              background: "#fffdfb",
                              color: "#542f35",
                              textDecoration: "none",
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: 0.9
                            }}
                          >
                            VIEW / PRINT INVOICE
                          </Link>

                          {["NEW", "CONFIRMED"].includes(
                            String(order.status || "NEW").toUpperCase()
                          ) && (
                            <button
                              type="button"
                              onClick={() =>
                                cancelOrder(order.orderNumber || order.id || "")
                              }
                              style={cancelButton}
                            >
                              CANCEL ORDER
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <aside className="account-side-card" style={sideCard}>
              <div style={eyebrow}>QUICK LINKS</div>
              <Link href="/wishlist" style={sideLink}>♡ My Wishlist</Link>
              <Link href="/cart" style={sideLink}>🛍️ My Cart</Link>
              <Link href="/women" style={sideLink}>Women's Nightwear</Link>
              <Link href="/kids" style={sideLink}>Kids' Nightwear</Link>
              <Link href="/admin/orders" style={sideLink}>Admin Orders</Link>
            </aside>
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
        <Link href="/account" className="mobile-bottom-nav-item account-active" aria-label="Account">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="3.5" /><path d="M4 21v-2.2a5.3 5.3 0 0 1 5.3-5.3h5.4a5.3 5.3 0 0 1 5.3 5.3V21H4Z" /></svg>
          <span>Account</span>
        </Link>
        <Link href="/cart" className="mobile-bottom-nav-item" aria-label="Cart">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 3h2.8l2.2 12.1a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.5L22 8H6" /><circle cx="10" cy="20" r="1.2" /><circle cx="18" cy="20" r="1.2" /></svg>
          <span>Cart</span>
        </Link>
      </nav>
    </main>
  );
}


const accountResponsiveStyles = `
  .account-mobile-logo,
  .account-menu-button,
  .account-mobile-menu {
    display: none;
  }

  @media (max-width: 700px) {
    .account-order-actions {
      display: flex !important;
      flex-direction: column;
      align-items: flex-end;
      gap: 9px;
    }
    .account-header {
      position: relative !important;
      z-index: 100 !important;
      padding: 10px 18px !important;
    }

    .account-header-inner {
      min-height: 36px;
      width: 100%;
    }

    .account-desktop-logo,
    .account-desktop-nav {
      display: none !important;
    }

    .account-menu-button {
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

    .account-menu-button span {
      display: block;
      width: 22px;
      height: 1.5px;
      background: #542f35;
    }

    .account-mobile-logo {
      display: block;
      margin-left: auto;
      color: #542f35;
      text-decoration: none;
      font-family: Georgia, serif;
      font-size: 20px;
      letter-spacing: 2.5px;
    }

    .account-mobile-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      background: #fffdfb;
      border-top: 1px solid #eadfd8;
      border-bottom: 1px solid #eadfd8;
      box-shadow: 0 8px 18px rgba(84,47,53,.10);
    }

    .account-mobile-menu a,
    .account-mobile-menu button {
      display: block;
      width: 100%;
      box-sizing: border-box;
      padding: 14px 20px;
      color: #542f35;
      text-decoration: none;
      font-family: Arial, sans-serif;
      font-size: 14px;
      letter-spacing: 1px;
      text-align: left;
      border: 0;
      border-bottom: 1px solid #eadfd8;
      background: #fffdfb;
      cursor: pointer;
    }

    .account-mobile-menu button {
      color: #542f35;
    }

    .account-content {
      width: 100%;
      box-sizing: border-box;
      padding: 20px 16px 70px !important;
      overflow-x: hidden;
    }

    .account-two-column {
      display: block !important;
    }

    .account-side-card {
      margin-top: 22px;
      width: 100%;
      box-sizing: border-box;
      padding: 22px !important;
    }

    .account-card {
      width: 100%;
      box-sizing: border-box;
      padding: 22px !important;
    }

    .account-card-top {
      gap: 15px;
      flex-wrap: wrap;
    }

    .account-profile-grid {
      grid-template-columns: 1fr !important;
    }

    .account-address-labels {
      grid-template-columns: repeat(3, 1fr) !important;
    }

    .account-address-card {
      padding: 18px !important;
    }

    .account-address-card-top {
      flex-direction: column !important;
      align-items: flex-start !important;
    }

    .account-order-row {
      width: 100%;
      box-sizing: border-box;
      flex-wrap: wrap;
    }

    .account-order-row > div:last-child {
      margin-left: auto;
    }
  }
`;


const accountHeaderFooterStyles = `
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
    .header { height: 64px; padding: 0 18px; position: relative; }
    .menu-button { display: flex; align-items: center; justify-content: center; flex: 0 0 auto; width: 36px; height: 36px; padding: 0; }
    .logo { position: absolute; left: 50%; transform: translateX(-50%); font-size: 25px; letter-spacing: 2px; }
    .account-menu-wrap { display: none; }
    .nav { display: none !important; position: absolute; top: 64px; left: 0; right: 0; width: 100%; max-width: none; background: #fffdfb; border-bottom: 1px solid #eadfd8; padding: 10px 18px 16px; flex-direction: column; align-items: stretch; gap: 0; box-shadow: 0 8px 20px rgba(84,47,53,.08); z-index: 100; }
    .nav.open { display: flex !important; }
    .nav a, .nav button { width: 100%; padding: 14px 4px !important; border-bottom: 1px solid #f0e7e2; font-size: 12px !important; letter-spacing: 1.2px !important; text-align: left; }
  }
  @media (max-width: 600px) {
    .header { height: 60px; padding: 0 14px; }
    .logo { font-size: 22px; letter-spacing: 2px; }
    .menu-button { width: 34px; height: 34px; }
    .nav { top: 60px; }
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

        

        /* Cart-approved mobile navigation/footer additions only. */
        .mobile-account-menu,
        .mobile-bottom-nav,
        .mobile-category-backdrop {
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
            padding: 14px 4px;
            border: 0;
            border-bottom: 1px solid #f0e7e2;
            background: transparent;
            color: #542f35;
            font: inherit;
            font-size: 12px;
            letter-spacing: 1.2px;
            text-align: left;
            cursor: pointer;
          }

          .mobile-account-dropdown {
            width: 100%;
            margin: 4px 0 8px;
            background: #fffdfb;
            border: 1px solid #eadfd8;
            box-shadow: 0 5px 14px rgba(84,47,53,.07);
          }

          .mobile-account-dropdown a,
          .mobile-account-logout {
            width: 100%;
            min-height: 48px;
            display: flex;
            align-items: center;
            padding: 0 14px;
            border: 0;
            border-bottom: 1px solid #eadfd8;
            background: transparent;
            color: #3f3032;
            text-decoration: none;
            font: inherit;
            font-size: 14px;
            text-align: left;
            cursor: pointer;
            box-sizing: border-box;
          }

          .mobile-account-divider {
            height: 1px;
            background: #eadfd8;
          }
        }

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

          .mobile-category-backdrop {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            padding: 0 12px 84px;
            background: rgba(84,47,53,.18);
            z-index: 10000;
          }

          .mobile-category-choice {
            width: 100%;
            max-width: 420px;
            background: #fffdfb;
            border: 1px solid #eadfd8;
            border-radius: 18px;
            box-shadow: 0 12px 30px rgba(84,47,53,.18);
            overflow: hidden;
          }

          .mobile-category-choice-heading {
            padding: 15px 18px;
            color: #542f35;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 2px;
            border-bottom: 1px solid #eadfd8;
          }

          .mobile-category-choice a {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 18px;
            color: #542f35;
            text-decoration: none;
            font-size: 12px;
            border-bottom: 1px solid #f0e7e2;
          }

          .mobile-category-choice a:last-child {
            border-bottom: 0;
          }

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

          .mobile-bottom-nav-item.account-active {
            background: #f3e8e9 !important;
          }
        }

        /* DESKTOP ONLY — mobile navigation elements remain hidden above 900px.
           All existing mobile rules are intentionally untouched. */
        @media (min-width: 901px) {
          .mobile-account-menu {
            display: none !important;
          }

          .mobile-bottom-nav {
            display: none !important;
          }

          .mobile-category-backdrop {
            display: none !important;
          }

          .menu-button {
            display: none !important;
          }

          .account-menu-wrap {
            display: block !important;
          }

          .nav {
            display: flex !important;
          }
        }
`;

const page = {
  minHeight:"100vh",
  background:"#faf6f1",
  color:"#542f35",
  fontFamily:"Arial,sans-serif"
};

const header = {
  background:"#fffdfb",
  borderBottom:"1px solid #eadfd8",
  padding:"20px 28px"
};

const headerInner = {
  maxWidth:1200,
  margin:"0 auto",
  display:"flex",
  alignItems:"center",
  justifyContent:"space-between"
};

const logo = {
  color:"#542f35",
  textDecoration:"none",
  fontFamily:"Georgia,serif",
  fontSize:30,
  letterSpacing:3
};

const navWrap = {
  display:"flex",
  gap:22
};

const nav = {
  color:"#542f35",
  textDecoration:"none",
  fontSize:12,
  letterSpacing:1
};

const hero = {
  textAlign:"center" as const,
  padding:"65px 25px 45px"
};

const eyebrow = {
  fontSize:11,
  letterSpacing:3,
  color:"#987276",
  fontWeight:700
};

const title = {
  fontFamily:"Georgia,serif",
  fontWeight:400,
  fontSize:52,
  margin:"12px 0"
};

const subtitle = {
  color:"#765b5e"
};

const content = {
  maxWidth:1100,
  margin:"0 auto",
  padding:"20px 25px 90px"
};

const loginCard = {
  maxWidth:650,
  margin:"0 auto",
  background:"#fffdfb",
  border:"1px solid #eadfd8",
  padding:"35px"
};

const card = {
  background:"#fffdfb",
  border:"1px solid #eadfd8",
  padding:"30px",
  marginBottom:22
};

const twoColumn = {
  display:"grid",
  gridTemplateColumns:"1fr 300px",
  gap:22
};

const sideCard = {
  background:"#fffdfb",
  border:"1px solid #eadfd8",
  padding:"30px",
  height:"fit-content"
};

const cardTop = {
  display:"flex",
  justifyContent:"space-between",
  alignItems:"flex-start",
  marginBottom:25
};

const cardTitle = {
  fontFamily:"Georgia,serif",
  fontWeight:400,
  fontSize:28,
  margin:"10px 0"
};

const muted = {
  color:"#765b5e",
  lineHeight:1.7
};

const formGrid = {
  display:"grid",
  gap:17,
  marginTop:20
};

const accountProfileGrid = {
  display:"grid",
  gridTemplateColumns:"repeat(3, minmax(0, 1fr))",
  gap:17
};

const label = {
  display:"grid",
  gap:7,
  fontSize:10,
  letterSpacing:1.5,
  fontWeight:700
};

const input = {
  height:48,
  border:"1px solid #d9cbc7",
  background:"#fff",
  padding:"0 14px",
  color:"#542f35",
  fontSize:14,
  outline:"none"
};

const textarea = {
  minHeight:100,
  border:"1px solid #d9cbc7",
  background:"#fff",
  padding:"14px",
  color:"#542f35",
  fontSize:14,
  resize:"vertical" as const,
  fontFamily:"Arial,sans-serif"
};

const primaryButton = {
  border:0,
  background:"#542f35",
  color:"#fff",
  minHeight:48,
  padding:"0 22px",
  cursor:"pointer",
  fontWeight:700,
  letterSpacing:1
};

const outlineButton = {
  border:"1px solid #542f35",
  background:"#fffdfb",
  color:"#542f35",
  minHeight:44,
  padding:"0 18px",
  cursor:"pointer",
  fontWeight:700,
  letterSpacing:1
};

const logoutButton = {
  marginTop:25,
  border:"0",
  background:"transparent",
  color:"#8b4f56",
  padding:0,
  cursor:"pointer",
  fontSize:11,
  letterSpacing:1.5,
  fontWeight:700
};

const details = {
  display:"grid",
  gap:18
};

const orderRow = {
  border:"1px solid #eadfd8",
  padding:"17px 18px",
  display:"flex",
  justifyContent:"space-between",
  gap:15
};

const smallText = {
  color:"#8a7072",
  fontSize:12,
  marginTop:5
};

const emptyOrder = {
  background:"#faf6f1",
  padding:"25px",
  textAlign:"center" as const,
  color:"#765b5e"
};

const primaryLink = {
  display:"inline-block",
  background:"#542f35",
  color:"#fff",
  textDecoration:"none",
  padding:"13px 20px",
  fontSize:12,
  fontWeight:700,
  letterSpacing:1
};

const sideLink = {
  display:"block",
  color:"#542f35",
  textDecoration:"none",
  padding:"17px 0",
  borderBottom:"1px solid #eadfd8",
  fontSize:13
};

const addressLabelGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 8
};

const addressLabelButton = {
  minHeight: 42,
  border: "1px solid #d9cbc7",
  background: "#fff",
  color: "#542f35",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 1
};

const addressLabelButtonActive = {
  background: "#542f35",
  color: "#fff",
  border: "1px solid #542f35"
};

const defaultCheck = {
  display: "flex",
  alignItems: "center",
  gap: 9,
  fontSize: 11,
  letterSpacing: 1,
  fontWeight: 700,
  color: "#542f35"
};

const emptyAddress = {
  background: "#faf6f1",
  padding: "24px",
  textAlign: "center" as const,
  color: "#765b5e"
};

const addressList = {
  display: "grid",
  gap: 14
};

const addressCard = {
  border: "1px solid #eadfd8",
  padding: "20px"
};

const addressCardTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 15,
  marginBottom: 14
};

const addressLabel = {
  display: "flex",
  alignItems: "center",
  gap: 9,
  marginBottom: 8,
  color: "#542f35",
  fontWeight: 700,
  letterSpacing: 1,
  fontSize: 12
};

const defaultBadge = {
  background: "#542f35",
  color: "#fff",
  padding: "4px 7px",
  fontSize: 8,
  letterSpacing: 1,
  fontWeight: 700
};

const addressText = {
  color: "#765b5e",
  lineHeight: 1.75,
  fontSize: 13
};

const smallOutlineButton = {
  border: "1px solid #542f35",
  background: "#fffdfb",
  color: "#542f35",
  padding: "8px 12px",
  cursor: "pointer",
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: 1
};

const smallDeleteButton = {
  border: "1px solid #c98e8e",
  background: "#fff8f7",
  color: "#8a3038",
  padding: "8px 12px",
  cursor: "pointer",
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: 1
};

const defaultButton = {
  marginTop: 15,
  border: 0,
  background: "transparent",
  color: "#8b4f56",
  padding: 0,
  cursor: "pointer",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 1
};

const toast = {
  position:"fixed" as const,
  top:85,
  right:25,
  zIndex:100,
  background:"#542f35",
  color:"#fff",
  padding:"14px 20px",
  boxShadow:"0 5px 20px rgba(0,0,0,.15)",
  fontSize:14
};

const cancelButton = {
  border: "1px solid #c98e8e",
  background: "#fff8f7",
  color: "#8a3038",
  padding: "9px 11px",
  cursor: "pointer",
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: 0.8,
  whiteSpace: "nowrap" as const
};

const footer = {
  background:"#542f35",
  color:"#fff",
  padding:"50px 25px",
  textAlign:"center" as const
};

const footerLogo = {
  fontFamily:"Georgia,serif",
  fontSize:28,
  letterSpacing:3
};
