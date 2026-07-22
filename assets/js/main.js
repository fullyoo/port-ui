/**
 * main.js
 * 메인 애플리케이션 진입점
 * 모든 모듈 초기화 및 조율
 */

class App {
    constructor() {
        // Module instances
        this.loadingScreen = null;
        this.customCursor = null;
        this.header = null;

        // Animation modules
        this.heroAnimation = null;
        this.aboutAnimation = null;
        this.worksAnimation = null;
        this.selectedWorksAnimation = null;
        this.contactAnimation = null;

        // Swiper modules
        this.heroSwiper = null;
        this.worksSwiper = null;
        this.selectedWorksSwiper = null;

        // State
        this.isReady = false;

        // Bind methods
        this.init = this.init.bind(this);
        this.onReady = this.onReady.bind(this);
        this.setupEventListeners = this.setupEventListeners.bind(this);
    }

    /**
     * Initialize the application
     */
    init() {
        console.log('🚀 App initializing...');

        // 로딩 스크린 없이 바로 초기화
        this.onReady();

        // Initialize custom cursor (can start immediately)
        if (typeof CustomCursor !== 'undefined') {
            this.customCursor = new CustomCursor();
            this.customCursor.init();
        }

        // Initialize header (can start immediately)
        if (typeof Header !== 'undefined') {
            this.header = new Header();
            this.header.init();
        }

        // Setup global event listeners
        this.setupEventListeners();
    }

    /**
     * Called when loading is complete
     */
    onReady() {
        console.log('✅ App ready');
        this.isReady = true;

        // title-highlight 한 글자씩 타이핑 효과용 DOM 분리
        if (typeof initTitleHighlightTypewriter === 'function') {
            initTitleHighlightTypewriter();
        }

        // hero title rotating highlight effect
        if (typeof initHeroRotatingHighlight === 'function') {
            initHeroRotatingHighlight();
        }

        // Initialize all animation modules
        this.initAnimations();

        // Initialize all swiper modules
        this.initSwipers();

        // Play entrance animations with a small delay
        setTimeout(() => {
            if (this.heroAnimation) {
                console.log('▶️ Playing hero animation');
                this.heroAnimation.play();
            }
        }, 100);

        // Add ready class to body
        document.body.classList.add('is-ready');

        // Initialize More Works preview hover
        this.initMoreWorksPreview();
    }

    /**
     * Initialize all animation modules
     */
    initAnimations() {
        // Hero Animation
        if (typeof HeroAnimation !== 'undefined') {
            this.heroAnimation = new HeroAnimation();
            this.heroAnimation.init();
            console.log('✅ HeroAnimation created');
        } else {
            console.warn('⚠️ HeroAnimation not found');
        }

        // About Animation
        if (typeof AboutAnimation !== 'undefined') {
            this.aboutAnimation = new AboutAnimation();
            this.aboutAnimation.init();
        }

        // Works Animation
        if (typeof WorksAnimation !== 'undefined') {
            this.worksAnimation = new WorksAnimation();
            this.worksAnimation.init();
        }

        // Selected Works Animation
        if (typeof SelectedWorksAnimation !== 'undefined') {
            this.selectedWorksAnimation = new SelectedWorksAnimation();
            this.selectedWorksAnimation.init();
        }

        // Contact Animation
        if (typeof ContactAnimation !== 'undefined') {
            this.contactAnimation = new ContactAnimation();
            this.contactAnimation.init();
        }

        console.log('🎬 All animations initialized');
    }

    /**
     * Initialize all swiper modules
     */
    initSwipers() {
        // Hero Swiper
        if (typeof HeroSwiper !== 'undefined') {
            this.heroSwiper = new HeroSwiper();
            this.heroSwiper.init();
            console.log('✅ HeroSwiper created');
        } else {
            console.warn('⚠️ HeroSwiper not found');
        }

        // Works Swiper (with animation reference)
        if (typeof WorksSwiper !== 'undefined') {
            this.worksSwiper = new WorksSwiper();
            this.worksSwiper.init(this.worksAnimation);
        }

        // Selected Works Swiper (with animation reference)
        if (typeof SelectedWorksSwiper !== 'undefined') {
            this.selectedWorksSwiper = new SelectedWorksSwiper();
            this.selectedWorksSwiper.init(this.selectedWorksAnimation);
        }

        console.log('🎠 All swipers initialized');
    }

    /**
     * Initialize More Works preview hover interactions
     */
    initMoreWorksPreview() {
        const previewOverlay = document.createElement('div');
        previewOverlay.className = 'more-works-preview-overlay';
        const previewImg = document.createElement('img');
        previewImg.alt = '';
        previewOverlay.appendChild(previewImg);
        document.body.appendChild(previewOverlay);

        const previewWidth = 380;
        const previewHeight = 240;
        const offsetX = 26;
        const offsetY = 18;

        const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

        const items = document.querySelectorAll('.more-works__item');

        items.forEach((item) => {
            const nestedImg = item.querySelector('.more-works__preview-img');
            if (!nestedImg) return;

            const previewSrc = nestedImg.src;
            const previewAlt = nestedImg.alt || '';

            const updatePreviewPosition = (event) => {
                const x = event.clientX + offsetX;
                const y = event.clientY + offsetY;
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                const left = clamp(x, previewWidth / 2 + 16, windowWidth - previewWidth / 2 - 16);
                const top = clamp(y, previewHeight / 2 + 16, windowHeight - previewHeight / 2 - 16);

                previewOverlay.style.left = `${left}px`;
                previewOverlay.style.top = `${top}px`;
            };

            const showPreview = (event) => {
                previewImg.src = previewSrc;
                previewImg.alt = previewAlt;
                previewOverlay.classList.add('active');
                updatePreviewPosition(event);
            };

            const hidePreview = () => {
                previewOverlay.classList.remove('active');
            };

            item.addEventListener('mousemove', showPreview);
            item.addEventListener('mouseenter', showPreview);
            item.addEventListener('mouseleave', hidePreview);
        });
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Scroll button handler (Hero)
        const scrollBtn = document.querySelector('.hero__scroll');
        if (scrollBtn) {
            scrollBtn.addEventListener('click', () => {
                const aboutSection = document.querySelector('#about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Smooth scroll for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href && href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        // Resize handler (debounced)
        if (typeof utils !== 'undefined' && utils.debounce) {
            window.addEventListener('resize', utils.debounce(() => {
                this.onResize();
            }, 250));
        } else {
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => this.onResize(), 250);
            });
        }

        // Visibility change handler
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause autoplay when tab is hidden
                this.pauseAutoplay();
            } else {
                // Resume when tab is visible
                this.resumeAutoplay();
            }
        });

        // Keyboard navigation for swipers
        document.addEventListener('keydown', (e) => {
            // Only respond if no input is focused
            if (document.activeElement.tagName === 'INPUT' ||
                document.activeElement.tagName === 'TEXTAREA') {
                return;
            }

            // Get current section in view
            const sections = document.querySelectorAll('[data-section]');
            let currentSection = null;

            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                    currentSection = section.dataset.section;
                }
            });

            // Handle arrow keys based on current section
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                if (currentSection === 'hero' && this.heroSwiper) {
                    this.heroSwiper.next();
                } else if (currentSection === 'works' && this.worksSwiper) {
                    this.worksSwiper.next();
                } else if (currentSection === 'selected-works' && this.selectedWorksSwiper) {
                    e.preventDefault();
                    this.selectedWorksSwiper.next();
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                if (currentSection === 'hero' && this.heroSwiper) {
                    this.heroSwiper.prev();
                } else if (currentSection === 'works' && this.worksSwiper) {
                    this.worksSwiper.prev();
                } else if (currentSection === 'selected-works' && this.selectedWorksSwiper) {
                    e.preventDefault();
                    this.selectedWorksSwiper.prev();
                }
            }
        });

        // Update cursor on new interactive elements
        this.observeNewElements();
    }

    /**
     * Observe for new interactive elements (for cursor)
     */
    observeNewElements() {
        if (!this.customCursor || !this.customCursor.isEnabled) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const interactives = node.querySelectorAll?.('a, button, [data-cursor="hover"]') || [];
                        interactives.forEach(el => {
                            el.addEventListener('mouseenter', this.customCursor.onMouseEnter);
                            el.addEventListener('mouseleave', this.customCursor.onMouseLeave);
                        });
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    /**
     * Pause all autoplay
     */
    pauseAutoplay() {
        if (this.heroSwiper) {
            this.heroSwiper.stopAutoplay();
        }
        if (this.worksSwiper) {
            this.worksSwiper.stopAutoplay();
        }
    }

    /**
     * Resume all autoplay
     */
    resumeAutoplay() {
        if (this.heroSwiper) {
            this.heroSwiper.startAutoplay();
        }
        if (this.worksSwiper) {
            this.worksSwiper.startAutoplay();
        }
    }

    /**
     * Handle window resize
     */
    onResize() {
        // Refresh ScrollTrigger on resize
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }

    /**
     * Destroy all modules
     */
    destroy() {
        // Destroy animations
        if (this.heroAnimation) {
            this.heroAnimation.destroy();
        }
        if (this.aboutAnimation) {
            this.aboutAnimation.destroy();
        }
        if (this.worksAnimation) {
            this.worksAnimation.destroy();
        }
        if (this.contactAnimation) {
            this.contactAnimation.destroy();
        }

        // Destroy swipers
        if (this.heroSwiper) {
            this.heroSwiper.destroy();
        }
        if (this.worksSwiper) {
            this.worksSwiper.destroy();
        }

        // Destroy cursor
        if (this.customCursor) {
            this.customCursor.destroy();
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all scripts are loaded
    setTimeout(() => {
        const app = new App();
        app.init();

        // Expose app instance globally for debugging
        window.app = app;
    }, 50);
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.app) {
        window.app.destroy();
    }
});
