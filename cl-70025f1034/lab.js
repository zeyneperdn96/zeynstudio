// Career Lab Lite — tamamen tarayıcıda çalışır. Sunucu yoktur.
//  • Giriş: e-posta + parola → PBKDF2 ile anahtar türetilir → şifreli ilan verisinin anahtarı açılır. Yanlış bilgiyle veri çözülemez.
//  • CV: dosya tarayıcıda okunur; hiçbir yere gönderilmez. İstersen bu tarayıcıda saklanır (localStorage), istersen silinir.
import { buildIndex, scoreCv } from './match.js';
import { parseCv, analyzeAts, renderCv, plainText, fileName, newSection, TEMPLATES, SECTION_KEYS } from './studio.js';

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const toB64 = (u8) => btoa(String.fromCharCode(...u8));
const enc = new TextEncoder();
const REGION = { tr: 'Türkiye', emea: 'Avrupa / EMEA remote', world: 'Dünya geneli remote', remote: 'Remote (bölge belirsiz)' };
const MODEL = { remote: 'Remote', hybrid: 'Hibrit', onsite: 'Ofis' };
const state = { jobs: [], index: null, generated: null, cv: '', ranked: [], shown: 40 };

/* ---------------- şifre çözme ---------------- */
async function unlock(email, password) {
  const u = await (await fetch('data/users.json', { cache: 'no-store' })).json();
  const base = await crypto.subtle.importKey('raw', enc.encode(`${password}\n${email.trim().toLowerCase()}`), 'PBKDF2', false, ['deriveKey']);
  for (const e of u.users) {
    const kek = await crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: b64(e.salt), iterations: u.iterations }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    try { return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(e.iv) }, kek, b64(e.key))); } catch { /* bu kayıt bu kullanıcıya ait değil */ }
  }
  return null;
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
  state.jobs = data.jobs; state.generated = data.generated_at; state.index = buildIndex(data.jobs);
  $('#gate').hidden = true; $('#app').hidden = false;
  $('#dataMeta').textContent = `${data.jobs.length} açık ilan · son güncelleme ${new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium' }).format(new Date(data.generated_at))}`;
  const saved = localStorage.getItem('cl_cv'); $('#roles').value = localStorage.getItem('cl_roles') || '';
  if (saved) setCv(saved, 'Bu tarayıcıda kayıtlı CV’n kullanılıyor.');
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
$('#logout').addEventListener('click', () => { sessionStorage.removeItem('cl_k'); location.reload(); });

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
function render() {
  const on = new Set([...document.querySelectorAll('#regionChips .chip.on')].map((c) => c.dataset.r));
  const q = $('#search').value.trim().toLowerCase();
  const rows = state.ranked.filter((r) => { const j = state.jobs[r.i]; return on.has(j.r) && (!q || `${j.t} ${j.c}`.toLowerCase().includes(q)); });
  $('#results').hidden = false;
  $('#summary').textContent = rows.length ? `${rows.length} ilan CV’nle örtüşüyor (toplam ${state.jobs.length} ilan içinde). “Eşleşme” en iyi eşleşmeye göre gösterilir; işe alınma olasılığı değildir.` : 'Bu filtrelerle CV’nle örtüşen ilan bulunamadı. Konum filtrelerini açmayı veya “Aradığın roller” alanını doldurmayı dene.';
  $('#jobs').innerHTML = rows.slice(0, state.shown).map((r) => { const j = state.jobs[r.i];
    return `<li class="job"><div><h2>${esc(j.t)}${r.role ? '<span class="tag">aradığın rol</span>' : ''}</h2><div class="co">${esc(j.c)} · ${esc(j.l || REGION[j.r])}${MODEL[j.m] ? ` · ${MODEL[j.m]}` : ''}${j.p ? ` · ${esc(j.p)}` : ''}</div></div>
      <div class="fit" title="CV’ndeki kelimelerin bu ilanla örtüşmesi — en iyi eşleşmeye göre"><b>${r.pct}</b><span class="muted"> / 100</span><div class="track"><div class="fill" style="width:${r.pct}%"></div></div></div>
      <div class="kw"><span class="lbl">Örtüşen:</span>${r.terms.map((t) => `<span>${esc(t)}</span>`).join('')}${r.shared > r.terms.length ? `<span class="lbl">+${r.shared - r.terms.length}</span>` : ''}</div>
      <div class="acts"><a class="go" href="${esc(j.u)}" target="_blank" rel="noopener noreferrer">İlana git ↗</a><button class="btn small" type="button" data-edit="${r.i}">Bu ilana göre CV'ni düzenle</button></div></li>`; }).join('');
  $('#more').hidden = rows.length <= state.shown;
}
$('#more').addEventListener('click', () => { state.shown += 40; render(); });
$('#regionChips').addEventListener('click', (e) => { const c = e.target.closest('.chip'); if (!c) return; c.classList.toggle('on'); c.setAttribute('aria-pressed', c.classList.contains('on')); state.shown = 40; render(); });
$('#search').addEventListener('input', () => { state.shown = 40; render(); });

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
  const j = jobIndex === null ? null : state.jobs[jobIndex];
  d.target = j ? { t: j.t, c: j.c } : null; saveDoc();
  $('#cvCard').hidden = true; $('#results').hidden = true; $('#studio').hidden = false;
  $('#stTarget').innerHTML = j ? `Hedef ilan: <b>${esc(j.t)}</b> — ${esc(j.c)} · <a href="${esc(j.u)}" target="_blank" rel="noopener noreferrer">ilanı aç ↗</a>` : 'İlan seçilmedi: genel ATS okunabilirliği değerlendiriliyor. Bir ilana göre düzenlemek için listeden “Bu ilana göre CV’ni düzenle”yi seç.';
  $('#stTpl').innerHTML = Object.entries(TEMPLATES).map(([k, t]) => `<option value="${k}" ${d.template === k ? 'selected' : ''} title="${esc(t.desc)}">${esc(t.label)}</option>`).join('');
  stEditor(); stPane(); window.scrollTo(0, 0);
}
function closeStudio() { $('#studio').hidden = true; $('#cvCard').hidden = false; if (state.ranked.length) render(); }
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
    card.querySelector('[data-s=lines]').addEventListener('input', (e) => { s.lines = e.target.value.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => l.replace(BUL, '• ')); changed(); });
    card.querySelectorAll('[data-mv]').forEach((b) => b.addEventListener('click', () => { const i = Number(card.dataset.i); const j = i + Number(b.dataset.mv); [d.sections[i], d.sections[j]] = [d.sections[j], d.sections[i]]; changed(true); }));
    card.querySelector('[data-rm]').addEventListener('click', () => { if (s.lines.length && !confirmInline(card)) return; d.sections.splice(Number(card.dataset.i), 1); changed(true); });
  });
  $('#stAdd').addEventListener('change', (e) => { if (e.target.value) { d.sections.push(newSection(d, e.target.value)); changed(true); } });
  $('#stReparse').addEventListener('click', (e) => { if (e.target.dataset.sure !== '1') { e.target.dataset.sure = '1'; e.target.textContent = 'Emin misin? Tekrar tıkla'; return; }
    const t = d.target; const tpl = d.template; state.doc = parseCv(state.cv); state.doc.target = t; state.doc.template = tpl; changed(true); });
}
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
  const j = st.job === null ? null : state.jobs[st.job];
  const a = analyzeAts(d, j, j ? state.index.docs[st.job].w : null);
  const li = (arr) => arr.map((x) => `<li class="${x.ok ? 'ok' : 'warn'}">${x.ok ? '✔' : '⚠'} ${esc(x.text)}</li>`).join('');
  el.innerHTML = `<div class="st-score"><div class="big"><b>${a.score}</b><span>/100</span></div><div><b>${esc(a.label)}</b><p class="muted st-small">${esc(a.disclaimer)}</p></div></div>
    ${a.breakdown.map((b) => `<div class="st-bar"><span>${esc(b.label)} <span class="muted">%${b.weight}</span></span><div class="track"><div class="fill" style="width:${b.value}%"></div></div><span class="n">${b.value}</span></div>`).join('')}
    ${a.has_job ? `<h3>İlanla örtüşen terimler (${a.matched.length})</h3><div class="kw">${a.matched.map((t) => `<span class="hit">${esc(t)}</span>`).join('') || '<span class="lbl">—</span>'}</div>
      <h3>İlanda öne çıkan, CV’nde olmayan terimler (${a.missing.length})</h3><p class="muted st-small">Yalnızca gerçekten yaptıklarını, ilgili deneyim maddesine ilanın kullandığı kelimeyle ekle.</p><div class="kw">${a.missing.map((t) => `<span class="miss">${esc(t)}</span>`).join('') || '<span class="lbl">—</span>'}</div>
      ${a.skills_only.length ? `<p class="st-small">Yalnızca beceri/araç listesinde geçenler: <b>${esc(a.skills_only.join(', '))}</b> — bir deneyim maddesinde nerede kullandığını göster.</p>` : ''}
      ${a.title && !a.title.ok ? `<p class="st-warn">İlan unvanı <b>${esc(a.title.job_title)}</b>; başlık satırında/özette şu rol sözcükleri yok: ${esc(a.title.words.filter((w) => !a.title.hit.includes(w)).join(', '))}. Bu rolü gerçekten yapıyorsan unvan satırını buna göre düzenle.</p>` : ''}` : ''}
    ${a.weak.length ? `<h3>Eylemle başlatılabilecek maddeler</h3><ul class="st-list">${a.weak.map((w) => `<li class="warn">⚠ ${esc(w)}</li>`).join('')}</ul>` : ''}
    <h3>Bölüm yapısı</h3><ul class="st-list">${li(a.structure)}</ul><h3>Okunabilirlik</h3><ul class="st-list">${li(a.readability)}</ul><h3>Biçim</h3><ul class="st-list">${li(a.formatting)}</ul>`;
}
document.querySelectorAll('.st-tabs .chip').forEach((c) => c.addEventListener('click', () => { st.tab = c.dataset.t; stPane(); }));
$('#stTpl').addEventListener('change', (e) => { state.doc.template = e.target.value; changed(); });
$('#stClose').addEventListener('click', closeStudio);
$('#openStudio').addEventListener('click', () => openStudio(null));
$('#jobs').addEventListener('click', (e) => { const b = e.target.closest('[data-edit]'); if (b) openStudio(Number(b.dataset.edit)); });
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
