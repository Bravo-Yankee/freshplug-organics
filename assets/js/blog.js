// Blog posts data
const blogPosts = [
    {
        id: 1,
        title: "5 Essential Tips for Raising Healthy Free-Range Chickens",
        excerpt: "Learn the fundamental practices that ensure your chickens thrive in a free-range environment. From proper nutrition to disease prevention.",
        content: "Full article content would go here...",
        category: "farming-tips",
        author: "John Anderson",
        date: "2024-01-15",
        readTime: 5,
        views: 1250,
        comments: 23,
        featured: true,
        image: "assets/images/blog/chicken-care-tips.jpg",
        tags: ["chicken care", "free range", "poultry health"]
    },
    {
        id: 2,
        title: "Farm-Fresh Egg Breakfast Recipe Collection",
        excerpt: "Delicious and nutritious breakfast recipes featuring our farm-fresh organic eggs. Perfect for starting your day with wholesome goodness.",
        content: "Full article content would go here...",
        category: "recipes",
        author: "Mary Anderson",
        date: "2024-01-12",
        readTime: 8,
        views: 890,
        comments: 15,
        featured: false,
        image: "assets/images/blog/egg-recipes.jpg",
        tags: ["recipes", "fresh eggs", "breakfast", "nutrition"]
    },
    {
        id: 3,
        title: "Why Organic Poultry Farming Matters for Your Health",
        excerpt: "Discover the health benefits of choosing organic poultry products and how our farming practices contribute to better nutrition.",
        content: "Full article content would go here...",
        category: "health",
        author: "Dr. Sarah Wilson",
        date: "2024-01-10",
        readTime: 6,
        views: 2100,
        comments: 42,
        featured: true,
        image: "assets/images/blog/organic-benefits.jpg",
        tags: ["organic farming", "health", "nutrition", "sustainable"]
    },
    {
        id: 4,
        title: "A Day in the Life at Freshplug Organics Farm",
        excerpt: "Follow us through a typical day at our organic poultry farm, from sunrise feeding routines to evening care practices.",
        content: "Full article content would go here...",
        category: "farm-life",
        author: "Farm Team",
        date: "2024-01-08",
        readTime: 4,
        views: 750,
        comments: 18,
        featured: false,
        image: "assets/images/blog/farm-day.jpg",
        tags: ["farm life", "daily routine", "chicken care"]
    },
    {
        id: 5,
        title: "Sustainable Farming Practices: Our Environmental Commitment",
        excerpt: "Learn about our environmental initiatives and how sustainable farming practices benefit both our birds and the planet.",
        content: "Full article content would go here...",
        category: "sustainability",
        author: "Environmental Team",
        date: "2024-01-05",
        readTime: 7,
        views: 1680,
        comments: 31,
        featured: false,
        image: "assets/images/blog/sustainability.jpg",
        tags: ["sustainability", "environment", "organic farming"]
    },
    {
        id: 6,
        title: "Seasonal Care: Preparing Your Chickens for Winter",
        excerpt: "Essential winter preparation tips to keep your chickens healthy, warm, and productive during the colder months.",
        content: "Full article content would go here...",
        category: "farming-tips",
        author: "John Anderson",
        date: "2024-01-03",
        readTime: 6,
        views: 920,
        comments: 27,
        featured: false,
        image: "assets/images/blog/winter-care.jpg",
        tags: ["winter care", "chicken care", "seasonal farming"]
    },
    {
        id: 7,
        title: "Farm Expansion Announcement: New Facilities Coming Soon",
        excerpt: "Exciting news about our farm expansion plans, including new facilities and increased production capacity to serve more customers.",
        content: "Full article content would go here...",
        category: "news",
        author: "Management Team",
        date: "2024-01-01",
        readTime: 3,
        views: 560,
        comments: 12,
        featured: false,
        image: "assets/images/blog/farm-expansion.jpg",
        tags: ["farm news", "expansion", "growth"]
    },
    {
        id: 8,
        title: "Nutritional Benefits of Pasture-Raised Eggs vs Store-Bought",
        excerpt: "A comprehensive comparison of the nutritional content between pasture-raised eggs and conventional store-bought eggs.",
        content: "Full article content would go here...",
        category: "health",
        author: "Dr. Sarah Wilson",
        date: "2023-12-28",
        readTime: 9,
        views: 3200,
        comments: 58,
        featured: true,
        image: "assets/images/blog/egg-nutrition.jpg",
        tags: ["nutrition", "pasture raised", "health", "comparison"]
    },
    {
        id: 9,
        title: "Customer Spotlight: Local Restaurant Partnership Success",
        excerpt: "Featuring our partnership with local restaurants and how farm-to-table relationships benefit the entire community.",
        content: "Full article content would go here...",
        category: "news",
        author: "Marketing Team",
        date: "2023-12-25",
        readTime: 4,
        views: 680,
        comments: 14,
        featured: false,
        image: "assets/images/blog/restaurant-partnership.jpg",
        tags: ["partnerships", "farm to table", "community"]
    },
    {
        id: 10,
        title: "Homemade Chicken Feed: Organic Recipes and Tips",
        excerpt: "Learn how to create nutritious, organic chicken feed at home using natural ingredients for healthier, happier birds.",
        content: "Full article content would go here...",
        category: "farming-tips",
        author: "John Anderson",
        date: "2023-12-22",
        readTime: 8,
        views: 1450,
        comments: 35,
        featured: false,
        image: "assets/images/blog/chicken-feed.jpg",
        tags: ["chicken feed", "organic", "diy", "nutrition"]
    }
];

// Blog state
let currentCategory = 'all';
let currentPage = 1;
let postsPerPage = 5;
let filteredPosts = [];

// DOM elements
const blogPostsContainer = document.getElementById('blog-posts');
const blogFilters = document.querySelectorAll('.blog-filter');
const searchInput = document.getElementById('blog-search');
const recentPostsContainer = document.getElementById('recent-posts');
const pagination = document.getElementById('pagination');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageNumbers = document.getElementById('page-numbers');

// Initialize blog
document.addEventListener('DOMContentLoaded', function() {
    initializeBlog();
    initializeFilters();
    initializeSearch();
    initializeSidebar();
    initializeNewsletter();
});

// Initialize blog
function initializeBlog() {
    filteredPosts = filterPosts(currentCategory);
    renderPosts();
    renderPagination();
    renderRecentPosts();
}

// Filter posts by category
function filterPosts(category) {
    if (category === 'all') {
        return [...blogPosts];
    }
    return blogPosts.filter(post => post.category === category);
}

// Render blog posts
function renderPosts() {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToShow = filteredPosts.slice(startIndex, endIndex);
    
    blogPostsContainer.innerHTML = '';
    
    if (postsToShow.length === 0) {
        blogPostsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-light);">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No posts found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
        return;
    }
    
    postsToShow.forEach((post, index) => {
        setTimeout(() => {
            const postElement = createPostElement(post);
            blogPostsContainer.appendChild(postElement);
            
            // Animate in
            setTimeout(() => {
                postElement.classList.add('loading');
            }, 50);
        }, index * 100);
    });
}

// Create post element
function createPostElement(post) {
    const postDiv = document.createElement('article');
    postDiv.className = 'blog-post';
    postDiv.setAttribute('data-category', post.category);
    
    const formattedDate = formatDate(post.date);
    const categoryName = formatCategoryName(post.category);
    
    postDiv.innerHTML = `
        <div class="blog-post-image">
            <img src="${post.image}" alt="${post.title}" onerror="this.src='assets/images/blog-placeholder.jpg'">
            <div class="blog-category">${categoryName}</div>
            <div class="blog-date">${formattedDate}</div>
        </div>
        <div class="blog-content">
            <h2 class="blog-title">
                <a href="blog-single.html?id=${post.id}" style="text-decoration: none; color: inherit;">
                    ${post.title}
                </a>
            </h2>
            <div class="blog-meta">
                <div class="blog-author">
                    <i class="fas fa-user"></i>
                    <span>By ${post.author}</span>
                </div>
                <div class="blog-stats">
                    <div class="blog-stat">
                        <i class="fas fa-clock"></i>
                        <span>${post.readTime} min read</span>
                    </div>
                    <div class="blog-stat">
                        <i class="fas fa-eye"></i>
                        <span>${post.views}</span>
                    </div>
                    <div class="blog-stat">
                        <i class="fas fa-comments"></i>
                        <span>${post.comments}</span>
                    </div>
                </div>
            </div>
            <p class="blog-excerpt">${post.excerpt}</p>
            <a href="blog-single.html?id=${post.id}" class="read-more">
                Read More <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
    
    return postDiv;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Format category name
function formatCategoryName(category) {
    return category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Initialize filters
function initializeFilters() {
    blogFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Update active filter
            blogFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filter
            currentCategory = this.getAttribute('data-category');
            currentPage = 1; // Reset to first page
            filteredPosts = filterPosts(currentCategory);
            renderPosts();
            renderPagination();
            
            // Track filter usage
            trackEvent('filter_blog', 'Blog', currentCategory);
        });
    });
    
    // Sidebar category links
    const categoryLinks = document.querySelectorAll('.categories-list a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            
            // Update main filter
            blogFilters.forEach(f => f.classList.remove('active'));
            const mainFilter = document.querySelector(`[data-category="${category}"]`);
            if (mainFilter) {
                mainFilter.classList.add('active');
            }
            
            currentCategory = category;
            currentPage = 1;
            filteredPosts = filterPosts(currentCategory);
            renderPosts();
            renderPagination();
        });
    });
}

// Initialize search
function initializeSearch() {
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = this.value.toLowerCase().trim();
            
            if (query.length === 0) {
                // Reset to current category filter
                filteredPosts = filterPosts(currentCategory);
            } else {
                // Search in titles, excerpts, and tags
                filteredPosts = blogPosts.filter(post => {
                    return post.title.toLowerCase().includes(query) ||
                           post.excerpt.toLowerCase().includes(query) ||
                           post.tags.some(tag => tag.toLowerCase().includes(query)) ||
                           post.author.toLowerCase().includes(query);
                });
            }
            
            currentPage = 1;
            renderPosts();
            renderPagination();
            
            if (query.length > 2) {
                trackEvent('search_blog', 'Blog', query);
            }
        }, 300);
    });
}

// Render pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    
    // Update prev/next buttons
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    // Generate page numbers
    pageNumbers.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.className = currentPage === i ? 'active' : '';
            pageBtn.addEventListener('click', () => goToPage(i));
            pageNumbers.appendChild(pageBtn);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.padding = '0 0.5rem';
            pageNumbers.appendChild(dots);
        }
    }
}

// Change page
function changePage(direction) {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        goToPage(newPage);
    }
}

// Go to specific page
function goToPage(page) {
    currentPage = page;
    renderPosts();
    renderPagination();
    
    // Scroll to top of blog posts
    blogPostsContainer.scrollIntoView({ behavior: 'smooth' });
    
    trackEvent('blog_pagination', 'Blog', `Page ${page}`);
}

// Render recent posts in sidebar
function renderRecentPosts() {
    const recentPosts = blogPosts
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    recentPostsContainer.innerHTML = '';
    
    recentPosts.forEach(post => {
        const recentPostDiv = document.createElement('div');
        recentPostDiv.className = 'recent-post';
        
        recentPostDiv.innerHTML = `
            <div class="recent-post-image">
                <img src="${post.image}" alt="${post.title}" onerror="this.src='assets/images/blog-placeholder.jpg'">
            </div>
            <div class="recent-post-content">
                <a href="blog-single.html?id=${post.id}">
                    <h4>${post.title}</h4>
                </a>
                <div class="recent-post-date">${formatDate(post.date)}</div>
            </div>
        `;
        
        recentPostsContainer.appendChild(recentPostDiv);
    });
}

// Initialize sidebar functionality
function initializeSidebar() {
    // Tag click handlers
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            const tagText = this.textContent.toLowerCase();
            
            // Search for posts with this tag
            filteredPosts = blogPosts.filter(post => 
                post.tags.some(postTag => postTag.toLowerCase().includes(tagText))
            );
            
            currentPage = 1;
            renderPosts();
            renderPagination();
            
            // Update search input to show the tag
            searchInput.value = tagText;
            
            trackEvent('click_tag', 'Blog', tagText);
        });
    });
}

// Initialize newsletter
function initializeNewsletter() {
    const newsletterForm = document.getElementById('sidebar-newsletter');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                showNotification('Thank you for subscribing! You\'ll receive our latest farm updates.', 'success');
                this.querySelector('input[type="email"]').value = '';
                trackEvent('newsletter_signup', 'Blog', 'Sidebar Newsletter');
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Social sharing functions
function shareBlogPost(postId, platform) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;
    
    const url = `${window.location.origin}/blog-single.html?id=${postId}`;
    const text = `${post.title} - ${post.excerpt.substring(0, 100)}...`;
    
    let shareUrl;
    
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        trackEvent('share_blog_post', 'Blog', `${post.title} - ${platform}`);
    }
}

// Reading progress tracker
function initializeReadingProgress() {
    let readingProgress = 0;
    
    window.addEventListener('scroll', () => {
        const article = document.querySelector('article.blog-post');
        if (article) {
            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;
            
            const progress = Math.min(100, Math.max(0, 
                ((scrollTop - articleTop + windowHeight) / articleHeight) * 100
            ));
            
            // Track reading milestones
            if (progress >= 25 && readingProgress < 25) {
                trackEvent('reading_progress', 'Blog', '25%');
                readingProgress = 25;
            } else if (progress >= 50 && readingProgress < 50) {
                trackEvent('reading_progress', 'Blog', '50%');
                readingProgress = 50;
            } else if (progress >= 75 && readingProgress < 75) {
                trackEvent('reading_progress', 'Blog', '75%');
                readingProgress = 75;
            } else if (progress >= 100 && readingProgress < 100) {
                trackEvent('reading_progress', 'Blog', '100%');
                readingProgress = 100;
            }
        }
    });
}

// Related posts functionality
function getRelatedPosts(currentPostId, limit = 3) {
    const currentPost = blogPosts.find(p => p.id === currentPostId);
    if (!currentPost) return [];
    
    // Find posts with similar tags or same category
    const relatedPosts = blogPosts.filter(post => {
        if (post.id === currentPostId) return false;
        
        const hasCommonTags = post.tags.some(tag => 
            currentPost.tags.includes(tag)
        );
        const sameCategory = post.category === currentPost.category;
        
        return hasCommonTags || sameCategory;
    });
    
    // Sort by relevance (more common tags = higher score)
    relatedPosts.sort((a, b) => {
        const aScore = a.tags.filter(tag => currentPost.tags.includes(tag)).length;
        const bScore = b.tags.filter(tag => currentPost.tags.includes(tag)).length;
        return bScore - aScore;
    });
    
    return relatedPosts.slice(0, limit);
}

// Blog analytics
function trackBlogEngagement() {
    // Track time spent on page
    let startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', 'Blog', `${timeSpent} seconds`);
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );
        maxScroll = Math.max(maxScroll, scrollPercent);
    });
    
    window.addEventListener('beforeunload', () => {
        trackEvent('scroll_depth', 'Blog', `${maxScroll}%`);
    });
}

// Initialize analytics
document.addEventListener('DOMContentLoaded', () => {
    initializeReadingProgress();
    trackBlogEngagement();
});

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

// Analytics tracking
function trackEvent(eventAction, eventCategory, eventLabel) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventAction, {
            event_category: eventCategory,
            event_label: eventLabel
        });
    }
    
    console.log(`Track: ${eventAction} - ${eventCategory} - ${eventLabel}`);
}