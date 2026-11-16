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
Nếu đường dẫn không có `?to=`, dòng "TRÂN TRỌNG KÍNH MỜI" cùng tên khách sẽ không hiển thị.

> **Mẹo:** dùng công cụ **"Tạo link mời khách"** ngay trên trang chủ `/` – chỉ cần gõ tên
> (vd `Em Hải Anh`) và bấm Copy, link sẽ được encode đúng chuẩn tiếng Việt.

Link bị lỗi encode khi tạo ở nơi khác (encode 2 lần, mojibake `Háº£i`, ký tự tách rời `Hải`)
cũng được tự động sửa lại thành text tiếng Việt đúng khi mở thiệp – xem `src/utils/guest.ts`.

Phía nhà trai/nhà gái cũng được dùng để:

- Đổi thứ tự tên trên thiệp (Huy Hiếu trước với nhà trai, Ánh Dương trước với nhà gái).
- Ưu tiên hiển thị các nghi lễ/tiệc của bên gửi thiệp.
- Mặc định sẵn lựa chọn "Bạn là khách mời của ai?" trong form xác nhận tham dự.
- Ưu tiên mã QR mừng cưới của bên tương ứng.

## Chạy project

Cần chạy **2 terminal** – backend trước, frontend sau:

```bash
# Terminal 1 – backend (project `wedding-server` nằm cạnh thư mục này, cổng 3000)
cd ../wedding-server
bun install
bun run index.ts

# Terminal 2 – frontend thiệp (cổng 3002)
npm install
npm run dev
```

Mở [http://localhost:3002](http://localhost:3002).

> Không chạy backend thì thiệp vẫn mở được, nhưng phần "Lời chúc" sẽ không tải được
> (console hiện `Không thể tải danh sách tin nhắn: TypeError: Failed to fetch`
> tại `fetch(url)` trong `src/service/ApiService.ts`).

Build production:

```bash
npm run build
npm start
```

## Cấu hình backend

Mặc định project gọi backend ở:

- API: `https://wedding-server-02n8.onrender.com/api`
- WebSocket: `wss://wedding-server-02n8.onrender.com/ws`

Có thể ghi đè bằng biến môi trường (xem `.env.example`):

```bash
NEXT_PUBLIC_API_URL=https://wedding-server-02n8.onrender.com/api
NEXT_PUBLIC_WS_URL=wss://wedding-server-02n8.onrender.com/ws
```

## Cache lời chúc

Danh sách lời chúc tải thành công được lưu tối đa **20 tin mới nhất** vào `localStorage`
(key `adhh-wedding:wishes:v1`). Khi API/WebSocket lời chúc không truy cập được, thiệp vẫn
hiển thị các lời chúc đã cache từ lần mở trước thay vì để trống.

## Cấu trúc chính

- `app/` – các route Next.js (`/`, `/huyhieu-anhduong`, `/anhduong-huyhieu`)
- `src/main/WeddingInvite.tsx` – giao diện thiệp
- `src/main/WeddingInvite.css` – style thiệp
- `src/Constant.tsx` – dữ liệu cô dâu, chú rể, sự kiện, timeline...
- `src/service/` – gọi API và WebSocket
- `public/photos`, `public/audio` – ảnh và nhạc của thiệp
