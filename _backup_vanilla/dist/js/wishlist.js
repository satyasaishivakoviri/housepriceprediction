
window.wishlistManager = {
    storageKey: 'homienest_wishlist',

    // Initialize wishlist
    init() {
        this.renderWishlist();
        this.updateHeartIcons();
    },

    // Get all wishlisted IDs
    getWishlist() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    },

    // Check if an item is wishlisted
    isWishlisted(id) {
        return this.getWishlist().includes(id);
    },

    // Toggle wishlist status
    toggleWishlist(id, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }

        let wishlist = this.getWishlist();
        const index = wishlist.indexOf(id);

        if (index === -1) {
            wishlist.push(id);
            this.showToast('Added to Wishlist');
        } else {
            wishlist.splice(index, 1);
            this.showToast('Removed from Wishlist');
        }

        localStorage.setItem(this.storageKey, JSON.stringify(wishlist));

        this.updateHeartIcons();
        this.renderWishlist();
    },

    // Update all heart icons on the page
    updateHeartIcons() {
        const wishlist = this.getWishlist();
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const id = parseInt(btn.dataset.id);
            const icon = btn.querySelector('.material-symbols-outlined');
            if (wishlist.includes(id)) {
                icon.classList.add('fill-1', 'text-red-500');
                icon.classList.remove('text-white'); // Assuming white outline for unliked on image
            } else {
                icon.classList.remove('fill-1', 'text-red-500');
                icon.classList.add('text-white');
            }
        });
    },

    // Render the wishlist in the sidebar
    renderWishlist() {
        const container = document.getElementById('wishlist-container');
        if (!container) return;

        const wishlist = this.getWishlist();

        if (wishlist.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-400">
                    <span class="material-symbols-outlined text-4xl mb-2 opacity-50">favorite</span>
                    <p class="text-xs">Your wishlist is empty</p>
                </div>
            `;
            return;
        }

        // We need property details. In a real app, we'd fetch these. 
        // Here we'll try to find them in window.RealEstateData if available.
        if (!window.RealEstateData || !window.RealEstateData.sampleProperties) {
            container.innerHTML = '<p class="text-xs text-center text-gray-500">Loading properties...</p>';
            return;
        }

        const properties = window.RealEstateData.sampleProperties.filter(p => wishlist.includes(p.id));

        container.innerHTML = properties.map(p => `
            <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group mb-2">
                <img src="${p.image}" class="w-12 h-12 rounded-lg object-cover" alt="${p.name}">
                <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-bold text-navy dark:text-white truncate">${p.name}</h4>
                    <p class="text-[10px] text-gray-500">${window.RealEstateData.formatCurrency(p.price)}</p>
                </div>
                <button onclick="window.wishlistManager.toggleWishlist(${p.id}, event)" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-red-500">
                    <span class="material-symbols-outlined text-sm fill-1">close</span>
                </button>
            </div>
        `).join('');
    },

    showToast(message) {
        // Simple toast implementation
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm z-[100] transition-opacity duration-300';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.wishlistManager.init();
});
