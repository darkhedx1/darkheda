# Garanti Takipçim - Sosyal Medya Panel

Modern ve güvenli sosyal medya büyüme platformu. React, TypeScript ve Vercel Blob ile geliştirilmiştir.

## 🚀 Özellikler

### 📱 Sosyal Medya Hizmetleri
- Instagram, TikTok, YouTube, Twitter ve 30+ platform desteği
- Takipçi, beğeni, izlenme ve etkileşim hizmetleri
- Gerçek zamanlı sipariş takibi
- Drop koruması garantisi

### 💾 Vercel Blob Entegrasyonu
- Güvenli dosya depolama
- Resim ve belge yükleme
- Otomatik dosya optimizasyonu
- Dosya yönetim paneli

### 🔐 Güvenlik
- JWT tabanlı kimlik doğrulama
- Rol tabanlı erişim kontrolü
- Güvenli ödeme sistemi
- Veri şifreleme

### 🎨 Modern UI/UX
- Responsive tasarım
- Dark/Light tema desteği
- Framer Motion animasyonları
- Tailwind CSS ile modern tasarım

## 🛠️ Teknolojiler

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Zustand, Context API
- **File Storage**: Vercel Blob
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📦 Kurulum

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd social-media-panel
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment variables ayarlayın**
```bash
cp .env.example .env
```

4. **Vercel Blob Token'ını ekleyin**
`.env` dosyasına Vercel Blob token'ınızı ekleyin:
```
BLOB_READ_WRITE_TOKEN=your_blob_token_here
```

5. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

## 🔧 Vercel Blob Kurulumu

### 1. Vercel Hesabı Oluşturun
- [Vercel](https://vercel.com) hesabı oluşturun
- Projenizi Vercel'e deploy edin

### 2. Blob Store Oluşturun
- Vercel Dashboard'da Storage sekmesine gidin
- "Create Database" > "Blob" seçin
- Store adını belirleyin

### 3. Token Alın
- Blob store'unuzun ayarlarından token'ı kopyalayın
- `.env` dosyasına ekleyin

### 4. Kullanım
```typescript
import { blobStorage } from './src/lib/blob';

// Dosya yükleme
const result = await blobStorage.uploadFile(file);

// Dosya silme
await blobStorage.deleteFile(url);

// Dosya listeleme
const files = await blobStorage.listFiles();
```

## 📁 Dosya Yapısı

```
src/
├── components/
│   ├── UI/
│   │   ├── FileUpload.tsx      # Dosya yükleme komponenti
│   │   ├── ImageUpload.tsx     # Resim yükleme komponenti
│   │   └── Button.tsx
│   └── Layout/
├── contexts/
│   ├── BlobContext.tsx         # Blob state yönetimi
│   ├── AuthContext.tsx
│   └── ServiceContext.tsx
├── hooks/
│   └── useFileUpload.ts        # Dosya yükleme hook'u
├── lib/
│   └── blob.ts                 # Vercel Blob utilities
├── pages/
│   ├── FileManagerPage.tsx     # Dosya yönetim sayfası
│   ├── AdminPage.tsx
│   └── ...
└── types/
```

## 🎯 Kullanım Örnekleri

### Dosya Yükleme
```tsx
import FileUpload from './components/UI/FileUpload';

<FileUpload
  onUpload={(result) => console.log('Uploaded:', result.url)}
  accept="image/*"
  maxSize={5 * 1024 * 1024} // 5MB
  folder="profiles"
/>
```

### Resim Yükleme
```tsx
import ImageUpload from './components/UI/ImageUpload';

<ImageUpload
  onUpload={(result) => setProfileImage(result.url)}
  aspectRatio="square"
  placeholder="Profil fotoğrafı yükle"
/>
```

### Programatik Dosya Yükleme
```tsx
import { useFileUpload } from './hooks/useFileUpload';

const { uploadFile, uploading, progress } = useFileUpload({
  folder: 'documents',
  maxSize: 10 * 1024 * 1024,
  onSuccess: (result) => console.log('Success:', result)
});

const handleUpload = async (file: File) => {
  await uploadFile(file);
};
```

## 🔒 Güvenlik Özellikleri

- **Dosya Türü Kontrolü**: Sadece izin verilen dosya türleri
- **Boyut Limiti**: Maksimum dosya boyutu kontrolü
- **Güvenli URL'ler**: Vercel Blob güvenli URL'ler sağlar
- **Erişim Kontrolü**: Rol tabanlı dosya erişimi

## 📊 Performans

- **Lazy Loading**: Dosyalar ihtiyaç duyulduğunda yüklenir
- **Optimizasyon**: Resimler otomatik optimize edilir
- **CDN**: Vercel'in global CDN'i kullanılır
- **Caching**: Akıllı önbellekleme stratejileri

## 🚀 Deployment

### Vercel'e Deploy
```bash
npm run build
vercel --prod
```

### Environment Variables
Vercel dashboard'da aşağıdaki environment variable'ları ekleyin:
- `BLOB_READ_WRITE_TOKEN`

## 📝 API Referansı

### BlobStorage Class
```typescript
// Dosya yükleme
uploadFile(file: File, pathname?: string): Promise<{url: string, pathname: string}>

// Çoklu dosya yükleme
uploadFiles(files: File[], folder?: string): Promise<Array<{url: string, pathname: string}>>

// Dosya silme
deleteFile(url: string): Promise<void>

// Dosya listeleme
listFiles(options?: {prefix?: string, limit?: number}): Promise<ListBlobResult>

// Resim yükleme (optimizasyonlu)
uploadImage(file: File, options?: ImageUploadOptions): Promise<{url: string, pathname: string}>

// Belge yükleme
uploadDocument(file: File, folder?: string): Promise<{url: string, pathname: string}>
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 Destek

- Email: support@garantitakipcim.com
- WhatsApp: +90 555 191 2663
- Website: https://garantitakipcim.com

## 🔄 Güncellemeler

### v1.1.0 - Vercel Blob Entegrasyonu
- ✅ Vercel Blob dosya depolama sistemi
- ✅ Dosya yükleme ve yönetim arayüzü
- ✅ Resim optimizasyonu
- ✅ Güvenli dosya erişimi
- ✅ Dosya yönetim paneli

### v1.0.0 - İlk Sürüm
- ✅ Temel sosyal medya panel özellikleri
- ✅ Kullanıcı yönetimi
- ✅ Sipariş sistemi
- ✅ Ödeme entegrasyonu