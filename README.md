# Kerem & Ayça — GitHub Pages Portfolyo Sitesi

Minimalist, mobil uyumlu ve tamamen ücretsiz yayınlanabilen statik portfolyo sitesi.

## Dosyalar

- `index.html`: Sitenin tüm metinleri ve bölümleri
- `style.css`: Tasarım, renkler ve mobil görünüm
- `script.js`: Menü, animasyonlar ve video penceresi
- `assets/images`: Kapak fotoğrafları
- `assets/videos`: Portfolyo videoları
- `assets/logos`: İsterseniz ekleyebileceğiniz marka logoları
- `YAYINLAMA-REHBERI.md`: GitHub Pages kurulum ve düzenleme rehberi

## Hızlı içerik değişikliği

Metinleri değiştirmek için `index.html` dosyasını açıp ilgili metni bulun.

E-posta:
```html
href="mailto:aycandkerem@gmail.com"
```

Instagram:
```html
href="https://www.instagram.com/kkargin_/"
```

Hero videosu:
1. Videonuzu `assets/videos/hero.mp4` adıyla yükleyin.
2. `index.html` içindeki aşağıdaki satırın yorum işaretlerini kaldırın:
```html
<source src="assets/videos/hero.mp4" type="video/mp4" />
```

## Video boyutu önerisi

GitHub depolarında büyük medya dosyaları kullanmak sitenin açılmasını yavaşlatabilir. Her video için:
- MP4 / H.264
- 1080 × 1920 veya 1920 × 1080
- 10–25 MB hedef
- 30–45 saniyeyi geçmeyen portfolyo kesitleri

Daha ağır videoları YouTube veya Vimeo üzerinden gömmek ileride daha doğru olabilir.
