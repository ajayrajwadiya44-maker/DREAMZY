import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, isValidAdminSession } from "../lib/admin-auth";
import AdminLogoutButton from "./AdminLogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!isValidAdminSession(token)) redirect("/admin-login");

  return (
    <>
      <nav className="dreamzy-admin-nav">
        <div className="dreamzy-admin-nav-inner">
          <a href="/admin" className="dreamzy-admin-brand">DREAMZY</a>
          <div className="dreamzy-admin-links">
            <a href="/admin">DASHBOARD</a>
            <a href="/admin/products">PRODUCTS</a>
            <a href="/admin/orders">ORDERS</a>
            <a href="/admin/sales">SALES</a>
            <a href="/admin/product-sales">PRODUCT SALES</a>
            <a href="/admin/inventory">INVENTORY</a>
            <a href="/admin/reports">REPORTS</a>
            <a href="/admin/reviews">REVIEWS</a>
            <a href="/admin/customers">CUSTOMERS</a>
            <a href="/">STORE</a>
          </div>
          <AdminLogoutButton />
        </div>
      </nav>
      {children}
      <style>{`
        .dreamzy-admin-nav{position:sticky;top:0;z-index:900;background:#fffdfb;border-bottom:1px solid #eadfd8;box-shadow:0 3px 14px rgba(84,47,53,.06)}
        .dreamzy-admin-nav-inner{max-width:1250px;margin:0 auto;min-height:58px;padding:0 28px;display:flex;align-items:center;justify-content:space-between;gap:12px}
        .dreamzy-admin-brand{color:#542f35;text-decoration:none;font-family:Georgia,serif;font-size:21px;letter-spacing:2.5px;white-space:nowrap}
        .dreamzy-admin-links{display:flex;align-items:center;gap:3px;flex-wrap:wrap}
        .dreamzy-admin-links a{color:#542f35;text-decoration:none;padding:9px 7px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:400;letter-spacing:.45px;white-space:nowrap}
        .dreamzy-admin-links a:hover{background:#f4ebe6}
        @media(max-width:1050px){
          .dreamzy-admin-nav-inner{padding:9px 12px;align-items:flex-start;flex-direction:column}
          .dreamzy-admin-links{width:100%;overflow-x:auto;flex-wrap:nowrap;padding-bottom:2px}
          .dreamzy-admin-links a{flex:0 0 auto;border:1px solid #eadfd8;background:#fffaf6}
        }
      `}</style>
    </>
  );
}
