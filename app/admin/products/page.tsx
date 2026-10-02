"use client";

import { useEffect, useState } from "react";
import { DEFAULT_CATALOG } from "../../lib/catalog";

type Product = {
  id: string; name: string; price: number; category: "Women" | "Kids"; image: string; gallery: string[];
  sizes: string[]; sizeStock: Record<string, number>; tag: "NEW" | "BESTSELLER" | "";
  stock: number; active: boolean;
  hsnSac: string;
  gstRate: number;
  gstInclusive: boolean;
};

const DEFAULT_HSN_SAC = "6108";
const DEFAULT_GST_RATE = 5;
const DEFAULT_GST_INCLUSIVE = true;

const DEMO_PRODUCTS: Product[] = DEFAULT_CATALOG.map((p) => ({
  ...p,
  tag: p.tag === "BESTSELLER" ? "BESTSELLER" : p.tag === "NEW" ? "NEW" : "",
  image: String((p as any).image ?? "/women-1.jpg"),
  gallery: Array.isArray((p as any).gallery) && (p as any).gallery.length
    ? (p as any).gallery.map((image: unknown) => String(image)).filter(Boolean).slice(0, 5)
    : [String((p as any).image ?? "/women-1.jpg")],
  hsnSac: DEFAULT_HSN_SAC,
  gstRate: DEFAULT_GST_RATE,
  gstInclusive: DEFAULT_GST_INCLUSIVE,
  sizeStock: p.sizeStock || {},
  stock: Object.values(p.sizeStock || {}).reduce((sum: number, qty: number) => sum + Number(qty || 0), 0) || Number(p.stock || 0),
}));

function normalizeProduct(product:any):Product {
  const sizes=Array.isArray(product?.sizes)&&product.sizes.length?product.sizes.map((s:any)=>String(s).trim()).filter(Boolean):["M"];
  const incoming=product?.sizeStock&&typeof product.sizeStock==="object"?product.sizeStock:{};
  const sizeStock:Record<string,number>={};
  sizes.forEach((size: string)=>{const n=Number(incoming[size]);sizeStock[size]=Number.isFinite(n)&&n>=0?Math.floor(n):0;});
  if(Object.keys(incoming).length===0&&Number(product?.stock)>0) sizeStock[sizes[0]]=Math.floor(Number(product.stock));
  const stock=sizes.reduce((sum: number,size: string)=>sum+Number(sizeStock[size]||0),0);
  const gstRate = Number.isFinite(Number(product?.gstRate)) && Number(product.gstRate) >= 0
    ? Number(product.gstRate)
    : DEFAULT_GST_RATE;
  const mainImage = String(product?.image || "/women-1.jpg");
  const incomingImages = Array.isArray(product?.gallery)
    ? product.gallery.map((image: any) => String(image || "")).filter(Boolean)
    : Array.isArray(product?.images)
      ? product.images.map((image: any) => String(image || "")).filter(Boolean)
      : [];
  const images = Array.from(new Set([mainImage, ...incomingImages].filter(Boolean))).slice(0, 5);
  return {
    id:String(product?.id??Date.now()),
    name:String(product?.name??"DREAMZY Product"),
    price:Number(product?.price)||0,
    category:product?.category==="Kids"?"Kids":"Women",
    image:images[0] || mainImage,
    gallery: images.length ? images : [mainImage],
    sizes,sizeStock,
    tag:product?.tag==="BESTSELLER"?"BESTSELLER":product?.tag==="NEW"?"NEW":"",
    stock,active:product?.active!==false,
    hsnSac:String(product?.hsnSac??DEFAULT_HSN_SAC),
    gstRate,
    gstInclusive:product?.gstInclusive!==false
  };
}

function stockLabel(value:number){
  if(value<=0) return {label:"OUT OF STOCK",background:"#f3d7d7",color:"#8a3038"};
  if(value<=4) return {label:"LOW STOCK",background:"#f5e6c8",color:"#8a5a18"};
  return {label:"IN STOCK",background:"#e4efe4",color:"#35633b"};
}

function readProducts():Product[]{try{const raw=window.localStorage.getItem("dreamzy-products");if(!raw)return DEMO_PRODUCTS;const data=JSON.parse(raw);return Array.isArray(data)&&data.length?data.map(normalizeProduct):DEMO_PRODUCTS;}catch{return DEMO_PRODUCTS;}}

export default function AdminProductsPage(){
  const [products,setProducts]=useState<Product[]>(DEMO_PRODUCTS); const [search,setSearch]=useState(""); const [category,setCategory]=useState("All"); const [sortBy,setSortBy]=useState("default"); const [stockFilter,setStockFilter]=useState("all"); const [editingId,setEditingId]=useState<string|null>(null); const [form,setForm]=useState<Product|null>(null); const [message,setMessage]=useState(""); const [deleteConfirmId,setDeleteConfirmId]=useState<string|null>(null);
  useEffect(()=>{const loaded=readProducts();setProducts(loaded);window.localStorage.setItem("dreamzy-products",JSON.stringify(loaded));},[]);
  function persist(next:Product[]){const normalized=next.map(normalizeProduct);setProducts(normalized);window.localStorage.setItem("dreamzy-products",JSON.stringify(normalized));window.dispatchEvent(new Event("dreamzy-products-updated"));}
  function startEdit(product:Product){const p=normalizeProduct(product);setEditingId(product.id);setForm({...p,sizes:[...p.sizes],sizeStock:{...p.sizeStock}});setMessage("");window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"});}
  function cancelEdit(){setEditingId(null);setForm(null);setMessage("");}
  function updateSizeStock(size:string,value:number){if(!form)return;const v=Number.isFinite(value)&&value>=0?Math.floor(value):0;const sizeStock={...form.sizeStock,[size]:v};const stock=form.sizes.reduce((sum,s)=>sum+Number(sizeStock[s]||0),0);setForm({...form,sizeStock,stock});}
  function updateSizes(value:string){if(!form)return;const sizes=value.split(",").map(x=>x.trim()).filter(Boolean);const finalSizes=sizes.length?sizes:["M"];const sizeStock:Record<string,number>={};finalSizes.forEach(s=>{const n=Number(form.sizeStock[s]);sizeStock[s]=Number.isFinite(n)&&n>=0?Math.floor(n):0;});const stock=finalSizes.reduce((sum,s)=>sum+Number(sizeStock[s]||0),0);setForm({...form,sizes:finalSizes,sizeStock,stock});}
  function readAndCompressImage(file:File):Promise<string>{
    return new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.onerror=()=>reject(new Error("Could not read image."));
      reader.onload=()=>{
        if(typeof reader.result!=="string"){reject(new Error("Could not read image."));return;}
        const image=new Image();
        image.onerror=()=>resolve(reader.result as string);
        image.onload=()=>{
          const maxDimension=1400;
          const scale=Math.min(1,maxDimension/Math.max(image.width,image.height));
          const canvas=document.createElement("canvas");
          canvas.width=Math.max(1,Math.round(image.width*scale));
          canvas.height=Math.max(1,Math.round(image.height*scale));
          const context=canvas.getContext("2d");
          if(!context){resolve(reader.result as string);return;}
          context.drawImage(image,0,0,canvas.width,canvas.height);
          resolve(canvas.toDataURL("image/jpeg",0.82));
        };
        image.src=reader.result;
      };
      reader.readAsDataURL(file);
    });
  }
  async function handleImageUpload(event:React.ChangeEvent<HTMLInputElement>){
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if(!files.length || !form) return;
    const validFiles = files.filter(file => file.type.startsWith("image/"));
    if(validFiles.length !== files.length){setMessage("Please select image files only.");return;}
    if(validFiles.some(file => file.size > 5 * 1024 * 1024)){setMessage("Each original image must be smaller than 5 MB.");return;}
    const isPlaceholder = form.gallery.length <= 1 && form.image === "/women-1.jpg";
    const currentImages = isPlaceholder ? [] : (form.gallery || [form.image]).filter(Boolean);
    const remainingSlots = 5 - currentImages.length;
    if(remainingSlots <= 0){setMessage("You can add up to 5 images per product. Remove an image first.");return;}
    const selectedFiles = validFiles.slice(0, remainingSlots);
    try {
      const uploadedImages = await Promise.all(selectedFiles.map(readAndCompressImage));
      const images = [...currentImages, ...uploadedImages].slice(0, 5);
      setForm({...form, image: images[0] || form.image, gallery: images});
      setMessage(`✓ ${uploadedImages.length} image${uploadedImages.length === 1 ? "" : "s"} added and optimized. Save the product to keep the changes.`);
    } catch {
      setMessage("Could not read one of the selected images.");
    }
  }
  function removeProductImage(index:number){
    if(!form) return;
    if(form.gallery.length <= 1){setMessage("Keep at least one product image.");return;}
    const images = form.gallery.filter((_, imageIndex) => imageIndex !== index);
    setForm({...form, image: images[0], gallery: images});
    setMessage("Image removed. Save the product to keep the changes.");
  }
  function updateMainImage(value:string){
    if(!form) return;
    const oldImages = form.gallery || [form.image];
    const rest = oldImages.filter((_, index) => index !== 0);
    const images = value.trim() ? [value, ...rest].slice(0, 5) : rest.slice(0, 5);
    setForm({...form, image: value || images[0] || "/women-1.jpg", gallery: images.length ? images : [value || "/women-1.jpg"]});
  }
  function saveEdit(){if(!form)return;if(!form.name.trim()){setMessage("Please enter a product name.");return;}if(!Number.isFinite(form.price)||form.price<=0){setMessage("Please enter a valid price.");return;}if(!form.sizes.length){setMessage("Please add at least one size.");return;}const clean=normalizeProduct(form);persist(products.map(p=>p.id===clean.id?clean:p));setForm(null);setEditingId(null);setMessage("✓ Product saved successfully.");window.scrollTo({top:0,behavior:"smooth"});}
  function resetDemo(){persist(DEMO_PRODUCTS);setEditingId(null);setForm(null);setSearch("");setCategory("All");setSortBy("default");setStockFilter("all");setMessage(`✓ ${DEMO_PRODUCTS.length} demo products restored.`);}
  function requestDeleteProduct(id:string){setDeleteConfirmId(id);}
  function confirmDeleteProduct(){if(!deleteConfirmId)return;const id=deleteConfirmId;persist(products.filter(p=>p.id!==id));if(editingId===id)cancelEdit();setDeleteConfirmId(null);setMessage("✓ Product deleted.");}
  function toggleActive(id:string){persist(products.map(p=>p.id===id?{...p,active:!p.active}:p));}
  function addProduct(){const p:Product={id:String(Date.now()),name:"New DREAMZY Product",price:999,category:"Women",image:"/women-1.jpg",gallery:["/women-1.jpg"],sizes:["S","M","L","XL"],sizeStock:{S:3,M:3,L:2,XL:2},tag:"NEW",stock:10,active:true,hsnSac:DEFAULT_HSN_SAC,gstRate:DEFAULT_GST_RATE,gstInclusive:DEFAULT_GST_INCLUSIVE};persist([p,...products]);startEdit(p);}
  const filteredProducts=products.filter(p=>{
    const matchesSearch=p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory=category==="All"||p.category===category;
    const matchesStock=stockFilter==="all"
      ? true
      : stockFilter==="out"
      ? p.stock<=0
      : p.stock>0&&p.sizes.some(size=>{const qty=Number(p.sizeStock[size]||0);return qty>0&&qty<=4;});
    return matchesSearch&&matchesCategory&&matchesStock;
  });
  const visible=[...filteredProducts].sort((a,b)=>{
    if(sortBy==="name-asc") return a.name.localeCompare(b.name);
    if(sortBy==="price-asc") return a.price-b.price;
    if(sortBy==="price-desc") return b.price-a.price;
    if(sortBy==="stock-asc") return a.stock-b.stock;
    return 0;
  });
  const activeCount=products.filter(p=>p.active).length;
  const hiddenCount=products.length-activeCount;
  const outOfStockCount=products.filter(p=>p.stock<=0).length;
  return <main style={{minHeight:"100vh",background:"#faf6f1",color:"#542f35",fontFamily:"Arial,sans-serif"}}>
    <section style={{maxWidth:1250,margin:"0 auto",padding:"45px 28px 80px"}}>
      <div className="title-row" style={{display:"flex",justifyContent:"space-between",alignItems:"end",marginBottom:28,gap:20}}><div><div style={{fontSize:11,letterSpacing:3,color:"#987276",fontWeight:700}}>CATALOG MANAGEMENT</div><h1 style={{margin:"10px 0 0",fontFamily:"Georgia,serif",fontSize:48,fontWeight:400}}>Products</h1></div><button type="button" onClick={addProduct} style={{border:0,background:"#542f35",color:"#fff",padding:"14px 22px",cursor:"pointer",fontWeight:700}}>+ ADD PRODUCT</button></div>
      {message&&<div style={{padding:"13px 16px",marginBottom:20,background:"#eee2dc",border:"1px solid #ddceca"}}>{message}</div>}
      <div className="product-summary" style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:14,marginBottom:22}}>
        <div style={{background:"#fffdfb",border:"1px solid #eadfd8",padding:"18px 20px"}}><div style={{fontSize:10,letterSpacing:2,color:"#987276",fontWeight:700}}>TOTAL PRODUCTS</div><div style={{fontSize:28,fontWeight:400,color:"#542f35",marginTop:8}}>{products.length}</div></div>
        <div style={{background:"#fffdfb",border:"1px solid #eadfd8",padding:"18px 20px"}}><div style={{fontSize:10,letterSpacing:2,color:"#987276",fontWeight:700}}>ACTIVE PRODUCTS</div><div style={{fontSize:28,fontWeight:400,color:"#35633b",marginTop:8}}>{activeCount}</div></div>
        <div style={{background:"#fffdfb",border:"1px solid #eadfd8",padding:"18px 20px"}}><div style={{fontSize:10,letterSpacing:2,color:"#987276",fontWeight:700}}>HIDDEN PRODUCTS</div><div style={{fontSize:28,fontWeight:400,color:"#542f35",marginTop:8}}>{hiddenCount}</div></div>
        <div style={{background:"#fffdfb",border:"1px solid #eadfd8",padding:"18px 20px"}}><div style={{fontSize:10,letterSpacing:2,color:"#987276",fontWeight:700}}>OUT OF STOCK</div><div style={{fontSize:28,fontWeight:400,color:"#8a3038",marginTop:8}}>{outOfStockCount}</div></div>
      </div>
      <div className="filters" style={{display:"grid",gridTemplateColumns:"minmax(220px,1fr) auto auto auto auto",gap:10,marginBottom:18}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." style={{height:46,border:"1px solid #ddceca",padding:"0 15px",background:"#fffdfb",minWidth:0}}/><select value={category} onChange={e=>setCategory(e.target.value)} aria-label="Filter by category" style={{height:46,border:"1px solid #ddceca",padding:"0 14px",background:"#fffdfb"}}><option value="All">All categories</option><option value="Women">Women</option><option value="Kids">Kids</option></select><select value={sortBy} onChange={e=>setSortBy(e.target.value)} aria-label="Sort products" style={{height:46,border:"1px solid #ddceca",padding:"0 14px",background:"#fffdfb",color:"#542f35"}}><option value="default">Sort products</option><option value="name-asc">Name: A–Z</option><option value="price-asc">Price: Low to high</option><option value="price-desc">Price: High to low</option><option value="stock-asc">Stock: Lowest first</option></select><select value={stockFilter} onChange={e=>setStockFilter(e.target.value)} aria-label="Filter by stock" style={{height:46,border:"1px solid #ddceca",padding:"0 14px",background:"#fffdfb",color:"#542f35"}}><option value="all">All stock</option><option value="low">Low stock</option><option value="out">Out of stock</option></select><button type="button" onClick={resetDemo} style={{height:46,border:"1px solid #cdb9b5",background:"#fffdfb",color:"#542f35",padding:"0 18px",cursor:"pointer",fontWeight:700}}>RESET DEMO</button></div>
      <div style={{marginBottom:18,color:"#80676a",fontSize:13}}>Showing {visible.length} of {products.length} products{stockFilter==="low"?" · Low stock":stockFilter==="out"?" · Out of stock":""}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:22}}>{visible.map(product=><article key={product.id} style={{background:"#fffdfb",border:"1px solid #eadfd8",overflow:"hidden",opacity:product.active?1:.55}}><div style={{height:300,background:"#eee5df",position:"relative"}}><img src={product.image} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>{product.tag&&<span style={{position:"absolute",top:14,left:14,background:"#542f35",color:"#fff",padding:"7px 10px",fontSize:10,fontWeight:700}}>{product.tag}</span>}</div><div style={{padding:20}}><div style={{fontSize:10,letterSpacing:1.5,color:"#987276",fontWeight:700}}>{product.category.toUpperCase()}</div><h2 style={{margin:"8px 0",fontFamily:"Georgia,serif",fontSize:22,fontWeight:400}}>{product.name}</h2><div style={{fontSize:17,fontWeight:700,marginBottom:8}}>₹{product.price.toLocaleString("en-IN")}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13,color:"#765b5e",marginBottom:8}}><span>Total Stock</span><strong style={{color:"#542f35"}}>{product.stock} units</strong></div>
<div style={{fontSize:11,color:"#80676a",marginBottom:12}}>
  {product.sizes.some(size=>Number(product.sizeStock[size]||0)<=0)
    ? "⚠ One or more sizes are out of stock."
    : product.sizes.some(size=>Number(product.sizeStock[size]||0)<=4)
    ? "⚠ One or more sizes are low in stock."
    : "✓ All sizes have healthy stock."}
</div><div style={{fontSize:12,color:"#80676a",marginBottom:16}}>
  <div style={{display:"grid",gap:7}}>
    {product.sizes.map(size=>{
      const qty=Number(product.sizeStock[size]||0);
      const stock=stockLabel(qty);
      return <div key={size} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,borderBottom:"1px solid #eee3de",paddingBottom:6}}>
        <span><strong>{size}</strong>: {qty} {qty===1?"unit":"units"}</span>
        <span style={{background:stock.background,color:stock.color,padding:"4px 7px",fontSize:9,fontWeight:700,letterSpacing:.5,whiteSpace:"nowrap"}}>{stock.label}</span>
      </div>;
    })}
  </div>
</div><div style={{display:"flex",gap:8}}><button type="button" onClick={()=>startEdit(product)} style={{flex:1,height:44,border:0,background:"#542f35",color:"#fff",cursor:"pointer",fontWeight:700}}>EDIT</button><button type="button" onClick={()=>toggleActive(product.id)} style={{flex:1,height:44,border:"1px solid #cdb9b5",background:"#fffdfb",color:"#542f35",cursor:"pointer",fontWeight:700}}>{product.active?"HIDE":"SHOW"}</button><button type="button" onClick={()=>requestDeleteProduct(product.id)} style={{width:44,height:44,border:"1px solid #cdb9b5",background:"#fffdfb",color:"#8a3f45",cursor:"pointer",fontSize:18}}>×</button></div></div></article>)}</div>
      {deleteConfirmId&&(()=>{const productToDelete=products.find(p=>p.id===deleteConfirmId);return <div role="presentation" onClick={()=>setDeleteConfirmId(null)} style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(37,24,26,.48)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><section role="dialog" aria-modal="true" aria-labelledby="delete-product-title" onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:440,background:"#fffdfb",border:"1px solid #ddceca",boxShadow:"0 18px 60px rgba(37,24,26,.22)",padding:28,color:"#542f35"}}><div style={{fontSize:10,letterSpacing:3,color:"#987276",fontWeight:700}}>PRODUCT MANAGEMENT</div><h2 id="delete-product-title" style={{fontFamily:"Georgia,serif",fontSize:30,fontWeight:400,margin:"10px 0 12px"}}>Delete this product?</h2><p style={{fontSize:14,lineHeight:1.6,color:"#765b5e",margin:"0 0 10px"}}>Are you sure you want to delete <strong style={{color:"#542f35"}}>{productToDelete?.name||"this product"}</strong>?</p><p style={{fontSize:12,lineHeight:1.6,color:"#80676a",margin:"0 0 24px"}}>This action cannot be undone.</p><div style={{display:"flex",justifyContent:"flex-end",gap:10,flexWrap:"wrap"}}><button type="button" onClick={()=>setDeleteConfirmId(null)} style={{height:44,padding:"0 20px",border:"1px solid #cdb9b5",background:"#fffdfb",color:"#542f35",cursor:"pointer",fontWeight:700}}>CANCEL</button><button type="button" onClick={confirmDeleteProduct} style={{height:44,padding:"0 20px",border:0,background:"#542f35",color:"#fff",cursor:"pointer",fontWeight:700}}>DELETE PRODUCT</button></div></section></div>;})()}
      {editingId&&form&&<section style={{marginTop:40,background:"#fffdfb",border:"2px solid #542f35",padding:28}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,gap:15}}><div><div style={{fontSize:11,letterSpacing:3,color:"#987276",fontWeight:700}}>PRODUCT EDITOR</div><h2 style={{margin:"7px 0 0",fontFamily:"Georgia,serif",fontWeight:400,fontSize:32}}>Edit Product</h2></div><button type="button" onClick={cancelEdit} style={{border:"1px solid #cdb9b5",background:"#fffdfb",padding:"10px 18px",cursor:"pointer"}}>CLOSE</button></div>
        <div className="form-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
          <div className="form-section-heading" style={{gridColumn:"1 / -1",borderBottom:"1px solid #eadfd8",paddingBottom:9,marginBottom:0}}>
            <div style={{fontSize:10,letterSpacing:2.5,color:"#987276",fontWeight:700}}>01 · PRODUCT DETAILS</div>
            <div style={{fontSize:12,color:"#80676a",marginTop:5}}>Manage the product name, category, and storefront visibility.</div>
          </div>
          <label>Product Name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={inputStyle}/></label>
          <label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value as "Women"|"Kids"})} style={inputStyle}><option value="Women">Women</option><option value="Kids">Kids</option></select></label>

          <div className="form-section-heading" style={{gridColumn:"1 / -1",borderBottom:"1px solid #eadfd8",paddingBottom:9,marginTop:8}}>
            <div style={{fontSize:10,letterSpacing:2.5,color:"#987276",fontWeight:700}}>02 · PRICING & GST</div>
            <div style={{fontSize:12,color:"#80676a",marginTop:5}}>Review the selling price and tax details.</div>
          </div>
          <label>Price (₹)<input type="number" min="0.01" step="0.01" value={form.price} onChange={e=>setForm({...form,price:Number(e.target.value)})} style={inputStyle}/></label>
          <label>HSN / SAC<input value={form.hsnSac} onChange={e=>setForm({...form,hsnSac:e.target.value})} placeholder="e.g. 6108" style={inputStyle}/></label>
          <label>GST Rate (%)<input type="number" min="0" step="0.01" value={form.gstRate} onChange={e=>setForm({...form,gstRate:Number(e.target.value)})} style={inputStyle}/></label>
          <label>Price Type<select value={form.gstInclusive ? "inclusive" : "exclusive"} onChange={e=>setForm({...form,gstInclusive:e.target.value==="inclusive"})} style={inputStyle}><option value="inclusive">GST INCLUSIVE</option><option value="exclusive">GST EXCLUSIVE</option></select></label>
          {form.gstInclusive && form.price > 0 && form.gstRate > 0 && (
            <div style={{gridColumn:"1 / -1",padding:"12px 14px",background:"#faf6f1",border:"1px solid #eadfd8",fontSize:12}}>
              <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span>Taxable Value</span><strong>₹{(form.price/(1+form.gstRate/100)).toFixed(2)}</strong></div>
              <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span>GST ({form.gstRate}%)</span><strong>₹{(form.price-(form.price/(1+form.gstRate/100))).toFixed(2)}</strong></div>
              <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span>Customer Price</span><strong>₹{Number(form.price).toFixed(2)}</strong></div>
            </div>
          )}

          <div className="form-section-heading" style={{gridColumn:"1 / -1",borderBottom:"1px solid #eadfd8",paddingBottom:9,marginTop:8}}>
            <div style={{fontSize:10,letterSpacing:2.5,color:"#987276",fontWeight:700}}>03 · SIZE & INVENTORY</div>
            <div style={{fontSize:12,color:"#80676a",marginTop:5}}>Set available sizes and stock quantities. Total stock is calculated automatically.</div>
          </div>
          <div><label>Total Stock<input type="number" value={form.stock} readOnly style={{...inputStyle,background:"#f3ece8",color:"#765b5e"}}/></label><div style={{fontSize:11,color:"#80676a",marginTop:6}}>Automatically calculated from size stock.</div></div>
          <div style={{gridColumn:"1 / -1"}}><div style={{fontWeight:700,marginBottom:10}}>SIZE-BASED STOCK</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}}>{form.sizes.map(size=><label key={size} style={{display:"block",border:"1px solid #eadfd8",padding:12,background:"#faf6f1"}}><div style={{fontSize:12,fontWeight:700,marginBottom:7}}>SIZE {size}</div><input type="number" min={0} value={form.sizeStock[size]??0} onChange={e=>updateSizeStock(size,Number(e.target.value))} style={{...inputStyle,marginTop:0}}/></label>)}</div><label style={{display:"block",marginTop:15}}>Sizes<input value={form.sizes.join(", ")} onChange={e=>updateSizes(e.target.value)} placeholder="S, M, L, XL" style={inputStyle}/></label><div style={{marginTop:8,fontSize:11,color:"#80676a"}}>Example: S, M, L, XL. Enter stock separately for every size.</div></div>

          <div className="form-section-heading" style={{gridColumn:"1 / -1",borderBottom:"1px solid #eadfd8",paddingBottom:9,marginTop:8}}>
            <div style={{fontSize:10,letterSpacing:2.5,color:"#987276",fontWeight:700}}>04 · IMAGE & STORE DISPLAY</div>
            <div style={{fontSize:12,color:"#80676a",marginTop:5}}>Preview the product image and choose how it appears in the store.</div>
          </div>
          <div style={{gridColumn:"1 / -1"}}>
            <label>ADD PRODUCT IMAGES (UP TO 5)
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{...inputStyle,padding:11}}/>
            </label>
            <div style={{fontSize:11,color:"#80676a",marginTop:7}}>Choose up to 5 photos, such as front, back and side views. Each original file must be under 5 MB. Images are optimized before saving.</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:12,marginTop:14}}>
              {(form.gallery || [form.image]).filter(Boolean).map((image,index)=>
                <div key={`${index}-${image.slice(0,24)}`} style={{border:"1px solid #ddceca",background:"#fffdfb",padding:8,position:"relative"}}>
                  <img src={image} alt={`Product preview ${index+1}`} style={{width:"100%",height:125,objectFit:"cover",display:"block"}}/>
                  <div style={{fontSize:10,letterSpacing:1,color:"#80676a",marginTop:7}}>{index===0?"MAIN IMAGE":`IMAGE ${index+1}`}</div>
                  {index===0 && <div style={{fontSize:10,color:"#35633b",marginTop:3}}>Shown in listings</div>}
                  {form.gallery.length>1 && <button type="button" onClick={()=>removeProductImage(index)} style={{marginTop:7,width:"100%",height:30,border:"1px solid #ddceca",background:"#fffdfb",color:"#542f35",cursor:"pointer"}}>REMOVE</button>}
                </div>
              )}
            </div>
            <label style={{display:"block",marginTop:14}}>Main Image Path / URL<input value={form.image} onChange={e=>updateMainImage(e.target.value)} style={inputStyle}/></label>
          </div>
          <label>Label<select value={form.tag} onChange={e=>setForm({...form,tag:e.target.value as ""|"NEW"|"BESTSELLER"})} style={inputStyle}><option value="">None</option><option value="NEW">NEW</option><option value="BESTSELLER">BESTSELLER</option></select><span style={{display:"flex",gap:8,alignItems:"center",marginTop:18}}><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})}/>Product visible in store</span></label>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:25}}><button type="button" onClick={cancelEdit} style={{height:48,padding:"0 22px",border:"1px solid #cdb9b5",background:"#fffdfb",cursor:"pointer"}}>CANCEL</button><button type="button" onClick={saveEdit} style={{height:48,padding:"0 28px",border:0,background:"#542f35",color:"#fff",cursor:"pointer",fontWeight:700}}>SAVE PRODUCT</button></div>
      </section>}
    </section>
    <style jsx>{`label{display:block;} .form-grid input,.form-grid select{width:100%;height:46px;margin-top:7px;padding:0 12px;box-sizing:border-box;border:1px solid #ddceca;} .form-section-heading{align-self:end;} @media(max-width:900px){.product-summary{grid-template-columns:repeat(2,minmax(0,1fr))!important}} @media(max-width:700px){.title-row{flex-direction:column;align-items:stretch!important}.title-row h1{font-size:38px!important}.filters{grid-template-columns:1fr!important}.form-grid{grid-template-columns:1fr!important}.form-grid>div[style*="grid-column"]{grid-column:auto!important}} @media(max-width:480px){.title-row h1{font-size:32px!important}.product-summary{grid-template-columns:1fr!important}.product-summary>div{padding:14px 16px!important}}`}</style>
  </main>;
}

const inputStyle:React.CSSProperties={width:"100%",height:46,marginTop:7,padding:"0 12px",boxSizing:"border-box",border:"1px solid #ddceca",background:"#fffdfb"};
