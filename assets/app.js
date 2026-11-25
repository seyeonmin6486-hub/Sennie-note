/* 센니 노트 — app */
(function () {
  'use strict';

  var CATS = window.SENNI_CATEGORIES || [];
  var BUILTIN = window.SENNI_NOTES || [];
  var STORE_NOTES = 'senni-note.notes.v1';
  var STORE_CHECKS = 'senni-note.checks.v1';
  var STORE_INSTA = 'senni-note.insta.v1';

  var catMap = {};
  CATS.forEach(function (c) { catMap[c.id] = c; });

  var state = { cat: 'all', sub: 'all', q: '', insta: false };

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

  function isInsta(n) {
    if (!n) return false;
    if (Object.prototype.hasOwnProperty.call(instaPrefs, n.id)) return !!instaPrefs[n.id];
    return !!(n.instaReady || n.instaHook);
  }

  function allNotes() {
    return BUILTIN.map(function (n) { return Object.assign({ builtin: true }, n); })
      .concat(userNotes.map(function (n) { return Object.assign({ builtin: false }, n); }));
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
    if (state.insta) title = '📸 ' + title;
    $('listTitle').textContent = title;
    $('listCount').textContent = list.length ? list.length + '개' : '';

    if (!list.length) {
      cardsEl.innerHTML = '';
      emptyEl.hidden = false;
      $('emptyTitle').textContent = q ? '검색 결과가 없어요' : (state.insta ? '인스타 소재로 찜한 노트가 없어요' : '아직 노트가 없어요');
      $('emptyDesc').textContent = q
        ? '다른 단어로 찾아보거나, 이 내용을 새 메모로 남겨 두세요.'
        : (state.insta ? '노트를 열어 [찜하기]를 누르면 이곳에 모여요.' : '새 메모를 추가해 보세요.');
      return;
    }
    emptyEl.hidden = true;

    cardsEl.innerHTML = list.map(function (n) {
      var c = catOf(n);
      var sn = subName(n);
      var tags = (n.tags || []).slice(0, 3).map(function (t) { return '<span class="tag">#' + esc(t) + '</span>'; }).join('');
      var desc = n.summary || firstText(n);
      return '' +
        '<button class="card" type="button" data-id="' + esc(n.id) + '" style="--c:' + c.color + '">' +
          '<div class="card-top">' +
            '<span class="chip" style="--chip-bg:' + c.soft + ';--chip-ink:' + c.ink + '">' +
              '<span class="dot"></span>' + esc(c.name) +
            '</span>' +
            (sn ? '<span class="sub-label">' + esc(sn) + '</span>' : '') +
            (isInsta(n) ? '<span class="insta-dot" aria-label="인스타 소재">📱</span>' : '') +
          '</div>' +
          '<span class="card-title">' + highlight(n.title, q) + '</span>' +
          '<span class="card-desc">' + highlight(desc, q) + '</span>' +
          '<div class="card-foot">' + tags +
            '<svg class="card-arrow" viewBox="0 0 24 24" aria-hidden="true">' +
              '<path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</div>' +
        '</button>';
    }).join('');
  }

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
    if (!catMap[pickCat]) pickCat = 'memo';
    $('fTitle').classList.remove('invalid');
    renderPick();
    renderSubPick();
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

    var first = blocks.length ? strip(blocks[0].text) : '';
    var note = {
      id: 'u-' + Date.now().toString(36),
      cat: c.id,
      sub: sObj ? sObj.id : null,
      title: title,
      summary: first.length > 120 ? first.slice(0, 120) + '…' : first,
      tags: [],
      date: today(),
      instaReady: !!$('fInsta').checked,
      instaHook: null,
      blocks: blocks,
      links: links
    };

    userNotes.unshift(note);
    var ok = save(STORE_NOTES, userNotes);
    closeSheets();
    state.cat = 'all';
    state.sub = 'all';
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
