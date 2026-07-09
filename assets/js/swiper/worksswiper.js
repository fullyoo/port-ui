/**
 * worksSwiper.js
 * Works Section Swiper 설정
 * 세로 슬라이드 + GSAP 연동 커스텀 트랜지션
 */

class WorksSwiper {
    constructor() {
        this.swiperContainer = document.querySelector('.works__swiper');
        this.swiper = null;
        this.isInitialized = false;

        // Animation reference
        this.worksAnimation = null;

        // Bind methods
        this.init = this.init.bind(this);
        this.onSlideChange = this.onSlideChange.bind(this);
    }

    /**
     * Initialize Swiper with custom configuration
     * @param {WorksAnimation} worksAnimation - Reference to works animation instance
     */
    init(worksAnimation = null) {
        if (this.isInitialized || !this.swiperContainer) {
            console.warn('⚠️ WorksSwiper: Already initialized or container not found');
            return;
        }

        this.worksAnimation = worksAnimation;

        // Swiper is disabled - using grid layout instead
        // Just mark as initialized to prevent errors
        this.isInitialized = true;
        console.log('✅ Works Swiper disabled - using grid layout');
    }

    /**
     * Handle slide change event
     */
    onSlideChange() {
        if (!this.swiper) {
            console.warn('⚠️ WorksSwiper: Swiper instance not available in onSlideChange');
            return;
        }

        // Trigger card content animation if available
        if (this.worksAnimation && this.swiper.activeIndex !== undefined) {
            this.worksAnimation.animateCardContent(this.swiper.activeIndex);
        }
    }

    /**
     * Animate transition start - GSAP linked animation
     */
    animateTransitionStart() {
        if (!this.swiper || !this.swiper.slides) return;

        const prevSlide = this.swiper.slides[this.swiper.previousIndex];

        // Animate out previous slide - separate image and content transitions
        if (prevSlide) {
            const prevContent = prevSlide.querySelector('.works__card-content');
            const prevImage = prevSlide.querySelector('.works__card-img');
            
            // Animate content out
            if (prevContent) {
                gsap.to(prevContent, {
                    opacity: 0,
                    y: -30,
                    duration: 0.4,
                    ease: 'power2.in'
                });
            }
            
            // Animate image with different timing
            if (prevImage) {
                gsap.to(prevImage, {
                    scale: 1.1,
                    duration: 0.6,
                    ease: 'power2.inOut'
                });
            }
        }
    }

    /**
     * Animate transition end - GSAP linked animation
     * Each card appears one by one on mouse wheel scroll
     */
    animateTransitionEnd() {
        if (!this.swiper || !this.swiper.slides) return;

        const activeSlide = this.swiper.slides[this.swiper.activeIndex];
        if (!activeSlide) return;

        const card = activeSlide.querySelector('.works__card');
        if (!card) return;

        // Animate the entire card appearing
        gsap.fromTo(card,
            {
                opacity: 0,
                y: 60,
                scale: 0.95
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                ease: 'power3.out'
            }
        );

        // Then animate content elements with stagger
        const content = card.querySelector('.works__card-content');
        const image = card.querySelector('.works__card-img');
        const title = card.querySelector('.works__card-title');
        const problem = card.querySelector('.works__card-problem');
        const roles = card.querySelector('.works__card-roles');
        const cta = card.querySelector('.works__card-cta');

        // Set initial states for content elements
        gsap.set([title, problem, roles, cta], {
            opacity: 0,
            y: 20
        });

        // Staggered animation for content elements
        const tl = gsap.timeline({ delay: 0.3 });
        
        if (title) {
            tl.to(title,
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
                0
            );
        }
        
        if (problem) {
            tl.to(problem,
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
                0.15
            );
        }
        
        if (roles) {
            tl.to(roles,
                { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
                0.3
            );
        }
        
        if (cta) {
            tl.to(cta,
                { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' },
                0.4
            );
        }

        // Animate image separately
        if (image) {
            gsap.fromTo(image,
                { opacity: 0, scale: 1.1 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power2.out',
                    delay: 0.2
                }
            );
        }

        // Reset all non-active slides to hidden state
        if (this.swiper.activeIndex !== undefined) {
            this.swiper.slides.forEach((slide, index) => {
                if (index !== this.swiper.activeIndex) {
                    const card = slide.querySelector('.works__card');
                    if (card) {
                        gsap.set(card, {
                            opacity: 0,
                            y: 60,
                            scale: 0.95
                        });
                    }
                }
            });
        }
    }

    /**
     * Go to specific slide
     * @param {number} index - Slide index
     */
    goTo(index) {
        if (this.swiper) {
            this.swiper.slideTo(index);
        }
    }

    /**
     * Go to next slide
     */
    next() {
        if (this.swiper) {
            this.swiper.slideNext();
        }
    }

    /**
     * Go to previous slide
     */
    prev() {
        if (this.swiper) {
            this.swiper.slidePrev();
        }
    }

    /**
     * Start autoplay
     */
    startAutoplay() {
        if (this.swiper?.autoplay) {
            this.swiper.autoplay.start();
        }
    }

    /**
     * Stop autoplay
     */
    stopAutoplay() {
        if (this.swiper?.autoplay) {
            this.swiper.autoplay.stop();
        }
    }

    /**
     * Destroy swiper instance
     */
    destroy() {
        if (this.swiper) {
            this.swiper.destroy(true, true);
            this.swiper = null;
            this.isInitialized = false;
        }
    }
}

// Export for use in main.js
window.WorksSwiper = WorksSwiper;
