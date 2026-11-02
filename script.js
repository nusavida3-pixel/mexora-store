// Ganti dengan nomor WhatsApp admin, format internasional tanpa + atau spasi.
const ADMIN_WHATSAPP = "628xxxxxxxxxx";
const products = window.MEXORA_PRODUCTS || [];
let cart = [];
let selectedProduct = null;
const $ = id => document.getElementById(id);
const money = n => new Intl.NumberFormat("id-ID").format(n);
const popularIds = ["ml","ff","pubg","roblox"];
const categoryNames = {Game:"Top Up Games",Digital:"Produk Digital",Pulsa:"Pulsa & Data",Voucher:"Voucher Entertainment"};

function productCard(p, popular=false){
 return `<article class="product-card ${popular?'popular-card':''}">
  <button class="product-open" data-product="${p.id}" aria-label="Pilih ${p.name}">
   <div class="game-cover cover-${p.art}"><span class="cover-tag">${p.tag || p.category.toUpperCase()}</span><span class="cover-figure"></span><strong>${p.name}</strong></div>
   <div class="product-info"><span class="product-type">${p.category.toUpperCase()}</span><h3>${p.name}</h3><p>${p.desc}</p><span class="choose-label">Pilih produk <b>↗</b></span></div>
  </button>
 </article>`;
}
function renderPopular(){
 $("popularGrid").innerHTML = popularIds.map(id=>products.find(p=>p.id===id)).filter(Boolean).map(p=>productCard(p,true)).join("");
}
function showCategory(category){
 $("catalogTitle").textContent = categoryNames[category] || category;
 $("catalogResults").hidden = false;
 $("catalogResults").scrollIntoView({behavior:"smooth",block:"start"});
 $("productGrid").innerHTML = products.filter(p=>p.category===category).map(p=>productCard(p)).join("");
}
function openVariants(p){
 selectedProduct=p;
 $("variantTitle").textContent=p.name;
 $("variantDesc").textContent=p.desc+" Pilih variasi yang kamu inginkan.";
 $("variantGrid").innerHTML=(p.variants||["Hubungi admin untuk pilihan produk"]).map((v,i)=>`<button class="variant-option" data-variant="${i}"><span>${v}</span><small>Harga dikonfirmasi admin</small></button>`).join("");
 $("variantBackdrop").classList.add("show");
}
function closeVariants(){ $("variantBackdrop").classList.remove("show"); }
function renderCart(){
 $("cartCount").textContent=cart.length;
 $("itemTotal").textContent=cart.length;
 $("cartItems").innerHTML=cart.length?cart.map((p,i)=>`<div class="cart-line"><div><strong>${p.name}</strong><small>${p.variant}</small></div><button class="remove-item" data-remove="${i}">Hapus</button></div>`).join(""):`<div class="empty-cart">Keranjang masih kosong.<br>Pilih produk untuk mulai order.</div>`;
}
function openCart(){ $("cartDrawer").classList.add("show");$("overlay").classList.add("show");}
function closeCart(){ $("cartDrawer").classList.remove("show");$("overlay").classList.remove("show");}
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
$("closeVariant").addEventListener("click",closeVariants);
$("variantBackdrop").addEventListener("click",e=>{if(e.target===$("variantBackdrop"))closeVariants();});
$("openCart").addEventListener("click",openCart);
$("closeCart").addEventListener("click",closeCart);
$("overlay").addEventListener("click",closeCart);
$("checkout").addEventListener("click",()=>{
 if(!cart.length){alert("Keranjang masih kosong. Pilih produk terlebih dahulu.");return;}
 if(!/^62\d{8,15}$/.test(ADMIN_WHATSAPP)){alert("Nomor WhatsApp admin belum diatur. Buka script.js lalu ganti ADMIN_WHATSAPP dengan nomor admin.");return;}
 const note=$("customerNote").value.trim();
 const lines=cart.map((p,i)=>`${i+1}. ${p.name} — ${p.variant}`).join("\n");
 const message=`Halo admin MEXORA, saya ingin memesan:\n${lines}\n\nUser ID / nomor tujuan / catatan: ${note||"-"}\nMohon info harga dan langkah selanjutnya.`;
 window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`,"_blank");
});
$("helpLink").addEventListener("click",e=>{
 e.preventDefault();
 if(!/^62\d{8,15}$/.test(ADMIN_WHATSAPP)){alert("Nomor WhatsApp admin belum diatur. Buka script.js lalu ganti ADMIN_WHATSAPP.");return;}
 window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent("Halo admin MEXORA, saya ingin bertanya.")}`,"_blank");
});
$("year").textContent=new Date().getFullYear();
renderPopular();renderCart();