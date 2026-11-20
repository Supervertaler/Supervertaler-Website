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
        .catch(function (e) {
            // Also catches a fault in drawing the page; say which in the console.
            if (window.console) console.error('changelog:', e);
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

    // Sidekick and Workbench write their headings differently, and are read
    // as written rather than rewritten:
    //   "## 2026-11-19" - Sidekick, which has no version numbers: the date is the release.
    //   "## v1.10.381 - November 19, 2026", "## [1.9.41] - December 16, 2025",
    //   "## 🎯 Match Panel Consolidation (v1.9.154) - January 25, 2026" - Workbench.
    // A heading with no date in it ("Unreleased", "Versioning Strategy") is
    // not a release, and is left out with what is under it.
    var ISO_DATE = /\b\d{4}-\d{2}-\d{2}\b/;
    var MONTH_DATE = /\b(January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2}), (\d{4})\b/;
    var VERSION = /\bv?(\d+\.\d+\.\d+(?:-[0-9A-Za-z]+)?)/;
    var VERSION_GROUP = /[\[(][^\])]*\d+\.\d+\.\d+[^\])]*[\])]/;

    function heading(line) {
        var m = HEADING.exec(line);
        if (m) return { versions: m[1].split('/').map(function (v) { return v.trim(); }),
                        date: m[2], title: '' };
        var text = line.slice(3).trim();
        var date = ISO_DATE.exec(text), found = date;
        if (date) date = date[0];
        else if ((found = MONTH_DATE.exec(text))) {
            date = found[3] + '-' + pad(MONTHS.indexOf(found[1]) + 1) + '-' + pad(found[2]);
        }
        if (!date) return null;
        var rest = text.replace(found[0], '');
        var v = VERSION.exec(rest);
        // What is left once the version and date are taken out is the
        // release's own name, if it has one ("Match Panel Consolidation").
        var title = VERSION_GROUP.test(rest) ? rest.replace(VERSION_GROUP, '') : v ? rest.replace(v[0], '') : rest;
        title = title.replace(/^[\s–\-:]+|[\s–\-:]+$/g, '');
        if (!/[A-Za-z]/.test(title)) title = '';
        return { versions: v ? [v[1]] : [], date: date, title: title };
    }

    function pad(n) { n = String(n); return n.length < 2 ? '0' + n : n; }

    function releases(text) {
        var list = [];
        var current = null;
        text.replace(/\r\n/g, '\n').split('\n').forEach(function (line) {
            if (line.indexOf('## ') === 0) {
                current = heading(line);
                if (current) { current.body = []; list.push(current); }
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

    // A Trados release has one build per Studio version, all ending in the
    // same release number: 18.20.205 / 19.20.205. The page shows that number,
    // and the builds once, in a line under the heading. The file names only
    // the 2024 and 2026 builds; the Studio 2022 build (17.x) has shipped with
    // every release since 199, so it is added here. Anything else (memoQ's
    // 0.1.x, Trados's old single 4.20.x) is shown as written: returns null.
    var STUDIOS = { 17: '2022', 18: '2024', 19: '2026' };
    var FIRST_2022 = 199;

    function studioBuilds(versions) {
        if (!versions.length) return null;   // Sidekick: a date, no builds
        var ps = versions.map(parts);
        var ok = ps.every(function (p) {
            return p.length === 3 && STUDIOS[p[0]] && p[1] === ps[0][1] && p[2] === ps[0][2];
        });
        if (!ok) return null;
        var middle = ps[0][1], release = ps[0][2];
        var majors = ps.map(function (p) { return p[0]; });
        if (release >= FIRST_2022 && majors.indexOf(17) < 0) majors.push(17);
        majors.sort();
        return {
            release: String(release),
            each: majors.map(function (m) { return 'Studio ' + STUDIOS[m] + ': ' + m + '.' + middle + '.' + release; })
        };
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
        entries.append(foldSwitch());
        var ids = {};
        shown.forEach(function (r) {
            // Sidekick has no version numbers: a release is its date.
            var dated = !r.versions.length;
            var id = dated ? 'd' + r.date : 'v' + r.versions[0];
            // Workbench's file has the odd version twice; each needs its own anchor.
            if (ids[id]) id += '-' + (++ids[id]); else ids[id] = 1;
            var label = r.versions.join(' / ');
            var builds = studioBuilds(r.versions);
            if (builds) label = builds.release;

            var article = document.createElement('article');
            article.className = 'cl-release';
            article.id = id;

            var h2 = document.createElement('h2');
            var time = document.createElement('time');
            time.dateTime = r.date;
            time.textContent = longDate(r.date);
            if (dated) {
                h2.append(time);
            } else {
                var ver = document.createElement('span');
                ver.className = 'cl-ver';
                ver.textContent = builds ? 'Release ' + label : label;
                h2.append(ver, ' ', time);
            }
            article.append(h2);
            if (builds || r.title) {
                var line = document.createElement('p');
                line.className = 'cl-builds';
                if (builds) line.textContent = builds.each.join(' · ');
                else line.innerHTML = DOMPurify.sanitize(marked.parseInline(r.title));
                article.append(line);
            }

            var body = document.createElement('div');
            body.className = 'cl-body';
            body.innerHTML = DOMPurify.sanitize(marked.parse(r.body.join('\n')));
            tidy(body);
            article.append(body);
            entries.append(article);

            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#' + id;
            if (dated) {
                a.textContent = shortDate(r.date);
            } else {
                a.innerHTML = '<span class="cl-ver"></span> <span class="cl-date"></span>';
                a.firstChild.textContent = label;
                a.lastChild.textContent = shortDate(r.date);
            }
            if (builds) a.className = 'cl-short';
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
        body.querySelectorAll(':scope > ul > li').forEach(foldEntry);
    }

    /* ---- headlines first ---------------------------------------------------- */

    // An entry is written as a bold sentence that says what changed, then the
    // detail. The page shows the bold sentence and folds the rest under it, so
    // a release reads as a list of lines; a click (or the switch above the
    // first release) opens the detail. An entry with no bold opening, or with
    // nothing after it, is shown as written.
    function foldEntry(li) {
        var holder = li.firstElementChild && li.firstElementChild.tagName === 'P' ? li.firstElementChild : li;
        var head = [];
        var node = holder.firstChild;
        while (node && node.nodeType === 3 && /^[\s★]*$/.test(node.textContent)) {
            head.push(node);
            node = node.nextSibling;
        }
        if (!node || node.nodeName !== 'STRONG') return;
        head.push(node);

        var rest = [];
        for (var n = node.nextSibling; n; n = n.nextSibling) rest.push(n);
        var after = [];
        if (holder !== li) for (var m = holder.nextSibling; m; m = m.nextSibling) after.push(m);
        var hasMore = after.length || rest.some(function (x) { return x.textContent.trim() !== ''; });
        if (!hasMore) return;

        var details = document.createElement('details');
        var summary = document.createElement('summary');
        head.forEach(function (x) { summary.append(x); });
        var more = document.createElement('div');
        more.className = 'cl-more';
        var p = document.createElement('p');
        rest.forEach(function (x) { p.append(x); });
        if (p.textContent.trim() !== '') more.append(p);
        after.forEach(function (x) { more.append(x); });
        details.append(summary, more);
        li.textContent = '';
        li.append(details);
        li.classList.add('cl-fold');
    }

    // One switch for the whole page: every detail open, or every detail folded.
    function foldSwitch() {
        var p = document.createElement('p');
        p.className = 'cl-foldall';
        var button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Show all details';
        button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', function () {
            var open = button.getAttribute('aria-pressed') !== 'true';
            entries.querySelectorAll('li.cl-fold > details').forEach(function (d) { d.open = open; });
            button.setAttribute('aria-pressed', open ? 'true' : 'false');
            button.textContent = open ? 'Hide all details' : 'Show all details';
        });
        p.append(button, ' Each line opens when you click it.');
        return p;
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
