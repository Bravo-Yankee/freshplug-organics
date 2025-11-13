// Admin Dashboard Management System
class AdminDashboard {
    constructor() {
        this.stats = this.loadStats();
        this.settings = this.loadSettings();
        this.activityLog = this.loadActivityLog();
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.loadDashboardData();
        this.setupForms();
        this.startRealTimeUpdates();
        console.log('Admin Dashboard initialized');
    }
    
    loadStats() {
        return {
            totalRevenue: 125600,
            mpesaTransactions: 89,
            emailsSent: 156,
            totalOrders: 67,
            conversionRate: 3.2,
            averageOrderValue: 1876
        };
    }
    
    loadSettings() {
        const defaultSettings = {
            mpesa: {
                mode: 'sandbox',
                consumerKey: '',
                consumerSecret: '',
                businessShortCode: '174379',
                passkey: '',
                callbackUrl: ''
            },
            marketing: {
                emailProvider: 'sendgrid',
                apiKey: '',
                automationEnabled: true,
                defaultSender: 'noreply@freshplugorganics.com'
            },
            business: {
                name: 'Freshplug Organics Poultry Farm',
                email: 'info@freshplugorganics.com',
                phone: '+254 714 221885',
                currency: 'KSH'
            },
            notifications: {
                emailOrders: true,
                smsPayments: true,
                whatsappEnabled: true,
                marketingEnabled: true
            }
        };
        
        const saved = localStorage.getItem('freshplug_admin_settings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }
    
    loadActivityLog() {
        const defaultActivity = [
            {
                type: 'payment',
                title: 'M-Pesa Payment Received',
                description: 'KSH 1,200 from +254712345678',
                timestamp: new Date(Date.now() - 3600000).toISOString()
            },
            {
                type: 'email',
                title: 'Welcome Email Sent',
                description: 'To new customer john@email.com',
                timestamp: new Date(Date.now() - 7200000).toISOString()
            },
            {
                type: 'order',
                title: 'New Order Placed',
                description: 'Order #FP123 - Fresh Eggs x2',
                timestamp: new Date(Date.now() - 10800000).toISOString()
            }
        ];
        
        const saved = localStorage.getItem('freshplug_activity_log');
        return saved ? JSON.parse(saved) : defaultActivity;
    }
    
    setupNavigation() {
        const navItems = document.querySelectorAll('.admin-nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active nav
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Show corresponding section
                const section = item.getAttribute('data-section');
                this.showSection(section);
            });
        });
    }
    
    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionName + '-section');
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Load section-specific data
            this.loadSectionData(sectionName);
        }
    }
    
    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'overview':
                this.loadOverviewData();
                break;
            case 'mpesa':
                this.loadMpesaData();
                break;
            case 'marketing':
                this.loadMarketingData();
                break;
            case 'analytics':
                this.loadAnalyticsData();
                break;
            case 'customers':
                this.loadCustomersData();
                break;
            case 'settings':
                this.loadSettingsData();
                break;
        }
    }
    
    loadDashboardData() {
        this.updateStats();
        this.loadActivityLog();
        this.loadOverviewData();
    }
    
    updateStats() {
        // Update overview stats
        document.getElementById('total-revenue').textContent = `KSH ${this.stats.totalRevenue.toLocaleString()}`;
        document.getElementById('mpesa-transactions').textContent = this.stats.mpesaTransactions;
        document.getElementById('emails-sent').textContent = this.stats.emailsSent;
        document.getElementById('total-orders').textContent = this.stats.totalOrders;
    }
    
    loadOverviewData() {
        this.renderActivityLog();
        this.updateSystemStatus();
    }
    
    renderActivityLog() {
        const container = document.getElementById('activity-log');
        if (!container) return;
        
        container.innerHTML = this.activityLog.slice(0, 10).map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-details">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-desc">${activity.description}</div>
                </div>
                <div class="activity-time">${this.formatTime(activity.timestamp)}</div>
            </div>
        `).join('');
    }
    
    getActivityIcon(type) {
        const icons = {
            payment: 'mobile-alt',
            email: 'envelope',
            order: 'shopping-cart',
            user: 'user',
            system: 'cog'
        };
        return icons[type] || 'info-circle';
    }
    
    updateSystemStatus() {
        // Update M-Pesa status
        const mpesaStatus = document.getElementById('mpesa-status');
        if (mpesaStatus) {
            const indicator = mpesaStatus.querySelector('.status-indicator');
            const text = mpesaStatus.querySelector('span');
            
            if (this.settings.mpesa.mode === 'production') {
                indicator.className = 'status-indicator status-connected';
                text.textContent = 'M-Pesa: Live Mode';
            } else {
                indicator.className = 'status-indicator status-testing';
                text.textContent = 'M-Pesa: Sandbox Mode';
            }
        }
    }
    
    loadMpesaData() {
        // Load M-Pesa configuration form
        this.loadMpesaConfig();
        this.loadMpesaTransactions();
    }
    
    loadMpesaConfig() {
        const form = document.getElementById('mpesa-config-form');
        if (!form) return;
        
        // Populate form with current settings
        document.getElementById('mpesa-mode').value = this.settings.mpesa.mode;
        document.getElementById('consumer-key').value = this.settings.mpesa.consumerKey;
        document.getElementById('consumer-secret').value = this.settings.mpesa.consumerSecret;
        document.getElementById('business-shortcode').value = this.settings.mpesa.businessShortCode;
        document.getElementById('passkey').value = this.settings.mpesa.passkey;
    }
    
    loadMpesaTransactions() {
        const container = document.getElementById('mpesa-transactions-log');
        if (!container) return;
        
        // Sample M-Pesa transactions
        const transactions = [
            {
                id: 'MPX123456789',
                phone: '+254712345678',
                amount: 1200,
                status: 'completed',
                timestamp: new Date().toISOString()
            }
        ];
        
        container.innerHTML = `
            <h4>Recent Transactions</h4>
            ${transactions.map(tx => `
                <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>KSH ${tx.amount.toLocaleString()}</strong>
                            <div style="font-size: 0.9rem; color: var(--text-light);">${tx.phone}</div>
                        </div>
                        <div>
                            <span class="order-status status-${tx.status}">${tx.status}</span>
                            <div style="font-size: 0.8rem; color: var(--text-light);">${this.formatTime(tx.timestamp)}</div>
                        </div>
                    </div>
                </div>
            `).join('')}
        `;
    }
    
    loadMarketingData() {
        this.loadCampaigns();
        this.loadAutomationRules();
        this.loadEmailTemplates();
    }
    
    loadCampaigns() {
        const container = document.getElementById('campaigns-list');
        if (!container) return;
        
        const campaigns = window.marketingAutomation ? window.marketingAutomation.campaigns : [];
        
        container.innerHTML = campaigns.length > 0 ? campaigns.map(campaign => `
            <div class="campaign-item">
                <div>
                    <strong>${campaign.name}</strong>
                    <div style="font-size: 0.9rem; color: var(--text-light);">
                        Sent: ${campaign.metrics.sent} | Opened: ${campaign.metrics.opened}
                    </div>
                </div>
                <div>
                    <span class="campaign-status status-${campaign.status}">${campaign.status}</span>
                    <button class="btn btn-small btn-outline" onclick="adminDashboard.editCampaign('${campaign.id}')">Edit</button>
                </div>
            </div>
        `).join('') : '<p>No campaigns found. Create your first campaign to get started.</p>';
    }
    
    loadAutomationRules() {
        const container = document.getElementById('automation-rules');
        if (!container) return;
        
        const rules = window.marketingAutomation ? window.marketingAutomation.automationRules : [];
        
        container.innerHTML = rules.map(rule => `
            <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${rule.name}</strong>
                        <div style="font-size: 0.9rem; color: var(--text-light);">
                            Trigger: ${rule.trigger} | ${rule.active ? 'Active' : 'Inactive'}
                        </div>
                    </div>
                    <div>
                        <div class="toggle-switch ${rule.active ? 'active' : ''}" onclick="adminDashboard.toggleRule('${rule.id}', this)"></div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    loadEmailTemplates() {
        const container = document.getElementById('email-templates');
        if (!container) return;
        
        const templates = window.marketingAutomation ? Object.keys(window.marketingAutomation.emailTemplates) : [];
        
        container.innerHTML = `
            <div style="display: grid; gap: 1rem;">
                ${templates.map(template => `
                    <div style="padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong>${template.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong>
                                <div style="font-size: 0.9rem; color: var(--text-light);">Email template</div>
                            </div>
                            <div>
                                <button class="btn btn-small btn-outline" onclick="adminDashboard.editTemplate('${template}')">Edit</button>
                                <button class="btn btn-small btn-primary" onclick="adminDashboard.previewTemplate('${template}')">Preview</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    loadAnalyticsData() {
        this.loadMarketingMetrics();
        this.loadBehaviorAnalytics();
    }
    
    loadMarketingMetrics() {
        const container = document.getElementById('marketing-metrics');
        if (!container) return;
        
        const report = window.marketingAutomation ? window.marketingAutomation.generateMarketingReport() : null;
        
        if (report) {
            container.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                    <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--primary-green);">${report.overview.openRate}</div>
                        <div>Email Open Rate</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--warm-orange);">${report.overview.clickThroughRate}</div>
                        <div>Click Through Rate</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--text-dark);">${report.overview.totalCustomers}</div>
                        <div>Total Customers</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--secondary-green);">${report.overview.conversionRate}</div>
                        <div>Conversion Rate</div>
                    </div>
                </div>
            `;
        }
    }
    
    loadBehaviorAnalytics() {
        const container = document.getElementById('behavior-analytics');
        if (!container) return;
        
        const analytics = localStorage.getItem('freshplug_analytics');
        const data = analytics ? JSON.parse(analytics) : [];
        
        container.innerHTML = `
            <div style="display: grid; gap: 1rem;">
                <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                    <h4>Website Analytics</h4>
                    <p>Total Events Tracked: ${data.length}</p>
                    <p>Recent Activity: ${data.slice(-5).length} events in last session</p>
                </div>
                <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                    <h4>User Behavior</h4>
                    <p>Page Views: ${data.filter(d => d.type === 'event' && d.data.name === 'page_view').length}</p>
                    <p>Button Clicks: ${data.filter(d => d.type === 'event' && d.data.name === 'button_click').length}</p>
                </div>
            </div>
        `;
    }
    
    loadCustomersData() {
        this.loadCustomerSegments();
        this.loadCustomerList();
    }
    
    loadCustomerSegments() {
        const container = document.getElementById('customer-segments');
        if (!container) return;
        
        const segmented = window.marketingAutomation ? window.marketingAutomation.segmentCustomers() : {};
        
        container.innerHTML = `
            <div style="display: grid; gap: 1rem;">
                ${Object.entries(segmented).map(([segment, customers]) => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                        <div>
                            <strong>${segment.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong>
                            <div style="font-size: 0.9rem; color: var(--text-light);">${customers.length} customers</div>
                        </div>
                        <button class="btn btn-small btn-outline" onclick="adminDashboard.viewSegment('${segment}')">View</button>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    loadCustomerList() {
        const container = document.getElementById('customer-list');
        if (!container) return;
        
        const customers = window.marketingAutomation ? window.marketingAutomation.customers.slice(0, 10) : [];
        
        container.innerHTML = `
            <div style="max-height: 400px; overflow-y: auto;">
                ${customers.map(customer => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #f0f0f0;">
                        <div>
                            <strong>${customer.name || customer.email}</strong>
                            <div style="font-size: 0.9rem; color: var(--text-light);">
                                Spent: KSH ${(customer.totalSpent || 0).toLocaleString()} | 
                                Status: ${customer.status || 'active'}
                            </div>
                        </div>
                        <button class="btn btn-small btn-outline" onclick="adminDashboard.viewCustomer('${customer.id}')">View</button>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    loadSettingsData() {
        this.loadGeneralSettings();
    }
    
    loadGeneralSettings() {
        // Populate general settings form
        document.getElementById('business-name').value = this.settings.business.name;
        document.getElementById('business-email').value = this.settings.business.email;
        document.getElementById('business-phone').value = this.settings.business.phone;
        document.getElementById('currency').value = this.settings.business.currency;
    }
    
    setupForms() {
        // M-Pesa configuration form
        const mpesaForm = document.getElementById('mpesa-config-form');
        if (mpesaForm) {
            mpesaForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveMpesaConfig();
            });
        }
        
        // General settings form
        const settingsForm = document.getElementById('general-settings-form');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveGeneralSettings();
            });
        }
    }
    
    saveMpesaConfig() {
        this.settings.mpesa = {
            mode: document.getElementById('mpesa-mode').value,
            consumerKey: document.getElementById('consumer-key').value,
            consumerSecret: document.getElementById('consumer-secret').value,
            businessShortCode: document.getElementById('business-shortcode').value,
            passkey: document.getElementById('passkey').value
        };
        
        this.saveSettings();
        this.updateSystemStatus();
        this.showNotification('M-Pesa configuration saved successfully!', 'success');
    }
    
    saveGeneralSettings() {
        this.settings.business = {
            name: document.getElementById('business-name').value,
            email: document.getElementById('business-email').value,
            phone: document.getElementById('business-phone').value,
            currency: document.getElementById('currency').value
        };
        
        this.saveSettings();
        this.showNotification('General settings saved successfully!', 'success');
    }
    
    saveSettings() {
        localStorage.setItem('freshplug_admin_settings', JSON.stringify(this.settings));
    }
    
    addActivity(type, title, description) {
        const activity = {
            type: type,
            title: title,
            description: description,
            timestamp: new Date().toISOString()
        };
        
        this.activityLog.unshift(activity);
        this.activityLog = this.activityLog.slice(0, 50); // Keep last 50 activities
        
        localStorage.setItem('freshplug_activity_log', JSON.stringify(this.activityLog));
        this.renderActivityLog();
    }
    
    startRealTimeUpdates() {
        // Update stats every 30 seconds
        setInterval(() => {
            this.updateStats();
        }, 30000);
        
        // Check for new activities every minute
        setInterval(() => {
            this.checkForNewActivity();
        }, 60000);
    }
    
    checkForNewActivity() {
        // Check for new orders, payments, emails, etc.
        const cartData = localStorage.getItem('freshplug_cart');
        const emailData = localStorage.getItem('freshplug_sent_emails');
        
        // This would connect to real-time data sources in production
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) {
            return 'Just now';
        } else if (diff < 3600000) {
            return `${Math.floor(diff / 60000)}m ago`;
        } else if (diff < 86400000) {
            return `${Math.floor(diff / 3600000)}h ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
    
    showNotification(message, type) {
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
    
    // Public methods for button actions
    editCampaign(campaignId) {
        this.showNotification('Campaign editor would open here', 'info');
    }
    
    createNewCampaign() {
        this.showNotification('New campaign creation wizard would open here', 'info');
    }
    
    createNewRule() {
        this.showNotification('Automation rule builder would open here', 'info');
    }
    
    createNewTemplate() {
        this.showNotification('Email template editor would open here', 'info');
    }
    
    toggleRule(ruleId, toggle) {
        toggle.classList.toggle('active');
        const isActive = toggle.classList.contains('active');
        
        if (window.marketingAutomation) {
            const rule = window.marketingAutomation.automationRules.find(r => r.id === ruleId);
            if (rule) {
                rule.active = isActive;
                this.showNotification(`Rule ${isActive ? 'activated' : 'deactivated'}`, 'success');
            }
        }
    }
    
    editTemplate(templateName) {
        this.showNotification(`Template editor for ${templateName} would open here`, 'info');
    }
    
    previewTemplate(templateName) {
        this.showNotification(`Template preview for ${templateName} would open here`, 'info');
    }
    
    viewSegment(segment) {
        this.showNotification(`Customer segment view for ${segment} would open here`, 'info');
    }
    
    viewCustomer(customerId) {
        this.showNotification(`Customer profile for ${customerId} would open here`, 'info');
    }
}

// Global functions for HTML onclick events
function toggleSetting(element) {
    element.classList.toggle('active');
    const isActive = element.classList.contains('active');
    adminDashboard.showNotification(`Setting ${isActive ? 'enabled' : 'disabled'}`, 'success');
}

function testMpesaConnection() {
    adminDashboard.showNotification('Testing M-Pesa connection...', 'info');
    
    // Simulate connection test
    setTimeout(() => {
        adminDashboard.showNotification('M-Pesa connection test successful!', 'success');
    }, 2000);
}

function createNewCampaign() {
    adminDashboard.createNewCampaign();
}

function createNewRule() {
    adminDashboard.createNewRule();
}

function createNewTemplate() {
    adminDashboard.createNewTemplate();
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    window.adminDashboard = new AdminDashboard();
    console.log('Admin Dashboard loaded');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminDashboard;
}