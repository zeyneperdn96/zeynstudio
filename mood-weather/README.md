# 🌤️ Mood Weather - Ruh Hali Takip Uygulaması

Ruh halinizi hava durumu gibi görselleştiren modern, interaktif web uygulaması.

## ✨ Özellikler

- 🎨 **6 Farklı Ruh Hali**: Harika, İyi, İdare Eder, Eh İşte, Kötü, Berbat
- 🌈 **Dinamik Animasyonlar**: Her ruh hali için özel hava durumu efektleri
- 📊 **Haftalık Takip**: Son 7 günün görsel özeti
- 🔥 **Seri Takibi**: Ardışık gün sayacı
- 📝 **Not Ekleme**: Her ruh haline özel notlar
- 💾 **Otomatik Kayıt**: LocalStorage ile verileriniz güvende
- 📱 **Mobil Uyumlu**: Tüm cihazlarda mükemmel görünüm
- 🎭 **Premium Tasarım**: Glassmorphism ve modern UI

## 🚀 Kullanım

### Tarayıcıda Açmak

1. **Doğrudan Açma**:
   - `index.html` dosyasına çift tıklayın
   - VEYA tarayıcınıza sürükleyip bırakın

2. **Live Server ile** (VS Code):
   ```bash
   # Live Server extension yüklü ise
   # index.html'e sağ tıklayın > "Open with Live Server"
   ```

3. **Python ile Basit Server**:
   ```bash
   cd c:\Users\pc\Documents\frontend\react\MyApp\mood-weather
   python -m http.server 8000
   # Tarayıcıda: http://localhost:8000
   ```

### Uygulamayı Kullanma

1. **Ruh Hali Seçin**: 6 karttan birini tıklayın
2. **Not Ekleyin** (isteğe bağlı): Günle ilgili düşüncelerinizi yazın
3. **Kaydedin**: "Kaydet" butonuna tıklayın
4. **Geçmişi Görüntüleyin**: Sağ üstteki 📊 ikonuna tıklayın

## 📸 Ekran Görüntüsü Alma

### Manuel Yöntem
1. Uygulamayı tarayıcıda açın
2. `F12` ile Developer Tools'u açın
3. `Ctrl + Shift + P` > "Capture screenshot" yazın
4. "Capture full size screenshot" seçin

### Programatik Yöntem
Tarayıcı konsolu (F12) açıp şu kodu çalıştırın:

```javascript
// Tüm sayfanın ekran görüntüsü
html2canvas(document.body).then(canvas => {
    const link = document.createElement('a');
    link.download = 'mood-weather-screenshot.png';
    link.href = canvas.toDataURL();
    link.click();
});
```

## 📁 Dosya Yapısı

```
mood-weather/
├── index.html      # Ana HTML dosyası
├── styles.css      # Tüm stiller ve animasyonlar
├── script.js       # Uygulama mantığı
├── export.html     # Portfolio export versiyonu
└── README.md       # Bu dosya
```

## 🎨 Tasarım Özellikleri

- **Renk Paleti**: Koyu tema, mor-mavi gradyanlar
- **Tipografi**: Inter & Outfit font aileleri
- **Efektler**: Glassmorphism, glow effects, smooth transitions
- **Animasyonlar**: Float, fade, slide, particle effects

## 💾 Veri Saklama

Tüm veriler tarayıcınızın LocalStorage'ında saklanır:
- Ruh hali kayıtları
- Notlar
- Tarih bilgileri

**Not**: Tarayıcı verilerini temizlerseniz kayıtlarınız silinir!

## 🌐 Tarayıcı Desteği

- ✅ Chrome/Edge (önerilen)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## 📱 Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## 🎯 Gelecek Özellikler

- [ ] Veri export/import (JSON)
- [ ] Aylık istatistikler
- [ ] Tema değiştirme (light/dark)
- [ ] Daha fazla ruh hali seçeneği
- [ ] Grafik ve analizler

## 📄 Lisans

Bu proje kişisel kullanım içindir.

---

**Geliştirici**: ZeynStudio  
**Tarih**: Şubat 2026
