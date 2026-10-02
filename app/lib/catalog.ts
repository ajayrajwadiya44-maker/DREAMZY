export type CatalogProduct = {
  id: string;
  name: string;
  price: number;
  category: "Women" | "Kids";
  image: string;
  gallery?: string[];
  sizes: string[];
  tag: string;
  stock: number;
  sizeStock?: Record<string, number>;
  active: boolean;
};

export type StoredWishlistItem = CatalogProduct;
export type StoredCartItem = { id: string; productId?: string; name: string; price: number; image?: string; size?: string; quantity: number; };

export const DEFAULT_CATALOG: CatalogProduct[] = [
  {"id":"101","name":"Rose Petal Lounge Set","price":1399,"category":"Women","image":"/products/101-front.jpg","gallery":["/products/101-front.jpg","/products/101-view2.jpg","/products/101-view3.jpg","/products/101-view4.jpg"],"sizes":["S","M","L","XL"],"tag":"NEW","stock":20,"active":true},
  {"id":"102","name":"Midnight Satin Sleep Set","price":1799,"category":"Women","image":"/products/102-front.jpg","gallery":["/products/102-front.jpg","/products/102-view2.jpg","/products/102-view3.jpg","/products/102-view4.jpg"],"sizes":["S","M","L","XL"],"tag":"BESTSELLER","stock":20,"active":true},
  {"id":"103","name":"Peach Blossom Nightdress","price":1299,"category":"Women","image":"/products/103-front.jpg","gallery":["/products/103-front.jpg","/products/103-view2.jpg","/products/103-view3.jpg","/products/103-view4.jpg"],"sizes":["S","M","L","XL"],"tag":"NEW","stock":20,"active":true},
  {"id":"104","name":"Ivory Bliss Pajama Set","price":1599,"category":"Women","image":"/products/104-front.jpg","gallery":["/products/104-front.jpg","/products/104-view2.jpg","/products/104-view3.jpg","/products/104-view4.jpg"],"sizes":["S","M","L","XL"],"tag":"NEW","stock":20,"active":true},
  {"id":"105","name":"Lavender Dream Nightdress","price":1499,"category":"Women","image":"/products/105-front.jpg","gallery":["/products/105-front.jpg","/products/105-view2.jpg","/products/105-view3.jpg","/products/105-view4.jpg"],"sizes":["S","M","L","XL"],"tag":"NEW","stock":20,"active":true},
  {"id":"106","name":"Blush Comfort Pajama Set","price":1599,"category":"Women","image":"/products/106-front.jpg","gallery":["/products/106-front.jpg","/products/106-view2.jpg","/products/106-view3.jpg","/products/106-view4.jpg"],"sizes":["S","M","L","XL"],"tag":"NEW","stock":20,"active":true},
  {"id":"107","name":"Meadow Floral Nightdress","price":1399,"category":"Women","image":"/products/107-front.jpg","gallery":["/products/107-front.jpg","/products/107-view2.jpg","/products/107-view3.jpg","/products/107-view4.jpg"],"sizes":["S","M","L","XL"],"tag":"NEW","stock":20,"active":true},
  {"id":"108","name":"Classic Black Sleep Set","price":1699,"category":"Women","image":"/products/108-front.jpg","gallery":["/products/108-front.jpg","/products/108-view2.jpg","/products/108-view3.jpg","/products/108-view4.jpg"],"sizes":["S","M","L","XL"],"tag":"BESTSELLER","stock":20,"active":true},
  {"id":"109","name":"Heart Pop Nightdress","price":1399,"category":"Women","image":"/products/109-front.jpg","gallery":["/products/109-front.jpg","/products/109-view2.jpg","/products/109-view3.jpg","/products/109-view4.jpg"],"sizes":["S","M","L","XL"],"tag":"NEW","stock":20,"active":true},
  {"id":"110","name":"Sky Blue Lounge Set","price":1599,"category":"Women","image":"/products/110-front.jpg","gallery":["/products/110-front.jpg","/products/110-view2.jpg","/products/110-view3.jpg","/products/110-view4.jpg"],"sizes":["S","M","L","XL"],"tag":"NEW","stock":20,"active":true},
  {"id":"201","name":"Little Dreamer Pajama Set","price":999,"category":"Kids","image":"/products/201-front.jpg","gallery":["/products/201-front.jpg","/products/201-view2.jpg","/products/201-view3.jpg","/products/201-view4.jpg"],"sizes":["2-3Y","4-5Y","6-7Y","8-9Y","10-11Y"],"tag":"NEW","stock":20,"active":true},
  {"id":"202","name":"Sweet Dreams Nightdress","price":899,"category":"Kids","image":"/products/202-front.jpg","gallery":["/products/202-front.jpg","/products/202-view2.jpg","/products/202-view3.jpg","/products/202-view4.jpg"],"sizes":["2-3Y","4-5Y","6-7Y","8-9Y","10-11Y"],"tag":"BESTSELLER","stock":20,"active":true},
  {"id":"203","name":"Moonlight Kids Nightwear","price":1099,"category":"Kids","image":"/products/203-front.jpg","gallery":["/products/203-front.jpg","/products/203-view2.jpg","/products/203-view3.jpg","/products/203-view4.jpg"],"sizes":["2-3Y","4-5Y","6-7Y","8-9Y","10-11Y"],"tag":"NEW","stock":20,"active":true},
  {"id":"204","name":"Bunny Love Pajama Set","price":999,"category":"Kids","image":"/products/204-front.jpg","gallery":["/products/204-front.jpg","/products/204-view2.jpg","/products/204-view3.jpg","/products/204-view4.jpg"],"sizes":["2-3Y","4-5Y","6-7Y","8-9Y","10-11Y"],"tag":"NEW","stock":20,"active":true},
  {"id":"205","name":"Little Explorer Pajama Set","price":999,"category":"Kids","image":"/products/205-front.jpg","gallery":["/products/205-front.jpg","/products/205-view2.jpg","/products/205-view3.jpg","/products/205-view4.jpg"],"sizes":["2-3Y","4-5Y","6-7Y","8-9Y","10-11Y"],"tag":"NEW","stock":20,"active":true},
  {"id":"206","name":"Unicorn Magic Nightdress","price":1099,"category":"Kids","image":"/products/206-front.jpg","gallery":["/products/206-front.jpg","/products/206-view2.jpg","/products/206-view3.jpg","/products/206-view4.jpg"],"sizes":["2-3Y","4-5Y","6-7Y","8-9Y","10-11Y"],"tag":"NEW","stock":20,"active":true},
  {"id":"207","name":"Space Adventure Pajama Set","price":1099,"category":"Kids","image":"/products/207-front.jpg","gallery":["/products/207-front.jpg","/products/207-view2.jpg","/products/207-view3.jpg","/products/207-view4.jpg"],"sizes":["2-3Y","4-5Y","6-7Y","8-9Y","10-11Y"],"tag":"NEW","stock":20,"active":true},
  {"id":"208","name":"Pink Heart Pajama Set","price":999,"category":"Kids","image":"/products/208-front.jpg","gallery":["/products/208-front.jpg","/products/208-view2.jpg","/products/208-view3.jpg","/products/208-view4.jpg"],"sizes":["2-3Y","4-5Y","6-7Y","8-9Y","10-11Y"],"tag":"NEW","stock":20,"active":true},
  {"id":"209","name":"Dino Fun Nightwear","price":999,"category":"Kids","image":"/products/209-front.jpg","gallery":["/products/209-front.jpg","/products/209-view2.jpg","/products/209-view3.jpg","/products/209-view4.jpg"],"sizes":["2-3Y","4-5Y","6-7Y","8-9Y","10-11Y"],"tag":"NEW","stock":20,"active":true},
  {"id":"210","name":"Sunshine Kids Nightdress","price":1099,"category":"Kids","image":"/products/210-front.jpg","gallery":["/products/210-front.jpg","/products/210-view2.jpg","/products/210-view3.jpg","/products/210-view4.jpg"],"sizes":["2-3Y","4-5Y","6-7Y","8-9Y","10-11Y"],"tag":"NEW","stock":20,"active":true},
];

const CATALOG_VERSION = "dreamzy-product-page-v5";

function buildSizeStock(product: any): Record<string, number> {
  const sizes = Array.isArray(product?.sizes) && product.sizes.length ? product.sizes.map(String) : ["M"];
  const incoming = product?.sizeStock && typeof product.sizeStock === "object" ? product.sizeStock : {};
  const hasIncoming = Object.keys(incoming).length > 0;
  const total = Math.max(0, Number(product?.stock) || 0);
  const result: Record<string, number> = {};

  if (hasIncoming) {
    sizes.forEach((size) => {
      const value = Number(incoming[size]);
      result[size] = Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
    });
    return result;
  }

  const base = Math.floor(total / sizes.length);
  const remainder = total % sizes.length;
  sizes.forEach((size, index) => {
    result[size] = base + (index < remainder ? 1 : 0);
  });
  return result;
}

function normalizeCatalogProduct(product: any): CatalogProduct {
  const sizeStock = buildSizeStock(product);
  const sizes = Array.isArray(product?.sizes) && product.sizes.length ? product.sizes.map(String) : Object.keys(sizeStock);
  const stock = sizes.reduce((sum, size) => sum + Number(sizeStock[size] || 0), 0);
  return { ...product, sizes, sizeStock, stock };
}

export function getCatalog(): CatalogProduct[] {
  try {
    const version = window.localStorage.getItem("dreamzy-catalog-version");
    const raw = window.localStorage.getItem("dreamzy-products");
    if (version !== CATALOG_VERSION) {
      const initial = DEFAULT_CATALOG.map(normalizeCatalogProduct);
      window.localStorage.setItem("dreamzy-products", JSON.stringify(initial));
      window.localStorage.setItem("dreamzy-catalog-version", CATALOG_VERSION);
      return initial;
    }
    if (!raw) return DEFAULT_CATALOG.map(normalizeCatalogProduct);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_CATALOG.map(normalizeCatalogProduct);

    // Keep admin changes while restoring complete galleries and reliable per-size stock.
    return parsed.map((item: any) => {
      const fallback = DEFAULT_CATALOG.find((product) => String(product.id) === String(item?.id));
      if (!fallback) return normalizeCatalogProduct(item);
      const savedGallery = Array.isArray(item?.gallery) ? item.gallery.filter(Boolean) : [];
      const gallery = savedGallery.length >= 4 ? savedGallery.slice(0, 4) : (fallback.gallery || [fallback.image]);
      return normalizeCatalogProduct({
        ...fallback,
        ...item,
        image: String(item?.image || fallback.image),
        gallery,
      });
    });
  } catch { return DEFAULT_CATALOG.map(normalizeCatalogProduct); }
}

export function syncWishlistWithCatalog(catalog: CatalogProduct[]): StoredWishlistItem[] {
  try { const raw=window.localStorage.getItem("dreamzy-wishlist"); const saved=raw?JSON.parse(raw):[]; if(!Array.isArray(saved)) return []; const synced=saved.map((item:StoredWishlistItem)=>catalog.find(p=>String(p.id)===String(item.id))).filter(Boolean) as CatalogProduct[]; window.localStorage.setItem("dreamzy-wishlist",JSON.stringify(synced)); return synced; } catch { return []; }
}
export function syncCartWithCatalog(catalog: CatalogProduct[]): StoredCartItem[] {
  try { const raw=window.localStorage.getItem("dreamzy-cart"); const saved=raw?JSON.parse(raw):[]; if(!Array.isArray(saved)) return []; const synced=saved.map((item:StoredCartItem)=>{const productId=item.productId||String(item.id||"").split("-")[0]; const product=catalog.find(p=>String(p.id)===String(productId)); if(!product) return null; return {...item,productId:product.id,name:product.name,price:Number(product.price),image:product.image};}).filter(Boolean) as StoredCartItem[]; window.localStorage.setItem("dreamzy-cart",JSON.stringify(synced)); return synced; } catch { return []; }
}
export function syncStoredCatalogData(catalog=getCatalog()){ return {wishlist:syncWishlistWithCatalog(catalog),cart:syncCartWithCatalog(catalog)}; }
