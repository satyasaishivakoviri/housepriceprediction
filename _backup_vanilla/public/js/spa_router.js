document.addEventListener('DOMContentLoaded', () => {
    // Core Router State
    const router = {
        init: () => {
            // Intercept all clicks on standard links
            document.body.addEventListener('click', e => {
                const link = e.target.closest('a');
                if (link && link.href && link.href.startsWith(window.location.origin)) {
                    // Ignore hash links or special targets
                    if (link.getAttribute('target') === '_blank' || link.getAttribute('href').startsWith('#')) return;

                    e.preventDefault();
                    const url = link.getAttribute('href');
                    router.navigate(url);
                }
            });

            // Handle Back/Forward browser buttons
            window.addEventListener('popstate', () => {
                router.loadPage(window.location.pathname);
            });
        },

        navigate: (url) => {
            window.history.pushState({}, '', url);
            router.loadPage(url);
        },

        loadPage: async (path) => {
            try {
                // Show loading state if needed (optional)
                // document.querySelector('main').style.opacity = '0.5';

                const response = await fetch(path);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const html = await response.text();

                // Parse the fetched HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Extract the main content. NOTE: Assumes pages have a <main> or body content we want.
                // We prioritize extracting <main>, falling back to <body> content.
                const newContent = doc.querySelector('main') || doc.body;
                const currentContainer = document.querySelector('main') || document.body; // Fallback if no main in shell

                if (newContent && currentContainer) {
                    // Replace content
                    // If we are replacing 'main', we retain the nav/footer from the shell if they are outside 'main'
                    // In the current index.html, Nav and Footer are siblings of Main.
                    // So we just replace innerHTML of main if the fetched page has a main.

                    if (doc.querySelector('main')) {
                        document.querySelector('main').innerHTML = doc.querySelector('main').innerHTML;
                    } else {
                        // Fallback for pages that might be full HTML 
                        // Check if we can find a main, if not replace the 'main' container with body children?
                        // Safer: Just assume target pages are well formed with Main.
                        // Given the imported screens, some might be full body.
                        document.querySelector('main').innerHTML = doc.body.innerHTML;
                    }
                }

                // Scroll to top
                window.scrollTo(0, 0);

                // Re-initialize scripts
                if (window.initApp) {
                    window.initApp();
                }

            } catch (error) {
                console.error('Navigation error:', error);
                // Fallback: full reload if fetch fails
                window.location.href = path;
            }
        }
    };

    router.init();
    window.router = router; // Expose for programmatic navigation
});
