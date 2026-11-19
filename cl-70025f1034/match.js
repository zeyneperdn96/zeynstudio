// Career Lab Lite — eşleştirme (tarayıcıda ve Node testlerinde aynı kod çalışır).
// Alan bağımsızdır: CV metnindeki kelimelerle ilan metinlerinin örtüşmesine bakar (TF-IDF + kosinüs benzerliği).
// Bu bir işe alınma tahmini DEĞİLDİR; yalnızca "CV'ndeki kelimeler bu ilanda ne kadar geçiyor" ölçüsüdür.

export const fold = (s) => String(s || '').toLowerCase().replace(/ı/g, 'i').replace(/İ/g, 'i').normalize('NFD').replace(/[̀-ͯ]/g, '');

const STOP = new Set(('a an the and or of to in for with on at by from as is are be been was were will would can could should may might must have has had do does did not no yes this that these those it its their our your you we they he she them us i me my ' +
  'who what which when where why how all any each every more most other some such only own same so than too very also into over under about across after before between during through up down out off per via within without ' +
  'job role team work working experience experienced years year strong good great excellent ability able skills skill knowledge using use used including include etc new high level well looking join company position responsibilities requirements qualifications preferred plus nice required ' +
  've bir bu su o da de ki ile icin gibi veya ya en cok daha her olan olarak ise mi mu ama fakat ancak yani hem ne kadar sonra once uzere gore tum bazi diger biz siz onlar ben sen ' +
  'deneyim deneyimi tecrube yil yillik is pozisyon ekip takim calisma calisan sirket aranan nitelikler tanimi sahip iyi guclu bilgi bilgisi beceri becerileri yetkin tercihen sebebi').split(/\s+/));

/** Metni anlamlı kelimelere böler. "c++", "c#", "node.js", "ci/cd" gibi teknik terimler korunur. */
export function tokens(text) {
  const out = [];
  for (const raw of fold(text).split(/[^a-z0-9+#./-]+/)) {
    const t = raw.replace(/^[./-]+|[./-]+$/g, '');
    if (t.length < 2 || t.length > 30 || STOP.has(t) || /^\d+([./-]\d+)*$/.test(t)) continue;
    out.push(t);
    if (/[./-]/.test(t)) for (const p of t.split(/[./-]/)) if (p.length >= 3 && !STOP.has(p) && !/^\d+$/.test(p)) out.push(p);
  }
  return out;
}

const counts = (arr) => { const m = new Map(); for (const t of arr) m.set(t, (m.get(t) || 0) + 1); return m; };

/** İlan listesi için arama dizini. jobs: [{t: unvan, d: metin, c, l, u, r …}] */
export function buildIndex(jobs) {
  const df = new Map(); const docs = [];
  for (const j of jobs) {
    const title = tokens(j.t); const body = tokens(`${j.dep || ''} ${j.d || ''}`);
    const tf = counts(body); for (const t of title) tf.set(t, (tf.get(t) || 0) + 3); // unvandaki kelime üç kat sayılır
    for (const t of tf.keys()) df.set(t, (df.get(t) || 0) + 1);
    docs.push({ tf, title: new Set(title) });
  }
  const N = jobs.length || 1; const idf = new Map();
  for (const [t, n] of df) idf.set(t, Math.log(1 + N / n));
  for (const d of docs) { let s = 0; d.w = new Map(); for (const [t, c] of d.tf) { const w = (1 + Math.log(c)) * idf.get(t); d.w.set(t, w); s += w * w; } d.norm = Math.sqrt(s) || 1; delete d.tf; }
  return { docs, idf, N };
}

/**
 * CV metnini tüm ilanlarla karşılaştırır.
 * @param roles kullanıcının yazdığı hedef unvanlar (isteğe bağlı) — unvanı bunlara benzeyen ilanlar öne çıkar
 * @returns [{i, score (0–1 ham), pct (en iyi eşleşmeye göre 0–100), terms: örtüşen kelimeler, role: hedef role uyuyor mu}] puana göre sıralı
 */
export function scoreCv(index, cvText, roles = []) {
  const cvTf = counts(tokens(cvText)); const cv = new Map(); let s = 0;
  for (const [t, c] of cvTf) { const idf = index.idf.get(t); if (!idf) continue; const w = (1 + Math.log(c)) * idf; cv.set(t, w); s += w * w; }
  const cvNorm = Math.sqrt(s) || 1;
  const roleSets = roles.map((r) => new Set(tokens(r))).filter((x) => x.size);
  const out = [];
  index.docs.forEach((d, i) => {
    let dot = 0; const hits = [];
    for (const [t, w] of cv) { const dw = d.w.get(t); if (dw) { dot += w * dw; hits.push([t, w * dw]); } }
    let role = 0;
    for (const rs of roleSets) { let n = 0; for (const t of rs) if (d.title.has(t)) n++; role = Math.max(role, n / rs.size); }
    if (hits.length < 3 && role < 1) return; // en az üç ortak kelime yoksa "eşleşme" denmez
    let score = dot / (cvNorm * d.norm);
    // Kullanıcı bu rolü açıkça istedi: unvanı tam uyan ilanlar öne alınır, kendi aralarında CV örtüşmesine göre sıralanır.
    if (role >= 1) score = score * 1.3 + 0.3; else if (role >= 0.5) score *= 1.25;
    if (score <= 0) return;
    hits.sort((a, b) => b[1] - a[1]);
    out.push({ i, score, terms: hits.slice(0, 7).map((h) => h[0]), shared: hits.length, role: role >= 1 });
  });
  out.sort((a, b) => b.score - a.score);
  const max = out.length ? out[0].score : 1;
  for (const o of out) o.pct = Math.max(1, Math.round((100 * o.score) / max));
  return out;
}
