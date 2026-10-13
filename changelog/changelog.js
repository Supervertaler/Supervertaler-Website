/* supervertaler.com/changelog/<product>/ – the product's CHANGELOG.md, read
   from GitHub as the page opens and laid out as a page of this site.

   One source: the changelog each plugin already keeps in its own repository,
   written in the same commit as the change. Nothing is copied here, so
   releasing a plugin never needs a website commit, and this page can never
   disagree with the file.

   ?since=0.1.12 shows only the releases after that version - the plugins'
   update offers link here with the version the translator has, so the page
   answers the one question they have: what changed since mine?

   Needs marked (Markdown) and DOMPurify (the file is ours, but what reaches
   innerHTML is sanitised anyway), both kept in ./vendor so the page asks no
   third party for anything but the changelog itself. */
(function () {
    var main = document.querySelector('[data-changelog]');
    if (!main) return;

    var repo = main.getAttribute('data-repo');
    var source = 'https://raw.githubusercontent.com/Supervertaler/' + repo + '/main/CHANGELOG.md';
    var onGitHub = 'https://github.com/Supervertaler/' + repo + '/blob/main/CHANGELOG.md';
    var entries = document.getElementById('cl-entries');
    var index = document.getElementById('cl-index');
    var banner = document.getElementById('cl-since');
    var since = cleanVersion(new URLSearchParams(location.search).get('since'));

    // On a phone the release list sits above the releases, folded, as a menu.
    var fold = document.querySelector('.cl-versions details');
    if (fold && window.matchMedia('(max-width: 860px)').matches) fold.open = false;

    fetch(source, { cache: 'no-cache' })
        .then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.text();
        })
        .then(render)
        .catch(function () {
            entries.innerHTML = '';
            var p = document.createElement('p');
            p.className = 'cl-problem';
            p.append('The changelog could not be loaded just now. ');
            var a = document.createElement('a');
            a.href = onGitHub;
            a.textContent = 'Read it on GitHub';
            p.append(a, '.');
            entries.append(p);
        });

    /* ---- reading the file ------------------------------------------------ */

    // "## [0.1.17] – 2026-10-13", or "## [17.20.199 / 18.20.199 / 19.20.199] – 2026-10-12".
    // A heading whose date is not a date ("Unreleased") is work not yet
    // released, and is left out: a translator cannot have it yet.
    var HEADING = /^## \[([^\]]+)\]\s*[–-]\s*(\d{4}-\d{2}-\d{2})\s*$/;

    function releases(text) {
        var list = [];
        var current = null;
        text.replace(/\r\n/g, '\n').split('\n').forEach(function (line) {
            if (line.indexOf('## ') === 0) {
                var m = HEADING.exec(line);
                current = m ? { versions: m[1].split('/').map(function (v) { return v.trim(); }),
                                date: m[2], body: [] } : null;
                if (current) list.push(current);
                return;
            }
            // Everything before the first release is the file's own preamble,
            // written for whoever maintains it.
            if (current) current.body.push(line);
        });
        return list;
    }

    /* ---- versions ---------------------------------------------------------- */

    function cleanVersion(v) {
        v = (v || '').trim().replace(/^v/i, '');
        return /^\d+(\.\d+)*$/.test(v) ? v : null;
    }

    function parts(v) { return v.split('.').map(function (n) { return parseInt(n, 10) || 0; }); }

    function compare(a, b) {
        for (var i = 0; i < Math.max(a.length, b.length); i++) {
            var d = (a[i] || 0) - (b[i] || 0);
            if (d) return d;
        }
        return 0;
    }

    // Trados releases carry one number per Studio version, with the Studio
    // version as the first part (17.20.199 / 18.20.199 / 19.20.199), and its
    // oldest ones a single 4.20.x. Compared on the number with the same first
    // part as the translator's own; failing that, on everything after it.
    function isNewer(release, mine) {
        var m = parts(mine);
        var same = release.versions.filter(function (v) { return parts(v)[0] === m[0]; });
        if (same.length) return same.some(function (v) { return compare(parts(v), m) > 0; });
        return release.versions.some(function (v) { return compare(parts(v).slice(1), m.slice(1)) > 0; });
    }

    /* ---- drawing it -------------------------------------------------------- */

    function render(text) {
        var all = releases(text);
        var shown = since ? all.filter(function (r) { return isNewer(r, since); }) : all;

        if (since) {
            banner.hidden = false;
            banner.textContent = '';
            if (shown.length) {
                banner.append('What changed since version ' + since + ': '
                    + shown.length + (shown.length === 1 ? ' release' : ' releases') + ', newest first. ');
            } else {
                banner.append('Version ' + since + ' is up to date: nothing newer has been released. ');
                shown = all;
            }
            var every = document.createElement('a');
            every.href = location.pathname;
            every.textContent = 'Show every version';
            banner.append(every);
        }

        entries.innerHTML = '';
        index.innerHTML = '';
        shown.forEach(function (r) {
            var id = 'v' + r.versions[0];
            var label = r.versions.join(' / ');

            var article = document.createElement('article');
            article.className = 'cl-release';
            article.id = id;

            var h2 = document.createElement('h2');
            var ver = document.createElement('span');
            ver.className = 'cl-ver';
            ver.textContent = label;
            var time = document.createElement('time');
            time.dateTime = r.date;
            time.textContent = longDate(r.date);
            h2.append(ver, ' ', time);
            article.append(h2);

            var body = document.createElement('div');
            body.className = 'cl-body';
            body.innerHTML = DOMPurify.sanitize(marked.parse(r.body.join('\n')));
            tidy(body);
            article.append(body);
            entries.append(article);

            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#' + id;
            a.innerHTML = '<span class="cl-ver"></span> <span class="cl-date"></span>';
            a.firstChild.textContent = label;
            a.lastChild.textContent = shortDate(r.date);
            li.append(a);
            index.append(li);
        });

        // The page arrived empty and the anchor had nothing to land on.
        if (location.hash) {
            var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
            if (target) target.scrollIntoView();
        }
    }

    function tidy(body) {
        body.querySelectorAll('a[href]').forEach(function (a) {
            var href = a.getAttribute('href');
            // Links into the repository - a source file, a doc - are relative
            // in the file and mean nothing on this site.
            if (!/^(https?:|mailto:|#)/i.test(href)) {
                a.href = 'https://github.com/Supervertaler/' + repo + '/blob/main/' + href.replace(/^\.?\//, '');
            }
        });
        // ★ marks what a release would be announced for.
        body.querySelectorAll('li').forEach(function (li) {
            if (li.textContent.trim().charAt(0) === '★') li.classList.add('cl-star');
        });
    }

    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                  'August', 'September', 'October', 'November', 'December'];

    function longDate(iso) {
        var p = iso.split('-');
        return parseInt(p[2], 10) + ' ' + MONTHS[parseInt(p[1], 10) - 1] + ' ' + p[0];
    }

    function shortDate(iso) {
        var p = iso.split('-');
        return parseInt(p[2], 10) + ' ' + MONTHS[parseInt(p[1], 10) - 1].slice(0, 3) + ' ' + p[0];
    }
})();
