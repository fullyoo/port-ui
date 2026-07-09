/**
 * selectedWorksAnimation.js
 * Selected Works Section GSAP 애니메이션
 * ScrollTrigger 기반 섹션 등장 + Swiper 연동 트랜지션
 */

class SelectedWorksAnimation {
    constructor() {
        this.section = document.querySelector('.selected-works');
        this.isInitialized = false;

        // Animation targets
        this.elements = {
            titleLines: document.querySelectorAll('.selected-works__title-text'),
            titleHighlight: document.querySelector('.selected-works__title-highlight'),
            cards: document.querySelectorAll('.selected-works__card')
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
     * Initialize selected works section animations
     */
    init() {
        if (this.isInitialized || !this.section) return;

        // Set initial states
        this.setInitialStates();

        // Create scroll-triggered animations
        this.createEntranceAnimation();
        this.createParallaxEffects();

        this.isInitialized = true;
        console.log('💼 Selected Works animations initialized');
    }

    /**
     * Set initial states for all animated elements
     */
    setInitialStates() {
        // Title lines - 항상 보이게 설정
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

        // Cards - 초기 숨김 상태
        if (this.elements.cards && this.elements.cards.length > 0) {
            gsap.set(this.elements.cards, {
                opacity: 0,
                y: 50
            });
        }
    }

    /**
     * Create entrance animation on scroll
     */
    createEntranceAnimation() {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: this.section,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none none',
                once: true
            }
        });

        // Phase 1: Title lines reveal - 항상 보이게 설정
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

        // Phase 2: Highlight underline animation
        if (this.elements.titleHighlight) {
            tl.add(() => {
                this.animateHighlightUnderline();
            }, 0.3);
        }

        // Phase 3: Cards appear with stagger
        if (this.elements.cards && this.elements.cards.length > 0) {
            tl.to(this.elements.cards, {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.15,
                ease: 'power3.out'
            }, 0.5);
        }
    }

    /**
     * Animate highlight underline
     */
    animateHighlightUnderline() {
        if (!this.elements.titleHighlight) return;

        // Create CSS variable for animation if not exists
        if (!document.querySelector('#selected-works-highlight-styles')) {
            const style = document.createElement('style');
            style.id = 'selected-works-highlight-styles';
            style.textContent = `
                .selected-works__title-highlight {
                    --highlight-scale: 0;
                }
                .selected-works__title-highlight::after {
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

        const content = card.querySelector('.selected-works__card-content');
        const image = card.querySelector('.selected-works__card-image');

        // Content animation
        if (content) {
            const title = content.querySelector('.selected-works__card-title');
            const problem = content.querySelector('.selected-works__card-problem');
            const roles = content.querySelector('.selected-works__card-roles');
            const btn = content.querySelector('.selected-works__card-btn');

            gsap.fromTo([title, problem, roles, btn],
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out'
                }
            );
        }

        // Image animation
        if (image) {
            const img = image.querySelector('.selected-works__card-img');
            if (img) {
                gsap.fromTo(img,
                    { scale: 0.95, opacity: 0.8 },
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power2.out'
                    }
                );
            }
        }
    }

    /**
     * Create parallax effects on scroll
     */
    createParallaxEffects() {
        // Subtle parallax for section
        if (this.section) {
            gsap.to(this.section, {
                yPercent: -2,
                ease: 'none',
                scrollTrigger: {
                    trigger: this.section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2,
                    invalidateOnRefresh: true
                }
            });
        }
    }
}
