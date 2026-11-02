
// ======================================
// EDIT PRODUK DI FILE INI
// Harga pakai angka rupiah tanpa titik/koma.
// ======================================

const CATEGORIES = [
  {
    id: "game-topup",
    name: "Top Up Game",
    emoji: "🎮",
    description: "Top up game favorit kamu.",
    type: "games",
    games: [
      {
        id: "mobile-legends",
        name: "Mobile Legends",
        emoji: "💎",
        description: "Mobile Legends Bang Bang",
        products: [
          { id: "ml-86", name: "86 Diamonds", price: 20000, stock: 20 },
          { id: "ml-172", name: "172 Diamonds", price: 39000, stock: 20 },
          { id: "ml-257", name: "257 Diamonds", price: 58000, stock: 20 },
          { id: "ml-344", name: "344 Diamonds", price: 77000, stock: 20 },
          { id: "ml-429", name: "429 Diamonds", price: 96000, stock: 20 },
          { id: "ml-514", name: "514 Diamonds", price: 115000, stock: 20 },
          { id: "ml-706", name: "706 Diamonds", price: 155000, stock: 20 },
          { id: "ml-1050", name: "1050 Diamonds", price: 230000, stock: 20 }
        ]
      },
      {
        id: "free-fire",
        name: "Free Fire",
        emoji: "🔥",
        description: "Garena Free Fire",
        products: [
          { id: "ff-70", name: "70 Diamonds", price: 10000, stock: 20 },
          { id: "ff-140", name: "140 Diamonds", price: 20000, stock: 20 },
          { id: "ff-355", name: "355 Diamonds", price: 50000, stock: 20 },
          { id: "ff-720", name: "720 Diamonds", price: 95000, stock: 20 },
          { id: "ff-1450", name: "1450 Diamonds", price: 190000, stock: 20 }
        ]
      },
      {
        id: "pubg-mobile",
        name: "PUBG Mobile",
        emoji: "🔫",
        description: "PUBG Mobile UC",
        products: [
          { id: "pubg-60", name: "60 UC", price: 15000, stock: 20 },
          { id: "pubg-325", name: "325 UC", price: 75000, stock: 20 },
          { id: "pubg-660", name: "660 UC", price: 145000, stock: 20 },
          { id: "pubg-1800", name: "1800 UC", price: 370000, stock: 20 }
        ]
      },
      {
        id: "genshin",
        name: "Genshin Impact",
        emoji: "🌟",
        description: "Genesis Crystal",
        products: [
          { id: "gi-60", name: "60 Genesis Crystal", price: 15000, stock: 20 },
          { id: "gi-300", name: "300 Genesis Crystal", price: 75000, stock: 20 },
          { id: "gi-980", name: "980 Genesis Crystal", price: 230000, stock: 20 }
        ]
      },
      {
        id: "valorant",
        name: "Valorant",
        emoji: "🎯",
        description: "Valorant Points",
        products: [
          { id: "valo-125", name: "125 VP", price: 15000, stock: 20 },
          { id: "valo-420", name: "420 VP", price: 50000, stock: 20 },
          { id: "valo-700", name: "700 VP", price: 80000, stock: 20 }
        ]
      }
    ]
  },

  {
    id: "premium",
    name: "Premium Digital",
    emoji: "⭐",
    description: "Nikmati layanan premium digital.",
    type: "products",
    products: [
      { id: "netflix", name: "Netflix Premium", price: 35000, stock: 10, duration: "1 Bulan", emoji: "🎬", requiresPlayer: false },
      { id: "spotify", name: "Spotify Premium", price: 25000, stock: 10, duration: "1 Bulan", emoji: "🎵", requiresPlayer: false },
      { id: "youtube", name: "YouTube Premium", price: 30000, stock: 10, duration: "1 Bulan", emoji: "▶️", requiresPlayer: false },
      { id: "canva", name: "Canva Pro", price: 20000, stock: 10, duration: "1 Bulan", emoji: "🎨", requiresPlayer: false },
      { id: "chatgpt", name: "ChatGPT Premium", price: 50000, stock: 10, duration: "1 Bulan", emoji: "🤖", requiresPlayer: false }
    ]
  },

  {
    id: "voucher",
    name: "Voucher & Gift Card",
    emoji: "🎁",
    description: "Voucher dan gift card digital.",
    type: "products",
    products: [
      { id: "google-play-50", name: "Google Play Gift Card", price: 50000, stock: 15, emoji: "🎁", requiresPlayer: false },
      { id: "steam-50", name: "Steam Wallet", price: 50000, stock: 15, emoji: "🎮", requiresPlayer: false }
    ]
  },

  {
    id: "game-item",
    name: "Akun / Item Game",
    emoji: "◈",
    description: "Akun dan item game digital.",
    type: "products",
    products: [
      { id: "game-item", name: "Item Game", price: 40000, stock: 5, emoji: "◈", requiresPlayer: false }
    ]
  }
];

// Catatan:
// Harga di atas hanya contoh. Sesuaikan dengan harga jual toko kamu.
// Stok 0 = produk habis.
// Untuk menambahkan produk game, tambahkan object ke games/products.
