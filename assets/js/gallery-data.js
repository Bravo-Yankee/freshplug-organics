// Gallery data for Freshplug Organics Poultry Farm
const galleryData = [
    // Happy Chickens Category
    {
        id: 1,
        src: 'assets/images/hero-farm.jpg',
        title: 'Free-Range Chickens',
        description: 'Our happy chickens roaming freely in natural pastures',
        category: 'chickens',
        alt: 'Free-range chickens in pasture'
    },
    {
        id: 2,
        src: 'assets/images/hero-farm.jpg',
        title: 'Healthy Flock',
        description: 'Well-cared for chickens enjoying outdoor life',
        category: 'chickens',
        alt: 'Healthy chicken flock'
    },
    {
        id: 3,
        src: 'assets/images/organic-chicken.jpg',
        title: 'Content Laying Hens',
        description: 'Our laying hens in their comfortable environment',
        category: 'chickens',
        alt: 'Content laying hens'
    },
    {
        id: 4,
        src: 'assets/images/organic-chicken.jpg',
        title: 'Organic Raised Birds',
        description: 'Premium organic chickens raised naturally',
        category: 'chickens',
        alt: 'Organic chickens'
    },

    // Farm Facilities Category
    {
        id: 5,
        src: 'assets/images/farm-facility.jpg',
        title: 'Modern Farm Infrastructure',
        description: 'State-of-the-art facilities designed for chicken welfare',
        category: 'facilities',
        alt: 'Farm facilities'
    },
    {
        id: 6,
        src: 'assets/images/farm-landscape.jpg',
        title: 'Beautiful Farm Landscape',
        description: 'Scenic view of our organic poultry farm',
        category: 'facilities',
        alt: 'Farm landscape'
    },
    {
        id: 7,
        src: 'assets/images/organic-feed.jpg',
        title: 'Organic Feed Storage',
        description: 'Premium organic feed for our chickens',
        category: 'facilities',
        alt: 'Organic chicken feed'
    },

    // Fresh Products Category
    {
        id: 8,
        src: 'assets/images/organic-chicken.jpg',
        title: 'Farm-Fresh Eggs',
        description: 'Daily collection of fresh, organic eggs',
        category: 'products',
        alt: 'Fresh organic eggs'
    },
    {
        id: 9,
        src: 'assets/images/hero-farm.jpg',
        title: 'Egg Collection Process',
        description: 'Careful collection of eggs from our happy hens',
        category: 'products',
        alt: 'Egg collection'
    },

    // Farm Visitors Category
    {
        id: 10,
        src: 'assets/images/visitors-farm.jpg',
        title: 'Farm Visitors Welcome',
        description: 'Families visiting and learning about organic farming',
        category: 'visitors',
        alt: 'Farm visitors'
    },

    // Our Team Category
    {
        id: 11,
        src: 'assets/images/team-member.jpg',
        title: 'Daily Care Routine',
        description: 'Our dedicated team caring for the chickens',
        category: 'team',
        alt: 'Farm workers with chickens'
    }
];

// Export for use in gallery.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = galleryData;
}