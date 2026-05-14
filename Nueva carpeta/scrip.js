// ============================================
//   LA BAHÍA MARISQUERÍA - SCRIPT
// ============================================

// --------- BASE DE PRODUCTOS ---------
const products = [
    {
        id: 1, name: 'Camarón Mediano', category: 'camarones',
        desc: 'Ideal para cócteles, ceviches y arroces. Carne jugosa y sabor intenso.',
        price: 180.00, unit: 'kg', emoji: '🦐', badge: 'Popular', featured: true
    },
    {
        id: 2, name: 'Pulpo Baby', category: 'pulpo',
        desc: 'Tierno y listo para la brasa o al ajillo. Textura incomparable.',
        price: 250.00, unit: 'kg', emoji: '🐙', badge: 'Especial', featured: true
    },
    {
        id: 3, name: 'Filete de Robalo', category: 'pescado',
        desc: 'Corte premium sin espinas. Ideal a la plancha o al horno.',
        price: 220.00, unit: 'kg', emoji: '🐟', badge: 'Premium', featured: true
    },
    {
        id: 4, name: 'Cangrejo Moro', category: 'cangrejo',
        desc: 'Pinzas grandes con mucha carne blanca. Sabor a mar puro.',
        price: 350.00, unit: 'kg', emoji: '🦀', badge: 'Deluxe', featured: true
    },
    {
        id: 5, name: 'Camarón Grande', category: 'camarones',
        desc: 'El rey de los mariscos. Para parrilla y presentaciones especiales.',
        price: 280.00, unit: 'kg', emoji: '🦐', badge: null, featured: false
    },
    {
        id: 6, name: 'Filete de Trucha', category: 'pescado',
        desc: 'Fresca del día, perfecta al limón o en sopas.',
        price: 190.00, unit: 'kg', emoji: '🐠', badge: null, featured: false
    },
    {
        id: 7, name: 'Calamar Entero', category: 'calamar',
        desc: 'Para rellenar, freír o a la parrilla. Limpio y listo.',
        price: 200.00, unit: 'kg', emoji: '🦑', badge: 'Nuevo', featured: false
    },
    {
        id: 8, name: 'Ostras Frescas', category: 'mariscos',
        desc: 'Cosechadas del día, servidas en su concha. Sabor puro de mar.',
        price: 320.00, unit: 'docena', emoji: '🦪', badge: 'Gourmet', featured: false
    }
];

// --------- COMBOS ---------
const combos = [
    {
        emoji: '🎉',
        title: 'Combo Mar Completo',
        desc: 'El paquete perfecto para una cena familiar con todo el sabor del mar.',
        items: ['1 kg Camarón Mediano', '1 kg Filete de Robalo', '500g Pulpo Baby'],
        price: 560.00, originalPrice: 650.00, save: '90'
    },
    {
        emoji: '🦐',
        title: 'Pack Camaronero',
        desc: 'Para los amantes del camarón. Variedad y cantidad garantizada.',
        items: ['1 kg Camarón Grande', '1 kg Camarón Mediano'],
        price: 420.00, originalPrice: 460.00, save: '40'
    },
    {
        emoji: '🌊',
        title: 'Selección Gourmet',
        desc: 'Una experiencia premium para ocasiones especiales.',
        items: ['1 kg Cangrejo Moro', '1 docena Ostras Frescas', '500g Calamar'],
        price: 750.00, originalPrice: 870.00, save: '120'
    }
];

// --------- CARRITO ---------
let cart = [];
let currentFilter = 'todos';
let toastTimer = null;

// --------- NAVEGACIÓN ---------
document.addEventListener('DOMContentLoaded', () => {
    renderFeatured();
    renderCombos();

    // Nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const sec = btn.getAttribute('data-section');
            showSection(sec);
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Close mobile nav
            document.getElementById('mainNav').classList.remove('open');
        });
    });

    // Hamburger
    document.getElementById('hamburger').addEventListener('click', () => {
        document.getElementById('mainNav').classList.toggle('open');
    });

    // Scroll header
    window.addEventListener('scroll', () => {
        const header = document.getElementById('mainHeader');
        header.classList.toggle('scrolled', window.scrollY > 30);
    });

    // Checkout
    document.getElementById('checkoutBtn').addEventListener('click', sendWhatsApp);

    // Clear cart
    document.getElementById('clearCartBtn').addEventListener('click', () => {
        if (cart.length === 0) return;
        cart = [];
        updateCartBadge();
        renderCart();
        showToast('🗑️', '¡Carrito vaciado!', 'Puedes seguir explorando');
    });
});

function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');

    if (id === 'products') renderProducts();
    if (id === 'cart')     renderCart();

    // Sync nav button highlight
    document.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-section') === id);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --------- RENDER FEATURED ---------
function renderFeatured() {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;
    const featured = products.filter(p => p.featured);
    grid.innerHTML = featured.map(p => productCardHTML(p)).join('');
}

// --------- RENDER PRODUCTS ---------
function renderProducts() {
    // Filter bar
    const filterBar = document.getElementById('filterBar');
    const categories = ['todos', ...new Set(products.map(p => p.category))];
    filterBar.innerHTML = categories.map(cat =>
        `<button class="filter-btn ${currentFilter === cat ? 'active' : ''}" onclick="filterProducts('${cat}')">
            ${cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>`
    ).join('');

    // Products
    const list = document.getElementById('productsList');
    const filtered = currentFilter === 'todos'
        ? products
        : products.filter(p => p.category === currentFilter);

    list.innerHTML = filtered.map(p => productCardHTML(p)).join('');
}

function filterProducts(cat) {
    currentFilter = cat;
    renderProducts();
}

function productCardHTML(p) {
    return `
        <div class="product-card">
            <div class="product-img-wrap">
                <div class="product-emoji">${p.emoji}</div>
                ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${p.category}</div>
                <div class="product-name">${p.name}</div>
                <div class="product-desc">${p.desc}</div>
                <div class="product-footer">
                    <div>
                        <div class="product-price">Bs. ${p.price.toFixed(2)}</div>
                        <small>por ${p.unit}</small>
                    </div>
                    <button class="btn-add" onclick="addToCart(${p.id})">+ Añadir</button>
                </div>
            </div>
        </div>
    `;
}

// --------- RENDER COMBOS ---------
function renderCombos() {
    const grid = document.getElementById('combosGrid');
    if (!grid) return;
    grid.innerHTML = combos.map(c => `
        <div class="combo-card">
            <span class="combo-emoji">${c.emoji}</span>
            <div class="combo-title">${c.title}</div>
            <div class="combo-desc">${c.desc}</div>
            <ul class="combo-items">
                ${c.items.map(i => `<li>${i}</li>`).join('')}
            </ul>
            <div>
                <span class="combo-price">Bs. ${c.price.toFixed(2)}</span>
                <span class="combo-save">¡Ahorras Bs. ${c.save}!</span>
            </div>
            <br><br>
            <a href="https://wa.me/59167823905?text=${encodeURIComponent(`Hola La Bahía, me interesa el ${c.title} por Bs. ${c.price.toFixed(2)}`)}" 
               target="_blank" class="btn-primary" style="text-decoration:none;display:inline-block;padding:12px 24px;border-radius:30px;font-weight:700;font-size:14px;">
               💬 Consultar combo
            </a>
        </div>
    `).join('');
}

// --------- CARRITO ---------
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(i => i.id === id);

    if (existing) {
        existing.quantity++;
        showToast(product.emoji, `¡Uno más de ${product.name}!`, `Ahora tienes ${existing.quantity} en tu carrito`);
    } else {
        cart.push({ ...product, quantity: 1 });
        showToast(product.emoji, `¡${product.name} añadido!`, 'Listo para tu pedido');
    }

    updateCartBadge();

    // Animate badge
    const badge = document.getElementById('cartCount');
    badge.classList.remove('bump');
    void badge.offsetWidth; // reflow
    badge.classList.add('bump');
}

function updateCartBadge() {
    const total = cart.reduce((acc, i) => acc + i.quantity, 0);
    document.getElementById('cartCount').textContent = total;
}

function renderCart() {
    const content = document.getElementById('cartContent');
    const empty   = document.getElementById('emptyCart');
    const tbody   = document.getElementById('cartItems');
    const summary = document.getElementById('summaryRows');

    if (cart.length === 0) {
        content.style.display = 'none';
        empty.style.display = 'block';
        return;
    }

    content.style.display = 'block';
    empty.style.display = 'none';

    let total = 0;
    tbody.innerHTML = '';
    summary.innerHTML = '';

    cart.forEach((item, idx) => {
        const sub = item.price * item.quantity;
        total += sub;

        tbody.innerHTML += `
            <tr>
                <td><strong>${item.emoji} ${item.name}</strong></td>
                <td>Bs. ${item.price.toFixed(2)}</td>
                <td>
                    <input type="number" class="cart-qty" value="${item.quantity}" min="1" max="99"
                        onchange="updateQty(${idx}, this.value)">
                </td>
                <td><strong>Bs. ${sub.toFixed(2)}</strong></td>
                <td>
                    <button class="btn-remove" onclick="removeItem(${idx})" title="Eliminar">✕</button>
                </td>
            </tr>
        `;

        summary.innerHTML += `
            <div class="summary-row">
                <span>${item.emoji} ${item.name} x${item.quantity}</span>
                <span>Bs. ${sub.toFixed(2)}</span>
            </div>
        `;
    });

    document.getElementById('cartTotal').textContent = `Bs. ${total.toFixed(2)}`;
}

function updateQty(idx, val) {
    const qty = parseInt(val);
    if (qty < 1 || isNaN(qty)) return;
    cart[idx].quantity = qty;
    updateCartBadge();
    renderCart();
}

function removeItem(idx) {
    const name = cart[idx].name;
    cart.splice(idx, 1);
    updateCartBadge();
    renderCart();
    showToast('🗑️', `${name} eliminado`, 'Tu carrito fue actualizado');
}

// --------- WHATSAPP CHECKOUT ---------
function sendWhatsApp() {
    if (cart.length === 0) return;

    let msg = '🌊 *Pedido - La Bahía Marisquería* 🌊\n';
    msg += '──────────────────────\n';
    cart.forEach(item => {
        msg += `• ${item.quantity}x ${item.name}: *Bs. ${(item.price * item.quantity).toFixed(2)}*\n`;
    });
    const total = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    msg += '──────────────────────\n';
    msg += `🏷️ *Total: Bs. ${total.toFixed(2)}*\n\n`;
    msg += 'Por favor confirmame disponibilidad. ¡Gracias! ⚓';

    window.open(`https://wa.me/59167823905?text=${encodeURIComponent(msg)}`, '_blank');
}

// --------- TOAST ---------
function showToast(emoji, title, message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastEmoji').textContent  = emoji;
    document.getElementById('toastTitle').textContent  = title;
    document.getElementById('toastMsg').textContent    = message;

    // Reset animation
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

function closeToast() {
    document.getElementById('toast').classList.remove('show');
    if (toastTimer) clearTimeout(toastTimer);
}
