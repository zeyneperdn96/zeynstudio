# ZEYNEP.EXE ARCHIVE — kart seti

20 pixel-art dosya kartı. `zeynep-archive-solitaire.html` bunları oyun destesi olarak kullanıyor.

## Deste yapısı

Referans (Dohris reklamı) 52 ayrı çizim kullanmıyor — aynı portreler sütun rengine göre
tekrar ediyor. Burada da aynısı: 4 arşiv × 5 dosya, A–K ranklar bu beşliyi döngüyle geziyor
(`rank → files[(rank-1) % 5]`), kart gövdesi arşivin rengini alıyor.

| Arşiv | Renk | Sembol | Kanat | Dosyalar |
|---|---|---|---|---|
| MAKING | `#ff4fa3` | ✎ | WARM | 019 SKETCHBOOK · 002 CAMERA & FILM · 014 STICKER BOX · 007 SOUNDTRACKS · 006 QUEST NOTES |
| GOING | `#4fa8ff` | ✈ | COOL | 003 JAPAN DIARIES · 004 TRAVEL FILE · 017 CITY LIGHTS · 015 SUMMER NOTES · 005 ROWING LOG |
| STAYING | `#a86fff` | ⌂ | COOL | 012 BOOK NOOK · 008 HOME CORNERS · 020 CAT MOMENTS · 013 CINEMA NIGHTS · 010 SECRET STUFF |
| LIVING | `#ffb545` | ♥ | WARM | 009 GOOD FOOD · 011 COFFEE BREAK · 018 SWEET THINGS · 016 DANCE FILE · 001 ZEYNEP.EXE |

Klasik solitaire'in kırmızı/siyah dönüşümü burada **WARM / COOL**. İki sıcak, iki soğuk arşiv
olduğu için kural birebir çalışıyor ve masada renkler göz kararı ayırt ediliyor.

## Klasörler

- `full/` — orijinaller (PNG, ~42 MB). **Siteye çıkmıyor**, arşiv kopyası.
- `thumbs/` — oyunun yüklediği hâl (600px JPEG, 2.3 MB toplam). Kart ekranda ~130px, fazlası gereksiz.
- `icon.png` — 128×128 masaüstü ikonu, 001'in sahne bölgesinden kırpıldı.

## Sonradan eklenebilecek üç dosya

Oyun bunları arıyor; yoksa CSS karşılığına düşüyor, hiçbir şey kırılmıyor.

- `card-back.png` — kapalı kart sırtı (dikey, 2:3). Şu an neon çapraz desen çiziliyor.
- `table-bg.png` — masa zemini (16:9, ortası boş). Şu an yıldız + perspektif grid CSS'ten.
- `slot-frame.png` — boş slot çerçevesi (2:3). Şu an köşe braketli kesikli çerçeve.

## Notlar

- **İki farklı en-boy oranı var**: 001–010 → 1024×1536 (2:3), 011–020 → 1086×1448 (3:4).
  Kart 2:3'te sabit, `object-fit: cover` + `object-position: center 42%` ile 3:4 olanların
  kenarları hafif kırpılıyor. Yeni kart üretirsen 2:3 tut.
- Kartın altındaki `OPEN →` şeridi kırpma dışında kalıyor; başlık `.ftr` satırında koddan yazılıyor.
- SKETCHBOOK iki kez gönderilmişti, tek kopya alındı.
