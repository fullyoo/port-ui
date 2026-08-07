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
        this.scrollSpyItems = [];

        // 바인딩
        this.init = this.init.bind(this);
        this.onReady = this.onReady.bind(this);
        this.onResize = this.onResize.bind(this);
        this.updateScrollSpy = this.updateScrollSpy.bind(this);
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

        // 스크롤 스파이
        this.setupScrollSpy();

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
            try {
                this.animation = new CaseStudyAnimation();
                this.animation.init();
            } catch (error) {
                console.warn('⚠️ CaseStudyAnimation failed to initialize', error);
            }
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
                    this.scrollToSection(targetElement, 80);
                }
            });
        });
    }

    /**
     * 스크롤 스파이 설정
     */
    setupScrollSpy() {
        const scrollSpy = document.querySelector('.case-scrollspy');
        const list = document.querySelector('.case-scrollspy__list');

        if (!scrollSpy || !list) return;

        const sections = Array.from(document.querySelectorAll('#case-study > section[id]'));
        if (!sections.length) return;

        list.innerHTML = '';

        this.scrollSpyItems = sections.map(section => {
            const title = section.dataset.scrollspyTitle
                || section.getAttribute('data-scrollspy-label')
                || section.querySelector('h2, h3')?.textContent?.trim()
                || section.id;
            const item = document.createElement('li');
            item.className = 'case-scrollspy__item';

            const link = document.createElement('a');
            link.className = 'case-scrollspy__link';
            link.href = `#${section.id}`;
            link.setAttribute('data-label', title);
            link.setAttribute('aria-label', title);
            link.dataset.target = section.id;

            link.addEventListener('click', (e) => {
                e.preventDefault();
                // 클릭한 점을 누르면 해당 섹션으로 부드럽게 이동합니다.
                // 이동 위치는 아래 scrollToSection()의 offset 값으로 조절할 수 있습니다.
                this.scrollToSection(section);
            });

            item.appendChild(link);
            list.appendChild(item);

            return { section, link };
        });

        this.updateScrollSpy();
        scrollSpy.classList.add('is-visible');

        window.addEventListener('scroll', this.updateScrollSpy, { passive: true });
        window.addEventListener('resize', this.updateScrollSpy);
    }

    /**
     * 현재 섹션 활성화
     */
    updateScrollSpy() {
        if (!this.scrollSpyItems.length) return;

        // 스크롤시 변하는 위치 값(현재 섹션 값)

        const scrollTop = window.scrollY;
        const viewportMiddle = scrollTop + window.innerHeight * 0.5;
        const offset = 150;

        // 이동 위치는 window.innerHeight * 0.5 값으로 조절할 수 있습니다.
        // offset 값을 바꾸면 됩니다.
        // 값이 작을수록 더 위로 올라감
        // 값이 클수록 더 아래로 내려감

        let currentItem = null;
        let activeIndex = -1;

        this.scrollSpyItems.forEach(({ section, link }, index) => {
            link.classList.remove('is-active');
            link.removeAttribute('aria-current');

            const sectionTop = section.offsetTop - offset;
            const sectionBottom = sectionTop + section.offsetHeight;
            const isInView = viewportMiddle >= sectionTop && viewportMiddle < sectionBottom;

            if (isInView) {
                currentItem = { section, link };
                activeIndex = index;
            }
        });

        if (!currentItem) {
            const lastSection = this.scrollSpyItems[this.scrollSpyItems.length - 1];
            const lastSectionTop = lastSection.section.offsetTop - offset;
            currentItem = scrollTop + window.innerHeight >= lastSectionTop ? lastSection : this.scrollSpyItems[0];
        }

        currentItem.link.classList.add('is-active');
        currentItem.link.setAttribute('aria-current', 'true');
    }

    /**
     * 섹션으로 스크롤 (클릭 시 이동 위치)
     */
    scrollToSection(section, offset = 50) {
        const targetY = Math.max(0, section.getBoundingClientRect().top + window.scrollY - offset);
        // (클릭 시 이동 위치)
        // offset 값을 바꾸면 됩니다.
        // 값이 작을수록 더 위로 올라감
        // 값이 클수록 더 아래로 내려감

        if (typeof window.scrollTo === 'function') {
            window.scrollTo({
                top: targetY,
                behavior: 'smooth'
            });
            return;
        }

        if (typeof gsap !== 'undefined' && gsap.to) {
            gsap.to(window, {
                duration: 0.8,
                scrollTo: {
                    y: targetY
                },
                ease: 'power3.inOut'
            });
        } else {
            window.scrollTo(0, targetY);
        }
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
