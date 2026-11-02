// GANTI nomor di bawah dengan nomor WhatsApp admin, format internasional tanpa + atau spasi.
// Contoh Indonesia: 62812xxxxxxxx
const ADMIN_WHATSAPP = "628xxxxxxxxxx";
const products = window.MEXORA_PRODUCTS || [];
let cart = [];
let activeFilter = "Semua";
const grid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const money = n => new Intl.NumberFormat("id-ID").format(n);

function renderProducts(){
  const shown = products.filter(p => activeFilter === "Semua" || p.category === activeFilter);
  grid.innerHTML = shown.map(p => `<article class="product-card">
    <div class="product-icon">${p.icon}</div><div class="product-type">${p.category.toUpperCase()}</div>
    <h3>${p.name}</h3><p>${p.desc}</p><button class="add-btn" data-add="${p.id}">Pilih produk +</button>
  </article>`).join("");
}
function renderCart(){
  document.getElementById("cartCount").textContent = cart.length;
  document.getElementById("itemTotal").textContent = cart.length;
  const target = document.getElementById("cartItems");
  target.innerHTML = cart.length ? cart.map((p,i)=>`<div class="cart-line"><div><strong>${p.name}</strong><small>${p.category}</small></div><button class="remove-item" data-remove="${i}">Hapus</button></div>`).join("") : `<div class="empty-cart">Keranjang masih kosong.<br>Pilih produk untuk mulai order.</div>`;
}
function openCart(){cartDrawer.classList.add("show");overlay.classList.add("show")}
function closeCart(){cartDrawer.classList.remove("show");overlay.classList.remove("show")}
document.getElementById("filters").addEventListener("click",e=>{
  const b=e.target.closest("[data-filter]");if(!b)return;
  activeFilter=b.dataset.filter;
  document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));
  renderProducts();
});
grid.addEventListener("click",e=>{
  const b=e.target.closest("[data-add]");if(!b)return;
  const p=products.find(x=>x.id===b.dataset.add);if(p){cart.push(p);renderCart();openCart()}
});
document.getElementById("cartItems").addEventListener("click",e=>{
  const b=e.target.closest("[data-remove]");if(!b)return;
  cart.splice(Number(b.dataset.remove),1);renderCart();
});
document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.getElementById("checkout").addEventListener("click",()=>{
  if(!cart.length){alert("Keranjang masih kosong. Pilih produk terlebih dahulu.");return}
  if(!/^62\d{8,15}$/.test(ADMIN_WHATSAPP)){alert("Nomor WhatsApp admin belum diatur. Buka script.js lalu ganti ADMIN_WHATSAPP dengan nomor admin.");return}
  const note=document.getElementById("customerNote").value.trim();
  const lines=cart.map((p,i)=>`${i+1}. ${p.name} (${p.category})`).join("\n");
  const message=`Halo admin MEXORA, saya ingin memesan:\n${lines}\n\nCatatan / User ID: ${note || "-"}\nMohon info harga dan langkah selanjutnya.`;
  window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`,"_blank");
});
document.getElementById("helpLink").addEventListener("click",e=>{
  e.preventDefault();
  if(!/^62\d{8,15}$/.test(ADMIN_WHATSAPP)){alert("Nomor WhatsApp admin belum diatur. Buka script.js lalu ganti ADMIN_WHATSAPP.");return}
  window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent("Halo admin MEXORA, saya ingin bertanya.")}`,"_blank");
});
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
