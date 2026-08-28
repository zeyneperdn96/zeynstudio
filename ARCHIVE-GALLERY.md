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

İki ayrı pozisyon sistemi. Intro `railFor()`'u **sadece son beatte** çağırıyor.
Carousel = browse state; intro boyunca focus değişmiyor, hover/drag kapalı,
layout yeniden hesaplanmıyor.

| Beat | Süre (sn) | Ne oluyor |
|---|---|---|
| **STACK** | 0.00 – 0.65 | Deste derinlikten gelip **tepsiye** yığılıyor, kartlar üst üste basamaklanıyor |
| **BOARD** | 0.65 – 1.15 | Masa beliriyor: keçe, neon grid, tepsi, sonra slotlar soldan sağa tek tek yanıyor, şerit etiketleri geliyor |
| **DEAL** | 1.15 – 2.75 | **20 kart tek tek dağıtılıyor.** Tepsiden çıkar → kısa yay çizer → slotuna oturur → slot bir kez parlar. Şerit şerit, soldan sağa |
| **TRAIL** | 2.60 – 3.50 | 4 kart masadan **kalkıp** ters diyagonallerde 7'şer klonluk iz bırakıyor |
| **FAN** | 3.50 – 4.20 | HAND şeridi yelpaze gibi açılıyor — kavisli hat, kenarlar geride ve küçük |
| **WAVE** | 4.20 – 4.95 | Oturmuş kartların üzerinden soldan sağa dalga |
| **COLLECT** | 4.95 – 5.55 | Kartlar tepsiye doğru toplanıyor, klonlar siliniyor, **masa çözülüyor** |
| **CAROUSEL** | 5.55 – 6.45 | Ray pozisyonlarına açılma |

**Toplam 6.45 sn.**

## 3b. Board / dealer sistemi

Arka plan artık pasif dekor değil — **kartların nereye gideceğini belirleyen
sistem**. `boardLayout()` tek doğruluk kaynağı: aynı sayılar hem slot
çizgisini çiziyor hem de dağıtılan kartın hedefini veriyor, bu yüzden bir kart
slotunun dışına oturamıyor.

| Şerit | Slot | z | Kart yüksekliği |
|---|---|---|---|
| **HAND** | 7 | +170 | %44 |
| **TABLE** | 7 | −70 | %38 |
| **STOCK** | 6 | −320 | %30 |

20 slot, 20 kart — birebir. Slotlar `rotateX(68°)` ile masaya yatık duruyor,
kartlar slotun üstünde dik. Şerit genişlikleri sırayla ekranın %94 / %80 / %63'ü;
kartlar birbirini örtüyor ama her kartın **%68–98'i görünür** kalıyor.

Ayrıca **tepsi** (deck tray) var: masanın ön-alt ortasında, `z:+340`. Deste
oraya yığılıyor, dağıtım oradan çıkıyor, COLLECT'te oraya dönüyor.

Dağıtım hareketi iki tween: önce yayın tepesine (`y −13vh`, `z +90`, hafif
fazla dönüş), sonra slota düşüş. Kart oturunca slot bir kez parlıyor.

Masa intro bitince DOM'dan siliniyor — browse mode'da iz kalmıyor.

### Ölçek — perspektife göre hesaplanıyor### Ölçek — perspektife göre hesaplanıyor

```js
sAt(f, z) = (H * f) / (ch * (P / (P - z)))   // P = 1050
```

"Sahne yüksekliğinin %64'ü olsun" dendiğinde, kart `z:+220`'deyken perspektifin
büyüttüğü kadarı düşülerek ölçek veriliyor. Sahne oranları: `halfW = W*.36`
(±36vw), `halfH = H*.22` (±22vh).

### İzler — açık adım vektörü

Klonlar artık ana kartın yolu üzerinden örneklenmiyor; her klon sabit bir
**adım vektörü** kadar geriye gidiyor ve X, Y, Z **birlikte** değişiyor:

```
step = { x: -yön * gap,  y: gap * .44,  z: -gap * .92 }
gap  = clamp(W * .075, 70, 120) px
```

Bu yüzden deste gibi değil, uzun bir diyagonal çizgi gibi okunuyor. Hafif bir
`k²` bükülme var, cetvelle çizilmiş gibi durmasın diye.

**İki zıt yön:** hero 0-1 sol-alt → sağ-üst, hero 2-3 sağ-alt → sol-üst.
Kesişme anında ekranda X biçiminde iki kart akışı oluşuyor.

Opacity merdiveni: `1 / .92 / .82 / .70 / .56 / .42 / .28 / .18`

### Ölçülen sonuç

Perspektif projeksiyonu + 72×48 grid örnekleme ile hesaplandı:

| Beat | Genişlik | Kaplama | En büyük kart | En küçük kart |
|---|---|---|---|---|
| EXPLODE | %80–85 | %46–56 | %65 | %24 |
| TRAIL | %96–100 | %53–62 | %60 | %24 |
| WALLS | %80–82 | %49–55 | %49 | %37 |
| GROUPS | %81–89 | %48–53 | %62 | %27 |
| COLLAPSE | %55–60 | %45–49 | %66 | %62 |

Klon aralığı **75–120 px**, iz uzunluğu ekranın **%55–57**'si, TRAIL sırasında
ekranda **48 kart görüntüsü**. Ön/arka ölçek farkı %65'e karşı %24 — kartların
bir kısmı kameraya çok yakın, bir kısmı çok uzakta.

Hedefler: genişlik ≥%75, kaplama ≥%35, ön kart %55–65, klon aralığı 70–110 px.
Hepsi tutuyor, hem 1000×660 pencerede hem maximize'da.

### Debug label

Sağ üstte hangi beatte olduğu yazıyor: `STACK / EXPLODE / TRAIL / WALLS /
GROUPS / WAVE / COLLAPSE / CAROUSEL`, intro bitince `BROWSE`.
Kaldırmak için: `js/ArchiveGallery.js` içinde `archive-debug` div'ini sil.

### Intro atlanırsa nedeni ekranda yazar

- GSAP yok → bu yüzden artık `js/vendor/gsap.min.js` yerelden yükleniyor
- Sistemde reduce-motion açık → Replay yine de oynatır

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
