/* Back to top. Appears once the reader is far enough down that returning by
   scrolling would be tedious, and honours a reduced-motion preference rather
   than smooth-scrolling everyone regardless. */
(function () {
    var btn = document.querySelector('.to-top');
    if (!btn) return;

    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ticking = false;

    function update() {
        btn.classList.toggle('show', window.scrollY > 600);
        ticking = false;
    }

    // rAF-throttled: a scroll handler that runs on every pixel is the classic
    // way to make a page feel heavy on a phone.
    window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();

    btn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
        var h = document.querySelector('header a.brand');
        if (h) h.focus({ preventScroll: true });   // keyboard focus follows the jump
    });
})();
