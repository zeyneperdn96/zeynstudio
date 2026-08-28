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

## 3. Koreografi

| # | Aşama | Ne oluyor |
|---|---|---|
| 1 | **Uzak deste** | `z:-1000, scale:.15, rotateX:8, opacity:0`. Her karta deterministik jitter (x/y/z/rotateY) — arkada birden çok kart olduğu hissediliyor, ama her açılışta aynı. |
| 2 | **Derinlikten geliş** | 1.25 sn, `power3.out`, 0.045 sn stagger. Sıralama jitter'ın z'sine göre: **arkadaki kartlar daha geç** kalkıyor. |
| 3 | **İz** | Geçici DOM klonları. 34→80px aralık, x/y/z birlikte kaydığı için yol diyagonal. Opacity `.8 / .55 / .3 / .12 / .06`. Ana kartın konumuna doğru kapanıp siliniyor. |
| 4 | **Yelpaze** | Merkezden kenarlara, 0.045 sn stagger. Her kart önce **yerinin ötesine** taşıyor (`z+130`, `rotateY×1.7`, `scale×1.04`), sonra `power3.out` ile oturuyor — üst üste binme ve birbirinin arkasından geçme buradan geliyor. |
| 5 | **Dalga** | Soldan sağa. `y:-35 · z:+100 · rotateY:7 · scale:1.04`, gidiş `.34` dönüş `.42`, `sine.inOut`, 0.042 sn kaydırma. |
| 6 | **Gruplanma** | 4'erli gruplar sırayla: topla (her kart bir öncekinin arkasına basamaklanır) → beraber kay → aç → yerine otur. Gruplar 0.3 sn arayla, soldan sağa. |
| 7 | **Final** | Kavisli ray. Odak `scale 1, z+40`. Kenarlar `scale .72–.93`, `z −40…−160`, `rotateY ±5–13`. Aralık dışa doğru sıkışıyor (`pow(a-1, .78)`) — kaçış noktası hissi. |

Toplam ~6 sn. HUD'daki **Replay** ile tekrar izlenebiliyor.

---

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
