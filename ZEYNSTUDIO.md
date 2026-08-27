# ZEYNSTUDIO — Çalışma Günlüğü

Bu dosya, Zeyn Studio portfolyo sitesinde yapılan işleri kaydeder.

---

## 📍 DURUM & YOL HARİTASI — Game UI Pivotu (son güncelleme: 2026-06-17)

> **Yeni bir oturumda buradan devam et.** Bağlam: Zeynep bir oyun stüdyosunda
> **Game UI Artist** pozisyonuna başvurdu. Dönüş (recruiter Zhyldyz/Yıldız Sen):
> "Portfolyoda oyun alanına dair daha fazla proje görmek istiyoruz; bol oyun
> oynayıp hazır hissedince tekrar başvur." Amaç: portfolyoyu (bu repo, XP temalı,
> vanilla HTML/CSS/JS, GitHub Pages → zeynstudio.com) oyun UI'ı görünür olacak
> ve büyüyecek şekilde geliştirmek.

### Kimlik kararı
"Multidisciplinary Designer" (İngilizce) olarak kalır — tam "Game UI Artist"e
rebrand YOK — ama Game UI birinci sınıf, öne çıkan kategori olur. Endüstriyel
tasarım geçmişi gerçek bir artı, ikincil olarak korunur (silme).

### Kilit içgörü
Zeynep "oyun işim yok" dese de sitede gizli/yanlış paketlenmiş oyun UI işi VAR:
- **Games.exe** — kodladığı oynanabilir Minesweeper/Snake/Tetris/Pong
- **STELLAR VANGUARD** (`character-select.html`) — sci-fi karakter seçim ekranı
- `cyberpunk-cards.html` + `trading-cards.html` — RPG mekanikli kart oyunu UI
- **Super Zeynep World** (`super-zeynep-world.html`) — HUD/quest/level gamified UX

### Fazlar
- **Faz 0 — Konumlandırma: ✅ TAMAM & CANLIDA.** "Industrial Designer" → 
  "Multidisciplinary Designer", game UI öne alındı. Değişen: `index.html` (title/
  meta/start-menu), `js/config.js`, `js/WindowTemplates.js` (CV), `msn-chatbot.html`.
- **Boot ekranı düzeltmesi: ✅ TAMAM & CANLIDA.** Boot videosuna ("Industrial
  Designer" gömülü) HTML/CSS overlay ile "Multidisciplinary Designer" bindirildi.
  `index.html` (#boot-subtitle div), `css/boot.css` (#boot-subtitle), 
  `js/BootSequence.js` (positionSubtitle — letterbox hizası). Asset'lere `?v=2`.
- **Login ekranı (`assets/boot/login3.jpg`): 🔵 ZEYNEP HALLEDECEK** (Photoshop).
  İki "Industrial Designer" yazısı baked. Bittiğinde: `index.html`'deki login img
  src'ye `?v=2` ekle + commit. (Doku: panel ≈ #3D63D0, kenar ≈ #1E3F9E.)
- **Faz 1 — Mevcut oyun işlerini görünür kıl:** 🟡 BAŞLADI (2026-06-22).
  - ✅ My Work'e **Game UI** kategorisi + filtre eklendi (All Projects'ten hemen
    sonra, öne çıkan sekme). 4 iş `category: 'game-ui'` ile listeleniyor:
    STELLAR VANGUARD (`character-select.html`), NEON DECK (`cyberpunk-cards.html`),
    SUPER ZEYNEP WORLD (`super-zeynep-world.html`), Games.exe (in-OS `games` penceresi).
    Game UI işleri "All Projects" görünümünde de en başta görünüyor.
  - Değişen: `js/WindowTemplates.js` (Game UI filtre butonu), `js/ProjectsData.js`
    (4 kayıt + `game-ui` label + thumbnailsiz kartlar için emoji/gradient desteği:
    `thumbnailIcon` + `thumbnailBg`), `js/WindowManager.js` (`opensWindow` prop →
    Games.exe gibi in-OS pencere açan projeler için).
  - Sanat yönü taslağı: derin uzay lacivert/siyah + neon camgöbeği/magenta gradient'ler
    (STELLAR VANGUARD 🚀, NEON DECK 🃏 magenta, SUPER ZEYNEP WORLD 🍄 mavi, Games.exe 🎮).
  - ⬜ KALAN: gerçek ekran görüntüsü thumbnaillar (şu an emoji+gradient placeholder);
    her oyun işi için kısa case study metni; istenirse trading-cards.html'i de ekle
    (şu an About Me olarak kullanılıyor, mükerrerlik riski için dışarıda bırakıldı).
- **ARCHIVE GALLERY (Archive.exe):** 🟡 YAZILDI, TARAYICIDA TEST EDİLMEDİ
  (2026-08-27, aynı `archive-solitaire` dalında). ZEYNEP.EXE kart setinin 3B
  kart galerisi, masaüstünde XP penceresi olarak açılıyor. GSAP + CSS 3D.
  Yeni: `js/ArchiveGallery.js`, `js/ArchiveData.js`, `css/archive-gallery.css`.
  Ayrıntı, koreografi ve ilk açışta bakılacaklar: **`ARCHIVE-GALLERY.md`**.
- **ARCHIVE SOLITAIRE:** ✅ TAMAM (2026-08-27), `archive-solitaire` dalında,
  master'a merge edilmedi. Oynanabilir Klondike, Zeynep'in 20 kartlık ZEYNEP.EXE
  pixel arşivinden. Referans: Dohris'in LinkedIn solitaire reklamı. Tek dosya
  `zeynep-archive-solitaire.html` + `assets/projects/zeynep-archive/`.
  Ayrıntı, karar gerekçeleri ve kalanlar: **`ARCHIVE-SOLITAIRE.md`**.
  - Not: bu iş önce STELLAR VANGUARD temasıyla ("CREW MANIFEST") kurulmuştu,
    Zeynep kendi kart setini tercih edince o sürüm silindi. **Faz 2 artık
    solitaire'e bağlı değil**, aşağıdaki plan olduğu gibi duruyor.
- **Faz 2 — Flagship oyun UI seti:** ⬜ YAPILACAK. **Karar: Cyberpunk/Sci-fi →
  STELLAR VANGUARD'ı uçtan uca oyun UI'ına büyüt.** Ekranlar: Title+menü, Pilot
  seçimi (var), **HUD ⭐** (can/shield/ammo/radar/objective/cooldown/low-hp vignette),
  Loadout/envanter, Augment skill tree, Star map/mission select, Armory/shop,
  Comms/diyalog, Pause/settings, juice katmanı (level-up/alert/bildirim). Diegetic
  = geminin holografik arayüzü. Art direction: derin uzay lacivert/siyah + neon
  camgöbeği/magenta, techno display + temiz UI sans, çizgi/holografik ikon, glitch/glow.
  Yöntem: Figma'da UI kit + statik frame'ler, kodda HUD + 1-2 menü canlı oynanabilir
  demo (Zeynep'in farkı = kodlanmış juicy UI). + 2 UI teardown (Hades, Cyberpunk 2077).
- **Faz 3 — Game art/illüstrasyon:** ⬜ karakter konsept, item/ikon seti, keyart.
- **Faz 4 — Cila + showreel + yeniden başvuru.** ⬜

### Sıradaki somut adım
İki seçenek (Zeynep'in tercihine bağlı, henüz seçmedi):
(a) Ben başlatırım: "Game UI" kategorisi + STELLAR VANGUARD interaktif HUD demo
    iskeleti (art direction taslağıyla); Zeynep sanat yönünü giydirir.
(b) Önce Zeynep Figma'da art direction'ı oturtur.

### Lokal test
`ruby -run -e httpd . -p 8765 --bind-address 127.0.0.1` → http://127.0.0.1:8765/
(Bu makinede node yok; python3 VAR — `python3 -m http.server 8000` da olur.) Push: GitHub Desktop ("Push origin"); CLI auth yok.

---

## 2026-06-12 — AI Visuals Galerisi

### Özet
MidJourney ile üretilen 124 görsel (82 resim + 42 video) `.exe` temalı masaüstü
arayüzüne "AI Visuals" kategorisi olarak entegre edildi ve her görsele resme
bakılarak kısa, benzersiz başlık yazıldı.

### Yapılanlar

**1. Görsel işleme** (`process_ai_visuals.sh`)
- Kaynak: `~/Downloads/hammurabla_*.png` ve `*.mp4` (MidJourney çıktıları)
- Resimler → optimize JPG (full 1600px/q80 + thumb 500px/q68)
- Videolar → mp4 kopyası + `qlmanage` ile poster thumb
- Hedef: `assets/projects/ai-visuals/{thumbs,full,video}/` (001–124)
- Toplam **248 dosya** (124 thumb + 82 full + 42 video)

**2. Veri entegrasyonu** (`js/AiVisualsData.js`)
- 124 kayıt `AI_VISUALS` dizisi olarak, `window.AI_VISUALS` ile expose ediliyor
- `index.html:298` üzerinden yükleniyor

**3. Arayüz bağlantısı**
- `js/WindowTemplates.js:309` → `aiVisualsWork` lightbox şablonu
  (viewer + thumb strip + sayaç + statusbar)
- `js/WindowManager.js:468` → "AI Visuals" filtresi + grid render
- `js/WindowManager.js:735` → `initializeAiVisualsGallery`
  (prev/next, klavye ←→, video pause-on-switch, lazy-load)

**4. Test (geçti)**
- 248 referans = 248 dosya diskte → 0 eksik, 0 yetim, 0 boş dosya
- Tüm kaynaklar HTTP 200
- Label'larda HTML/JS kıran karakter yok

**5. Başlık iyileştirmesi** ⭐
- Sorun: 124 kayıt vardı ama **sadece 66 farklı label** — dosya adından kesik
  geldikleri için tekrar ediyorlardı (ör. "Studio Ghibli...Wide Cinema" **34 kez**).
- Çözüm: 124 thumbnail 8 paralel alt-agent ile incelendi, her görsele bakılarak
  kısa (2–4 kelime) İngilizce başlık üretildi.
- Sonuç: **66 → 124 farklı başlık** (artık hiç tekrar yok).
- Yedek: `js/AiVisualsData.js.bak`

### Açık işler / sıradaki adımlar
- [ ] **MidJourney ibaresi**: pencere başlığı hâlâ "MidJourney Gallery", statusbar'da
      da geçiyor. Öneri: başlık `✨ AIVisuals.exe`, kredi ince bir alt-nota
      ("Created with MidJourney, Kling & others" — videolar MidJourney değil).
- [ ] **Kürasyon**: galeri alfabetik sırada; en güçlü görselleri başa alıp
      zayıfları ayıklamak.
- [ ] Birkaç başlık fazla şiirsel olabilir (095 "Blindfolded Devotion",
      089 "The Fox Mask") — gözden geçirilebilir.

### Yerel test komutu
```bash
cd ~/Desktop/AI/zeynstudio-master
ruby -run -e httpd . -p 8765 --bind-address 127.0.0.1
# → http://127.0.0.1:8765/index.html
```
(Bu makinede `node` kurulu değil. `python3` VAR — `python3 -m http.server 8000` da olur.)
