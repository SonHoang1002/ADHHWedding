# Thiệp cưới Huy Hiếu & Ánh Dương

Thiệp cưới online viết bằng Next.js (App Router) + React + TypeScript.

## Hai đường dẫn thiệp

| Thiệp | Đường dẫn |
| --- | --- |
| Nhà trai | `/huyhieu-anhduong` |
| Nhà gái | `/anhduong-huyhieu` |

Trang chủ `/` hiển thị 2 lựa chọn này.

### Cá nhân hoá tên khách mời

Thêm query `?to=<tên khách>` vào cuối đường dẫn:

```
/huyhieu-anhduong?to=Anh%20Nam
/anhduong-huyhieu?to=Ch%E1%BB%8B%20Hoa
```

Tên khách sẽ hiển thị ngay dưới dòng "TRÂN TRỌNG KÍNH MỜI" ở màn mở đầu thiệp.
Có thể dùng `?guest=` thay cho `?to=`.

Phía nhà trai/nhà gái cũng được dùng để:

- Đổi thứ tự tên trên thiệp (Huy Hiếu trước với nhà trai, Ánh Dương trước với nhà gái).
- Ưu tiên hiển thị các nghi lễ/tiệc của bên gửi thiệp.
- Mặc định sẵn lựa chọn "Bạn là khách mời của ai?" trong form xác nhận tham dự.
- Ưu tiên mã QR mừng cưới của bên tương ứng.

## Chạy project

```bash
npm install
npm run dev
```

Mở [http://localhost:3001](http://localhost:3001).

> Cổng dev mặc định là **3001** để không trùng với backend ở cổng 3000.

Build production:

```bash
npm run build
npm start
```

## Cấu hình backend

Mặc định project gọi backend ở:

- API: `http://localhost:3000/api`
- WebSocket: `ws://localhost:3000/ws`

Có thể ghi đè bằng biến môi trường (xem `.env.example`):

```bash
NEXT_PUBLIC_API_URL=https://api.example.com/api
NEXT_PUBLIC_WS_URL=wss://api.example.com/ws
```

## Cấu trúc chính

- `app/` – các route Next.js (`/`, `/huyhieu-anhduong`, `/anhduong-huyhieu`)
- `src/main/WeddingInvite.tsx` – giao diện thiệp
- `src/main/WeddingInvite.css` – style thiệp
- `src/Constant.tsx` – dữ liệu cô dâu, chú rể, sự kiện, timeline...
- `src/service/` – gọi API và WebSocket
- `public/photos`, `public/audio` – ảnh và nhạc của thiệp
