// Gallery data
const galleryImages = [
    {
        id: 1,
        src: 'assets/images/hero-farm.jpg',
        thumb: 'assets/images/hero-farm.jpg',
        title: 'Free-Range Chickens',
        description: 'Our happy chickens roaming freely in natural pastures',
        category: 'chickens'
    },
    {
        id: 2,
        src: 'assets/images/live-chickens.jpg',
        thumb: 'assets/images/live-chickens.jpg',
        title: 'Healthy Flock',
        description: 'Well-cared for chickens enjoying outdoor life',
        category: 'chickens'
    },
    {
        id: 3,
        src: 'assets/images/happy-hens.jpg',
        thumb: 'assets/images/happy-hens.jpg',
        title: 'Content Laying Hens',
        description: 'Our laying hens in their comfortable environment',
        category: 'chickens'
    },
    {
        id: 4,
        src: 'assets/images/organic-chicken.jpg',
        thumb: 'assets/images/organic-chicken.jpg',
        title: 'Organic Raised Birds',
        description: 'Premium organic chickens raised naturally',
        category: 'chickens'
    },
    {
        id: 5,
        src: 'assets/images/farm-facility.jpg',
        thumb: 'assets/images/farm-facility.jpg',
        title: 'Modern Farm Infrastructure',
        description: 'State-of-the-art facilities designed for chicken welfare',
        category: 'facilities'
    },
    {
        id: 6,
        src: 'assets/images/farm-landscape.jpg',
        thumb: 'assets/images/farm-landscape.jpg',
        title: 'Beautiful Farm Landscape',
        description: 'Scenic view of our organic poultry farm',
        category: 'facilities'
    },
    {
        id: 7,
        src: 'assets/images/organic-feed.jpg',
        thumb: 'assets/images/organic-feed.jpg',
        title: 'Organic Feed Storage',
        description: 'Premium organic feed for our chickens',
        category: 'facilities'
    },
    {
        id: 8,
        src: 'assets/images/fresh-eggs.jpg',
        thumb: 'assets/images/fresh-eggs.jpg',
        title: 'Farm-Fresh Eggs',
        description: 'Daily collection of fresh, organic eggs',
        category: 'products'
    },
    {
        id: 9,
        src: 'assets/images/egg-collection.jpg',
        thumb: 'assets/images/egg-collection.jpg',
        title: 'Egg Collection Process',
        description: 'Careful collection of eggs from our happy hens',
        category: 'products'
    },
    {
        id: 10,
        src: 'assets/images/visitors-farm.jpg',
        thumb: 'assets/images/visitors-farm.jpg',
        title: 'Farm Visitors Welcome',
        description: 'Families visiting and learning about organic farming',
        category: 'visitors'
    },
    {
        id: 11,
        src: 'assets/images/farm-chickens.jpg',
        thumb: 'assets/images/farm-chickens.jpg',
        title: 'Daily Care Routine',
        description: 'Our dedicated team caring for the chickens',
        category: 'team'
    },
    {
        id: 7,
        src: 'assets/images/gallery/team-1.jpg',
        thumb: 'assets/images/gallery/thumbs/team-1.jpg',
        title: 'Farm Manager at Work',
        description: 'Our dedicated farm manager checking on the flock',
        category: 'team'
    },
    {
        id: 8,
        src: 'assets/images/gallery/team-2.jpg',
        thumb: 'assets/images/gallery/thumbs/team-2.jpg',
        title: 'Daily Care Routine',
        description: 'Team member providing daily care and attention',
        category: 'team'
    },
    {
        id: 9,
        src: 'assets/images/gallery/visitors-1.jpg',
        thumb: 'assets/images/gallery/thumbs/visitors-1.jpg',
        title: 'School Farm Visit',
        description: 'Local school children learning about organic farming',
        category: 'visitors'
    },
    {
        id: 10,
        src: 'assets/images/gallery/visitors-2.jpg',
        thumb: 'assets/images/gallery/thumbs/visitors-2.jpg',
        title: 'Family Farm Tour',
        description: 'Families enjoying educational farm tours',
        category: 'visitors'
    },
    {
        id: 11,
        src: 'assets/images/gallery/chickens-3.jpg',
        thumb: 'assets/images/gallery/thumbs/chickens-3.jpg',
        title: 'Broiler Chickens',
        description: 'Healthy broiler chickens in natural environment',
        category: 'chickens'
    },
    {
        id: 12,
        src: 'assets/images/gallery/facilities-3.jpg',
        thumb: 'assets/images/gallery/thumbs/facilities-3.jpg',
        title: 'Water System',
        description: 'Clean water delivery system for our birds',
        category: 'facilities'
    },
    {
        id: 13,
        src: 'assets/images/gallery/products-3.jpg',
        thumb: 'assets/images/gallery/thumbs/products-3.jpg',
        title: 'Egg Packaging',
        description: 'Careful packaging of fresh eggs for delivery',
        category: 'products'
    },
    {
        id: 14,
        src: 'assets/images/gallery/chickens-4.jpg',
        thumb: 'assets/images/gallery/thumbs/chickens-4.jpg',
        title: 'Day-old Chicks',
        description: 'Adorable day-old chicks in nursery area',
        category: 'chickens'
    },
    {
        id: 15,
        src: 'assets/images/gallery/facilities-4.jpg',
        thumb: 'assets/images/gallery/thumbs/facilities-4.jpg',
        title: 'Farm Entrance',
        description: 'Welcome to Freshplug Organics Poultry Farm',
        category: 'facilities'
    }
];

// Gallery state
let currentFilter = 'all';
let currentImageIndex = 0;
let displayedImages = [];
let imagesPerLoad = 6;
let loadedCount = 0;

// DOM elements
const galleryGrid = document.getElementById('gallery-grid');
const galleryFilters = document.querySelectorAll('.gallery-filter');
const loadMoreBtn = document.getElementById('load-more-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');

// Initialize gallery
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    initializeFilters();
    initializeLoadMore();
    initializeLightbox();
});

// Initialize gallery
function initializeGallery() {
    displayedImages = filterImages(currentFilter);
    loadedCount = 0;
    galleryGrid.innerHTML = '';
    loadMoreImages();
}

// Filter images by category
function filterImages(category) {
    if (category === 'all') {
        return [...galleryImages];
    }
    return galleryImages.filter(image => image.category === category);
}

// Load more images
function loadMoreImages() {
    const nextBatch = displayedImages.slice(loadedCount, loadedCount + imagesPerLoad);
    
    nextBatch.forEach((image, index) => {
        setTimeout(() => {
            const galleryItem = createGalleryItem(image);
            galleryGrid.appendChild(galleryItem);
            
            // Animate in
            setTimeout(() => {
                galleryItem.classList.add('loading');
            }, 50);
        }, index * 100);
    });
    
    loadedCount += nextBatch.length;
    
    // Update load more button
    if (loadedCount >= displayedImages.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

// Create gallery item
function createGalleryItem(image) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute('data-category', image.category);
    
    galleryItem.innerHTML = `
        <img src="${image.thumb || image.src}" alt="${image.title}" onerror="this.src='assets/images/placeholder-gallery.jpg'">
        <div class="gallery-overlay">
            <h3>${image.title}</h3>
            <p>${image.description}</p>
            <button class="view-btn" onclick="openLightbox(${image.id})">
                <i class="fas fa-expand-alt"></i> View Full Size
            </button>
        </div>
    `;
    
    return galleryItem;
}

// Initialize filters
function initializeFilters() {
    galleryFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Update active filter
            galleryFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filter
            currentFilter = this.getAttribute('data-filter');
            initializeGallery();
            
            // Track filter usage
            trackEvent('filter_gallery', 'Gallery', currentFilter);
        });
    });
}

// Initialize load more
function initializeLoadMore() {
    loadMoreBtn.addEventListener('click', function() {
        loadMoreImages();
        trackEvent('load_more', 'Gallery', 'Load More Images');
    });
}

// Initialize lightbox
function initializeLightbox() {
    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
            }
        }
    });
}

// Open lightbox
function openLightbox(imageId) {
    const image = galleryImages.find(img => img.id === imageId);
    if (image) {
        currentImageIndex = displayedImages.findIndex(img => img.id === imageId);
        lightboxImage.src = image.src;
        lightboxImage.alt = image.title;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        trackEvent('view_image', 'Gallery', image.title);
    }
}

// Close lightbox
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Previous image in lightbox
function prevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        const image = displayedImages[currentImageIndex];
        lightboxImage.src = image.src;
        lightboxImage.alt = image.title;
    }
}

// Next image in lightbox
function nextImage() {
    if (currentImageIndex < displayedImages.length - 1) {
        currentImageIndex++;
        const image = displayedImages[currentImageIndex];
        lightboxImage.src = image.src;
        lightboxImage.alt = image.title;
    }
}

// Play video function
function playVideo(videoId) {
    // In a real implementation, this would open a video player or modal
    // For now, we'll show a placeholder message
    const videoTitles = {
        'farm-tour': 'Complete Farm Tour',
        'daily-care': 'Daily Care Routine',
        'egg-collection': 'Egg Collection Process',
        'organic-practices': 'Organic Farming Practices'
    };
    
    const title = videoTitles[videoId] || 'Farm Video';
    
    // Create a simple video modal (placeholder)
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: white;
        text-align: center;
    `;
    
    modal.innerHTML = `
        <h2 style="margin-bottom: 2rem;">${title}</h2>
        <div style="width: 600px; height: 400px; background: #333; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem;">
            <div>
                <i class="fas fa-video" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Video will be embedded here</p>
                <p style="font-size: 0.9rem; opacity: 0.7;">YouTube, Vimeo, or direct video file</p>
            </div>
        </div>
        <button onclick="this.parentElement.remove(); document.body.style.overflow = 'auto';" style="
            background: var(--primary-green);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
        ">Close</button>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Track video play
    trackEvent('play_video', 'Gallery', title);
}

// Search gallery (additional feature)
function searchGallery(query) {
    const searchTerm = query.toLowerCase();
    const filteredImages = galleryImages.filter(image => 
        image.title.toLowerCase().includes(searchTerm) ||
        image.description.toLowerCase().includes(searchTerm)
    );
    
    displayedImages = filteredImages;
    loadedCount = 0;
    galleryGrid.innerHTML = '';
    loadMoreImages();
}

// Add search functionality if search box exists
const searchBox = document.getElementById('gallery-search');
if (searchBox) {
    searchBox.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 2 || query.length === 0) {
            if (query.length === 0) {
                // Reset to current filter
                displayedImages = filterImages(currentFilter);
            } else {
                searchGallery(query);
            }
            loadedCount = 0;
            galleryGrid.innerHTML = '';
            loadMoreImages();
        }
    });
}

// Download image function
function downloadImage(imageId) {
    const image = galleryImages.find(img => img.id === imageId);
    if (image) {
        const link = document.createElement('a');
        link.href = image.src;
        link.download = image.title.replace(/\s+/g, '-').toLowerCase() + '.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        trackEvent('download_image', 'Gallery', image.title);
    }
}

// Share image function
function shareImage(imageId) {
    const image = galleryImages.find(img => img.id === imageId);
    if (image && navigator.share) {
        navigator.share({
            title: image.title,
            text: image.description,
            url: window.location.href
        }).then(() => {
            trackEvent('share_image', 'Gallery', image.title);
        });
    } else if (image) {
        // Fallback to copying URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Image URL copied to clipboard!', 'success');
            trackEvent('copy_image_url', 'Gallery', image.title);
        });
    }
}

// Image lazy loading optimization
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Analytics tracking
function trackEvent(eventAction, eventCategory, eventLabel) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventAction, {
            event_category: eventCategory,
            event_label: eventLabel
        });
    }
    
    // Console log for debugging
    console.log(`Track: ${eventAction} - ${eventCategory} - ${eventLabel}`);
}

// Show notification function
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

// Auto-refresh gallery (check for new images)
function autoRefreshGallery() {
    // In a real implementation, this would check for new images from a server
    // For now, it's a placeholder for future enhancement
    setInterval(() => {
        // Check for new images
        console.log('Checking for new gallery images...');
    }, 300000); // Check every 5 minutes
}

// Initialize auto-refresh
autoRefreshGallery();