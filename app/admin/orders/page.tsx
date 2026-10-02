"use client";

import { useEffect, useMemo, useState } from "react";
import { DREAMZY_INVOICE_CONFIG, GSTIN_PENDING } from "@/app/lib/invoice-config";

type Item = {
  id?: string;
  name?: string;
  price?: number;
  size?: string;
  quantity?: number;
  image?: string;
  hsnSac?: string;
  gstRate?: number;
};

type Order = {
  orderNumber: string;
  createdAt?: string;
  paymentMethod: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  pincode: string;
  deliveryAddressId?: string;
  deliveryAddressLabel?: string;
  items: Item[];
  subtotal: number;
  taxableSubtotal?: number;
  gstRate?: number;
  gstAmount?: number;
  gstInclusive?: boolean;
  shipping: number;
  total: number;
  status: string;
  invoiceNumber?: string;
  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
};

const statuses = [
  "NEW",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED"
];

function text(value: unknown) {
  return value === undefined || value === null ? "" : String(value).trim();
}

function number(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

const INVOICE_PREFIX = DREAMZY_INVOICE_CONFIG.invoicePrefix;
const INVOICE_STORAGE_KEY = "dreamzy-invoice-numbers";
const INVOICE_COUNTER_KEY = `dreamzy-invoice-counter-${DREAMZY_INVOICE_CONFIG.financialYear}`;

function getStoredInvoiceMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(INVOICE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

function getOrCreateInvoiceNumber(orderNumber: string): string {
  const map = getStoredInvoiceMap();

  if (map[orderNumber]) return String(map[orderNumber]);

  let counter = 0;

  try {
    counter = Number(localStorage.getItem(INVOICE_COUNTER_KEY) || "0");
  } catch {}

  if (!Number.isFinite(counter) || counter < 0) counter = 0;

  const next = Math.floor(counter) + 1;
  const invoiceNumber = `${INVOICE_PREFIX}${String(next).padStart(4, "0")}`;

  map[orderNumber] = invoiceNumber;

  try {
    localStorage.setItem(INVOICE_COUNTER_KEY, String(next));
    localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(map));
  } catch {}

  return invoiceNumber;
}

function normalize(raw: any): Order | null {
  if (!raw || typeof raw !== "object") return null;

  const customer = raw.customer || raw.customerDetails || {};
  const address = raw.deliveryAddress || raw.shippingAddress || {};

  const fullName = text(
    customer.fullName || customer.name || raw.fullName || raw.name
  );
  const parts = fullName.split(/\s+/).filter(Boolean);

  const firstName = text(
    raw.firstName || customer.firstName || parts[0]
  );
  const lastName = text(
    raw.lastName || customer.lastName || parts.slice(1).join(" ")
  );

  const itemsSource = Array.isArray(raw.items)
    ? raw.items
    : Array.isArray(raw.cart)
    ? raw.cart
    : [];

  const items = itemsSource.map((item: any) => ({
    id: text(item.id),
    name: text(item.name || item.productName) || "Product",
    price: number(item.price || item.amount),
    size: text(item.size || item.selectedSize),
    quantity: number(item.quantity || item.qty) || 1,
    image: text(item.image || item.imageUrl || item.productImage),
    hsnSac: text(item.hsnSac || item.hsn || item.sac),
    gstRate:
      item.gstRate !== undefined && item.gstRate !== null
        ? number(item.gstRate)
        : undefined
  }));

  const orderNumber = text(
    raw.orderNumber || raw.orderNo || raw.orderId || raw.id
  );

  if (!orderNumber) return null;

  return {
    orderNumber,
    createdAt: text(raw.createdAt),
    paymentMethod: text(raw.paymentMethod || raw.payment || "Cash on Delivery"),
    firstName,
    lastName,
    mobile: text(raw.mobile || raw.phone || customer.mobile || customer.phone),
    email: text(raw.email || customer.email),
    address: text(
      address.address ||
        address.addressLine1 ||
        raw.address ||
        raw.addressLine1 ||
        customer.address
    ),
    apartment: text(
      address.apartment ||
        address.addressLine2 ||
        raw.apartment ||
        customer.apartment ||
        raw.addressLine2
    ),
    city: text(address.city || raw.city || customer.city),
    state: text(address.state || raw.state || customer.state),
    pincode: text(
      address.pincode ||
        address.pinCode ||
        raw.pincode ||
        raw.pinCode ||
        raw.zip ||
        customer.pincode
    ),
    deliveryAddressId: text(address.addressId),
    deliveryAddressLabel: text(address.label),
    items,
    subtotal: number(raw.subtotal),
    taxableSubtotal:
      raw.taxableSubtotal !== undefined
        ? number(raw.taxableSubtotal)
        : undefined,
    gstRate:
      raw.gstRate !== undefined
        ? number(raw.gstRate)
        : undefined,
    gstAmount:
      raw.gstAmount !== undefined
        ? number(raw.gstAmount)
        : undefined,
    gstInclusive: raw.gstInclusive !== false,
    shipping: number(raw.shipping),
    total: number(raw.total || raw.grandTotal || raw.amount),
    status: text(raw.status) || "NEW",
    invoiceNumber: text(raw.invoiceNumber),
    courierName: text(raw.courierName),
    trackingNumber: text(raw.trackingNumber),
    trackingUrl: text(raw.trackingUrl)
  };
}

function readOrders(): Order[] {
  const result: Order[] = [];

  try {
    const stored = JSON.parse(
      localStorage.getItem("dreamzy-orders") || "[]"
    );

    if (Array.isArray(stored)) {
      stored.forEach((raw) => {
        const order = normalize(raw);
        if (order) result.push(order);
      });
    }
  } catch (error) {
    console.error("Could not read dreamzy-orders:", error);
  }

  try {
    const last = JSON.parse(
      localStorage.getItem("dreamzy-last-order") || "null"
    );

    const order = normalize(last);

    if (order) {
      const exists = result.some(
        (item) => item.orderNumber === order.orderNumber
      );

      if (!exists) {
        result.unshift(order);
      } else {
        const index = result.findIndex(
          (item) => item.orderNumber === order.orderNumber
        );
        result[index] = { ...result[index], ...order };
      }
    }
  } catch (error) {
    console.error("Could not read dreamzy-last-order:", error);
  }

  let changed = false;

  const finalOrders = result.map((order) => {
    const invoiceNumber =
      order.invoiceNumber || getOrCreateInvoiceNumber(order.orderNumber);

    if (order.invoiceNumber !== invoiceNumber) {
      changed = true;
      return { ...order, invoiceNumber };
    }

    return order;
  });

  if (changed) {
    try {
      const stored = JSON.parse(
        localStorage.getItem("dreamzy-orders") || "[]"
      );

      if (Array.isArray(stored)) {
        const updated = stored.map((raw: any) => {
          const number = text(
            raw?.orderNumber || raw?.orderNo || raw?.orderId || raw?.id
          );
          const match = finalOrders.find(
            (item) => item.orderNumber === number
          );

          return match
            ? { ...raw, invoiceNumber: match.invoiceNumber }
            : raw;
        });

        localStorage.setItem("dreamzy-orders", JSON.stringify(updated));

        const last = JSON.parse(
          localStorage.getItem("dreamzy-last-order") || "null"
        );

        if (last && typeof last === "object") {
          const number = text(
            last.orderNumber || last.orderNo || last.orderId || last.id
          );
          const match = finalOrders.find(
            (item) => item.orderNumber === number
          );

          if (match) {
            localStorage.setItem(
              "dreamzy-last-order",
              JSON.stringify({
                ...last,
                invoiceNumber: match.invoiceNumber
              })
            );
          }
        }
      }
    } catch (error) {
      console.error("Could not persist invoice numbers:", error);
    }
  }

  return finalOrders;
}

function money(value: number) {
  return `₹${number(value).toLocaleString("en-IN")}`;
}


function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getInvoiceNumber(orderNumber: string) {
  const financialYear = "2026-27";
  const prefix = "DRZ/2026-27/";
  const storageKey = "dreamzy-invoice-numbers";

  try {
    const raw = localStorage.getItem(storageKey);
    const saved = raw ? JSON.parse(raw) : {};

    if (saved && saved[orderNumber]) {
      return String(saved[orderNumber]);
    }

    const counterKey = `${storageKey}-counter-${financialYear}`;
    const currentCounter = Number(localStorage.getItem(counterKey) || "0");
    const nextCounter = Number.isFinite(currentCounter) ? currentCounter + 1 : 1;

    const invoiceNumber = `${prefix}${String(nextCounter).padStart(4, "0")}`;

    localStorage.setItem(counterKey, String(nextCounter));
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        ...(saved && typeof saved === "object" ? saved : {}),
        [orderNumber]: invoiceNumber
      })
    );

    return invoiceNumber;
  } catch {
    return `${prefix}${orderNumber}`;
  }
}

function printInvoice(order: Order) {
  const companyName = DREAMZY_INVOICE_CONFIG.legalName;
  const companyAddress = DREAMZY_INVOICE_CONFIG.registeredAddress;
  const gstin = DREAMZY_INVOICE_CONFIG.gstin;
  const invoiceNumber =
    order.invoiceNumber || getOrCreateInvoiceNumber(order.orderNumber);
  const documentTitle = GSTIN_PENDING ? "DREAMZY INVOICE" : "TAX INVOICE";

  const customerName =
    `${order.firstName} ${order.lastName}`.trim() || "Customer";

  const addressLines = [
    order.address,
    order.apartment,
    [order.city, order.state].filter(Boolean).join(", "),
    order.pincode ? `PIN - ${order.pincode}` : ""
  ].filter(Boolean);

  const taxableValue =
    order.taxableSubtotal ??
    (order.gstAmount !== undefined
      ? order.subtotal - order.gstAmount
      : order.subtotal / (1 + (order.gstRate ?? 5) / 100));

  const gstRate = order.gstRate ?? 5;
  const gstAmount =
    order.gstAmount ??
    (order.subtotal - taxableValue);

  const isGujarat =
    (order.state || "").trim().toLowerCase() === "gujarat" ||
    (order.state || "").trim().toLowerCase() === "gj";

  const cgstAmount = isGujarat ? gstAmount / 2 : 0;
  const sgstAmount = isGujarat ? gstAmount / 2 : 0;
  const igstAmount = isGujarat ? 0 : gstAmount;

  const itemRows = order.items.map((item) => `
    <tr>
      <td>
        <strong>${escapeHtml(item.name || "Product")}</strong>
        <div class="small">HSN/SAC: ${escapeHtml(item.hsnSac || "6108")}</div>
      </td>
      <td>${escapeHtml(item.size || "—")}</td>
      <td>${item.quantity || 1}</td>
      <td>${item.gstRate ?? gstRate}%</td>
      <td>${money((item.price || 0) * (item.quantity || 1))}</td>
    </tr>
  `).join("");

  const invoiceWindow = window.open("", "_blank", "width=980,height=900");

  if (!invoiceWindow) {
    window.alert("Please allow pop-ups in your browser to print the invoice.");
    return;
  }

  invoiceWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${documentTitle} - ${escapeHtml(invoiceNumber)}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 35px;
            color: #321d21;
            font-family: Arial, Helvetica, sans-serif;
            background: #fff;
          }
          .invoice {
            max-width: 900px;
            margin: 0 auto;
          }
          .top {
            display: flex;
            justify-content: space-between;
            gap: 30px;
            padding-bottom: 22px;
            border-bottom: 2px solid #542f35;
          }
          .brand {
            font-family: Georgia, serif;
            font-size: 32px;
            letter-spacing: 5px;
            color: #542f35;
          }
          .company {
            margin-top: 8px;
            font-weight: 700;
            font-size: 14px;
          }
          .muted {
            color: #765d60;
            font-size: 11px;
            line-height: 1.6;
            max-width: 430px;
          }
          h1 {
            margin: 0;
            font-size: 21px;
            letter-spacing: 1px;
            text-align: right;
          }
          .meta {
            margin-top: 8px;
            text-align: right;
            font-size: 12px;
            line-height: 1.7;
          }
          .pending {
            margin-top: 10px;
            padding: 8px 10px;
            border: 1px solid #d7b8b2;
            background: #fbefec;
            color: #7b343b;
            font-size: 10px;
            line-height: 1.45;
          }
          .columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 45px;
            margin: 28px 0;
          }
          .label {
            color: #8d6268;
            font-size: 10px;
            letter-spacing: 2px;
            margin-bottom: 8px;
          }
          .box {
            font-size: 13px;
            line-height: 1.7;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background: #542f35;
            color: white;
            text-align: left;
            padding: 10px;
            font-size: 10px;
            letter-spacing: 1px;
          }
          td {
            border-bottom: 1px solid #e5d8d2;
            padding: 11px 10px;
            font-size: 12px;
            vertical-align: top;
          }
          .small {
            margin-top: 4px;
            color: #8a7072;
            font-size: 9px;
          }
          .totals {
            margin-left: auto;
            width: 330px;
            margin-top: 22px;
          }
          .row {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            padding: 7px 0;
            font-size: 13px;
          }
          .grand {
            border-top: 2px solid #542f35;
            margin-top: 6px;
            padding-top: 12px;
            font-size: 18px;
            font-weight: 700;
          }
          .footer {
            margin-top: 45px;
            padding-top: 18px;
            border-top: 1px solid #e5d8d2;
            text-align: center;
            color: #765d60;
            font-size: 10px;
            line-height: 1.6;
          }
          @media print {
            body { padding: 0; }
            .invoice { max-width: none; }
          }
          @media (max-width: 700px) {
            body { padding: 18px; }
            .top, .columns { grid-template-columns: 1fr; display: grid; gap: 18px; }
            h1, .meta { text-align: left; }
            .totals { width: 100%; }
            table { font-size: 10px; }
            th, td { padding: 7px 5px; }
          }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="top">
            <div>
              <div class="brand">DREAMZY</div>
              <div class="company">${escapeHtml(companyName)}</div>
              <div class="muted">
                ${escapeHtml(companyAddress)}<br />
                GSTIN: ${escapeHtml(gstin)}
              </div>
            </div>

            <div>
              <h1>${documentTitle}</h1>
              <div class="meta">
                <strong>Invoice No.: ${escapeHtml(invoiceNumber)}</strong><br />
                Order No.: ${escapeHtml(order.orderNumber)}<br />
                Payment: ${escapeHtml(order.paymentMethod || "—")}<br />
                ${order.createdAt ? `Date: ${escapeHtml(new Date(order.createdAt).toLocaleDateString("en-IN"))}` : ""}
              </div>
              ${
                GSTIN_PENDING
                  ? `<div class="pending">
                      GST registration is pending. This document is for testing/internal use and should not be treated as a GST tax invoice until the GST registration details are available.
                    </div>`
                  : ""
              }
            </div>
          </div>

          <div class="columns">
            <div>
              <div class="label">BILL TO</div>
              <div class="box">
                <strong>${escapeHtml(customerName)}</strong><br />
                ${order.mobile ? `Mobile: ${escapeHtml(order.mobile)}<br />` : ""}
                ${order.email ? `Email: ${escapeHtml(order.email)}` : ""}
              </div>
            </div>

            <div>
              <div class="label">DELIVERY ADDRESS</div>
              <div class="box">
                ${addressLines.map((line) => escapeHtml(line)).join("<br />") || "—"}
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>PRODUCT / HSN</th>
                <th>SIZE</th>
                <th>QTY</th>
                <th>GST</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows || `<tr><td colspan="5">No items</td></tr>`}
            </tbody>
          </table>

          <div class="totals">
            <div class="row">
              <span>Taxable Value</span>
              <strong>${money(taxableValue)}</strong>
            </div>
            ${
              isGujarat
                ? `
                  <div class="row">
                    <span>CGST (${gstRate / 2}%)</span>
                    <strong>${money(cgstAmount)}</strong>
                  </div>
                  <div class="row">
                    <span>SGST (${gstRate / 2}%)</span>
                    <strong>${money(sgstAmount)}</strong>
                  </div>
                `
                : `
                  <div class="row">
                    <span>IGST (${gstRate}%)</span>
                    <strong>${money(igstAmount)}</strong>
                  </div>
                `
            }
            <div class="row">
              <span>Shipping</span>
              <strong>${money(order.shipping)}</strong>
            </div>
            <div class="row grand">
              <span>Total</span>
              <strong>${money(order.total)}</strong>
            </div>
          </div>

          <div class="footer">
            ${GSTIN_PENDING ? "GSTIN pending — update the invoice configuration after GST registration is approved." : "Thank you for shopping with DREAMZY."}<br />
            DREAMZY • Softer Nights. Brighter Tomorrows.
          </div>
        </div>

        <script>
          window.onload = function () {
            setTimeout(function () {
              window.print();
            }, 250);
          };
        </script>
      </body>
    </html>
  `);

  invoiceWindow.document.close();
}


export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [, setMessage] = useState("");

  function refreshOrders() {
    setOrders(readOrders());
    setLoaded(true);
  }

  useEffect(() => {
    refreshOrders();

    const onStorage = () => refreshOrders();
    const onOrdersUpdated = () => refreshOrders();

    window.addEventListener("storage", onStorage);
    window.addEventListener("dreamzy-orders-updated", onOrdersUpdated);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("dreamzy-orders-updated", onOrdersUpdated);
    };
  }, []);

  function updateStatus(orderNumber: string, status: string) {
    const currentOrder = orders.find(
      (order) => order.orderNumber === orderNumber
    );

    if (!currentOrder || currentOrder.status === status) {
      return;
    }

    // Confirm before cancellation because this action also restores stock.
    if (String(status || "").toUpperCase() === "CANCELLED") {
      const confirmed = window.confirm(
        `Cancel order ${orderNumber}? The ordered quantities will be returned to inventory.`
      );

      if (!confirmed) {
        return;
      }
    }

    const wasCancelled = String(currentOrder.status || "").toUpperCase() === "CANCELLED";
    const willBeCancelled = String(status || "").toUpperCase() === "CANCELLED";

    // Stock is deducted when the order is placed.
    // If Admin changes an order to CANCELLED, return the exact ordered
    // quantity to the exact ordered size. If a cancelled order is reopened,
    // deduct that quantity again.
    if (wasCancelled !== willBeCancelled) {
      try {
        const rawCatalog = localStorage.getItem("dreamzy-products");
        const catalog = rawCatalog ? JSON.parse(rawCatalog) : [];

        if (!Array.isArray(catalog)) {
          setMessage("Product inventory could not be updated.");
          return;
        }

        const nextCatalog = catalog.map((product: any) => ({
          ...product,
          sizeStock:
            product?.sizeStock && typeof product.sizeStock === "object"
              ? { ...product.sizeStock }
              : undefined
        }));

        const restore = willBeCancelled;

        for (const item of currentOrder.items || []) {
          const productId = String(
            (item as any).productId ||
              (item as any).id?.toString().split("-")[0] ||
              ""
          ).trim();

          let product = nextCatalog.find(
            (entry: any) => String(entry?.id) === productId
          );

          if (!product && item.name) {
            product = nextCatalog.find(
              (entry: any) =>
                String(entry?.name || "").trim().toLowerCase() ===
                String(item.name || "").trim().toLowerCase()
            );
          }

          if (!product) {
            setMessage(
              `${item.name || "Product"} could not be matched with inventory.`
            );
            return;
          }

          const quantity = Math.max(1, Number(item.quantity || 1));
          const requestedSize = String(
            item.size || product.sizes?.[0] || "M"
          ).trim();

          if (product.sizeStock && typeof product.sizeStock === "object") {
            const actualSize =
              Array.isArray(product.sizes)
                ? product.sizes.find(
                    (size: any) =>
                      String(size).trim().toLowerCase() ===
                      requestedSize.toLowerCase()
                  )
                : requestedSize;

            if (!actualSize) {
              setMessage(
                `${item.name || "Product"} size ${requestedSize} could not be matched with inventory.`
              );
              return;
            }

            const available = Number(product.sizeStock[actualSize] || 0);

            if (!restore && available < quantity) {
              setMessage(
                `${item.name || "Product"} (${actualSize}) has only ${available} left in stock. Cannot reopen this order.`
              );
              return;
            }

            product.sizeStock[actualSize] = restore
              ? available + quantity
              : available - quantity;

            product.stock = Object.values(
              product.sizeStock as Record<string, number>
            ).reduce(
              (sum: number, value: number) => sum + Number(value || 0),
              0
            );
          } else {
            const available = Number(product.stock || 0);

            if (!restore && available < quantity) {
              setMessage(
                `${item.name || "Product"} has only ${available} left in stock. Cannot reopen this order.`
              );
              return;
            }

            product.stock = restore
              ? available + quantity
              : available - quantity;
          }
        }

        localStorage.setItem(
          "dreamzy-products",
          JSON.stringify(nextCatalog)
        );
        window.dispatchEvent(new Event("dreamzy-products-updated"));
      } catch (error) {
        console.error("Could not update inventory:", error);
        setMessage("Unable to update product inventory.");
        return;
      }
    }

    const updated = orders.map((order) =>
      order.orderNumber === orderNumber
        ? {
            ...order,
            status,
            stockRestored: willBeCancelled
          }
        : order
    );

    setOrders(updated);
    localStorage.setItem("dreamzy-orders", JSON.stringify(updated));
    window.dispatchEvent(new Event("dreamzy-orders-updated"));

    try {
      const last = JSON.parse(
        localStorage.getItem("dreamzy-last-order") || "null"
      );

      if (
        last &&
        text(last.orderNumber || last.orderNo || last.orderId || last.id) ===
          orderNumber
      ) {
        localStorage.setItem(
          "dreamzy-last-order",
          JSON.stringify({
            ...last,
            status,
            stockRestored: willBeCancelled
          })
        );
      }
    } catch {}
  }

  function updateShipmentDetails(
    orderNumber: string,
    field: "courierName" | "trackingNumber" | "trackingUrl",
    value: string
  ) {
    const updated = orders.map((order) =>
      order.orderNumber === orderNumber
        ? { ...order, [field]: value }
        : order
    );

    setOrders(updated);
    localStorage.setItem("dreamzy-orders", JSON.stringify(updated));

    try {
      const last = JSON.parse(
        localStorage.getItem("dreamzy-last-order") || "null"
      );

      if (
        last &&
        text(last.orderNumber || last.orderNo || last.orderId || last.id) ===
          orderNumber
      ) {
        localStorage.setItem(
          "dreamzy-last-order",
          JSON.stringify({ ...last, [field]: value })
        );
      }
    } catch {}
  }

  function clearOrders() {
    if (!window.confirm("Delete all demo orders from this browser?")) {
      return;
    }

    localStorage.removeItem("dreamzy-orders");
    localStorage.removeItem("dreamzy-last-order");
    setOrders([]);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return orders
      .filter((order) => {
        const customer = `${order.firstName} ${order.lastName}`.toLowerCase();

        const matchesSearch =
          !q ||
          order.orderNumber.toLowerCase().includes(q) ||
          customer.includes(q) ||
          order.mobile.toLowerCase().includes(q) ||
          order.email.toLowerCase().includes(q) ||
          order.city.toLowerCase().includes(q);

        const matchesFilter =
          filter === "ALL" || String(order.status || "NEW").toUpperCase() === filter;

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
        const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
        const safeATime = Number.isFinite(aTime) ? aTime : 0;
        const safeBTime = Number.isFinite(bTime) ? bTime : 0;

        // Newest orders first; orders without a valid date remain at the bottom.
        return safeBTime - safeATime;
      });
  }, [orders, search, filter]);

  const orderValue = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const newOrders = orders.filter(
    (order) => String(order.status || "NEW").toUpperCase() === "NEW"
  ).length;

  const orderStatusSummary = [
    { label: "NEW", value: newOrders },
    { label: "CONFIRMED", value: orders.filter((order) => String(order.status || "NEW").toUpperCase() === "CONFIRMED").length },
    { label: "PACKED", value: orders.filter((order) => String(order.status || "NEW").toUpperCase() === "PACKED").length },
    { label: "SHIPPED", value: orders.filter((order) => String(order.status || "NEW").toUpperCase() === "SHIPPED").length },
    { label: "DELIVERED", value: orders.filter((order) => String(order.status || "NEW").toUpperCase() === "DELIVERED").length },
    { label: "CANCELLED", value: orders.filter((order) => String(order.status || "NEW").toUpperCase() === "CANCELLED").length }
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8f1eb",
        color: "#321d21",
        fontFamily: "Arial, Helvetica, sans-serif"
      }}
    >
      <section
        className="admin-orders-section"
        style={{
          maxWidth: 1250,
          margin: "0 auto",
          padding: "42px 5% 42px"
        }}
      >
        <div
          className="admin-orders-stats"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 28
          }}
        >
          {[
            ["TOTAL ORDERS", String(orders.length)],
            ["NEW ORDERS", String(newOrders)],
            ["ORDER VALUE", money(orderValue)]
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                background: "#fffaf6",
                border: "1px solid #e1d2cb",
                padding: 22
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 2,
                  color: "#8d6268"
                }}
              >
                {label}
              </div>

              <div
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: 28,
                  fontWeight: 400,
                  fontVariantNumeric: "tabular-nums",
                  marginTop: 10
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="admin-order-status-summary" aria-label="Filter orders by status">
          {orderStatusSummary.map(({ label, value }) => (
            <button
              type="button"
              className={`admin-order-status-card${filter === label ? " is-active" : ""}`}
              key={label}
              aria-pressed={filter === label}
              onClick={() => setFilter(filter === label ? "ALL" : label)}
              title={`Show ${label.toLowerCase()} orders`}
            >
              <span>{label}</span>
              <strong>{value}</strong>
            </button>
          ))}
        </div>

        <div
          className="admin-orders-controls"
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 22
          }}
        >
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order, customer, mobile..."
            style={{
              flex: "1 1 320px",
              padding: "13px 14px",
              border: "1px solid #d9c5bd",
              background: "#fffaf6",
              color: "#321d21"
            }}
          />

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            style={{
              padding: "13px 14px",
              border: "1px solid #d9c5bd",
              background: "#fffaf6",
              color: "#321d21"
            }}
          >
            <option value="ALL">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={refreshOrders}
            style={{
              padding: "13px 20px",
              border: 0,
              background: "#542f35",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            REFRESH
          </button>

          <button
            type="button"
            onClick={clearOrders}
            style={{
              padding: "13px 20px",
              border: "1px solid #bda5a0",
              background: "transparent",
              color: "#542f35",
              cursor: "pointer"
            }}
          >
            CLEAR DEMO ORDERS
          </button>
        </div>

        {!loaded ? (
          <div
            style={{
              background: "#fffaf6",
              border: "1px solid #e1d2cb",
              padding: 60,
              textAlign: "center"
            }}
          >
            Loading orders...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              background: "#fffaf6",
              border: "1px solid #e1d2cb",
              padding: "70px 20px",
              textAlign: "center"
            }}
          >
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 30
              }}
            >
              No orders found
            </div>

            <p style={{ color: "#765d60" }}>
              Place a COD order from the store and then click REFRESH.
            </p>
          </div>
        ) : (
          <div className="admin-orders-list" style={{ display: "grid", gap: 18 }}>
            {filtered.map((order) => (
              <article
                key={order.orderNumber}
                className="admin-order-card"
                style={{
                  background: "#fffaf6",
                  border: "1px solid #e1d2cb",
                  padding: 24
                }}
              >
                <div
                  className="admin-order-top"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1.2fr 1.2fr 1fr .8fr 1fr",
                    gap: 18,
                    paddingBottom: 20,
                    borderBottom: "1px solid #eadbd4"
                  }}
                >
                  <div>
                    <small>ORDER NUMBER</small>
                    <div
                      style={{
                        fontFamily: "Arial, Helvetica, sans-serif",
                        fontSize: 18,
                        fontWeight: 400,
                        fontVariantNumeric: "tabular-nums",
                        marginTop: 6
                      }}
                    >
                      {order.orderNumber}
                    </div>
                    {order.invoiceNumber && (
                      <div
                        style={{
                          marginTop: 6,
                          fontFamily: "Arial, Helvetica, sans-serif",
                          fontSize: 10,
                          color: "#8d6268",
                          letterSpacing: 0.7,
                          fontWeight: 400,
                          fontVariantNumeric: "tabular-nums"
                        }}
                      >
                        INVOICE: {order.invoiceNumber}
                      </div>
                    )}
                  </div>

                  <div>
                    <small>CUSTOMER</small>
                    <div style={{ marginTop: 6 }}>
                      {`${order.firstName} ${order.lastName}`.trim() || "—"}
                    </div>
                  </div>

                  <div>
                    <small>PAYMENT</small>
                    <div style={{ marginTop: 6 }}>
                      {order.paymentMethod}
                    </div>
                  </div>

                  <div>
                    <small>TOTAL</small>
                    <div
                      style={{
                        fontFamily: "Arial, Helvetica, sans-serif",
                        fontWeight: 400,
                        fontVariantNumeric: "tabular-nums",
                        marginTop: 6
                      }}
                    >
                      {money(order.total)}
                    </div>
                  </div>

                  <div>
                    <small>STATUS</small>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        flexWrap: "wrap"
                      }}
                    >
                      <select
                        value={order.status}
                        onChange={(event) =>
                          updateStatus(
                            order.orderNumber,
                            event.target.value
                          )
                        }
                        style={{
                          marginTop: 5,
                          padding: "8px 10px",
                          border: "1px solid #d9c5bd",
                          background: "#f8f1eb",
                          color: "#542f35",
                          fontWeight: 700
                        }}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => printInvoice(order)}
                        style={{
                          marginTop: 5,
                          padding: "8px 12px",
                          border: "1px solid #542f35",
                          background: "#542f35",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: 11,
                          letterSpacing: 1
                        }}
                      >
                        PRINT INVOICE
                      </button>
                    </div>
                  </div>
                </div>

                {(String(order.status || "").toUpperCase() === "SHIPPED" ||
                  Boolean(order.courierName || order.trackingNumber || order.trackingUrl)) && (
                  <section
                    aria-label={`Shipment tracking details for ${order.orderNumber}`}
                    style={{
                      marginTop: 18,
                      padding: 16,
                      background: "#fffaf6",
                      border: "1px solid #e1d2cb"
                    }}
                  >
                    <div
                      style={{
                        color: "#8d6268",
                        fontSize: 11,
                        letterSpacing: 1.4,
                        marginBottom: 12
                      }}
                    >
                      SHIPMENT TRACKING
                    </div>

                    <div
                      className="admin-shipment-fields"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                        gap: 12
                      }}
                    >
                      <label style={{ display: "block", fontSize: 12, color: "#542f35" }}>
                        Courier name
                        <input
                          type="text"
                          value={order.courierName || ""}
                          onChange={(event) =>
                            updateShipmentDetails(order.orderNumber, "courierName", event.target.value)
                          }
                          onBlur={() => window.dispatchEvent(new Event("dreamzy-orders-updated"))}
                          placeholder="e.g. Delhivery"
                          style={{
                            display: "block",
                            width: "100%",
                            boxSizing: "border-box",
                            marginTop: 6,
                            padding: "10px",
                            border: "1px solid #d9c5bd",
                            background: "#fffaf6",
                            color: "#542f35",
                            font: "400 14px Arial, Helvetica, sans-serif"
                          }}
                        />
                      </label>

                      <label style={{ display: "block", fontSize: 12, color: "#542f35" }}>
                        Tracking number
                        <input
                          type="text"
                          value={order.trackingNumber || ""}
                          onChange={(event) =>
                            updateShipmentDetails(order.orderNumber, "trackingNumber", event.target.value)
                          }
                          onBlur={() => window.dispatchEvent(new Event("dreamzy-orders-updated"))}
                          placeholder="Enter tracking number"
                          style={{
                            display: "block",
                            width: "100%",
                            boxSizing: "border-box",
                            marginTop: 6,
                            padding: "10px",
                            border: "1px solid #d9c5bd",
                            background: "#fffaf6",
                            color: "#542f35",
                            font: "400 14px Arial, Helvetica, sans-serif"
                          }}
                        />
                      </label>

                      <label style={{ display: "block", fontSize: 12, color: "#542f35" }}>
                        Tracking link
                        <input
                          type="url"
                          value={order.trackingUrl || ""}
                          onChange={(event) =>
                            updateShipmentDetails(order.orderNumber, "trackingUrl", event.target.value)
                          }
                          onBlur={() => window.dispatchEvent(new Event("dreamzy-orders-updated"))}
                          placeholder="https://..."
                          style={{
                            display: "block",
                            width: "100%",
                            boxSizing: "border-box",
                            marginTop: 6,
                            padding: "10px",
                            border: "1px solid #d9c5bd",
                            background: "#fffaf6",
                            color: "#542f35",
                            font: "400 14px Arial, Helvetica, sans-serif"
                          }}
                        />
                        {order.trackingUrl && /^https?:\/\//i.test(order.trackingUrl) && (
                          <a
                            href={order.trackingUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: "inline-block",
                              marginTop: 7,
                              color: "#542f35",
                              textDecoration: "underline"
                            }}
                          >
                            OPEN TRACKING LINK
                          </a>
                        )}
                      </label>
                    </div>
                    <div style={{ marginTop: 10, color: "#8d6268", fontSize: 11 }}>
                      Changes are saved automatically in this browser.
                    </div>
                  </section>
                )}

                <div
                  className="admin-order-details"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.3fr .9fr",
                    gap: 28,
                    paddingTop: 22
                  }}
                >
                  <div className="admin-order-items">
                    <div
                      style={{
                        fontSize: 11,
                        letterSpacing: 1.5,
                        color: "#8d6268"
                      }}
                    >
                      ITEMS
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gap: 14,
                        marginTop: 12
                      }}
                    >
                      {order.items.length === 0 ? (
                        <div>—</div>
                      ) : (
                        order.items.map((item, index) => (
                          <div
                            key={`${order.orderNumber}-${index}`}
                            style={{
                              display: "flex",
                              gap: 14,
                              alignItems: "center"
                            }}
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name || "Product"}
                                style={{
                                  width: 70,
                                  height: 80,
                                  objectFit: "cover"
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 70,
                                  height: 80,
                                  background: "#f1e3dd"
                                }}
                              />
                            )}

                            <div>
                              <div
                                style={{
                                  fontFamily: "Georgia, serif",
                                  fontSize: 18
                                }}
                              >
                                {item.name || "Product"}
                              </div>

                              <div
                                style={{
                                  color: "#765d60",
                                  fontSize: 13,
                                  marginTop: 5
                                }}
                              >
                                Size: {item.size || "—"} • Qty:{" "}
                                {item.quantity || 1}
                              </div>

                              <div style={{ marginTop: 5 }}>
                                {money(item.price || 0)}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div
                    className="admin-order-customer"
                    style={{
                      borderLeft: "1px solid #eadbd4",
                      paddingLeft: 24,
                      lineHeight: 1.8
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        letterSpacing: 1.5,
                        color: "#8d6268"
                      }}
                    >
                      CUSTOMER DETAILS
                    </div>

                    {order.deliveryAddressLabel && (
                      <div className="admin-delivery-label">
                        {order.deliveryAddressLabel}
                        <span>EXACT ORDER ADDRESS</span>
                      </div>
                    )}

                    <div className="admin-delivery-note">
                      Address used for this order
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <div>
                        <strong>Mobile:</strong>{" "}
                        {order.mobile || "—"}
                      </div>

                      <div>
                        <strong>Email:</strong>{" "}
                        {order.email || "—"}
                      </div>

                      <div style={{ marginTop: 10 }}>
                        <strong>Address:</strong>
                        <div style={{ marginTop: 4 }}>
                          {order.address && <div>{order.address}</div>}
                          {order.apartment && <div>{order.apartment}</div>}
                          {(order.city || order.state) && (
                            <div>
                              {[order.city, order.state]
                                .filter(Boolean)
                                .join(", ")}
                              {order.pincode
                                ? ` - ${order.pincode}`
                                : ""}
                            </div>
                          )}
                          {!order.address &&
                            !order.apartment &&
                            !order.city &&
                            !order.state &&
                            !order.pincode && <div>—</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer
        style={{
          textAlign: "center",
          padding: "30px 20px",
          color: "#8d6268",
          fontSize: 12,
          letterSpacing: 1
        }}
      >
        DREAMZY ADMIN • ORDER MANAGEMENT
      </footer>

      <style jsx global>{`
        .admin-orders-header {
          min-width: 0;
        }

        .admin-shipment-fields input:focus {
          outline: 2px solid #542f35;
          outline-offset: 1px;
        }

        .admin-order-status-summary {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 10px;
          margin: -8px 0 24px;
        }

        .admin-order-status-card {
          min-width: 0;
          width: 100%;
          box-sizing: border-box;
          background: #fffaf6;
          border: 1px solid #e1d2cb;
          padding: 13px 14px;
          text-align: left;
          font: inherit;
          cursor: pointer;
          transition: background 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
        }

        .admin-order-status-card:hover {
          border-color: #542f35;
          box-shadow: 0 2px 8px rgba(84, 47, 53, 0.08);
        }

        .admin-order-status-card:focus-visible {
          outline: 2px solid #542f35;
          outline-offset: 2px;
        }

        .admin-order-status-card.is-active {
          background: #f0e3de;
          border-color: #542f35;
          box-shadow: inset 0 0 0 1px #542f35;
        }

        .admin-order-status-card span {
          display: block;
          color: #8d6268;
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 1.1px;
          white-space: nowrap;
        }

        .admin-order-status-card strong {
          display: block;
          margin-top: 8px;
          color: #542f35;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 22px;
          font-weight: 400;
          font-variant-numeric: tabular-nums;
        }

        /* Keep the search and order actions aligned in a clean two-row toolbar. */
        .admin-orders-controls {
          display: grid !important;
          grid-template-columns: minmax(0, 1fr) auto auto !important;
          align-items: stretch;
          gap: 12px !important;
        }

        .admin-orders-controls input {
          grid-column: 1 / -1;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .admin-orders-controls select,
        .admin-orders-controls button {
          min-height: 44px;
          box-sizing: border-box;
          white-space: nowrap;
        }

        .admin-delivery-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 5px;
          color: #542f35;
          font-size: 16px;
          font-weight: 700;
        }

        .admin-delivery-label span {
          background: #542f35;
          color: #fff;
          padding: 4px 7px;
          font-size: 8px;
          letter-spacing: 1px;
          font-weight: 700;
        }

        .admin-delivery-note {
          color: #8a7072;
          font-size: 11px;
          margin-bottom: 14px;
        }

        @media (max-width: 900px) {
          .admin-orders-header {
            padding: 18px 16px !important;
          }

          .admin-orders-header > div {
            min-width: 0;
          }

          .admin-orders-header a {
            padding: 9px 12px !important;
            font-size: 10px !important;
          }

          .admin-orders-section {
            padding: 28px 12px 50px !important;
            width: 100%;
            box-sizing: border-box;
          }

          .admin-orders-stats {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
            margin-bottom: 18px !important;
          }

          .admin-orders-stats > div {
            padding: 16px !important;
          }

          .admin-order-status-summary {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
            margin: 0 0 20px;
          }

          .admin-shipment-fields {
            grid-template-columns: 1fr !important;
          }

          .admin-order-status-card {
            padding: 12px 10px;
          }

          .admin-orders-controls {
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) auto auto !important;
            gap: 10px !important;
          }

          .admin-orders-controls input {
            grid-column: 1 / -1;
            width: 100% !important;
            min-width: 0 !important;
            box-sizing: border-box;
          }

          .admin-orders-controls select,
          .admin-orders-controls button {
            width: 100%;
            box-sizing: border-box;
            min-width: 0;
          }

          .admin-order-card {
            padding: 16px !important;
            overflow: hidden;
          }

          .admin-order-top {
            grid-template-columns: 1fr 1fr !important;
            gap: 16px 12px !important;
            padding-bottom: 16px !important;
          }

          .admin-order-top > div {
            min-width: 0;
          }

          .admin-order-top > div:first-child {
            grid-column: 1 / -1;
          }

          .admin-order-top > div:first-child > div {
            font-size: 17px !important;
            overflow-wrap: anywhere;
          }

          .admin-order-top select,
          .admin-order-top button {
            width: 100%;
            box-sizing: border-box;
          }

          .admin-order-details {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            padding-top: 18px !important;
          }

          .admin-order-customer {
            border-left: 0 !important;
            border-top: 1px solid #eadbd4;
            padding-left: 0 !important;
            padding-top: 20px;
            overflow-wrap: anywhere;
          }

          .admin-order-items {
            min-width: 0;
          }

          .admin-order-items > div:last-child > div {
            align-items: flex-start !important;
          }

          .admin-order-items img,
          .admin-order-items > div:last-child > div > div:first-child {
            width: 80px !important;
            height: 95px !important;
            flex: 0 0 80px;
          }

          .admin-order-items > div:last-child > div > div:last-child {
            min-width: 0;
          }

          .admin-order-items > div:last-child > div > div:last-child > div:first-child {
            font-size: 18px !important;
            line-height: 1.15 !important;
            overflow-wrap: anywhere;
          }
        }

        @media (max-width: 560px) {
          .admin-orders-header {
            padding: 16px 14px !important;
          }

          .admin-orders-header > div {
            flex-wrap: wrap;
            gap: 12px;
          }

          .admin-orders-header a {
            margin-left: auto;
          }

          .admin-orders-section {
            padding: 22px 10px 45px !important;
          }

          .admin-order-status-summary {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }

          .admin-shipment-fields {
            grid-template-columns: 1fr !important;
          }

          .admin-order-status-card {
            padding: 12px;
          }

          .admin-orders-controls {
            grid-template-columns: 1fr !important;
          }

          .admin-orders-controls input,
          .admin-orders-controls select,
          .admin-orders-controls button {
            grid-column: auto !important;
          }

          .admin-order-card {
            padding: 14px !important;
          }

          .admin-order-top {
            grid-template-columns: 1fr !important;
            gap: 13px !important;
          }

          .admin-order-top > div:first-child {
            grid-column: auto;
          }

          .admin-order-details {
            gap: 20px !important;
          }

          .admin-order-items img,
          .admin-order-items > div:last-child > div > div:first-child {
            width: 72px !important;
            height: 86px !important;
            flex-basis: 72px !important;
          }
        }
      `}</style>
    </main>
  );
}
