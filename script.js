
// ======================================
// PENGATURAN TOKO
// ======================================

// GANTI dengan nomor WhatsApp admin.
// Format: 628xxxxxxxxxx (tanpa +, spasi, atau strip)
const WHATSAPP_NUMBER = "6281234567890";

// ======================================
// SISTEM KATALOG
// ======================================

const catalogContent = document.getElementById("catalogContent");
const pageTitle = document.getElementById("pageTitle");
const pageDescription = document.getElementById("pageDescription");
const breadcrumb = document.getElementById("breadcrumb");
const backButton = document.getElementById("backButton");

let navigation = [];
let selectedOrder = null;

function formatRupiah(price) {
  return "Rp" + Number(price).toLocaleString("id-ID");
}

function showHome() {
  navigation = [];
  renderHome();
  document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
}

function goBack() {
  navigation.pop();

  if (navigation.length === 0) {
    renderHome();
  } else if (navigation.length === 1) {
    renderCategory(navigation[0]);
  } else {
    const category = CATEGORIES.find(c => c.id === navigation[0]);
    const game = category.games.find(g => g.id === navigation[1]);
    renderGame(category, game);
  }
}

function updateBreadcrumb(items) {
  breadcrumb.innerHTML = items.map((item, index) => {
    return `<span>${item}</span>${index < items.length - 1 ? "<span class='crumb-separator'>/</span>" : ""}`;
  }).join("");
}

function updatePage(title, description, canGoBack) {
  pageTitle.textContent = title;
  pageDescription.textContent = description;
  backButton.classList.toggle("hidden", !canGoBack);
}

function renderHome() {
  updatePage(
    "Kategori Produk",
    "Pilih kategori produk yang kamu inginkan.",
    false
  );

  breadcrumb.innerHTML = "";

  catalogContent.innerHTML = CATEGORIES.map(category => `
    <article class="category-card" onclick="openCategory('${category.id}')">
      <div class="card-icon">${category.emoji}</div>
      <div class="card-info">
        <h3>${category.name}</h3>
        <p>${category.description}</p>
        <span class="card-link">Lihat Produk →</span>
      </div>
      <span class="card-arrow">↗</span>
    </article>
  `).join("");
}

function openCategory(categoryId) {
  const category = CATEGORIES.find(c => c.id === categoryId);
  if (!category) return;

  navigation = [categoryId];
  renderCategory(category);

  document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
}

function renderCategory(category) {
  updatePage(category.name, category.description, true);
  updateBreadcrumb(["Beranda", category.name]);

  if (category.type === "games") {
    catalogContent.innerHTML = category.games.map(game => `
      <article class="category-card game-card" onclick="openGame('${category.id}', '${game.id}')">
        <div class="card-icon">${game.emoji}</div>
        <div class="card-info">
          <h3>${game.name}</h3>
          <p>${game.description}</p>
          <span class="card-link">Pilih Nominal →</span>
        </div>
        <span class="card-arrow">↗</span>
      </article>
    `).join("");
  } else {
    renderProducts(category.products, category.name);
  }
}

function openGame(categoryId, gameId) {
  const category = CATEGORIES.find(c => c.id === categoryId);
  if (!category) return;

  const game = category.games.find(g => g.id === gameId);
  if (!game) return;

  navigation = [categoryId, gameId];
  renderGame(category, game);

  document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
}

function renderGame(category, game) {
  updatePage(
    game.name,
    "Pilih nominal top up yang ingin kamu beli.",
    true
  );

  updateBreadcrumb(["Beranda", category.name, game.name]);

  renderProducts(
    game.products.map(product => ({
      ...product,
      emoji: game.emoji,
      requiresPlayer: true
    })),
    game.name
  );
}

function renderProducts(products, title) {
  if (!products || products.length === 0) {
    catalogContent.innerHTML = `
      <div class="empty-state">
        <span>📦</span>
        <h3>Belum ada produk</h3>
        <p>Produk akan segera tersedia.</p>
      </div>
    `;
    return;
  }

  catalogContent.innerHTML = products.map(product => {
    const soldOut = product.stock <= 0;

    return `
      <article class="product-card">
        <div class="product-top">
          <div class="product-icon">${product.emoji || "✦"}</div>
          <span class="product-badge ${soldOut ? "sold-badge" : ""}">
            ${soldOut ? "HABIS" : "TERSEDIA"}
          </span>
        </div>

        <div class="product-details">
          <h3>${product.name}</h3>
          <p>${product.duration || title}</p>
        </div>

        <div class="product-bottom">
          <div>
            <span class="price-label">Harga</span>
            <strong>${formatRupiah(product.price)}</strong>
            <small>Stok: ${product.stock}</small>
          </div>
          <button
            class="buy-btn"
            ${soldOut ? "disabled" : ""}
            onclick="openOrder('${product.id}', '${title.replace(/'/g, "\\'")}')"
          >
            ${soldOut ? "Habis" : "Beli"}
          </button>
        </div>
      </article>
    `;
  }).join("");
}

// ======================================
// SISTEM ORDER
// ======================================

function findProduct(productId) {
  for (const category of CATEGORIES) {
    if (category.type === "games") {
      for (const game of category.games) {
        const product = game.products.find(p => p.id === productId);
        if (product) {
          return {
            ...product,
            emoji: game.emoji,
            gameName: game.name,
            requiresPlayer: true
          };
        }
      }
    } else {
      const product = category.products.find(p => p.id === productId);
      if (product) {
        return {
          ...product,
          gameName: category.name
        };
      }
    }
  }

  return null;
}

function openOrder(productId, categoryName) {
  const product = findProduct(productId);
  if (!product || product.stock <= 0) return;

  selectedOrder = {
    ...product,
    categoryName
  };

  document.getElementById("selectedProduct").innerHTML = `
    <div class="selected-icon">${product.emoji || "✦"}</div>
    <div>
      <strong>${product.name}</strong>
      <span>${categoryName}</span>
      <h3>${formatRupiah(product.price)}</h3>
    </div>
  `;

  const playerFields = document.getElementById("playerFields");
  playerFields.classList.toggle("hidden", product.requiresPlayer === false);

  document.getElementById("playerId").value = "";
  document.getElementById("serverId").value = "";
  document.getElementById("buyerName").value = "";

  document.getElementById("orderModal").classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function closeOrder() {
  document.getElementById("orderModal").classList.add("hidden");
  document.body.classList.remove("modal-open");
}

function submitOrder() {
  if (!selectedOrder) return;

  const buyerName = document.getElementById("buyerName").value.trim();
  const playerId = document.getElementById("playerId").value.trim();
  const serverId = document.getElementById("serverId").value.trim();

  if (!buyerName) {
    alert("Masukkan nama pembeli terlebih dahulu!");
    return;
  }

  if (selectedOrder.requiresPlayer !== false && !playerId) {
    alert("Masukkan User ID / Player ID terlebih dahulu!");
    return;
  }

  if (!/^62\d{8,15}$/.test(WHATSAPP_NUMBER)) {
    alert("Nomor WhatsApp admin belum diatur. Silakan edit WHATSAPP_NUMBER di script.js");
    return;
  }

  let message = `Halo Admin! Saya ingin memesan produk.%0A%0A`;
  message += `*DETAIL PESANAN*%0A`;
  message += `Produk: ${encodeURIComponent(selectedOrder.name)}%0A`;
  message += `Kategori: ${encodeURIComponent(selectedOrder.categoryName)}%0A`;
  message += `Harga: ${encodeURIComponent(formatRupiah(selectedOrder.price))}%0A`;
  message += `Nama Pembeli: ${encodeURIComponent(buyerName)}%0A`;

  if (selectedOrder.requiresPlayer !== false) {
    message += `User ID: ${encodeURIComponent(playerId)}%0A`;

    if (serverId) {
      message += `Server ID: ${encodeURIComponent(serverId)}%0A`;
    }
  }

  message += `%0AMohon diproses. Terima kasih!`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  window.open(url, "_blank");
  closeOrder();
}

// ======================================
// MULAI KATALOG
// ======================================

renderHome();
