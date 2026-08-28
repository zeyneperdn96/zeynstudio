# ARCHIVE SOLITAIRE — Proje Dosyası

`zeynep-archive-solitaire.html` · Ağustos 2026 · Game UI

Kişisel bir pixel-art kart setinden kurulmuş, oynanabilir Klondike solitaire.
Tek dosya, bağımlılıksız, DESIGNER QUEST'le aynı rotada (kendi sayfası +
`ProjectsData.js` kaydı + masaüstü ikonu).

---

## 1. Nereden çıktı

Zeynep, Dohris'in (İK yazılımı) LinkedIn reklamını gördü: klasik Klondike
solitaire, ama kartlar pixel-art çalışan portreleri, dört sinek yerine dört
meslek (Designers / BI Analysts / Developers / Advertisers), masa synthwave
neon grid, kazanınca klasik kart şelalesi. 31 saniyelik ekran kaydı:
`~/Downloads/MicrosoftTeams-video (4).mp4`.

**Terk edilen ilk yön.** Aynı oyun önce STELLAR VANGUARD evrenine *CREW MANIFEST*
adıyla kurulmuştu — dört suit = mürettebat departmanları, papazlar
`character-select.js`'teki dört karakter. Konsept sağlamdı ama 23 yeni görsel
üretmeyi gerektiriyordu. Zeynep bunun yerine kendi ürettiği 20 kartlık
**ZEYNEP.EXE ARCHIVE** setini kullanmayı seçti; sci-fi sürüm silindi.

---

## 2. Asıl problem: 20 görsel, 52 kart

Klondike 52 kart ister. Elde 20 görsel var. Yeni görsel üretmek yerine
referansın ne yaptığına bakıldı — **Dohris de 52 ayrı çizim kullanmıyor**, aynı
portreler sütun rengine göre tekrar ediyor.

Aynı mantık kuruldu:

```
4 arşiv × 5 dosya = 20 görsel
rank A..K  →  files[(rank - 1) % 5]
kart gövdesi = arşivin rengi
```

| Arşiv | Renk | Kanat | Dosyalar |
|---|---|---|---|
| **MAKING** | `#ff4fa3` | WARM | 019 SKETCHBOOK · 002 CAMERA & FILM · 014 STICKER BOX · 007 SOUNDTRACKS · 006 QUEST NOTES |
| **GOING** | `#43d2ff` | COOL | 003 JAPAN DIARIES · 004 TRAVEL FILE · 017 CITY LIGHTS · 015 SUMMER NOTES · 005 ROWING LOG |
| **STAYING** | `#b07cff` | COOL | 012 BOOK NOOK · 008 HOME CORNERS · 020 CAT MOMENTS · 013 CINEMA NIGHTS · 010 SECRET STUFF |
| **LIVING** | `#ffd23f` | WARM | 009 GOOD FOOD · 011 COFFEE BREAK · 018 SWEET THINGS · 016 DANCE FILE · 001 ZEYNEP.EXE |

Klasik solitaire'in **kırmızı/siyah** dönüşümü burada **WARM / COOL** oldu. İki
sıcak, iki soğuk arşiv olduğu için kural birebir çalışıyor ve masada renkler göz
kararı ayırt ediliyor.

---

## 3. Referansın görsel dili

> İlk sürüm videonun tek poster karesine bakılarak yapıldı ve tutmadı — cam
> panelli bir HUD, gradient başlıklı kalın kartlar çıktı. Zeynep "bu videodaki
> gibi değil ki" dedi. Video kare kare çıkarılınca gerçek dil ortaya çıktı.
> **Ders: referans videoyu tek kareden değerlendirme.**

Ölçülerek alınanlar:

| Öğe | Referansta | Uygulamada |
|---|---|---|
| Kart | Düz renk plaka, koyu gövde yok | `background: var(--fc)`, gradient yok |
| Rank | Tek harf, sol üst, doğrudan rengin üstünde | `.hdr` yüksekliği `ch × 0.18` |
| Üst üste binen kart | İnce renkli şerit, sadece harf görünür | `fanUp = hdr` — şerit ve başlık aynı yükseklik |
| Kapalı kart fanı | Daha sıkı | `fanDown = ch × 0.075` |
| HUD bar | **Yok** | Dört köşe: rozet · sayaç · saat · hamle |
| Sayaç | `0 / Teams`, düz pixel yazı | `0 / Archives` |
| Foundation | Etiket kartın **üstünde** + ▼ | `.flabel`, `ch × 0.22` yukarıda |
| Sürükleme | Kartın altında etiket balonu ("HR Manager") | `#tip`, dosya adını gösteriyor |
| Tahta | Kompakt, ortalanmış | Blok olarak dikey ortalanıyor, kart eni ≤ 104px |
| Font | Pixel | Press Start 2P |
| Animasyon | Sert, kademeli | `steps()`, blur yok, `0 2px 0` sert gölge |

Zemin: siyah uzay, seyrek yıldız, solda küçük mavi gezegen, ufuk çizgisi,
mavi/yeşil perspektif grid — hepsi CSS, görsel dosyası yok.

**Bilerek ayrılınan tek nokta.** Videoda sütunlar tek renk yığılıyor (sarının
üstüne sarı) — yani gerçek solitaire kuralı işlemiyor, muhtemelen A/B/C/D
performans notu üstünden çalışan gevşek bir versiyon. Burada klasik kural
duruyor: azalan sıra + WARM/COOL dönüşümü. Görüntü aynı, oyun oynanabilir.

---

## 4. Oyun

- Tam Klondike: 7 sütun, çek-1, sınırsız yeniden dizme, boş sütunu yalnız K açar
- Sürükle-bırak `pointer` event'leriyle — mouse ve dokunmatik aynı kod
- Çoklu kart taşıma; hedef sütun sürüklerken beyazlıyor
- Karta tek tık → uygunsa doğrudan arşive uçuyor
- `FILE` → sırayla otomatik topluyor
- Sınırsız undo, süre + hamle sayacı, S/A/B/C derecelendirme
- Kazanınca kart şelalesi (fizik: yerçekimi + zemin sekmesi) + `ARCHIVE COMPLETE`
- Kısayollar: `Space` çek · `A` otomatik · `N` yeni · `Ctrl+Z` geri al
- Sesler WebAudio ile üretiliyor, harici dosya yok, `SND` ile kapanıyor

---

## 5. Görseller

```
assets/projects/zeynep-archive/
├── full/          20 orijinal PNG  (~42 MB, git'e eklenmedi)
├── thumbs/        20 JPEG, 600px   (2.3 MB — oyunun yüklediği)
└── README.md      deste yapısı + notlar
```

Oyun `thumbs/` yüklüyor; kart ekranda en fazla ~104px, fazlası boşa gider.

**Sonradan eklenebilecek üç dosya.** Oyun bunları arıyor, yoksa CSS karşılığına
düşüyor ve hiçbir şey kırılmıyor:

| Dosya | Ne için | Şu anki karşılık |
|---|---|---|
| `card-back.png` | Kapalı kart sırtı (2:3) | Mor plaka + çapraz desen + `Z` |
| `table-bg.png` | Masa zemini (16:9, ortası boş) | Yıldız + gezegen + perspektif grid |
| `slot-frame.png` | Boş slot çerçevesi (2:3) | İnce beyaz çerçeve |

**Uyarı — iki farklı en-boy oranı.** 001–010 → 1024×1536 (2:3), 011–020 →
1086×1448 (3:4). Kart 2:3'te sabit, `object-position: center 45%` ile 3:4
olanların kenarı hafif kırpılıyor. **Yeni kart üretilirse 2:3 olmalı.**

---

## 6. Nasıl test edildi

Bu makinede node yok, tarayıcı otomasyonu da bağlı değil. Doğrulama şöyle yapıldı:

1. Oyunun JS'i HTML'den çıkarıldı, sonuna test amaçlı bir `__T` export'u enjekte edildi
2. Küçük bir **DOM stub** yazıldı (element fabrikası, sahte `Image`, kontrol edilebilir
   `setTimeout` kuyruğu, senkron `Promise`)
3. `osascript -l JavaScript` (JXA) ile headless koşturuldu

**25 kontrol, hepsi geçiyor:** dağıtım şekli (sütun derinlikleri, 24'lük deste,
açık/kapalı kartlar), foundation ve tableau kuralları, 600 hamlelik rastgele bot
altında 52-kart bütünlüğü ve tekrar yokluğu, undo'nun state'i birebir geri
yüklemesi, otomatik toplama, kazanma tespiti, görsel eşleme (her rank kendi
arşivinin içinden, 20 dosyanın hepsi kullanılıyor, iki WARM iki COOL).

**Video karesi çıkarmak** için: ffmpeg yok, JXA/AVFoundation da çalışmıyor
(BridgeSupport dosyası yok). Çalışan yol **Swift** — `/usr/bin/swift` kurulu,
`AVURLAsset` + `AVAssetImageGenerator` ile istenen saniyelerden PNG yazılıyor,
sonra `sips -c` ile kırpılıp büyütülüyor.

---

## 7. Lokal test

```
ruby -run -e httpd . -p 8765 --bind-address 127.0.0.1
```

- `http://127.0.0.1:8765/zeynep-archive-solitaire.html` — direkt oyun
- `http://127.0.0.1:8765/` — masaüstü; **Archive Solitaire** ikonu ve
  My Work → Game UI içinde proje kartı

Oyun sayfası `file://` üzerinden de çalışır (fetch/modül kullanmıyor).

---

## 8. Kalanlar

- ⬜ `card-back.png` · `table-bg.png` · `slot-frame.png`
- ⬜ Portfolyo kartı için gerçek ekran görüntüsü thumbnail (şu an 001'in preview'ı)
- ⬜ Case study metni — bu dosya hammadde
- ⬜ Ekran kaydı: dağıtım → birkaç hamle → `A` ile toplama → şelale. 20-30 sn yeter
- ⬜ `full/` git'e eklenecek mi kararı (şu an sadece diskte)
