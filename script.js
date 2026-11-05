// MEXORA STORE — katalog, order per produk, keranjang, dan bantuan
const MEXORA_CONFIG = {
  whatsappAdmin: "628xxxxxxxxxx",
  telegramUrl: "https://t.me/",
  instagramUrl: "https://instagram.com/"
};
const products = [...(window.MEXORA_PRODUCTS || []),
 {id:"hp-second",name:"HP Second",category:"Second",tag:"HANDPHONE",art:"phone",desc:"Pilihan handphone second. Tanyakan stok dan kondisi unit.",variants:["Tanyakan stok & harga"] ,kind:"stock"},
 {id:"pc-second",name:"PC Gaming Second",category:"PC",tag:"PC SECOND",art:"pc",desc:"PC gaming second. Tanyakan spesifikasi dan ketersediaan.",variants:["Tanyakan stok & harga"],kind:"stock"},
 {id:"vga",name:"VGA / Graphics Card",category:"PC",tag:"PART PC",art:"pc",desc:"Kartu grafis dan komponen PC.",variants:["Tanyakan stok & harga"],kind:"stock"},
 {id:"processor",name:"Processor",category:"PC",tag:"PART PC",art:"pc",desc:"Processor baru maupun second.",variants:["Tanyakan stok & harga"],kind:"stock"},
 {id:"ram",name:"RAM",category:"PC",tag:"PART PC",art:"pc",desc:"Memori RAM untuk PC.",variants:["Tanyakan stok & harga"],kind:"stock"},
 {id:"ssd",name:"SSD / Storage",category:"PC",tag:"PART PC",art:"pc",desc:"SSD dan media penyimpanan.",variants:["Tanyakan stok & harga"],kind:"stock"}
];
const $ = id => document.getElementById(id);
const popularIds=["ml-id","ml-global","ml-sg","ml-tr","ml-my","ml-ru","ml-ph","ff","pubg","roblox"];
let popularRegion="all";
const categoryNames={Game:"Top Up Games",Digital:"Produk Digital",Pulsa:"Pulsa & Data",Voucher:"Voucher Entertainment",Second:"Etalase HP Second",PC:"PC Second & Part PC"};
const ORDER_STORAGE_KEY="mexora_orders_v2";
let cart=[],selectedProduct=null,selectedVariant=null,activeCategory="Game",slideIndex=0;
function escapeHTML(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function getOrders(){try{return JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY)||"[]");}catch(e){return [];}}
function saveOrders(a){localStorage.setItem(ORDER_STORAGE_KEY,JSON.stringify(a));}
function makeOrderCode(){const d=new Date();return `MX-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;}
function productCard(p){return `<article class="product-card"><button class="product-open" data-product="${escapeHTML(p.id)}"><div class="game-cover cover-${escapeHTML(p.art)}"><span class="cover-tag">${escapeHTML(p.tag||p.category.toUpperCase())}</span><span class="cover-figure"></span><strong>${escapeHTML(p.name)}</strong></div><div class="product-info"><span class="product-type">${escapeHTML(p.category.toUpperCase())}</span><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.desc)}</p><span class="choose-label">Pilih produk <b>↗</b></span></div></button></article>`;}
function renderPopular(){
 const visible=popularIds.map(id=>products.find(p=>p.id===id)).filter(Boolean)
  .filter(p=>popularRegion==="all"||!p.region||p.region===popularRegion);
 $("popularGrid").innerHTML=visible.map(productCard).join("");
 document.querySelectorAll("[data-popular-region]").forEach(btn=>{
  const active=btn.dataset.popularRegion===popularRegion;
  btn.classList.toggle("active",active);btn.setAttribute("aria-pressed",String(active));
 });
}
function renderCatalog(){const term=($("productSearch").value||"").trim().toLowerCase();const filtered=products.filter(p=>p.category===activeCategory&&`${p.name} ${p.desc} ${p.tag}`.toLowerCase().includes(term));$("productGrid").innerHTML=filtered.map(productCard).join("");$("resultCount").textContent=`${filtered.length} produk`;$("noResults").hidden=!!filtered.length;}
function showCategory(c){activeCategory=c;$("catalogTitle").textContent=categoryNames[c]||c;$("catalogResults").hidden=false;$("productSearch").value="";renderCatalog();$("catalogResults").scrollIntoView({behavior:"smooth",block:"start"});}
function openVariants(p){selectedProduct=p;selectedVariant=null;$("variantTitle").textContent=p.name;$("variantDesc").textContent=p.desc+" "+(p.kind==="stock"?"Pilih opsi lalu isi catatan atau jumlah yang diinginkan.":"Pilih nominal/paket, lalu isi data khusus produk ini.");$("variantGrid").innerHTML=(p.variants||["Hubungi admin"]).map((v,i)=>`<button type="button" class="variant-option" data-variant="${i}"><span>${escapeHTML(v)}</span><small>${p.kind==="stock"?"Stok dan harga dikonfirmasi admin":"Harga dikonfirmasi admin"}</small></button>`).join("");$("productFields").innerHTML=fieldsFor(p);$("variantBackdrop").classList.add("show");}
function fieldsFor(p){
 if(p.kind==="stock")return `<label>Jumlah (opsional)<input id="itemQty" class="checkout-input" type="number" min="1" value="1"></label><label>Catatan / pertanyaan (opsional)<textarea id="itemData" placeholder="Contoh: warna, kondisi, spesifikasi yang dicari..."></textarea></label><p class="field-hint">Pesanan ini berstatus permintaan cek stok. Admin akan mengonfirmasi harga dan ketersediaan.</p>`;
 if(p.category==="Game"){
  let extra=p.requiresZone?'<label>User ID<input id="fieldUser" class="checkout-input" placeholder="Masukkan User ID"></label><label>Zone ID / Server ID<input id="fieldZone" class="checkout-input" placeholder="Masukkan Zone ID"></label>': '<label>Player ID / User ID<input id="fieldUser" class="checkout-input" placeholder="Masukkan ID akun game"></label>';
  return `${extra}<label>Catatan (opsional)<textarea id="itemData" placeholder="Catatan untuk admin"></textarea></label>`;
 }
 if(p.category==="Digital")return `<label>Email / Username akun<input id="fieldUser" class="checkout-input" placeholder="Isi sesuai kebutuhan produk"></label><label>Detail paket / catatan<textarea id="itemData" placeholder="Contoh: durasi paket atau instruksi khusus"></textarea></label><p class="field-hint">Jangan masukkan password akun. Admin akan meminta data lanjutan melalui jalur aman bila memang diperlukan.</p>`;
 if(p.category==="Pulsa")return `<label>Nomor HP tujuan<input id="fieldUser" class="checkout-input" placeholder="08xxxxxxxxxx"></label><label>Operator / catatan<textarea id="itemData" placeholder="Nama operator atau detail paket"></textarea></label>`;
 return `<label>Region / catatan (opsional)<input id="fieldUser" class="checkout-input" placeholder="Contoh: Indonesia"></label><label>Catatan<textarea id="itemData" placeholder="Detail voucher yang dicari"></textarea></label>`;
}
function closeVariants(){$("variantBackdrop").classList.remove("show");}
function addSelectedItem(){
 if(!selectedProduct)return;if(selectedVariant===null){alert("Pilih nominal atau opsi produk terlebih dahulu.");return;}
 const p=selectedProduct, user=$("fieldUser")?.value.trim()||"", zone=$("fieldZone")?.value.trim()||"", note=$("itemData")?.value.trim()||"", qty=Math.max(1,Number($("itemQty")?.value||1));
 if(p.category==="Game"&&!user){alert("Isi User ID / Player ID terlebih dahulu.");return;}
 if(p.requiresZone&&!zone){alert("Isi Zone ID / Server ID Mobile Legends terlebih dahulu.");return;}
 if((p.category==="Digital"||p.category==="Pulsa")&&!user){alert("Isi email, username, atau nomor tujuan terlebih dahulu.");return;}
 cart.push({name:p.name,category:p.category,region:p.region||"",variant:selectedVariant,user,zone,note,qty,kind:p.kind||"digital"});
 renderCart();closeVariants();openCart();
}
function renderCart(){
 $("cartCount").textContent=cart.length;$("itemTotal").textContent=cart.reduce((n,x)=>n+x.qty,0);
 $("cartItems").innerHTML=cart.length?cart.map((p,i)=>`<div class="cart-line"><div><strong>${escapeHTML(p.name)} × ${p.qty}</strong><small>${escapeHTML(p.variant)}${p.region?`<br>Region: ${escapeHTML(p.region)}`:""}${p.user?`<br>Data: ${escapeHTML(p.user)}`:""}${p.zone?`<br>Zone: ${escapeHTML(p.zone)}`:""}${p.note?`<br>Catatan: ${escapeHTML(p.note)}`:""}<br><em>${p.kind==="stock"?"Cek stok & harga":"Harga dikonfirmasi admin"}</em></small></div><button class="remove-item" data-remove="${i}">Hapus</button></div>`).join(""):`<div class="empty-cart">Keranjang masih kosong.<br>Pilih produk untuk mulai order.</div>`;
}
function openCart(){$("cartDrawer").classList.add("show");$("overlay").classList.add("show");}
function closeCart(){$("cartDrawer").classList.remove("show");$("overlay").classList.remove("show");}
function validWhatsApp(){return /^62\d{8,15}$/.test(MEXORA_CONFIG.whatsappAdmin);}
function sendWhatsApp(message){if(!validWhatsApp()){alert("Nomor WhatsApp admin belum diatur. Ganti MEXORA_CONFIG.whatsappAdmin di script.js dengan nomor format 62...");return false;}window.open(`https://wa.me/${MEXORA_CONFIG.whatsappAdmin}?text=${encodeURIComponent(message)}`,"_blank","noopener");return true;}
function checkout(){
 if(!cart.length){alert("Keranjang masih kosong.");return;}
 const name=$("customerName").value.trim(),contact=$("customerContact").value.trim(),note=$("customerNote").value.trim();
 if(!name||!contact){alert("Lengkapi nama dan nomor WhatsApp pembeli.");return;}
 const code=makeOrderCode(),items=cart.map(x=>({...x}));
 const order={code,createdAt:new Date().toISOString(),name,contact,note,items,status:"Menunggu konfirmasi admin",voucher:null};
 const orders=getOrders();orders.unshift(order);saveOrders(orders);
 const detail=items.map((p,i)=>`${i+1}. ${p.name} (${p.category})\\n   Region: ${p.region||"-"}\\n   Pilihan: ${p.variant}\\n   Jumlah: ${p.qty}\\n   Data/ID: ${p.user||"-"}\\n   Zone/Server: ${p.zone||"-"}\\n   Catatan: ${p.note||"-"}\\n   Status stok: ${p.kind==="stock"?"Perlu konfirmasi admin":"Produk digital"}`).join("\\n\\n");
 const message=`Halo Admin MEXORA, saya ingin mengirim pesanan.\\n\\nKODE TRANSAKSI: ${code}\\nNama: ${name}\\nWhatsApp: ${contact}\\n\\n${detail}\\n\\nCatatan umum: ${note||"-"}\\n\\nMohon konfirmasi harga, stok (jika barang fisik), total pembayaran, dan metode pembayaran. Setelah pembayaran terverifikasi, mohon terbitkan voucher transaksi.`;
 if(sendWhatsApp(message)){
  $("lastOrderCode")?.remove();const hint=document.createElement("div");hint.id="lastOrderCode";hint.className="last-order-code";hint.innerHTML=`Kode transaksi: <strong>${code}</strong><br><small>Simpan kode ini. Voucher diterbitkan admin setelah pembayaran terverifikasi.</small>`;$("drawerBottom").prepend(hint);
  cart=[];renderCart();$("customerNote").value="";closeCart();
 }
}
function lookupOrder(){
 const code=$("orderLookupInput").value.trim().toUpperCase(),result=$("orderLookupResult");if(!code){result.textContent="Masukkan kode transaksi terlebih dahulu.";return;}
 const o=getOrders().find(x=>x.code===code);if(!o){result.textContent="Kode belum ditemukan di browser ini. Untuk pemeriksaan lintas perangkat, hubungi admin.";return;}
 result.innerHTML=`<div class="order-result-card"><div><small>KODE TRANSAKSI</small><strong>${escapeHTML(o.code)}</strong></div><span class="order-status">${escapeHTML(o.status)}</span><p>${o.items.map(i=>escapeHTML(i.name+" — "+i.variant)).join("<br>")}</p>${o.voucher?`<strong>Voucher: ${escapeHTML(o.voucher)}</strong>`:"<small>Voucher akan diberikan admin setelah pembayaran terverifikasi.</small>"}</div>`;
}
function setupSlides(){
 const dots=$("slideDots"),carousel=$("heroCarousel");
 function show(n){const slides=[...carousel.querySelectorAll(".hero-slide")];if(!slides.length)return;slideIndex=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle("active",i===slideIndex));dots.innerHTML=slides.length>1?slides.map((s,i)=>`<button class="${i===slideIndex?"active":""}" data-dot="${i}" aria-label="Banner ${i+1}"></button>`).join(""):"";}
 $("slidePrev").onclick=()=>show(slideIndex-1);$("slideNext").onclick=()=>show(slideIndex+1);dots.onclick=e=>{if(e.target.dataset.dot!==undefined)show(Number(e.target.dataset.dot));};show(0);
 let touchStart=0;carousel.addEventListener("touchstart",e=>{touchStart=e.changedTouches[0].clientX;},{passive:true});carousel.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-touchStart;if(Math.abs(dx)>45)show(slideIndex+(dx<0?1:-1));},{passive:true});
 let autoSlide=setInterval(()=>{if(carousel.querySelectorAll(".hero-slide").length>1)show(slideIndex+1);},5000);
 carousel.addEventListener("mouseenter",()=>clearInterval(autoSlide));carousel.addEventListener("mouseleave",()=>{clearInterval(autoSlide);autoSlide=setInterval(()=>{if(carousel.querySelectorAll(".hero-slide").length>1)show(slideIndex+1);},5000);});
 $("bannerUpload").addEventListener("change",e=>{const files=[...e.target.files].slice(0,5);if(!files.length)return;carousel.querySelectorAll(".hero-slide.uploaded").forEach(x=>x.remove());files.forEach(file=>{const reader=new FileReader();reader.onload=()=>{const slide=document.createElement("div");slide.className="hero-slide uploaded";slide.style.backgroundImage=`url("${reader.result}")`;slide.setAttribute("aria-label",file.name);carousel.insertBefore(slide,$("slideDots").parentElement);show(0);};reader.readAsDataURL(file);});});
}
function setupMenu(){
 const menu=$("sideMenu");$("menuToggle").onclick=()=>{menu.classList.add("show");$("overlay").classList.add("show");};$("closeMenu").onclick=()=>{menu.classList.remove("show");$("overlay").classList.remove("show");};
 menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{menu.classList.remove("show");$("overlay").classList.remove("show");}));
}
function setupChat(){
 $("chatToggle").onclick=()=>$("chatOptions").classList.toggle("show");
 $("chatWA").href=`https://wa.me/${MEXORA_CONFIG.whatsappAdmin}`;$("chatWA").target="_blank";
 $("chatTG").href=MEXORA_CONFIG.telegramUrl;$("chatTG").target="_blank";
 $("chatIG").href=MEXORA_CONFIG.instagramUrl;$("chatIG").target="_blank";
}
document.addEventListener("click",e=>{
 const rb=e.target.closest("[data-popular-region]");if(rb){popularRegion=rb.dataset.popularRegion;renderPopular();}
 const pb=e.target.closest("[data-product]");if(pb){const p=products.find(x=>x.id===pb.dataset.product);if(p)openVariants(p);}
 const cb=e.target.closest("[data-category]");if(cb)showCategory(cb.dataset.category);
 const vb=e.target.closest("[data-variant]");if(vb){selectedVariant=selectedProduct.variants[Number(vb.dataset.variant)];document.querySelectorAll(".variant-option").forEach(x=>x.classList.toggle("selected",x===vb));}
 const rm=e.target.closest("[data-remove]");if(rm){cart.splice(Number(rm.dataset.remove),1);renderCart();}
 const link=e.target.closest("#helpLink");if(link){e.preventDefault();sendWhatsApp("Halo admin MEXORA, saya ingin bertanya tentang produk atau pesanan.");}
});
$("addToCart").onclick=addSelectedItem;
$("backCategories").onclick=()=>{$("catalogResults").hidden=true;$("katalog").scrollIntoView({behavior:"smooth"});};
$("productSearch").addEventListener("input",renderCatalog);
const headerSearch=$("headerProductSearch");
headerSearch.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();$("productSearch").value=headerSearch.value;showCategory(activeCategory);$("productSearch").value=headerSearch.value;renderCatalog();}});
headerSearch.addEventListener("input",()=>{if(!headerSearch.value){$("productSearch").value="";renderCatalog();return;}$("productSearch").value=headerSearch.value;$("catalogResults").hidden=false;renderCatalog();});
$("closeVariant").onclick=closeVariants;$("variantBackdrop").onclick=e=>{if(e.target===$("variantBackdrop"))closeVariants();};
$("openCart").onclick=openCart;$("closeCart").onclick=closeCart;$("overlay").onclick=()=>{closeCart();$("sideMenu").classList.remove("show");$("overlay").classList.remove("show");};
$("checkout").onclick=checkout;$("lookupOrder").onclick=lookupOrder;$("orderLookupInput").onkeydown=e=>{if(e.key==="Enter")lookupOrder();};
$("year").textContent=new Date().getFullYear();renderPopular();renderCart();setupSlides();setupMenu();setupChat();
