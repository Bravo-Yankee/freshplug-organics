// Update Current Year in Footer
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Newsletter Form Submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;

        if (validateEmail(email)) {
            // Simulate API call
            showNotification('Thank you for subscribing! You\'ll receive farm updates and special offers.', 'success');
            this.querySelector('input[type="email"]').value = '';
        } else {
            showNotification('Please enter a valid email address.', 'error');
        }
    });
}

// Email Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Notification System
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
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
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

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loading');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.product-card, .testimonial, .hero-text, .hero-image');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// Product Card Hover Effects
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// WhatsApp Integration
function sendWhatsAppMessage(message = '') {
    const phoneNumber = '254714221885'; // Your actual WhatsApp number
    const defaultMessage = message || 'Hi! I\'m interested in your organic poultry products.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
}

// Add WhatsApp quick actions
document.addEventListener('DOMContentLoaded', () => {
    // Add WhatsApp buttons to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        const productName = card.querySelector('h3').textContent;
        const whatsappBtn = document.createElement('button');
        whatsappBtn.className = 'btn whatsapp-quick-btn';
        whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Quick Order';
        whatsappBtn.style.cssText = `
            background: #25D366;
            color: white;
            border: none;
            margin-top: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        whatsappBtn.addEventListener('click', () => {
            sendWhatsAppMessage(`Hi! I'm interested in ordering ${productName}. Can you please provide more details?`);
        });
        
        whatsappBtn.addEventListener('mouseenter', () => {
            whatsappBtn.style.background = '#128C7E';
            whatsappBtn.style.transform = 'translateY(-2px)';
        });
        
        whatsappBtn.addEventListener('mouseleave', () => {
            whatsappBtn.style.background = '#25D366';
            whatsappBtn.style.transform = 'translateY(0)';
        });
        
        card.appendChild(whatsappBtn);
    });
});

// Form Handling for Contact Forms
function handleContactForm(formData) {
    // Simulate form submission
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: 'Thank you! We\'ll get back to you within 24 hours.' });
        }, 1000);
    });
}

// Search Functionality (for future implementation)
function initializeSearch() {
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    const searchResults = document.querySelector('#search-results');
    
    if (query.length > 2) {
        // Implement search logic here
        console.log('Searching for:', query);
    }
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Shopping Cart Functions (for e-commerce integration)
let cart = JSON.parse(localStorage.getItem('freshplug_cart')) || [];

function addToCart(productId, productName, price, quantity = 1) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: quantity
        });
    }
    
    localStorage.setItem('freshplug_cart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification(`${productName} added to cart!`, 'success');
}

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', updateCartDisplay);

// Lazy Loading for Images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeLazyLoading();
    initializeSearch();
});

// Google Analytics Integration (placeholder)
function trackEvent(eventAction, eventCategory, eventLabel) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventAction, {
            event_category: eventCategory,
            event_label: eventLabel
        });
    }
}

// Track button clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-primary')) {
        trackEvent('click', 'CTA Button', e.target.textContent);
    }
    if (e.target.closest('.whatsapp-btn, .whatsapp-float')) {
        trackEvent('click', 'WhatsApp', 'Contact');
    }
});

// Performance Optimization
window.addEventListener('load', () => {
    // Remove loading states
    document.body.classList.add('loaded');
    
    // Preload critical images
    const criticalImages = [
        'assets/images/hero-farm.jpg',
        'assets/images/fresh-eggs.jpg',
        'assets/images/organic-chicken.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}