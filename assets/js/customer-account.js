// Customer Account Management System
class CustomerAccount {
    constructor() {
        this.customer = this.loadCustomerData();
        this.orders = this.loadOrders();
        this.subscriptions = this.loadSubscriptions();
        this.addresses = this.loadAddresses();
        this.preferences = this.loadPreferences();
        this.loyaltyData = this.loadLoyaltyData();
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.loadProfileForm();
        this.renderDashboard();
        this.renderOrders();
        this.renderSubscriptions();
        this.renderAddresses();
        this.setupPreferences();
        this.renderLoyaltyProgram();
        this.setupForms();
    }
    
    // Data Loading Methods
    loadCustomerData() {
        const defaultCustomer = {
            id: 'cust_' + Date.now(),
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            phone: '+254 712 345678',
            birthDate: '1990-01-01',
            joinDate: '2023-06-15',
            tier: 'Gold',
            avatar: null
        };
        
        const saved = localStorage.getItem('freshplug_customer');
        return saved ? { ...defaultCustomer, ...JSON.parse(saved) } : defaultCustomer;
    }
    
    loadOrders() {
        const defaultOrders = [
            {
                id: 'FP001',
                date: '2024-01-15',
                items: [
                    { name: 'Fresh Organic Eggs', quantity: 2, price: 450 },
                    { name: 'Organic Chicken', quantity: 1, price: 1200 }
                ],
                total: 2100,
                status: 'delivered',
                deliveryDate: '2024-01-16'
            },
            {
                id: 'FP002',
                date: '2024-01-10',
                items: [
                    { name: 'Fresh Organic Eggs', quantity: 1, price: 450 }
                ],
                total: 450,
                status: 'delivered',
                deliveryDate: '2024-01-11'
            },
            {
                id: 'FP003',
                date: '2024-01-08',
                items: [
                    { name: 'Live Chickens', quantity: 2, price: 2500 }
                ],
                total: 5000,
                status: 'processing',
                estimatedDelivery: '2024-01-20'
            }
        ];
        
        const saved = localStorage.getItem('freshplug_orders');
        return saved ? JSON.parse(saved) : defaultOrders;
    }
    
    loadSubscriptions() {
        const defaultSubscriptions = [
            {
                id: 'sub_001',
                product: 'Fresh Organic Eggs',
                frequency: 'weekly',
                quantity: 2,
                price: 450,
                nextDelivery: '2024-01-22',
                status: 'active',
                startDate: '2023-12-01'
            },
            {
                id: 'sub_002',
                product: 'Mixed Farm Box',
                frequency: 'monthly',
                quantity: 1,
                price: 2500,
                nextDelivery: '2024-02-01',
                status: 'active',
                startDate: '2023-11-15'
            }
        ];
        
        const saved = localStorage.getItem('freshplug_subscriptions');
        return saved ? JSON.parse(saved) : defaultSubscriptions;
    }
    
    loadAddresses() {
        const defaultAddresses = [
            {
                id: 'addr_001',
                label: 'Home',
                address: '123 Kiambu Road, Nairobi',
                city: 'Nairobi',
                postalCode: '00100',
                isDefault: true
            },
            {
                id: 'addr_002',
                label: 'Office',
                address: '456 CBD Plaza, Nairobi',
                city: 'Nairobi',
                postalCode: '00200',
                isDefault: false
            }
        ];
        
        const saved = localStorage.getItem('freshplug_addresses');
        return saved ? JSON.parse(saved) : defaultAddresses;
    }
    
    loadPreferences() {
        const defaultPreferences = {
            emailNotifications: true,
            smsNotifications: true,
            marketingCommunications: false,
            deliveryReminders: true
        };
        
        const saved = localStorage.getItem('freshplug_preferences');
        return saved ? JSON.parse(saved) : defaultPreferences;
    }
    
    loadLoyaltyData() {
        const defaultLoyalty = {
            points: 1250,
            tier: 'Gold',
            totalSpent: 45000,
            totalSaved: 3400,
            nextTierPoints: 1500,
            rewards: [
                { id: 'r001', name: '10% Off Next Order', points: 500, type: 'discount' },
                { id: 'r002', name: 'Free Dozen Eggs', points: 800, type: 'product' },
                { id: 'r003', name: 'Free Delivery', points: 300, type: 'service' }
            ]
        };
        
        const saved = localStorage.getItem('freshplug_loyalty');
        return saved ? JSON.parse(saved) : defaultLoyalty;
    }
    
    // Navigation Setup
    setupNavigation() {
        const navLinks = document.querySelectorAll('.account-nav .nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href') === '#logout') return;
                
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
                
                // Update active nav
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Track navigation
                if (typeof analytics !== 'undefined') {
                    analytics.trackCustomEvent('account_navigation', {
                        section: section,
                        timestamp: Date.now()
                    });
                }
            });
        });
    }
    
    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.account-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionName + '-section');
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Update nav link
        document.querySelectorAll('.account-nav .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionName) {
                link.classList.add('active');
            }
        });
    }
    
    // Profile Management
    loadProfileForm() {
        document.getElementById('first-name').value = this.customer.firstName;
        document.getElementById('last-name').value = this.customer.lastName;
        document.getElementById('email').value = this.customer.email;
        document.getElementById('phone').value = this.customer.phone;
        document.getElementById('birth-date').value = this.customer.birthDate;
        document.getElementById('user-name').textContent = `${this.customer.firstName} ${this.customer.lastName}`;
    }
    
    // Dashboard Rendering
    renderDashboard() {
        // Update stats
        document.getElementById('total-orders').textContent = this.orders.length;
        document.getElementById('active-subscriptions').textContent = 
            this.subscriptions.filter(sub => sub.status === 'active').length;
        document.getElementById('loyalty-points').textContent = this.loyaltyData.points.toLocaleString();
        document.getElementById('total-saved').textContent = this.loyaltyData.totalSaved.toLocaleString();
        
        // Render recent activity
        this.renderRecentActivity();
    }
    
    renderRecentActivity() {
        const activityContainer = document.getElementById('recent-activity');
        const activities = this.generateRecentActivities();
        
        activityContainer.innerHTML = activities.map(activity => `
            <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px; margin-bottom: 0.5rem;">
                <div style="width: 40px; height: 40px; background: var(--primary-green); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">
                    <i class="${activity.icon}"></i>
                </div>
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 0.2rem 0; font-size: 0.9rem;">${activity.title}</h4>
                    <p style="margin: 0; color: var(--text-light); font-size: 0.8rem;">${activity.description}</p>
                </div>
                <div style="color: var(--text-light); font-size: 0.8rem;">
                    ${this.formatDate(activity.date)}
                </div>
            </div>
        `).join('');
    }
    
    generateRecentActivities() {
        const activities = [];
        
        // Add order activities
        this.orders.slice(0, 3).forEach(order => {
            activities.push({
                icon: 'fas fa-shopping-bag',
                title: `Order ${order.id} ${order.status}`,
                description: `${order.items.length} items • KSH ${order.total.toLocaleString()}`,
                date: order.date
            });
        });
        
        // Add subscription activities
        this.subscriptions.slice(0, 2).forEach(sub => {
            activities.push({
                icon: 'fas fa-sync-alt',
                title: 'Subscription delivery',
                description: `${sub.product} • Next: ${this.formatDate(sub.nextDelivery)}`,
                date: sub.nextDelivery
            });
        });
        
        return activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    }
    
    // Orders Rendering
    renderOrders() {
        const tbody = document.getElementById('orders-tbody');
        
        tbody.innerHTML = this.orders.map(order => `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>${this.formatDate(order.date)}</td>
                <td>${order.items.length} items</td>
                <td>KSH ${order.total.toLocaleString()}</td>
                <td><span class="order-status status-${order.status}">${order.status}</span></td>
                <td>
                    <button class="btn btn-small btn-outline" onclick="account.viewOrderDetails('${order.id}')">
                        View Details
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    viewOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Order Details - ${order.id}</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div>
                    <p><strong>Date:</strong> ${this.formatDate(order.date)}</p>
                    <p><strong>Status:</strong> <span class="order-status status-${order.status}">${order.status}</span></p>
                    ${order.deliveryDate ? `<p><strong>Delivered:</strong> ${this.formatDate(order.deliveryDate)}</p>` : ''}
                    ${order.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${this.formatDate(order.estimatedDelivery)}</p>` : ''}
                    
                    <h4>Items Ordered:</h4>
                    <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                        ${order.items.map(item => `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>${item.name} x${item.quantity}</span>
                                <span>KSH ${(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        `).join('')}
                        <hr>
                        <div style="display: flex; justify-content: space-between; font-weight: bold;">
                            <span>Total</span>
                            <span>KSH ${order.total.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                        <button class="btn btn-primary" onclick="window.location.href='shop.html'">Order Again</button>
                        <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Subscriptions Rendering
    renderSubscriptions() {
        const container = document.getElementById('subscriptions-list');
        
        container.innerHTML = this.subscriptions.map(sub => `
            <div class="subscription-card ${sub.status === 'active' ? 'active' : ''}">
                <div class="subscription-header">
                    <div>
                        <h3 class="subscription-title">${sub.product}</h3>
                        <p class="subscription-frequency">${sub.frequency} • KSH ${sub.price.toLocaleString()}</p>
                    </div>
                    <div class="subscription-actions">
                        <button class="btn btn-small ${sub.status === 'active' ? 'btn-outline' : 'btn-primary'}" 
                                onclick="account.toggleSubscription('${sub.id}')">
                            ${sub.status === 'active' ? 'Pause' : 'Resume'}
                        </button>
                        <button class="btn btn-small btn-secondary" onclick="account.editSubscription('${sub.id}')">
                            Edit
                        </button>
                    </div>
                </div>
                <div>
                    <p><strong>Next Delivery:</strong> ${this.formatDate(sub.nextDelivery)}</p>
                    <p><strong>Started:</strong> ${this.formatDate(sub.startDate)}</p>
                    <p><strong>Status:</strong> <span style="color: ${sub.status === 'active' ? 'var(--primary-green)' : 'var(--text-light)'}">${sub.status}</span></p>
                </div>
            </div>
        `).join('');
    }
    
    toggleSubscription(subId) {
        const subscription = this.subscriptions.find(s => s.id === subId);
        if (subscription) {
            subscription.status = subscription.status === 'active' ? 'paused' : 'active';
            this.saveSubscriptions();
            this.renderSubscriptions();
            this.renderDashboard();
            
            showNotification(
                `Subscription ${subscription.status === 'active' ? 'resumed' : 'paused'} successfully!`, 
                'success'
            );
        }
    }
    
    // Addresses Rendering
    renderAddresses() {
        const container = document.getElementById('addresses-list');
        
        container.innerHTML = this.addresses.map(addr => `
            <div class="address-card ${addr.isDefault ? 'default' : ''}">
                ${addr.isDefault ? '<div class="address-badge">Default</div>' : ''}
                <h4>${addr.label}</h4>
                <p>${addr.address}</p>
                <p>${addr.city}, ${addr.postalCode}</p>
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                    <button class="btn btn-small btn-outline" onclick="account.editAddress('${addr.id}')">
                        Edit
                    </button>
                    ${!addr.isDefault ? `<button class="btn btn-small btn-secondary" onclick="account.setDefaultAddress('${addr.id}')">Set Default</button>` : ''}
                    ${!addr.isDefault ? `<button class="btn btn-small" style="background: #dc3545; color: white;" onclick="account.deleteAddress('${addr.id}')">Delete</button>` : ''}
                </div>
            </div>
        `).join('');
    }
    
    setDefaultAddress(addressId) {
        this.addresses.forEach(addr => {
            addr.isDefault = addr.id === addressId;
        });
        this.saveAddresses();
        this.renderAddresses();
        showNotification('Default address updated!', 'success');
    }
    
    // Preferences Setup
    setupPreferences() {
        const toggles = document.querySelectorAll('.toggle-switch');
        const prefKeys = ['emailNotifications', 'smsNotifications', 'marketingCommunications', 'deliveryReminders'];
        
        toggles.forEach((toggle, index) => {
            const prefKey = prefKeys[index];
            if (this.preferences[prefKey]) {
                toggle.classList.add('active');
            }
        });
    }
    
    togglePreference(toggle) {
        const prefKeys = ['emailNotifications', 'smsNotifications', 'marketingCommunications', 'deliveryReminders'];
        const toggles = Array.from(document.querySelectorAll('.toggle-switch'));
        const index = toggles.indexOf(toggle);
        const prefKey = prefKeys[index];
        
        toggle.classList.toggle('active');
        this.preferences[prefKey] = toggle.classList.contains('active');
        this.savePreferences();
        
        showNotification('Preferences updated!', 'success');
    }
    
    // Loyalty Program
    renderLoyaltyProgram() {
        const pointsElement = document.getElementById('loyalty-points');
        if (pointsElement) {
            pointsElement.textContent = this.loyaltyData.points.toLocaleString();
        }
        
        // Update progress bar
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const progressPercent = (this.loyaltyData.points / this.loyaltyData.nextTierPoints) * 100;
            progressFill.style.width = Math.min(progressPercent, 100) + '%';
        }
    }
    
    redeemReward(rewardId, pointsCost) {
        if (this.loyaltyData.points >= pointsCost) {
            this.loyaltyData.points -= pointsCost;
            this.saveLoyaltyData();
            this.renderLoyaltyProgram();
            this.renderDashboard();
            
            showNotification(`Reward redeemed! ${pointsCost} points used.`, 'success');
            
            // Track redemption
            if (typeof analytics !== 'undefined') {
                analytics.trackCustomEvent('reward_redeemed', {
                    rewardId: rewardId,
                    pointsCost: pointsCost,
                    remainingPoints: this.loyaltyData.points
                });
            }
        } else {
            showNotification('Insufficient points for this reward.', 'error');
        }
    }
    
    // Form Setup
    setupForms() {
        // Profile form
        const profileForm = document.getElementById('profile-form');
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
        });
        
        // Address form
        const addressForm = document.getElementById('address-form');
        addressForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAddress();
        });
        
        // Subscription form
        const subscriptionForm = document.getElementById('subscription-form');
        subscriptionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSubscription();
        });
    }
    
    updateProfile() {
        this.customer.firstName = document.getElementById('first-name').value;
        this.customer.lastName = document.getElementById('last-name').value;
        this.customer.email = document.getElementById('email').value;
        this.customer.phone = document.getElementById('phone').value;
        this.customer.birthDate = document.getElementById('birth-date').value;
        
        this.saveCustomerData();
        this.loadProfileForm(); // Update display
        
        showNotification('Profile updated successfully!', 'success');
    }
    
    addAddress() {
        const formData = new FormData(document.getElementById('address-form'));
        const newAddress = {
            id: 'addr_' + Date.now(),
            label: formData.get('label') || 'Address',
            address: formData.get('address'),
            city: formData.get('city'),
            postalCode: formData.get('postalCode'),
            isDefault: this.addresses.length === 0
        };
        
        this.addresses.push(newAddress);
        this.saveAddresses();
        this.renderAddresses();
        this.closeModal('address-modal');
        
        showNotification('Address added successfully!', 'success');
    }
    
    // Utility Methods
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    // Save Methods
    saveCustomerData() {
        localStorage.setItem('freshplug_customer', JSON.stringify(this.customer));
    }
    
    saveOrders() {
        localStorage.setItem('freshplug_orders', JSON.stringify(this.orders));
    }
    
    saveSubscriptions() {
        localStorage.setItem('freshplug_subscriptions', JSON.stringify(this.subscriptions));
    }
    
    saveAddresses() {
        localStorage.setItem('freshplug_addresses', JSON.stringify(this.addresses));
    }
    
    savePreferences() {
        localStorage.setItem('freshplug_preferences', JSON.stringify(this.preferences));
    }
    
    saveLoyaltyData() {
        localStorage.setItem('freshplug_loyalty', JSON.stringify(this.loyaltyData));
    }
    
    // Modal Management
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Reset form
            const form = modal.querySelector('form');
            if (form) form.reset();
        }
    }
}

// Global functions for HTML onclick events
function showSection(sectionName) {
    if (window.account) {
        window.account.showSection(sectionName);
    }
}

function togglePreference(element) {
    if (window.account) {
        window.account.togglePreference(element);
    }
}

function openModal(modalId) {
    if (window.account) {
        window.account.openModal(modalId);
    }
}

function closeModal(modalId) {
    if (window.account) {
        window.account.closeModal(modalId);
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear session data
        localStorage.removeItem('freshplug_customer');
        localStorage.removeItem('freshplug_session');
        
        // Track logout
        if (typeof analytics !== 'undefined') {
            analytics.trackCustomEvent('user_logout', { timestamp: Date.now() });
        }
        
        // Redirect to home
        window.location.href = 'index.html';
        
        showNotification('You have been logged out successfully.', 'success');
    }
}

// Notification function
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

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

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });

    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Initialize account system when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.account = new CustomerAccount();
    
    // Check if user is logged in (simplified check)
    const customer = localStorage.getItem('freshplug_customer');
    if (!customer && window.location.pathname.includes('customer-account')) {
        // Redirect to login page or show login modal
        // For demo purposes, we'll create a default customer
        console.log('Customer account system loaded');
    }
});

// Service Worker for offline functionality (placeholder)
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