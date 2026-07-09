/**
 * caseStudyAnimation.js
 * Case Study 페이지 GSAP + ScrollTrigger 애니메이션
 * 
 * 섹션별 애니메이션:
 * 1. Case Hero - 페이지 로드 시 순차 등장
 * 2. Project Overview - 스크롤 진입 시 카드 stagger
 * 3. Problem Definition - 문제 카드 순차 강조
 * 4. Process & Approach - 타임라인 단계별 등장
 * 5. Solution - 솔루션 아이템 교차 등장
 * 6. Result & Impact - 숫자 카운트업 애니메이션
 * 7. Reflection - 텍스트 천천히 등장
 * 8. Next Project CTA - CTA 강조 애니메이션
 */

class CaseStudyAnimation {
    constructor() {
        // GSAP & ScrollTrigger 등록
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // 섹션 요소들
        this.sections = {
            hero: document.querySelector('.case-hero'),
            overview: document.querySelector('.case-overview'),
            problem: document.querySelector('.case-problem'),
            process: document.querySelector('.case-process'),
            solution: document.querySelector('.case-solution'),
            result: document.querySelector('.case-result'),
            reflection: document.querySelector('.case-reflection'),
            cta: document.querySelector('.case-cta')
        };

        // 상태
        this.isInitialized = false;
        this.scrollProgress = 0;

        // 바인딩
        this.init = this.init.bind(this);
        this.updateScrollProgress = this.updateScrollProgress.bind(this);
    }

    /**
     * 초기화
     */
    init() {
        if (this.isInitialized) return;

        console.log('🎬 CaseStudyAnimation initializing...');

        // 스크롤 진행률 업데이트
        this.setupScrollProgress();

        // 각 섹션 애니메이션 설정
        this.animateHero();
        this.animateOverview();
        this.animateProblem();
        this.animateProcess();
        this.animateSolution();
        this.animateResult();
        this.animateReflection();
        this.animateCTA();

        this.isInitialized = true;
        console.log('✅ CaseStudyAnimation initialized');
    }

    /**
     * 스크롤 진행률 바 업데이트
     */
    setupScrollProgress() {
        const progressBar = document.querySelector('.case-nav__progress-bar');
        if (!progressBar) return;

        // 스크롤 시 진행률 업데이트
        ScrollTrigger.create({
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
                this.scrollProgress = self.progress * 100;
                progressBar.style.width = `${this.scrollProgress}%`;
            }
        });
    }

    /**
     * 1. Case Hero 애니메이션
     * - 페이지 로드 시 텍스트 순차 등장
     * - 이미지 scale + fade 인
     */
    animateHero() {
        const section = this.sections.hero;
        if (!section) return;

        const tl = gsap.timeline({
            defaults: { ease: 'power3.out' }
        });

        // 메타 정보 (카테고리, 연도) - from: 숨김 → 현재 상태
        tl.from('.case-hero__meta', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            delay: 0.3
        });

        // 타이틀 라인 순차 등장
        tl.from('.case-hero__title-line', {
            opacity: 0,
            y: 40,
            duration: 0.8,
            stagger: 0.15
        }, '-=0.4');

        // 설명
        tl.from('.case-hero__description', {
            opacity: 0,
            y: 20,
            duration: 0.8
        }, '-=0.4');

        // 정보 (Role, Duration, Tools)
        tl.from('.case-hero__info', {
            opacity: 0,
            y: 20,
            duration: 0.8
        }, '-=0.4');

        // 메인 비주얼 이미지
        tl.from('.case-hero__visual', {
            opacity: 0,
            scale: 0.95,
            duration: 1.2,
            ease: 'power2.out'
        }, '-=0.4');
    }

    /**
     * 2. Project Overview 애니메이션
     * - 스크롤 진입 시 카드 stagger 등장
     */
    animateOverview() {
        const section = this.sections.overview;
        if (!section) return;

        const items = section.querySelectorAll('.case-overview__item');

        gsap.from(items, {
            scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        });
    }

    /**
     * 3. Problem Definition 애니메이션
     * - 문제 카드 순차 강조
     * - 인용문 등장
     */
    animateProblem() {
        const section = this.sections.problem;
        if (!section) return;

        const cards = section.querySelectorAll('.case-problem__card');
        const quote = section.querySelector('.case-problem__quote');

        // 카드 순차 등장
        gsap.from(cards, {
            scrollTrigger: {
                trigger: cards[0],
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
        });

        // 인용문 등장
        if (quote) {
            gsap.from(quote, {
                scrollTrigger: {
                    trigger: quote,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 20,
                duration: 0.8,
                ease: 'power3.out'
            });
        }
    }

    /**
     * 4. Process & Approach 애니메이션
     * - 타임라인 단계별 등장
     * - 디자인 원칙 등장
     */
    animateProcess() {
        const section = this.sections.process;
        if (!section) return;

        const steps = section.querySelectorAll('.case-process__step');
        const principles = section.querySelector('.case-process__principles');

        // 단계별 등장
        gsap.from(steps, {
            scrollTrigger: {
                trigger: steps[0],
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
        });

        // 디자인 원칙 등장
        if (principles) {
            gsap.from(principles, {
                scrollTrigger: {
                    trigger: principles,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 20,
                duration: 0.8,
                ease: 'power3.out'
            });
        }
    }

    /**
     * 5. Solution 애니메이션
     * - 솔루션 아이템 교차 등장
     * - Before/After 비교 등장
     */
    animateSolution() {
        const section = this.sections.solution;
        if (!section) return;

        const items = section.querySelectorAll('.case-solution__item');
        const comparison = section.querySelector('.case-solution__comparison');

        // 솔루션 아이템 개별 등장
        items.forEach((item, index) => {
            const isReverse = item.classList.contains('case-solution__item--reverse');
            
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 40,
                duration: 0.8,
                ease: 'power3.out'
            });

            // 내부 콘텐츠와 이미지 분리 트랜지션
            const content = item.querySelector('.case-solution__item-content');
            const visual = item.querySelector('.case-solution__item-visual');

            if (content && visual) {
                gsap.from(content, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    },
                    x: isReverse ? 30 : -30,
                    opacity: 0,
                    duration: 0.8,
                    delay: 0.2,
                    ease: 'power3.out'
                });

                gsap.from(visual, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    },
                    x: isReverse ? -30 : 30,
                    opacity: 0,
                    duration: 0.8,
                    delay: 0.3,
                    ease: 'power3.out'
                });
            }
        });

        // Before/After 비교 등장
        if (comparison) {
            gsap.from(comparison, {
                scrollTrigger: {
                    trigger: comparison,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power3.out'
            });
        }
    }

    /**
     * 6. Result & Impact 애니메이션
     * - 숫자 카운트업 애니메이션
     * - 진행률 바 애니메이션
     */
    animateResult() {
        const section = this.sections.result;
        if (!section) return;

        const metrics = section.querySelectorAll('.case-result__metric');
        const feedback = section.querySelector('.case-result__feedback');

        // 메트릭 카드 등장 + 숫자 카운트업
        metrics.forEach((metric, index) => {
            const numberEl = metric.querySelector('.case-result__number');
            const progressBar = metric.querySelector('.case-result__metric-progress');
            const targetValue = parseFloat(numberEl?.dataset.target || 0);
            const progressValue = parseFloat(progressBar?.dataset.progress || 0);

            gsap.from(metric, {
                scrollTrigger: {
                    trigger: metric,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                    onEnter: () => {
                        // 숫자 카운트업
                        if (numberEl) {
                            this.animateCounter(numberEl, targetValue);
                        }
                        // 진행률 바
                        if (progressBar) {
                            gsap.to(progressBar, {
                                width: `${progressValue}%`,
                                duration: 1.5,
                                delay: 0.3,
                                ease: 'power2.out'
                            });
                        }
                    }
                },
                opacity: 0,
                y: 30,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power3.out'
            });
        });

        // 피드백 섹션 등장
        if (feedback) {
            gsap.from(feedback, {
                scrollTrigger: {
                    trigger: feedback,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 20,
                duration: 0.8,
                ease: 'power3.out'
            });
        }
    }

    /**
     * 숫자 카운트업 애니메이션
     * @param {HTMLElement} element - 숫자 요소
     * @param {number} target - 목표 값
     */
    animateCounter(element, target) {
        const isFloat = target % 1 !== 0;
        const duration = 1.5;

        gsap.to({ value: 0 }, {
            value: target,
            duration: duration,
            ease: 'power2.out',
            onUpdate: function() {
                const current = this.targets()[0].value;
                element.textContent = isFloat ? current.toFixed(1) : Math.round(current);
            }
        });
    }

    /**
     * 7. Reflection 애니메이션
     * - 텍스트 천천히 등장
     */
    animateReflection() {
        const section = this.sections.reflection;
        if (!section) return;

        const items = section.querySelectorAll('.case-reflection__item');

        gsap.from(items, {
            scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
        });
    }

    /**
     * 8. Next Project CTA 애니메이션
     * - CTA 등장 강조 애니메이션
     */
    animateCTA() {
        const section = this.sections.cta;
        if (!section) return;

        const content = section.querySelector('.case-cta__content');
        const visual = section.querySelector('.case-cta__visual');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        });

        // 콘텐츠 등장
        if (content) {
            tl.from(content, {
                opacity: 0,
                x: -30,
                duration: 0.8,
                ease: 'power3.out'
            });
        }

        // 비주얼 등장
        if (visual) {
            tl.from(visual, {
                opacity: 0,
                x: 30,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.5');
        }
    }

    /**
     * 리프레시 (리사이즈 등)
     */
    refresh() {
        ScrollTrigger.refresh();
    }

    /**
     * 파괴
     */
    destroy() {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        this.isInitialized = false;
    }
}

// 전역 접근
window.CaseStudyAnimation = CaseStudyAnimation;
