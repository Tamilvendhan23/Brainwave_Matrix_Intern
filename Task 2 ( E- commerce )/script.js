// Product data
const products = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        price: 999.99,
        description: "Latest iPhone with titanium design and A17 Pro chip",
        emoji: "📱"
    },
    {
        id: 2,
        name: "MacBook Pro M3",
        price: 1999.99,
        description: "Powerful laptop with M3 chip for professional work",
        emoji: "💻"
    },
    {
        id: 3,
        name: "AirPods Pro",
        price: 249.99,
        description: "Premium wireless earbuds with active noise cancellation",
        emoji: "🎧"
    },
    {
        id: 4,
        name: "iPad Air",
        price: 599.99,
        description: "Versatile tablet perfect for work and entertainment",
        emoji: "📱"
    },
    {
        id: 5,
        name: "Apple Watch Series 9",
        price: 399.99,
        description: "Advanced smartwatch with health monitoring features",
        emoji: "⌚"
    },
    {
        id: 6,
        name: "iMac 24-inch",
        price: 1299.99,
        description: "All-in-one desktop computer with stunning display",
        emoji: "🖥️"
    }
];

// Cart state
let cart = [];
let isCheckoutVisible = false;

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();
});

// Initialize the app
function init() {
    loadProducts();
    updateCartCount();
    setupEventListeners();
}

// Load products into the grid
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.emoji}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Scroll to products section
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    showAddToCartAnimation();
    showNotification(`${product.name} added to cart!`);
}

// Show notification
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Show add to cart animation
function showAddToCartAnimation() {
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Toggle cart modal
function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    } else {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        loadCartItems();
    }
}

// Load cart items
function loadCartItems() {
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
            </div>
        `;
        document.getElementById('cartTotal').style.display = 'none';
        document.querySelector('.checkout-btn').style.display = 'none';
        return;
    }

    document.getElementById('cartTotal').style.display = 'block';
    document.querySelector('.checkout-btn').style.display = 'block';
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div>
                <div style="font-weight: bold; margin-bottom: 10px;">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
    
    updateCartTotal();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            loadCartItems();
        }
    }
}

// Remove from cart
function removeFromCart(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        showNotification(`${item.name} removed from cart!`);
    }
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    loadCartItems();
}

// Update cart total

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = `Total: $${total.toFixed(2)}`;
}

// Show checkout form
function showCheckout() {
    const checkoutForm = document.getElementById('checkoutForm');
    const cartItems = document.getElementById('cartItems');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (isCheckoutVisible) {
        checkoutForm.style.display = 'none';
        cartItems.style.display = 'block';
        checkoutBtn.textContent = 'Proceed to Checkout';
        isCheckoutVisible = false;
    } else {
        checkoutForm.style.display = 'block';
        cartItems.style.display = 'none';
        checkoutBtn.textContent = 'Back to Cart';
        isCheckoutVisible = true;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processOrder();
        });
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                toggleCart();
            }
        });
    }
}

// Process order
function processOrder() {
    const orderButton = document.querySelector('.place-order-btn');
    const orderButtonText = document.getElementById('orderButtonText');
    
    // Show loading state
    orderButton.disabled = true;
    orderButtonText.innerHTML = '<div class="loading"></div> Processing...';
    
    // Simulate API call
    setTimeout(() => {
        // Generate random order ID
        const orderId = 'TS-' + Math.floor(Math.random() * 1000000);
        
        // Show success message
        document.getElementById('checkoutForm').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('orderId').textContent = orderId;
        
        // Reset button
        orderButton.disabled = false;
        orderButtonText.textContent = 'Place Order';
        
        // Clear cart after successful order
        setTimeout(() => {
            cart = [];
            updateCartCount();
            toggleCart();
            showNotification(`Order #${orderId} placed successfully!`);
        }, 3000);
    }, 2000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();
});