// Product data
const products = [
    {
        id: 1,
        name: "Farm Fresh Organic Eggs - Small",
        category: "eggs",
        price: 350,
        image: "assets/images/organic-chicken.jpg",
        description: "Fresh organic eggs from free-range hens, small size (18-24 per dozen)",
        rating: 4.9,
        reviewCount: 156,
        badge: "organic",
        options: {
            size: ["Small", "Medium", "Large", "Extra Large"]
        },
        inStock: true,
        featured: true
    },
    {
        id: 2,
        name: "Farm Fresh Organic Eggs - Medium",
        category: "eggs",
        price: 400,
        image: "assets/images/organic-chicken.jpg",
        description: "Fresh organic eggs from free-range hens, medium size",
        rating: 4.8,
        reviewCount: 203,
        badge: "organic",
        options: {
            size: ["Medium", "Large", "Extra Large"]
        },
        inStock: true,
        featured: false
    },
    {
        id: 3,
        name: "Organic Whole Chicken",
        category: "chicken",
        price: 680,
        image: "assets/images/organic-chicken.jpg",
        description: "Premium organic whole chicken, approximately 3-4 lbs",
        rating: 4.9,
        reviewCount: 89,
        badge: "organic",
        options: {
            weight: ["3-4 lbs", "4-5 lbs", "5-6 lbs"]
        },
        inStock: true,
        featured: true
    },
    {
        id: 4,
        name: "Organic Chicken Breast",
        category: "chicken",
        price: 1250,
        image: "assets/images/organic-chicken.jpg",
        description: "Boneless, skinless organic chicken breast, 2 lbs pack",
        rating: 4.7,
        reviewCount: 124,
        badge: "organic",
        options: {
            weight: ["1 lb", "2 lbs", "5 lbs"]
        },
        inStock: true,
        featured: false
    },
    {
        id: 5,
        name: "Organic Chicken Thighs",
        category: "chicken",
        price: 850,
        image: "assets/images/organic-chicken.jpg",
        description: "Bone-in organic chicken thighs, 2 lbs pack",
        rating: 4.8,
        reviewCount: 67,
        badge: "organic",
        options: {
            weight: ["2 lbs", "5 lbs", "10 lbs"]
        },
        inStock: true,
        featured: false
    },
    {
        id: 6,
        name: "Heritage Turkey - Whole",
        category: "turkey",
        price: 5400,
        image: "assets/images/organic-chicken.jpg",
        description: "Heritage breed turkey, perfect for holidays, 12-15 lbs",
        rating: 5.0,
        reviewCount: 23,
        badge: "fresh",
        options: {
            weight: ["10-12 lbs", "12-15 lbs", "15-18 lbs", "18+ lbs"]
        },
        inStock: true,
        featured: true
    },
    {
        id: 7,
        name: "Turkey Breast",
        category: "turkey",
        price: 1980,
        image: "assets/images/organic-chicken.jpg",
        description: "Organic turkey breast, bone-in, 4-6 lbs",
        rating: 4.9,
        reviewCount: 34,
        badge: "organic",
        options: {
            weight: ["3-4 lbs", "4-6 lbs", "6-8 lbs"]
        },
        inStock: true,
        featured: false
    },
    {
        id: 8,
        name: "Rhode Island Red Hens",
        category: "live",
        price: 2100,
        image: "assets/images/hero-farm.jpg",
        description: "Healthy Rhode Island Red laying hens, 6-8 months old",
        rating: 4.6,
        reviewCount: 78,
        badge: "fresh",
        options: {
            age: ["6-8 months", "8-12 months", "12+ months"]
        },
        inStock: true,
        featured: false
    },
    {
        id: 9,
        name: "Buff Orpington Hens",
        category: "live",
        price: 2280,
        image: "assets/images/hero-farm.jpg",
        description: "Docile Buff Orpington hens, excellent for families",
        rating: 4.8,
        reviewCount: 45,
        badge: "fresh",
        options: {
            age: ["6-8 months", "8-12 months"]
        },
        inStock: true,
        featured: false
    },
    {
        id: 10,
        name: "Cornish Cross Broilers",
        category: "live",
        price: 1500,
        image: "assets/images/hero-farm.jpg",
        description: "Fast-growing broiler chickens, 6-8 weeks old",
        rating: 4.5,
        reviewCount: 92,
        badge: "fresh",
        options: {
            age: ["4-6 weeks", "6-8 weeks", "8-10 weeks"]
        },
        inStock: true,
        featured: false
    },
    {
        id: 11,
        name: "Day-old Rhode Island Red Chicks",
        category: "chicks",
        price: 120,
        image: "assets/images/hero-farm.jpg",
        description: "Day-old Rhode Island Red chicks, straight run",
        rating: 4.7,
        reviewCount: 156,
        badge: "fresh",
        options: {
            sex: ["Straight Run", "Pullets", "Cockerels"],
            quantity: ["10 chicks", "25 chicks", "50 chicks", "100 chicks"]
        },
        inStock: true,
        featured: false
    },
    {
        id: 12,
        name: "Day-old Buff Orpington Chicks",
        category: "chicks",
        price: 150,
        image: "assets/images/hero-farm.jpg",
        description: "Day-old Buff Orpington chicks, excellent breed for beginners",
        rating: 4.8,
        reviewCount: 89,
        badge: "fresh",
        options: {
            sex: ["Straight Run", "Pullets"],
            quantity: ["10 chicks", "25 chicks", "50 chicks"]
        },
        inStock: true,
        featured: false
    }
];

// Shopping cart
let shoppingCart = JSON.parse(localStorage.getItem('freshplug_cart')) || [];

// DOM elements
const productsContainer = document.getElementById('products-container');
const cartToggle = document.getElementById('cart-toggle');
const cartSidebar = document.getElementById('cart-sidebar');
const cartClose = document.getElementById('cart-close');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const filterTabs = document.querySelectorAll('.filter-tab');
const searchInput = document.getElementById('product-search');
const sortSelect = document.getElementById('sort-products');

// Initialize shop
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    updateCartUI();
    initializeFilters();
    initializeSearch();
    initializeSort();
    applyCategoryFromHash();
});

// Links like shop.html#eggs (homepage "Shop Eggs" buttons, footer product
// lists across the site) are meant to land pre-filtered to that category —
// activate the matching filter tab instead of leaving the hash inert.
function applyCategoryFromHash() {
    const category = window.location.hash.slice(1);
    if (!category) return;

    const matchingTab = Array.from(filterTabs).find(tab => tab.getAttribute('data-category') === category);
    if (!matchingTab) return;

    filterTabs.forEach(tab => tab.classList.remove('active'));
    matchingTab.classList.add('active');
    filterProducts(category);
}

// Render products
function renderProducts(productsToRender) {
    productsContainer.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productElement = createProductElement(product);
        productsContainer.appendChild(productElement);
    });
}

// Create product element
function createProductElement(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'product-item';
    productDiv.setAttribute('data-category', product.category);
    
    const badgeClass = product.badge === 'organic' ? 'organic' : 
                      product.badge === 'fresh' ? 'fresh' : '';
    
    productDiv.innerHTML = `
        <div class="product-badge ${badgeClass}">${product.badge}</div>
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/images/placeholder.jpg'">
            <div class="quick-view" onclick="quickView(${product.id})">
                <i class="fas fa-eye"></i>
            </div>
        </div>
        <div class="product-details">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-meta">
                <div class="product-price">KSH ${product.price.toLocaleString()}</div>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
            </div>
            <div class="product-options">
                ${generateProductOptions(product)}
            </div>
            <div class="quantity-selector">
                <button class="quantity-btn" onclick="changeQuantity(${product.id}, -1)">-</button>
                <input type="number" class="quantity-input" id="quantity-${product.id}" value="1" min="1" max="10">
                <button class="quantity-btn" onclick="changeQuantity(${product.id}, 1)">+</button>
            </div>
            <div class="product-actions">
                <button class="add-to-cart" onclick="addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    return productDiv;
}

// Generate stars
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    
    if (halfStar) {
        stars += '☆';
    }
    
    return stars;
}

// Generate product options
function generateProductOptions(product) {
    let optionsHtml = '';
    
    if (product.options) {
        Object.keys(product.options).forEach(optionKey => {
            optionsHtml += `
                <div class="option-group">
                    <label class="option-label">${optionKey.charAt(0).toUpperCase() + optionKey.slice(1)}:</label>
                    <select class="option-select" id="${optionKey}-${product.id}">
                        ${product.options[optionKey].map(option => 
                            `<option value="${option}">${option}</option>`
                        ).join('')}
                    </select>
                </div>
            `;
        });
    }
    
    return optionsHtml;
}

// Change quantity
function changeQuantity(productId, change) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    let newQuantity = parseInt(quantityInput.value) + change;
    
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 10) newQuantity = 10;
    
    quantityInput.value = newQuantity;
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById(`quantity-${productId}`).value);
    
    if (!product || quantity <= 0) return;
    
    // Get selected options
    const selectedOptions = {};
    if (product.options) {
        Object.keys(product.options).forEach(optionKey => {
            const selectElement = document.getElementById(`${optionKey}-${productId}`);
            if (selectElement) {
                selectedOptions[optionKey] = selectElement.value;
            }
        });
    }
    
    // Check if item with same options already exists
    const existingItemIndex = shoppingCart.findIndex(item => 
        item.id === productId && 
        JSON.stringify(item.options) === JSON.stringify(selectedOptions)
    );
    
    if (existingItemIndex !== -1) {
        // Update quantity
        shoppingCart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        shoppingCart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity,
            options: selectedOptions
        });
    }
    
    // Save to localStorage
    localStorage.setItem('freshplug_cart', JSON.stringify(shoppingCart));
    
    // Update UI
    updateCartUI();
    
    // Show notification
    showNotification(`${product.name} added to cart!`, 'success');
    
    // Reset quantity to 1
    document.getElementById(`quantity-${productId}`).value = 1;
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    
    // Update cart total
    const total = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
    
    // Render cart items
    renderCartItems();
}

// Render cart items
function renderCartItems() {
    cartItems.innerHTML = '';
    
    if (shoppingCart.length === 0) {
        cartItems.innerHTML = '<div style="text-align: center; padding: 2rem; color: #666;">Your cart is empty</div>';
        return;
    }
    
    shoppingCart.forEach((item, index) => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        
        const optionsText = item.options ? 
            Object.entries(item.options).map(([key, value]) => `${key}: ${value}`).join(', ') : '';
        
        cartItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/placeholder.jpg'">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                ${optionsText ? `<div style="font-size: 0.8rem; color: #666;">${optionsText}</div>` : ''}
                <div class="cart-item-price">KSH ${item.price.toLocaleString()} x ${item.quantity}</div>
            </div>
            <div>
                <button onclick="removeFromCart(${index})" style="background: #ff4757; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">×</button>
            </div>
        `;
        
        cartItems.appendChild(cartItemDiv);
    });
}

// Remove from cart
function removeFromCart(index) {
    shoppingCart.splice(index, 1);
    localStorage.setItem('freshplug_cart', JSON.stringify(shoppingCart));
    updateCartUI();
    showNotification('Item removed from cart', 'success');
}

// Cart toggle
cartToggle.addEventListener('click', () => {
    cartSidebar.classList.add('active');
});

cartClose.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
});

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    if (!cartSidebar.contains(e.target) && !cartToggle.contains(e.target)) {
        cartSidebar.classList.remove('active');
    }
});

// Initialize filters
function initializeFilters() {
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Filter products
            const category = tab.getAttribute('data-category');
            filterProducts(category);
        });
    });
}

// Filter products
function filterProducts(category) {
    let filteredProducts = products;
    
    if (category !== 'all') {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    // Apply search filter if active
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply sorting
    const sortValue = sortSelect.value;
    filteredProducts = sortProducts(filteredProducts, sortValue);
    
    renderProducts(filteredProducts);
}

// Initialize search
function initializeSearch() {
    searchInput.addEventListener('input', () => {
        const activeCategory = document.querySelector('.filter-tab.active').getAttribute('data-category');
        filterProducts(activeCategory);
    });
}

// Initialize sort
function initializeSort() {
    sortSelect.addEventListener('change', () => {
        const activeCategory = document.querySelector('.filter-tab.active').getAttribute('data-category');
        filterProducts(activeCategory);
    });
}

// Sort products
function sortProducts(products, sortBy) {
    const sortedProducts = [...products];
    
    switch (sortBy) {
        case 'name':
            return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        case 'price-low':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sortedProducts.sort((a, b) => b.price - a.price);
        case 'rating':
            return sortedProducts.sort((a, b) => b.rating - a.rating);
        default:
            return sortedProducts;
    }
}

// Quick view (placeholder)
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // In a real implementation, this would open a modal with detailed product info
        showNotification(`Quick view for ${product.name} - Feature coming soon!`, 'info');
    }
}

// Toggle wishlist (placeholder)
function toggleWishlist(productId) {
    // In a real implementation, this would add/remove from wishlist
    showNotification('Wishlist feature coming soon!', 'info');
}

// Proceed to checkout
function proceedToCheckout() {
    if (shoppingCart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // In a real implementation, this would redirect to a checkout page
    // For now, we'll simulate the checkout process
    const total = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const orderSummary = `
Order Summary:
${shoppingCart.map(item => `${item.name} (${item.quantity}x) - KSH ${(item.price * item.quantity).toLocaleString()}`).join('\n')}

Total: KSH ${total.toLocaleString()}

Would you like to proceed with WhatsApp checkout?`;

    if (confirm(orderSummary)) {
        // Send WhatsApp message
        const whatsappMessage = `Hello! I'd like to place an order:

${shoppingCart.map(item => {
            const options = item.options ? 
                ` (${Object.entries(item.options).map(([key, value]) => `${key}: ${value}`).join(', ')})` : '';
            return `${item.name}${options} - Qty: ${item.quantity} - KSH ${(item.price * item.quantity).toLocaleString()}`;
        }).join('\n')}

Total: KSH ${total.toLocaleString()}

Please confirm availability and delivery details.`;

        const phoneNumber = '254714221885';
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(url, '_blank');
        
        // Clear cart
        shoppingCart = [];
        localStorage.setItem('freshplug_cart', JSON.stringify(shoppingCart));
        updateCartUI();
        cartSidebar.classList.remove('active');
        
        showNotification('Order sent via WhatsApp! We\'ll confirm shortly.', 'success');
    }
}

// Notification function (if not already defined in main.js)
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Add close functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Newsletter signup for shop page
document.addEventListener('DOMContentLoaded', () => {
    // Add newsletter signup in shop if needed
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                showNotification('Thank you for subscribing! You\'ll receive updates about new products and special offers.', 'success');
                newsletterForm.querySelector('input[type="email"]').value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
});

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}