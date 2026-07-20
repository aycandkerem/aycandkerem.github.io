# GitHub Pages Yayınlama Rehberi

Bu rehber teknik bilgi gerektirmeden siteyi yayına almanız için hazırlandı.

## 1. ZIP dosyasını açın

İndirdiğiniz `kerem-ayca-github-pages.zip` dosyasını bilgisayarınızda açın.

Klasörün içinde şu dosyaları görmelisiniz:

- `index.html`
- `style.css`
- `script.js`
- `assets` klasörü
- `README.md`

`index.html` dosyası klasörün en üst seviyesinde kalmalıdır.

---

## 2. GitHub hesabı açın

1. GitHub.com adresine girin.
2. Hesabınız yoksa ücretsiz hesap oluşturun.
3. E-posta doğrulamasını tamamlayın.

---

## 3. Yeni repository oluşturun

1. Sağ üst köşedeki `+` simgesine tıklayın.
2. `New repository` seçeneğini seçin.
3. Repository adına örneğin şunu yazın:

   `kerem-ayca-portfolio`

4. Görünürlüğü `Public` olarak seçin.
5. `Add a README file` seçeneğini işaretlemeyin.
6. `Create repository` butonuna basın.

> Ücretsiz GitHub hesabında GitHub Pages kullanırken public repository en kolay seçenektir.

---

## 4. Site dosyalarını yükleyin

Repository açıldıktan sonra:

1. `uploading an existing file` bağlantısına veya `Add file → Upload files` seçeneğine tıklayın.
2. ZIP dosyasını değil, ZIP'ten çıkardığınız klasörün **içindeki bütün dosya ve klasörleri** yükleme alanına sürükleyin.
3. Dosya listesinde `index.html`, `style.css`, `script.js` ve `assets` klasörünün göründüğünü kontrol edin.
4. Alt taraftaki mesaj alanına `İlk site kurulumu` yazabilirsiniz.
5. `Commit changes` butonuna basın.

---

## 5. GitHub Pages'i açın

1. Repository sayfasında üst menüden `Settings` seçeneğine girin.
2. Sol menüden `Pages` seçeneğini açın.
3. `Build and deployment` bölümünde:
   - `Source`: **Deploy from a branch**
   - `Branch`: **main**
   - Klasör: **/ (root)**
4. `Save` butonuna basın.

GitHub siteyi hazırladıktan sonra aynı Pages ekranında site adresiniz görünür.

Adres çoğunlukla şu biçimde olur:

`https://KULLANICI-ADINIZ.github.io/kerem-ayca-portfolio/`

İlk yayının görünmesi birkaç dakika sürebilir. Sayfa açılmazsa repository içindeki `Actions` sekmesinde yayın sürecinin tamamlanıp tamamlanmadığını kontrol edin.

---

## 6. Sitede değişiklik yapmak

### Kolay yöntem: GitHub üzerinden

1. Repository içinde değiştirmek istediğiniz dosyaya girin.
2. Sağ üstteki kalem simgesine, yani `Edit this file` seçeneğine tıklayın.
3. Metni değiştirin.
4. `Commit changes` butonuna basın.

Değişiklikler otomatik olarak siteye aktarılır.

### Fotoğraf değiştirmek

1. Yeni görselinize mevcut dosyayla aynı adı verin.
2. `assets/images` klasörüne girin.
3. Eski dosyayı silin veya yeni dosyayla değiştirin.
4. Değişikliği commit edin.

Örnek dosyalar:

- `hero-placeholder.svg`
- `project-mauritius.svg`
- `project-hilton.svg`
- `project-chateau.svg`
- `project-destination.svg`

JPG veya WebP kullanacaksanız `index.html` içindeki dosya uzantısını da değiştirin.

Örnek:

```html
<img src="assets/images/project-hilton.webp" alt="Hilton Mauritius" />
```

### Video eklemek

Videolarınızı şu adlarla `assets/videos` klasörüne yükleyebilirsiniz:

- `hero.mp4`
- `heritage-mauritius.mp4`
- `hilton-mauritius.mp4`
- `chateau.mp4`
- `destination-story.mp4`

Hero videosu için ayrıca `index.html` içindeki şu satırın yorum işaretlerini kaldırın:

```html
<source src="assets/videos/hero.mp4" type="video/mp4" />
```

---

## 7. E-posta ve sosyal medya bağlantılarını değiştirmek

`index.html` dosyasında aşağıdaki ifadeleri arayın:

- `aycandkerem@gmail.com`
- `https://www.instagram.com/kkargin_/`
- `https://www.instagram.com/heysirenas/`

Kendi kullanmak istediğiniz bilgilerle değiştirin.

---

## 8. Site adresini daha kısa yapmak

Repository adını tam olarak şu formatta oluşturursanız:

`KULLANICI-ADINIZ.github.io`

site adresiniz doğrudan şu olur:

`https://KULLANICI-ADINIZ.github.io/`

Bunun için repository adındaki `KULLANICI-ADINIZ` bölümü GitHub kullanıcı adınızla birebir aynı olmalıdır.

---

## 9. Sık karşılaşılan sorunlar

### Site 404 gösteriyor

- `index.html` ana klasörde mi kontrol edin.
- Pages ayarında `main` ve `/(root)` seçildi mi kontrol edin.
- Repository public mi kontrol edin.
- Büyük/küçük harflerin dosya adlarında birebir eşleştiğinden emin olun.

### Görseller görünmüyor

GitHub dosya yollarında büyük/küçük harf duyarlıdır:

- `Hilton.webp` ile `hilton.webp` farklı dosyalardır.
- Dosya adlarında Türkçe karakter ve boşluk kullanmamak daha güvenlidir.

### Video çok yavaş açılıyor

Videoyu küçültün veya kısa bir portfolyo kesiti kullanın:

- MP4
- H.264
- 1080p
- Mümkünse 10–25 MB

### Değişiklik hemen görünmedi

- Sayfayı sert yenileyin: Mac'te `Cmd + Shift + R`, Windows'ta `Ctrl + F5`
- GitHub `Actions` sekmesinde dağıtımın tamamlandığını kontrol edin.

---

## 10. Bana değişiklik iletirken

Şu şekilde yazmanız yeterli:

- “Hero başlığını şu metinle değiştir.”
- “Arka planı daha açık ve sıcak yap.”
- “Hilton kartını ilk sıraya al.”
- “Paketler bölümü ekle.”
- “WhatsApp butonu koy.”
- “Videolar popup yerine sayfada otomatik oynasın.”

Güncellenmiş dosyaları tekrar hazırlayıp paylaşabilirim.
