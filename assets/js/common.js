/**
 * common.js
 * 공통 유틸리티 함수 및 헬퍼
 * 커스텀 커서, 로딩 스크린, 유틸리티 등
 */

/**
 * Custom Cursor Class
 * Desktop only - creates a custom cursor that follows mouse
 */
class CustomCursor {
    constructor() {
        this.cursor = document.getElementById('cursor');
        this.isEnabled = false;
        
        // Check if device supports hover (desktop)
        this.supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        
        // Bind methods
        this.init = this.init.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    init() {
        if (!this.cursor || !this.supportsHover) {
            if (this.cursor) {
                this.cursor.style.display = 'none';
            }
            return;
        }

        this.isEnabled = true;
        
        // Mouse move listener
        document.addEventListener('mousemove', this.onMouseMove);
        
        // Interactive elements hover
        const interactiveElements = document.querySelectorAll('a, button, [data-cursor="hover"]');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', this.onMouseEnter);
            el.addEventListener('mouseleave', this.onMouseLeave);
        });

        console.log('🖱️ Custom cursor initialized');
    }

    onMouseMove(e) {
        if (!this.isEnabled) return;
        
        gsap.to(this.cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.15,
            ease: 'power2.out'
        });
    }

    onMouseEnter() {
        if (!this.isEnabled) return;
        this.cursor.classList.add('cursor--hover');
    }

    onMouseLeave() {
        if (!this.isEnabled) return;
        this.cursor.classList.remove('cursor--hover');
    }

    destroy() {
        document.removeEventListener('mousemove', this.onMouseMove);
        this.isEnabled = false;
    }
}

/**
 * Loading Screen Class
 * Handles page load animation
 */
class LoadingScreen {
    constructor() {
        this.screen = document.getElementById('loading-screen');
        this.bar = document.getElementById('loading-bar');
        this.progress = 0;
        this.isComplete = false;
        
        // Callbacks
        this.onComplete = null;
    }

    /**
     * Start loading animation
     * @param {Function} callback - Called when loading completes
     */
    start(callback) {
        this.onComplete = callback;
        
        // If no loading screen elements, call callback immediately
        if (!this.screen || !this.bar) {
            console.log('⚡ No loading screen elements found, skipping...');
            if (callback) {
                setTimeout(callback, 100);
            }
            return;
        }

        // Simulate loading progress
        this.simulateProgress();
    }

    /**
     * Simulate loading progress
     */
    simulateProgress() {
        const interval = setInterval(() => {
            this.progress += Math.random() * 15;
            
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(interval);
                this.complete();
            }
            
            this.updateBar();
        }, 100);
    }

    /**
     * Update progress bar
     */
    updateBar() {
        if (this.bar) {
            this.bar.style.width = `${this.progress}%`;
        }
    }

    /**
     * Complete loading and hide screen
     */
    complete() {
        if (this.isComplete) return;
        this.isComplete = true;

        gsap.to(this.screen, {
            opacity: 0,
            duration: 0.5,
            delay: 0.3,
            ease: 'power2.inOut',
            onComplete: () => {
                this.screen.style.display = 'none';
                if (this.onComplete) {
                    this.onComplete();
                }
            }
        });
    }

    /**
     * Force complete immediately
     */
    forceComplete() {
        this.progress = 100;
        this.updateBar();
        this.complete();
    }
}

/**
 * Smooth scroll to element
 * @param {string} selector - Target element selector
 * @param {number} offset - Offset from top (default: 0)
 */
function smoothScrollTo(selector, offset = 0) {
    const element = document.querySelector(selector);
    if (!element) return;

    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    
    gsap.to(window, {
        scrollTo: { y: top, autoKill: false },
        duration: 1,
        ease: 'power3.inOut'
    });
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 */
function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit time in ms
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 * @param {Element} element - DOM element
 * @param {number} threshold - Visibility threshold (0-1)
 */
function isInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    return (
        rect.top <= windowHeight * (1 - threshold) &&
        rect.bottom >= windowHeight * threshold
    );
}

/**
 * Get viewport dimensions
 */
function getViewport() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight
    };
}

/**
 * Check if device is mobile
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if device is touch device
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Preload images
 * @param {string[]} urls - Array of image URLs
 * @returns {Promise} - Resolves when all images are loaded
 */
function preloadImages(urls) {
    return Promise.all(
        urls.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = url;
            });
        })
    );
}

/**
 * title-highlight 한 글자씩 타이핑 효과를 위해 텍스트를 span으로 분리
 * DOM 로드 후 한 번만 실행
 */
function initTitleHighlightTypewriter() {
    const selectors = [
        '.hero__title-highlight',
        '.works__title-highlight',
        '.selected-works__title-highlight',
        '.contact__title-highlight'
    ];

    selectors.forEach(sel => {
        const el = document.querySelector(sel);
        if (!el || el.dataset.typewriterDone) return;

        const text = el.textContent.trim();
        if (!text) return;

        el.textContent = '';
        el.setAttribute('aria-label', text);
        el.dataset.typewriterDone = 'true';

        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.className = 'title-highlight__char';
            span.setAttribute('aria-hidden', 'true');
            span.textContent = text[i];
            el.appendChild(span);
        }

        // GSAP 초기 상태 (한 글자씩 등장 애니메이션용)
        const chars = el.querySelectorAll('.title-highlight__char');
        if (typeof gsap !== 'undefined' && chars.length) {
            gsap.set(chars, { opacity: 0, y: '0.35em' });
        }
    });
}

// Export utilities
window.CustomCursor = CustomCursor;
window.LoadingScreen = LoadingScreen;
window.initTitleHighlightTypewriter = initTitleHighlightTypewriter;
window.utils = {
    smoothScrollTo,
    debounce,
    throttle,
    isInViewport,
    getViewport,
    isMobile,
    isTouchDevice,
    preloadImages
};
