/**
 * heroAnimation.js
 * Hero Section GSAP 애니메이션
 * Timeline 기반 순차 애니메이션 + ScrollTrigger 패럴랙스
 */

class HeroAnimation {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.isInitialized = false;

        // Animation targets
        this.elements = {
            label: document.querySelector('.hero__label'),
            titleLines: document.querySelectorAll('.hero__title-text'),
            highlight: document.querySelector('.hero__title-highlight:not(.hero__title-highlight--cycle)'),
            subtitle: document.querySelector('.hero__subtitle'),
            cta: document.querySelector('.hero__cta'),
            keywords: document.querySelectorAll('.hero__keyword'),
            visual: document.querySelector('.hero__visual'),
            decoGrid: document.querySelector('.hero__deco--grid'),
            decoLine: document.querySelector('.hero__deco--line'),
            progress: document.querySelector('.hero__progress')
        };

        // Timelines
        this.masterTimeline = null;
        this.scrollTimeline = null;

        // Bind methods
        this.init = this.init.bind(this);
        this.createEntranceAnimation = this.createEntranceAnimation.bind(this);
        this.createScrollAnimation = this.createScrollAnimation.bind(this);
        this.createHighlightAnimation = this.createHighlightAnimation.bind(this);
    }

    /**
     * 모바일 뷰포트 여부 (768px 이하)
     */
    get isMobile() {
        return typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
    }

    /**
     * Initialize all hero animations
     */
    init() {
        if (this.isInitialized || !this.hero) return;

        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger);

        // 타이틀을 먼저 확실하게 보이게 설정
        if (this.elements.titleLines.length) {
            gsap.set(this.elements.titleLines, {
                opacity: 1,
                yPercent: 0,
                clearProps: 'all'
            });
            // CSS 강제 적용을 위해 강제로 스타일 설정
            this.elements.titleLines.forEach(line => {
                line.style.opacity = '1';
                line.style.visibility = 'visible';
                line.style.transform = 'translateY(0%)';
            });
        }

        // Set initial states
        this.setInitialStates();

        // Create animations
        this.createEntranceAnimation();
        this.createScrollAnimation();
        this.createKeywordAnimation();
        this.createHighlightAnimation();

        // Add highlight styles
        this.addHighlightStyles();

        // 타이틀이 항상 보이도록 주기적으로 확인 (애니메이션 중에도)
        this.ensureTitleVisible();

        this.isInitialized = true;
        console.log('🎬 Hero animations initialized');
    }

    /**
     * 타이틀이 항상 보이도록 보장
     */
    ensureTitleVisible() {
        if (!this.elements.titleLines.length) return;

        const checkInterval = setInterval(() => {
            this.elements.titleLines.forEach(line => {
                const computedStyle = window.getComputedStyle(line);
                if (computedStyle.opacity === '0' || computedStyle.visibility === 'hidden') {
                    line.style.opacity = '1';
                    line.style.visibility = 'visible';
                    line.style.transform = 'translateY(0%)';
                }
            });
        }, 100);

        // 5초 후에는 체크 중단 (애니메이션이 완료된 후)
        setTimeout(() => {
            clearInterval(checkInterval);
        }, 5000);
    }

    /**
     * Add CSS styles for highlight animation
     */
    addHighlightStyles() {
        if (document.querySelector('#hero-highlight-styles')) return;

        const style = document.createElement('style');
        style.id = 'hero-highlight-styles';
        style.textContent = `
            .hero__title-highlight {
                --highlight-scale: 0;
            }
            .hero__title-highlight::after {
                transform: scaleX(var(--highlight-scale, 0));
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Set initial states for all animated elements
     */
    setInitialStates() {
        // Title lines - 처음부터 보이게 (애니메이션 없이)
        if (this.elements.titleLines.length) {
            // 타이틀은 항상 보이게 설정 (CSS의 opacity: 1 !important 유지)
            gsap.set(this.elements.titleLines, { opacity: 1, yPercent: 0 });
            // 인라인 스타일로도 강제 설정
            this.elements.titleLines.forEach(line => {
                line.style.opacity = '1';
                line.style.visibility = 'visible';
                line.style.transform = 'translateY(0%)';
            });
        }

        // Label - initial state for the original entrance animation
        if (this.elements.label) {
            gsap.set(this.elements.label, {
                opacity: 0,
                y: 30
            });
        }

        // Subtitle - invisible
        if (this.elements.subtitle) {
            gsap.set(this.elements.subtitle, {
                opacity: 0,
                y: 30
            });
        }

        // CTA - invisible
        if (this.elements.cta) {
            gsap.set(this.elements.cta, {
                opacity: 0,
                y: 30
            });
        }

        // Keywords - scattered and invisible
        if (this.elements.keywords.length) {
            gsap.set(this.elements.keywords, {
                opacity: 0,
                scale: 0.8
            });
        }

        // Visual area
        if (this.elements.visual) {
            gsap.set(this.elements.visual, {
                opacity: 0,
                x: 50
            });
        }

        // Decorative elements
        // 방향/시간 조절 포인트: y, scale, opacity 값을 바꾸면 시작 위치와 등장 속도를 조절할 수 있습니다.
        if (this.elements.decoGrid) {
            gsap.set(this.elements.decoGrid, {
                // 시작 투명도: 여기서 요소가 기본적으로 보일지 여부를 조절합니다.
                opacity: 0.4,
                scale: 0.96,
                y: 20
            });
        }

        if (this.elements.decoLine) {
            gsap.set(this.elements.decoLine, {
                opacity: 0,
                scaleY: 0.9
            });
        }

        // Progress counter
        if (this.elements.progress) {
            gsap.set(this.elements.progress, {
                opacity: 0,
                y: -20
            });
        }
    }

    /**
     * Create entrance animation timeline
     * Triggered after loading screen completes
     */
    createEntranceAnimation() {
        this.masterTimeline = gsap.timeline({
            paused: true,
            defaults: {
                ease: 'expo.out',
                duration: 1.2
            }
        });

        // Phase 1: Label appears
        if (this.elements.label) {
            this.masterTimeline.to(this.elements.label, {
                opacity: 1,
                y: 0,
                duration: 0.8
            }, 0);
        }

        // Phase 2: Title lines - 이미 보이므로 애니메이션 스킵
        if (this.elements.titleLines.length) {
            // 타이틀은 이미 보이는 상태이므로 애니메이션 없이 유지
            gsap.set(this.elements.titleLines, { opacity: 1, yPercent: 0, clearProps: 'all' });
        }

        // Phase 3: Subtitle fades in
        if (this.elements.subtitle) {
            this.masterTimeline.to(this.elements.subtitle, {
                opacity: 1,
                y: 0,
                duration: 1
            }, 0.8);
        }

        // Phase 4: CTA appears
        if (this.elements.cta) {
            this.masterTimeline.to(this.elements.cta, {
                opacity: 1,
                y: 0,
                duration: 0.8
            }, 1);
        }

        // Phase 5: Visual area slides in
        if (this.elements.visual) {
            this.masterTimeline.to(this.elements.visual, {
                opacity: 1,
                x: 0,
                duration: 1.2
            }, 0.6);
        }

        // Phase 6: Decorative elements
        // 방향/시간 조절 포인트: duration 값을 늘리면 느리게, 줄이면 더 빠르게 나타납니다.
        // y/scale 값은 등장 방향과 크기 변화에 영향을 줍니다.
        if (this.elements.decoGrid) {
            this.masterTimeline.to(this.elements.decoGrid, {
                // 등장 후 최종 투명도: 이 값을 올리면 더 선명하게 보입니다.
                opacity: 0.4,
                y: 0,
                scale: 1,
                duration: 1.1,
                ease: 'power2.out'
            }, 0.2);
        }

        if (this.elements.decoLine) {
            this.masterTimeline.to(this.elements.decoLine, {
                opacity: 0.8,
                scaleY: 1,
                duration: 1.1,
                ease: 'power2.out'
            }, 0.3);
        }

        // Phase 7: Progress counter
        if (this.elements.progress) {
            this.masterTimeline.to(this.elements.progress, {
                opacity: 1,
                y: 0,
                duration: 0.6
            }, 1.2);
        }

        // Phase 8: Highlight underline animation
        this.masterTimeline.add(() => {
            this.animateHighlightUnderline();
        }, 0.4);

        return this.masterTimeline;
    }

    /**
     * Animate the highlight underline with CSS custom property
     */
    animateHighlightUnderline() {
        if (!this.elements.highlight) return;

        // 한 글자씩 타이핑 효과: 순환형 하이라이트가 아니라
        // 실제 타이핑 대상인 UI Designer 텍스트만 애니메이션
        const chars = this.elements.highlight.querySelectorAll('.title-highlight__char');
        if (chars.length) {
            gsap.to(chars, {
                opacity: 1,
                y: 0,
                duration: 0.25,
                stagger: 0.06,
                ease: 'power2.out'
            });
        }

        gsap.to(this.elements.highlight, {
            '--highlight-scale': 1,
            duration: 0.8,
            ease: 'expo.out'
        });
    }

    /**
     * Create scroll-triggered animations
     */
    createScrollAnimation() {
        // 모바일에서는 스크롤 애니메이션 비활성화 (레이아웃 변경 방지)
        if (this.isMobile) {
            return;
        }

        // Title and subtitle parallax removed - keep them always visible
        // Only apply parallax to visual elements

        // Visual area parallax (opposite direction) - keep this for depth

        // Visual area parallax (opposite direction)
        if (this.elements.visual) {
            gsap.to(this.elements.visual, {
                yPercent: 10,
                ease: 'none',
                scrollTrigger: {
                    trigger: this.hero,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }

        // Decorative elements parallax
        // 방향/시간 조절 포인트: yPercent와 rotation 값을 바꾸면 스크롤 시 이동 방향과 회전 방향을 바꿀 수 있습니다.
        // scrub 값이 클수록 스크롤 반응이 느려지고, 작을수록 더 민감하게 반응합니다.
        if (this.elements.decoGrid) {
            gsap.to(this.elements.decoGrid, {
                // 스크롤 중 유지할 투명도: 스크롤 시에도 보이게 하려면 0이 아닌 값을 사용하세요.
                opacity: 0.2,
                yPercent: -4,
                rotation: -1,
                ease: 'none',
                scrollTrigger: {
                    trigger: this.hero,
                    start: 'center top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }

        if (this.elements.decoLine) {
            gsap.to(this.elements.decoLine, {
                opacity: 0.3,
                yPercent: 8,
                ease: 'none',
                scrollTrigger: {
                    trigger: this.hero,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.2
                }
            });
        }

        // CTA only fades out on scroll; label should stay anchored and readable
        if (!this.isMobile) {
            const fadeElements = [this.elements.cta].filter(el => el);
            if (fadeElements.length) {
                gsap.to(fadeElements, {
                    opacity: 0,
                    y: -30,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: this.hero,
                        start: '20% top',
                        end: '50% top',
                        scrub: true
                    }
                });
            }

            // Scale down visual on scroll
            const slideInners = document.querySelectorAll('.hero__slide-inner');
            if (slideInners.length) {
                gsap.to(slideInners, {
                    scale: 0.9,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: this.hero,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1.5
                    }
                });
            }
        }
    }

    /**
     * Create floating keyword animations
     */
    createKeywordAnimation() {
        if (!this.elements.keywords.length) return;

        // 키워드가 이미 CSS에서 opacity: 0.6으로 설정되어 있으므로, 애니메이션으로 더 눈에 띄게
        // Staggered entrance (delayed to play after main entrance)
        this.masterTimeline.to(this.elements.keywords, {
            opacity: 0.8,
            scale: 1,
            duration: 1,
            stagger: {
                each: 0.2,
                from: 'random'
            },
            ease: 'back.out(1.7)'
        }, 2);

        // 각 키워드에 개별적인 플로팅 애니메이션 추가 (CSS 애니메이션과 함께 작동)
        this.elements.keywords.forEach((keyword, index) => {
            // CSS 애니메이션과 함께 작동하도록 추가 GSAP 애니메이션
            gsap.to(keyword, {
                y: 'random(-15, 15)',
                x: 'random(-8, 8)',
                rotation: 'random(-5, 5)',
                duration: 'random(4, 6)',
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: 3 + index * 0.4
            });

            // 호버 시 더 강한 효과
            keyword.addEventListener('mouseenter', () => {
                gsap.to(keyword, {
                    scale: 1.15,
                    opacity: 1,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                });
            });

            keyword.addEventListener('mouseleave', () => {
                gsap.to(keyword, {
                    scale: 1,
                    opacity: 0.8,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        // 스크롤해도 키워드는 계속 보이도록 유지
        if (!this.isMobile) {
            this.elements.keywords.forEach(keyword => {
                keyword.style.opacity = '0.8';
                keyword.style.visibility = 'visible';
            });
        }
    }

    /**
     * Create highlight text interaction
     */
    createHighlightAnimation() {
        if (!this.elements.highlight) return;

        // Hover effect on highlight text
        this.elements.highlight.addEventListener('mouseenter', () => {
            gsap.to(this.elements.highlight, {
                color: 'var(--color-accent)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        this.elements.highlight.addEventListener('mouseleave', () => {
            gsap.to(this.elements.highlight, {
                color: 'var(--color-primary)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    }

    /**
     * Play entrance animation
     * Called after loading screen completes
     */
    play() {
        if (this.masterTimeline) {
            this.masterTimeline.play();
        }
    }

    /**
     * Pause all animations
     */
    pause() {
        if (this.masterTimeline) {
            this.masterTimeline.pause();
        }
    }

    /**
     * Reset animations to initial state
     */
    reset() {
        if (this.masterTimeline) {
            this.masterTimeline.progress(0).pause();
        }
        this.setInitialStates();
    }

    /**
     * Kill all animations and clean up
     */
    destroy() {
        if (this.masterTimeline) {
            this.masterTimeline.kill();
        }
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.vars.trigger === this.hero) {
                trigger.kill();
            }
        });
        this.isInitialized = false;
    }
}

// Export for use in main.js
window.HeroAnimation = HeroAnimation;
