// Career Lab Lite — tamamen tarayıcıda çalışır. Sunucu yoktur.
//  • Giriş: e-posta + parola → PBKDF2 ile anahtar türetilir → şifreli ilan verisinin anahtarı açılır. Yanlış bilgiyle veri çözülemez.
//  • CV: dosya tarayıcıda okunur; hiçbir yere gönderilmez. İstersen bu tarayıcıda saklanır (localStorage), istersen silinir.
import { buildIndex, scoreCv } from './match.js';

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
    if (!ck) throw new Error('E-posta veya parola hatalı.');
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
$('#clearCv').addEventListener('click', () => { localStorage.removeItem('cl_cv'); localStorage.removeItem('cl_roles'); state.cv = ''; state.ranked = []; $('#roles').value = ''; $('#prefs').hidden = true; $('#results').hidden = true; status('CV’n bu tarayıcıdan silindi.'); });
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
      <a class="go" href="${esc(j.u)}" target="_blank" rel="noopener noreferrer">İlana git ↗</a></li>`; }).join('');
  $('#more').hidden = rows.length <= state.shown;
}
$('#more').addEventListener('click', () => { state.shown += 40; render(); });
$('#regionChips').addEventListener('click', (e) => { const c = e.target.closest('.chip'); if (!c) return; c.classList.toggle('on'); c.setAttribute('aria-pressed', c.classList.contains('on')); state.shown = 40; render(); });
$('#search').addEventListener('input', () => { state.shown = 40; render(); });

/* ---------------- açılış: bu sekmede oturum varsa devam et ---------------- */
const k = sessionStorage.getItem('cl_k');
if (k) enter(b64(k)).catch(() => { sessionStorage.removeItem('cl_k'); });
