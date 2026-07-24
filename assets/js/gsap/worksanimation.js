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
            titleHighlight: document.querySelectorAll('.works__title-highlight, .more-works__title-highlight'),
            cards: document.querySelectorAll('.works__card'),
            decos: document.querySelectorAll('.works__deco, .more-works__deco')
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

        // Decorative elements - initial state
        // 방향/시간 조절 포인트: y는 아래로 이동할 거리, rotation은 회전 방향을 결정합니다.
        if (this.elements.decos && this.elements.decos.length > 0) {
            gsap.set(this.elements.decos, {
                opacity: 0,
                y: 20,
                scale: 0.9,
                rotation: -6
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

        // Phase 3: Decorative elements enter smoothly
        // 방향/시간 조절 포인트: duration과 stagger 값을 바꾸면 나타나는 속도와 순차 간격을 조정할 수 있습니다.
        if (this.elements.decos && this.elements.decos.length > 0) {
            tl.to(this.elements.decos, {
                opacity: 0.5,
                y: 0,
                scale: 1,
                rotation: 0,
                duration: 0.9,
                stagger: 0.12
            }, 0.4);
        }

        // Phase 4: First 6 cards appear on section entry, remaining 2 on scroll
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
        // 방향/시간 조절 포인트: y와 rotation 값으로 스크롤 시 방향을 바꾸고,
        // scrub 값으로 반응 속도를 조절할 수 있습니다.
        if (this.elements.decos && this.elements.decos.length > 0) {
            this.elements.decos.forEach((deco, index) => {
                gsap.to(deco, {
                    y: index % 2 === 0 ? -24 : 24,
                    rotation: index % 2 === 0 ? 4 : -4,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: deco,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.5
                    }
                });
            });
        }
    }

    /**
     * Animate highlight underline
     */
    animateHighlightUnderline() {
        if (!this.elements.titleHighlight || this.elements.titleHighlight.length === 0) return;

        // Create CSS variable for animation if not exists
        if (!document.querySelector('#works-highlight-styles')) {
            const style = document.createElement('style');
            style.id = 'works-highlight-styles';
            style.textContent = `
                .works__title-highlight,
                .more-works__title-highlight {
                    --highlight-scale: 0;
                }
                .works__title-highlight::after,
                .more-works__title-highlight::after {
                    transform: scaleX(var(--highlight-scale));
                }
            `;
            document.head.appendChild(style);
        }

        // 한 글자씩 타이핑 효과
        this.elements.titleHighlight.forEach(highlight => {
            const chars = highlight.querySelectorAll('.title-highlight__char');
            if (chars.length) {
                gsap.to(chars, {
                    opacity: 1,
                    y: 0,
                    duration: 0.25,
                    stagger: 0.06,
                    ease: 'power2.out'
                });
            }

            gsap.to(highlight, {
                '--highlight-scale': 1,
                duration: 0.8,
                ease: 'power2.out'
            });
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
