const data = window.LINGUA_DATA;
const state = {
  profile: 'tho',
  page: 'profiles',
  lessonId: null,
  tab: 'read',
  idx: 0,
  answers: [],
  orderSel: [],
  matchPick: null,
  matchPairs: []
};
let progress = {};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const DB_NAME = 'lingua-os-v7';

function esc(s) {
  return String(s).replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}

async function openDB() {
  return await new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore('kv');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveState() {
  const db = await openDB();
  await new Promise((resolve, reject) => {
    const tx = db.transaction('kv', 'readwrite');
    tx.objectStore('kv').put({ progress, profile: state.profile }, 'app-state');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function loadState() {
  const db = await openDB();
  return await new Promise((resolve, reject) => {
    const tx = db.transaction('kv', 'readonly');
    const req = tx.objectStore('kv').get('app-state');
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

function currentProfile() {
  return data.profiles.find(p => p.id === state.profile);
}
function currentLesson() {
  return data.lessons.find(l => l.id === state.lessonId);
}
function currentModule() {
  const l = currentLesson();
  return l ? data.modules.find(m => m.id === l.module) : null;
}
function modulesForProfile() {
  return data.modules.filter(m => m.profile === state.profile);
}
function lessonsForModule(id) {
  return data.lessons.filter(l => l.module === id);
}
function lessonProgress(id) {
  return progress[id] || { done: false, best: 0, history: [] };
}
function fmtDate() {
  return new Intl.DateTimeFormat('vi-VN').format(new Date());
}

function setPage(page, extra = {}) {
  Object.assign(state, extra, { page });
  render();
  saveState();
}

function profileIcon(p) {
  if (p.id === 'thuong') return `<svg aria-hidden="true" viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"/></svg>`;
  return '<span lang="zh">文</span>';
}

function appShell(inner) {
  const p = currentProfile();
  return `
  <div class="app">
    <aside class="sidebar">
      <div>
        <div class="brand">
          <div class="logo">L</div>
          <div>
            <h1>lingua os.</h1>
            <p>Learn with intention</p>
          </div>
        </div>
        <div class="workspace">Workspace · ${esc(p.name)}</div>
        <nav class="nav">
          <button class="${state.page === 'overview' ? 'active' : ''}" data-nav="overview">🏠 Tổng quan</button>
          <button class="${state.page === 'modules' ? 'active' : ''}" data-nav="modules">📚 Học phần</button>
          <button class="${state.page === 'resources' ? 'active' : ''}" data-nav="resources">🔎 Tài nguyên</button>
          <button class="${state.page === 'settings' ? 'active' : ''}" data-nav="settings">⚙️ Cài đặt</button>
        </nav>
      </div>
      <div class="sidebar-foot">
        <div>✦ Học có bằng chứng</div>
        <div>☁ Không phụ thuộc API</div>
        <div>💾 Có sao lưu / khôi phục</div>
      </div>
    </aside>
    <main class="content">
      <div class="topbar">
        <div class="breadcrumb">Lingua OS / Learning</div>
        <div class="toolbar">
          <div class="date-chip">
            <span class="chip-label">Today</span>
            <span class="chip-value">${fmtDate()}</span>
          </div>
          <button class="profile-btn" id="switchProfile">
            <span class="avatar">${profileIcon(p)}</span>
            <span class="profile-meta">
              <span class="profile-title">Workspace</span>
              <span class="profile-name">${esc(p.name)}</span>
            </span>
            <span class="profile-arrow">▾</span>
          </button>
        </div>
      </div>
      ${inner}
    </main>
  </div>`;
}

function renderProfiles() {
  const cards = data.profiles.map(p => {
    const last = '';
    return `
      <button class="card profile-card elevated" data-pick="${p.id}">
        <div class="profile-card-top">
          <div class="big-avatar">${profileIcon(p)}</div>
          ${last}
        </div>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.subtitle)}</p>
        <div class="profile-card-foot">
          <span class="tag">${esc(p.tag)}</span>
          <span class="enter-link">Vào không gian học →</span>
        </div>
      </button>`;
  }).join('');

  return `
    <div class="landing-shell">
      <aside class="landing-brand">
        <div class="brand">
          <div class="logo">L</div>
          <div>
            <h1>lingua os.</h1>
            <p>Learn with intention</p>
          </div>
        </div>
        <div class="landing-simple">ENGLISH · 中文 · MEDICINE</div>
      </aside>
      <main class="landing-main">
        <div class="landing-header">
          <div class="breadcrumb">Lingua OS / Welcome</div>
          <div class="date-plain">${fmtDate()}</div>
        </div>
        <section class="landing-hero">
          <div class="eyebrow">Learning spaces</div>
          <h2>Ai đang học hôm nay?</h2>

        </section>
        <div class="profile-pick refined">${cards}</div>
      </main>
    </div>`;
}

function renderOverview() {
  const p = currentProfile();
  if (p.id === 'tho') {
    const doneCount = Object.values(progress).filter(x => x.done).length;
    const roadmap = data.roadmap.map(r => `
      <div class="card module-card">
        <div class="pill">${esc(r[0])}</div>
        <p style="margin:14px 0 0;color:#55627b;line-height:1.75">${esc(r[1])}</p>
      </div>`).join('');

    return appShell(`
      <section class="hero compact-hero">
        <div class="eyebrow">Workspace overview</div>
        <h2>${esc(p.name)} học gì hôm nay?</h2>

      </section>
      <div class="overview-panel">
        <div class="card focus-card">
          <div class="focus-top">
            <div>
              <div class="k">Hôm nay nên bắt đầu từ đâu?</div>
              <h3>Tiếp tục theo đúng nhịp 72 phút English · 48 phút Chinese</h3>

            </div>
            <button class="primary" data-nav="modules">Vào học phần</button>
          </div>
        </div>
        <div class="stat-strip refined-stats">
          <div class="card stat"><div class="k">Tỷ lệ thời gian</div><div class="v">72 / 48</div><div class="small">72 phút English · 48 phút Chinese</div></div>
          <div class="card stat"><div class="k">Module trọng tâm</div><div class="v">4</div><div class="small">English Foundations · English in Context · Mandarin Foundations · Mandarin Daily Use</div></div>
          <div class="card stat"><div class="k">Tiến độ lesson</div><div class="v">${doneCount}</div><div class="small">Số lesson đã hoàn thành</div></div>
        </div>
      </div>
      <div class="section-title compact-title">
        <div>
          <h3>Roadmap của Thọ</h3>

        </div>
      </div>
      <div class="grid-3 roadmap-grid">${roadmap}</div>
    `);
  }

  return appShell(`
    <section class="hero">
      <h2>Workspace của ${esc(p.name)}</h2>
      <p class="subtitle">Phần của Thương đang chờ tài liệu thật của học phần Y đa khoa. Khi có tài liệu, app sẽ dựng lại theo chương – bài – bộ đề – lịch ôn, thay vì điền nội dung giả.</p>
    </section>
    <div class="card module-card">
      <h3 style="margin:0 0 8px">Thư viện học phần đang chờ tài liệu</h3>
      <p class="subtitle" style="font-size:16px">Bạn có thể tiếp tục phát triển hạ tầng app, còn nội dung y khoa sẽ được nhập sau để giữ đúng yêu cầu “không rối, không nhồi module giả”.</p>
    </div>
  `);
}

function renderModules() {
  const moduleHtml = modulesForProfile().map(m => {
    const sources = (m.sources || []).map(s => `<a href="${s[1]}" target="_blank" rel="noopener">${esc(s[0])}</a>`).join('');
    const lessons = lessonsForModule(m.id).map(l => {
      const pr = lessonProgress(l.id);
      return `
        <div class="lesson-row">
          <div>
            <strong>${esc(l.title)}</strong>
            <span>${esc(l.hero)} · ${l.minutes} phút · ${l.tasks.length} hoạt động</span>
          </div>
          <div style="display:flex;gap:10px;align-items:center">
            <span class="pill">Best ${pr.best || 0}%</span>
            <button data-open-lesson="${l.id}">Học bài này</button>
          </div>
        </div>`;
    }).join('');

    return `
      <div class="card module-card">
        <div class="module-head">
          <div>
            <div class="pill">${esc(m.level)}</div>
            <h3 style="font-size:30px;margin:12px 0 6px;letter-spacing:-.03em">${esc(m.name)}</h3>
            <p style="margin:0;color:#55627b;line-height:1.75">${esc(m.summary)}</p>
            <div class="source-links">${sources}</div>
          </div>
        </div>
        ${lessons ? `<div class="lessons-list">${lessons}</div>` : ''}
      </div>`;
  }).join('');

  return appShell(`
    <section class="hero">
      <h2>Học phần của ${esc(currentProfile().name)}</h2>
      <p class="subtitle">Chọn đúng module cần học. Các module được gom lớn, tránh biến từng ví dụ nhỏ thành cả một học phần riêng gây rối.</p>
    </section>
    <div class="lessons-list">${moduleHtml}</div>
  `);
}

function renderResources() {
  const html = modulesForProfile().map(m => {
    const sources = (m.sources || []).length ? (m.sources || []).map(s => `<a href="${s[1]}" target="_blank" rel="noopener">${esc(s[0])}</a>`).join('') : '<span class="small">Chưa có nguồn công khai cố định</span>';
    return `
      <div class="card resource-item">
        <h4>${esc(m.name)}</h4>
        <p>${esc(m.summary)}</p>
        <div class="source-links">${sources}</div>
      </div>`;
  }).join('');

  return appShell(`
    <section class="hero">
      <h2>Thư viện nguồn học</h2>
      <p class="subtitle">Đây là những nguồn mình ưu tiên để xây khung học liệu cho Thọ: ngữ pháp có giải thích rõ, hoạt động có phân cấp, và chuẩn năng lực / syllabus cho tiếng Trung.</p>
    </section>
    <div class="resource-list">${html}</div>
  `);
}

function renderSettings() {
  return appShell(`
    <section class="hero">
      <h2>Cài đặt & sao lưu</h2>
      <p class="subtitle">Để an toàn cho tiến độ học tập, bạn nên xuất bản sao lưu trước khi cập nhật phiên bản hoặc chuyển thiết bị.</p>
    </section>
    <div class="settings">
      <div class="card row">
        <h4>Xuất dữ liệu</h4>
        <p>Xuất trạng thái học tập hiện tại ra file JSON.</p>
        <button class="primary" id="exportBtn">Xuất backup</button>
      </div>
      <div class="card row">
        <h4>Nhập dữ liệu</h4>
        <p>Khôi phục dữ liệu từ file JSON đã xuất trước đó.</p>
        <input type="file" id="importFile" accept="application/json">
      </div>
      <div class="card row">
        <h4>Ghi chú kỹ thuật</h4>
        <div class="note">Phiên bản này cố tình không dùng Service Worker để tránh tình trạng cache khiến bạn nhìn thấy bản cũ. App vẫn sẽ cố gắng hủy đăng ký Service Worker cũ nếu có, nhưng trước khi cập nhật bạn vẫn nên hard refresh.</div>
      </div>
    </div>
  `);
}

function taskTypeLabel(t) {
  return ({ choice: 'Chọn đáp án', tf: 'Đúng / Sai', cloze: 'Điền từ', short: 'Trả lời ngắn', order: 'Sắp xếp câu', match: 'Ghép cặp' })[t.type] || 'Bài tập';
}

function renderPracticeTask(t) {
  const saved = state.answers[state.idx];
  let body = '';

  if (t.type === 'choice' || t.type === 'tf') {
    const options = t.type === 'tf' ? ['Đúng', 'Sai'] : t.options;
    body = `<div class="options">${options.map((o, i) => `
      <button class="option ${saved === i ? 'selected' : ''}" data-choice="${i}">
        <span class="dot">${saved === i ? '●' : ''}</span><span>${esc(o)}</span>
      </button>`).join('')}</div>`;
  }

  if (t.type === 'cloze' || t.type === 'short') {
    const bank = t.bank ? `<div class="choice-bank">${t.bank.map(x => `<button class="token" data-fill="${esc(x)}">${esc(x)}</button>`).join('')}</div>` : '';
    body = `<input class="input" id="inputAnswer" placeholder="Nhập câu trả lời…" value="${typeof saved === 'string' ? esc(saved) : ''}">${bank}`;
  }

  if (t.type === 'order') {
    const selected = state.orderSel.length ? state.orderSel.map(i => `<button class="token" data-remove="${i}">${esc(t.words[i])} ×</button>`).join('') : 'Chọn từ bên dưới theo đúng thứ tự';
    const bank = t.words.map((w, i) => `<button class="token ${state.orderSel.includes(i) ? 'used' : ''}" data-add="${i}" ${state.orderSel.includes(i) ? 'disabled' : ''}>${esc(w)}</button>`).join('');
    body = `<div class="dropzone">${selected}</div><div class="choice-bank">${bank}</div>`;
  }

  if (t.type === 'match') {
    const rights = (t._rights ||= t.pairs.map((p, i) => ({ id: i, txt: p[1] })).sort((a, b) => String(a.txt).localeCompare(String(b.txt))));
    const left = t.pairs.map((p, i) => `<button class="match-item ${state.matchPairs.some(x => x[0] === i) ? 'done' : state.matchPick === i ? 'active' : ''}" data-left="${i}" ${state.matchPairs.some(x => x[0] === i) ? 'disabled' : ''}>${esc(p[0])}</button>`).join('');
    const right = rights.map(r => `<button class="match-item ${state.matchPairs.some(x => x[1] === r.id) ? 'done' : ''}" data-right="${r.id}" ${state.matchPairs.some(x => x[1] === r.id) ? 'disabled' : ''}>${esc(r.txt)}</button>`).join('');
    body = `<div class="match-grid"><div class="match-col">${left}</div><div class="match-col">${right}</div></div>`;
  }

  return `
    <div class="card main-card">
      <div class="practice-top">
        <div class="breadcrumb">${taskTypeLabel(t).toUpperCase()}</div>
        <div class="pill">${state.idx + 1}/${currentLesson().tasks.length}</div>
      </div>
      <div class="progressbar"><b style="width:${((state.idx + 1) / currentLesson().tasks.length) * 100}%"></b></div>
      ${t.passage ? `<div class="passage-box"><div class="passage-heading">${esc(t.passageTitle || 'Reading passage')}</div><p>${esc(t.passage)}</p></div>` : ''}
      <h3 class="q-title">${esc(t.q)}</h3>
      ${body}
      <div class="practice-actions">
        <button class="secondary" id="prevTask" ${state.idx === 0 ? 'disabled' : ''}>← Câu trước</button>
        <button class="primary" id="submitTask">Nộp câu này</button>
      </div>
    </div>
    <aside class="card side-card">
      <div class="breadcrumb">Learning by doing</div>
      <h3 style="font-size:23px;letter-spacing:-.03em;margin:14px 0 12px">Bộ luyện ${currentLesson().tasks.length} hoạt động</h3>
      <p class="subtitle" style="font-size:14px;line-height:1.65">Đọc kỹ ngữ cảnh, tự trả lời và xem giải thích sau khi nộp.</p>
      <div class="note">Đạt từ 80% trở lên để đánh dấu hoàn thành. Các lỗi sai sẽ được lưu vào lịch sử của bài.</div>
    </aside>`;
}

function evaluateTask(t, answer) {
  if (t.type === 'choice') return { ok: answer === t.answer, user: t.options[answer] || '—', correct: t.options[t.answer], reason: t.reason };
  if (t.type === 'tf') {
    const correctIndex = t.answer ? 0 : 1;
    return { ok: answer === correctIndex, user: ['Đúng', 'Sai'][answer] || '—', correct: t.answer ? 'Đúng' : 'Sai', reason: t.reason };
  }
  if (t.type === 'cloze') {
    const ok = String(answer || '').trim().toLowerCase() === String(t.answer).trim().toLowerCase();
    return { ok, user: answer || '—', correct: t.answer, reason: t.reason };
  }
  if (t.type === 'short') {
    const got = String(answer || '').trim().toLowerCase();
    const list = (t.answers || []).map(x => String(x).trim().toLowerCase());
    const ok = list.includes(got);
    return { ok, user: answer || '—', correct: t.answers[0], reason: t.reason };
  }
  if (t.type === 'order') {
    const built = (answer || []).map(i => t.words[i]);
    const ok = JSON.stringify(built) === JSON.stringify(t.answer);
    return { ok, user: built.join(' '), correct: t.answer.join(' '), reason: t.reason };
  }
  if (t.type === 'match') {
    const good = (answer || []).filter(([l, r]) => l === r).length;
    return { ok: good === t.pairs.length, user: `${good}/${t.pairs.length} cặp đúng`, correct: `${t.pairs.length}/${t.pairs.length} cặp đúng`, reason: t.reason, fraction: good / t.pairs.length };
  }
  return { ok: false, user: '—', correct: '—', reason: '' };
}

function resultSummary() {
  const l = currentLesson();
  const detailed = l.tasks.map((t, i) => evaluateTask(t, state.answers[i]));
  let score = 0;
  detailed.forEach(r => { score += r.fraction != null ? r.fraction : (r.ok ? 1 : 0); });
  const percent = Math.round(score / l.tasks.length * 100);
  return { percent, detailed };
}

function renderResult() {
  const l = currentLesson();
  const m = currentModule();
  const res = resultSummary();
  const pr = lessonProgress(l.id);
  const log = res.detailed.map((r, i) => `
    <div class="answer-item">
      <div style="display:flex;justify-content:space-between;gap:10px"><strong>Câu ${i + 1}</strong><span class="${r.ok ? 'ok' : 'bad'}">${r.ok ? 'Đúng' : 'Sai'}</span></div>
      <div class="small" style="margin-top:6px">Bạn chọn / trả lời: ${esc(r.user)}</div>
      <div class="small">Đáp án đúng: ${esc(r.correct)}</div>
      <div style="margin-top:8px;color:#55627b;line-height:1.65">${esc(r.reason)}</div>
    </div>`).join('');

  return appShell(`
    <section class="lesson-head">
      <a class="back-link" href="#" data-nav="modules">← ${esc(m.name)}</a>
      <div class="module-badge">${esc(m.name)} · ${l.minutes} phút</div>
      <div class="lesson-title">${esc(l.title)}</div>
      <p class="lesson-hero">Kết quả của lần làm này. Bài được đánh dấu hoàn thành khi đạt từ 80% trở lên.</p>
    </section>
    <div class="tabs">
      <button class="tab" data-tab="read">01 · Hiểu bài</button>
      <button class="tab" data-tab="practice">02 · Thực hành</button>
      <button class="tab active">03 · Kết quả</button>
    </div>
    <div class="lesson-layout">
      <div class="card main-card">
        <div class="result-box">
          <div class="result-top">
            <div>
              <div class="breadcrumb">Result</div>
              <div class="score">${res.percent}%</div>
              <div class="small">Best trước đó: ${pr.best || 0}%</div>
            </div>
            <div class="pill">${res.percent >= 80 ? 'Hoàn thành' : 'Chưa đạt ngưỡng'}</div>
          </div>
          <div class="feedback">
            <strong>${res.percent >= 80 ? 'Bạn đã đạt ngưỡng hoàn thành 🎉' : 'Cần làm lại hoặc ôn thêm'}</strong>
            <div>${res.percent >= 80 ? 'App sẽ đánh dấu hoàn thành bài này. Tuy nhiên, để nhớ lâu, bạn vẫn nên quay lại ôn sau một khoảng thời gian.' : 'Hãy đọc lại phần hiểu bài, xem kỹ các câu sai và thử làm lại. Mục tiêu không chỉ là vượt điểm mà là hiểu bản chất.'}</div>
          </div>
          <div class="answer-log">${log}</div>
          <div class="cta-row">
            <button class="primary" id="redoLesson">Làm lại bài</button>
            <button class="secondary" data-nav="modules">Quay về học phần</button>
          </div>
        </div>
      </div>
      <aside class="card side-card">
        <div class="breadcrumb">Review next</div>
        <h3 style="font-size:28px;letter-spacing:-.03em;margin:14px 0 12px">Gợi ý sau bài</h3>
        <div class="note">Nếu bài vừa đạt, bạn nên tạo 1–2 câu mới bằng kiến thức vừa học. Nếu bài chưa đạt, ưu tiên đọc lại “lỗi thường gặp” và “ví dụ đúng / sai” trước khi làm lại.</div>
      </aside>
    </div>
  `);
}

function renderLesson() {
  const l = currentLesson();
  const m = currentModule();
  if (state.tab === 'result') return renderResult();

  let body = '';
  if (state.tab === 'read') {
    const theory = l.read.map(block => `<div class="block"><h4>${esc(block[0])}</h4><p>${esc(block[1])}</p></div>`).join('');
    const examples = l.examples.map(e => `<div class="ex"><span class="label">${esc(e[0])}</span><strong>${esc(e[1])}</strong></div>`).join('');
    const checklist = l.checklist.map(x => `<li>${esc(x)}</li>`).join('');
    const sources = (l.sourceLinks || []).map(s => `<a href="${s[1]}" target="_blank" rel="noopener">${esc(s[0])}</a>`).join('');

    body = `
      <div class="card main-card">
        <div class="breadcrumb">Learn with meaning</div>
        <h3 style="font-size:36px;letter-spacing:-.03em;margin:12px 0 8px">Hiểu bài thật sự trước khi làm</h3>

        <div class="read-intro">
          <div class="read-tile"><strong>Mục tiêu của bài</strong><span>${esc(l.goal)}</span></div>
          <div class="read-tile"><strong>Chuẩn hoàn thành</strong><span>Đạt từ 80% ở phần thực hành và hiểu được ít nhất các ý trong checklist.</span></div>
        </div>
        <div class="theory">${theory}</div>
        <div class="examples"><h4>Ví dụ đúng / sai</h4><div class="example-grid">${examples}</div></div>
        <div class="checklist examples"><h4>Checklist tự hiểu bài</h4><ul>${checklist}</ul></div>
        <div class="cta-row"><button class="primary" id="goPractice">Bắt đầu bộ luyện ${l.tasks.length} hoạt động →</button></div>
      </div>
      <aside class="card side-card">
        <div class="breadcrumb">Reference</div>
        <h3 style="font-size:28px;letter-spacing:-.03em;margin:14px 0 12px">Nguồn học mình dùng</h3>
        <div class="sources-list">${sources}</div>
        <div class="note" style="margin-top:14px">Nội dung trong app là tự biên soạn để phù hợp với cách học của bạn, nhưng khung module và định hướng được rút từ các nguồn học uy tín thay vì nhặt ví dụ rời rạc.</div>
      </aside>`;
  } else {
    body = renderPracticeTask(l.tasks[state.idx]);
  }

  return appShell(`
    <section class="lesson-head">
      <a class="back-link" href="#" data-nav="modules">← ${esc(m.name)}</a>
      <div class="module-badge">${esc(m.name)} · ${l.minutes} phút</div>
      <div class="lesson-title">${esc(l.title)}</div>
      <p class="lesson-hero">${esc(l.hero)}</p>
    </section>
    <div class="tabs">
      <button class="tab ${state.tab === 'read' ? 'active' : ''}" data-tab="read">01 · Hiểu bài</button>
      <button class="tab ${state.tab === 'practice' ? 'active' : ''}" data-tab="practice">02 · Thực hành</button>
      <button class="tab ${state.tab === 'result' ? 'active' : ''}" ${state.answers.length === l.tasks.length ? '' : 'disabled'} data-tab="result">03 · Kết quả</button>
    </div>
    <div class="lesson-layout">${body}</div>
  `);
}

function render() {
  const root = $('#root');
  if (state.page === 'profiles') {
    root.innerHTML = renderProfiles();
    bindProfilePicker();
    return;
  }
  if (state.page === 'overview') root.innerHTML = renderOverview();
  if (state.page === 'modules') root.innerHTML = renderModules();
  if (state.page === 'resources') root.innerHTML = renderResources();
  if (state.page === 'settings') root.innerHTML = renderSettings();
  if (state.page === 'lesson') root.innerHTML = renderLesson();
  bindCommon();
}

function bindProfilePicker() {
  $$('[data-pick]').forEach(el => {
    el.onclick = () => {
      state.profile = el.dataset.pick;
      setPage('overview');
    };
  });
}

function bindCommon() {
  $('#switchProfile')?.addEventListener('click', () => setPage('profiles'));
  $$('[data-nav]').forEach(btn => btn.onclick = () => setPage(btn.dataset.nav));
  $$('[data-open-lesson]').forEach(btn => btn.onclick = () => {
    state.lessonId = btn.dataset.openLesson;
    state.tab = 'read';
    state.idx = 0;
    state.answers = [];
    state.orderSel = [];
    state.matchPick = null;
    state.matchPairs = [];
    setPage('lesson');
  });
  $$('[data-tab]').forEach(btn => btn.onclick = () => {
    if (!btn.disabled) {
      state.tab = btn.dataset.tab;
      render();
    }
  });
  $('#goPractice')?.addEventListener('click', () => {
    state.tab = 'practice';
    render();
  });
  $('#exportBtn')?.addEventListener('click', exportData);
  $('#importFile')?.addEventListener('change', importData);
  $('#redoLesson')?.addEventListener('click', () => {
    state.tab = 'practice';
    state.idx = 0;
    state.answers = [];
    state.orderSel = [];
    state.matchPick = null;
    state.matchPairs = [];
    render();
  });
  if (state.page === 'lesson' && state.tab === 'practice') bindPractice();
}

function bindPractice() {
  const t = currentLesson().tasks[state.idx];
  $$('[data-choice]').forEach(btn => btn.onclick = () => {
    state.answers[state.idx] = Number(btn.dataset.choice);
    render();
  });
  $$('[data-fill]').forEach(btn => btn.onclick = () => {
    const inp = $('#inputAnswer');
    if (inp) {
      inp.value = btn.dataset.fill;
      state.answers[state.idx] = btn.dataset.fill;
    }
  });
  $('#inputAnswer')?.addEventListener('input', e => state.answers[state.idx] = e.target.value);
  $$('[data-add]').forEach(btn => btn.onclick = () => {
    state.orderSel.push(Number(btn.dataset.add));
    render();
  });
  $$('[data-remove]').forEach(btn => btn.onclick = () => {
    state.orderSel = state.orderSel.filter(x => x !== Number(btn.dataset.remove));
    render();
  });
  $$('[data-left]').forEach(btn => btn.onclick = () => {
    state.matchPick = Number(btn.dataset.left);
    render();
  });
  $$('[data-right]').forEach(btn => btn.onclick = () => {
    if (state.matchPick != null) {
      state.matchPairs.push([state.matchPick, Number(btn.dataset.right)]);
      state.matchPick = null;
      render();
    }
  });
  $('#prevTask')?.addEventListener('click', () => {
    if (state.idx > 0) {
      state.idx -= 1;
      state.orderSel = [];
      state.matchPick = null;
      state.matchPairs = [];
      render();
    }
  });
  $('#submitTask')?.addEventListener('click', () => {
    let answer = state.answers[state.idx];
    if (t.type === 'order') answer = [...state.orderSel];
    if (t.type === 'match') answer = [...state.matchPairs];

    const valid = t.type === 'order'
      ? answer?.length === t.words.length
      : t.type === 'match'
      ? answer?.length === t.pairs.length
      : (t.type === 'cloze' || t.type === 'short')
      ? String(answer || '').trim() !== ''
      : answer !== undefined;

    if (!valid) {
      alert('Hãy trả lời đầy đủ trước khi tiếp tục.');
      return;
    }

    state.answers[state.idx] = answer;
    if (state.idx < currentLesson().tasks.length - 1) {
      state.idx += 1;
      state.orderSel = [];
      state.matchPick = null;
      state.matchPairs = [];
      render();
    } else {
      const res = resultSummary();
      const old = lessonProgress(currentLesson().id);
      progress[currentLesson().id] = {
        done: old.done || res.percent >= 80,
        best: Math.max(old.best || 0, res.percent),
        history: [...(old.history || []), { at: Date.now(), score: res.percent }]
      };
      saveState();
      state.tab = 'result';
      render();
    }
  });
}

async function exportData() {
  const blob = new Blob([JSON.stringify({ progress, profile: state.profile }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'lingua-os-backup.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

async function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const text = await file.text();
  const obj = JSON.parse(text);
  progress = obj.progress || {};
  state.profile = obj.profile || 'tho';
  await saveState();
  alert('Đã khôi phục dữ liệu.');
  setPage('overview');
}

async function init() {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) if (r.scope.endsWith('/lingua-os/')) await r.unregister();
    }
  } catch (e) {}

  const stored = await loadState();
  if (stored) {
    progress = stored.progress || {};
    state.profile = stored.profile || 'tho';
    state.page = 'profiles';
  }
  render();
}

init();
