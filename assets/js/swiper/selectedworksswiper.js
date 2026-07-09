/**
 * selectedWorksSwiper.js
 * Selected Works Section - 마우스 휠 가로 스크롤 인터랙션
 * 
 * [인터랙션 컨셉]
 * - 마우스 휠 스크롤 시 Swiper 슬라이드가 좌우로 이동
 * - 섹션 진입 시 세로 스크롤을 가로 이동으로 전환
 * - 마지막 슬라이드 도달 시 다시 세로 스크롤로 복귀
 */

class SelectedWorksSwiper {
    constructor() {
        this.swiperContainer = document.querySelector('.selected-works__swiper');
        this.section = document.querySelector('.selected-works');
        this.swiper = null;
        this.isInitialized = false;

        // Animation reference
        this.selectedWorksAnimation = null;

        // State
        this.isInSection = false;
        this.isAnimating = false;
        this.wheelLocked = false; // 휠로 슬라이드 전환 중이면 true (한 번에 한 장만 이동)

        // Bind methods
        this.init = this.init.bind(this);
        this.onSlideChange = this.onSlideChange.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.animateSlideTransition = this.animateSlideTransition.bind(this);
        this.handleProgressBarClick = this.handleProgressBarClick.bind(this);
    }

    /**
     * 모바일 뷰포트 여부 (768px 이하)
     */
    get isMobile() {
        return typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
    }

    /**
     * Initialize Swiper with custom configuration
     * @param {SelectedWorksAnimation} selectedWorksAnimation - Reference to animation instance
     */
    init(selectedWorksAnimation = null) {
        if (this.isInitialized || !this.swiperContainer) {
            console.warn('⚠️ SelectedWorksSwiper: Already initialized or container not found');
            return;
        }

        this.selectedWorksAnimation = selectedWorksAnimation;

        // 슬라이드 개수 확인
        const slides = this.swiperContainer.querySelectorAll('.swiper-slide');
        const slideCount = slides.length;
        const shouldLoop = false; // loop 비활성화 (마지막 슬라이드 감지를 위해)

        try {
            this.swiper = new Swiper('.selected-works__swiper', {
                // Core settings - 한 화면에 카드 2개
                slidesPerView: 2,
                centeredSlides: false,
                spaceBetween: 24,
                loop: shouldLoop,
                speed: 800,
                effect: 'slide',

                // Autoplay 비활성화 (휠 인터랙션 우선)
                autoplay: false,

                // Grab cursor
                grabCursor: true,

                // Navigation
                navigation: {
                    prevEl: '.selected-works__swiper-btn--prev',
                    nextEl: '.selected-works__swiper-btn--next'
                },

                // Keyboard control
                keyboard: {
                    enabled: true,
                    onlyInViewport: true
                },

                // Mouse wheel 비활성화 - 커스텀 핸들러 사용
                mousewheel: false,

                // Breakpoints - 데스크톱 2개, 태블릿/모바일 1개
                breakpoints: {
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 16
                    },
                    768: {
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    1024: {
                        slidesPerView: 2,
                        spaceBetween: 24
                    },
                    1440: {
                        slidesPerView: 2,
                        spaceBetween: 32
                    }
                },

                // Events
                on: {
                    init: () => {
                        console.log('✅ Selected Works Swiper initialized');
                        setTimeout(() => this.updateProgressBar(), 50);
                    },
                    slideChange: () => {
                        this.onSlideChange();
                    },
                    slideChangeTransitionStart: () => {
                        this.isAnimating = true;
                    },
                    slideChangeTransitionEnd: () => {
                        this.isAnimating = false;
                        // 슬라이드 전환 끝나면 휠 락 해제 (다음 휠에 한 장 더 이동 가능)
                        this.wheelLocked = false;
                    }
                }
            });

            this.isInitialized = true;

            // ScrollTrigger 설정
            this.setupScrollTrigger();

            // 마우스 휠 이벤트 설정
            this.setupWheelEvent();

            // 로딩바 클릭으로 해당 프로젝트 이동
            this.setupProgressBarClick();

            // 가이드 표시
            this.showGuide();

        } catch (error) {
            console.error('❌ SelectedWorksSwiper initialization error:', error);
        }
    }

    /**
     * ScrollTrigger로 섹션 진입/이탈 감지
     */
    setupScrollTrigger() {
        if (!this.section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            return;
        }

        // 섹션 진입 감지
        ScrollTrigger.create({
            trigger: this.section,
            start: 'top 80%',
            end: 'bottom 20%',
            onEnter: () => {
                this.isInSection = true;
                console.log('📍 Entered Selected Works section');
            },
            onLeave: () => {
                this.isInSection = false;
                console.log('📍 Left Selected Works section');
            },
            onEnterBack: () => {
                this.isInSection = true;
            },
            onLeaveBack: () => {
                this.isInSection = false;
            }
        });

        // 섹션 중앙에 위치했을 때 pin (선택적)
        // 더 자연스러운 UX를 위해 pin 대신 휠 이벤트만 가로채기
    }

    /**
     * 마우스 휠 이벤트 설정
     */
    setupWheelEvent() {
        if (this.isMobile) {
            console.log('📱 Mobile detected - wheel interaction disabled');
            return;
        }

        // 전역 휠 이벤트 리스너
        window.addEventListener('wheel', this.handleWheel, { passive: false });

        console.log('✅ Wheel event listener added');
    }

    /**
     * 뷰포트가 Selected Works 섹션 안에 있는지 확인 (연락처 등 다른 섹션 제외)
     */
    isViewportInSelectedWorksSection() {
        if (!this.section) return false;
        const rect = this.section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // 섹션이 화면에 얼마나 보이는지 계산
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        // 섹션이 뷰포트의 70% 이상을 차지할 때만 휠 제어 (연락처가 30% 이상 보이면 비활성화)
        const sectionVisibleRatio = visibleHeight / viewportHeight;
        
        return sectionVisibleRatio >= 0.7;
    }

    /**
     * 마우스 휠 이벤트 핸들러
     * @param {WheelEvent} e - Wheel event
     */
    handleWheel(e) {
        // 모바일이면 무시
        if (this.isMobile) return;

        // Selected Works 섹션만 해당: 뷰포트가 이 섹션 안에 있을 때만 휠로 슬라이드 (연락처 영역 제외)
        if (!this.isViewportInSelectedWorksSection()) return;

        // 애니메이션 중이면 무시
        if (this.isAnimating) {
            e.preventDefault();
            return;
        }

        // Swiper가 없으면 무시
        if (!this.swiper) return;

        // 현재 슬라이드 상태 (slidesPerView에 관계없이 정확한 판단)
        const isFirstSlide = this.swiper.isBeginning;
        const isLastSlide = this.swiper.isEnd;

        // 스크롤 방향
        const deltaY = e.deltaY;
        const isScrollingDown = deltaY > 0;
        const isScrollingUp = deltaY < 0;

        // 첫 슬라이드에서 위로 스크롤 -> 이전 섹션으로 이동 허용
        if (isFirstSlide && isScrollingUp) {
            return; // 기본 스크롤 허용
        }

        // 마지막 슬라이드에서 아래로 스크롤 -> 다음 섹션으로 이동 허용
        if (isLastSlide && isScrollingDown) {
            return; // 기본 스크롤 허용
        }

        // 이미 휠로 슬라이드 전환 중이면 무시 (한 번에 한 장만 이동)
        if (this.wheelLocked) {
            e.preventDefault();
            return;
        }

        // 기본 스크롤 방지
        e.preventDefault();

        // 한 장만 이동하도록 락
        this.wheelLocked = true;

        // 슬라이드 한 장 이동
        if (isScrollingDown) {
            this.swiper.slideNext();
        } else if (isScrollingUp) {
            this.swiper.slidePrev();
        }
    }

    /**
     * 가이드 텍스트 표시
     */
    showGuide() {
        // 이미 존재하면 무시
        if (document.querySelector('.selected-works__guide')) return;

        const guide = document.createElement('div');
        guide.className = 'selected-works__guide';
        guide.innerHTML = `
            <span class="selected-works__guide-text">Scroll to explore</span>
            <svg class="selected-works__guide-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        `;

        // 섹션 헤더 뒤에 추가
        const header = this.section.querySelector('.selected-works__header');
        if (header) {
            header.after(guide);
        } else {
            this.section.prepend(guide);
        }

        // 첫 인터랙션 후 가이드 숨기기
        const hideGuide = () => {
            gsap.to(guide, {
                opacity: 0,
                y: -10,
                duration: 0.5,
                onComplete: () => {
                    guide.style.display = 'none';
                }
            });
            // 이벤트 리스너 제거
            window.removeEventListener('wheel', hideGuide);
            this.section.removeEventListener('click', hideGuide);
        };

        // 3초 후 또는 첫 인터랙션 시 숨기기
        setTimeout(() => {
            if (guide.style.display !== 'none') {
                hideGuide();
            }
        }, 5000);

        window.addEventListener('wheel', hideGuide, { once: true });
        this.section.addEventListener('click', hideGuide, { once: true });
    }

    /**
     * Handle slide change event
     */
    onSlideChange() {
        if (!this.swiper) return;

        const activeIndex = this.swiper.activeIndex;

        // 진행 바 업데이트
        this.updateProgressBar();

        // GSAP 애니메이션 연동
        this.animateSlideTransition(activeIndex);

        // 콘솔 로그
        console.log(`📌 Slide changed to: ${activeIndex + 1}/${this.swiper.slides.length}`);
    }

    /**
     * 로딩바 클릭 시 해당 위치의 프로젝트(슬라이드)로 이동
     */
    setupProgressBarClick() {
        const progressTrack = document.querySelector('.selected-works__progress');
        if (!progressTrack || !this.swiper) return;

        progressTrack.addEventListener('click', this.handleProgressBarClick);
        this._progressTrack = progressTrack;
    }

    /**
     * 로딩바 클릭 핸들러: 클릭 위치에 해당하는 슬라이드 인덱스로 이동
     * @param {MouseEvent} e - Click event
     */
    handleProgressBarClick(e) {
        if (!this.swiper) return;

        const track = e.currentTarget;
        const rect = track.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));

        const total = this.swiper.slides.length;
        const index = total <= 1 ? 0 : Math.min(total - 1, Math.round((percent / 100) * (total - 1)));

        this.swiper.slideTo(index);
    }

    /**
     * 슬라이드 진행률에 맞춰 로딩바(진행 바) 업데이트
     */
    updateProgressBar() {
        const bar = document.querySelector('.selected-works__progress-bar');
        if (!bar || !this.swiper) return;

        const total = this.swiper.slides.length;
        const current = this.swiper.activeIndex;
        // 마지막 슬라이드(프로젝트 10)일 때 오른쪽 끝(100%)까지 채움 (slidesPerView에 관계없이 isEnd 사용)
        const progress = this.swiper.isEnd ? 100 : (total > 1 ? (current / (total - 1)) * 100 : 100);

        bar.style.width = `${progress}%`;
    }

    /**
     * Animate slide transition with GSAP
     * @param {number} index - Active slide index
     */
    animateSlideTransition(index) {
        if (!this.swiper) return;

        const slides = this.swiper.slides;
        const activeSlide = slides[index];

        if (!activeSlide) return;

        // 모든 슬라이드 기본 상태로
        slides.forEach((slide, i) => {
            const card = slide.querySelector('.selected-works__card');
            if (card) {
                gsap.to(card, {
                    opacity: i === index ? 1 : 0.7,
                    scale: i === index ? 1 : 0.98,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });

        // 카드 내부 콘텐츠 애니메이션
        if (this.selectedWorksAnimation) {
            this.selectedWorksAnimation.animateCardContent(index);
        }
    }

    /**
     * Go to specific slide
     * @param {number} index - Slide index
     */
    goTo(index) {
        if (!this.swiper) return;
        this.swiper.slideTo(index);
    }

    /**
     * Get current slide index
     * @returns {number} Current slide index
     */
    getCurrentIndex() {
        if (!this.swiper) return 0;
        return this.swiper.activeIndex;
    }

    /**
     * Next slide
     */
    next() {
        if (this.swiper) this.swiper.slideNext();
    }

    /**
     * Previous slide
     */
    prev() {
        if (this.swiper) this.swiper.slidePrev();
    }

    /**
     * Destroy Swiper instance
     */
    destroy() {
        const progressTrack = this._progressTrack || document.querySelector('.selected-works__progress');
        if (progressTrack) {
            progressTrack.removeEventListener('click', this.handleProgressBarClick);
        }
        if (this.swiper) {
            window.removeEventListener('wheel', this.handleWheel);
            this.swiper.destroy(true, true);
            this.swiper = null;
            this.isInitialized = false;
        }
    }
}
