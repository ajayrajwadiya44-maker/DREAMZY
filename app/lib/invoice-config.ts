export const DREAMZY_INVOICE_CONFIG = {
  legalName: "Dharvi Lifestyle Private Limited",
  brandName: "DREAMZY",
  gstin: "PENDING",
  registeredAddress:
    "315, Nakshtra-9, Opp. Girnar Cinema, Phulchhab Chowk, Rajkot - 360006, Gujarat",
  invoicePrefix: "DRZ/2026-27/",
  financialYear: "2026-27"
} as const;

export const GSTIN_PENDING = DREAMZY_INVOICE_CONFIG.gstin === "PENDING";
