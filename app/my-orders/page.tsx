"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OrderItem = {
  productId?: string;
  id?: string;
  name?: string;
  price?: number;
  quantity?: number;
  size?: string;
  image?: string;
};

type Order = {
  id?: string;
  orderNumber?: string;
  orderNo?: string;
  orderId?: string;
  total?: number;
  status?: string;
  createdAt?: string;
  invoiceNumber?: string;
  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  items?: OrderItem[];
};

const INVOICE_PREFIX = "DRZ/2026-27/";
const INVOICE_STORAGE_KEY = "dreamzy-invoice-numbers";
const INVOICE_COUNTER_KEY = "dreamzy-invoice-counter-2026-27";

function getOrCreateInvoiceNumber(orderNumber: string) {
  try {
    const raw = localStorage.getItem(INVOICE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const map = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    if (map[orderNumber]) return String(map[orderNumber]);
    let counter = Number(localStorage.getItem(INVOICE_COUNTER_KEY) || "0");
    if (!Number.isFinite(counter) || counter < 0) counter = 0;
    const next = Math.floor(counter) + 1;
    const invoiceNumber = `${INVOICE_PREFIX}${String(next).padStart(4, "0")}`;
    map[orderNumber] = invoiceNumber;
    localStorage.setItem(INVOICE_COUNTER_KEY, String(next));
    localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(map));
    return invoiceNumber;
  } catch {
    return `${INVOICE_PREFIX}${orderNumber}`;
  }
}

const money = (value: number) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  function logout() {
    localStorage.removeItem("dreamzy-account");
    window.dispatchEvent(new Event("dreamzy-account-updated"));
    setMenuOpen(false);
    setAccountOpen(false);
    window.location.href = "/";
  }

  function loadOrders() {
    try {
      const raw = localStorage.getItem("dreamzy-orders");
      const saved = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(saved)) {
        setOrders([]);
        return;
      }
      const normalized = saved.map((order: Order) => {
        const orderNumber = String(order.orderNumber || order.orderNo || order.orderId || order.id || "").trim();
        return orderNumber
          ? { ...order, orderNumber, invoiceNumber: order.invoiceNumber || getOrCreateInvoiceNumber(orderNumber) }
          : order;
      });
      localStorage.setItem("dreamzy-orders", JSON.stringify(normalized));
      setOrders(normalized);
    } catch {
      setOrders([]);
    }
  }

  useEffect(() => {
    loadOrders();
    const refresh = () => loadOrders();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("dreamzy-orders-updated", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("dreamzy-orders-updated", refresh);
    };
  }, []);

  function cancelOrder(orderNumber: string) {
    const latestRaw = localStorage.getItem("dreamzy-orders");
    const latestOrders: Order[] = latestRaw ? JSON.parse(latestRaw) : [];
    const target = latestOrders.find((order) => String(order.orderNumber || order.id) === orderNumber);
    if (!target) {
      setMessage("Order could not be found. Please refresh and try again.");
      return;
    }
    const status = String(target.status || "NEW").toUpperCase();
    if (!["NEW", "CONFIRMED"].includes(status)) {
      setMessage(status === "CANCELLED" ? "This order is already cancelled." : "This order can no longer be cancelled.");
      return;
    }
    if (!window.confirm(`Cancel order ${orderNumber}? Your reserved stock will be returned to inventory.`)) return;

    try {
      const catalogRaw = localStorage.getItem("dreamzy-products");
      const catalog = catalogRaw ? JSON.parse(catalogRaw) : [];
      if (!Array.isArray(catalog)) {
        setMessage("Inventory could not be updated. Please try again.");
        return;
      }
      const nextCatalog = catalog.map((product: any) => ({
        ...product,
        sizes: Array.isArray(product?.sizes) ? [...product.sizes] : [],
        sizeStock: product?.sizeStock && typeof product.sizeStock === "object" ? { ...product.sizeStock } : undefined,
      }));
      for (const item of target.items || []) {
        const productId = String(item.productId || String(item.id || "").split("-")[0] || "");
        const itemName = String(item.name || "").trim().toLowerCase();
        const product = nextCatalog.find((entry: any) =>
          (productId && String(entry?.id) === productId) ||
          (itemName && String(entry?.name || "").trim().toLowerCase() === itemName)
        );
        if (!product) continue;
        const quantity = Math.max(1, Number(item.quantity || 1));
        const requestedSize = String(item.size || product.sizes?.[0] || "M").trim();
        if (product.sizeStock && typeof product.sizeStock === "object") {
          const matchingSize = Object.keys(product.sizeStock).find((key) => key.trim().toLowerCase() === requestedSize.toLowerCase()) || requestedSize;
          product.sizeStock[matchingSize] = Number(product.sizeStock[matchingSize] || 0) + quantity;
          product.stock = Object.values(product.sizeStock as Record<string, number>).reduce((sum: number, value: number) => sum + Number(value || 0), 0);
        } else {
          product.stock = Number(product.stock || 0) + quantity;
        }
      }
      const updatedOrders = latestOrders.map((order) =>
        String(order.orderNumber || order.id) === orderNumber ? { ...order, status: "CANCELLED" } : order
      );
      localStorage.setItem("dreamzy-products", JSON.stringify(nextCatalog));
      localStorage.setItem("dreamzy-orders", JSON.stringify(updatedOrders));
      try {
        const last = JSON.parse(localStorage.getItem("dreamzy-last-order") || "null");
        if (last && String(last.orderNumber || last.id) === orderNumber) {
          localStorage.setItem("dreamzy-last-order", JSON.stringify({ ...last, status: "CANCELLED" }));
        }
      } catch {}
      setOrders(updatedOrders);
      window.dispatchEvent(new Event("dreamzy-products-updated"));
      window.dispatchEvent(new Event("dreamzy-orders-updated"));
      setMessage("Order cancelled and stock has been returned to inventory.");
    } catch {
      setMessage("Unable to cancel the order. Please try again.");
    }
  }

  return (
    <main className="my-orders-page">
      <style>{`
        .my-orders-page { min-height: 100vh; background: #faf6f1; color: #542f35; font-family: Arial, sans-serif; }
        .mo-header { background: #fffdfb; border-bottom: 1px solid #eadfd8; }
        .mo-header-inner { position: relative; max-width: 1320px; margin: 0 auto; min-height: 64px; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; gap: 22px; }
        .mo-logo { color: #542f35; text-decoration: none; font-family: Georgia, serif; font-size: 27px; letter-spacing: 3px; white-space: nowrap; }
        .mo-nav { display: flex; align-items: center; justify-content: center; gap: 20px; flex: 1; flex-wrap: wrap; }
        .mo-nav a { color: #542f35; text-decoration: none; font-size: 11px; letter-spacing: 1px; white-space: nowrap; }
        .mo-menu-button { display: none; border: 0; background: transparent; color: #542f35; font-size: 25px; cursor: pointer; padding: 4px 8px; }
        .mo-account-wrap { position: relative; flex-shrink: 0; }
        .mo-account-button { border: 0; background: transparent; color: #542f35; font-size: 11px; letter-spacing: 1px; cursor: pointer; white-space: nowrap; }
        .mo-dropdown { position: absolute; z-index: 30; right: 0; top: calc(100% + 14px); width: 190px; padding: 7px; background: #fffdfb; border: 1px solid #eadfd8; box-shadow: 0 12px 28px rgba(84,47,53,.12); }
        .mo-dropdown a { display: block; padding: 12px 10px; color: #542f35; text-decoration: none; font-size: 11px; letter-spacing: .5px; }
        .mo-dropdown a + a { border-top: 1px solid #f0e7e1; }
        .mo-dropdown a:hover { background: #faf3ee; }
        .mo-hero { text-align: center; padding: 54px 20px 34px; }
        .mo-eyebrow { font-size: 10px; letter-spacing: 3px; color: #987276; font-weight: 700; }
        .mo-hero h1 { margin: 10px 0; font: 44px Georgia, serif; font-weight: 400; }
        .mo-hero p { margin: 0; color: #77666a; font-size: 14px; }
        .mo-content { width: min(900px, calc(100% - 32px)); margin: 0 auto; padding-bottom: 70px; }
        .mo-card { background: #fffdfb; border: 1px solid #e9ded7; padding: 24px; }
        .mo-card h2 { margin: 8px 0 18px; font: 26px Georgia, serif; font-weight: 400; }
        .mo-order { border: 1px solid #eadfd8; padding: 14px; display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 14px; align-items: start; margin-top: 12px; background: #fffdfb; }
        .mo-tracking { grid-column: 1 / -1; padding: 14px; border: 1px solid #eadfd8; background: #fffaf6; }
        .mo-tracking-title { margin-bottom: 10px; color: #987276; font-size: 10px; font-weight: 700; letter-spacing: 2px; }
        .mo-tracking-details { display: flex; flex-wrap: wrap; gap: 10px 24px; color: #542f35; font-size: 13px; }
        .mo-tracking-details strong { font-weight: 700; }
        .mo-tracking-link { color: #542f35; text-decoration: underline; overflow-wrap: anywhere; }
        .mo-tracking-note { color: #77666a; font-size: 12px; }
        .mo-order-number { color: #542f35; text-decoration: none; font-weight: 700; font-size: 14px; }
        .mo-small { margin-top: 5px; color: #8b777a; font-size: 11px; }
        .mo-invoice { margin-top: 7px; color: #987276; font-size: 10px; letter-spacing: .5px; }
        .mo-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 7px; }
        .mo-total { width: 100%; text-align: right; font-weight: 700; font-size: 14px; }
        .mo-status { width: 100%; text-align: right; color: #8b777a; font-size: 11px; text-transform: uppercase; }
        .mo-button { min-height: 34px; display: inline-flex; align-items: center; justify-content: center; padding: 0 11px; border: 1px solid #542f35; background: #fffdfb; color: #542f35; text-decoration: none; font-size: 10px; font-weight: 700; letter-spacing: .6px; cursor: pointer; }
        .mo-cancel { border-color: #c98c8c; color: #9a4f4f; }
        .mo-empty { padding: 28px 10px; text-align: center; color: #77666a; }
        .mo-primary { display: inline-flex; margin-top: 12px; padding: 12px 20px; background: #542f35; color: #fff; text-decoration: none; font-size: 11px; letter-spacing: 1px; }
        .mo-message { margin-bottom: 14px; padding: 12px 14px; border: 1px solid #d8c4bd; background: #fffdfb; font-size: 13px; }
        .mo-footer { background: #542f35; color: #fff; padding: 28px 20px; text-align: center; }
        .mo-footer strong { font: 26px Georgia, serif; letter-spacing: 3px; }
        .mo-footer p { color: #eadbd7; font-size: 13px; }
        @media (max-width: 760px) { .mo-header-inner { min-height: 60px; padding: 10px 16px; flex-wrap: wrap; gap: 10px; } .mo-menu-button { display: block; order: 0; } .mo-logo { order: 1; margin-right: auto; } .mo-account-wrap { order: 2; } .mo-nav { display: none; order: 3; flex-basis: 100%; width: 100%; align-items: stretch; flex-direction: column; gap: 0; padding: 8px 0 4px; } .mo-nav.open { display: flex; } .mo-nav a { padding: 12px 4px; border-top: 1px solid #f0e7e1; } .mo-dropdown { right: 0; } .mo-hero { padding: 38px 16px 25px; } .mo-hero h1 { font-size: 36px; } .mo-content { width: calc(100% - 24px); } .mo-card { padding: 15px; } .mo-order { grid-template-columns: 1fr; } .mo-actions { justify-content: flex-start; } .mo-total, .mo-status { text-align: left; } }

        /* Header copied from the approved DREAMZY Home page */
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
            padding: 9px 4px !important;
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
        }

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
            padding: 5px 18px 8px;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            box-shadow: 0 8px 20px rgba(84, 47, 53, 0.08);
            z-index: 100;
          }
          .nav.open { display: flex !important; }
          .nav a, .nav button {
            width: 100%;
            padding: 9px 4px !important;
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


        .dreamzy-footer { display: none; }
        /* Desktop footer: match the supplied reference image only. Mobile styles remain unchanged. */
        @media (min-width: 901px) {
          .dreamzy-footer {
            display: block !important;
            width: 100%;
            box-sizing: border-box;
            margin: 0;
            padding: 22px 6.4% 18px;
            background: #542f35;
            color: #fff8f4;
            border-top: 0;
            text-align: left;
          }

          .dreamzy-footer-inner {
            width: 100%;
            max-width: none;
            margin: 0 auto;
          }

          .dreamzy-footer-top {
            display: grid;
            grid-template-columns: 1.05fr 1.15fr 0.85fr 0.55fr;
            gap: 42px;
            align-items: stretch;
            padding-bottom: 46px;
          }

          .dreamzy-footer-logo-wrap {
            width: 100%;
            max-width: 365px;
            padding: 14px;
            box-sizing: border-box;
            background: #fffaf6;
            align-self: start;
          }

          .dreamzy-footer-logo-image {
            display: block;
            width: 100%;
            height: auto;
            max-height: 275px;
            object-fit: contain;
          }

          .dreamzy-footer-brand {
            min-width: 0;
            align-self: center;
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

          .dreamzy-footer-follow {
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
        }

        .mobile-bottom-nav { display: none; }
        @media (max-width: 900px) {
          .dreamzy-footer { display: none !important; }
          .mo-footer { display: block !important; }
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
            padding: 44px 10px;
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
            margin-bottom: 22px;
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


        /* Desktop footer matches the approved reference image. */
        .dreamzy-footer {
          padding: 58px 42px 24px;
        }

        .dreamzy-footer-top {
          display: grid;
          grid-template-columns: 1.05fr 1.15fr 0.85fr 0.55fr;
          grid-template-areas: "logo brand links follow";
          gap: 44px;
          align-items: center;
          padding-bottom: 46px;
        }

        .dreamzy-footer-logo-wrap {
          grid-area: logo;
          width: 100%;
          max-width: 400px;
          padding: 14px;
          box-sizing: border-box;
          background: #fffaf6;
          justify-self: start;
        }

        .dreamzy-footer-brand {
          grid-area: brand;
          min-width: 0;
        }

        .dreamzy-footer-links {
          grid-area: links;
          align-self: stretch;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-left: 1px solid rgba(255, 220, 215, 0.34);
          border-top: 0;
          padding: 0 0 0 30px;
          min-width: 0;
        }

        .dreamzy-footer-links .dreamzy-footer-heading {
          flex: none;
          width: auto;
          margin-bottom: 16px;
        }

        .dreamzy-footer-links a {
          display: flex;
          width: 100%;
          flex: none;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 8px 0;
          white-space: nowrap;
        }

        .dreamzy-footer-links b {
          display: block;
        }

        .dreamzy-footer-follow {
          grid-area: follow;
          align-self: stretch;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-left: 1px solid rgba(255, 220, 215, 0.34);
          border-top: 0;
          padding: 0 0 0 30px;
          min-width: 0;
        }

        .dreamzy-footer-social {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .dreamzy-footer-social a {
          flex: 0 0 44px;
        }

        .dreamzy-footer-bottom {
          padding-top: 22px;
          border-top: 1px solid rgba(255, 220, 215, 0.34);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-direction: row;
          text-align: left;
          gap: 20px;
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
            gap: 2px;
            border-radius: 30px;
            color: #292629;
            text-decoration: none;
            font-size: 10px;
            line-height: 1.1;
            padding: 3px 1px;
          }

          .mobile-bottom-nav-item svg {
            width: 23px;
            height: 23px;
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
        }

        
        .dreamzy-footer { display: none; }
        @media (max-width: 900px) {
          .dreamzy-footer { display: none !important; }
          .mo-footer { display: block !important; }
        }


        /* DESKTOP FOOTER ONLY — matched to the supplied reference image. */
        @media (min-width: 901px) {
          .dreamzy-footer {
            display: block !important;
            width: 100%;
            box-sizing: border-box;
            margin: 0;
            padding: 22px 6.3% 18px;
            background: #542f35;
            color: #fff8f4;
          }

          .dreamzy-footer-inner {
            width: 100%;
            max-width: none;
            margin: 0 auto;
          }

          .dreamzy-footer-top {
            display: grid;
            grid-template-columns: 365px minmax(320px, 1fr) 300px 210px;
            grid-template-areas: "logo brand links follow";
            gap: 32px;
            align-items: center;
            padding-bottom: 46px;
          }

          .dreamzy-footer-logo-wrap {
            grid-area: logo;
            width: 100%;
            max-width: 365px;
            padding: 14px;
            box-sizing: border-box;
            background: #fffaf6;
            justify-self: start;
          }

          .dreamzy-footer-logo-image {
            display: block;
            width: 100%;
            height: auto;
            max-height: 275px;
            object-fit: contain;
          }

          .dreamzy-footer-brand {
            grid-area: brand;
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

          .dreamzy-footer-links {
            grid-area: links;
            align-self: stretch;
            display: flex;
            flex-direction: column;
            justify-content: center;
            border-left: 1px solid rgba(255, 220, 215, 0.34);
            border-top: 0;
            padding: 0 0 0 30px;
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
            grid-area: follow;
            align-self: stretch;
            display: flex;
            flex-direction: column;
            justify-content: center;
            border-left: 1px solid rgba(255, 220, 215, 0.34);
            border-top: 0;
            padding: 0 0 0 24px;
          }

          .dreamzy-footer-social {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            max-width: 154px;
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

          .mo-footer {
            display: none !important;
          }
        }

        /* Mobile footer line fixes only — desktop remains unchanged. */
        @media (max-width: 600px) {
          .dreamzy-footer {
            display: block !important;
            padding-bottom: 92px !important;
          }

          .mo-footer {
            display: none !important;
          }

          .dreamzy-footer-links {
            border-left: 0 !important;
            border-top: 1px solid rgba(255, 220, 215, 0.34) !important;
          }

          .dreamzy-footer-follow {
            border-left: 0 !important;
            border-top: 0 !important;
          }
        }

      `}</style>

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
                <Link href="/account" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  <span>My Account</span>
                </Link>
                <Link href="/account#orders" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  <span>My Orders</span>
                </Link>
                <Link href="/account#addresses" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  <span>My Addresses</span>
                </Link>
                <Link href="/wishlist" onClick={() => { setAccountOpen(false); setMenuOpen(false); }}>
                  <span>Wishlist</span>
                </Link>
                <button
                  type="button"
                  className="mobile-account-logout"
                  onClick={logout}
                >
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

      <section className="mo-hero">
        <div className="mo-eyebrow">DREAMZY CUSTOMER</div>
        <h1>My Orders</h1>
        <p>View your DREAMZY orders, invoices and order status.</p>
      </section>

      <section className="mo-content">
        {message && <div className="mo-message" role="status">{message}</div>}
        <div className="mo-card">
          <div className="mo-eyebrow">ORDER HISTORY</div>
          <h2>Your Orders</h2>
          {orders.length === 0 ? (
            <div className="mo-empty">
              <p>You haven't placed any orders yet.</p>
              <Link href="/women" className="mo-primary">START SHOPPING</Link>
            </div>
          ) : (
            [...orders].reverse().map((order, index) => {
              const orderNumber = String(order.orderNumber || order.orderNo || order.orderId || order.id || `ORDER ${index + 1}`);
              const status = String(order.status || "NEW").toUpperCase();
              return (
                <article className="mo-order" key={orderNumber}>
                  <div>
                    <Link className="mo-order-number" href={`/account/orders/${encodeURIComponent(orderNumber)}`}>{orderNumber}</Link>
                    <div className="mo-small">{order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "Recent order"}</div>
                    <div className="mo-invoice">INVOICE {order.invoiceNumber || "Not assigned"}</div>
                    <div className="mo-small">{(order.items || []).map((item) => `${item.name || "Product"} · Size ${item.size || "—"} · Qty ${item.quantity || 1}`).join(" | ")}</div>
                  </div>
                  <div className="mo-actions">
                    <div className="mo-total">{money(Number(order.total || 0))}</div>
                    <div className="mo-status">{status}</div>
                    <Link
                      className="mo-button"
                      href={`/account/orders/${encodeURIComponent(orderNumber)}`}
                    >
                      TRACK ORDER
                    </Link>
                    <Link
                      className="mo-button"
                      href={`/account/orders/${encodeURIComponent(orderNumber)}`}
                    >
                      VIEW / PRINT INVOICE
                    </Link>
                    {["NEW", "CONFIRMED"].includes(status) && (
                      <button className="mo-button mo-cancel" type="button" onClick={() => cancelOrder(orderNumber)}>CANCEL ORDER</button>
                    )}
                  </div>
                  {(status === "SHIPPED" || Boolean(order.courierName || order.trackingNumber || order.trackingUrl)) && (
                    <section className="mo-tracking" aria-label={`Shipment tracking for ${orderNumber}`}>
                      <div className="mo-tracking-title">SHIPMENT TRACKING</div>
                      {(order.courierName || order.trackingNumber || order.trackingUrl) ? (
                        <div className="mo-tracking-details">
                          {order.courierName && <span><strong>Courier:</strong> {order.courierName}</span>}
                          {order.trackingNumber && <span><strong>Tracking number:</strong> {order.trackingNumber}</span>}
                          {order.trackingUrl && (
                            <span>
                              <strong>Tracking link:</strong>{" "}
                              <a className="mo-tracking-link" href={order.trackingUrl} target="_blank" rel="noopener noreferrer">Track shipment</a>
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="mo-tracking-note">Your order has been shipped. Tracking details will appear here once provided.</div>
                      )}
                    </section>
                  )}
                </article>
              );
            })
          )}
        </div>
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
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 10.8 12 3l9 7.8v9a1.2 1.2 0 0 1-1.2 1.2h-5.1v-6.4H9.3V21H4.2A1.2 1.2 0 0 1 3 19.8v-9Z" />
          </svg><span>Home</span>
        </Link>
        <Link href="#orders" className="mobile-bottom-nav-item" aria-label="Offers">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5" y="2.5" width="14" height="19" rx="3" /><path d="m10 8 5 4-5 4V8Z" />
          </svg><span>Offers</span>
        </Link>
        <Link href="/women" className="mobile-bottom-nav-item" aria-label="Categories">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1.2" /><rect x="14" y="3" width="7" height="7" rx="1.2" /><rect x="3" y="14" width="7" height="7" rx="1.2" /><rect x="14" y="14" width="7" height="7" rx="1.2" />
          </svg><span>Categories</span>
        </Link>
        <Link href="/account" className="mobile-bottom-nav-item active" aria-label="Account">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="7" r="3.5" /><path d="M4 21v-2.2a5.3 5.3 0 0 1 5.3-5.3h5.4a5.3 5.3 0 0 1 5.3 5.3V21H4Z" />
          </svg><span>Account</span>
        </Link>
        <Link href="/cart" className="mobile-bottom-nav-item" aria-label="Cart">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2.5 3h2.8l2.2 12.1a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.5L22 8H6" /><circle cx="10" cy="20" r="1.2" /><circle cx="18" cy="20" r="1.2" />
          </svg><span>Cart</span>
        </Link>
      </nav>


      <footer className="mo-footer">
        <strong>DREAMZY</strong>
        <p>Premium nightwear for beautiful nights.</p>
      </footer>
    </main>
  );
}
