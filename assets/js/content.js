/* =========================================================================
   DG LABS — content renderer
   Projects and journal entries live in assets/data/*.json (editable from
   admin.html). This script renders them into whatever containers exist on
   the current page. Vanilla JS, no dependencies.
   ========================================================================= */
(function () {
  'use strict';

  var CAT_LABELS = {
    code: 'Code', robotics: 'Robotics', games: 'Games', maker: 'Physical / Maker',
    art: 'Art', yoga: 'Yoga', research: 'Research'
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function fmtDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return esc(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  function icon(id, cls) {
    return '<svg class="' + (cls || '') + '" aria-hidden="true"><use href="assets/icons.svg#' + esc(id) + '"/></svg>';
  }
  function getJSON(path) {
    return fetch(path, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(path + ' → ' + r.status);
      return r.json();
    });
  }

  /* ---------------------------- Projects -------------------------------- */
  function renderProjects(projects) {
    // Home: cards grid
    var grid = document.getElementById('home-projects-grid');
    if (grid) {
      grid.innerHTML = projects.map(function (p, i) {
        return '<a class="proj-card' + (i % 2 ? ' dark' : '') + '" href="projects.html#' + esc(p.id) + '">' +
          icon(p.icon, 'proj-icon') +
          '<div class="proj-cat">' + esc(p.category) + '</div>' +
          '<h3>' + esc(p.name) + '</h3>' +
          '<p>' + esc(p.description) + '</p>' +
          '<span class="proj-more">Learn more ' + icon('i-arrow') + '</span>' +
        '</a>';
      }).join('');
    }
    // Home: hero ticker
    var ticker = document.getElementById('hero-ticker');
    if (ticker) {
      ticker.innerHTML = projects.map(function (p) {
        return '<li><a href="projects.html#' + esc(p.id) + '">' + icon(p.icon) + esc(p.name) + '</a></li>';
      }).join('');
    }
    // Projects page: detail rows
    var rows = document.getElementById('projects-rows');
    if (rows) {
      rows.innerHTML = projects.map(function (p, i) {
        return '<article class="proj-row reveal in" id="' + esc(p.id) + '">' +
          icon(p.icon, 'rIcon') +
          '<div>' +
            '<div class="rcat">' + esc(p.category) +
              (p.status ? ' <span class="rstatus">' + esc(p.status) + '</span>' : '') + '</div>' +
            '<h3>' + esc(p.name) + '</h3>' +
            '<p>' + esc(p.description) + '</p>' +
          '</div>' +
          '<div class="rNo">' + String(i + 1).padStart(2, '0') + '</div>' +
        '</article>';
      }).join('');
      // honor a #hash arriving before render
      if (location.hash) {
        var t = document.getElementById(location.hash.slice(1));
        if (t) t.scrollIntoView();
      }
    }
  }

  /* ---------------------------- Journal --------------------------------- */
  function journalCard(e, i) {
    var bg = i % 2 ? '#1B1E22' : '#24272C';
    return '<a class="article in" data-category="' + esc(e.category) + '" href="journal.html">' +
      '<div class="article-thumb"><svg viewBox="0 0 200 125" preserveAspectRatio="xMidYMid slice" style="color:var(--gold)">' +
        '<rect width="200" height="125" fill="' + bg + '"/>' +
        '<use href="assets/icons.svg#' + esc(e.icon || 'i-book') + '" x="76" y="38" width="48" height="48"/></svg></div>' +
      '<div class="article-body">' +
        '<div class="article-meta">' + fmtDate(e.date) + ' · ' + esc(CAT_LABELS[e.category] || e.category) + '</div>' +
        '<h3>' + esc(e.title) + '</h3>' +
        '<p>' + esc(e.text) + '</p>' +
      '</div></a>';
  }

  function renderJournal(entries) {
    entries = entries.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var grid = document.getElementById('journal-grid');
    if (grid) grid.innerHTML = entries.map(journalCard).join('');
    var home = document.getElementById('home-journal');
    if (home) home.innerHTML = entries.slice(0, 3).map(journalCard).join('');
  }

  /* ------------------------------ Boot ---------------------------------- */
  function boot() {
    if (document.getElementById('home-projects-grid') || document.getElementById('hero-ticker') ||
        document.getElementById('projects-rows')) {
      getJSON('assets/data/projects.json').then(renderProjects).catch(function (e) { console.error(e); });
    }
    if (document.getElementById('journal-grid') || document.getElementById('home-journal')) {
      getJSON('assets/data/journal.json').then(renderJournal).catch(function (e) { console.error(e); });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
