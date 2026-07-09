/**
 * floatingMenu.js
 * 플로팅 메뉴: 탑 버튼 클릭 시 맨 위로, 노션 링크는 a 태그로 처리
 */

(function () {
    const TOP_THRESHOLD = 300; // 이 높이 이상 스크롤 시 탑 버튼 표시

    function init() {
        const topBtn = document.getElementById('floating-menu-top');
        if (!topBtn) return;

        // 스크롤 시 탑 버튼 표시/숨김
        function updateTopButtonVisibility() {
            if (window.scrollY >= TOP_THRESHOLD) {
                topBtn.classList.add('is-visible');
            } else {
                topBtn.classList.remove('is-visible');
            }
        }

        // 탑 버튼 클릭 시 맨 위로 스크롤
        topBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', updateTopButtonVisibility, { passive: true });
        updateTopButtonVisibility();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
