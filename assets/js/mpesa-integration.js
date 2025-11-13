// M-Pesa Payment Integration for Freshplug Organics
class MpesaPaymentGateway {
    constructor() {
        this.apiUrl = 'https://sandbox-api.safaricom.co.ke'; // Change to live for production
        this.consumerKey = 'YOUR_CONSUMER_KEY'; // Replace with actual keys
        this.consumerSecret = 'YOUR_CONSUMER_SECRET';
        this.businessShortCode = '174379'; // Your business short code
        this.passkey = 'YOUR_PASSKEY'; // Your passkey
        this.callbackUrl = 'https://yourwebsite.com/api/mpesa-callback';
        this.accessToken = null;
        this.isProduction = false; // Set to true for live environment
        
        this.init();
    }
    
    async init() {
        await this.generateAccessToken();
        this.setupPaymentUI();
    }
    
    // Generate OAuth Access Token
    async generateAccessToken() {
        try {
            const credentials = btoa(`${this.consumerKey}:${this.consumerSecret}`);
            
            const response = await fetch(`${this.apiUrl}/oauth/v1/generate?grant_type=client_credentials`, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            this.accessToken = data.access_token;
            
            console.log('M-Pesa access token generated successfully');
            return this.accessToken;
            
        } catch (error) {
            console.error('Error generating M-Pesa access token:', error);
            throw error;
        }
    }
    
    // Initiate STK Push (Lipa Na M-Pesa Online)
    async initiateSTKPush(phoneNumber, amount, accountReference, transactionDesc) {
        try {
            if (!this.accessToken) {
                await this.generateAccessToken();
            }
            
            const timestamp = this.generateTimestamp();
            const password = btoa(`${this.businessShortCode}${this.passkey}${timestamp}`);
            
            const requestBody = {
                BusinessShortCode: this.businessShortCode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phoneNumber,
                PartyB: this.businessShortCode,
                PhoneNumber: phoneNumber,
                CallBackURL: this.callbackUrl,
                AccountReference: accountReference,
                TransactionDesc: transactionDesc
            };
            
            const response = await fetch(`${this.apiUrl}/mpesa/stkpush/v1/processrequest`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            const data = await response.json();
            
            if (data.ResponseCode === '0') {
                console.log('STK Push sent successfully:', data);
                return {
                    success: true,
                    checkoutRequestID: data.CheckoutRequestID,
                    merchantRequestID: data.MerchantRequestID,
                    responseDescription: data.ResponseDescription
                };
            } else {
                throw new Error(data.ResponseDescription || 'STK Push failed');
            }
            
        } catch (error) {
            console.error('Error initiating STK Push:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Query STK Push Status
    async querySTKStatus(checkoutRequestID) {
        try {
            if (!this.accessToken) {
                await this.generateAccessToken();
            }
            
            const timestamp = this.generateTimestamp();
            const password = btoa(`${this.businessShortCode}${this.passkey}${timestamp}`);
            
            const requestBody = {
                BusinessShortCode: this.businessShortCode,
                Password: password,
                Timestamp: timestamp,
                CheckoutRequestID: checkoutRequestID
            };
            
            const response = await fetch(`${this.apiUrl}/mpesa/stkpushquery/v1/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error('Error querying STK status:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Generate timestamp for M-Pesa
    generateTimestamp() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }
    
    // Format phone number for M-Pesa (254XXXXXXXXX)
    formatPhoneNumber(phoneNumber) {
        let formatted = phoneNumber.replace(/\D/g, ''); // Remove non-digits
        
        if (formatted.startsWith('0')) {
            formatted = '254' + formatted.substring(1);
        } else if (formatted.startsWith('+254')) {
            formatted = formatted.substring(1);
        } else if (formatted.startsWith('254')) {
            // Already formatted
        } else if (formatted.length === 9) {
            formatted = '254' + formatted;
        }
        
        return formatted;
    }
    
    // Validate phone number
    validatePhoneNumber(phoneNumber) {
        const formatted = this.formatPhoneNumber(phoneNumber);
        return /^254[17]\d{8}$/.test(formatted);
    }
    
    // Setup Payment UI
    setupPaymentUI() {
        // Add M-Pesa payment option to existing checkout
        this.addMpesaPaymentOption();
        this.setupPaymentModal();
    }
    
    addMpesaPaymentOption() {
        // Find checkout buttons and add M-Pesa option
        const checkoutButtons = document.querySelectorAll('.checkout-btn, .btn-primary');
        
        checkoutButtons.forEach(button => {
            if (button.textContent.includes('Checkout') || button.textContent.includes('Proceed')) {
                // Create M-Pesa button
                const mpesaButton = document.createElement('button');
                mpesaButton.className = 'btn mpesa-btn';
                mpesaButton.innerHTML = `
                    <img src="assets/images/mpesa-logo.png" alt="M-Pesa" style="height: 20px; margin-right: 8px;">
                    Pay with M-Pesa
                `;
                mpesaButton.style.cssText = `
                    background: #00a86b;
                    color: white;
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 8px;
                    margin: 0.5rem 0;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                `;
                
                mpesaButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showMpesaPaymentModal();
                });
                
                // Insert M-Pesa button after the original checkout button
                button.parentNode.insertBefore(mpesaButton, button.nextSibling);
            }
        });
    }
    
    setupPaymentModal() {
        // Create M-Pesa payment modal
        const modal = document.createElement('div');
        modal.id = 'mpesa-payment-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3>
                        <img src="assets/images/mpesa-logo.png" alt="M-Pesa" style="height: 25px; margin-right: 10px;">
                        M-Pesa Payment
                    </h3>
                    <button class="modal-close" onclick="mpesaGateway.closeMpesaModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="payment-summary" id="payment-summary">
                        <!-- Payment details will be populated here -->
                    </div>
                    
                    <form id="mpesa-payment-form" style="margin-top: 2rem;">
                        <div class="form-group">
                            <label for="mpesa-phone">M-Pesa Phone Number</label>
                            <input type="tel" id="mpesa-phone" placeholder="0712345678 or +254712345678" required>
                            <small style="color: var(--text-light);">Enter the phone number registered with M-Pesa</small>
                        </div>
                        
                        <div class="payment-instructions" style="background: #e8f5e9; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                            <h4 style="margin: 0 0 0.5rem 0; color: var(--primary-green);">Payment Instructions:</h4>
                            <ol style="margin: 0; padding-left: 1.2rem; color: var(--text-dark);">
                                <li>Enter your M-Pesa phone number above</li>
                                <li>Click "Pay Now" to initiate payment</li>
                                <li>You'll receive an M-Pesa prompt on your phone</li>
                                <li>Enter your M-Pesa PIN to complete payment</li>
                                <li>You'll receive a confirmation SMS</li>
                            </ol>
                        </div>
                        
                        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem;">
                            Pay KSH <span id="payment-amount">0</span> Now
                        </button>
                    </form>
                    
                    <div class="payment-status" id="payment-status" style="display: none;">
                        <!-- Payment status will be shown here -->
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup form submission
        document.getElementById('mpesa-payment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processMpesaPayment();
        });
    }
    
    showMpesaPaymentModal() {
        const modal = document.getElementById('mpesa-payment-modal');
        
        // Get cart total and items
        const cartTotal = this.getCartTotal();
        const cartItems = this.getCartItems();
        
        // Populate payment summary
        const paymentSummary = document.getElementById('payment-summary');
        paymentSummary.innerHTML = `
            <h4>Order Summary</h4>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                ${cartItems.map(item => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>${item.name} x${item.quantity}</span>
                        <span>KSH ${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                `).join('')}
                <hr style="margin: 0.5rem 0;">
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1rem;">
                    <span>Total Amount</span>
                    <span>KSH ${cartTotal.toLocaleString()}</span>
                </div>
            </div>
        `;
        
        // Update payment amount in button
        document.getElementById('payment-amount').textContent = cartTotal.toLocaleString();
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeMpesaModal() {
        const modal = document.getElementById('mpesa-payment-modal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset form
        document.getElementById('mpesa-payment-form').reset();
        document.getElementById('payment-status').style.display = 'none';
    }
    
    async processMpesaPayment() {
        const phoneNumber = document.getElementById('mpesa-phone').value;
        const amount = this.getCartTotal();
        
        // Validate phone number
        if (!this.validatePhoneNumber(phoneNumber)) {
            this.showPaymentStatus('error', 'Please enter a valid M-Pesa phone number');
            return;
        }
        
        // Show loading state
        this.showPaymentStatus('loading', 'Initiating M-Pesa payment...');
        
        const formattedPhone = this.formatPhoneNumber(phoneNumber);
        const accountReference = 'FreshPlug-' + Date.now();
        const transactionDesc = `Payment for Freshplug Organics order`;
        
        try {
            const result = await this.initiateSTKPush(
                formattedPhone,
                amount,
                accountReference,
                transactionDesc
            );
            
            if (result.success) {
                this.showPaymentStatus('pending', `
                    <div style="text-align: center;">
                        <i class="fas fa-mobile-alt" style="font-size: 2rem; color: var(--primary-green); margin-bottom: 1rem;"></i>
                        <h4>Payment Request Sent!</h4>
                        <p>Please check your phone (${phoneNumber}) for the M-Pesa payment prompt.</p>
                        <p>Enter your M-Pesa PIN to complete the payment.</p>
                        <div class="loading-spinner" style="margin: 1rem 0;"></div>
                        <small>Waiting for payment confirmation...</small>
                    </div>
                `);
                
                // Start polling for payment status
                this.pollPaymentStatus(result.checkoutRequestID);
                
            } else {
                this.showPaymentStatus('error', result.error || 'Failed to initiate payment');
            }
            
        } catch (error) {
            this.showPaymentStatus('error', 'Payment failed. Please try again.');
            console.error('M-Pesa payment error:', error);
        }
    }
    
    async pollPaymentStatus(checkoutRequestID, attempts = 0, maxAttempts = 30) {
        if (attempts >= maxAttempts) {
            this.showPaymentStatus('timeout', 'Payment timeout. Please check your M-Pesa messages or try again.');
            return;
        }
        
        try {
            const status = await this.querySTKStatus(checkoutRequestID);
            
            if (status.ResultCode === '0') {
                // Payment successful
                this.handleSuccessfulPayment(status);
            } else if (status.ResultCode === '1032') {
                // User cancelled
                this.showPaymentStatus('cancelled', 'Payment was cancelled. You can try again.');
            } else if (status.ResultCode === '1037') {
                // Timeout
                this.showPaymentStatus('timeout', 'Payment timeout. Please try again.');
            } else if (status.ResultCode === '1') {
                // Still pending, continue polling
                setTimeout(() => {
                    this.pollPaymentStatus(checkoutRequestID, attempts + 1, maxAttempts);
                }, 2000);
            } else {
                // Other error
                this.showPaymentStatus('error', status.ResultDesc || 'Payment failed');
            }
            
        } catch (error) {
            console.error('Error polling payment status:', error);
            setTimeout(() => {
                this.pollPaymentStatus(checkoutRequestID, attempts + 1, maxAttempts);
            }, 2000);
        }
    }
    
    handleSuccessfulPayment(paymentData) {
        // Clear cart
        this.clearCart();
        
        // Show success message
        this.showPaymentStatus('success', `
            <div style="text-align: center;">
                <i class="fas fa-check-circle" style="font-size: 2rem; color: var(--primary-green); margin-bottom: 1rem;"></i>
                <h4>Payment Successful!</h4>
                <p>Your payment of KSH ${this.getCartTotal().toLocaleString()} has been received.</p>
                <p><strong>Transaction ID:</strong> ${paymentData.MpesaReceiptNumber || 'N/A'}</p>
                <p>You will receive an SMS confirmation shortly.</p>
                <button class="btn btn-primary" onclick="mpesaGateway.closeMpesaModal(); window.location.href='customer-account.html'">
                    View Order Status
                </button>
            </div>
        `);
        
        // Track conversion
        if (typeof analytics !== 'undefined') {
            analytics.trackConversion('mpesa_payment', this.getCartTotal(), 'KSH');
        }
        
        // Send order confirmation
        this.sendOrderConfirmation(paymentData);
    }
    
    showPaymentStatus(type, message) {
        const form = document.getElementById('mpesa-payment-form');
        const statusDiv = document.getElementById('payment-status');
        
        const statusColors = {
            loading: '#2196F3',
            pending: '#FF9800',
            success: '#4CAF50',
            error: '#f44336',
            cancelled: '#FF5722',
            timeout: '#FF9800'
        };
        
        if (type === 'loading' || type === 'pending') {
            form.style.display = 'none';
        } else {
            // Show form again for retry if error
            if (type === 'error' || type === 'cancelled' || type === 'timeout') {
                setTimeout(() => {
                    form.style.display = 'block';
                    statusDiv.style.display = 'none';
                }, 5000);
            }
        }
        
        statusDiv.innerHTML = `
            <div style="
                background: ${statusColors[type]}; 
                color: white; 
                padding: 1.5rem; 
                border-radius: 8px; 
                text-align: center;
            ">
                ${message}
            </div>
        `;
        
        statusDiv.style.display = 'block';
    }
    
    // Helper methods for cart integration
    getCartTotal() {
        if (typeof shoppingCart !== 'undefined' && shoppingCart.length > 0) {
            return shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
        return 1; // Minimum amount for testing
    }
    
    getCartItems() {
        if (typeof shoppingCart !== 'undefined') {
            return shoppingCart;
        }
        return [{ name: 'Test Product', quantity: 1, price: 1 }];
    }
    
    clearCart() {
        if (typeof shoppingCart !== 'undefined') {
            shoppingCart.length = 0;
            localStorage.setItem('freshplug_cart', JSON.stringify(shoppingCart));
            if (typeof updateCartUI === 'function') {
                updateCartUI();
            }
        }
    }
    
    sendOrderConfirmation(paymentData) {
        // Send confirmation via WhatsApp or email
        const orderDetails = {
            items: this.getCartItems(),
            total: this.getCartTotal(),
            paymentId: paymentData.MpesaReceiptNumber,
            timestamp: new Date().toISOString()
        };
        
        // In a real implementation, this would send to your backend
        console.log('Order confirmation:', orderDetails);
        
        // Optional: Send WhatsApp message to business
        const businessMessage = `New order received!
        
Order Total: KSH ${orderDetails.total.toLocaleString()}
Payment ID: ${orderDetails.paymentId}
Items: ${orderDetails.items.map(item => `${item.name} x${item.quantity}`).join(', ')}

Please prepare the order for delivery.`;
        
        // You can automatically send this to your business WhatsApp
        // window.open(`https://wa.me/254714221885?text=${encodeURIComponent(businessMessage)}`);
    }
}

// Initialize M-Pesa gateway when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.mpesaGateway = new MpesaPaymentGateway();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MpesaPaymentGateway;
}