DropSpot, sınırlı stoklu ürünlerin yayınlandığı ve kullanıcıların bekleme listesine katılıp claim zamanı geldiğinde hak alabildiği basit bir drop platformudur. Admin kullanıcılar drop yönetimi yapabilir.


Kullanılan Teknolojiler
Backend: Node.js, Express, PostgreSQL (Docker)
Frontend: React (Vite), Axios
Kimlik Doğrulama: JWT

Özellikler
-Kullanıcı kayıt & giriş
-Drop listesi görüntüleme
-Waitlist’e katılma / ayrılma
-Claim zamanı gelince claim code alma
-Admin için drop ekleme, düzenleme, silme

API
-Auth: /auth/signup, /auth/login
-Drops: /drops, /drops/:id
-Waitlist: /drops/:id/join, /drops/:id/leave
-Claim: /drops/:id/claim
-Admin: /admin/drops (CRUD)
