// Smooth scroll functionality
function initSmoothScroll() {
    // Add smooth scroll behavior to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#" without a target
            if (href === '#') return;

            e.preventDefault();

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // If scrolling to contact section, add highlight animation
                if (targetId === 'contact') {
                    setTimeout(() => {
                        const contactLinks = document.getElementById('contact-links');
                        if (contactLinks) {
                            // Remove existing animation class if present
                            contactLinks.classList.remove('highlight-animate');
                            // Trigger reflow to restart animation
                            void contactLinks.offsetWidth;
                            // Add animation class
                            contactLinks.classList.add('highlight-animate');

                            // Remove class after animation completes
                            setTimeout(() => {
                                contactLinks.classList.remove('highlight-animate');
                            }, 1200);
                        }
                    }, 600); // Wait for scroll to mostly complete
                }
            }
        });
    });
}

// Mobile navbar toggle functionality
// This function initializes the navbar toggle
function initNavbarToggle() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navbarMenu = document.querySelector('.navbar-menu-mobile');

    if (mobileToggle && navbarMenu) {
        // Remove any existing listeners to prevent duplicates
        const newToggle = mobileToggle.cloneNode(true);
        mobileToggle.parentNode.replaceChild(newToggle, mobileToggle);

        newToggle.addEventListener('click', function () {
            navbarMenu.classList.toggle('active');
            newToggle.classList.toggle('active');

            // Animate hamburger to X
            const spans = newToggle.querySelectorAll('span');
            if (newToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking on a nav item
        const navItems = navbarMenu.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function () {
                navbarMenu.classList.remove('active');
                newToggle.classList.remove('active');

                // Reset hamburger animation
                const spans = newToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
    // console.log("Navbar script loaded");
}


initNavbarToggle();
initSmoothScroll();
