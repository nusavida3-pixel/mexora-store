// MEXORA STORE — pengaturan dasar
// Ganti nomor admin nanti dengan format internasional tanpa + atau spasi, contoh 62812xxxxxxx.
const MEXORA_CONFIG = {
  whatsappAdmin: "628xxxxxxxxxx",
  currency: "IDR"
};
const products = window.MEXORA_PRODUCTS || [];
let cart = [];
let selectedProduct = null;
let activeCategory = "Game";
const $ = id => document.getElementById(id);
const popularIds = ["ml","ff","pubg","roblox"];
const categoryNames = {Game:"Top Up Games",Digital:"Produk Digital",Pulsa:"Pulsa & Data",Voucher:"Voucher Entertainment"};
const ORDER_STORAGE_KEY = "mexora_orders_v1";

function escapeHTML(value){
 return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function getOrders(){
 try{return JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY) || "[]");}
 catch(e){return [];}
}
function saveOrders(orders){localStorage.setItem(ORDER_STORAGE_KEY,JSON.stringify(orders));}
function makeOrderCode(){
 const d=new Date();
 const date=[d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("");
 return `MX-${date}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
}
function productCard(p){
 return `<article class="product-card">
  <button class="product-open" data-product="${escapeHTML(p.id)}" aria-label="Pilih ${escapeHTML(p.name)}">
   <div class="game-cover cover-${escapeHTML(p.art)}"><span class="cover-tag">${escapeHTML(p.tag || p.category.toUpperCase())}</span><span class="cover-figure"></span><strong>${escapeHTML(p.name)}</strong></div>
   <div class="product-info"><span class="product-type">${escapeHTML(p.category.toUpperCase())}</span><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.desc)}</p><span class="choose-label">Pilih produk <b>↗</b></span></div>
  </button>
 </article>`;
}
function renderPopular(){
 $("popularGrid").innerHTML=popularIds.map(id=>products.find(p=>p.id===id)).filter(Boolean).map(productCard).join("");
}
function renderCatalog(){
 const term=($("productSearch")?.value || "").trim().toLowerCase();
 const filtered=products.filter(p=>p.category===activeCategory && `${p.name} ${p.desc} ${p.tag}`.toLowerCase().includes(term));
 $("productGrid").innerHTML=filtered.map(productCard).join("");
 $("resultCount").textContent=`${filtered.length} produk`;
 $("noResults").hidden=filtered.length!==0;
}
function showCategory(category){
 activeCategory=category;
 $("catalogTitle").textContent=categoryNames[category] || category;
 $("catalogResults").hidden=false;
 $("productSearch").value="";
 renderCatalog();
 $("catalogResults").scrollIntoView({behavior:"smooth",block:"start"});
}
function openVariants(p){
 selectedProduct=p;
 $("variantTitle").textContent=p.name;
 $("variantDesc").textContent=p.desc+" Pilih variasi yang kamu inginkan.";
 $("variantGrid").innerHTML=(p.variants||["Hubungi admin untuk pilihan produk"]).map((v,i)=>`<button class="variant-option" data-variant="${i}"><span>${escapeHTML(v)}</span><small>Harga dikonfirmasi admin</small></button>`).join("");
 $("variantBackdrop").classList.add("show");
 $("variantBackdrop").setAttribute("aria-hidden","false");
}
function closeVariants(){
 $("variantBackdrop").classList.remove("show");
 $("variantBackdrop").setAttribute("aria-hidden","true");
}
function renderCart(){
 $("cartCount").textContent=cart.length;
 $("itemTotal").textContent=cart.length;
 $("cartItems").innerHTML=cart.length?cart.map((p,i)=>`<div class="cart-line"><div><strong>${escapeHTML(p.name)}</strong><small>${escapeHTML(p.variant)}</small></div><button class="remove-item" data-remove="${i}">Hapus</button></div>`).join(""):`<div class="empty-cart">Keranjang masih kosong.<br>Pilih produk untuk mulai order.</div>`;
}
function openCart(){$("cartDrawer").classList.add("show");$("overlay").classList.add("show");}
function closeCart(){$("cartDrawer").classList.remove("show");$("overlay").classList.remove("show");}
function validWhatsApp(){return /^62\d{8,15}$/.test(MEXORA_CONFIG.whatsappAdmin);}
function sendWhatsApp(message){
 if(!validWhatsApp()){
  alert("Nomor WhatsApp admin belum diatur. Nanti ganti MEXORA_CONFIG.whatsappAdmin di script.js dengan nomor format 62...");
  return false;
 }
 window.open(`https://wa.me/${MEXORA_CONFIG.whatsappAdmin}?text=${encodeURIComponent(message)}`,"_blank","noopener");
 return true;
}
function checkout(){
 if(!cart.length){alert("Keranjang masih kosong. Pilih produk terlebih dahulu.");return;}
 const name=$("customerName").value.trim();
 const contact=$("customerContact").value.trim();
 const target=$("customerTarget").value.trim();
 const note=$("customerNote").value.trim();
 if(!name || !contact || !target){alert("Lengkapi nama, nomor WhatsApp, dan User ID/nomor tujuan terlebih dahulu.");return;}
 const orderCode=makeOrderCode();
 const order={
  code:orderCode,createdAt:new Date().toISOString(),name,contact,target,note,
  items:cart.map(p=>({name:p.name,category:p.category,variant:p.variant})),
  status:"Menunggu konfirmasi admin"
 };
 const orders=getOrders();orders.unshift(order);saveOrders(orders);
 const lines=order.items.map((p,i)=>`${i+1}. ${p.name} — ${p.variant}`).join("\n");
 const message=`Halo admin MEXORA, saya ingin memesan:\nKode pesanan: ${orderCode}\nNama: ${name}\nWhatsApp pembeli: ${contact}\n${lines}\n\nUser ID / nomor tujuan: ${target}\nCatatan: ${note||"-"}\n\nMohon info total harga dan metode pembayaran manual.`;
 if(sendWhatsApp(message)){
  $("lastOrderCode")?.remove();
  const hint=document.createElement("div");hint.id="lastOrderCode";hint.className="last-order-code";
  hint.innerHTML=`Kode pesanan kamu: <strong>${orderCode}</strong><br><small>Simpan kode ini untuk mengecek status pesanan di bagian Cek Pesanan.</small>`;
  $("drawerBottom")?.prepend(hint);
  cart=[];renderCart();
  $("customerNote").value="";$("customerTarget").value="";
  closeCart();
 }
}
function lookupOrder(){
 const code=$("orderLookupInput").value.trim().toUpperCase();
 const result=$("orderLookupResult");
 if(!code){result.textContent="Masukkan kode pesanan terlebih dahulu.";return;}
 const order=getOrders().find(o=>o.code===code);
 if(!order){result.textContent="Kode tidak ditemukan di penyimpanan browser ini. Jika order dibuat dari perangkat lain, hubungi admin WhatsApp.";return;}
 const date=new Date(order.createdAt).toLocaleString("id-ID");
 result.innerHTML=`<div class="order-result-card"><div><small>KODE PESANAN</small><strong>${escapeHTML(order.code)}</strong></div><span class="order-status">${escapeHTML(order.status)}</span><p>${escapeHTML(order.items.map(i=>i.name+" — "+i.variant).join(", "))}</p><small>Dibuat: ${escapeHTML(date)}</small></div>`;
}

document.addEventListener("click",e=>{
 const productBtn=e.target.closest("[data-product]");
 if(productBtn){const p=products.find(x=>x.id===productBtn.dataset.product);if(p)openVariants(p);}
 const categoryBtn=e.target.closest("[data-category]");
 if(categoryBtn)showCategory(categoryBtn.dataset.category);
 const variantBtn=e.target.closest("[data-variant]");
 if(variantBtn && selectedProduct){
  const variant=selectedProduct.variants[Number(variantBtn.dataset.variant)];
  cart.push({name:selectedProduct.name,category:selectedProduct.category,variant});
  renderCart();closeVariants();openCart();
 }
 const remove=e.target.closest("[data-remove]");
 if(remove){cart.splice(Number(remove.dataset.remove),1);renderCart();}
});
$("backCategories").addEventListener("click",()=>{$("catalogResults").hidden=true;$("katalog").scrollIntoView({behavior:"smooth"});});
$("productSearch").addEventListener("input",renderCatalog);
$("closeVariant").addEventListener("click",closeVariants);
$("variantBackdrop").addEventListener("click",e=>{if(e.target===$("variantBackdrop"))closeVariants();});
$("openCart").addEventListener("click",openCart);
$("closeCart").addEventListener("click",closeCart);
$("overlay").addEventListener("click",closeCart);
$("checkout").addEventListener("click",checkout);
$("lookupOrder").addEventListener("click",lookupOrder);
$("orderLookupInput").addEventListener("keydown",e=>{if(e.key==="Enter")lookupOrder();});
$("helpLink").addEventListener("click",e=>{
 e.preventDefault();
 sendWhatsApp("Halo admin MEXORA, saya ingin bertanya tentang produk atau pesanan.");
});
$("year").textContent=new Date().getFullYear();
renderPopular();renderCart();
