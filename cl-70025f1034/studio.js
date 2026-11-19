// Career Lab Lite — CV Atölyesi (tarayıcıda ve Node testlerinde aynı kod çalışır; sunucu ve AI yoktur).
//  • parseCv: yüklenen CV metnini düzenlenebilir bölümlere ayırır (alan bağımsız: her meslekten CV).
//  • analyzeAts: CV'yi seçilen ilana göre kural tabanlı inceler. Gerçek ATS skoru DEĞİLDİR; içerik uydurmaz, yalnızca gösterir.
//  • renderCv: üç şablonla yazdırılabilir HTML üretir (PDF = tarayıcının “PDF olarak kaydet”i).
// Şablon CSS'i src/cv/templates.js ile aynı ATS kurallarını izler: başlıklarda geniş harf aralığı, saydamlık, konumlandırma yok
// (yoksa PDF'ten okunan metin “D E N E Y İ M” gibi bölünür veya sırası karışır).
import { tokens, fold } from './match.js';

/* ---------------- bölüm başlıkları ---------------- */
const HEADS = [
  ['summary', /^(summary|profile|professional summary|about( me)?|objective|career objective|ozet|profil|hakkimda|kariyer hedefi|ozgecmis ozeti)$/],
  ['experience', /^((work|professional|relevant)? ?experience|employment( history)?|work history|career history|deneyim(ler)?|is deneyimi|is deneyimleri|profesyonel deneyim|calisma deneyimi)$/],
  ['education', /^(education|academic background|egitim( bilgileri)?|ogrenim( durumu)?)$/],
  ['skills', /^((core|key|technical|professional)? ?skills|competencies|core competencies|expertise|(temel )?yetkinlikler|beceriler|yetenekler|teknik beceriler|uzmanlik alanlari)$/],
  ['projects', /^((selected|personal|key)? ?projects|portfolio|projeler|secili projeler|portfolyo)$/],
  ['training', /^(certifications?|certificates|licenses( & certifications)?|training( & certificates)?|courses|sertifikalar|kurslar|egitim programlari( ve sertifikalar)?|sertifika ve kurslar)$/],
  ['tools', /^(tools|software|technologies|tech stack|araclar|programlar|teknolojiler)$/],
  ['languages', /^(languages|diller|yabanci dil(ler)?)$/],
  ['awards', /^(awards|honou?rs|achievements|oduller|basarilar)$/],
  ['volunteer', /^(volunteer(ing)?( experience)?|gonullu(luk)?( calismalar)?)$/],
  ['interests', /^(interests|hobbies|ilgi alanlari|hobiler)$/],
  ['references', /^(references|referanslar)$/],
];
const TITLE = {
  en: { summary: 'Profile', experience: 'Experience', education: 'Education', skills: 'Skills', projects: 'Projects', training: 'Certifications', tools: 'Tools', languages: 'Languages', awards: 'Awards', volunteer: 'Volunteer Work', interests: 'Interests', references: 'References', other: 'Other' },
  tr: { summary: 'Profil', experience: 'Deneyim', education: 'Eğitim', skills: 'Yetkinlikler', projects: 'Projeler', training: 'Sertifikalar', tools: 'Araçlar', languages: 'Diller', awards: 'Ödüller', volunteer: 'Gönüllü Çalışmalar', interests: 'İlgi Alanları', references: 'Referanslar', other: 'Diğer' },
};
export const SECTION_KEYS = Object.keys(TITLE.en).filter((k) => k !== 'other');
const BULLET = /^\s*(?:[•·●▪■◦▸►➤*\-–—]|\d{1,2}[.)])\s+/;
const MONTH = '(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december|oca|sub|şub|mar|nis|may|haz|tem|agu|ağu|eyl|eki|kas|ara|ocak|subat|şubat|mart|nisan|mayis|mayıs|haziran|temmuz|agustos|ağustos|eylul|eylül|ekim|kasim|kasım|aralik|aralık)\\.?';
const DATE = `(?:${MONTH}\\s*\\d{4}|\\d{1,2}[./]\\d{4}|\\d{4})`;
const RANGE = new RegExp(`(${DATE})\\s*(?:[–—-]|to|until|\\/)\\s*(${DATE}|present|current|now|today|günümüz|gunumuz|halen|devam ediyor|hala)`, 'i');

export function headingOf(line) {
  const t = String(line).trim(); if (!t || t.length > 42 || BULLET.test(t)) return null;
  const f = fold(t).replace(/[:：]$/, '').replace(/[^a-z0-9& ]+/g, ' ').replace(/\s+/g, ' ').trim();
  for (const [k, re] of HEADS) if (re.test(f)) return k;
  // Esnek başlık: kısa, sayısız, noktalamasız ve TAMAMI BÜYÜK HARF (ör. “PRODUCT DESIGN EXPERIENCE”, “SKILLS & TOOLS”, “TRAINING & RECOGNITION”)
  const words = f.split(' ').filter(Boolean);
  if (words.length <= 5 && !/\d|@/.test(t) && !/[.,;!?]$/.test(t) && t === t.toLocaleUpperCase('tr-TR') && /[A-ZÇĞİÖŞÜ]{3}/.test(t)) {
    for (const [k, re] of FUZZY) if (re.test(f)) return k;
    return 'other';
  }
  return null;
}
const FUZZY = [
  ['experience', /\b(experience|employment|career|deneyim)/], ['skills', /\b(skill|capabilit|competenc|expertise|yetkinlik|beceri|uzmanlik)/], ['tools', /\b(tools?|software|technolog|arac)/],
  ['education', /\b(education|egitim|ogrenim)\b(?!.*program)/], ['training', /\b(training|certif|course|recognition|license|sertifika|kurs)/], ['projects', /\b(project|work|portfolio|proje|calismalar)/],
  ['summary', /\b(profile|summary|about|objective|ozet|profil)/], ['languages', /\b(language|dil)/], ['awards', /\b(award|honou?r|achievement|odul|basari)/], ['volunteer', /\b(volunteer|gonullu)/],
];
export const isEntryHead = (line) => RANGE.test(line) && !BULLET.test(line) && line.length <= 160;
export const detectLang = (text) => { const t = ` ${fold(text)} `; const tr = (String(text).match(/[ğüşıöçĞÜŞİÖÇ]/g) || []).length + 3 * (t.match(/ (ve|ile|icin|bir|olarak|deneyim|egitim) /g) || []).length; const en = 3 * (t.match(/ (the|and|with|for|of|experience|education) /g) || []).length; return tr > en ? 'tr' : 'en'; };

const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const PHONE = /\+?\d[\d ()-]{8,}\d/;
const URL = /\b(?:https?:\/\/)?(?:www\.)?(?:linkedin\.com\/in\/[\w-]+|github\.com\/[\w-]+|behance\.net\/[\w-]+|dribbble\.com\/[\w-]+|[a-z0-9-]+\.(?:com|net|org|io|dev|me|co|design|studio|art|app|tr|com\.tr)(?:\/[\w./-]*)?)/i;

/** Düz CV metni → düzenlenebilir belge. Hiçbir şey eklemez; yalnızca böler. */
export function parseCv(raw) {
  let lines0 = String(raw || '').replace(/\r/g, '').replace(/ /g, ' ').split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean);
  // Sayfa üst/altbilgisi: “AD SOYAD | UNVAN 2”, “Page 1 of 2” gibi her sayfada tekrar eden satırlar atılır
  const norm = (l) => l.replace(/\s*\d+\s*$/, '').replace(/\s+/g, ' ').toLowerCase();
  const seen = lines0.reduce((m, l) => m.set(norm(l), (m.get(norm(l)) || 0) + 1), new Map());
  lines0 = lines0.filter((l) => !/^(page|sayfa)\s*\d+(\s*(of|\/)\s*\d+)?$/i.test(l) && !(seen.get(norm(l)) > 1 && /\|/.test(l) && /\d\s*$/.test(l)));
  // PDF'te satır sonunda bölünmüş maddeleri birleştir (küçük harfle devam eden satır)
  const lines = [];
  for (const l of lines0) {
    const prev = lines[lines.length - 1];
    if (prev && !headingOf(l) && !headingOf(prev) && !BULLET.test(l) && !isEntryHead(l) && /^[a-zçğıöşü(,&]/.test(l) && !/[.!?:]$/.test(prev)) lines[lines.length - 1] = `${prev} ${l}`;
    else lines.push(l);
  }
  const lang = detectLang(lines.join(' '));
  const head = []; const sections = []; let cur = null;
  for (const l of lines) {
    let k = headingOf(l);
    if (k === 'other' && !sections.length) k = null; // ilk bölümden önceki BÜYÜK HARFLİ satır (ör. ad soyad) başlık değil, üst bilgidir
    if (k) { cur = { key: k, title: l.replace(/[:：]$/, '').trim(), visible: true, lines: [] }; sections.push(cur); continue; } // aynı türden iki bölüm (ör. iki deneyim bölümü) ayrı kalır
    if (!cur) head.push(l); else cur.lines.push(l.replace(BULLET, '• '));
  }
  // Word'ün otomatik madde listeleri metne “•” olarak geçmez: deneyim/proje bölümlerinde iş başlığı ve hemen altındaki şirket satırı
  // dışında kalan, cümle uzunluğundaki satırlar madde sayılır.
  const DATE_ONLY = new RegExp(`^\\(?${RANGE.source}\\)?$`, 'i');
  for (const s of sections.filter((x) => ['experience', 'projects', 'volunteer', 'education'].includes(x.key))) {
    // “Unvan | Şirket” + alt satırda yalnızca tarih → tek iş başlığı satırı
    const merged = [];
    for (const l of s.lines) { const prev = merged[merged.length - 1]; if (prev && DATE_ONLY.test(l) && !isEntryHead(prev) && prev.length <= 110) merged[merged.length - 1] = `${prev.replace(/^• /, '')}  ${l}`; else merged.push(l); }
    s.lines = merged;
  }
  for (const s of sections.filter((x) => ['experience', 'projects', 'volunteer'].includes(x.key))) {
    let afterHead = false;
    s.lines = s.lines.map((l) => {
      if (l.startsWith('• ')) { afterHead = false; return l; }
      if (isEntryHead(l)) { afterHead = !/\s[|—–]\s/.test(l.replace(RANGE, '')); return l; } // şirket aynı satırdaysa alt satır şirket değildir
      if (afterHead && l.length <= 90 && !/[.!?]$/.test(l)) { afterHead = false; return l; }
      afterHead = false;
      return l.split(/\s+/).length >= 6 ? `• ${l}` : l;
    });
  }
  // Başlık bölümü: ad, unvan satırı, iletişim
  const contacts = []; const rest = [];
  for (const l of head) {
    for (const part of l.split(/\s*[|•·]\s*|\s{3,}/).map((x) => x.trim()).filter(Boolean)) {
      let left = part; let found = false;
      for (const re of [EMAIL, PHONE, URL]) { const m = left.match(new RegExp(re.source, 'gi')) || []; for (const v of m) { if (!contacts.includes(v.trim())) contacts.push(v.trim()); left = left.replace(v, ' '); found = true; } }
      left = left.replace(/\s+/g, ' ').replace(/^[,;\s]+|[,;\s]+$/g, '').trim();
      if (!found) rest.push(part); else if (left.length > 2) rest.push(left);
    }
  }
  const name = rest.shift() || '';
  const loc = rest.find((x) => /,|türkiye|turkey|istanbul|ankara|izmir|remote/i.test(x) && x.split(/\s+/).length <= 6) || '';
  const headline = rest.find((x) => x !== loc && x.split(/\s+/).length <= 12) || '';
  const extra = rest.filter((x) => x !== loc && x !== headline);
  // Başlık bölümünde kalan uzun metin (bölüm başlığı olmayan özet) → Profil bölümü
  if (extra.length && !sections.some((s) => s.key === 'summary')) sections.unshift({ key: 'summary', title: TITLE[lang].summary, visible: true, lines: extra });
  return { v: 1, lang, template: 'ats_minimal', header: { name, headline, location: loc, contacts }, sections, target: null };
}

/* ---------------- ATS analizi ---------------- */
const WEAK = /^(responsible for|worked on|helped( to)?|assisted( with| in)?|involved in|participated in|tasked with|duties included|in charge of|sorumlu(ydum)?|gorev aldim|yardimci oldum|katildim|destek verdim)\b/;
// İlan metninde sık geçen ama beceri/iş anlatmayan sözcükler (anahtar kelime listesine girmez)
const NOISE = new Set(('senior junior mid lead intern internship need needs want wants seeking seek opportunity opportunities candidate candidates ideal ideally successful hire hiring apply ' +
  'offer offers benefits salary bonus remote hybrid office onsite full time part fulltime parttime contract permanent based location istanbul turkey turkiye europe emea global ' +
  'help make like love passion passionate enjoy please must should would will can also etc about across into within upon while whether day days week weeks month months ' +
  'aday adaylar ariyoruz arayan firsat firsati yan haklar maas ofis hibrit uzaktan tam zamanli yarim calisacak katilacak').split(/\s+/));
const DISCLAIMER ='Bu puan Career Lab’in kendi kural tabanlı tahminidir; gerçek ATS sistemlerinin verdiği resmi bir skor değildir. Gerçekte yapmadığın bir işi veya bilmediğin bir beceriyi CV’ye ekleme.';

export function plainText(doc) {
  const h = doc.header; const L = [h.name, h.headline, [h.location, ...h.contacts].filter(Boolean).join(' | '), ''];
  for (const s of doc.sections.filter((x) => x.visible !== false && x.lines.length)) L.push(s.title.toLocaleUpperCase(doc.lang === 'tr' ? 'tr-TR' : 'en-US'), ...s.lines, '');
  return L.join('\n').trim();
}

/**
 * @param doc CV belgesi · @param job {t,c,d,dep} veya null · @param jobWeights Map(terim→ağırlık) (TF-IDF, match.js dizininden)
 */
export function analyzeAts(doc, job = null, jobWeights = null) {
  const text = plainText(doc); const words = text.split(/\s+/).filter(Boolean).length;
  const vis = doc.sections.filter((s) => s.visible !== false && s.lines.length);
  const sec = (k) => vis.find((s) => s.key === k);
  const out = { disclaimer: DISCLAIMER, has_job: !!job, matched: [], missing: [], skills_only: [], title: null, structure: [], readability: [], formatting: [], weak: [], suggestions: [] };
  let kw = null;
  if (job) {
    const cvTok = new Set(tokens(text));
    const ctxTok = new Set(tokens(vis.filter((s) => !['skills', 'tools', 'languages'].includes(s.key)).flatMap((s) => s.lines).join('\n')));
    // İlanın en ayırt edici terimleri: TF-IDF ağırlığı en yüksek 25 terim (unvan ağırlıklı); yoksa sıklık
    let terms = jobWeights ? [...jobWeights.entries()].sort((a, b) => b[1] - a[1]) : [...tokens(`${job.t} ${job.t} ${job.t} ${job.d || ''}`).reduce((m, t) => m.set(t, (m.get(t) || 0) + 1), new Map()).entries()].sort((a, b) => b[1] - a[1]);
    terms = terms.filter(([t]) => t.length >= 3 && !/^\d/.test(t) && !NOISE.has(t)).slice(0, 25);
    const total = terms.reduce((s, [, w]) => s + w, 0) || 1; let got = 0;
    for (const [t, w] of terms) {
      if (cvTok.has(t)) { got += w; out.matched.push(t); if (!ctxTok.has(t)) out.skills_only.push(t); } else out.missing.push(t);
    }
    kw = Math.round((100 * got) / total);
    const roleWords = tokens(job.t).filter((w) => w.length >= 3 && !/^(senior|junior|mid|lead|intern|remote|hybrid|istanbul|turkey|turkiye|sr|jr|ii|iii)$/.test(w));
    const headTok = new Set(tokens(`${doc.header.headline} ${sec('summary')?.lines.join(' ') || ''}`));
    const hit = roleWords.filter((w) => headTok.has(w));
    out.title = { job_title: job.t, words: roleWords, hit, ok: roleWords.length ? hit.length / roleWords.length >= 0.5 : true };
  }
  // yapı
  let st = 100; const S = out.structure;
  for (const [k, label] of [['summary', 'Profil/Özet'], ['experience', 'Deneyim'], ['education', 'Eğitim'], ['skills', 'Yetkinlikler']]) { const ok = !!sec(k); S.push({ ok, text: `${label} bölümü ${ok ? 'var' : 'yok'}${ok ? '' : k === 'summary' ? ' — 2–3 cümlelik bir özet ekle' : ''}.` }); if (!ok) st -= k === 'summary' ? 10 : 20; }
  const mail = doc.header.contacts.some((c) => EMAIL.test(c)); const phone = doc.header.contacts.some((c) => PHONE.test(c));
  S.push({ ok: mail && phone, text: mail && phone ? 'E-posta ve telefon başlıkta düz metin olarak var.' : `Başlıkta ${!mail ? 'e-posta' : ''}${!mail && !phone ? ' ve ' : ''}${!phone ? 'telefon' : ''} yok.` }); if (!(mail && phone)) st -= 20;
  const exp = sec('experience');
  if (exp) { const heads = exp.lines.filter(isEntryHead).length; S.push({ ok: heads > 0, text: heads ? `Deneyimde ${heads} iş tarih aralığıyla yazılmış.` : 'Deneyim bölümünde tarih aralığı bulunamadı (ör. “Oca 2022 – Günümüz”) — ATS’ler süreyi tarihten hesaplar.' }); if (!heads) st -= 15; }
  const odd = vis.filter((s) => !s.key || s.key === 'other');
  if (odd.length) { S.push({ ok: false, text: `Standart olmayan bölüm başlığı: ${odd.map((s) => s.title).join(', ')} — ATS bu bölümü sınıflandıramayabilir.` }); st -= 10; }
  // okunabilirlik
  let rd = 100; const R = out.readability;
  const pages = Math.max(1, Math.ceil(words / 480));
  R.push({ ok: pages <= 2, text: `Tahmini ${pages} sayfa, ${words} kelime${pages > 2 ? ' — 2 sayfayı aşıyor, kısalt' : ''}.` }); if (pages > 2) rd -= 25;
  const bullets = vis.flatMap((s) => s.lines.filter((l) => l.startsWith('• ')).map((l) => l.slice(2)));
  const long = bullets.filter((b) => b.split(/\s+/).length > 34);
  R.push({ ok: !long.length, text: long.length ? `${long.length} madde 34 kelimeden uzun — ikiye böl veya sadeleştir.` : 'Maddeler okunabilir uzunlukta.' }); rd -= Math.min(20, long.length * 6);
  out.weak = bullets.filter((b) => WEAK.test(fold(b)));
  R.push({ ok: !out.weak.length, text: out.weak.length ? `${out.weak.length} madde “Responsible for / Sorumlu…” gibi görev anlatan bir ifadeyle başlıyor — yaptığın işi eylem fiiliyle başlat (ör. “Tasarladım…”, “Designed…”).` : 'Maddeler görev değil iş anlatıyor.' }); rd -= Math.min(15, out.weak.length * 5);
  if (exp && !exp.lines.some((l) => l.startsWith('• '))) { R.push({ ok: false, text: 'Deneyim bölümünde madde yok — her iş için 2–5 madde, satır başına “- ” yazarak.' }); rd -= 15; }
  const sw = sec('summary') ? sec('summary').lines.join(' ').split(/\s+/).length : 0;
  if (sw) { R.push({ ok: sw <= 90, text: sw > 90 ? `Özet ${sw} kelime — 40–70 kelimeye indir.` : `Özet ${sw} kelime.` }); if (sw > 90) rd -= 10; }
  // biçim
  let fm = 100; const F = out.formatting; const tplCols = doc.template === 'creative' ? 2 : 1;
  F.push({ ok: tplCols === 1, text: tplCols === 1 ? 'Tek sütunlu şablon — ATS için güvenli.' : 'İki sütunlu şablon: bazı ATS’ler sütunları karışık okuyabilir. Online başvuru formunda “ATS Minimal” seç.' }); if (tplCols > 1) fm -= 30;
  if (/[★☆✓✔➤►◆♦❖]/.test(text)) { F.push({ ok: false, text: 'Metinde özel simgeler var; bazı ATS’ler bozuk karakter olarak okur.' }); fm -= 15; } else F.push({ ok: true, text: 'Özel simge yok; metin gerçek metin olarak yazdırılır (görüntü değil).' });
  // öneriler
  if (out.missing.length) out.suggestions.push(`İlanda öne çıkan ama CV’nde geçmeyen terimler: ${out.missing.slice(0, 12).join(', ')}. Bunlardan GERÇEKTEN yaptıklarını, ilgili deneyim maddesine ilanın kullandığı kelimeyle yaz. Yapmadığını ekleme.`);
  if (out.skills_only.length) out.suggestions.push(`Şunlar yalnızca beceri/araç listesinde geçiyor: ${out.skills_only.join(', ')}. Bir deneyim maddesinde nerede kullandığını göstermek daha güçlüdür.`);
  if (out.title && !out.title.ok) out.suggestions.push(`İlan unvanı “${out.title.job_title}”. Başlık satırında/özette şu rol sözcükleri yok: ${out.title.words.filter((w) => !out.title.hit.includes(w)).join(', ')}. Bu rolü gerçekten yapıyorsan başlık satırını buna göre düzenle; eski iş unvanlarını değiştirme.`);
  const parts = job ? [['Anahtar kelime örtüşmesi', kw, 45], ['Bölüm yapısı', Math.max(0, st), 25], ['Okunabilirlik', Math.max(0, rd), 20], ['Biçim', Math.max(0, fm), 10]]
    : [['Bölüm yapısı', Math.max(0, st), 45], ['Okunabilirlik', Math.max(0, rd), 35], ['Biçim', Math.max(0, fm), 20]];
  out.score = Math.round(parts.reduce((s, [, v, w]) => s + v * w, 0) / 100);
  out.breakdown = parts.map(([label, value, weight]) => ({ label, value, weight }));
  out.label = job ? 'İlan–CV uyumluluk tahmini' : 'Genel ATS okunabilirlik tahmini (ilan seçilmedi)';
  out.pages = pages; out.words = words;
  return out;
}

/* ---------------- şablonlar ---------------- */
export const TEMPLATES = {
  ats_minimal: { label: 'ATS Minimal', desc: 'Tek sütun, siyah-beyaz. Online başvuru formları için en güvenli.' },
  modern: { label: 'Modern', desc: 'Tek sütun, renkli başlık bandı. E-posta ve ATS için uygun.' },
  creative: { label: 'Creative', desc: 'Sol kenar çubuklu, iki sütun. E-posta/doğrudan paylaşım için; ATS’de riskli.' },
};
const BASE = `*{box-sizing:border-box}html,body{margin:0;padding:0}body{color:#1d232a;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-kerning:normal}
a{color:inherit;text-decoration:none}h1,h2,p,ul{margin:0;padding:0}ul{list-style:none}
.b li{padding-left:11pt;text-indent:-11pt;margin-top:1.8pt}.b li:before{content:"•\\a0 ";display:inline-block;width:11pt;text-indent:0}
.et{display:flex;justify-content:space-between;align-items:baseline;gap:12pt;margin-top:7pt}.et:first-child{margin-top:0}.ed{white-space:nowrap;flex:none}.rt{font-weight:700}
.co{font-weight:600}.sep{color:#8a929b;white-space:pre}.sec{break-inside:auto}h2{break-after:avoid}.et{break-after:avoid}
.page{width:210mm;margin:0 auto;background:#fff}p+p{margin-top:2pt}
@page{size:A4;margin:12mm 0}@media screen{body{background:#e9ebee}.page{min-height:297mm;box-shadow:0 2px 14px rgba(0,0,0,.14);margin:14px auto;padding-top:12mm;padding-bottom:12mm}}`;
const CSS = {
  ats_minimal: `body{font:10.3pt/1.4 Calibri,Carlito,Arial,Helvetica,sans-serif}.page{padding-left:18mm;padding-right:18mm}
h1{font-size:21pt;font-weight:700;letter-spacing:.3pt;line-height:1.1}.hl{font-size:11.2pt;margin-top:2pt}.ct{margin-top:4pt;color:#333;font-size:9.6pt}
h2{font-size:10.4pt;font-weight:700;text-transform:uppercase;letter-spacing:.3pt;border-bottom:.8pt solid #1d232a;padding-bottom:1.5pt;margin:11pt 0 5pt}.ed{color:#333}.sk{line-height:1.55}`,
  modern: `body{font:10.1pt/1.45 "Segoe UI",Calibri,Arial,sans-serif}@page:first{margin-top:0}@media screen{.page{padding-top:0}}
.top{background:#12343b;color:#fff;padding:12mm 18mm 8.5mm}.top h1{font-size:24pt;font-weight:600;letter-spacing:.2pt;line-height:1.1}.hl{font-size:11.4pt;margin-top:3pt;color:#9fd8c9;font-weight:500}.ct{margin-top:6pt;font-size:9.2pt;color:#e6f2ef}.ct .sep{color:#7fa9a0}
.body{padding:1mm 18mm 0}h2{font-size:10.2pt;font-weight:700;color:#0b6b5c;text-transform:uppercase;letter-spacing:.3pt;margin:12pt 0 5.5pt;padding-bottom:2.5pt;border-bottom:.8pt solid #d3e6e1}
h2:before{content:"";display:inline-block;width:7pt;height:7pt;background:#0b6b5c;border-radius:1.5pt;margin-right:6pt;vertical-align:.5pt}
.rt{font-weight:600;color:#12343b}.ed{color:#56616e;font-size:9.3pt}.co{color:#0b6b5c;font-size:9.8pt}.b li:before{color:#0b6b5c}
.sk span{display:inline-block;background:#eef6f4;border:.6pt solid #cfe5df;border-radius:9pt;padding:.8pt 7pt;margin:0 3.5pt 3.5pt 0;font-size:9.1pt;color:#12343b}.sk .sep{font-style:normal;color:transparent;font-size:.5pt;letter-spacing:0}`,
  creative: `body{font:9.8pt/1.45 "Segoe UI",Calibri,Arial,sans-serif}.page{display:grid;grid-template-columns:64mm 1fr;background:linear-gradient(to right,#22313f 0,#22313f 64mm,#fff 64mm)}
@media print{html{background:linear-gradient(to right,#22313f 0,#22313f 64mm,#fff 64mm)}.page{background:none}}
.side{color:#e8edf1;padding:0 8mm 0 11mm}.side h1{font-size:22pt;line-height:1.08;font-weight:700;color:#fff;letter-spacing:.2pt}.hl{font-size:10.2pt;margin-top:6pt;color:#f3c98b;font-weight:500;line-height:1.3}
.side h2{font-size:8.8pt;text-transform:uppercase;letter-spacing:.3pt;color:#f3c98b;margin:15pt 0 5pt;padding-bottom:3pt;border-bottom:.6pt solid #4a5866}
.side p,.side li{font-size:9pt;margin-top:2.6pt;word-break:break-word;line-height:1.35}.side .b li:before{color:#f3c98b}
.main{padding:0 13mm 0 10mm}.main h2{font-size:10.2pt;text-transform:uppercase;letter-spacing:.3pt;color:#22313f;margin:0 0 5.5pt;padding-bottom:2.5pt;border-bottom:1.4pt solid #f3c98b}.main h2:not(:first-child){margin-top:12pt}
.rt{color:#22313f}.ed{color:#5b6570;font-size:9pt}.co{color:#a8701f;font-size:9.6pt}.b li:before{color:#c98a2b}`,
};
const e = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const LIST_SECS = new Set(['skills', 'tools', 'languages', 'interests']);

/** Bölüm satırlarını HTML'e çevirir: “• ” madde, tarih aralıklı satır = iş başlığı (tarih sağda), hemen altındaki kısa satır = şirket. */
function linesHtml(s, narrow = false) {
  if (LIST_SECS.has(s.key) && !s.lines.some((l) => l.startsWith('• '))) {
    const items = s.lines.flatMap((l) => l.split(/\s*[,;·|]\s*/)).map((x) => x.trim()).filter(Boolean);
    if (narrow) return `<ul class="b">${items.map((i) => `<li>${e(i)}</li>`).join('')}</ul>`;
    return `<p class="sk">${items.map((i) => `<span>${e(i)}</span>`).join('<i class="sep"> · </i>')}</p>`;
  }
  const out = []; let ul = []; let afterHead = false;
  const flush = () => { if (ul.length) { out.push(`<ul class="b">${ul.map((x) => `<li>${e(x)}</li>`).join('')}</ul>`); ul = []; } };
  for (const l of s.lines) {
    if (l.startsWith('• ')) { ul.push(l.slice(2)); afterHead = false; continue; }
    flush();
    const m = l.match(RANGE);
    if (m && !narrow && l.length <= 160) {
      const left = l.replace(m[0], '').replace(/[\s,|–—()-]+$/g, '').replace(/^[\s,|–—()-]+/g, '').trim();
      // “Unvan | Şirket” veya “Unvan — Şirket”: unvan kalın, şirket alt satırda
      const [role, ...co] = left.split(/\s+[|]\s+|\s+[—–]\s+/);
      out.push(`<div class="et"><span class="rt">${e(role || m[0])}</span>${left ? `<span class="ed">&nbsp;${e(m[0])}</span>` : ''}</div>${co.length ? `<div class="co">${e(co.join(' · '))}</div>` : ''}`); afterHead = !co.length; continue;
    }
    if (afterHead && l.length <= 90 && !/[.!?]$/.test(l)) { out.push(`<div class="co">${e(l)}</div>`); afterHead = false; continue; }
    afterHead = false; out.push(`<p>${e(l)}</p>`);
  }
  flush(); return out.join('');
}
const secHtml = (s, narrow = false) => `<div class="sec"><h2>${e(s.title)}</h2>${linesHtml(s, narrow)}</div>`;

export function renderCv(doc, template = doc.template || 'ats_minimal') {
  const t = CSS[template] ? template : 'ats_minimal'; const h = doc.header;
  const vis = doc.sections.filter((s) => s.visible !== false && s.lines.length);
  const ct = [h.location, ...h.contacts].filter(Boolean).map(e);
  let body;
  if (t === 'creative') {
    const sideKeys = ['skills', 'tools', 'languages', 'interests'];
    body = `<div class="page"><aside class="side"><h1>${e(h.name)}</h1>${h.headline ? `<div class="hl">${e(h.headline)}</div>` : ''}<h2>${doc.lang === 'tr' ? 'İletişim' : 'Contact'}</h2>${ct.map((c) => `<p>${c}</p>`).join('')}${vis.filter((s) => sideKeys.includes(s.key)).map((s) => secHtml(s, true)).join('')}</aside>
      <div class="main">${vis.filter((s) => !sideKeys.includes(s.key)).map((s) => secHtml(s)).join('')}</div></div>`;
  } else {
    const head = `<h1>${e(h.name)}</h1>${h.headline ? `<div class="hl">${e(h.headline)}</div>` : ''}<div class="ct">${ct.join('<span class="sep">  |  </span>')}</div>`;
    const secs = vis.map((s) => secHtml(s)).join('');
    body = t === 'modern' ? `<div class="page"><div class="top">${head}</div><div class="body">${secs}</div></div>` : `<div class="page">${head}${secs}</div>`;
  }
  const sepCss = t === 'modern' ? '' : '.sk span{display:inline}.sk .sep{font-style:normal}';
  return `<!doctype html><html lang="${e(doc.lang)}"><head><meta charset="utf-8"><title>${e(fileName(doc))}</title><style>${BASE}${CSS[t]}${sepCss}</style></head><body>${body}</body></html>`;
}

/** “Ad_Soyad_Sirket_Rol” — tarayıcı PDF kaydederken bu adı önerir. */
export function fileName(doc) {
  const clean = (s) => fold(s).replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('_');
  return [clean(doc.header.name) || 'CV', doc.target && clean(doc.target.c), doc.target && clean(doc.target.t), !doc.target && 'CV'].filter(Boolean).join('_').slice(0, 100);
}

/** Yeni boş bölüm (kullanıcı ekler). */
export function newSection(doc, key) { return { key, title: (TITLE[doc.lang] || TITLE.en)[key] || key, visible: true, lines: [] }; }
