// Career Lab Lite — tamamen tarayıcıda çalışır. Sunucu yoktur.
//  • Giriş: e-posta + parola → PBKDF2 ile anahtar türetilir → şifreli ilan verisinin anahtarı açılır. Yanlış bilgiyle veri çözülemez.
//  • CV: dosya tarayıcıda okunur; hiçbir yere gönderilmez. İstersen bu tarayıcıda saklanır (localStorage), istersen silinir.
import { buildIndex, scoreCv, fold, tokens } from './match.js';
import { parseCv, analyzeAts, renderCv, plainText, fileName, newSection, TEMPLATES, SECTION_KEYS } from './studio.js';

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const toB64 = (u8) => btoa(String.fromCharCode(...u8));
const enc = new TextEncoder();
const REGION = { tr: 'Türkiye', emea: 'Avrupa / EMEA remote', world: 'Dünya geneli remote', remote: 'Remote (bölge belirsiz)', visa: 'Yurt dışı · vize destekli' };
const MODEL = { remote: 'Remote', hybrid: 'Hibrit', onsite: 'Ofis' };
const state = { jobs: [], index: null, generated: null, cv: '', ranked: [], shown: 40 };

/* ---------------- şifre çözme ---------------- */
async function unlock(email, password) {
  const u = await (await fetch('data/users.json', { cache: 'no-store' })).json();
  const base = await crypto.subtle.importKey('raw', enc.encode(`${password}\n${email.trim().toLowerCase()}`), 'PBKDF2', false, ['deriveKey']);
  for (const e of u.users) {
    const kek = await crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: b64(e.salt), iterations: u.iterations }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    try { const ck = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(e.iv) }, kek, b64(e.key))); state.kek = { kek, salt: e.salt }; return ck; } catch { /* bu kayıt bu kullanıcıya ait değil */ }
  }
  return null;
}
/** Sahibe özel bölüm: anahtarı yalnızca sahip hesabın kek'iyle sarılıdır. Diğer hesaplar için sessizce hiçbir şey olmaz. */
async function ownerKey() {
  if (!state.kek) return null;
  const r = await fetch('data/me.json', { cache: 'no-store' }); if (!r.ok) return null;
  const m = await r.json();
  for (const e of (m.entries || []).filter((x) => x.salt === state.kek.salt)) {
    try { return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(e.iv) }, state.kek.kek, b64(e.key))); } catch { /* bu hesap sahip değil */ }
  }
  return null;
}
async function loadMine(okRaw) {
  const buf = new Uint8Array(await (await fetch('data/me.enc', { cache: 'no-store' })).arrayBuffer());
  const ok = await crypto.subtle.importKey('raw', okRaw, 'AES-GCM', false, ['decrypt']);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: buf.slice(0, 12) }, ok, buf.slice(12));
  return JSON.parse(await new Response(new Blob([plain]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
}
async function loadData(ckRaw) {
  const buf = new Uint8Array(await (await fetch('data/jobs.enc', { cache: 'no-store' })).arrayBuffer());
  const ck = await crypto.subtle.importKey('raw', ckRaw, 'AES-GCM', false, ['decrypt']);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: buf.slice(0, 12) }, ck, buf.slice(12));
  const text = await new Response(new Blob([plain]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
  return JSON.parse(text);
}
async function enter(ckRaw) {
  const data = await loadData(ckRaw);
  state.jobs = data.jobs; state.generated = data.generated_at; state.index = buildIndex(data.jobs); fillCountries();
  $('#gate').hidden = true; $('#app').hidden = false;
  $('#dataMeta').textContent = `${data.jobs.length} açık ilan · son güncelleme ${new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium' }).format(new Date(data.generated_at))}`;
  const saved = localStorage.getItem('cl_cv'); $('#roles').value = localStorage.getItem('cl_roles') || '';
  if (saved) setCv(saved, 'Bu tarayıcıda kayıtlı CV’n kullanılıyor.');
  try {
    const okS = sessionStorage.getItem('cl_ok'); const ok = okS ? b64(okS) : await ownerKey();
    if (ok) { state.mine = await loadMine(ok); sessionStorage.setItem('cl_ok', toB64(ok)); $('#viewTabs').hidden = false; }
  } catch { sessionStorage.removeItem('cl_ok'); }
}

/* ---------------- Benim alanım (yalnızca sahip hesap) ---------------- */
const MINE = { filter: 'all' };
function showView(v) {
  document.querySelectorAll('#viewTabs button').forEach((b) => { const on = b.dataset.v === v; b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on)); });
  const me = v === 'me';
  $('#meView').hidden = !me; $('#cvCard').hidden = me; $('#results').hidden = me || !state.ranked.length; $('#studio').hidden = true;
  if (me) renderMine();
}
document.querySelectorAll('#viewTabs button').forEach((b) => b.addEventListener('click', () => showView(b.dataset.v)));
function renderMine() {
  const d = state.mine; if (!d) return;
  const df = (iso) => (iso ? new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium' }).format(new Date(iso)) : '');
  const F = { all: ['Tümü', () => true], linkedin: ['LinkedIn’den eklenenler', (j) => j.linkedin], ai: ['AI ilanları', (j) => j.ai], high: ['Uyum 70+', (j) => (j.score || 0) >= 70], applied: ['Başvurduklarım', (j) => j.status !== 'New'] };
  const list = d.jobs.filter(F[MINE.filter][1]);
  const ST = { New: '', Shortlisted: 'Kısa liste', 'Ready to Apply': 'Başvuruya hazır', Applied: 'Başvurdum', Interview: 'Mülakat', Offer: 'Teklif', Rejected: 'Olumsuz', Archived: 'Arşiv' };
  $('#meView').innerHTML = `<section class="card me-head"><h1>Benim alanım</h1>
      <p class="muted">Yalnızca senin hesabınla açılır; bu adresteki diğer hesaplar göremez. Salt okunur kopya — düzenleme, başvuru ve mesajlar yerel dashboard’da. Güncelleme: <b>${esc(df(d.generated_at))}</b></p></section>
    <section class="card"><h2>Bugün kime ulaşmalıyım?</h2>
      ${d.today.length ? `<div class="me-acts">${d.today.map((a, i) => `<article class="me-act"><div class="me-n">${i + 1}</div><div><b>${esc(a.title)}</b>${a.lead ? `<p class="muted">${esc(a.lead)}</p>` : ''}
        ${a.projects.length ? `<div class="me-proj">Gönder: ${a.projects.map((p) => `<a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.title.replace(/\s*\(.*?\)\s*/g, ' ').trim())}</a>`).join(' · ')}</div>` : ''}
        ${a.sources.length ? `<div class="me-src">Kaynak: ${a.sources.slice(0, 2).map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join(' · ')}</div>` : ''}</div></article>`).join('')}</div>` : `<p class="muted">${esc(d.today_note || 'Bugün güçlü öneri yok.')}</p>`}
    </section>
    <section class="card"><div class="me-row"><h2>İlanlarım <span class="muted">(${list.length})</span></h2>
      <div class="chips" role="tablist">${Object.entries(F).map(([k, [l]]) => `<button class="chip${MINE.filter === k ? ' on' : ''}" data-mf="${k}">${esc(l)}</button>`).join('')}</div></div>
      <ul class="me-jobs">${list.slice(0, 120).map((j) => `<li><span class="me-score${(j.score || 0) >= 70 ? ' hi' : ''}" title="Uyum puanı — işe alınma olasılığı değildir">${j.score ?? '—'}</span>
        <div class="me-j"><a href="${esc(j.url)}" target="_blank" rel="noopener"><b>${esc(j.title)}</b></a><div class="muted">${esc(j.company)} · ${esc(j.location || '')}${j.tr ? ` · ${esc(j.tr)}` : ''}</div></div>
        <div class="me-tags">${j.linkedin ? '<span class="tag">LinkedIn</span>' : ''}${j.ai ? '<span class="tag">AI</span>' : ''}${ST[j.status] ? `<span class="tag on">${esc(ST[j.status])}</span>` : ''}</div></li>`).join('') || '<li class="muted">Bu filtrede ilan yok.</li>'}</ul>
      ${list.length > 120 ? `<p class="muted">İlk 120 gösteriliyor.</p>` : ''}</section>
    ${(d.cvs || []).length ? `<section class="card me-cv" data-testid="me-cv"><h2>CV’mi özelleştir</h2>
      <p class="muted">Kayıtlı CV’lerinden birini ve hedef ilanı seç; düzenleyici ATS kontrolüyle açılır. Düzenlemeler yalnızca bu tarayıcıda kalır. Burada AI yok; olmayan deneyim veya beceri ekleme.</p>
      <div class="me-cv-row"><label>Hedef ilan<select id="meCvJob"><option value="">İlansız — genel ATS kontrolü</option>${d.jobs.filter((j) => j.d).sort((a, b) => (b.score || 0) - (a.score || 0)).map((j) => `<option value="${j.id}">${j.score ?? '—'} · ${esc(j.company)} — ${esc(j.title)}${j.linkedin ? ' (LinkedIn)' : ''}</option>`).join('')}</select></label>
        <label>CV<select id="meCvSrc">${d.cvs.map((c) => `<option value="${esc(c.key)}">${esc(c.label)}</option>`).join('')}</select></label>
        <button class="btn primary" id="meCvOpen" data-testid="me-cv-open">Düzenleyicide aç</button></div>
      <p class="muted me-cv-hint" id="meCvHint"></p></section>` : ''}
    ${d.companies.length ? `<section class="card"><h2>Öne çıkan şirketler <span class="muted">(Opportunity Lab)</span></h2><div class="me-cos">${d.companies.slice(0, 18).map((c) => `<div class="me-co"><b>${esc(c.name)}</b><div class="muted">${esc([c.city, c.country].filter(Boolean).join(', '))}</div>
      <p>${esc((c.why || '').slice(0, 170))}</p><div>${(c.categories || []).map((x) => `<span class="tag">${esc(x)}</span>`).join('')}${c.website ? ` <a href="${esc(c.website)}" target="_blank" rel="noopener">site ↗</a>` : ''}</div></div>`).join('')}</div></section>` : ''}`;
  $('#meView').querySelectorAll('[data-mf]').forEach((b) => b.addEventListener('click', () => { MINE.filter = b.dataset.mf; renderMine(); }));
  const src = $('#meCvSrc'); const jsel = $('#meCvJob'); const hint = $('#meCvHint');
  if (src && jsel) {
    // İlan seçilince, o ilana özel kayıtlı bir CV versiyonu varsa onu öner; yoksa genel CV
    jsel.onchange = () => { const v = d.cvs.find((c) => c.job_id && String(c.job_id) === jsel.value); if (v) { src.value = v.key; hint.textContent = 'Bu ilan için dashboard’da kaydettiğin CV versiyonu seçildi.'; } else hint.textContent = jsel.value ? 'Bu ilan için kayıtlı versiyon yok; genel CV’lerden birini seç.' : ''; };
    $('#meCvOpen').onclick = () => {
      const c = d.cvs.find((x) => x.key === src.value); if (!c) return;
      const j = d.jobs.find((x) => String(x.id) === jsel.value) || null;
      state.cv = c.text;
      // Aynı CV kaynağına dönülürse tarayıcıdaki düzenlemeler korunur; farklı kaynak seçilirse metin baştan okunur
      if (!state.doc || state.doc.srcKey !== c.key) { state.doc = parseCv(c.text); state.doc.srcKey = c.key; }
      st.fromMine = true;
      openStudio(j ? { t: j.title, c: j.company, u: j.url, d: j.d || '', l: j.location, kw: j.kw || null } : null);
    };
  }
}
$('#loginForm').addEventListener('submit', async (e) => {
  e.preventDefault(); const msg = $('#loginMsg'); const btn = $('#loginBtn');
  btn.disabled = true; btn.textContent = 'Açılıyor…'; msg.hidden = true;
  try {
    const ck = await unlock($('#email').value, $('#password').value);
    if (!ck) throw new Error('Kullanıcı adı veya parola hatalı.');
    sessionStorage.setItem('cl_k', toB64(ck)); $('#password').value = '';
    await enter(ck);
  } catch (err) { msg.textContent = err.message || 'Açılamadı.'; msg.className = 'xp-msg err'; msg.hidden = false; }
  finally { btn.disabled = false; btn.textContent = 'Oturum aç'; }
});
$('#logout').addEventListener('click', () => { sessionStorage.removeItem('cl_k'); sessionStorage.removeItem('cl_ok'); location.reload(); });

/* ---------------- CV okuma (tarayıcıda) ---------------- */
async function readPdf(buf) {
  const pdfjs = await import('./vendor/pdf.min.js');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('./vendor/pdf.worker.min.js', import.meta.url).href;
  const doc = await pdfjs.getDocument({ data: buf }).promise; const parts = [];
  for (let p = 1; p <= doc.numPages; p++) { const c = await (await doc.getPage(p)).getTextContent(); parts.push(c.items.map((i) => i.str + (i.hasEOL ? '\n' : ' ')).join('')); }
  return parts.join('\n');
}
async function readDocx(buf) {
  const u8 = new Uint8Array(buf); const dv = new DataView(buf);
  let eocd = -1; for (let i = u8.length - 22; i >= Math.max(0, u8.length - 65557); i--) if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error('DOCX dosyası okunamadı.');
  let p = dv.getUint32(eocd + 16, true); const n = dv.getUint16(eocd + 10, true);
  for (let k = 0; k < n; k++) {
    const nameLen = dv.getUint16(p + 28, true); const extra = dv.getUint16(p + 30, true); const comment = dv.getUint16(p + 32, true);
    const name = new TextDecoder().decode(u8.subarray(p + 46, p + 46 + nameLen));
    if (name === 'word/document.xml') {
      const method = dv.getUint16(p + 10, true); const size = dv.getUint32(p + 20, true); const local = dv.getUint32(p + 42, true);
      const start = local + 30 + dv.getUint16(local + 26, true) + dv.getUint16(local + 28, true); const data = u8.subarray(start, start + size);
      const xml = method === 0 ? new TextDecoder().decode(data) : await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text();
      return xml.replace(/<\/w:p>/g, '\n').replace(/<w:tab\/>/g, ' ').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
    }
    p += 46 + nameLen + extra + comment;
  }
  throw new Error('DOCX içinde metin bulunamadı.');
}
async function readFile(file) {
  if (file.size > 15e6) throw new Error('Dosya çok büyük (en çok 15 MB).');
  const name = file.name.toLowerCase(); const buf = await file.arrayBuffer();
  if (name.endsWith('.pdf')) return readPdf(buf);
  if (name.endsWith('.docx')) return readDocx(buf);
  if (name.endsWith('.txt')) return new TextDecoder().decode(buf);
  throw new Error('Desteklenen biçimler: PDF, DOCX, TXT.');
}
function status(text, err = false) { const s = $('#cvStatus'); s.textContent = text; s.className = `status${err ? ' err' : ''}`; }
function setCv(text, note) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words < 40) { status('CV’den yeterli metin okunamadı (40 kelimeden az). Taranmış/görsel bir PDF olabilir; metni yapıştırmayı dene.', true); return; }
  if (text !== state.cv && text !== localStorage.getItem('cl_cv')) { state.doc = null; localStorage.removeItem('cl_cvdoc'); } // yeni CV → düzenleme sıfırlanır
  state.cv = text; localStorage.setItem('cl_cv', text);
  status(`${note} ${words} kelime okundu.`); $('#prefs').hidden = false; rank();
}
async function handleFile(file) { if (!file) return; status(`${file.name} okunuyor…`); try { setCv(await readFile(file), `${file.name}:`); } catch (e) { status(e.message || 'Dosya okunamadı.', true); } }
$('#pick').addEventListener('click', () => $('#file').click());
$('#file').addEventListener('change', (e) => handleFile(e.target.files[0]));
const drop = $('#drop');
drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('over'); });
drop.addEventListener('dragleave', () => drop.classList.remove('over'));
drop.addEventListener('drop', (e) => { e.preventDefault(); drop.classList.remove('over'); handleFile(e.dataTransfer.files[0]); });
$('#usePaste').addEventListener('click', () => setCv($('#pasteText').value, 'Yapıştırılan metin:'));
$('#clearCv').addEventListener('click', () => { localStorage.removeItem('cl_cv'); localStorage.removeItem('cl_roles'); localStorage.removeItem('cl_cvdoc'); state.doc = null; closeStudio(); state.cv = ''; state.ranked = []; $('#roles').value = ''; $('#prefs').hidden = true; $('#results').hidden = true; status('CV’n bu tarayıcıdan silindi.'); });
let roleTimer = null;
$('#roles').addEventListener('input', () => { clearTimeout(roleTimer); roleTimer = setTimeout(() => { localStorage.setItem('cl_roles', $('#roles').value); rank(); }, 350); });

/* ---------------- sıralama ve liste ---------------- */
function rank() {
  if (!state.cv || !state.index) return;
  const roles = $('#roles').value.split(',').map((x) => x.trim()).filter(Boolean);
  state.ranked = scoreCv(state.index, state.cv, roles); state.shown = 40; render();
}
// Ülke, İstanbul yakası, vize etiketleri — ilan metnine dayanır, tahmin yok
function geoTags(j) {
  const t = [];
  if (j.co && j.co !== 'Türkiye' && j.co !== 'Remote') t.push(`<span class="gt">🌍 ${esc(j.co)}</span>`);
  if (j.r === 'tr' && fold(j.l).includes('istanbul')) t.push(j.s ? `<span class="gt">${j.s === 'anadolu' ? 'Anadolu yakası' : 'Avrupa yakası'}</span>` : '<span class="gt dim" title="İlanda ilçe/semt yazmıyor">Yaka belirtilmemiş</span>');
  if (j.v === 'yes') t.push('<span class="gt ok" title="İlan metninde vize/relocation desteği geçiyor — şartları şirketle teyit et">✈ Vize/relocation destekli</span>');
  if (j.v === 'no') t.push('<span class="gt no" title="İlan metninde sponsorluk/relocation yapılmadığı yazıyor">Vize desteği yok</span>');
  return t.length ? `<div class="gtags">${t.join('')}</div>` : '';
}
function fillCountries() {
  const n = new Map(); for (const j of state.jobs) { const c = j.co || '_none'; n.set(c, (n.get(c) || 0) + 1); }
  const list = [...n.entries()].sort((a, b) => (b[0] === 'Türkiye') - (a[0] === 'Türkiye') || b[1] - a[1]);
  $('#fCountry').innerHTML = '<option value="">Tüm ülkeler</option>' + list.map(([c, k]) => `<option value="${esc(c)}">${esc(c === '_none' ? 'Ülke belirtilmemiş' : c)} (${k})</option>`).join('');
}

function render() {
  const on = new Set([...document.querySelectorAll('#regionChips .chip.on')].map((c) => c.dataset.r));
  const q = $('#search').value.trim().toLowerCase();
  const fc = $('#fCountry').value; const fs = $('#fSide').value;
  const rows = state.ranked.filter((r) => { const j = state.jobs[r.i]; return on.has(j.r) && (!q || `${j.t} ${j.c}`.toLowerCase().includes(q))
    && (!fc || (j.co || '_none') === fc) && (!fs || (j.r === 'tr' && fold(j.l).includes('istanbul') && (j.s || '_none') === fs)); });
  $('#results').hidden = false;
  $('#summary').textContent = rows.length ? `${rows.length} ilan CV’nle örtüşüyor (toplam ${state.jobs.length} ilan içinde). “Eşleşme” en iyi eşleşmeye göre gösterilir; işe alınma olasılığı değildir.` : 'Bu filtrelerle CV’nle örtüşen ilan bulunamadı. Konum filtrelerini açmayı veya “Aradığın roller” alanını doldurmayı dene.';
  $('#jobs').innerHTML = rows.slice(0, state.shown).map((r) => { const j = state.jobs[r.i];
    return `<li class="job"><div><h2>${esc(j.t)}${r.role ? '<span class="tag">aradığın rol</span>' : ''}</h2><div class="co">${esc(j.c)} · ${esc(j.l || REGION[j.r])}${MODEL[j.m] ? ` · ${MODEL[j.m]}` : ''}${j.p ? ` · ${esc(j.p)}` : ''}</div>${geoTags(j)}</div>
      <div class="fit" title="CV’ndeki kelimelerin bu ilanla örtüşmesi — en iyi eşleşmeye göre"><b>${r.pct}</b><span class="muted"> / 100</span><div class="track"><div class="fill" style="width:${r.pct}%"></div></div></div>
      <div class="kw"><span class="lbl">Örtüşen:</span>${r.terms.map((t) => `<span>${esc(t)}</span>`).join('')}${r.shared > r.terms.length ? `<span class="lbl">+${r.shared - r.terms.length}</span>` : ''}</div>
      <div class="acts"><a class="go" href="${esc(j.u)}" target="_blank" rel="noopener noreferrer">İlana git ↗</a><button class="btn small" type="button" data-edit="${r.i}">Bu ilana göre CV'ni düzenle</button></div></li>`; }).join('');
  $('#more').hidden = rows.length <= state.shown;
}
$('#more').addEventListener('click', () => { state.shown += 40; render(); });
$('#regionChips').addEventListener('click', (e) => { const c = e.target.closest('.chip'); if (!c) return; c.classList.toggle('on'); c.setAttribute('aria-pressed', c.classList.contains('on')); state.shown = 40; render(); });
$('#search').addEventListener('input', () => { state.shown = 40; render(); });
$('#fCountry').addEventListener('change', () => { state.shown = 40; render(); });
$('#fSide').addEventListener('change', () => { state.shown = 40; render(); });

/* ---------------- CV Atölyesi ---------------- */
const st = { tab: 'ats', job: null, timer: null };
const BUL = /^\s*(?:[-*•–·]|\d{1,2}[.)])\s+/;
const saveDoc = () => { try { localStorage.setItem('cl_cvdoc', JSON.stringify(state.doc)); } catch { /* depolama dolu: düzenleme oturum boyunca sürer */ } };
function ensureDoc() {
  if (state.doc) return state.doc;
  try { const s = JSON.parse(localStorage.getItem('cl_cvdoc') || 'null'); if (s && s.v === 1) return (state.doc = s); } catch { /* bozuk kayıt → yeniden oku */ }
  return (state.doc = parseCv(state.cv));
}
function openStudio(jobIndex = null) {
  if (!state.cv) { status('Önce CV’ni yükle.', true); return; }
  const d = ensureDoc(); st.job = jobIndex;
  const j = jobIndex === null ? null : (typeof jobIndex === 'object' ? jobIndex : state.jobs[jobIndex]); // Benim alanım: ilan nesnesi doğrudan gelir
  d.target = j ? { t: j.t, c: j.c } : null; saveDoc();
  $('#meView').hidden = true;
  $('#stClose').textContent = st.fromMine ? '← Benim alanım' : '← İlanlara dön';
  const steps = $('#stSteps'); steps.hidden = !st.fromMine;
  if (st.fromMine) steps.innerHTML = [['CV seçildi', true], [j ? 'Hedef ilan' : 'Hedef ilan yok (genel kontrol)', !!j], ['Düzenle', false], ['ATS kontrol', false], ['PDF indir', false]].map(([l, ok], n) => `<span class="${ok ? 'ok' : ''}"><i>${ok ? '✓' : n + 1}</i>${esc(l)}</span>`).join('<b aria-hidden="true">›</b>');
  $('#cvCard').hidden = true; $('#results').hidden = true; $('#studio').hidden = false;
  $('#stTarget').innerHTML = j ? `Hedef ilan: <b>${esc(j.t)}</b> — ${esc(j.c)} · <a href="${esc(j.u)}" target="_blank" rel="noopener noreferrer">ilanı aç ↗</a>` : 'İlan seçilmedi: genel ATS okunabilirliği değerlendiriliyor. Bir ilana göre düzenlemek için listeden “Bu ilana göre CV’ni düzenle”yi seç.';
  $('#stTpl').innerHTML = Object.entries(TEMPLATES).map(([k, t]) => `<option value="${k}" ${d.template === k ? 'selected' : ''} title="${esc(t.desc)}">${esc(t.label)}</option>`).join('');
  stEditor(); stPane(); window.scrollTo(0, 0);
}
function closeStudio() { if (st.fromMine) { $('#studio').hidden = true; showView('me'); window.scrollTo(0, 0); return; } $('#studio').hidden = true; $('#cvCard').hidden = false; if (state.ranked.length) render(); }
const changed = (redraw = false) => { saveDoc(); if (redraw) stEditor(); clearTimeout(st.timer); st.timer = setTimeout(stPane, 300); };

function stEditor() {
  const d = state.doc; const el = $('#stEdit');
  const ta = (id, val, rows) => `<textarea data-f="${id}" rows="${rows}" spellcheck="true">${esc(val)}</textarea>`;
  el.innerHTML = `<div class="st-card"><h3>Başlık</h3>
      <label>Ad Soyad<input data-f="name" value="${esc(d.header.name)}"></label>
      <label>Unvan satırı <span class="muted">(başvurduğun role uygun, gerçek unvanın)</span><input data-f="headline" value="${esc(d.header.headline)}"></label>
      <label>Konum<input data-f="location" value="${esc(d.header.location)}"></label>
      <label>İletişim <span class="muted">(her satıra bir tane: e-posta, telefon, LinkedIn, portfolyo)</span>${ta('contacts', d.header.contacts.join('\n'), 3)}</label>
      <label>CV dili <select data-f="lang"><option value="tr" ${d.lang === 'tr' ? 'selected' : ''}>Türkçe</option><option value="en" ${d.lang === 'en' ? 'selected' : ''}>İngilizce</option></select></label></div>
    ${d.sections.map((s, i) => `<div class="st-card${s.visible === false ? ' off' : ''}" data-i="${i}">
      <div class="st-row"><input class="st-title" data-s="title" value="${esc(s.title)}" aria-label="Bölüm başlığı">
        <label class="st-chk"><input type="checkbox" data-s="visible" ${s.visible !== false ? 'checked' : ''}> göster</label>
        <button class="btn small" data-mv="-1" ${i ? '' : 'disabled'} aria-label="Yukarı">↑</button><button class="btn small" data-mv="1" ${i < d.sections.length - 1 ? '' : 'disabled'} aria-label="Aşağı">↓</button>
        <button class="btn small" data-rm aria-label="Bölümü sil">Sil</button></div>
      <textarea data-s="lines" rows="${Math.min(22, Math.max(3, s.lines.reduce((n, l) => n + Math.ceil((l.length + 1) / 72), 1)))}">${esc(s.lines.join('\n'))}</textarea></div>`).join('')}
    <div class="st-card st-help"><b>Yazım ipuçları</b><ul>
      <li>Madde için satırı <code>- </code> ile başlat.</li><li>İş başlığı: <code>Unvan  Oca 2022 – Günümüz</code> — tarih aynı satırda olursa sağa hizalanır; alt satıra şirket adını yaz.</li>
      <li>Maddeye eylemle başla (Tasarladım, Geliştirdim / Designed, Built…), mümkünse somut sonucu yaz — ama yalnızca gerçekten olanı.</li></ul>
      <div class="st-row"><select id="stAdd"><option value="">+ Bölüm ekle…</option>${SECTION_KEYS.filter((k) => !d.sections.some((s) => s.key === k)).map((k) => `<option value="${k}">${esc(newSection(d, k).title)}</option>`).join('')}</select>
      <button class="btn small" id="stReparse" type="button" title="Yüklediğin CV’yi yeniden okur; bu sayfadaki düzenlemeler silinir">Düzenlemeleri sıfırla</button></div></div>`;
  el.querySelectorAll('[data-f]').forEach((x) => x.addEventListener('input', () => {
    const f = x.dataset.f; if (f === 'contacts') d.header.contacts = x.value.split('\n').map((v) => v.trim()).filter(Boolean); else if (f === 'lang') d.lang = x.value; else d.header[f] = x.value; changed();
  }));
  el.querySelectorAll('.st-card[data-i]').forEach((card) => {
    const s = d.sections[Number(card.dataset.i)];
    card.querySelector('[data-s=title]').addEventListener('input', (e) => { s.title = e.target.value; changed(); });
    card.querySelector('[data-s=visible]').addEventListener('change', (e) => { s.visible = e.target.checked; changed(true); });
    card.querySelector('[data-s=lines]').addEventListener('input', (e) => { s.lines = e.target.value.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => l.replace(BUL, '• '));
      if (st.lastGoto && st.lastGoto.startsWith(`${card.dataset.i}:`)) { st.edited = st.edited || {}; st.edited[st.lastGoto] = true; } changed(); });
    card.querySelectorAll('[data-mv]').forEach((b) => b.addEventListener('click', () => { const i = Number(card.dataset.i); const j = i + Number(b.dataset.mv); [d.sections[i], d.sections[j]] = [d.sections[j], d.sections[i]]; changed(true); }));
    card.querySelector('[data-rm]').addEventListener('click', () => { if (s.lines.length && !confirmInline(card)) return; d.sections.splice(Number(card.dataset.i), 1); changed(true); });
  });
  $('#stAdd').addEventListener('change', (e) => { if (e.target.value) { d.sections.push(newSection(d, e.target.value)); changed(true); } });
  $('#stReparse').addEventListener('click', (e) => { if (e.target.dataset.sure !== '1') { e.target.dataset.sure = '1'; e.target.textContent = 'Emin misin? Tekrar tıkla'; return; }
    const t = d.target; const tpl = d.template; state.doc = parseCv(state.cv); state.doc.target = t; state.doc.template = tpl; changed(true); });
}
// stEditor yeniden çizilince işaretler yeniden uygulanır
const _stEditor = stEditor; stEditor = function stEditorMarked() { _stEditor(); stMark(); }; // eslint-disable-line no-func-assign
// Dolu bölümü silmeden önce ikinci tıklamayı ister (tarayıcı onay penceresi kullanılmaz)
function confirmInline(card) { const b = card.querySelector('[data-rm]'); if (b.dataset.sure === '1') return true; b.dataset.sure = '1'; b.textContent = 'Emin misin?'; setTimeout(() => { b.dataset.sure = ''; b.textContent = 'Sil'; }, 3000); return false; }

function stPane() {
  const d = state.doc; const el = $('#stPane'); if (!d || $('#studio').hidden) return;
  document.querySelectorAll('.st-tabs .chip').forEach((c) => c.classList.toggle('on', c.dataset.t === st.tab));
  if (st.tab === 'preview') {
    el.innerHTML = '<div class="st-prev"><iframe id="stFrame" title="CV önizleme"></iframe></div><p class="muted st-small">Önizleme ekrandaki A4 sayfasıdır; PDF aynı düzende çıkar.</p>';
    const fr = $('#stFrame'); fr.srcdoc = renderCv(d, d.template);
    fr.addEventListener('load', () => { const box = fr.parentElement; const sc = box.clientWidth / 820; fr.style.transform = `scale(${sc})`; const h = fr.contentDocument.documentElement.scrollHeight; fr.style.height = `${h}px`; box.style.height = `${h * sc}px`; });
    return;
  }
  const ext = st.job !== null && typeof st.job === 'object'; // Benim alanım ilanı: Lite dizininde yok
  const j = st.job === null ? null : ext ? st.job : state.jobs[st.job];
  const a = analyzeAts(d, j, j ? (ext ? weightsFor(j) : state.index.docs[st.job].w) : null);
  const li = (arr) => arr.map((x) => `<li class="${x.ok ? 'ok' : 'warn'}">${x.ok ? '✔' : '⚠'} ${esc(x.text)}</li>`).join('');
  el.innerHTML = `<div class="st-score"><div class="big"><b>${a.score}</b><span>/100</span></div><div><b>${esc(a.label)}</b><p class="muted st-small">${esc(a.disclaimer)}</p></div></div>
    ${a.breakdown.map((b) => `<div class="st-bar"><span>${esc(b.label)} <span class="muted">%${b.weight}</span></span><div class="track"><div class="fill" style="width:${b.value}%"></div></div><span class="n">${b.value}</span></div>`).join('')}
    ${a.has_job ? `<h3>İlanla örtüşen terimler (${a.matched.length})</h3><div class="kw">${a.matched.map((t) => `<span class="hit">${esc(t)}</span>`).join('') || '<span class="lbl">—</span>'}</div>
      <h3>İlanda öne çıkan, CV’nde olmayan terimler (${a.missing.length})</h3><p class="muted st-small">Yalnızca gerçekten yaptıklarını, ilgili deneyim maddesine ilanın kullandığı kelimeyle ekle.</p><div class="kw">${a.missing.map((t) => `<span class="miss">${esc(t)}</span>`).join('') || '<span class="lbl">—</span>'}</div>
      ${a.skills_only.length ? `<p class="st-small">Yalnızca beceri/araç listesinde geçenler: <b>${esc(a.skills_only.join(', '))}</b> — bir deneyim maddesinde nerede kullandığını göster.</p>` : ''}
      ${a.title && !a.title.ok ? `<p class="st-warn">İlan unvanı <b>${esc(a.title.job_title)}</b>; başlık satırında/özette şu rol sözcükleri yok: ${esc(a.title.words.filter((w) => !a.title.hit.includes(w)).join(', '))}. Bu rolü gerçekten yapıyorsan unvan satırını buna göre düzenle.</p>` : ''}` : ''}
    ${fixPanel(a)}
    <h3>Bölüm yapısı</h3><ul class="st-list">${li(a.structure)}</ul><h3>Okunabilirlik</h3><ul class="st-list">${li(a.readability)}</ul><h3>Biçim</h3><ul class="st-list">${li(a.formatting)}</ul>`;
  el.querySelectorAll('[data-goto]').forEach((b) => b.addEventListener('click', () => { const [si, li2] = b.dataset.goto.split(':').map(Number); stGoto(si, li2, b.dataset.text); }));
  stMark();
}

/* Düzeltilecek yerler: her satır bir kez, bütün sorunları etiketle. Bu oturumda düzenlenen “✓ Düzenlendi”, sorunu kalmayan “✓ Çözüldü”. */
function fixPanel(a) {
  const open = a.places || []; const key = (p) => `${p.si}:${p.li}`; const openK = new Set(open.map(key));
  const shape = state.doc.sections.map((s) => s.lines.length).join(',');
  if (st.shape !== shape) { st.shape = shape; st.seen = {}; st.edited = {}; } // satır eklenip silinince yerler kayar → işaretler sıfırlanır
  for (const p of open) if (!st.seen[key(p)]) st.seen[key(p)] = { where: p.where, text: p.text };
  const solved = Object.entries(st.seen).filter(([k]) => !openK.has(k)).map(([k, v]) => { const [si, li2] = k.split(':').map(Number); return { k, ...v, now: (state.doc.sections[si]?.lines[li2] || v.text).replace(/^• /, '') }; });
  st.openSi = new Set(open.map((p) => p.si)); st.solvedSi = new Set(solved.map((x) => Number(x.k.split(':')[0])));
  if (!open.length && !solved.length) return '';
  const short = (t) => (t.length > 150 ? `${t.slice(0, 147)}…` : t);
  const row = (p, done) => `<div class="fx${done ? ' done' : st.edited[key(p)] ? ' ed' : ''}" data-testid="${done ? 'lite-solved' : 'lite-place'}"><div class="fx-b"><div class="fx-w">${esc(p.where)}</div><div class="fx-t">${esc(short(done ? p.now : p.text))}</div>
    <div class="fx-tags">${done ? '<span class="tg ok">✓ Çözüldü</span>' : `${p.tags.map((t) => `<span class="tg ${t.kind}">${esc(t.label)}</span>`).join('')}${st.edited[key(p)] ? '<span class="tg ok">✓ Düzenlendi — uyarı sürüyor</span>' : ''}`}</div></div>
    ${done ? '' : `<button class="btn small" data-goto="${key(p)}" data-text="${esc(p.text)}">Düzenle</button>`}</div>`;
  return `<h3>Düzeltilecek yerler (${open.length}${solved.length ? ` · ${solved.length} çözüldü` : ''})</h3><p class="muted st-small">Her satır bir kez gösterilir. “Düzenle” soldaki kutuda o satırı seçer. Tekrarı azaltmak için aynı şeyi farklı söyle veya gereksiz olanı çıkar.</p>
    ${open.map((p) => row(p, false)).join('') || '<p class="muted st-small">Açık uyarı kalmadı.</p>'}
    ${solved.length ? `<details open><summary class="muted st-small">Bu oturumda çözülenler (${solved.length})</summary>${solved.map((x) => row(x, true)).join('')}</details>` : ''}`;
}
/** Soldaki bölüm kutusunda ilgili satırı seçer, kaydırır ve vurgular. */
function stGoto(si, li2, text) {
  const ta = document.querySelector(`#stEdit .st-card[data-i="${si}"] textarea`); if (!ta) return;
  const lines = ta.value.split('\n'); let start = 0; let idx = lines.findIndex((l) => l.replace(/^\s*(?:[-*•–·]|\d{1,2}[.)])\s+/, '').trim() === text);
  if (idx < 0) idx = Math.min(li2, lines.length - 1);
  for (let i = 0; i < idx; i++) start += lines[i].length + 1;
  ta.scrollIntoView({ behavior: 'smooth', block: 'center' }); ta.classList.add('flash'); setTimeout(() => ta.classList.remove('flash'), 2400);
  setTimeout(() => { ta.focus({ preventScroll: true }); ta.setSelectionRange(start, start + (lines[idx] || '').length); }, 350);
  st.lastGoto = `${si}:${li2}`;
}
/** Bölüm kutularını işaretler: sarı = düzeltilecek satır var, yeşil = bu oturumda çözüldü. */
function stMark() {
  document.querySelectorAll('#stEdit .st-card[data-i]').forEach((c) => { const i = Number(c.dataset.i); c.classList.toggle('fx-open', !!st.openSi?.has(i)); c.classList.toggle('fx-ok', !st.openSi?.has(i) && !!st.solvedSi?.has(i)); });
}
document.querySelectorAll('.st-tabs .chip').forEach((c) => c.addEventListener('click', () => { st.tab = c.dataset.t; stPane(); }));
$('#stTpl').addEventListener('change', (e) => { state.doc.template = e.target.value; changed(); });
$('#stClose').addEventListener('click', closeStudio);
$('#openStudio').addEventListener('click', () => { st.fromMine = false; openStudio(null); });
$('#jobs').addEventListener('click', (e) => { const b = e.target.closest('[data-edit]'); if (b) { st.fromMine = false; openStudio(Number(b.dataset.edit)); } });
$('#stCopy').addEventListener('click', async () => { const b = $('#stCopy'); try { await navigator.clipboard.writeText(plainText(state.doc)); b.textContent = 'Kopyalandı ✓'; } catch { b.textContent = 'Kopyalanamadı'; } setTimeout(() => { b.textContent = 'Metni kopyala'; }, 1800); });
// PDF: CV gizli bir çerçevede açılır ve tarayıcının yazdırma penceresi gelir → “Hedef: PDF olarak kaydet”. Dosya hiçbir sunucuya gitmez.
$('#stPdf').addEventListener('click', () => {
  const fr = $('#stPrint'); const d = state.doc;
  fr.onload = () => { setTimeout(() => { try { fr.contentWindow.focus(); fr.contentWindow.print(); } catch { status('Yazdırma açılamadı.', true); } }, 150); };
  fr.srcdoc = renderCv(d, d.template);
  const n = $('#stPdfTip') || Object.assign(document.createElement('p'), { id: 'stPdfTip', className: 'st-note' });
  n.innerHTML = `Yazdırma penceresinde <b>Hedef: “PDF olarak kaydet”</b> seç, <b>“Üstbilgi ve altbilgi”</b> kutusunu kapat, <b>“Arka plan grafikleri”</b>ni aç. Önerilen dosya adı: <code>${esc(fileName(d))}.pdf</code>`;
  $('.st-head').after(n);
});

/* ---------------- açılış: bu sekmede oturum varsa devam et ---------------- */
const k = sessionStorage.getItem('cl_k');
if (k) enter(b64(k)).catch(() => { sessionStorage.removeItem('cl_k'); });

/** Dizinde olmayan bir ilan için TF-IDF ağırlıkları (Lite dizininin idf’iyle) — match.js ile aynı formül */
function weightsFor(j) {
  // Dashboard’un ilan analizinden gelen gerçek beceri gereksinimleri varsa yalnızca onlar + unvan sayılır (yan haklar, şirket tanıtımı sayılmaz)
  if (j.kw && (j.kw.have.length || j.kw.gap.length)) {
    const w = new Map();
    for (const s of [...j.kw.have, ...j.kw.gap]) for (const t of tokens(s)) w.set(t, Math.max(w.get(t) || 0, j.kw.gap.includes(s) ? 3.5 : 3));
    for (const t of tokens(j.t)) w.set(t, Math.max(w.get(t) || 0, 2));
    return w;
  }
  const idf = state.index ? state.index.idf : new Map(); const N = state.index ? state.index.N : 1;
  const tf = new Map(); for (const t of tokens(`${j.dep || ''} ${j.d || ''}`)) tf.set(t, (tf.get(t) || 0) + 1);
  for (const t of tokens(j.t)) tf.set(t, (tf.get(t) || 0) + 3);
  // Havuzda hiç geçmeyen kelimeler (yan haklar, şirkete özgü adlar…) sayılmaz; aksi halde “pet”, “friday” gibi gürültü en önemli terim olur
  const w = new Map(); for (const [t, c] of tf) { const f = idf.get(t); if (f && f < Math.log(1 + N / 2)) w.set(t, (1 + Math.log(c)) * f); }
  return w;
}
