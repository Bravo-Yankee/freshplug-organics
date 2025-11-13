# 🐔 Freshplug Organics Poultry Farm Website

[![Website Status](https://img.shields.io/badge/status-live-brightgreen)](https://your-username.github.io/freshplug-organics)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Responsive](https://img.shields.io/badge/responsive-yes-brightgreen)](https://your-username.github.io/freshplug-organics)

A comprehensive e-commerce website for **Freshplug Organics Poultry Farm** - Kenya's premier organic poultry farming business. Features a complete online shopping experience with local payment integration, farm tours, and educational content.

## 🌟 Features

### 🛒 **E-commerce Functionality**
- **Product Catalog**: Fresh eggs, organic chicken, live birds, day-old chicks
- **Shopping Cart**: Dynamic cart with KSH pricing and quantity management
- **Multiple Order Channels**: Website, WhatsApp Business integration, phone orders
- **Local Payments**: M-Pesa integration, bank transfers, cash on delivery
- **Delivery Management**: Geographic coverage, minimum orders, free delivery thresholds

### 🏡 **Farm Experience**
- **Virtual Farm Tours**: Interactive photo gallery with filtering
- **Educational Content**: Blog posts about organic farming and sustainability
- **Real Farm Photos**: 22 high-quality images showcasing operations
- **Customer Testimonials**: Social proof from satisfied customers
- **Certification Badges**: Organic, animal welfare, and sustainability credentials

### 📱 **Modern Web Experience**
- **Responsive Design**: Perfect on desktop, tablet, and mobile devices
- **Professional Branding**: Custom SVG logo inspired by industry leaders
- **Dynamic Content**: Automatic year updates, real-time cart calculations
- **SEO Optimized**: Structured for search engine discovery
- **Fast Loading**: Optimized images and efficient code structure

### 🇰🇪 **Kenya-Specific Features**
- **Local Currency**: All pricing in Kenyan Shillings (KSH)
- **Legal Compliance**: Privacy policy and terms aligned with Kenya law
- **Cultural Adaptation**: Local business practices and communication styles
- **Payment Integration**: M-Pesa and local banking support
- **Delivery Logistics**: Kenya-specific geographic coverage

## 🏗️ Project Structure

```
freshplug-organics/
│
├── 📄 HTML Pages
│   ├── index.html              # Homepage with hero section and product overview
│   ├── about.html              # Farm story and mission
│   ├── products.html           # Complete product catalog
│   ├── shop.html               # E-commerce shopping interface
│   ├── gallery.html            # Photo gallery with filtering
│   ├── blog.html               # Farm blog and educational content
│   ├── contact.html            # Contact information and inquiry form
│   ├── faq.html                # Frequently asked questions
│   ├── process.html            # Organic farming process details
│   ├── customer-account.html   # Customer portal and order history
│   ├── admin-dashboard.html    # Administrative interface
│   ├── privacy-policy.html     # Comprehensive privacy policy
│   └── terms-of-service.html   # Terms and conditions
│
├── 🎨 Assets
│   ├── css/
│   │   └── style.css           # Complete responsive styling
│   ├── js/
│   │   ├── main.js             # Core website functionality
│   │   ├── shop.js             # E-commerce cart and checkout
│   │   ├── gallery.js          # Photo gallery interactions
│   │   ├── blog.js             # Blog functionality
│   │   ├── customer-account.js # Customer portal features
│   │   ├── admin-dashboard.js  # Administrative tools
│   │   ├── analytics.js        # Website analytics
│   │   ├── marketing-automation.js # Marketing tools
│   │   └── mpesa-integration.js # M-Pesa payment processing
│   └── images/
│       ├── freshplug-logo.svg        # Main company logo
│       ├── freshplug-logo-small.svg  # Compact logo
│       ├── hero-farm.jpg             # Homepage hero image
│       ├── fresh-eggs.jpg            # Product photography
│       ├── organic-chicken.jpg       # Product photography
│       ├── farm-facility.jpg         # Farm infrastructure
│       ├── certification badges/     # Trust and quality badges
│       └── gallery/                  # Complete photo collection
│
└── 📋 Documentation
    ├── README.md                     # This file
    ├── LEGAL_PAGES_SUMMARY.md       # Legal documentation guide
    ├── CURRENCY_CONVERSION_SUMMARY.md # KSH pricing implementation
    └── LOGO_IMPLEMENTATION.md       # Branding guidelines
```

## 🚀 Quick Start

### **Option 1: GitHub Pages (Recommended)**
1. Fork this repository
2. Go to repository Settings → Pages
3. Select "Deploy from branch" → "main"
4. Your site will be live at: `https://yourusername.github.io/freshplug-organics`

### **Option 2: Local Development**
```bash
# Clone the repository
git clone https://github.com/yourusername/freshplug-organics.git

# Navigate to project directory
cd freshplug-organics

# Start local server (Python 3)
python3 -m http.server 8080

# Or with Node.js
npx http-server -p 8080

# Visit http://localhost:8080
```

### **Option 3: Web Hosting**
Upload all files to your web hosting provider's public directory (usually `public_html` or `www`).

## ⚙️ Customization

### **Required Setup Steps:**

#### 1. **Contact Information**
Update these placeholders in all HTML files:
```html
[Your Farm Address] → Your actual farm address
[Your Phone Number] → Your business phone number
[Your WhatsApp Business Number] → Your WhatsApp Business line
```

#### 2. **Email Configuration**
```html
info@freshplugorganics.com → your-business@domain.com
privacy@freshplugorganics.com → privacy@domain.com
```

#### 3. **Business Details**
- Farm location specifics
- Business registration numbers
- Organic certification details
- Local delivery coverage areas

#### 4. **Payment Integration**
- M-Pesa business account setup
- Bank account details for transfers
- Payment processor API keys

### **Optional Customizations:**

#### **Branding**
- Replace logo files with your actual branding
- Adjust color scheme in `assets/css/style.css`
- Update favicon and social media images

#### **Content**
- Add your actual farm story in `about.html`
- Update product descriptions and pricing
- Add your blog content and photography

#### **Features**
- Enable Google Analytics
- Add social media integration
- Implement newsletter signup
- Connect contact forms to email service

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Design**: Responsive CSS Grid and Flexbox
- **Icons**: Font Awesome 6
- **Images**: Optimized JPG/PNG with SVG logos
- **Performance**: Lightweight, fast-loading architecture
- **SEO**: Semantic HTML with proper meta tags
- **Accessibility**: WCAG compliant structure

## 💰 Pricing Structure

All pricing in **Kenyan Shillings (KSH)**:

| Product Category | Price Range | Notes |
|-----------------|-------------|-------|
| **Fresh Eggs** | KSH 350-500/dozen | Organic, free-range |
| **Organic Chicken** | KSH 650-800/kg | Whole or cuts |
| **Live Birds** | KSH 1,200-2,500 each | Various breeds |
| **Day-old Chicks** | KSH 120-180 each | Vaccinated |
| **Delivery** | Free over KSH 3,000 | Within 20km radius |

## 📱 Payment Options

- **M-Pesa**: Mobile money integration
- **Bank Transfer**: Local Kenya banks
- **Cash on Delivery**: Available in service areas
- **WhatsApp Orders**: Direct messaging for orders

## 🌱 Sustainability Features

- **Organic Certification**: Certified organic farming practices
- **Animal Welfare**: Ethical treatment and free-range conditions
- **Sustainable Farming**: Environmentally conscious operations
- **Local Sourcing**: Supporting Kenya's agricultural economy
- **Educational Mission**: Teaching sustainable farming practices

## 📞 Contact & Support

- **Website**: [Your Website URL]
- **WhatsApp**: [Your WhatsApp Business Number]
- **Email**: info@freshplugorganics.com
- **Phone**: [Your Phone Number]
- **Location**: Kenya

## 🤝 Contributing

We welcome contributions to improve the website! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Unsplash**: High-quality farm photography
- **Font Awesome**: Professional icons
- **Open Source Community**: Tools and inspiration
- **Kenya Agricultural Sector**: Supporting local farming

## 🔮 Roadmap

### **Phase 1: Current** ✅
- [x] Complete website with e-commerce functionality
- [x] Mobile-responsive design
- [x] Local currency and payment integration
- [x] Legal compliance pages

### **Phase 2: Planned** 🚧
- [ ] Live M-Pesa payment processing
- [ ] Customer login and order tracking
- [ ] Inventory management system
- [ ] Email automation for orders

### **Phase 3: Future** 🌟
- [ ] Mobile app development
- [ ] Multi-language support (Swahili)
- [ ] Advanced analytics dashboard
- [ ] Franchise management system

---

**⭐ Star this repository if you find it helpful!**

Made with ❤️ for sustainable agriculture in Kenya 🇰🇪