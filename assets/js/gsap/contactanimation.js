/**
 * contactAnimation.js
 * Contact Section GSAP 애니메이션
 * 절제되지만 인상적인 마지막 섹션 애니메이션
 */

class ContactAnimation {
    constructor() {
        this.section = document.querySelector('.contact');
        this.isInitialized = false;

        // Animation targets
        this.elements = {
            label: document.querySelector('.contact__label'),
            titleLines: document.querySelectorAll('.contact__title-text'),
            titleHighlight: document.querySelector('.contact__title-highlight'),
            subtitle: document.querySelector('.contact__subtitle'),
            cta: document.querySelector('.contact__cta'),
            ctaBtns: document.querySelectorAll('.contact__cta-btn'),
            links: document.querySelectorAll('.contact__link'),
            footer: document.querySelector('.contact__footer'),
            decoNumber: document.querySelector('.contact__deco--number'),
            decoCircles: document.querySelectorAll('.contact__deco--circle, .contact__deco--circle-sm')
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
     * Initialize contact section animations
     */
    init() {
        if (this.isInitialized || !this.section) return;

        // 타이틀을 먼저 확실하게 보이게 설정
        if (this.elements.titleLines && this.elements.titleLines.length > 0) {
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

        // Set initial states
        this.setInitialStates();

        // Create scroll-triggered animations
        this.createEntranceAnimation();
        this.createParallaxEffects();
        this.createButtonAnimations();
        this.createLinkAnimations();

        this.isInitialized = true;
        console.log('📬 Contact animations initialized');
    }

    /**
     * Set initial states for all animated elements
     */
    setInitialStates() {
        // Label
        gsap.set(this.elements.label, {
            opacity: 0,
            y: 20
        });

        // Title lines - 항상 보이게 설정
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

        // Subtitle
        gsap.set(this.elements.subtitle, {
            opacity: 0,
            y: 30
        });

        // CTA buttons
        gsap.set(this.elements.ctaBtns, {
            opacity: 0,
            y: 30
        });

        // Links
        gsap.set(this.elements.links, {
            opacity: 0,
            y: 40
        });

        // Footer
        if (this.elements.footer) {
            gsap.set(this.elements.footer, {
                opacity: 0,
                y: 20
            });
        }

        // Decorative number
        // 방향/시간 조절 포인트: x는 시작 위치, rotation은 초기 회전 방향을 결정합니다.
        if (this.elements.decoNumber) {
            gsap.set(this.elements.decoNumber, {
                opacity: 0,
                x: -100,
                rotation: -8
            });
        }

        // Decorative circles
        // 방향/시간 조절 포인트: y와 rotation 값을 바꾸면 요소의 진입 방향과 각도를 바꿀 수 있습니다.
        gsap.set(this.elements.decoCircles, {
            opacity: 0,
            scale: 0.8,
            y: 20,
            rotation: -6
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

        // Phase 1: Label
        tl.to(this.elements.label, {
            opacity: 1,
            y: 0,
            duration: 0.8
        }, 0);

        // Phase 2: Title lines - 항상 보이게 설정 (애니메이션 없이)
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

        // Phase 3: Highlight underline
        tl.add(() => {
            this.animateHighlightUnderline();
        }, 0.8);

        // Phase 4: Subtitle
        tl.to(this.elements.subtitle, {
            opacity: 1,
            y: 0,
            duration: 1
        }, 0.6);

        // Phase 5: CTA buttons
        tl.to(this.elements.ctaBtns, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1
        }, 0.9);

        // Phase 6: Links stagger
        tl.to(this.elements.links, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08
        }, 1.1);

        // Phase 7: Footer
        if (this.elements.footer) {
            tl.to(this.elements.footer, {
                opacity: 1,
                y: 0,
                duration: 0.6
            }, 1.4);
        }

        // Phase 8: Decorative elements
        // 방향/시간 조절 포인트: duration을 늘리면 더 천천히, x/rotation 값을 바꾸면 이동 방향과 회전 효과를 조정할 수 있습니다.
        if (this.elements.decoNumber) {
            tl.to(this.elements.decoNumber, {
                opacity: 0.5,
                x: 0,
                rotation: 0,
                duration: 1.2
            }, 0.4);
        }

        tl.to(this.elements.decoCircles, {
            opacity: 0.3,
            scale: 1,
            y: 0,
            rotation: 0,
            duration: 1,
            stagger: 0.2
        }, 0.6);
    }

    /**
     * Animate highlight underline
     */
    animateHighlightUnderline() {
        if (!this.elements.titleHighlight) return;

        // Add CSS for highlight animation
        if (!document.querySelector('#contact-highlight-styles')) {
            const style = document.createElement('style');
            style.id = 'contact-highlight-styles';
            style.textContent = `
                .contact__title-highlight {
                    --highlight-scale: 0;
                }
                .contact__title-highlight::after {
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
     * Create parallax effects on scroll
     */
    createParallaxEffects() {
        // Title parallax removed - keep titles always visible
        // Only apply parallax to decorative elements

        // Decorative number parallax
        // 방향/시간 조절 포인트: yPercent와 rotation 값을 바꾸면 스크롤 시 움직임 방향을 조정하고,
        // scrub 값을 바꾸면 반응 속도를 조절할 수 있습니다.
        if (this.elements.decoNumber) {
            gsap.to(this.elements.decoNumber, {
                yPercent: 12,
                rotation: 5,
                ease: 'none',
                scrollTrigger: {
                    trigger: this.section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2
                }
            });
        }

        // Circles parallax
        this.elements.decoCircles.forEach((circle, index) => {
            gsap.to(circle, {
                y: index % 2 === 0 ? -30 : 30,
                rotation: index % 2 === 0 ? 8 : -8,
                ease: 'none',
                scrollTrigger: {
                    trigger: this.section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2 + index * 0.5
                }
            });
        });
    }

    /**
     * Create CTA button hover animations
     */
    createButtonAnimations() {
        this.elements.ctaBtns.forEach(btn => {
            const icon = btn.querySelector('.contact__cta-btn-icon');

            // Magnetic effect
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.15;

                gsap.to(btn, {
                    x: x,
                    y: y,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.5)'
                });
            });

            // Icon animation on hover
            btn.addEventListener('mouseenter', () => {
                if (icon) {
                    gsap.to(icon, {
                        x: 4,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });

            btn.addEventListener('mouseleave', () => {
                if (icon) {
                    gsap.to(icon, {
                        x: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });
    }

    /**
     * Create link hover animations
     */
    createLinkAnimations() {
        this.elements.links.forEach(link => {
            const icon = link.querySelector('.contact__link-icon');

            link.addEventListener('mouseenter', () => {
                gsap.to(icon, {
                    scale: 1.15,
                    rotation: 5,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                });
            });

            link.addEventListener('mouseleave', () => {
                gsap.to(icon, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            // Subtle bounce on click
            link.addEventListener('click', () => {
                gsap.to(link, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                });
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
window.ContactAnimation = ContactAnimation;
