/* supervertaler.com – the three bits of behaviour the site has.
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

/* ---- 3. light or dark --------------------------------------------------
   With no choice made, the CSS follows the system setting and this stores
   nothing. A click on the sun/moon button picks the other theme. If that is
   what the system would show anyway, the stored choice is dropped rather than
   kept, so two clicks always lead back to "follow the system" - no third
   button state needed. The <head> of each page applies a stored choice
   before the first frame; this only keeps the button and the browser's own
   colour (theme-color: the tab bar in Safari, the address bar on a phone) in
   step with what is on screen. */
(function () {
    var root = document.documentElement;
    var btn = document.querySelector('.theme-toggle');
    var system = window.matchMedia('(prefers-color-scheme: dark)');

    function isDark() {
        var t = root.getAttribute('data-theme');
        return t ? t === 'dark' : system.matches;
    }

    function sync() {
        var dark = isDark();
        if (btn) {
            btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
            btn.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
        }
        var ground = getComputedStyle(document.body).backgroundColor;
        document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
            m.setAttribute('content', ground);
        });
    }

    function apply(theme) {          // 'light', 'dark' or null (= the system's)
        if (theme) root.setAttribute('data-theme', theme);
        else root.removeAttribute('data-theme');
        sync();
    }

    if (btn) btn.addEventListener('click', function () {
        var want = isDark() ? 'light' : 'dark';
        var keep = (want === 'dark') !== system.matches;
        apply(keep ? want : null);
        // Private browsing in old Safari throws here; the switch then still
        // works, it just isn't remembered.
        try {
            if (keep) localStorage.setItem('theme', want);
            else localStorage.removeItem('theme');
        } catch (e) {}
    });

    // The system flipping (a Mac set to "Auto" at dusk) and a choice made in
    // another tab of the site.
    if (system.addEventListener) system.addEventListener('change', sync);
    else if (system.addListener) system.addListener(sync);
    window.addEventListener('storage', function (e) {
        if (e.key === 'theme' || e.key === null) {
            apply(e.newValue === 'light' || e.newValue === 'dark' ? e.newValue : null);
        }
    });

    sync();
})();
