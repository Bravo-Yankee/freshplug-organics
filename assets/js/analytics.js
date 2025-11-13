// Advanced Analytics & User Behavior Tracking
class FreshplugAnalytics {
    constructor() {
        this.sessionData = {
            sessionId: this.generateSessionId(),
            startTime: Date.now(),
            pageViews: [],
            interactions: [],
            scrollDepth: 0,
            timeOnPage: 0,
            deviceInfo: this.getDeviceInfo(),
            referrer: document.referrer || 'direct'
        };
        
        this.init();
    }
    
    init() {
        this.trackPageView();
        this.initScrollTracking();
        this.initClickTracking();
        this.initFormTracking();
        this.initPerformanceTracking();
        this.initShoppingBehavior();
        this.initHeatmapTracking();
        this.startSessionTimer();
    }
    
    generateSessionId() {
        return 'fp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            colorDepth: screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            online: navigator.onLine,
            cookieEnabled: navigator.cookieEnabled
        };
    }
    
    trackPageView() {
        const pageData = {
            url: window.location.href,
            pathname: window.location.pathname,
            title: document.title,
            timestamp: Date.now(),
            loadTime: performance.timing ? 
                performance.timing.loadEventEnd - performance.timing.navigationStart : null
        };
        
        this.sessionData.pageViews.push(pageData);
        this.sendEvent('page_view', pageData);
        
        // Track specific page types
        this.trackPageType();
    }
    
    trackPageType() {
        const path = window.location.pathname;
        let pageType = 'other';
        
        if (path === '/' || path.includes('index')) {
            pageType = 'homepage';
        } else if (path.includes('shop')) {
            pageType = 'shop';
        } else if (path.includes('product')) {
            pageType = 'product';
        } else if (path.includes('about')) {
            pageType = 'about';
        } else if (path.includes('contact')) {
            pageType = 'contact';
        } else if (path.includes('blog')) {
            pageType = 'blog';
        } else if (path.includes('gallery')) {
            pageType = 'gallery';
        }
        
        this.sendEvent('page_type', { type: pageType });
    }
    
    initScrollTracking() {
        let maxScroll = 0;
        let scrollMilestones = [25, 50, 75, 90, 100];
        let trackedMilestones = [];
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            maxScroll = Math.max(maxScroll, scrollPercent);
            this.sessionData.scrollDepth = maxScroll;
            
            // Track scroll milestones
            scrollMilestones.forEach(milestone => {
                if (scrollPercent >= milestone && !trackedMilestones.includes(milestone)) {
                    trackedMilestones.push(milestone);
                    this.sendEvent('scroll_milestone', { 
                        milestone: milestone + '%',
                        page: window.location.pathname 
                    });
                }
            });
        });
    }
    
    initClickTracking() {
        document.addEventListener('click', (e) => {
            const element = e.target;
            const clickData = {
                element: element.tagName,
                className: element.className,
                id: element.id,
                text: element.textContent?.substring(0, 100),
                href: element.href,
                timestamp: Date.now(),
                coordinates: { x: e.clientX, y: e.clientY }
            };
            
            this.sessionData.interactions.push(clickData);
            
            // Track specific click types
            if (element.classList.contains('btn') || element.tagName === 'BUTTON') {
                this.sendEvent('button_click', {
                    buttonText: element.textContent,
                    buttonClass: element.className,
                    page: window.location.pathname
                });
            }
            
            if (element.tagName === 'A') {
                this.sendEvent('link_click', {
                    linkText: element.textContent,
                    href: element.href,
                    isExternal: element.href && !element.href.includes(window.location.hostname)
                });
            }
            
            // Track WhatsApp clicks
            if (element.href && element.href.includes('wa.me')) {
                this.sendEvent('whatsapp_click', {
                    context: this.getElementContext(element),
                    page: window.location.pathname
                });
            }
            
            // Track product interactions
            if (element.closest('.product-card') || element.closest('.product-item')) {
                const productElement = element.closest('.product-card') || element.closest('.product-item');
                const productName = productElement.querySelector('h3, .product-title')?.textContent;
                
                this.sendEvent('product_interaction', {
                    productName: productName,
                    action: element.textContent,
                    page: window.location.pathname
                });
            }
        });
    }
    
    initFormTracking() {
        // Track form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const formData = {
                formId: form.id,
                formClass: form.className,
                action: form.action,
                method: form.method,
                fieldCount: form.querySelectorAll('input, textarea, select').length,
                page: window.location.pathname
            };
            
            this.sendEvent('form_submit', formData);
        });
        
        // Track form field interactions
        document.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('focus', () => {
                this.sendEvent('form_field_focus', {
                    fieldName: field.name,
                    fieldType: field.type,
                    formId: field.closest('form')?.id
                });
            });
            
            field.addEventListener('blur', () => {
                this.sendEvent('form_field_blur', {
                    fieldName: field.name,
                    hasValue: field.value.length > 0,
                    formId: field.closest('form')?.id
                });
            });
        });
    }
    
    initPerformanceTracking() {
        // Track page load performance
        window.addEventListener('load', () => {
            if (performance.timing) {
                const timing = performance.timing;
                const performanceData = {
                    loadTime: timing.loadEventEnd - timing.navigationStart,
                    domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
                    firstPaint: this.getFirstPaint(),
                    resourceLoadTime: timing.loadEventEnd - timing.domContentLoadedEventEnd
                };
                
                this.sendEvent('page_performance', performanceData);
            }
        });
        
        // Track resource loading errors
        window.addEventListener('error', (e) => {
            if (e.target.tagName) {
                this.sendEvent('resource_error', {
                    element: e.target.tagName,
                    source: e.target.src || e.target.href,
                    message: e.message
                });
            }
        });
    }
    
    getFirstPaint() {
        if (performance.getEntriesByType) {
            const paintEntries = performance.getEntriesByType('paint');
            const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
            return firstPaint ? Math.round(firstPaint.startTime) : null;
        }
        return null;
    }
    
    initShoppingBehavior() {
        // Track cart actions
        if (typeof addToCart === 'function') {
            const originalAddToCart = addToCart;
            window.addToCart = (...args) => {
                this.sendEvent('add_to_cart', {
                    productId: args[0],
                    timestamp: Date.now()
                });
                return originalAddToCart.apply(this, args);
            };
        }
        
        // Track product views
        this.trackProductViews();
        
        // Track search behavior
        this.trackSearchBehavior();
    }
    
    trackProductViews() {
        const products = document.querySelectorAll('.product-card, .product-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const productName = entry.target.querySelector('h3, .product-title')?.textContent;
                    const productPrice = entry.target.querySelector('.price, .product-price')?.textContent;
                    
                    this.sendEvent('product_view', {
                        productName: productName,
                        productPrice: productPrice,
                        viewDuration: Date.now()
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        products.forEach(product => observer.observe(product));
    }
    
    trackSearchBehavior() {
        const searchInputs = document.querySelectorAll('[type="search"], #product-search, #blog-search, #faq-search');
        
        searchInputs.forEach(input => {
            let searchTimeout;
            
            input.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    if (e.target.value.length > 2) {
                        this.sendEvent('search', {
                            query: e.target.value,
                            searchType: this.getSearchType(input),
                            page: window.location.pathname
                        });
                    }
                }, 1000);
            });
        });
    }
    
    getSearchType(input) {
        if (input.id.includes('product')) return 'product';
        if (input.id.includes('blog')) return 'blog';
        if (input.id.includes('faq')) return 'faq';
        return 'general';
    }
    
    initHeatmapTracking() {
        // Simple heatmap data collection
        let clickHeatmap = [];
        
        document.addEventListener('click', (e) => {
            const rect = document.body.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / document.body.offsetWidth) * 100;
            const y = ((e.clientY - rect.top) / document.body.offsetHeight) * 100;
            
            clickHeatmap.push({
                x: Math.round(x * 100) / 100,
                y: Math.round(y * 100) / 100,
                timestamp: Date.now(),
                page: window.location.pathname
            });
            
            // Send heatmap data periodically
            if (clickHeatmap.length >= 10) {
                this.sendEvent('heatmap_data', { clicks: clickHeatmap });
                clickHeatmap = [];
            }
        });
    }
    
    startSessionTimer() {
        // Update time on page every 30 seconds
        setInterval(() => {
            this.sessionData.timeOnPage = Date.now() - this.sessionData.startTime;
        }, 30000);
        
        // Send session data before page unload
        window.addEventListener('beforeunload', () => {
            this.sessionData.timeOnPage = Date.now() - this.sessionData.startTime;
            this.sendSessionData();
        });
        
        // Send periodic session updates
        setInterval(() => {
            this.sendSessionData();
        }, 300000); // Every 5 minutes
    }
    
    getElementContext(element) {
        const contexts = ['hero', 'product', 'footer', 'header', 'sidebar', 'navigation'];
        
        for (let context of contexts) {
            if (element.closest(`.${context}`) || element.closest(`#${context}`)) {
                return context;
            }
        }
        
        return 'unknown';
    }
    
    sendEvent(eventName, eventData) {
        const event = {
            name: eventName,
            data: eventData,
            timestamp: Date.now(),
            sessionId: this.sessionData.sessionId,
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        // Send to analytics service (placeholder)
        this.sendToAnalytics(event);
        
        // Also send to Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        
        // Console log for development
        console.log('Analytics Event:', eventName, eventData);
    }
    
    sendSessionData() {
        const sessionSummary = {
            ...this.sessionData,
            endTime: Date.now(),
            totalInteractions: this.sessionData.interactions.length,
            totalPageViews: this.sessionData.pageViews.length
        };
        
        this.sendToAnalytics(sessionSummary, 'session');
    }
    
    sendToAnalytics(data, type = 'event') {
        // In a real implementation, this would send data to your analytics service
        // For now, we'll store it locally for development purposes
        
        try {
            const analyticsData = JSON.parse(localStorage.getItem('freshplug_analytics') || '[]');
            analyticsData.push({
                type: type,
                data: data,
                timestamp: Date.now()
            });
            
            // Keep only last 1000 events to prevent storage overflow
            if (analyticsData.length > 1000) {
                analyticsData.splice(0, analyticsData.length - 1000);
            }
            
            localStorage.setItem('freshplug_analytics', JSON.stringify(analyticsData));
        } catch (e) {
            console.warn('Analytics storage failed:', e);
        }
        
        // Send to external analytics service (placeholder)
        // fetch('/api/analytics', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ type, data })
        // });
    }
    
    // Public API methods
    trackCustomEvent(eventName, eventData) {
        this.sendEvent(eventName, eventData);
    }
    
    trackConversion(conversionType, value, currency = 'KSH') {
        this.sendEvent('conversion', {
            type: conversionType,
            value: value,
            currency: currency,
            page: window.location.pathname
        });
    }
    
    setUserProperty(property, value) {
        this.sessionData.userProperties = this.sessionData.userProperties || {};
        this.sessionData.userProperties[property] = value;
    }
    
    getAnalyticsData() {
        return JSON.parse(localStorage.getItem('freshplug_analytics') || '[]');
    }
    
    clearAnalyticsData() {
        localStorage.removeItem('freshplug_analytics');
    }
}

// A/B Testing Framework
class ABTestManager {
    constructor() {
        this.tests = {};
        this.userVariants = JSON.parse(localStorage.getItem('ab_test_variants') || '{}');
    }
    
    createTest(testName, variants, trafficSplit = 0.5) {
        this.tests[testName] = {
            variants: variants,
            trafficSplit: trafficSplit,
            startDate: Date.now()
        };
        
        // Assign user to variant if not already assigned
        if (!this.userVariants[testName]) {
            this.userVariants[testName] = Math.random() < trafficSplit ? 'A' : 'B';
            localStorage.setItem('ab_test_variants', JSON.stringify(this.userVariants));
        }
    }
    
    getVariant(testName) {
        return this.userVariants[testName] || 'A';
    }
    
    trackConversion(testName, conversionType) {
        const variant = this.getVariant(testName);
        analytics.trackCustomEvent('ab_test_conversion', {
            testName: testName,
            variant: variant,
            conversionType: conversionType
        });
    }
}

// Customer Behavior Analysis
class CustomerJourneyTracker {
    constructor() {
        this.journey = JSON.parse(localStorage.getItem('customer_journey') || '[]');
        this.sessionStart = Date.now();
    }
    
    addTouchpoint(type, data) {
        const touchpoint = {
            type: type,
            data: data,
            timestamp: Date.now(),
            sessionId: analytics.sessionData.sessionId,
            page: window.location.pathname
        };
        
        this.journey.push(touchpoint);
        this.saveJourney();
        
        // Analyze journey patterns
        this.analyzeJourney();
    }
    
    saveJourney() {
        try {
            localStorage.setItem('customer_journey', JSON.stringify(this.journey));
        } catch (e) {
            // If storage is full, keep only recent touchpoints
            this.journey = this.journey.slice(-50);
            localStorage.setItem('customer_journey', JSON.stringify(this.journey));
        }
    }
    
    analyzeJourney() {
        // Detect patterns in customer journey
        const recentTouchpoints = this.journey.slice(-5);
        
        // Detect abandoned cart
        const hasCartAdd = recentTouchpoints.some(tp => tp.type === 'add_to_cart');
        const hasCheckout = recentTouchpoints.some(tp => tp.type === 'checkout');
        
        if (hasCartAdd && !hasCheckout) {
            setTimeout(() => {
                this.triggerCartAbandonmentRecovery();
            }, 300000); // 5 minutes
        }
        
        // Detect high engagement
        if (recentTouchpoints.length >= 5) {
            analytics.trackCustomEvent('high_engagement_user', {
                touchpointCount: recentTouchpoints.length,
                timeSpent: Date.now() - this.sessionStart
            });
        }
    }
    
    triggerCartAbandonmentRecovery() {
        // Check if user still hasn't completed checkout
        const hasRecentCheckout = this.journey
            .filter(tp => tp.timestamp > Date.now() - 300000)
            .some(tp => tp.type === 'checkout');
        
        if (!hasRecentCheckout) {
            // Show cart recovery notification
            this.showCartRecoveryNotification();
        }
    }
    
    showCartRecoveryNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-green);
            color: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 300px;
            animation: slideIn 0.5s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <i class="fas fa-shopping-cart" style="font-size: 2rem;"></i>
                <div>
                    <h4 style="margin: 0 0 0.5rem 0;">Items in your cart!</h4>
                    <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Complete your order now for fresh delivery</p>
                    <button onclick="document.getElementById('cart-toggle').click(); this.closest('div').remove();" 
                            style="background: white; color: var(--primary-green); border: none; padding: 0.5rem 1rem; border-radius: 5px; margin-top: 0.5rem; cursor: pointer;">
                        View Cart
                    </button>
                </div>
                <button onclick="this.closest('div').remove()" style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; margin-left: auto;">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
        
        analytics.trackCustomEvent('cart_recovery_shown', {
            context: 'automatic',
            timeFromCartAdd: Date.now() - this.sessionStart
        });
    }
    
    getJourneyInsights() {
        const insights = {
            totalTouchpoints: this.journey.length,
            uniquePages: [...new Set(this.journey.map(tp => tp.page))].length,
            sessionDuration: Date.now() - this.sessionStart,
            conversionFunnel: this.getConversionFunnel(),
            topActions: this.getTopActions()
        };
        
        return insights;
    }
    
    getConversionFunnel() {
        const funnelSteps = ['page_view', 'product_view', 'add_to_cart', 'checkout', 'purchase'];
        const funnel = {};
        
        funnelSteps.forEach(step => {
            funnel[step] = this.journey.filter(tp => tp.type === step).length;
        });
        
        return funnel;
    }
    
    getTopActions() {
        const actionCounts = {};
        this.journey.forEach(tp => {
            actionCounts[tp.type] = (actionCounts[tp.type] || 0) + 1;
        });
        
        return Object.entries(actionCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
    }
}

// Initialize analytics
const analytics = new FreshplugAnalytics();
const abTests = new ABTestManager();
const journeyTracker = new CustomerJourneyTracker();

// Example A/B tests
abTests.createTest('hero_cta', {
    A: 'Shop Now',
    B: 'Order Fresh Eggs Today'
}, 0.5);

abTests.createTest('product_layout', {
    A: 'grid',
    B: 'list'
}, 0.3);

// Apply A/B test variants
document.addEventListener('DOMContentLoaded', () => {
    // Hero CTA test
    const heroCtaVariant = abTests.getVariant('hero_cta');
    const heroButtons = document.querySelectorAll('.hero .btn-primary');
    if (heroCtaVariant === 'B' && heroButtons.length > 0) {
        heroButtons[0].textContent = 'Order Fresh Eggs Today';
    }
    
    // Product layout test
    const layoutVariant = abTests.getVariant('product_layout');
    if (layoutVariant === 'B') {
        const productGrids = document.querySelectorAll('.products-grid, .products-container');
        productGrids.forEach(grid => {
            grid.style.display = 'flex';
            grid.style.flexDirection = 'column';
            grid.style.gap = '1rem';
        });
    }
});

// Track journey touchpoints for key interactions
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-primary')) {
        journeyTracker.addTouchpoint('cta_click', {
            buttonText: e.target.textContent,
            context: analytics.getElementContext(e.target)
        });
    }
    
    if (e.target.closest('.add-to-cart')) {
        journeyTracker.addTouchpoint('add_to_cart', {
            productName: e.target.closest('.product-card, .product-item')
                ?.querySelector('h3, .product-title')?.textContent
        });
    }
});

// Export for global access
window.FreshplugAnalytics = {
    analytics,
    abTests,
    journeyTracker
};