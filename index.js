const products = [
  { id:1, name:"பாஸ்மதி அரிசி 5கிலோ", category:"grocery", price:399, original:499, emoji:"🌾", rating:4.5, reviews:128, badge:"சேவ்" },
  { id:2, name:"தேங்காய் எண்ணெய் 1லிட்டர்", category:"grocery", price:189, original:220, emoji:"🥥", rating:4.3, reviews:87, badge:"" },
  { id:3, name:"ஆர்கானிக் சர்க்கரை 1கிலோ", category:"grocery", price:79, original:99, emoji:"🍬", rating:4.6, reviews:203, badge:"New", badgeType:"new" },
  { id:4, name:"பருத்தி சேலை (Cotton Saree)", category:"clothing", price:899, original:1299, emoji:"👗", rating:4.7, reviews:342, badge:"Hot", badgeType:"hot" },
  { id:5, name:"ஆண்கள் டி-ஷர்ட்", category:"clothing", price:299, original:449, emoji:"👕", rating:4.4, reviews:156, badge:"" },
  { id:6, name:"குழந்தை உடை தொகுப்பு", category:"clothing", price:599, original:799, emoji:"🧒", rating:4.8, reviews:89, badge:"New", badgeType:"new" },
  { id:7, name:"Smartphone 4G (64GB)", category:"electronics", price:7999, original:9999, emoji:"📱", rating:4.5, reviews:567, badge:"Hot", badgeType:"hot" },
  { id:8, name:"Bluetooth Earphones", category:"electronics", price:499, original:999, emoji:"🎧", rating:4.3, reviews:234, badge:"50% Off" },
  { id:9, name:"LED Table Lamp", category:"electronics", price:349, original:499, emoji:"💡", rating:4.2, reviews:112, badge:"" },
  { id:10, name:"அழுத்தகுக்கர் 3லிட்டர்", category:"kitchen", price:799, original:1199, emoji:"🍲", rating:4.7, reviews:445, badge:"Best" },
  { id:11, name:"நான்-ஸ்டிக் தவா", category:"kitchen", price:449, original:599, emoji:"🍳", rating:4.5, reviews:198, badge:"" },
  { id:12, name:"மிக்சர் கிரைண்டர்", category:"kitchen", price:1999, original:2999, emoji:"🌀", rating:4.6, reviews:312, badge:"Hot", badgeType:"hot" },
  { id:13, name:"Face Cream SPF 30", category:"beauty", price:249, original:399, emoji:"🧴", rating:4.4, reviews:276, badge:"New", badgeType:"new" },
  { id:14, name:"Hair Oil 200ml", category:"beauty", price:129, original:179, emoji:"💆", rating:4.3, reviews:189, badge:"" },
  { id:15, name:"Teddy Bear 30cm", category:"toys", price:299, original:399, emoji:"🧸", rating:4.8, reviews:421, badge:"Cute" },
  { id:16, name:"Building Blocks Set", category:"toys", price:549, original:699, emoji:"🎮", rating:4.6, reviews:167, badge:"New", badgeType:"new" },
];

let cart = [];
let filteredProducts = [...products];

function renderProducts(prods) {
  const grid = document.getElementById('productsGrid');
  if (prods.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--muted)">
      <div style="font-size:48px;margin-bottom:12px">🔍</div>
      <div style="font-size:18px">பொருட்கள் கிடைக்கவில்லை</div>
    </div>`;
    return;
  }
  grid.innerHTML = prods.map(p => {
    const discPct = Math.round((1 - p.price/p.original)*100);
    const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating%1 ? '☆' : '');
    const badgeHTML = p.badge ? `<span class="badge ${p.badgeType||''}">${p.badge}</span>` : '';
    return `
    <div class="product-card" id="card-${p.id}">
      <div class="product-img">
        ${badgeHTML}
        <button class="wishlist-btn" onclick="toggleWish(this)" title="Wishlist">🤍</button>
        <span style="font-size:64px">${p.emoji}</span>
      </div>
      <div class="product-info">
        <div class="product-category">${getCatLabel(p.category)}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          <span class="stars">${stars}</span>
          <span>${p.rating}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="product-price">
          <span class="price-current">₹${p.price.toLocaleString()}</span>
          <span class="price-original">₹${p.original.toLocaleString()}</span>
          <span class="discount">↓${discPct}%</span>
        </div>
        <button class="add-cart-btn" id="btn-${p.id}" onclick="addToCart(${p.id})">
          🛒 கார்டில் சேர்
        </button>
      </div>
    </div>`;
  }).join('');
}

function getCatLabel(c) {
  const map = {grocery:'🛒 மளிகை', clothing:'👗 ஆடை', electronics:'📱 Electronics', kitchen:'🍳 சமையலறை', beauty:'💄 அழகு', toys:'🧸 பொம்மை'};
  return map[c] || c;
}

function filterByCategory(cat) {
  document.querySelectorAll('.cat-pill, .nav-links a').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.cat-pill').forEach(el => {
    if (el.textContent.toLowerCase().includes(cat === 'all' ? 'அனைத்தும்' : cat)) el.classList.add('active');
    if (cat === 'all') el.classList[el.textContent.includes('அனைத்தும்') ? 'add' : 'remove']('active');
  });
  filteredProducts = cat === 'all' ? [...products] : products.filter(p => p.category === cat);
  renderProducts(filteredProducts);
}

function filterProducts() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const res = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  renderProducts(res);
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({...product, qty: 1});
  }
  updateCartUI();
  const btn = document.getElementById('btn-'+id);
  btn.textContent = '✅ சேர்க்கப்பட்டது!';
  btn.classList.add('added');
  setTimeout(() => {
    btn.innerHTML = '🛒 கார்டில் சேர்';
    btn.classList.remove('added');
  }, 1500);
  showToast(`✅ ${product.name} கார்டில் சேர்க்கப்பட்டது!`);
}

function toggleWish(btn) {
  btn.textContent = btn.textContent === '🤍' ? '❤️' : '🤍';
}

function updateCartUI() {
  const count = cart.reduce((a,b) => a+b.qty, 0);
  document.getElementById('cartCount').textContent = count;

  const itemsDiv = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');

  if (cart.length === 0) {
    itemsDiv.innerHTML = `<div class="cart-empty"><span class="empty-icon">🛒</span><span>கார்ட் காலியாக உள்ளது</span><span style="font-size:13px;color:#bbb">பொருட்களை சேர்க்கவும்</span></div>`;
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  itemsDiv.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeItem(${item.id})">🗑️</button>
    </div>
  `).join('');

  const subtotal = cart.reduce((a,b) => a + b.price*b.qty, 0);
  const delivery = subtotal >= 499 ? 0 : 49;
  const discount = subtotal >= 499 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + delivery - discount;

  document.getElementById('subtotal').textContent = '₹' + subtotal.toLocaleString();
  document.getElementById('delivery').textContent = delivery === 0 ? 'இலவசம்! 🎉' : '₹49';
  document.getElementById('discount').textContent = '-₹' + discount.toLocaleString();
  document.getElementById('total').textContent = '₹' + total.toLocaleString();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeItem(id);
  else updateCartUI();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
}

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

function openCheckout() {
  toggleCart();
  document.getElementById('checkoutModal').classList.add('open');
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('open');
}

function selectPayment(el) {
  document.querySelectorAll('.pay-method').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
}

function placeOrder() {
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();

  if (!name || !phone || !address) {
    showToast('⚠️ அனைத்து விவரங்களையும் நிரப்பவும்!');
    return;
  }

  const orderNum = '#' + Math.floor(100000 + Math.random() * 900000);
  document.getElementById('orderNum').textContent = orderNum;
  closeCheckout();
  document.getElementById('successModal').classList.add('open');
  cart = [];
  updateCartUI();
}

function closeSuccess() {
  document.getElementById('successModal').classList.remove('open');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Init
renderProducts(products);