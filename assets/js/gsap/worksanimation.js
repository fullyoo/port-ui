/**
 * worksAnimation.js
 * Works Section GSAP 애니메이션
 * ScrollTrigger 기반 섹션 등장 + Swiper 연동 트랜지션
 */

class WorksAnimation {
    constructor() {
        this.section = document.querySelector('.works');
        this.isInitialized = false;

        // Animation targets
        this.elements = {
            label: document.querySelector('.works__label'),
            titleLines: document.querySelectorAll('.works__title-text'),
            titleHighlight: document.querySelector('.works__title-highlight'),
            cards: document.querySelectorAll('.works__card')
        };

        // Bind methods
        this.init = this.init.bind(this);
        this.animateCardContent = this.animateCardContent.bind(this);
    }

    /**
     * 모바일 뷰포트 여부 (768px 이하)
     */
    get isMobile() {
        return typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
    }

    /**
     * Initialize works section animations
     */
    init() {
        if (this.isInitialized || !this.section) return;

        // Set initial states
        this.setInitialStates();

        // Create scroll-triggered animations
        this.createEntranceAnimation();
        this.createParallaxEffects();

        this.isInitialized = true;
        console.log('💼 Works animations initialized');
    }

    /**
     * Set initial states for all animated elements
     */
    setInitialStates() {
        // Label
        if (this.elements.label) {
            gsap.set(this.elements.label, {
                opacity: 0,
                x: -30
            });
        }

        // Title lines - 항상 보이게 설정 (contact__title과 동일)
        if (this.elements.titleLines && this.elements.titleLines.length > 0) {
            this.elements.titleLines.forEach(line => {
                gsap.set(line, {
                    opacity: 1,
                    yPercent: 0,
                    y: 0,
                    transform: 'none',
                    clearProps: 'all'
                });
                // 인라인 스타일로도 확실하게 설정
                line.style.opacity = '1';
                line.style.visibility = 'visible';
                line.style.transform = 'none';
            });
        }

        // Cards - initial state for entrance
        if (this.elements.cards && this.elements.cards.length > 0) {
            gsap.set(this.elements.cards, {
                opacity: 0,
                y: 60
            });
        }
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
        if (this.elements.label) {
            tl.to(this.elements.label, {
                opacity: 1,
                x: 0,
                duration: 0.8
            }, 0);
        }

        // Phase 2: Title lines reveal - 항상 보이게 설정
        if (this.elements.titleLines && this.elements.titleLines.length > 0) {
            // 타이틀은 항상 보이게 설정
            this.elements.titleLines.forEach(line => {
                gsap.set(line, {
                    opacity: 1,
                    yPercent: 0,
                    y: 0,
                    transform: 'none',
                    clearProps: 'all'
                });
                line.style.opacity = '1';
                line.style.visibility = 'visible';
                line.style.transform = 'none';
            });
        }

        // Phase 2.5: Highlight underline animation
        if (this.elements.titleHighlight) {
            tl.add(() => {
                this.animateHighlightUnderline();
            }, 0.8);
        }

        // Phase 3: First 6 cards appear on section entry, remaining 2 on scroll
        if (this.elements.cards && this.elements.cards.length > 0) {
            const firstSixCards = Array.from(this.elements.cards).slice(0, 6);
            const remainingCards = Array.from(this.elements.cards).slice(6);

            // Animate first 6 cards
            tl.to(firstSixCards, {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.1
            }, 0.5);

            // Animate remaining cards on scroll
            if (remainingCards.length > 0) {
                remainingCards.forEach((card, index) => {
                    gsap.to(card, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            end: 'top 50%',
                            toggleActions: 'play none none none',
                            once: true
                        }
                    });
                });
            }
        }
    }

    /**
     * Create parallax effects on scroll
     */
    createParallaxEffects() {
        // works__card에 transform(translate) 미적용 - 레이아웃 유지
    }

    /**
     * Animate highlight underline
     */
    animateHighlightUnderline() {
        if (!this.elements.titleHighlight) return;

        // Create CSS variable for animation if not exists
        if (!document.querySelector('#works-highlight-styles')) {
            const style = document.createElement('style');
            style.id = 'works-highlight-styles';
            style.textContent = `
                .works__title-highlight {
                    --highlight-scale: 0;
                }
                .works__title-highlight::after {
                    transform: scaleX(var(--highlight-scale));
                }
            `;
            document.head.appendChild(style);
        }

        // 한 글자씩 타이핑 효과
        const chars = this.elements.titleHighlight.querySelectorAll('.title-highlight__char');
        if (chars.length) {
            gsap.to(chars, {
                opacity: 1,
                y: 0,
                duration: 0.25,
                stagger: 0.06,
                ease: 'power2.out'
            });
        }

        gsap.to(this.elements.titleHighlight, {
            '--highlight-scale': 1,
            duration: 0.8,
            ease: 'power2.out'
        });
    }

    /**
     * Animate card content on slide change
     * @param {number} index - Card index
     */
    animateCardContent(index) {
        const card = this.elements.cards[index];
        if (!card) return;

        const content = card.querySelector('.works__card-content');
        const image = card.querySelector('.works__card-img');

        if (content) {
            gsap.fromTo(content,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
            );
        }

        if (image) {
            gsap.fromTo(image,
                { scale: 0.95 },
                { scale: 1, duration: 0.8, ease: 'power2.out' }
            );
        }
    }
}

// Export for use in main.js
window.WorksAnimation = WorksAnimation;
