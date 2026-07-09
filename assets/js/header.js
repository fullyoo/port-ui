/**
 * header.js
 * Header / Navigation 기능
 * 스크롤 감지, 메뉴 활성화, 부드러운 스크롤
 */

class Header {
    constructor() {
        this.header = document.querySelector('.header');
        this.navLinks = document.querySelectorAll('.header__nav-link');
        this.menuToggle = document.querySelector('.header__menu-toggle');
        this.nav = document.querySelector('.header__nav');
        this.sections = document.querySelectorAll('section[data-section]');
        
        this.isMenuOpen = false;
        this.scrollThreshold = 100;
        
        // Bind methods
        this.init = this.init.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleNavClick = this.handleNavClick.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.updateActiveNav = this.updateActiveNav.bind(this);
    }

    /**
     * Initialize header functionality
     */
    init() {
        if (!this.header) {
            console.warn('⚠️ Header: Header element not found');
            return;
        }

        // Scroll event listener
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        
        // Navigation link click handlers
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick);
        });

        // Menu toggle handler
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', this.toggleMenu);
        }

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.nav.contains(e.target) && 
                !this.menuToggle.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Initial scroll state
        this.handleScroll();

        console.log('✅ Header initialized');
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        const scrollY = window.scrollY;

        // Add scrolled class when scrolling
        if (scrollY > this.scrollThreshold) {
            this.header.classList.add('is-scrolled');
        } else {
            this.header.classList.remove('is-scrolled');
        }

        // Update active navigation
        this.updateActiveNav();
    }

    /**
     * Handle navigation link clicks
     */
    handleNavClick(e) {
        e.preventDefault();
        
        const link = e.currentTarget;
        const targetId = link.getAttribute('data-scroll-to') || link.getAttribute('href')?.replace('#', '');
        
        if (!targetId) return;

        // Close mobile menu if open
        if (this.isMenuOpen) {
            this.closeMenu();
        }

        // Scroll to target section
        this.scrollToSection(targetId);

        // Update active state
        this.setActiveNav(link);
    }

    /**
     * Scroll to target section smoothly
     */
    scrollToSection(sectionId) {
        const targetSection = document.getElementById(sectionId) || 
                             document.querySelector(`[data-section="${sectionId}"]`);
        
        if (!targetSection) {
            console.warn(`⚠️ Header: Section "${sectionId}" not found`);
            return;
        }

        const headerHeight = this.header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Update active navigation based on scroll position
     */
    updateActiveNav() {
        const headerHeight = this.header.offsetHeight;
        const scrollPosition = window.scrollY + headerHeight + 100;

        let activeSection = null;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.id || section.getAttribute('data-section');

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSection = sectionId;
            }
        });

        // Set active nav link
        if (activeSection) {
            this.navLinks.forEach(link => {
                const linkTarget = link.getAttribute('data-scroll-to') || 
                                  link.getAttribute('href')?.replace('#', '');
                
                if (linkTarget === activeSection) {
                    link.classList.add('is-active');
                } else {
                    link.classList.remove('is-active');
                }
            });
        }
    }

    /**
     * Set active navigation link
     */
    setActiveNav(activeLink) {
        this.navLinks.forEach(link => {
            link.classList.remove('is-active');
        });
        activeLink.classList.add('is-active');
    }

    /**
     * Toggle mobile menu
     */
    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.menuToggle) {
            this.menuToggle.setAttribute('aria-expanded', this.isMenuOpen);
        }
        
        if (this.nav) {
            if (this.isMenuOpen) {
                this.nav.classList.add('is-open');
                document.body.style.overflow = 'hidden';
            } else {
                this.nav.classList.remove('is-open');
                document.body.style.overflow = '';
            }
        }
    }

    /**
     * Close mobile menu
     */
    closeMenu() {
        if (!this.isMenuOpen) return;

        this.isMenuOpen = false;
        
        if (this.menuToggle) {
            this.menuToggle.setAttribute('aria-expanded', 'false');
        }
        
        if (this.nav) {
            this.nav.classList.remove('is-open');
            document.body.style.overflow = '';
        }
    }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Header;
}
