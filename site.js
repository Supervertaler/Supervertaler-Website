/* supervertaler.com – the two bits of behaviour the site has.
   Replaces top.js, which only did the first. */

/* ---- 1. the mobile menu -------------------------------------------------
   Only ever open on a narrow viewport: the CSS shows the toggle and hides the
   nav below 760px, and above it the nav is visible whatever this class says,
   so a menu left open on a phone cannot leak into the desktop layout when the
   window is widened. */
(function () {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('nav');
    if (!toggle || !nav) return;

    function setOpen(open) {
        nav.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    toggle.addEventListener('click', function () {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Tapping a link should close the menu, or the destination is hidden
    // behind it on an in-page anchor.
    nav.addEventListener('click', function (e) {
        if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            setOpen(false);
            toggle.focus();
        }
    });
})();

/* ---- 2. back to top ----------------------------------------------------- */
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
