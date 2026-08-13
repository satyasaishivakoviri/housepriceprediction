
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('aside');
    const overlay = document.getElementById('mobile-overlay');

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            // Toggle sidebar (Translate X 0 means shown, Translate X Full means hidden to right)
            // We assume the default class is 'translate-x-full' (hidden on right)
            sidebar.classList.toggle('translate-x-full');

            // Toggle overlay if it exists
            if (overlay) {
                overlay.classList.toggle('hidden');
            }
        });

        // Close when clicking overlay
        if (overlay) {
            overlay.addEventListener('click', () => {
                sidebar.classList.add('translate-x-full');
                overlay.classList.add('hidden');
            });
        }
    }
});
