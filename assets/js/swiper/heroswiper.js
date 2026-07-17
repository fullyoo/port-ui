/**
 * heroSwiper.js
 * Hero Section Swiper 설정
 * GSAP과 연동된 커스텀 트랜지션 효과
 */

class HeroSwiper {
    constructor() {
        this.swiperContainer = document.querySelector('.hero__swiper');
        this.swiper = null;
        this.isInitialized = false;

        // Elements
        this.elements = {
            prevBtn: document.querySelector('.hero__swiper-btn--prev'),
            nextBtn: document.querySelector('.hero__swiper-btn--next'),
            pagination: document.querySelector('.hero__swiper-pagination'),
            progressCurrent: document.querySelector('.hero__progress-current'),
            progressTotal: document.querySelector('.hero__progress-total'),
            autoplayBtn: document.querySelector('.hero__autoplay-btn')
        };

        // Autoplay state
        this.isAutoplayPaused = false;

        // Bind methods
        this.init = this.init.bind(this);
        this.onSlideChange = this.onSlideChange.bind(this);
        this.animateSlideTransition = this.animateSlideTransition.bind(this);
    }

    /**
     * Initialize Swiper with custom configuration
     */
    init() {
        if (this.isInitialized || !this.swiperContainer) {
            console.warn('⚠️ HeroSwiper: Already initialized or container not found');
            return;
        }

        // 슬라이드 개수 확인하여 loop 모드 결정
        const slides = this.swiperContainer.querySelectorAll('.swiper-slide');
        const slideCount = slides.length;
        // loop 모드는 슬라이드가 충분할 때만 활성화 (최소 5개 이상 권장)
        // 슬라이드가 적으면 loop를 비활성화하여 경고 방지
        const shouldLoop = slideCount >= 5;

        try {
            this.swiper = new Swiper('.hero__swiper', {
                // Core settings
                slidesPerView: 'auto',
                centeredSlides: true,
                spaceBetween: 30,
                loop: shouldLoop,
                speed: 800,

                // Autoplay

                // autoplay: {
                //     delay: 4000,
                //     disableOnInteraction: false,
                //     pauseOnMouseEnter: true
                // },

                // Effect
                effect: 'slide',

                // Grab cursor
                grabCursor: true,

                // Navigation
                navigation: {
                    prevEl: '.hero__swiper-btn--prev',
                    nextEl: '.hero__swiper-btn--next'
                },

                // Pagination
                pagination: {
                    el: '.hero__swiper-pagination',
                    clickable: true,
                    type: 'bullets'
                },

                // Breakpoints
                breakpoints: {
                    320: {
                        slidesPerView: 1.2,
                        spaceBetween: 20,
                        loop: shouldLoop
                    },
                    480: {
                        slidesPerView: 1.4,
                        spaceBetween: 25,
                        loop: shouldLoop
                    },
                    768: {
                        slidesPerView: 1.6,
                        spaceBetween: 30,
                        loop: shouldLoop
                    },
                    1024: {
                        slidesPerView: 'auto',
                        spaceBetween: 40,
                        loop: shouldLoop
                    }
                },

                // Events
                on: {
                    init: () => {
                        // Delay to ensure Swiper is fully initialized
                        setTimeout(() => {
                            this.updateProgress();
                            this.initCustomEffects();
                            this.playInitialEntrance();
                        }, 100);
                    },
                    slideChange: () => {
                        this.onSlideChange();
                    },
                    slideChangeTransitionStart: () => {
                        this.animateSlideTransition('start');
                    },
                    slideChangeTransitionEnd: () => {
                        this.animateSlideTransition('end');
                    }
                }
            });

        } catch (error) {
            console.error('❌ HeroSwiper initialization error:', error);
            return;
        }

        // Set total slides count (with delay to ensure Swiper is ready)
        setTimeout(() => {
            if (this.elements.progressTotal && this.swiper && this.swiper.slides) {
                const totalSlides = this.swiper.slides.length / (this.swiper.params.loop ? 3 : 1);
                this.elements.progressTotal.textContent = String(Math.round(totalSlides)).padStart(2, '0');
            }
        }, 200);

        // Initialize autoplay button
        this.initAutoplayButton();

        this.isInitialized = true;
        console.log('🎠 Hero Swiper initialized');
    }

    /**
     * Initialize autoplay control button
     */
    initAutoplayButton() {
        if (!this.elements.autoplayBtn || !this.swiper) return;

        // Set initial state
        this.isAutoplayPaused = false;
        this.elements.autoplayBtn.classList.remove('is-paused');

        // Add click event listener
        this.elements.autoplayBtn.addEventListener('click', () => {
            this.toggleAutoplay();
        });
    }

    /**
     * Toggle autoplay on/off
     */
    toggleAutoplay() {
        if (!this.swiper) return;

        this.isAutoplayPaused = !this.isAutoplayPaused;

        if (this.isAutoplayPaused) {
            // Pause autoplay
            this.swiper.autoplay.stop();
            this.elements.autoplayBtn.classList.add('is-paused');
        } else {
            // Resume autoplay
            this.swiper.autoplay.start();
            this.elements.autoplayBtn.classList.remove('is-paused');
        }
    }

    /**
     * Animate the first active slide into place on initial load
     */
    playInitialEntrance() {
        if (!this.swiper || !this.swiper.slides?.length) return;

        const activeSlide = this.swiper.slides[this.swiper.activeIndex];
        const activeInner = activeSlide?.querySelector('.hero__slide-inner');

        if (!activeInner) return;

        gsap.fromTo(activeInner,
            {
                scale: 0.85,
                opacity: 0.4
            },
            {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out'
            }
        );
    }

    /**
     * Initialize custom visual effects
     */
    initCustomEffects() {
        // Add GSAP-powered hover effects to slides
        const slides = document.querySelectorAll('.hero__slide-inner');

        slides.forEach(slide => {
            const image = slide.querySelector('.hero__slide-image');
            const overlay = slide.querySelector('.hero__slide-overlay');

            // Mouse enter effect
            slide.addEventListener('mouseenter', () => {
                gsap.to(image, {
                    scale: 1.08,
                    duration: 0.6,
                    ease: 'power2.out'
                });

                gsap.to(overlay, {
                    opacity: 1,
                    duration: 0.3
                });
            });

            // Mouse leave effect
            slide.addEventListener('mouseleave', () => {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });

            // Magnetic effect on mouse move
            slide.addEventListener('mousemove', (e) => {
                const rect = slide.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(slide, {
                    x: x * 0.05,
                    y: y * 0.05,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            slide.addEventListener('mouseleave', () => {
                gsap.to(slide, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });
    }

    /**
     * Handle slide change event
     */
    onSlideChange() {
        this.updateProgress();
        this.animateProgressCounter();
    }

    /**
     * Update progress counter
     */
    updateProgress() {
        if (!this.swiper || !this.elements.progressCurrent) {
            return;
        }

        if (this.swiper.realIndex !== undefined) {
            const realIndex = this.swiper.realIndex + 1;
            this.elements.progressCurrent.textContent = String(realIndex).padStart(2, '0');
        } else if (this.swiper.activeIndex !== undefined) {
            const activeIndex = this.swiper.activeIndex + 1;
            this.elements.progressCurrent.textContent = String(activeIndex).padStart(2, '0');
        }
    }

    /**
     * Animate progress counter change
     */
    animateProgressCounter() {
        if (!this.elements.progressCurrent) return;

        gsap.fromTo(this.elements.progressCurrent,
            {
                y: 20,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out'
            }
        );
    }

    /**
     * Custom slide transition animation
     * @param {string} phase - 'start' or 'end'
     */
    animateSlideTransition(phase) {
        if (!this.swiper || !this.swiper.slides || this.swiper.activeIndex === undefined) {
            return;
        }

        const activeSlide = this.swiper.slides[this.swiper.activeIndex];
        const activeInner = activeSlide?.querySelector('.hero__slide-inner');

        if (!activeInner) return;

        if (phase === 'start') {
            // Transition start - scale down slightly
            gsap.to(activeInner, {
                scale: 0.95,
                duration: 0.3,
                ease: 'power2.in'
            });
        } else {
            // Transition end - scale back up with bounce
            gsap.to(activeInner, {
                scale: 1,
                duration: 0.5,
                ease: 'back.out(1.2)'
            });
        }
    }

    /**
     * Go to specific slide
     * @param {number} index - Slide index
     */
    goTo(index) {
        if (this.swiper) {
            if (this.swiper.params.loop) {
                this.swiper.slideToLoop(index);
            } else {
                this.swiper.slideTo(index);
            }
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
window.HeroSwiper = HeroSwiper;
