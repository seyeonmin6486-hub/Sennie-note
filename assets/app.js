/* 센니 노트 — app */
(function () {
  'use strict';

  var CATS = window.SENNI_CATEGORIES || [];
  var BUILTIN = window.SENNI_NOTES || [];
  var STUDIO = window.SENNI_STUDIO || {};
  var STORE_NOTES = 'senni-note.notes.v1';
  var STORE_CHECKS = 'senni-note.checks.v1';
  var STORE_INSTA = 'senni-note.insta.v1';
  var STORE_STATUS = 'senni-note.status.v1';
  var STORE_AFF = 'senni-note.affiliate.v1';
  var STORE_REF = 'senni-note.ref.v1';

  var STATUS_META = {
    idea:     { label: '소재 찜',     icon: '💡' },
    scripted: { label: '대본 완료',   icon: '✍️' },
    posted:   { label: '업로드 완료', icon: '✅' }
  };
  var STATUS_ORDER = ['idea', 'scripted', 'posted'];

  var catMap = {};
  CATS.forEach(function (c) { catMap[c.id] = c; });

  var state = { cat: 'all', sub: 'all', q: '', insta: false, status: 'all' };

  /* ── 저장소 ── */
  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }

  var userNotes = load(STORE_NOTES, []);
  var checks = load(STORE_CHECKS, {});
  var instaPrefs = load(STORE_INSTA, {});
  var statusPrefs = load(STORE_STATUS, {});
  var affPrefs = load(STORE_AFF, {});
  var refPrefs = load(STORE_REF, {});

  function isInsta(n) {
    if (!n) return false;
    if (Object.prototype.hasOwnProperty.call(instaPrefs, n.id)) return !!instaPrefs[n.id];
    return !!(n.instaReady || n.instaHook);
  }

  function allNotes() {
    return BUILTIN.map(function (n) {
      return Object.assign({ builtin: true }, n, STUDIO[n.id] || {});
    }).concat(userNotes.map(function (n) { return Object.assign({ builtin: false }, n); }));
  }

  /* ── 진행 상태 · 제휴링크 · 레퍼런스 ── */
  function statusOf(n) {
    if (!n) return null;
    if (Object.prototype.hasOwnProperty.call(statusPrefs, n.id)) {
      return STATUS_META[statusPrefs[n.id]] ? statusPrefs[n.id] : null;
    }
    if (n.status && STATUS_META[n.status]) return n.status;
    return 'idea';
  }

  function setStatus(id, st) {
    if (!STATUS_META[st]) return;
    statusPrefs[id] = st;
    save(STORE_STATUS, statusPrefs);
  }

  function affOf(n) {
    if (!n) return '';
    return String(Object.prototype.hasOwnProperty.call(affPrefs, n.id) ? affPrefs[n.id] : (n.affiliateUrl || '')) || '';
  }
  function refOf(n) {
    if (!n) return '';
    return String(Object.prototype.hasOwnProperty.call(refPrefs, n.id) ? refPrefs[n.id] : (n.refUrl || '')) || '';
  }
  function hasScript(n) {
    var s = (n && n.script) || {};
    return !!(s.hook || s.core || s.cta);
  }
  function hasCaption(n) {
    return !!(n && (n.caption || (n.hashtags || []).length || n.pinnedComment));
  }

  /* ── 유틸 ── */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function rich(s) {
    return esc(s).replace(/&lt;(\/?)(strong|b|em|br|small)(\s*\/?)&gt;/g, function (m, slash, tag) {
      if (tag === 'br') return '<br>';
      if (tag === 'b') tag = 'strong';
      return '<' + slash + tag + '>';
    });
  }
  function strip(s) { return String(s == null ? '' : s).replace(/<[^>]*>/g, ' '); }
  function norm(s) {
    return String(s == null ? '' : s).toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }
  function catOf(n) { return catMap[n.cat] || CATS[0] || { name: '기타', color: '#C0714C', soft: '#F7E8DF', ink: '#A65C3C', subs: [] }; }
  function subName(n) {
    var c = catOf(n);
    var s = (c.subs || []).filter(function (x) { return x.id === n.sub; })[0];
    return s ? s.name : '';
  }
  function plainText(n) {
    var out = [n.title, '[' + catOf(n).name + (subName(n) ? ' · ' + subName(n) : '') + ']', ''];
    (n.blocks || []).forEach(function (b) {
      if (b.type === 'h') out.push('', '■ ' + strip(b.text));
      else if (b.type === 'p') out.push(strip(b.text));
      else if (b.type === 'ul') (b.items || []).forEach(function (t) { out.push('· ' + strip(t)); });
      else if (b.type === 'ol') (b.items || []).forEach(function (t, i) { out.push((i + 1) + '. ' + strip(t)); });
      else if (b.type === 'checklist') (b.items || []).forEach(function (t) { out.push('☐ ' + strip(t)); });
      else if (b.type === 'table') {
        if (b.head) out.push(b.head.map(strip).join(' | '));
        (b.rows || []).forEach(function (r) { out.push(r.map(function (c) { return strip(c).replace(/\s+/g, ' ').trim(); }).join(' | ')); });
      } else if (b.type === 'callout') out.push(strip(b.text));
    });
    var links = n.links || [];
    if (links.length) {
      out.push('');
      links.forEach(function (l) { out.push('▸ ' + l.label + ': ' + l.url); });
    }
    return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }
  function haystack(n) {
    var parts = [n.title, n.summary, (n.tags || []).join(' '), catOf(n).name, subName(n)];
    (n.blocks || []).forEach(function (b) {
      if (b.text) parts.push(strip(b.text));
      if (b.items) parts.push(b.items.map(strip).join(' '));
      if (b.head) parts.push(b.head.join(' '));
      if (b.rows) parts.push(b.rows.map(function (r) { return r.join(' '); }).join(' '));
    });
    (n.links || []).forEach(function (l) { parts.push(l.label + ' ' + l.url); });
    var s = n.script || {};
    parts.push(s.hook || '', s.core || '', s.cta || '');
    parts.push(n.caption || '', (n.hashtags || []).join(' '), n.pinnedComment || '', n.viralReason || '');
    return norm(parts.join(' '));
  }

  function countFor(catId, subId) {
    return allNotes().filter(function (n) {
      if (catId !== 'all' && n.cat !== catId) return false;
      if (subId && subId !== 'all' && n.sub !== subId) return false;
      return true;
    }).length;
  }

  function countInsta() {
    return allNotes().filter(function (n) {
      if (!isInsta(n)) return false;
      if (state.cat !== 'all' && n.cat !== state.cat) return false;
      return true;
    }).length;
  }

  function filtered() {
    var q = norm(state.q);
    var list = allNotes().filter(function (n) {
      if (state.cat !== 'all' && n.cat !== state.cat) return false;
      if (state.sub !== 'all' && n.sub !== state.sub) return false;
      if (state.insta && !isInsta(n)) return false;
      if (state.insta && state.status !== 'all' && statusOf(n) !== state.status) return false;
      if (q && haystack(n).indexOf(q) === -1) return false;
      return true;
    });
    // 사용자 메모(최근 것) 먼저, 이후 기본 노트는 원래 순서
    return list;
  }

  function highlight(text, q) {
    var safe = esc(text);
    if (!q) return safe;
    try {
      var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      return safe.replace(re, '<mark>$1</mark>');
    } catch (e) { return safe; }
  }

  /* ── DOM ── */
  var $ = function (id) { return document.getElementById(id); };
  var tabsEl = $('tabs');
  var subEl = $('subtabs');
  var cardsEl = $('cards');
  var emptyEl = $('empty');
  var searchEl = $('search');
  var clearEl = $('clearSearch');

  /* ── 탭 ── */
  function renderTabs() {
    var html = '<button class="tab" role="tab" data-cat="all" aria-selected="' + (state.cat === 'all') + '">' +
      '전체 <span class="n">' + countFor('all') + '</span></button>';
    CATS.forEach(function (c) {
      var n = countFor(c.id);
      if (!n) return;
      html += '<button class="tab" role="tab" data-cat="' + c.id + '" aria-selected="' + (state.cat === c.id) + '" ' +
        'style="--c:' + c.color + '">' +
        (c.emoji ? '<span class="tab-emoji" aria-hidden="true">' + c.emoji + '</span>' : '<span class="dot"></span>') +
        esc(c.name) +
        ' <span class="n">' + n + '</span></button>';
    });
    html += '<span class="tab-sep" aria-hidden="true"></span>' +
      '<button class="tab tab-insta" role="tab" data-insta="1" aria-selected="' + state.insta + '">' +
      '<span aria-hidden="true">📸</span> 인스타 소재 <span class="n">' + countInsta() + '</span></button>';
    tabsEl.innerHTML = html;

    var cat = catMap[state.cat];
    if (!cat || !cat.subs || !cat.subs.length) {
      subEl.hidden = true;
      subEl.innerHTML = '';
      return;
    }
    var h = '<button class="subtab" role="tab" data-sub="all" aria-selected="' + (state.sub === 'all') + '">' +
      '전체' + '</button>';
    cat.subs.forEach(function (s) {
      var n = countFor(cat.id, s.id);
      if (!n) return;
      h += '<button class="subtab" role="tab" data-sub="' + s.id + '" aria-selected="' + (state.sub === s.id) + '">' +
        esc(s.name) + ' <span class="n">' + n + '</span></button>';
    });
    subEl.innerHTML = h;
    subEl.hidden = false;
  }

  tabsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.tab');
    if (!b) return;
    if (b.dataset.insta) {
      state.insta = !state.insta;
      state.status = 'all';
      renderTabs();
      renderList();
      return;
    }
    state.cat = b.dataset.cat;
    state.sub = 'all';
    renderTabs();
    renderList();
  });
  subEl.addEventListener('click', function (e) {
    var b = e.target.closest('.subtab');
    if (!b) return;
    state.sub = b.dataset.sub;
    renderTabs();
    renderList();
  });

  /* ── 목록 ── */
  function renderList() {
    var list = filtered();
    var q = norm(state.q);

    var cat = catMap[state.cat];
    var title = !cat ? '전체 노트' : cat.name;
    if (cat && state.sub !== 'all') {
      var s = (cat.subs || []).filter(function (x) { return x.id === state.sub; })[0];
      if (s) title = cat.name + ' · ' + s.name;
    }
    if (q) title = '“' + state.q.trim() + '” 검색 결과';
    if (state.insta) {
      var sl = state.status !== 'all' ? STATUS_META[state.status].label : '';
      if (q) title = '📸 ' + title;
      else if (sl && cat) title = '📸 ' + cat.name + ' · ' + sl;
      else title = '📸 ' + (sl || title);
    }
    $('listTitle').textContent = title;
    $('listCount').textContent = list.length ? list.length + '개' : '';

    if (!list.length) {
      cardsEl.innerHTML = '';
      emptyEl.hidden = false;
      $('emptyTitle').textContent = q ? '검색 결과가 없어요' : (state.insta ? '인스타 소재로 찜한 노트가 없어요' : '아직 노트가 없어요');
      $('emptyDesc').textContent = q
        ? '다른 단어로 찾아보거나, 이 내용을 새 메모로 남겨 두세요.'
        : (state.insta
            ? (state.status !== 'all'
                ? '다른 상태를 골라 보거나, 노트를 열어 상태를 바꿔 보세요.'
                : '노트를 열어 [찜하기]를 누르면 이곳에 모여요.')
            : '새 메모를 추가해 보세요.');
      renderStatusFilter();
      return;
    }
    emptyEl.hidden = true;

    cardsEl.innerHTML = list.map(function (n) {
      var c = catOf(n);
      var sn = subName(n);
      var tags = (n.tags || []).slice(0, 3).map(function (t) { return '<span class="tag">#' + esc(t) + '</span>'; }).join('');
      var desc = n.summary || firstText(n);
      var st = statusOf(n);
      var stMeta = st ? STATUS_META[st] : null;
      return '' +
        '<button class="card" type="button" data-id="' + esc(n.id) + '" style="--c:' + c.color + '">' +
          '<div class="card-top">' +
            '<span class="chip" style="--chip-bg:' + c.soft + ';--chip-ink:' + c.ink + '">' +
              '<span class="dot"></span>' + esc(c.name) +
            '</span>' +
            (sn ? '<span class="sub-label">' + esc(sn) + '</span>' : '') +
            '<span class="card-badges">' +
              (stMeta
                ? '<span class="status-badge st-' + st + '"><span aria-hidden="true">' + stMeta.icon + '</span>' + stMeta.label + '</span>'
                : '') +
              (isInsta(n) ? '<span class="insta-dot" aria-label="인스타 소재">📱</span>' : '') +
            '</span>' +
          '</div>' +
          '<span class="card-title">' + highlight(n.title, q) + '</span>' +
          '<span class="card-desc">' + highlight(desc, q) + '</span>' +
          '<div class="card-foot">' + tags +
            (hasScript(n) ? '<span class="tag tag-script">🎬 대본</span>' : '') +
            '<svg class="card-arrow" viewBox="0 0 24 24" aria-hidden="true">' +
              '<path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</div>' +
        '</button>';
    }).join('');
    renderStatusFilter();
  }

  /* ── 진행 상태 필터 (인스타 소재 탭) ── */
  function renderStatusFilter() {
    var el = $('statusFilter');
    if (!state.insta) {
      el.hidden = true;
      el.innerHTML = '';
      return;
    }
    var counts = { all: 0, idea: 0, scripted: 0, posted: 0 };
    allNotes().forEach(function (n) {
      if (!isInsta(n)) return;
      if (state.cat !== 'all' && n.cat !== state.cat) return;
      counts.all++;
      var s = statusOf(n);
      if (s && counts[s] != null) counts[s]++;
    });
    var html = '<button class="st-chip" type="button" data-st="all" aria-pressed="' + (state.status === 'all') + '">' +
      '전체 <span class="n">' + counts.all + '</span></button>';
    STATUS_ORDER.forEach(function (s) {
      html += '<button class="st-chip st-' + s + '" type="button" data-st="' + s + '" aria-pressed="' + (state.status === s) + '">' +
        '<span aria-hidden="true">' + STATUS_META[s].icon + '</span>' + STATUS_META[s].label +
        ' <span class="n">' + counts[s] + '</span></button>';
    });
    el.innerHTML = html;
    el.hidden = false;
  }

  $('statusFilter').addEventListener('click', function (e) {
    var b = e.target.closest('.st-chip');
    if (!b) return;
    state.status = b.dataset.st;
    renderStatusFilter();
    renderList();
  });

  function firstText(n) {
    var b = (n.blocks || []).filter(function (x) { return x.type === 'p' || x.type === 'h'; })[0];
    return b ? strip(b.text) : '';
  }

  cardsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.card');
    if (!b) return;
    openNote(b.dataset.id);
  });

  /* ── 검색 ── */
  var searchTimer = null;
  searchEl.addEventListener('input', function () {
    clearEl.hidden = !searchEl.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      state.q = searchEl.value;
      renderList();
    }, 90);
  });
  clearEl.addEventListener('click', function () {
    searchEl.value = '';
    clearEl.hidden = true;
    state.q = '';
    renderList();
    searchEl.focus();
  });

  /* ── 스크롤 그림자 ── */
  window.addEventListener('scroll', function () {
    $('topbar').classList.toggle('scrolled', window.scrollY > 4);
  }, { passive: true });

  /* ── 상세 시트 ── */
  var currentId = null;

  function blocksHTML(n) {
    return (n.blocks || []).map(function (b, bi) {
      if (b.type === 'h') return '<h3>' + rich(b.text) + '</h3>';
      if (b.type === 'p') return '<p>' + rich(b.text) + '</p>';
      if (b.type === 'ul') return '<ul>' + (b.items || []).map(function (t) { return '<li>' + rich(t) + '</li>'; }).join('') + '</ul>';
      if (b.type === 'ol') return '<ol>' + (b.items || []).map(function (t) { return '<li>' + rich(t) + '</li>'; }).join('') + '</ol>';
      if (b.type === 'table') {
        var head = b.head ? '<thead><tr>' + b.head.map(function (h) { return '<th>' + rich(h) + '</th>'; }).join('') + '</tr></thead>' : '';
        var body = '<tbody>' + (b.rows || []).map(function (r) {
          return '<tr>' + r.map(function (c) { return '<td>' + rich(c) + '</td>'; }).join('') + '</tr>';
        }).join('') + '</tbody>';
        return '<div class="tbl-wrap"><table>' + head + body + '</table></div>';
      }
      if (b.type === 'checklist') {
        var key = n.id;
        return '<ul class="checklist">' + (b.items || []).map(function (t, ii) {
          var k = bi + ':' + ii;
          var on = !!(checks[key] && checks[key][k]);
          return '<li><button class="check" type="button" role="checkbox" aria-checked="' + on + '" ' +
            'data-note="' + esc(key) + '" data-key="' + k + '">' +
            '<span class="box"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
            '<span class="check-text">' + rich(t) + '</span></button></li>';
        }).join('') + '</ul>';
      }
      if (b.type === 'callout') {
        return '<div class="callout ' + (b.tone === 'info' ? 'info' : '') + '">' +
          '<span class="ic">' + esc(b.icon || '⚠️') + '</span><span>' + rich(b.text) + '</span></div>';
      }
      return '';
    }).join('');
  }

  function linksHTML(n) {
    return (n.links || []).map(function (l) {
      var host = l.note || '';
      try { host = host || new URL(l.url).host; } catch (e) { host = ''; }
      return '<a class="link-btn" href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M10 14a3.6 3.6 0 0 1 0-5.1l2.3-2.3a3.6 3.6 0 0 1 5.1 5.1l-1.2 1.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
          '<path d="M14 10a3.6 3.6 0 0 1 0 5.1l-2.3 2.3a3.6 3.6 0 0 1-5.1-5.1l1.2-1.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
        '</svg></span>' +
        '<span class="tx"><b>' + esc(l.label) + '</b><span>' + esc(host) + '</span></span>' +
        '<span class="go">↗</span></a>';
    }).join('');
  }

  function renderInstaCard(n) {
    var el = $('sheetInsta');
    var on = isInsta(n);
    var hook = n.instaHook ? String(n.instaHook) : '';
    el.hidden = false;
    el.innerHTML =
      '<div class="insta-row">' +
        '<span class="insta-label">📸 인스타 소재</span>' +
        '<button class="insta-toggle" type="button" data-action="insta-toggle" aria-pressed="' + on + '">' +
          (on ? '찜됨' : '찜하기') +
        '</button>' +
      '</div>' +
      (hook
        ? '<p class="insta-hook">“' + esc(hook) + '”</p>' +
          '<button class="insta-copy" type="button" data-action="insta-copy">훅 복사</button>'
        : '<p class="insta-hint">' + esc(on
            ? '찜해 뒀어요. 나중에 한 줄 훅만 붙이면 릴스·카드뉴스 소재로 바로 쓸 수 있어요.'
            : '릴스·카드뉴스로 쓸 만한 메모면 찜해 두면 상단 📱 탭에 모여요.') + '</p>');
  }

  function toggleInsta(id) {
    var n = allNotes().filter(function (x) { return x.id === id; })[0];
    if (!n) return;
    var now = !isInsta(n);
    instaPrefs[n.id] = now;
    save(STORE_INSTA, instaPrefs);
    renderInstaCard(n);
    renderTabs();
    renderList();
    toast(now ? '인스타 소재로 찜했어요' : '찜을 해제했어요');
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-action="insta-toggle"]')) {
      toggleInsta(currentId);
      return;
    }
    if (e.target.closest('[data-action="insta-copy"]')) {
      var n = allNotes().filter(function (x) { return x.id === currentId; })[0];
      if (!n || !n.instaHook) return;
      copyText(n.instaHook).then(function (ok) {
        toast(ok ? '인스타 훅을 복사했어요' : '복사가 안 됐어요', !ok);
      });
    }
  });

  /* ── 크리에이터 스튜디오 ── */
  function scriptText(n) {
    var s = (n && n.script) || {};
    var out = [];
    if (s.hook) out.push('[0~3초 훅]\n' + s.hook);
    if (s.core) out.push('[3~12초 핵심]\n' + s.core);
    if (s.cta) out.push('[12~15초 CTA]\n' + s.cta);
    return out.join('\n\n');
  }

  function captionText(n) {
    var out = [];
    if (n.caption) out.push(String(n.caption).trim());
    var tags = (n.hashtags || []).join(' ');
    if (tags) out.push(tags);
    if (n.pinnedComment) out.push('📌 고정 댓글\n' + n.pinnedComment);
    return out.join('\n\n');
  }

  function currentNote() {
    return allNotes().filter(function (x) { return x.id === currentId; })[0] || null;
  }

  function renderStudio(note) {
    var el = $('sheetStudio');
    if (!el) return;
    var n = note || {};
    var st = statusOf(note);
    var s = (n && n.script) || {};
    var html = '';

    html += '<div class="studio-head">' +
      '<span class="studio-title">🎬 크리에이터 스튜디오</span>' +
      (st ? '<span class="studio-state st-' + st + '">' + STATUS_META[st].label + '</span>' : '') +
      '</div>';

    html += '<div class="pipe" role="group" aria-label="진행 상태">' +
      STATUS_ORDER.map(function (k) {
        return '<button class="pipe-btn st-' + k + '" type="button" data-pipe="' + k + '" aria-pressed="' + (st === k) + '">' +
          '<span aria-hidden="true">' + STATUS_META[k].icon + '</span>' + STATUS_META[k].label + '</button>';
      }).join('') + '</div>';

    if (hasScript(n)) {
      html += '<div class="studio-block">' +
        '<div class="block-head"><b>15초 릴스 대본</b>' +
          '<button class="mini-btn" type="button" data-action="copy-script">대본 복사</button></div>' +
        '<div class="script-lines">' +
          (s.hook ? '<div class="script-line"><span class="t">0~3초 훅</span><p>' + esc(s.hook) + '</p></div>' : '') +
          (s.core ? '<div class="script-line"><span class="t">3~12초 핵심</span><p>' + esc(s.core) + '</p></div>' : '') +
          (s.cta ? '<div class="script-line"><span class="t">12~15초 CTA</span><p>' + esc(s.cta) + '</p></div>' : '') +
        '</div></div>';
    }

    if (hasCaption(n)) {
      html += '<div class="studio-block">' +
        '<div class="block-head"><b>캡션 + 해시태그 + 고정 댓글</b>' +
          '<button class="mini-btn" type="button" data-action="copy-caption">캡션+댓글 복사</button></div>' +
        (n.caption ? '<p class="cap-text">' + esc(n.caption).replace(/\n/g, '<br>') + '</p>' : '') +
        ((n.hashtags || []).length
          ? '<div class="hashtags">' + n.hashtags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>'
          : '') +
        (n.pinnedComment
          ? '<div class="pinned"><span class="pin-label">📌 고정 댓글</span><p>' + esc(n.pinnedComment).replace(/\n/g, '<br>') + '</p></div>'
          : '') +
        '</div>';
    }

    var aff = affOf(n);
    html += '<div class="studio-block">' +
      '<div class="block-head"><b>🔗 제휴 · 쿠팡파트너스 링크</b></div>' +
      '<div class="aff-row">' +
        '<input class="aff-input" type="url" inputmode="url" autocomplete="off" aria-label="제휴 링크" ' +
          'placeholder="링크를 붙여넣고 저장" value="' + esc(aff) + '" />' +
        '<button class="mini-btn" type="button" data-action="aff-save">저장</button>' +
      '</div>' +
      '<div class="aff-actions">' +
        '<button class="mini-btn ghost" type="button" data-action="aff-open">바로 열기 ↗</button>' +
        '<button class="mini-btn ghost" type="button" data-action="aff-copy">링크 복사</button>' +
      '</div>' +
      '<p class="aff-hint">' + esc(aff
        ? '이 기기에 저장됐어요. 앱을 다시 열어도 그대로 남아요.'
        : '쿠팡파트너스에서 만든 링크를 넣어 두면 열기·복사가 바로 됩니다.') + '</p>' +
    '</div>';

    var ref = refOf(n);
    html += '<div class="studio-block">' +
      '<div class="block-head"><b>🔥 떡상 포인트</b></div>' +
      (n.viralReason
        ? '<p class="viral">' + esc(n.viralReason) + '</p>'
        : '<p class="viral none">왜 반응이 좋았는지 한 줄만 적어 두면 다음 대본에 그대로 쓸 수 있어요.</p>') +
      '<div class="aff-row">' +
        '<input class="ref-input" type="url" inputmode="url" autocomplete="off" aria-label="레퍼런스 링크" ' +
          'placeholder="레퍼런스 링크 (벤치마킹한 릴스)" value="' + esc(ref) + '" />' +
        '<button class="mini-btn" type="button" data-action="ref-open">열기 ↗</button>' +
      '</div>' +
    '</div>';

    if (!hasScript(n) && !hasCaption(n)) {
      html += '<p class="studio-hint">새 메모를 쓸 때 [🎬 크리에이터 스튜디오]를 펼쳐 대본·캡션을 넣으면 여기서 한 번에 복사할 수 있어요.</p>';
    }

    el.innerHTML = html;
    el.hidden = false;
  }

  function normalizeUrl(v) {
    var s = String(v || '').trim();
    if (!s) return '';
    if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
    return s;
  }

  function saveAff(silent) {
    var inp = document.querySelector('.aff-input');
    if (!inp || !currentId) return '';
    var v = normalizeUrl(inp.value);
    affPrefs[currentId] = v;
    save(STORE_AFF, affPrefs);
    inp.value = v;
    var hint = document.querySelector('.aff-hint');
    if (hint) {
      hint.textContent = v
        ? '이 기기에 저장됐어요. 앱을 다시 열어도 그대로 남아요.'
        : '쿠팡파트너스에서 만든 링크를 넣어 두면 열기·복사가 바로 됩니다.';
    }
    if (!silent) toast(v ? '제휴 링크를 저장했어요' : '제휴 링크를 지웠어요');
    return v;
  }

  function saveRef(silent) {
    var inp = document.querySelector('.ref-input');
    if (!inp || !currentId) return '';
    var v = normalizeUrl(inp.value);
    refPrefs[currentId] = v;
    save(STORE_REF, refPrefs);
    inp.value = v;
    if (!silent) toast(v ? '레퍼런스 링크를 저장했어요' : '레퍼런스 링크를 지웠어요');
    return v;
  }

  document.addEventListener('change', function (e) {
    if (!currentId) return;
    if (e.target.classList && e.target.classList.contains('aff-input')) saveAff(true);
    if (e.target.classList && e.target.classList.contains('ref-input')) saveRef(true);
  });

  document.addEventListener('click', function (e) {
    if (!currentId) return;

    var pipe = e.target.closest('[data-pipe]');
    if (pipe) {
      saveAff(true);
      saveRef(true);
      var st = pipe.dataset.pipe;
      setStatus(currentId, st);
      renderStudio(currentNote());
      renderList();
      toast('진행 상태: ' + STATUS_META[st].label);
      return;
    }

    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var action = btn.dataset.action;
    var n = currentNote();
    if (!n) return;

    if (action === 'copy-script') {
      var text = scriptText(n);
      if (!text) return;
      copyText(text).then(function (ok) {
        toast(ok ? '15초 대본을 복사했어요' : '복사가 안 됐어요', !ok);
      });
      return;
    }
    if (action === 'copy-caption') {
      var ctext = captionText(n);
      if (!ctext) return;
      copyText(ctext).then(function (ok) {
        toast(ok ? '캡션·해시태그·고정 댓글을 복사했어요' : '복사가 안 됐어요', !ok);
      });
      return;
    }
    if (action === 'aff-save') { saveAff(false); return; }
    if (action === 'aff-open') {
      var url = saveAff(true);
      if (!url) { toast('제휴 링크를 먼저 넣어 주세요', true); return; }
      window.open(url, '_blank', 'noopener');
      return;
    }
    if (action === 'aff-copy') {
      var aff = affOf(n) || (document.querySelector('.aff-input') || {}).value || '';
      aff = normalizeUrl(aff);
      if (!aff) { toast('제휴 링크를 먼저 넣어 주세요', true); return; }
      copyText(aff).then(function (ok) {
        toast(ok ? '제휴 링크를 복사했어요' : '복사가 안 됐어요', !ok);
      });
      return;
    }
    if (action === 'ref-open') {
      var rurl = saveRef(true);
      if (!rurl) { toast('레퍼런스 링크를 먼저 넣어 주세요', true); return; }
      window.open(rurl, '_blank', 'noopener');
    }
  });

  function openNote(id) {
    var n = allNotes().filter(function (x) { return x.id === id; })[0];
    if (!n) return;
    currentId = id;
    var c = catOf(n);
    var sn = subName(n);

    var chip = $('sheetChip');
    chip.style.setProperty('--chip-bg', c.soft);
    chip.style.setProperty('--chip-ink', c.ink);
    chip.innerHTML = (c.emoji ? '<span aria-hidden="true">' + c.emoji + '</span>' : '<span class="dot"></span>') + esc(c.name) + (sn ? ' · ' + esc(sn) : '');

    $('sheetTitle').textContent = n.title;
    $('sheetMeta').textContent = (n.date || '') + ((n.tags || []).length ? ' · ' + n.tags.map(function (t) { return '#' + t; }).join(' ') : '');
    renderInstaCard(n);
    renderStudio(n);
    $('sheetBody').innerHTML = blocksHTML(n);
    $('sheetLinks').innerHTML = linksHTML(n);

    var dz = $('dangerZone');
    dz.hidden = !!n.builtin;
    $('confirmDelete').hidden = true;
    $('deleteBtn').hidden = false;

    $('copyLabel').textContent = '전체 복사';
    $('copyBtn').classList.remove('done');

    $('sheetScroll').scrollTop = 0;
    showSheet($('sheet'));
  }

  /* 체크리스트 토글 */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.check');
    if (!b) return;
    var noteId = b.dataset.note;
    var k = b.dataset.key;
    var on = b.getAttribute('aria-checked') === 'true';
    checks[noteId] = checks[noteId] || {};
    if (on) delete checks[noteId][k]; else checks[noteId][k] = true;
    b.setAttribute('aria-checked', String(!on));
    save(STORE_CHECKS, checks);
  });

  /* 복사 */
  $('copyBtn').addEventListener('click', function () {
    var n = allNotes().filter(function (x) { return x.id === currentId; })[0];
    if (!n) return;
    var text = plainText(n);
    copyText(text).then(function (ok) {
      if (ok) {
        $('copyLabel').textContent = '복사했어요!';
        $('copyBtn').classList.add('done');
        toast('노트 전체를 복사했어요');
        setTimeout(function () {
          $('copyLabel').textContent = '전체 복사';
          $('copyBtn').classList.remove('done');
        }, 1900);
      } else {
        toast('복사가 안 됐어요. 길게 눌러 선택해 주세요', true);
      }
    });
  });

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; })
        .catch(function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }

  /* 삭제 */
  $('deleteBtn').addEventListener('click', function () {
    $('deleteBtn').hidden = true;
    $('confirmDelete').hidden = false;
  });
  $('cancelDelete').addEventListener('click', function () {
    $('confirmDelete').hidden = true;
    $('deleteBtn').hidden = false;
  });
  $('confirmDeleteBtn').addEventListener('click', function () {
    userNotes = userNotes.filter(function (n) { return n.id !== currentId; });
    save(STORE_NOTES, userNotes);
    closeSheets();
    renderTabs();
    renderList();
    toast('메모를 삭제했어요');
  });

  /* ── 새 메모 ── */
  var pickCat = 'memo';
  var pickSub = null;
  var pickStatus = 'idea';

  function renderStatusPick() {
    var el = $('fStatus');
    if (!el) return;
    el.innerHTML = STATUS_ORDER.map(function (s) {
      return '<button type="button" role="radio" class="st-' + s + '" data-pick-status="' + s + '" aria-checked="' + (pickStatus === s) + '">' +
        '<span aria-hidden="true">' + STATUS_META[s].icon + '</span>' + STATUS_META[s].label + '</button>';
    }).join('');
  }

  $('fStatus').addEventListener('click', function (e) {
    var b = e.target.closest('[data-pick-status]');
    if (!b) return;
    pickStatus = b.dataset.pickStatus;
    renderStatusPick();
  });

  function renderPick() {
    var el = $('fCategory');
    el.innerHTML = CATS.map(function (c) {
      var on = pickCat === c.id;
      return '<button type="button" role="radio" aria-checked="' + on + '" data-cat="' + c.id + '" ' +
        'style="--c:' + c.color + '">' + (c.emoji ? c.emoji + ' ' : '') + esc(c.name) + '</button>';
    }).join('');
  }

  $('fCategory').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-cat]');
    if (!b) return;
    pickCat = b.dataset.cat;
    pickSub = null;
    renderPick();
    renderSubPick();
  });

  var subPickEl = document.createElement('div');
  subPickEl.className = 'pick pick-sub';
  subPickEl.id = 'fSub';
  $('fCategory').parentNode.insertBefore(subPickEl, $('fCategory').nextSibling);
  subPickEl.hidden = true;

  function renderSubPick() {
    var c = catMap[pickCat];
    if (!c || !c.subs || !c.subs.length) { subPickEl.hidden = true; subPickEl.innerHTML = ''; return; }
    subPickEl.hidden = false;
    subPickEl.innerHTML = c.subs.map(function (s) {
      return '<button type="button" role="radio" aria-checked="' + (pickSub === s.id) + '" data-sub="' + s.id + '" style="--c:' + c.color + '">' + esc(s.name) + '</button>';
    }).join('');
  }
  subPickEl.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-sub]');
    if (!b) return;
    pickSub = pickSub === b.dataset.sub ? null : b.dataset.sub;
    renderSubPick();
  });

  function openForm() {
    $('noteForm').reset();
    if (!$('sheet').hidden) { $('sheet').classList.remove('show'); $('sheet').hidden = true; }
    pickCat = state.cat === 'all' ? 'memo' : state.cat;
    pickSub = state.sub === 'all' ? null : state.sub;
    pickStatus = 'idea';
    if (!catMap[pickCat]) pickCat = 'memo';
    $('fTitle').classList.remove('invalid');
    renderPick();
    renderSubPick();
    renderStatusPick();
    showSheet($('formSheet'), true);
    setTimeout(function () { $('fTitle').focus(); }, 320);
  }

  $('fab').addEventListener('click', openForm);
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-action="new"]')) openForm();
  });

  $('noteForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var title = $('fTitle').value.trim();
    if (!title) {
      $('fTitle').classList.add('invalid');
      $('fTitle').focus();
      return;
    }
    var body = $('fBody').value.replace(/\r\n/g, '\n').trim();
    var blocks = body
      ? body.split(/\n{2,}/).map(function (chunk) {
          return { type: 'p', text: chunk.replace(/\n/g, '<br>') };
        })
      : [];

    var links = [];
    var url = $('fLinkUrl').value.trim();
    if (url) {
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
      links.push({ label: $('fLinkLabel').value.trim() || '링크 열기', url: url });
    }

    var c = catMap[pickCat] || CATS[0];
    var sObj = (c.subs || []).filter(function (x) { return x.id === pickSub; })[0];

    var hook = $('fScriptHook').value.trim();
    var core = $('fScriptCore').value.replace(/\r\n/g, '\n').trim();
    var cta = $('fScriptCta').value.trim();
    var captionRaw = $('fCaption').value.replace(/\r\n/g, '\n').trim();
    var hashtags = captionRaw.match(/#[^\s#]+/g) || [];
    var caption = captionRaw
      .replace(/#[^\s#]+/g, '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    var pinned = $('fPinned').value.replace(/\r\n/g, '\n').trim();
    var affiliate = normalizeUrl($('fAffiliate').value);
    var refUrl = normalizeUrl($('fRefUrl').value);
    var viral = $('fViral').value.trim();
    var hasScriptData = !!(hook || core || cta);
    var hasCreatorData = hasScriptData || !!(caption || hashtags.length || pinned || affiliate || refUrl || viral);

    var first = blocks.length ? strip(blocks[0].text) : '';
    var note = {
      id: 'u-' + Date.now().toString(36),
      cat: c.id,
      sub: sObj ? sObj.id : null,
      title: title,
      summary: first.length > 120 ? first.slice(0, 120) + '…' : first,
      tags: hashtags.slice(0, 4).map(function (t) { return t.replace(/^#/, ''); }),
      date: today(),
      instaReady: !!$('fInsta').checked || hasCreatorData,
      instaHook: hook || null,
      status: pickStatus,
      script: hasScriptData ? { hook: hook, core: core, cta: cta } : null,
      caption: caption,
      hashtags: hashtags,
      pinnedComment: pinned,
      affiliateUrl: affiliate,
      refUrl: refUrl,
      viralReason: viral,
      blocks: blocks,
      links: links
    };

    if (affiliate) { affPrefs[note.id] = affiliate; save(STORE_AFF, affPrefs); }
    if (refUrl) { refPrefs[note.id] = refUrl; save(STORE_REF, refPrefs); }

    userNotes.unshift(note);
    var ok = save(STORE_NOTES, userNotes);
    closeSheets();
    state.cat = 'all';
    state.sub = 'all';
    state.status = 'all';
    searchEl.value = '';
    clearEl.hidden = true;
    state.q = '';
    renderTabs();
    renderList();
    toast(ok ? '메모를 저장했어요' : '저장 공간이 부족해요');
  });

  function today() {
    var d = new Date();
    var p = function (x) { return ('0' + x).slice(-2); };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }

  /* ── 시트 열고 닫기 ── */
  var lastFocus = null;
  var scrimEl = $('scrim');

  function showSheet(sheet, isForm) {
    clearTimeout(sheet._hideTimer);
    if (!sheet.hidden && sheet.classList.contains('show')) return;
    lastFocus = document.activeElement;
    if (!isForm && !$('sheet').hidden) { $('sheet').classList.remove('show'); $('sheet').hidden = true; }
    if (!isForm && !$('formSheet').hidden) { $('formSheet').classList.remove('show'); $('formSheet').hidden = true; }
    sheet.hidden = false;
    scrimEl.hidden = false;
    document.body.classList.add('locked');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        sheet.classList.add('show');
        scrimEl.classList.add('show');
      });
    });
  }

  function closeSheets() {
    [$('sheet'), $('formSheet')].forEach(function (s) {
      if (!s || s.hidden) return;
      s.classList.remove('show');
      clearTimeout(s._hideTimer);
      s._hideTimer = setTimeout(function () { s.hidden = true; }, 280);
    });
    scrimEl.classList.remove('show');
    setTimeout(function () { scrimEl.hidden = true; }, 240);
    document.body.classList.remove('locked');
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }

  scrimEl.addEventListener('click', closeSheets);
  $('closeSheet').addEventListener('click', closeSheets);
  $('closeForm').addEventListener('click', closeSheets);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSheets();
  });

  /* 시트 아래로 드래그해서 닫기 */
  [$('sheet'), $('formSheet')].forEach(function (sheet) {
    var startY = null, dy = 0, dragging = false;
    sheet.addEventListener('touchstart', function (e) {
      if (e.target.closest('.sheet-scroll') && !e.target.closest('.sheet-grip') && sheet.scrollTop !== 0) return;
      var scroll = sheet.querySelector('.sheet-scroll');
      if (scroll && scroll.scrollTop > 0) return;
      dragging = true; startY = e.touches[0].clientY; dy = 0;
      sheet.style.transition = 'none';
    }, { passive: true });
    sheet.addEventListener('touchmove', function (e) {
      if (!dragging || startY == null) return;
      dy = e.touches[0].clientY - startY;
      if (dy > 0) sheet.style.transform = 'translateY(' + dy + 'px)';
    }, { passive: true });
    sheet.addEventListener('touchend', function () {
      if (!dragging) return;
      dragging = false;
      sheet.style.transition = '';
      sheet.style.transform = '';
      if (dy > 110) closeSheets();
      startY = null;
    });
  });

  /* ── 토스트 ── */
  var toastTimer = null;
  function toast(msg, isError) {
    var el = $('toast');
    el.textContent = msg;
    el.classList.toggle('error', !!isError);
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2200);
  }

  /* ── 시작 ── */
  renderTabs();
  renderList();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js').catch(function () {});
    });
  }
})();
