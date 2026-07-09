/**
 * caseStudy.js
 * Case Study 페이지 메인 초기화 스크립트
 * 
 * 기능:
 * - GSAP 애니메이션 초기화
 * - 이미지 지연 로딩
 * - 스무스 스크롤
 * - 접근성 처리
 */

class CaseStudyApp {
    constructor() {
        this.animation = null;
        this.isInitialized = false;

        // 바인딩
        this.init = this.init.bind(this);
        this.onReady = this.onReady.bind(this);
        this.onResize = this.onResize.bind(this);
    }

    /**
     * 앱 초기화
     */
    init() {
        if (this.isInitialized) return;

        console.log('🚀 CaseStudyApp initializing...');

        // DOM 준비 확인
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.onReady);
        } else {
            this.onReady();
        }
    }

    /**
     * DOM 준비 완료
     */
    onReady() {
        // GSAP 애니메이션 초기화
        this.initAnimation();

        // 이벤트 리스너
        this.setupEventListeners();

        // 이미지 지연 로딩
        this.setupLazyLoading();

        // 스무스 스크롤 (앵커 링크)
        this.setupSmoothScroll();

        // 네비게이션 백 버튼 효과
        this.setupBackNavigation();

        this.isInitialized = true;
        console.log('✅ CaseStudyApp ready');
    }

    /**
     * GSAP 애니메이션 초기화
     */
    initAnimation() {
        if (typeof CaseStudyAnimation !== 'undefined') {
            this.animation = new CaseStudyAnimation();
            this.animation.init();
        } else {
            console.warn('⚠️ CaseStudyAnimation not found');
        }
    }

    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        // 리사이즈 시 ScrollTrigger 리프레시
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(this.onResize, 250);
        });

        // 키보드 접근성
        document.addEventListener('keydown', (e) => {
            // Escape 키로 뒤로가기
            if (e.key === 'Escape') {
                const backLink = document.querySelector('.case-nav__back');
                if (backLink) backLink.click();
            }
        });
    }

    /**
     * 리사이즈 핸들러
     */
    onResize() {
        if (this.animation) {
            this.animation.refresh();
        }
    }

    /**
     * 이미지 지연 로딩 설정
     */
    setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // 이미지 로드 완료 시 페이드인 효과
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.5s ease';
                        
                        img.onload = () => {
                            img.style.opacity = '1';
                        };
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    /**
     * 스무스 스크롤 설정 (앵커 링크)
     */
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    
                    // GSAP 스무스 스크롤
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: {
                            y: targetElement,
                            offsetY: 80 // 네비게이션 높이 고려
                        },
                        ease: 'power3.inOut'
                    });
                }
            });
        });
    }

    /**
     * 백 네비게이션 효과
     */
    setupBackNavigation() {
        const backLink = document.querySelector('.case-nav__back');
        if (!backLink) return;

        // 마우스 호버 시 효과
        backLink.addEventListener('mouseenter', () => {
            gsap.to(backLink.querySelector('svg'), {
                x: -4,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        backLink.addEventListener('mouseleave', () => {
            gsap.to(backLink.querySelector('svg'), {
                x: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    }

    /**
     * 파괴
     */
    destroy() {
        if (this.animation) {
            this.animation.destroy();
        }
        this.isInitialized = false;
    }
}

// 앱 인스턴스 생성 및 초기화
const caseStudyApp = new CaseStudyApp();

// DOM 로드 대기 후 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // 약간의 딜레이 후 초기화 (폰트 등 리소스 로딩 대기)
        setTimeout(() => {
            caseStudyApp.init();
        }, 100);
    });
} else {
    setTimeout(() => {
        caseStudyApp.init();
    }, 100);
}

// 전역 접근
window.caseStudyApp = caseStudyApp;
