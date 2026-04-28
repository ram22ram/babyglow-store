// Real-world Products Data with INR Currency and Offers
const PRODUCTS = [
  {
    id: '1',
    name: 'Premium Care Diapers - Size 1 (80 count)',
    category: 'diapers',
    price: 1299,
    oldPrice: 1599,
    discount: '18% OFF',
    image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=800',
    description: 'Pampers Premium Care diapers are softest comfort and best skin protection. These diapers are made with a heart-shaped hole layer that pulls wetness and mess away from baby\'s skin to keep them comfortable.'
  },
  {
    id: '2',
    name: 'Organic Cotton Baby Onesie - Pack of 3',
    category: 'clothing',
    price: 899,
    oldPrice: 1249,
    discount: '28% OFF',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
    description: 'Made from 100% organic cotton, these onesies are gentle on your baby\'s skin. The breathable fabric ensures maximum comfort throughout the day.'
  },
  {
    id: '3',
    name: 'Educational Wooden Stacking Blocks',
    category: 'toys',
    price: 599,
    oldPrice: 999,
    discount: '40% OFF',
    image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&q=80&w=800',
    description: 'Encourage your child\'s creativity and motor skills with these vibrant, non-toxic wooden blocks. Perfect for early development and hours of fun.'
  },
  {
    id: '4',
    name: 'Anti-Colic Baby Bottle (250ml)',
    category: 'feeding',
    price: 449,
    oldPrice: 599,
    discount: '25% OFF',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=800',
    description: 'Designed to reduce colic, gas, and reflux. The silicone nipple mimics breastfeeding for an easy transition between breast and bottle.'
  },
  {
    id: '5',
    name: 'Soft Plush Elephant Toy',
    category: 'toys',
    price: 349,
    oldPrice: 499,
    discount: '30% OFF',
    image: 'https://images.unsplash.com/photo-1559440666-4477c2826695?auto=format&fit=crop&q=80&w=800',
    description: 'Ultra-soft plush toy for your baby to snuggle with. Made from high-quality, baby-safe materials.',
    isOffer: true
  },
  {
    id: '6',
    name: 'Baby Grooming Kit - 10 Pieces',
    category: 'bath',
    price: 799,
    oldPrice: 1199,
    discount: '33% OFF',
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=800',
    description: 'Complete grooming set including hairbrush, nail clippers, and more. Essential for every new parent.',
    isOffer: true
  },
  {
    id: '7',
    name: 'Organic Bamboo Baby Towel Set',
    category: 'bath',
    price: 649,
    oldPrice: 899,
    discount: '28% OFF',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800',
    description: 'Ultra-absorbent and soft bamboo towels, perfect for your baby\'s sensitive skin after bath time. Antibacterial and eco-friendly.',
    isOffer: true
  }
];

// Sticky Header Logic
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
  if (header) {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const navActions = document.getElementById('nav-actions');

if (menuToggle && navActions) {
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navActions.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    navActions.classList.remove('active');
  });

  navActions.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// Basic Cart Logic
let cart = JSON.parse(localStorage.getItem('babyglow_cart')) || [];

function updateCartCount() {
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems > 99 ? '99+' : totalItems;
  }
}

function saveCart() {
  localStorage.setItem('babyglow_cart', JSON.stringify(cart));
}

function addToCart(id, name, price, image, qty = 1) {
  const currentTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (currentTotalItems + qty > 100) {
    alert('Maximum order limit reached (100 items).');
    return;
  }

  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    cart.push({ id, name, price, image, quantity: qty });
  }

  saveCart();
  updateCartCount();

  // Requirement: "Add" -> "Added" -> Quantity control
  const containers = document.querySelectorAll(`[data-product-id="${id}"]`);
  containers.forEach(container => {
    container.innerHTML = `
      <button class="cart-btn added" style="background-color: #25D366; border-color: #25D366;">
        <i data-lucide="check"></i><span>Added</span>
      </button>
    `;
    lucide.createIcons();
  });

  setTimeout(() => {
    updateProductButtons(id);
  }, 800);

  const cartLink = document.querySelector('.nav-item[href="cart.html"]');
  if (cartLink) {
    cartLink.style.transform = 'scale(1.2)';
    setTimeout(() => cartLink.style.transform = 'scale(1)', 200);
  }
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartCount();
  updateProductButtons(id);
  if (typeof renderCart === 'function') renderCart();
}

function updateQuantity(id, change) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity += change;
    if (item.quantity > 99) item.quantity = 99;

    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      saveCart();
      updateCartCount();
      updateProductButtons(id);
      if (typeof renderCart === 'function') renderCart();
    }
  } else if (change > 0) {
    const product = PRODUCTS.find(p => p.id === id);
    if (product) addToCart(product.id, product.name, product.price, product.image, 1);
  }
}

// Update Add to Cart buttons to Quantity controls
function updateProductButtons(productId) {
  const containers = document.querySelectorAll(`[data-product-id="${productId}"]`);
  const cartItem = cart.find(item => item.id === productId);

  containers.forEach(container => {
    if (cartItem) {
      container.innerHTML = `
        <div class="quantity-control">
          <button class="qty-btn" onclick="updateQuantity('${productId}', -1)">-</button>
          <span class="qty-val">${cartItem.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity('${productId}', 1)">+</button>
        </div>
      `;
    } else {
      const product = PRODUCTS.find(p => p.id === productId);
      if (product) {
        container.innerHTML = `
          <button class="cart-btn" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}')">
            <i data-lucide="shopping-cart"></i><span>Add</span>
          </button>
        `;
        lucide.createIcons();
      }
    }
  });
}

function renderCart() {
  const itemsContainer = document.getElementById('cart-items-container');
  const emptyContainer = document.getElementById('cart-empty-container');
  const mainCartContainer = document.getElementById('main-cart-container');
  const totalPriceElement = document.getElementById('cart-total-price');
  const subtotalPriceElement = document.getElementById('cart-subtotal-price');
  const cartTitleCount = document.getElementById('cart-title-count');

  if (!itemsContainer) return;

  if (cart.length === 0) {
    if (emptyContainer) emptyContainer.style.display = 'flex';
    if (mainCartContainer) mainCartContainer.style.display = 'none';
    return;
  }

  if (emptyContainer) emptyContainer.style.display = 'none';
  if (mainCartContainer) mainCartContainer.style.display = 'block';

  itemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-info">
        <span class="cart-item-category">Product</span>
        <a href="product.html?id=${item.id}">
          <h3 class="cart-item-name">${item.name}</h3>
        </a>
        <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
      </div>
      <div class="cart-item-actions">
        <div class="cart-item-quantity">
          <button onclick="updateQuantity('${item.id}', -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity('${item.id}', 1)">+</button>
        </div>
        <button class="cart-item-remove-btn" onclick="removeFromCart('${item.id}')">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
      <div class="cart-item-subtotal">
        ₹${(item.price * item.quantity).toLocaleString('en-IN')}
      </div>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (totalPriceElement) totalPriceElement.textContent = `₹${total.toLocaleString('en-IN')}`;
  if (subtotalPriceElement) subtotalPriceElement.textContent = `₹${total.toLocaleString('en-IN')}`;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartTitleCount) cartTitleCount.textContent = `(${totalItems} item${totalItems !== 1 ? 's' : ''})`;

  lucide.createIcons();
}

function showCheckoutForm() {
  if (cart.length === 0) return;
  const actions = document.getElementById('checkout-summary-actions');
  const form = document.getElementById('checkout-form-container');
  if (actions && form) {
    actions.style.display = 'none';
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function hideCheckoutForm() {
  const actions = document.getElementById('checkout-summary-actions');
  const form = document.getElementById('checkout-form-container');
  if (actions && form) {
    actions.style.display = 'block';
    form.style.display = 'none';
  }
}

function placeOrder() {
  const nameInput = document.getElementById('cust-name');
  const phoneInput = document.getElementById('cust-phone');
  const addressInput = document.getElementById('cust-address');

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const address = addressInput.value.trim();

  if (!name || !phone || !address) {
    alert('Please provide your name, phone number, and delivery address.');
    if (!name) nameInput.style.borderColor = 'red';
    if (!phone) phoneInput.style.borderColor = 'red';
    if (!address) addressInput.style.borderColor = 'red';
    return;
  }

  const orderId = 'BG-' + Math.random().toString(36).substr(2, 6).toUpperCase();

  let message = `*NEW ORDER: #${orderId}*\n\n`;
  message += `*Customer Details:*\n`;
  message += `Name: ${name}\n`;
  message += `Phone: ${phone}\n`;
  message += `Address: ${address}\n\n`;

  message += `*Items Ordered:*\n`;
  cart.forEach((item, index) => {
    const itemName = item.name.length > 50 ? item.name.substring(0, 47) + '...' : item.name;
    message += `${index + 1}. ${itemName}\n   Qty: ${item.quantity} | Price: ₹${(item.price * item.quantity).toLocaleString('en-IN')}\n`;
  });

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  message += `\n*TOTAL PAYABLE: ₹${total.toLocaleString('en-IN')}*\n\n`;
  message += `Please confirm the order. Thank you!`;

  const businessPhone = '919406761020';
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${businessPhone}?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');

  cart = [];
  saveCart();
  window.location.href = 'index.html';
}

function handleSearch() {
  const searchInput = document.querySelector('.search-input');
  if (searchInput && searchInput.value) {
    const query = searchInput.value.trim().toLowerCase();
    window.location.href = `category.html?search=${encodeURIComponent(query)}`;
  }
}

// Product Card HTML generator
function createProductCard(product) {
  const cartItem = cart.find(item => item.id === product.id);
  const buttonHTML = cartItem ? `
    <div class="quantity-control">
      <button class="qty-btn" onclick="updateQuantity('${product.id}', -1)">-</button>
      <span class="qty-val">${cartItem.quantity}</span>
      <button class="qty-btn" onclick="updateQuantity('${product.id}', 1)">+</button>
    </div>
  ` : `
    <button class="cart-btn" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}')">
      <i data-lucide="shopping-cart"></i><span>Add</span>
    </button>
  `;

  return `
    <div class="product-card">
      <div class="product-image-wrapper">
        <img src="${product.image}" alt="${product.name}">
        ${product.discount ? `<span class="discount-badge">${product.discount}</span>` : ''}
      </div>
      <div class="product-content">
        <span class="product-category">${product.category}</span>
        <a href="product.html?id=${product.id}"><h3 class="product-name">${product.name}</h3></a>
        <div class="product-rating">
          <i data-lucide="star" style="fill:#FFD700;color:#FFD700;width:14px;height:14px;"></i>
          <span>(4.5)</span>
        </div>
        <div class="product-footer">
          <div class="price-container">
            <span class="product-price">₹${product.price.toLocaleString('en-IN')}</span>
            ${product.oldPrice ? `<span class="old-price">₹${product.oldPrice.toLocaleString('en-IN')}</span>` : ''}
          </div>
          <div class="product-action-container" data-product-id="${product.id}">
            ${buttonHTML}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Track Order redirect
function trackOrder() {
  const message = encodeURIComponent("Hello BabyGlow, I would like to track my order. Please share the status.");
  window.open(`https://wa.me/91919406761020?text=${message}`, '_blank');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  if (document.getElementById('cart-items-container')) {
    renderCart();
  }

  const searchBtn = document.querySelector('.search-button');
  if (searchBtn) searchBtn.addEventListener('click', handleSearch);

  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }

  // Update track order links
  document.querySelectorAll('a[href="#"]').forEach(link => {
    if (link.textContent.trim() === 'Track Order') {
      link.href = 'javascript:void(0)';
      link.addEventListener('click', trackOrder);
    }
  });
});
