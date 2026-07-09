/**
 * aboutAnimation.js
 * About Section GSAP 애니메이션
 * ScrollTrigger 기반 순차 등장 + 패럴랙스 효과
 */

class AboutAnimation {
    constructor() {
        this.section = document.querySelector('.about');
        this.isInitialized = false;

        // Animation targets
        this.elements = {
            label: document.querySelector('.about__label'),
            titleLines: document.querySelectorAll('.about__title-text'),
            statement: document.querySelector('.about__statement'),
            statementHighlight: document.querySelector('.about__statement-highlight'),
            description: document.querySelector('.about__description'),
            keywords: document.querySelectorAll('.about__keyword'),
            imageWrapper: document.querySelector('.about__image-wrapper'),
            image: document.querySelector('.about__image'),
            stats: document.querySelectorAll('.about__stat'),
            number: document.querySelector('.about__number'),
            decos: document.querySelectorAll('.about__deco')
        };

        // Bind methods
        this.init = this.init.bind(this);
    }

    /**
     * 모바일 뷰포트 여부 (768px 이하)
     */
    get isMobile() {
        return typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
    }

    /**
     * Initialize about section animations
     */
    init() {
        if (this.isInitialized || !this.section) return;

        // Set initial states
        this.setInitialStates();

        // Create scroll-triggered animations
        this.createEntranceAnimation();
        this.createParallaxEffects();
        this.createKeywordAnimations();
        this.createImageAnimations();

        this.isInitialized = true;
        console.log('📝 About animations initialized');
    }

    /**
     * Set initial states for all animated elements
     */
    setInitialStates() {
        // Label
        gsap.set(this.elements.label, {
            opacity: 0,
            x: -30
        });

        // Title lines - 모바일에서는 처음부터 보이게
        if (!this.isMobile) {
            gsap.set(this.elements.titleLines, {
                yPercent: 100,
                opacity: 0
            });
        } else {
            // 모바일에서는 transform을 완전히 제거하여 겹침 방지
            this.elements.titleLines.forEach(line => {
                gsap.set(line, {
                    opacity: 1,
                    yPercent: 0,
                    y: 0,
                    transform: 'none',
                    clearProps: 'all'
                });
                // 인라인 스타일로도 확실하게 설정
                line.style.transform = 'none';
                line.style.opacity = '1';
            });
        }

        // Statement
        gsap.set(this.elements.statement, {
            opacity: 0,
            y: 40
        });

        // Description
        gsap.set(this.elements.description, {
            opacity: 0,
            y: 30
        });

        // Keywords
        gsap.set(this.elements.keywords, {
            opacity: 0,
            y: 40,
            scale: 0.95
        });

        // Image wrapper
        gsap.set(this.elements.imageWrapper, {
            opacity: 0,
            scale: 0.9,
            y: 60
        });

        // Stats
        gsap.set(this.elements.stats, {
            opacity: 0,
            y: 30
        });

        // Section number
        if (this.elements.number) {
            gsap.set(this.elements.number, {
                opacity: 0,
                x: 50
            });
        }

        // Decorative elements
        gsap.set(this.elements.decos, {
            opacity: 0,
            scale: 0.8
        });
    }

    /**
     * Create main entrance animation with ScrollTrigger
     */
    createEntranceAnimation() {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: this.section,
                start: 'top 80%',
                end: 'top 20%',
                toggleActions: 'play none none none',
                once: false,
                markers: false,
                invalidateOnRefresh: true
            },
            defaults: {
                ease: 'expo.out',
                duration: 1
            }
        });

        // Phase 1: Label slides in
        tl.to(this.elements.label, {
            opacity: 1,
            x: 0,
            duration: 0.8
        }, 0);

        // Phase 2: Title lines reveal - 모바일에서는 애니메이션 스킵(이미 보임)
        if (this.isMobile) {
            // 모바일에서는 transform을 완전히 제거하여 겹침 방지
            this.elements.titleLines.forEach(line => {
                gsap.set(line, {
                    opacity: 1,
                    yPercent: 0,
                    y: 0,
                    transform: 'none',
                    clearProps: 'all'
                });
                line.style.transform = 'none';
                line.style.opacity = '1';
            });
        } else {
            tl.to(this.elements.titleLines, {
                yPercent: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.12,
                onComplete: () => {
                    gsap.set(this.elements.titleLines, {
                        opacity: 1,
                        yPercent: 0,
                        clearProps: 'all'
                    });
                }
            }, 0.2);
        }

        // Phase 3: Section number
        if (this.elements.number) {
            tl.to(this.elements.number, {
                opacity: 1,
                x: 0,
                duration: 1
            }, 0.3);
        }

        // Phase 4: Statement appears
        tl.to(this.elements.statement, {
            opacity: 1,
            y: 0,
            duration: 1
        }, 0.5);

        // Phase 5: Highlight underline
        tl.to(this.elements.statementHighlight, {
            '--highlight-scale': 1,
            duration: 0.8,
            ease: 'power2.out'
        }, 0.9);

        // Phase 6: Description
        tl.to(this.elements.description, {
            opacity: 1,
            y: 0,
            duration: 0.8
        }, 0.7);

        // Phase 7: Keywords stagger
        tl.to(this.elements.keywords, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1
        }, 0.9);

        // Phase 8: Image area
        tl.to(this.elements.imageWrapper, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2
        }, 0.4);

        // Phase 9: Stats
        tl.to(this.elements.stats, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1
        }, 1);

        // Phase 10: Decorations
        tl.to(this.elements.decos, {
            opacity: 0.5,
            scale: 1,
            duration: 1,
            stagger: 0.2
        }, 0.8);

        // Add CSS for highlight animation
        this.addHighlightStyles();
    }

    /**
     * Add CSS styles for highlight animation
     */
    addHighlightStyles() {
        if (document.querySelector('#about-highlight-styles')) return;

        const style = document.createElement('style');
        style.id = 'about-highlight-styles';
        style.textContent = `
            .about__statement-highlight {
                --highlight-scale: 0;
            }
            .about__statement-highlight::after {
                transform: scaleX(var(--highlight-scale));
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Create parallax effects on scroll
     */
    createParallaxEffects() {
        // Title parallax removed - keep titles always visible
        // Only apply parallax to non-essential elements

        // Image parallax - moves up faster
        gsap.to(this.elements.image, {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: {
                trigger: this.section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2
            }
        });

        // Section number parallax
        if (this.elements.number) {
            gsap.to(this.elements.number, {
                yPercent: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: this.section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }

        // Decorations parallax
        this.elements.decos.forEach((deco, index) => {
            gsap.to(deco, {
                y: index % 2 === 0 ? -50 : 50,
                rotation: index % 2 === 0 ? 10 : -10,
                ease: 'none',
                scrollTrigger: {
                    trigger: this.section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2
                }
            });
        });
    }

    /**
     * Create keyword hover animations
     */
    createKeywordAnimations() {
        this.elements.keywords.forEach(keyword => {
            const icon = keyword.querySelector('.about__keyword-icon');

            keyword.addEventListener('mouseenter', () => {
                gsap.to(icon, {
                    scale: 1.2,
                    rotation: 5,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                });
            });

            keyword.addEventListener('mouseleave', () => {
                gsap.to(icon, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    /**
     * Create image hover animations
     */
    createImageAnimations() {
        if (!this.elements.imageWrapper) return;

        const frame = this.elements.imageWrapper.querySelector('.about__image-frame');

        this.elements.imageWrapper.addEventListener('mouseenter', () => {
            if (frame) {
                gsap.to(frame, {
                    scale: 1.02,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });

        this.elements.imageWrapper.addEventListener('mouseleave', () => {
            if (frame) {
                gsap.to(frame, {
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });

        // Mouse move effect
        this.elements.imageWrapper.addEventListener('mousemove', (e) => {
            const rect = this.elements.imageWrapper.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
            const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

            gsap.to(this.elements.image, {
                x: x * 10,
                y: y * 10,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        this.elements.imageWrapper.addEventListener('mouseleave', () => {
            gsap.to(this.elements.image, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    }

    /**
     * Destroy animations and clean up
     */
    destroy() {
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.vars.trigger === this.section) {
                trigger.kill();
            }
        });
        this.isInitialized = false;
    }
}

// Export for use in main.js
window.AboutAnimation = AboutAnimation;
