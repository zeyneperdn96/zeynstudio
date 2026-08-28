# ARCHIVE GALLERY — Proje Dosyası

`Archive.exe` · Ağustos 2026 · Game UI / Motion

ZEYNEP.EXE kart setinin 3B kart galerisi. XP masaüstünde bir pencere olarak
açılıyor. Referans: Zeynep'in gönderdiği kart hareketi videosu.

> ⚠️ **Tarayıcıda henüz test edilmedi.** 27 Ağustos akşamı yazıldı, Zeynep ertesi
> gün bakacak. Ölçülebilen her şey doğrulandı (aşağıda §7) ama gerçek bir
> tarayıcıda gözle görülmedi. İlk açışta bakılacaklar §8'de.

---

## 1. Nereye bağlandı

Standalone sayfa **değil**, XP penceresi. Masaüstünde `Archive.exe` ikonu →
çift tık → `WindowManager.openWindow('archive')`.

Böylece başlık çubuğu, minimize/maximize/close, taskbar girişi, sürükleme ve
odak yönetimi mevcut sistemden geliyor; XP dili hiç bozulmuyor. Sahne
`.window-content` içinde `padding:0` ile tam alanı kaplıyor ve pencere
büyütülüp küçültülünce `ResizeObserver` ile kendini yeniden ölçüyor.

| Dosya | Rol |
|---|---|
| `js/ArchiveData.js` | Kart dizisi. Yeni kart = tek satır. |
| `js/ArchiveGallery.js` | Motor. `ArchiveGallery` sınıfı, `destroy()` ile temiz kapanış. |
| `css/archive-gallery.css` | Sahne, kart, iz, XP HUD, detay görünümü. |
| `js/WindowTemplates.js` | `archive` şablonu (sadece eklendi). |
| `js/WindowManager.js` | Pencere boyutu, `initializeArchiveWindow`, cleanup (sadece eklendi). |
| `index.html` | GSAP CDN, css/js etiketleri, masaüstü ikonu (sadece eklendi). |
| `assets/icons/icon-archive.svg` | Masaüstü ikonu. Sitenin ikon sistemiyle aynı dil: 32×32 viewBox, gradient, şeffaf. |

Mevcut hiçbir pencere veya davranış değiştirilmedi.

---

## 2. Mimari — neden tek koreografi gibi görünüyor

Asıl mesele buydu: dalga sürerken hover başlarsa, ikisi de `transform` yazmak
ister ve biri diğerini ezer. Çözüm, her kartın **üç ayrı sayı seti** taşıması:

| Kanal | Ne tutar | Kimler tween'ler |
|---|---|---|
| `base` | Kartın ray üzerindeki yeri | intro, gezinme, gruplanma |
| `fx` | Eklenen fark | dalga, hover, tıklama, sürükleme |
| `idle` | Nefes alma | idle döngüsü |

Tek bir GSAP ticker her karede üçünü toplayıp **tek** `transform` yazıyor:

```
translate3d(base+fx+idle) rotateX() rotateY() rotateZ() scale()
```

Böylece animasyonlar birbirini ezmiyor, üst üste biniyor. Yazılan tek şey
`transform` ve `opacity`; animasyon sırasında layout tetikleyen hiçbir özellik
kullanılmıyor.

---

## 3. INTRO STATE vs BROWSE STATE

İki ayrı pozisyon sistemi. Intro `railFor()`'u **sadece son adımda** çağırıyor;
ondan öncesi tamamen formasyon mantığı. Carousel = browse state, intro
tarafından hiç kullanılmıyor.

```
setIntroStackState()
  -> stackArrival()
  -> createVisibleTrails()          klonlar görünür ve EKRANDA KALIR
  -> splitCardsIntoThreeGroups()
  -> runWaveAcrossGroups()
  -> removeTrailClones()
  -> transitionRealCardsToCarousel()   <- railFor() ilk ve tek kez burada
  -> enableCarousel()
```

| Faz | Süre (sn) | Ne oluyor |
|---|---|---|
| 0 | 0.00 – 0.69 | **Tek sıkışık deste.** `z:-1200`, `scale ≈ .05` (sahne yüksekliğinin %50'sinin 0.11'i), jitter %16'ya kısıldı — gerçekten tek kart gibi görünüyor. `opacity 0→1`. |
| 1 | 0.80 – 1.67 | **stackArrival.** `z:-1200→-60`, deste **sahne yüksekliğinin ~%50'sine** kadar büyüyor. Hâlâ tek gövde. |
| 2 | 1.70 – 2.90 | **createVisibleTrails.** 5 hero kart desteden kopuyor, her biri **7 kalıcı klon** bırakıyor. Klonlar sönmüyor — 4.90'a kadar ekranda kalıyor. |
| 3 | 2.90 – 3.84 | **splitCardsIntoThreeGroups.** 3 grup, farklı `z` (`-170 / +90 / -50`), grup içi merdiven dizilim. |
| 4 | 3.90 – 4.97 | **runWaveAcrossGroups.** Soldan sağa: `y-55, z+150, rotateY 9°, scale 1.06`. |
| 5 | 4.90 – 5.35 | **removeTrailClones.** Bütün klonlar sönüp DOM'dan siliniyor. |
| 6 | 5.40 – 6.63 | **transitionRealCardsToCarousel.** Ortadaki kart önce, sonra dışa doğru. |

**Toplam 6.63 sn.**

### Ekran yoğunluğu

| | Gerçek kart | Klon | Toplam görüntü |
|---|---|---|---|
| Desktop | 20 | 35 (5 hero × 7) | **55** |
| Tablet | 20 | 24 (4 × 6) | 44 |
| Mobil | 20 | 12 (3 × 4) | 32 |

Klonlar **1.70 – 4.90 arası, 3.2 saniye boyunca** ekranda duruyor. Bütçe:
desktop 44, tablet 30, mobil 14 — aşılırsa yeni klon üretilmiyor.

Opacity merdiveni yükseltildi, arkadakiler gerçekten görünsün diye:
`.95 / .82 / .68 / .52 / .38 / .25 / .15 / .10`

Klonlar DOM'a eklenmeden **önce** transform'ları yazılıyor; yoksa ilk karede
ray merkezinde belirip sıçrıyorlardı.

### Boyut

Intro boyutları raydan değil **sahne yüksekliğinden** türetiliyor:
deste %50, hero kartlar %62, gruplar %42. Pencere büyüdükçe kartlar da büyüyor.
Final carousel kendi boyutuna geri dönüyor.

### Intro neden atlanabilir — artık sessiz değil

İki durumda intro çalışmaz ve **ikisi de artık ekranda yazıyor**
(sol üstte `INTRO SKIPPED — <neden>`):

- **GSAP yok.** Bu yüzden GSAP artık CDN'den değil, `js/vendor/gsap.min.js`
  üzerinden yerel olarak yükleniyor. CDN engellenirse diye tek nokta bırakılmadı.
- **Sistemde "reduce motion" açık.** Bu durumda Replay butonu intro'yu yine de
  oynatıyor (açık kullanıcı isteği olduğu için).

## 4. Etkileşim

- **Mouse parallax** — sadece ortam döner (`rotateY ±2°`, `rotateX ±1°`).
  Kartlar mouse'u takip etmez; ortam kayar.
- **Hover** — `z+100, y−15, scale 1.08`, `rotateY` sıfırlanır (kart kameraya
  döner), komşular ∓12px açılır, glow ve gölge artar, kısa iz bırakır.
- **Tıklama** — odak dışıysa o karta odaklanır. Odaktaysa: seçili kart
  `z:250, scale:1.12`, diğerleri `z:−100, opacity .45`, 600 ms sonra XP
  çerçeveli detay penceresi **orijinal PNG'yi** açar.
- **Gezinme** — sürükle/kaydır, tekerlek, ← →, Home/End, HUD butonları.
  Her geçişte yakın kartlar kısa iz bırakır.
- **Idle** — 4–8 sn döngü, ±4px float + hafif derinlik ve rotasyon. Ayrı
  kanalda olduğu için hover'ı bozmaz.

**Klavye sadece Archive penceresi aktifken çalışır** — XP kabuğu odaksız
pencerenin başlık çubuğuna `.inactive` ekliyor, motor ona bakıyor. Başka
pencerede yazarken ok tuşları çalınmıyor. Input/textarea içindeyken de susuyor.

---

## 5. Görseller

**Hiçbir PNG değiştirilmedi, kırpılmadı, yeniden üretilmedi.**

- **Kart oranı görselden geliyor.** Sette iki oran var (2:3 ve 3:4); kart
  yüksekliği `naturalHeight / naturalWidth` ile kart başına ayarlanıyor.
  Sabit orana zorlanmadığı için hiçbir görsel kırpılmıyor.
- **Ray'de 600px kopyalar, detayda orijinal PNG.** 20 PNG toplam 42 MB;
  hepsini raya koymak pencere açılır açılmaz 42 MB indirmek demek. Sanata
  dokunulmuyor, sadece çözünürlük. Saf PNG istenirse `js/ArchiveData.js`:

  ```js
  const ARCHIVE_RAIL_SOURCE = 'image';   // 'preview' yerine
  ```

- Görseller **odaktan dışa doğru** sırayla yükleniyor; görünmeyen kartlar
  beklemiyor.

### Yeni kart eklemek

1. PNG'yi `assets/projects/zeynep-archive/full/` içine koy
2. 600px kopyayı `thumbs/` içine koy
   (`sips -Z 600 -s format jpeg -s formatOptions 82 girdi.png --out thumbs/file-021.jpg`)
3. `js/ArchiveData.js`'e tek satır ekle

Galeri kart sayısını kendi okur; ölçü, yerleşim, stagger ve gruplama otomatik
ayarlanır. Başka hiçbir yere dokunmak gerekmez.

---

## 6. Responsive ve erişilebilirlik

| | Kart eni | Derinlik | Görünen | İz sayısı |
|---|---|---|---|---|
| Desktop (≥1024) | 230 | 132 | 5.5 | 4 |
| Tablet (640–1024) | 188 | 88 | 4.5 | 2 |
| Mobil (<640) | 148 | 54 | 3.5 | **0** |

Kart eni ayrıca pencere yüksekliğine göre de kısılıyor, böylece küçük pencerede
odak kartı taşmıyor.

- **`prefers-reduced-motion: reduce`** → sinematik intro yok, kartlar doğrudan
  yerine konur, iz ve idle kapalı, hover/tıklama çalışır.
- **GSAP yüklenmezse** aynı yola girer: statik ama tam çalışan galeri.
  CDN'e bağımlılık kırılgan bir yer, bilinçli olarak yumuşak düşüş yazıldı.

---

## 7. Ne doğrulandı

Tarayıcı aracı yok, o yüzden ölçülebilen ölçüldü:

- **Ray geometrisi — 18 kontrol.** Spec aralıkları (`rotateY ±5–12`,
  `translateZ −40/−100`, `scale .82–.92`), üç tier'da −8…+8 arası her offset'te
  geçerli ve sonlu değer, sol/sağ simetri, dışa doğru aralık sıkışması,
  odak kartının komşusunun önünde olması, görüş dışında opacity 0.
- **Statik tutarlılık.** 27 prototip metodunun hepsi tanımlı, 11 seçicinin
  hepsi üretilen markup'ta var, JS'in eklediği her sınıfın CSS karşılığı var.
- **Kaynaklar.** 20 full PNG + 20 preview diskte; index.html'den referans
  verilen her dosya ve GSAP CDN yerel sunucuda HTTP 200.
- **Regresyon.** `WindowTemplates.js` ve `WindowManager.js` parse ediliyor,
  17 pencere şablonu yerinde.

---

## 8. İlk açışta bakılacaklar

Tarayıcıda ilk kez açılırken sırayla:

1. Intro gerçekten uzaktan mı geliyor, yoksa kartlar hazır mı beliriyor
   (GSAP yüklendi mi — konsolda `gsap` yaz)
2. İz klonları görünüyor mu, sayısı fazla/az mı
3. Yelpaze açılırken kartlar birbirinin üzerinden geçiyor mu
4. Dalga zamanlaması — çok hızlı/yavaş mı
5. Gruplanma fark ediliyor mu yoksa kaçıyor mu
6. Pencere maximize edilince sahne düzgün ölçekleniyor mu
7. Hover'da komşuların açılması yeterli mi
8. Detay penceresinde orijinal PNG tam görünüyor mu (büyük dosya, gecikebilir)

Ayar noktaları: süreler `intro()` içinde, mesafe/açı `TIERS`, iz yoğunluğu
`TIERS[*].trails` ve `TRAIL_FADE`.

---

## 9. Kalanlar

- ⬜ Tarayıcı testi ve zamanlama ayarı
- ⬜ Mobilde gerçek cihazda performans kontrolü
- ⬜ Detay görünümü şu an sadece PNG gösteriyor; ileride kart başına gerçek
  içerik (galeri, yazı, playlist) bağlanabilir — `ARCHIVE_CARDS` satırına
  alan eklemek yeterli
- ⬜ Case study metni
