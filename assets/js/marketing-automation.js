// Marketing Automation System for Freshplug Organics
class MarketingAutomation {
    constructor() {
        this.customers = this.loadCustomers();
        this.campaigns = this.loadCampaigns();
        this.automationRules = this.loadAutomationRules();
        this.emailTemplates = this.loadEmailTemplates();
        this.segments = this.loadSegments();
        this.analytics = {
            emailsSent: 0,
            emailsOpened: 0,
            clickThroughs: 0,
            conversions: 0
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeAutomationRules();
        this.startPeriodicTasks();
        console.log('Marketing Automation System initialized');
    }
    
    // Customer Management
    loadCustomers() {
        const defaultCustomers = [
            {
                id: 'cust_1',
                email: 'john.doe@email.com',
                phone: '+254712345678',
                name: 'John Doe',
                status: 'active',
                segment: 'premium',
                totalSpent: 5600,
                lastPurchase: '2024-01-15',
                subscriptions: ['newsletter', 'promotions'],
                preferences: {
                    emailFrequency: 'weekly',
                    productInterests: ['eggs', 'chicken'],
                    deliveryDay: 'saturday'
                },
                behavior: {
                    websiteVisits: 12,
                    emailOpens: 8,
                    clickThroughs: 5,
                    cartAbandonments: 2
                },
                joinDate: '2023-06-15'
            }
        ];
        
        const saved = localStorage.getItem('freshplug_customers');
        return saved ? JSON.parse(saved) : defaultCustomers;
    }
    
    loadCampaigns() {
        return [
            {
                id: 'camp_1',
                name: 'Weekly Fresh Eggs Promotion',
                type: 'promotional',
                status: 'active',
                target: 'all_customers',
                schedule: {
                    frequency: 'weekly',
                    dayOfWeek: 'thursday',
                    time: '09:00'
                },
                template: 'weekly_promotion',
                metrics: {
                    sent: 0,
                    opened: 0,
                    clicked: 0,
                    converted: 0
                }
            },
            {
                id: 'camp_2',
                name: 'Welcome Series',
                type: 'welcome',
                status: 'active',
                target: 'new_customers',
                trigger: 'signup',
                template: 'welcome_series',
                metrics: {
                    sent: 0,
                    opened: 0,
                    clicked: 0,
                    converted: 0
                }
            }
        ];
    }
    
    loadAutomationRules() {
        return [
            {
                id: 'rule_1',
                name: 'Cart Abandonment Recovery',
                trigger: 'cart_abandoned',
                delay: 3600000, // 1 hour
                condition: 'cart_value > 500',
                action: 'send_email',
                template: 'cart_abandonment',
                active: true
            },
            {
                id: 'rule_2',
                name: 'Welcome New Customer',
                trigger: 'customer_registered',
                delay: 0,
                condition: 'first_time_visitor',
                action: 'send_welcome_series',
                template: 'welcome_new_customer',
                active: true
            },
            {
                id: 'rule_3',
                name: 'Re-engagement Campaign',
                trigger: 'inactive_30_days',
                delay: 0,
                condition: 'last_purchase > 30_days',
                action: 'send_email',
                template: 'win_back',
                active: true
            },
            {
                id: 'rule_4',
                name: 'Birthday Discount',
                trigger: 'birthday',
                delay: 0,
                condition: 'active_customer',
                action: 'send_email',
                template: 'birthday_special',
                active: true
            }
        ];
    }
    
    loadEmailTemplates() {
        return {
            welcome_new_customer: {
                subject: '🌟 Welcome to Freshplug Organics Family!',
                content: `
                    <h2>Welcome to Freshplug Organics!</h2>
                    <p>Thank you for joining our organic farming family. We're excited to share the freshest, highest-quality poultry products with you.</p>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>🎁 Special Welcome Offer: 15% OFF your first order</h3>
                        <p>Use code: <strong>WELCOME15</strong></p>
                        <a href="{{shop_url}}" style="background: #A6371F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Shop Now</a>
                    </div>
                    <p>Here's what makes us special:</p>
                    <ul>
                        <li>🐔 100% Organic, free-range chickens</li>
                        <li>🥚 Farm-fresh eggs collected daily</li>
                        <li>🚚 Fresh delivery to your doorstep</li>
                        <li>🌱 Sustainable farming practices</li>
                    </ul>
                `
            },
            cart_abandonment: {
                subject: '🛒 Your fresh eggs are waiting for you!',
                content: `
                    <h2>Don't miss out on fresh organic products!</h2>
                    <p>We noticed you left some items in your cart. Our fresh organic products are still available and waiting for you.</p>
                    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>⏰ Limited Time: Free Delivery on orders over KSH 1,000</h3>
                        <p>Complete your order within 24 hours to qualify!</p>
                    </div>
                    <a href="{{cart_url}}" style="background: #D6A536; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Complete Your Order</a>
                    <p>Questions? Reply to this email or WhatsApp us at +254 714 221885</p>
                `
            },
            weekly_promotion: {
                subject: '🥚 Fresh Weekly Specials from the Farm',
                content: `
                    <h2>This Week's Farm-Fresh Specials!</h2>
                    <p>Hand-picked deals on our freshest organic products, available for a limited time.</p>
                    <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>🔥 Special Offers This Week:</h3>
                        <ul>
                            <li>Fresh Organic Eggs - Buy 2 trays, Get 1 FREE</li>
                            <li>Organic Chicken - 20% OFF all cuts</li>
                            <li>Live Chickens - Special breeding pairs available</li>
                        </ul>
                    </div>
                    <a href="{{shop_url}}" style="background: #A6371F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Shop Weekly Specials</a>
                `
            },
            win_back: {
                subject: '🐔 We miss you! Come back for fresh surprises',
                content: `
                    <h2>We Miss You at Freshplug Organics!</h2>
                    <p>It's been a while since your last visit. Our chickens are asking about you! 🐔</p>
                    <div style="background: #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>🎁 Welcome Back Offer: 25% OFF</h3>
                        <p>Use code: <strong>COMEBACK25</strong> on your next order</p>
                    </div>
                    <p>What's new at the farm:</p>
                    <ul>
                        <li>New heritage chicken breeds available</li>
                        <li>Expanded delivery areas</li>
                        <li>Fresh seasonal products</li>
                    </ul>
                    <a href="{{shop_url}}" style="background: #A6371F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Explore What's New</a>
                `
            },
            birthday_special: {
                subject: '🎂 Happy Birthday from Freshplug Organics!',
                content: `
                    <h2>🎉 Happy Birthday {{customer_name}}!</h2>
                    <p>Another year of freshness! Thank you for being part of our organic farming family.</p>
                    <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>🎁 Birthday Special: 30% OFF + Free Delivery</h3>
                        <p>Use code: <strong>BIRTHDAY30</strong></p>
                        <p>Valid for 7 days from today!</p>
                    </div>
                    <a href="{{shop_url}}" style="background: #e74c3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Claim Birthday Treat</a>
                    <p>Here's to another year of fresh, healthy eating! 🥂</p>
                `
            }
        };
    }
    
    loadSegments() {
        return {
            premium: {
                name: 'Premium Customers',
                criteria: 'totalSpent > 5000',
                count: 0
            },
            frequent: {
                name: 'Frequent Buyers',
                criteria: 'purchases > 5 AND last_purchase < 30_days',
                count: 0
            },
            new_customers: {
                name: 'New Customers',
                criteria: 'join_date > 30_days',
                count: 0
            },
            inactive: {
                name: 'Inactive Customers',
                criteria: 'last_purchase > 60_days',
                count: 0
            },
            egg_lovers: {
                name: 'Egg Enthusiasts',
                criteria: 'products_purchased includes eggs',
                count: 0
            }
        };
    }
    
    // Event Listeners for Customer Actions
    setupEventListeners() {
        // Newsletter signups
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('newsletter-form')) {
                e.preventDefault();
                this.handleNewsletterSignup(e.target);
            }
        });
        
        // Cart abandonment tracking
        if (typeof shoppingCart !== 'undefined') {
            this.trackCartAbandonment();
        }
        
        // Page view tracking for engagement
        this.trackPageViews();
        
        // Purchase tracking
        this.trackPurchases();
    }
    
    handleNewsletterSignup(form) {
        const email = form.querySelector('input[type="email"]').value;
        const name = form.querySelector('input[name="name"]')?.value || '';
        
        if (this.validateEmail(email)) {
            this.addCustomer({
                email: email,
                name: name,
                status: 'active',
                subscriptions: ['newsletter'],
                joinDate: new Date().toISOString()
            });
            
            // Trigger welcome automation
            this.triggerAutomation('customer_registered', { email: email });
            
            this.showNotification('Thank you for subscribing! Welcome email sent.', 'success');
            form.reset();
        }
    }
    
    trackCartAbandonment() {
        let cartCheckTime = Date.now();
        let hasItems = false;
        
        setInterval(() => {
            const currentHasItems = shoppingCart && shoppingCart.length > 0;
            
            if (currentHasItems && !hasItems) {
                // Items added to cart
                cartCheckTime = Date.now();
                hasItems = true;
            } else if (!currentHasItems && hasItems) {
                // Cart emptied (completed purchase)
                hasItems = false;
            } else if (hasItems && (Date.now() - cartCheckTime > 1800000)) { // 30 minutes
                // Cart abandoned for 30 minutes
                this.triggerAutomation('cart_abandoned', {
                    cartValue: this.getCartTotal(),
                    cartItems: shoppingCart
                });
                hasItems = false; // Prevent repeated triggers
            }
        }, 60000); // Check every minute
    }
    
    trackPageViews() {
        // Track page engagement for customer scoring
        const customer = this.getCurrentCustomer();
        if (customer) {
            customer.behavior.websiteVisits = (customer.behavior.websiteVisits || 0) + 1;
            this.saveCustomers();
        }
    }
    
    trackPurchases() {
        // This would be triggered after successful payment
        window.addEventListener('purchase_completed', (e) => {
            const purchaseData = e.detail;
            this.updateCustomerAfterPurchase(purchaseData);
        });
    }
    
    // Customer Segmentation
    segmentCustomers() {
        const segmentedCustomers = {
            premium: [],
            frequent: [],
            new_customers: [],
            inactive: [],
            egg_lovers: []
        };
        
        this.customers.forEach(customer => {
            // Premium customers
            if (customer.totalSpent > 5000) {
                segmentedCustomers.premium.push(customer);
            }
            
            // Frequent buyers
            const daysSinceLastPurchase = this.daysSince(customer.lastPurchase);
            if (daysSinceLastPurchase < 30) {
                segmentedCustomers.frequent.push(customer);
            }
            
            // New customers
            const daysSinceJoin = this.daysSince(customer.joinDate);
            if (daysSinceJoin < 30) {
                segmentedCustomers.new_customers.push(customer);
            }
            
            // Inactive customers
            if (daysSinceLastPurchase > 60) {
                segmentedCustomers.inactive.push(customer);
            }
            
            // Egg lovers
            if (customer.preferences.productInterests.includes('eggs')) {
                segmentedCustomers.egg_lovers.push(customer);
            }
        });
        
        return segmentedCustomers;
    }
    
    // Automation Triggers
    triggerAutomation(triggerType, data) {
        const applicableRules = this.automationRules.filter(rule => 
            rule.trigger === triggerType && rule.active
        );
        
        applicableRules.forEach(rule => {
            if (this.evaluateCondition(rule.condition, data)) {
                if (rule.delay > 0) {
                    setTimeout(() => {
                        this.executeAutomationAction(rule, data);
                    }, rule.delay);
                } else {
                    this.executeAutomationAction(rule, data);
                }
            }
        });
    }
    
    evaluateCondition(condition, data) {
        // Simple condition evaluation - in production, use a proper parser
        switch (condition) {
            case 'first_time_visitor':
                return !this.isReturningCustomer(data.email);
            case 'cart_value > 500':
                return data.cartValue > 500;
            case 'last_purchase > 30_days':
                const customer = this.findCustomerByEmail(data.email);
                return customer && this.daysSince(customer.lastPurchase) > 30;
            case 'active_customer':
                return data.email && this.findCustomerByEmail(data.email)?.status === 'active';
            default:
                return true;
        }
    }
    
    executeAutomationAction(rule, data) {
        switch (rule.action) {
            case 'send_email':
                this.sendAutomatedEmail(rule.template, data);
                break;
            case 'send_welcome_series':
                this.sendWelcomeSeries(data);
                break;
            case 'add_to_segment':
                this.addCustomerToSegment(data.email, rule.segment);
                break;
        }
    }
    
    // Email Marketing
    sendAutomatedEmail(templateName, data) {
        const template = this.emailTemplates[templateName];
        if (!template) return;
        
        const customer = this.findCustomerByEmail(data.email) || data;
        const personalizedContent = this.personalizeEmailContent(template.content, customer, data);
        
        const emailData = {
            to: customer.email,
            subject: this.personalizeEmailContent(template.subject, customer, data),
            content: personalizedContent,
            timestamp: new Date().toISOString(),
            templateUsed: templateName
        };
        
        // In production, integrate with email service (SendGrid, Mailgun, etc.)
        this.simulateEmailSend(emailData);
        
        // Track email sent
        this.trackEmailSent(customer.email, templateName);
    }
    
    personalizeEmailContent(content, customer, data) {
        return content
            .replace(/{{customer_name}}/g, customer.name || 'Valued Customer')
            .replace(/{{shop_url}}/g, window.location.origin + '/shop.html')
            .replace(/{{cart_url}}/g, window.location.origin + '/shop.html#cart')
            .replace(/{{unsubscribe_url}}/g, window.location.origin + '/unsubscribe.html');
    }
    
    simulateEmailSend(emailData) {
        console.log('📧 Email Sent:', emailData);
        
        // Save to sent emails log
        const sentEmails = JSON.parse(localStorage.getItem('freshplug_sent_emails') || '[]');
        sentEmails.push(emailData);
        localStorage.setItem('freshplug_sent_emails', JSON.stringify(sentEmails));
        
        // Update analytics
        this.analytics.emailsSent++;
        
        // Show notification for demo
        this.showNotification(`📧 Automated email sent to ${emailData.to}`, 'info');
    }
    
    sendWelcomeSeries(data) {
        const welcomeEmails = [
            { template: 'welcome_new_customer', delay: 0 },
            { template: 'farm_story', delay: 86400000 }, // 1 day
            { template: 'product_guide', delay: 259200000 }, // 3 days
            { template: 'customer_testimonials', delay: 604800000 } // 7 days
        ];
        
        welcomeEmails.forEach(email => {
            setTimeout(() => {
                this.sendAutomatedEmail(email.template, data);
            }, email.delay);
        });
    }
    
    // Campaign Management
    createCampaign(campaignData) {
        const campaign = {
            id: 'camp_' + Date.now(),
            ...campaignData,
            status: 'draft',
            createdAt: new Date().toISOString(),
            metrics: {
                sent: 0,
                opened: 0,
                clicked: 0,
                converted: 0
            }
        };
        
        this.campaigns.push(campaign);
        this.saveCampaigns();
        return campaign;
    }
    
    launchCampaign(campaignId) {
        const campaign = this.campaigns.find(c => c.id === campaignId);
        if (!campaign) return;
        
        campaign.status = 'active';
        campaign.launchedAt = new Date().toISOString();
        
        // Send to target audience
        const targetCustomers = this.getTargetAudience(campaign.target);
        
        targetCustomers.forEach(customer => {
            this.sendAutomatedEmail(campaign.template, { email: customer.email });
            campaign.metrics.sent++;
        });
        
        this.saveCampaigns();
    }
    
    getTargetAudience(target) {
        switch (target) {
            case 'all_customers':
                return this.customers.filter(c => c.status === 'active');
            case 'new_customers':
                return this.customers.filter(c => this.daysSince(c.joinDate) < 30);
            case 'premium_customers':
                return this.customers.filter(c => c.totalSpent > 5000);
            case 'inactive_customers':
                return this.customers.filter(c => this.daysSince(c.lastPurchase) > 60);
            default:
                return [];
        }
    }
    
    // Analytics and Reporting
    generateMarketingReport() {
        const segmented = this.segmentCustomers();
        
        return {
            overview: {
                totalCustomers: this.customers.length,
                activeCustomers: this.customers.filter(c => c.status === 'active').length,
                emailsSent: this.analytics.emailsSent,
                openRate: this.calculateOpenRate(),
                clickThroughRate: this.calculateCTR(),
                conversionRate: this.calculateConversionRate()
            },
            segments: {
                premium: segmented.premium.length,
                frequent: segmented.frequent.length,
                new: segmented.new_customers.length,
                inactive: segmented.inactive.length,
                eggLovers: segmented.egg_lovers.length
            },
            campaigns: this.campaigns.map(c => ({
                name: c.name,
                status: c.status,
                sent: c.metrics.sent,
                openRate: c.metrics.sent > 0 ? (c.metrics.opened / c.metrics.sent * 100).toFixed(1) + '%' : '0%'
            })),
            recentActivity: this.getRecentMarketingActivity()
        };
    }
    
    calculateOpenRate() {
        return this.analytics.emailsSent > 0 ? 
            (this.analytics.emailsOpened / this.analytics.emailsSent * 100).toFixed(1) + '%' : '0%';
    }
    
    calculateCTR() {
        return this.analytics.emailsOpened > 0 ? 
            (this.analytics.clickThroughs / this.analytics.emailsOpened * 100).toFixed(1) + '%' : '0%';
    }
    
    calculateConversionRate() {
        return this.analytics.clickThroughs > 0 ? 
            (this.analytics.conversions / this.analytics.clickThroughs * 100).toFixed(1) + '%' : '0%';
    }
    
    // Periodic Tasks
    startPeriodicTasks() {
        // Check for birthdays daily
        setInterval(() => {
            this.checkBirthdays();
        }, 86400000); // 24 hours
        
        // Check for inactive customers weekly
        setInterval(() => {
            this.checkInactiveCustomers();
        }, 604800000); // 7 days
        
        // Send weekly campaigns
        this.scheduleWeeklyCampaigns();
    }
    
    checkBirthdays() {
        const today = new Date();
        const todayString = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        this.customers.forEach(customer => {
            if (customer.birthDate) {
                const birthDateString = customer.birthDate.substring(5); // MM-DD format
                if (birthDateString === todayString) {
                    this.triggerAutomation('birthday', { email: customer.email });
                }
            }
        });
    }
    
    checkInactiveCustomers() {
        this.customers.forEach(customer => {
            const daysSinceLastPurchase = this.daysSince(customer.lastPurchase);
            if (daysSinceLastPurchase === 30) { // Exactly 30 days
                this.triggerAutomation('inactive_30_days', { email: customer.email });
            }
        });
    }
    
    scheduleWeeklyCampaigns() {
        // Schedule weekly promotional campaigns
        const runWeeklyCampaign = () => {
            const today = new Date().getDay(); // 0 = Sunday, 4 = Thursday
            if (today === 4) { // Thursday
                const weeklyCampaign = this.campaigns.find(c => c.name === 'Weekly Fresh Eggs Promotion');
                if (weeklyCampaign && weeklyCampaign.status === 'active') {
                    this.launchCampaign(weeklyCampaign.id);
                }
            }
        };
        
        // Check daily at 9 AM (in a real app, use a proper cron job)
        setInterval(runWeeklyCampaign, 86400000); // 24 hours
    }
    
    // Utility Methods
    addCustomer(customerData) {
        const existingCustomer = this.findCustomerByEmail(customerData.email);
        if (existingCustomer) {
            // Update existing customer
            Object.assign(existingCustomer, customerData);
        } else {
            // Add new customer
            const newCustomer = {
                id: 'cust_' + Date.now(),
                ...customerData,
                segment: 'new',
                totalSpent: 0,
                behavior: {
                    websiteVisits: 1,
                    emailOpens: 0,
                    clickThroughs: 0,
                    cartAbandonments: 0
                }
            };
            this.customers.push(newCustomer);
        }
        this.saveCustomers();
    }
    
    findCustomerByEmail(email) {
        return this.customers.find(c => c.email === email);
    }
    
    isReturningCustomer(email) {
        return this.findCustomerByEmail(email) !== undefined;
    }
    
    getCurrentCustomer() {
        // In a real app, this would get the logged-in customer
        const customerData = localStorage.getItem('freshplug_customer');
        return customerData ? JSON.parse(customerData) : null;
    }
    
    daysSince(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    getCartTotal() {
        if (typeof shoppingCart !== 'undefined' && shoppingCart.length > 0) {
            return shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
        return 0;
    }
    
    trackEmailSent(email, template) {
        const customer = this.findCustomerByEmail(email);
        if (customer) {
            customer.behavior.emailsSent = (customer.behavior.emailsSent || 0) + 1;
            this.saveCustomers();
        }
    }
    
    getRecentMarketingActivity() {
        const sentEmails = JSON.parse(localStorage.getItem('freshplug_sent_emails') || '[]');
        return sentEmails.slice(-10).map(email => ({
            type: 'email_sent',
            description: `Email sent to ${email.to}`,
            timestamp: email.timestamp,
            template: email.templateUsed
        }));
    }
    
    // Save methods
    saveCustomers() {
        localStorage.setItem('freshplug_customers', JSON.stringify(this.customers));
    }
    
    saveCampaigns() {
        localStorage.setItem('freshplug_campaigns', JSON.stringify(this.campaigns));
    }
    
    showNotification(message, type) {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
    
    // Public API for external use
    subscribe(email, preferences = {}) {
        this.addCustomer({
            email: email,
            subscriptions: ['newsletter'],
            preferences: preferences,
            joinDate: new Date().toISOString()
        });
        this.triggerAutomation('customer_registered', { email: email });
    }
    
    trackPurchase(customerEmail, purchaseData) {
        const customer = this.findCustomerByEmail(customerEmail);
        if (customer) {
            customer.totalSpent = (customer.totalSpent || 0) + purchaseData.amount;
            customer.lastPurchase = new Date().toISOString();
            this.saveCustomers();
        }
    }
    
    unsubscribe(email) {
        const customer = this.findCustomerByEmail(email);
        if (customer) {
            customer.subscriptions = customer.subscriptions.filter(sub => sub !== 'newsletter');
            this.saveCustomers();
        }
    }
}

// Initialize Marketing Automation
document.addEventListener('DOMContentLoaded', function() {
    window.marketingAutomation = new MarketingAutomation();
    console.log('Marketing Automation System loaded');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarketingAutomation;
}