import {
  useEffect,
  useRef,
  useState,
  FC,
  FormEvent,
  ReactElement,
  ReactNode,
  TouchEvent,
} from "react";
import "./WeddingInvite.css";
import {
  chuRe,
  coDau,
  danhSachSuKien,
  dresscode,
  lichTrinhLeCuoi,
  leCuoi,
  loiCamOn,
  loiNhanMau,
  thoiDiemCuoi,
  LoiNhan,
  SuKienCard,
} from "../Constant";

/* ============================================================
   DANH SÁCH ẢNH (quản lý tập trung tại đây)
   Ảnh nằm trong public/photos. Muốn đổi ảnh nào chỉ cần sửa path ở đây.
   ============================================================ */
const PHOTO_DIR = "/photos";

const IMAGES = {
  // Ảnh bìa sau khi mở thiệp
  hero: `${PHOTO_DIR}/start_image_background.jpg`,
  // Chú rể & Cô dâu
  groom: `${PHOTO_DIR}/groom.jpg`,
  bride: `${PHOTO_DIR}/bride.jpg`,
  // Ảnh cưới (dùng cho album, thẻ sự kiện, lời cảm ơn)
  wedding: [
    `${PHOTO_DIR}/IMG_20261016_210715.jpg`,
    `${PHOTO_DIR}/IMG_20261016_210752.jpg`,
    `${PHOTO_DIR}/IMG_20261016_210754.jpg`,
    `${PHOTO_DIR}/IMG_20261016_210802.jpg`,
    `${PHOTO_DIR}/IMG_20261016_210804.jpg`,
  ],
  // Mã QR mừng cưới (đặt file vào public/photos, có thể đổi đuôi .png/.jpg tuỳ file thật)
  qr: {
    groom: `${PHOTO_DIR}/qr_groom.png`,
    bride: `${PHOTO_DIR}/qr_bride.png`,
  },
};

// Album: 5 ảnh cưới + ảnh cô dâu, chú rể (tạm thời, có thể lặp)
const GALLERY_IMAGES: string[] = [...IMAGES.wedding, IMAGES.bride, IMAGES.groom];
// Thẻ sự kiện: xoay vòng các ảnh cưới
const EVENT_IMAGES: string[] = IMAGES.wedding;
// Lời cảm ơn
const THANKS_IMAGE: string = IMAGES.wedding[4];

/* ============================================================
   TIỆN ÍCH
   ============================================================ */
const enc = encodeURIComponent;
const pad = (n: number): string => String(n).padStart(2, "0");

const formatTime = (iso: string): string =>
  new Date(iso).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

// Ảnh lỗi/thiếu thì ẩn đi, để nền placeholder của khung hiển thị
const SafeImg: FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
  const [failed, setFailed] = useState<boolean>(false);
  if (failed) return null;
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
};

// Hiện dần khi cuộn tới (fade + các kiểu chuyển động khác nhau)
type Anim = "up" | "fade" | "left" | "right" | "zoom" | "rotate" | "flip" | "none";

const Reveal: FC<{
  children: ReactNode;
  className?: string;
  anim?: Anim;
  delay?: number;
  threshold?: number;
}> = ({ children, className = "", anim = "up", delay = 0, threshold = 0.2 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const base = anim === "none" ? "" : `reveal anim-${anim} `;
  return (
    <div
      ref={ref}
      className={`${base}${className}${visible ? " is-in" : ""}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};

const SectionTitle: FC<{ sub?: string; title: string }> = ({ sub, title }) => (
  <Reveal className="section-title">
    {sub && <div className="section-sub">{sub}</div>}
    <h2 className="section-heading">{title}</h2>
    <div className="section-line" />
  </Reveal>
);

/* ============================================================
   THẺ SỰ KIỆN (collapse / expand Google Map)
   ============================================================ */
const EventCard: FC<{ item: SuKienCard; index: number }> = ({ item, index }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  const toggle = (): void => {
    setExpanded((v) => !v);
    setLoaded(true); // chỉ nạp iframe khi bấm mở lần đầu
  };

  return (
    <Reveal className="event-card" delay={index * 60} anim={index % 2 ? "right" : "left"}>
      <div className="event-photo">
        <SafeImg src={item.anh} alt={item.ten} />
      </div>
      <div className="event-body">
        <h3 className="event-title">{item.ten}</h3>
        <div className="event-row">
          <span className="event-label">Ngày giờ</span>
          <span>
            {item.thoiGian} · {item.ngay}
            <em className="event-lunar">{item.ngayAm}</em>
          </span>
        </div>
        <div className="event-row">
          <span className="event-label">Địa điểm</span>
          <span>{item.diaDiem}</span>
        </div>

        <button type="button" className="event-map-toggle" onClick={toggle} aria-expanded={expanded}>
          {expanded ? "Thu gọn bản đồ" : "Xem bản đồ"}
          <svg viewBox="0 0 24 24" className={`chevron${expanded ? " is-up" : ""}`}>
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" fill="currentColor" />
          </svg>
        </button>

        <div className={`event-map${expanded ? " is-open" : ""}`}>
          {loaded && (
            <iframe
              title={`Bản đồ ${item.ten}`}
              src={`https://maps.google.com/maps?q=${enc(item.diaChi)}&z=16&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
          <a
            className="event-directions"
            href={`https://www.google.com/maps/search/?api=1&query=${enc(item.diaChi)}`}
            target="_blank"
            rel="noreferrer"
          >
            Chỉ đường trên Google Maps
          </a>
        </div>
      </div>
    </Reveal>
  );
};

/* ============================================================
   CAROUSEL ẢNH TOÀN MÀN HÌNH
   ============================================================ */
const GalleryCarousel: FC<{ images: string[]; startIndex: number; onClose: () => void }> = ({
  images,
  startIndex,
  onClose,
}) => {
  const [index, setIndex] = useState<number>(startIndex);
  const touchX = useRef<number | null>(null);

  const go = (delta: number): void =>
    setIndex((i) => Math.min(images.length - 1, Math.max(0, i + delta)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  const onTouchStart = (e: TouchEvent<HTMLDivElement>): void => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: TouchEvent<HTMLDivElement>): void => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <div className="carousel-overlay" role="dialog" aria-modal="true">
      <button className="overlay-close" onClick={onClose} aria-label="Đóng">
        ✕
      </button>
      <div className="carousel-viewport" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {images.map((src, i) => (
            <div className="carousel-slide" key={`${src}-${i}`}>
              {Math.abs(i - index) <= 1 && <SafeImg src={src} alt={`Ảnh cưới ${i + 1}`} />}
            </div>
          ))}
        </div>
      </div>
      <button className="carousel-nav prev" onClick={() => go(-1)} disabled={index === 0} aria-label="Ảnh trước">
        ‹
      </button>
      <button
        className="carousel-nav next"
        onClick={() => go(1)}
        disabled={index === images.length - 1}
        aria-label="Ảnh sau"
      >
        ›
      </button>
      <div className="carousel-counter">
        {index + 1} / {images.length}
      </div>
    </div>
  );
};

/* ============================================================
   COUNTDOWN
   ============================================================ */
const Countdown: FC<{ target: number }> = ({ target }) => {
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  const units = [
    { label: "Ngày", value: Math.floor(diff / 86400000) },
    { label: "Giờ", value: Math.floor(diff / 3600000) % 24 },
    { label: "Phút", value: Math.floor(diff / 60000) % 60 },
    { label: "Giây", value: Math.floor(diff / 1000) % 60 },
  ];

  return (
    <div className="countdown-grid">
      {units.map((u) => (
        <div className="countdown-box" key={u.label}>
          <div className="countdown-value">{pad(u.value)}</div>
          <div className="countdown-label">{u.label}</div>
        </div>
      ))}
    </div>
  );
};

/* ============================================================
   LỜI NHẮN
   ============================================================ */
const WishItem: FC<{ wish: LoiNhan }> = ({ wish }) => (
  <div className="wish-item">
    <div className="wish-head">
      <span className="wish-name">{wish.ten}</span>
      {wish.bietDanh && <span className="wish-nick">({wish.bietDanh})</span>}
    </div>
    <p className="wish-content">{wish.noiDung}</p>
    <div className="wish-time">{formatTime(wish.thoiGian)}</div>
  </div>
);

const WishesModal: FC<{ wishes: LoiNhan[]; onClose: () => void }> = ({ wishes, onClose }) => (
  <div className="carousel-overlay wishes-overlay" role="dialog" aria-modal="true">
    <button className="overlay-close" onClick={onClose} aria-label="Đóng">
      ✕
    </button>
    <div className="wishes-modal">
      <h3 className="wishes-modal-title">Tất cả lời nhắn ({wishes.length})</h3>
      <div className="wishes-modal-list">
        {wishes.map((w) => (
          <WishItem key={w.id} wish={w} />
        ))}
      </div>
    </div>
  </div>
);

/* ============================================================
   FORM XÁC NHẬN THAM DỰ
   ============================================================ */
export interface RsvpData {
  ten: string;
  noiDung: string;
  thamDu: "co" | "khong";
  soLuong: number;
  khachCua: "chu-re" | "co-dau";
}

const RsvpForm: FC<{ onSubmit: (data: RsvpData) => void | Promise<void> }> = ({ onSubmit }) => {
  const [ten, setTen] = useState<string>("");
  const [noiDung, setNoiDung] = useState<string>("");
  const [thamDu, setThamDu] = useState<string>("");
  const [soLuong, setSoLuong] = useState<string>("");
  const [khachCua, setKhachCua] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!ten.trim() || !thamDu || !khachCua) {
      setError("Bạn vui lòng nhập tên, chọn tham dự và khách mời của ai nhé!");
      return;
    }
    setError("");
    setSending(true);
    try {
      await onSubmit({
        ten: ten.trim(),
        noiDung: noiDung.trim(),
        thamDu: thamDu as RsvpData["thamDu"],
        soLuong: thamDu === "co" ? Math.max(0, Number(soLuong) || 0) : 0,
        khachCua: khachCua as RsvpData["khachCua"],
      });
      setSent(true);
      setTen("");
      setNoiDung("");
      setThamDu("");
      setSoLuong("");
      setKhachCua("");
    } catch {
      setError("Gửi chưa được, bạn thử lại giúp chúng mình nhé.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="rsvp-sent">
        <div className="rsvp-sent-icon">♥</div>
        <p>Cảm ơn bạn! Chúng mình đã nhận được lời nhắn và xác nhận của bạn.</p>
        <button type="button" className="rsvp-link" onClick={() => setSent(false)}>
          Gửi thêm lời nhắn
        </button>
      </div>
    );
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit} noValidate>
      <p className="rsvp-intro">
        Hãy xác nhận sự có mặt của bạn để chúng mình chuẩn bị đón tiếp một cách chu đáo nhất.
        <br />
        Trân trọng!
      </p>
      <input
        className="rsvp-field"
        type="text"
        placeholder="Tên của bạn"
        value={ten}
        onChange={(e) => setTen(e.target.value)}
      />
      <textarea
        className="rsvp-field rsvp-textarea"
        placeholder="Gửi lời nhắn đến cô dâu chú rể"
        value={noiDung}
        onChange={(e) => setNoiDung(e.target.value)}
      />
      <select className="rsvp-field" value={thamDu} onChange={(e) => setThamDu(e.target.value)}>
        <option value="" disabled>
          Bạn sẽ đến chứ?
        </option>
        <option value="co">Mình sẽ đến</option>
        <option value="khong">Rất tiếc, mình không đến được</option>
      </select>
      <input
        className="rsvp-field"
        type="number"
        min={0}
        inputMode="numeric"
        placeholder="Số lượng tham dự cùng?"
        value={soLuong}
        disabled={thamDu === "khong"}
        onChange={(e) => setSoLuong(e.target.value)}
      />
      <select className="rsvp-field" value={khachCua} onChange={(e) => setKhachCua(e.target.value)}>
        <option value="" disabled>
          Bạn là khách mời của ai?
        </option>
        <option value="chu-re">Khách mời của Chú rể</option>
        <option value="co-dau">Khách mời của Cô dâu</option>
      </select>
      {error && <div className="rsvp-error">{error}</div>}
      <button className="rsvp-submit" type="submit" disabled={sending}>
        {sending ? "ĐANG GỬI..." : "GỬI LỜI NHẮN & XÁC NHẬN"}
      </button>
    </form>
  );
};

/* ============================================================
   PHONG BAO MỪNG CƯỚI + 2 MÃ QR
   ============================================================ */
const QR_ITEMS = [
  { key: "groom", label: "Chú rể", src: IMAGES.qr.groom, file: "qr-chu-re" },
  { key: "bride", label: "Cô dâu", src: IMAGES.qr.bride, file: "qr-co-dau" },
];

// Tải ảnh về máy. Nếu không tải được (file thiếu / trình duyệt chặn) thì mở ảnh ở tab mới
const downloadImage = async (src: string, fileBase: string): Promise<void> => {
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    if (!res.ok || !blob.type.startsWith("image/")) throw new Error("not an image");
    const ext = src.split(".").pop() || "png";
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileBase}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch {
    window.open(src, "_blank");
  }
};

const QrPic: FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [failed, setFailed] = useState<boolean>(false);
  if (failed) return <span className="gift-qr-empty">QR</span>;
  return <img src={src} alt={alt} onError={() => setFailed(true)} />;
};

const GiftEnvelope: FC = () => {
  const [opened, setOpened] = useState<boolean>(false);

  return (
    <div className={`gift${opened ? " is-open" : ""}`}>
      <div className="gift-stage">
        {/* Lớp sau phong bì: thân + nắp mở */}
        <div className="gift-layer gift-layer-back">
          <span className="gift-flap" />
          <span className="gift-back" />
        </div>

        {/* 2 thẻ QR: ban đầu chỉ ló ra khỏi phong bì, khi mở thì bay ra giữa */}
        {QR_ITEMS.map((q, i) => (
          <div key={q.key} className={`gift-card ${i === 0 ? "gift-card-left" : "gift-card-right"}`}>
            <div className="gift-qr">
              <QrPic src={q.src} alt={`Mã QR mừng cưới ${q.label}`} />
            </div>
            <div className="gift-card-label">{q.label}</div>
          </div>
        ))}

        {/* Lớp trước phong bì: túi + con dấu */}
        <div className="gift-layer gift-layer-front">
          <span className="gift-pocket" />
          <svg className="gift-pocket-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline points="0,30 50,64 100,30" fill="none" stroke="#c9b88f" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="gift-seal">&#10047;</span>
        </div>

        <button
          type="button"
          className="gift-hit"
          onClick={() => setOpened(true)}
          disabled={opened}
          aria-label="Mở phong bao mừng cưới"
        />
      </div>

      <p className="gift-hint">Chạm để mở phong bao</p>

      <div className="gift-actions">
        {QR_ITEMS.map((q) => (
          <button
            key={q.key}
            type="button"
            className="btn-outline gift-download"
            onClick={() => downloadImage(q.src, q.file)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11 3h2v10.17l3.59-3.58L18 11l-6 6-6-6 1.41-1.41L11 13.17V3zM5 19h14v2H5z" fill="currentColor" />
            </svg>
            Tải mã QR
          </button>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   COMPONENT CHÍNH
   ============================================================ */
interface WeddingInviteProps {
  groom?: string;
  bride?: string;
  date?: string;
  location?: string;
  onComplete?: () => void;
  /** Gọi khi khách gửi xác nhận (gắn API / WebSocket tại đây) */
  onSubmitRsvp?: (data: RsvpData) => void | Promise<void>;
  /** Danh sách lời nhắn ban đầu (sau này đẩy realtime qua WebSocket) */
  wishes?: LoiNhan[];
}

const WeddingInvite: FC<WeddingInviteProps> = ({
  groom = "Huy Hiếu",
  bride = "Ánh Dương",
  date = "12.12.2026",
  onComplete = () => {},
  onSubmitRsvp,
  wishes: initialWishes = loiNhanMau,
}): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);
  const [envelopeGone, setEnvelopeGone] = useState<boolean>(false);
  const [showImage, setShowImage] = useState<boolean>(false);
  const [showText, setShowText] = useState<boolean>(false);
  const [carouselIndex, setCarouselIndex] = useState<number | null>(null);
  const [wishes, setWishes] = useState<LoiNhan[]>(initialWishes);
  const [wishesOpen, setWishesOpen] = useState<boolean>(false);
  const [musicPlaying, setMusicPlaying] = useState<boolean>(false);

  const calendarRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const openedRef = useRef<boolean>(false); // true sau khi khách đã mở thiệp
  const userPausedRef = useRef<boolean>(false); // true khi khách chủ động tắt nhạc
  const timers = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timers.current.forEach(clearTimeout);
    };
  }, []);

  // Sau khi mở thiệp, nhạc chạy liên tục: nếu bị hệ thống ngắt (khoá màn hình, đổi tab...)
  // thì tự phát lại khi quay về, trừ khi khách chủ động tắt.
  // Trước khi mở thiệp thì tuyệt đối không phát.
  useEffect(() => {
    const resume = (): void => {
      const audio = audioRef.current;
      if (
        audio &&
        openedRef.current &&
        audio.paused &&
        !userPausedRef.current &&
        !document.hidden
      ) {
        audio.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("focus", resume);
    window.addEventListener("pageshow", resume);
    return () => {
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("focus", resume);
      window.removeEventListener("pageshow", resume);
    };
  }, []);

  // Đồng bộ khi prop wishes thay đổi (ví dụ nhận từ WebSocket)
  useEffect(() => {
    setWishes(initialWishes);
  }, [initialWishes]);

  const handleToggle = (): void => {
    if (open) return;
    setOpen(true);
    openedRef.current = true;
    userPausedRef.current = false;
    audioRef.current?.play().catch(() => {});

    const fadeEnvelopeTimer = setTimeout(() => {
      setEnvelopeGone(true);
      setShowImage(true);

      const textTimer = setTimeout(() => {
        setShowText(true);
        if (onComplete) {
          const callbackTimer = setTimeout(onComplete, 400);
          timers.current.push(callbackTimer);
        }
      }, 400);
      timers.current.push(textTimer);
    }, 600);
    timers.current.push(fadeEnvelopeTimer);
  };

  const toggleMusic = (): void => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      userPausedRef.current = false;
      audio.play().catch(() => setMusicPlaying(false));
    } else {
      userPausedRef.current = true;
      audio.pause();
    }
  };

  /* ----- Lịch ----- */
  const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  // Tháng 12/2026 bắt đầu vào Thứ Ba
  const calendarDays: Array<number | null> = [
    null, null, 1, 2, 3, 4, 5,
    6, 7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31,
  ];

  /* ----- Ảnh ----- */
  const galleryAnims: Anim[] = ["fade", "left", "right", "zoom", "rotate", "flip"];
  const previewImages = GALLERY_IMAGES.slice(0, 6);

  // Gán ảnh cho các thẻ sự kiện (xoay vòng nếu số sự kiện nhiều hơn số ảnh)
  const events: SuKienCard[] = danhSachSuKien.map((item, i) => ({
    ...item,
    anh: EVENT_IMAGES[i % EVENT_IMAGES.length],
  }));

  /* ----- RSVP ----- */
  const handleRsvp = async (data: RsvpData): Promise<void> => {
    if (onSubmitRsvp) await onSubmitRsvp(data);
    if (data.noiDung) {
      const newWish: LoiNhan = {
        id: `local-${Date.now()}`,
        ten: data.ten,
        noiDung: data.noiDung,
        thoiGian: new Date().toISOString(),
      };
      setWishes((prev) => [newWish, ...prev]);
    }
  };

  const sortedWishes = [...wishes].sort(
    (a, b) => new Date(b.thoiGian).getTime() - new Date(a.thoiGian).getTime()
  );

  return (
    <div className={`wedding-app-root${envelopeGone ? " is-scrollable" : ""}`}>
      {/* ================= NHẠC NỀN ================= */}
      <audio
        ref={audioRef}
        src="/audio/wedding_audio.mp3"
        loop
        preload="auto"
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
        onEnded={(e) => {
          // dự phòng nếu trình duyệt không lặp: phát lại từ đầu
          e.currentTarget.currentTime = 0;
          e.currentTarget.play().catch(() => {});
        }}
      />

      {/* Nút nhạc chỉ hiện sau khi đã mở thiệp */}
      {open && (
        <button
          type="button"
          className={`music-btn${musicPlaying ? " is-playing" : ""}`}
          onClick={toggleMusic}
          aria-label={musicPlaying ? "Tắt nhạc" : "Bật nhạc"}
          aria-pressed={musicPlaying}
          title={musicPlaying ? "Tắt nhạc" : "Bật nhạc"}
        >
          <svg className="music-disc" viewBox="0 0 48 48" aria-hidden="true">
            <circle cx="24" cy="24" r="22" fill="#2a0709" stroke="#d9c48a" strokeWidth="1.5" />
            <circle cx="24" cy="24" r="17" fill="none" stroke="rgba(217,196,138,0.35)" strokeWidth="0.8" />
            <circle cx="24" cy="24" r="12.5" fill="none" stroke="rgba(217,196,138,0.25)" strokeWidth="0.8" />
            <circle cx="24" cy="24" r="8.5" fill="#6e1a20" />
            {/* Nốt nhạc đôi, đã căn đúng tâm đĩa (24,24) */}
            <g fill="#f3d69b" transform="translate(24 24) scale(0.82) translate(-23.75 -24.92)">
              <ellipse cx="19" cy="31" rx="3.5" ry="2.6" transform="rotate(-20 19 31)" />
              <ellipse cx="28.5" cy="28.6" rx="3.5" ry="2.6" transform="rotate(-20 28.5 28.6)" />
              <rect x="21.4" y="17.6" width="1.5" height="13" />
              <rect x="30.9" y="15.2" width="1.5" height="13" />
              <polygon points="21.4,17.6 32.4,15.2 32.4,19.2 21.4,21.6" />
            </g>
          </svg>
          {!musicPlaying && <span className="music-slash" />}
        </button>
      )}

      {/* Background trái tim lơ lửng */}
      <div className="background-hearts-layer">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="falling-heart"
            style={{
              left: `${(i * 8.5) % 95}%`,
              animationDuration: `${6 + (i % 4) * 2}s`,
              animationDelay: `${(i % 3) * 1.5}s`,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      {/* ================= THIỆP MỜI BAN ĐẦU ================= */}
      {!envelopeGone && (
        <div className="envelope-initial-screen">
          <div className={`invite-content${open ? " is-opening" : ""}`}>
            <div className="invite-heading">TRÂN TRỌNG KÍNH MỜI</div>
            <div className="invite-word">Em DẸO</div>

            <div
              className={`envelope${open ? " is-open" : ""}`}
              aria-label="Mở thiệp mời"
              onClick={handleToggle}
            >
              <span className="envelope-back" />
              <span className="envelope-side-fold envelope-side-fold-left" />
              <span className="envelope-side-fold envelope-side-fold-right" />
              <span className="envelope-bottom-fold" />
              <svg className="envelope-flap-line" viewBox="0 0 100 70" preserveAspectRatio="none">
                <polyline points="0,10 50,70 100,10" fill="none" stroke="#d9c48a" strokeWidth="1" />
              </svg>
              <span className="envelope-flap">
                <span className="envelope-flap-shadow" />
              </span>
              <span className="envelope-seal">&#10047;</span>
            </div>

            <div className="invite-details">
              <div className="names-stage">
                <div className="names-row">
                  <div className="name-piece">{groom}</div>
                  <div className="amp">&amp;</div>
                  <div className="name-piece">{bride}</div>
                </div>
              </div>
              <div className="date">{date}</div>
            </div>
          </div>
        </div>
      )}

      {/* ================= NỘI DUNG CUỘN ================= */}
      {envelopeGone && (
        <div className="main-scroll-sections">
          {/* ===== BÌA: ẢNH CƯỚI ===== */}
          <section className="section-photo-hero">
            <img
              className={`center-burst-image${showImage ? " is-visible" : ""}`}
              src={IMAGES.hero}
              alt="Wedding Background"
            />

            <div className={`center-text-overlay${showText ? " is-visible" : ""}`}>
              <div className="overlay-names">
                {groom} <span className="overlay-amp">&amp;</span> {bride}
              </div>
              <div className="overlay-divider" />
              <div className="overlay-date">{date}</div>
            </div>
          </section>

          <div className="content-flow">
            {/* ===== 1) LỊCH ===== */}
            <section ref={calendarRef} className="page-section section-calendar">
              <Reveal anim="none" className="calendar-card" threshold={0.25}>
                <div className="calendar-header">
                  <h2 className="calendar-title">THÁNG 12 / 2026</h2>
                  <div className="calendar-subtitle">SAVE THE DATE</div>
                  <div className="calendar-gold-line" />
                </div>

                <div className="calendar-grid-header">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="day-name">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="calendar-grid">
                  {calendarDays.map((d, idx) => {
                    const isWeddingDay = d === 12;
                    return (
                      <div
                        key={idx}
                        className={`calendar-cell${d === null ? " empty" : ""}${isWeddingDay ? " wedding-day" : ""}`}
                        style={{ animationDelay: `${idx * 18 + 120}ms` }}
                      >
                        {d && (
                          <span className="day-number">
                            {d}
                            {isWeddingDay && (
                              <span className="heart-highlight" title="Ngày cưới">
                                <svg viewBox="0 0 32 32" className="heart-svg">
                                  <path d="M16 28.5C16 28.5 3 20.2 3 11.5C3 6.8 6.8 3 11.5 3C14.1 3 16 4.2 16 4.2C16 4.2 17.9 3 20.5 3C25.2 3 29 6.8 29 11.5C29 20.2 16 28.5 16 28.5Z" />
                                </svg>
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            </section>

            {/* ===== 2) CHÚ RỂ & CÔ DÂU ===== */}
            <section className="page-section section-couple">
              <SectionTitle sub="Gia đình hai bên" title="Chú rể & Cô dâu" />

              <div className="person-list">
                <Reveal className="person-card" anim="left">
                  <div className="person-photo">
                    <SafeImg src={IMAGES.groom} alt={chuRe.tenDayDu} />
                  </div>
                  <div className="person-role">Chú rể</div>
                  <h3 className="person-name">{chuRe.tenDayDu}</h3>
                  <p className="person-parents">
                    Con trai ông <b>{chuRe.bo}</b>
                    <br />
                    và bà <b>{chuRe.me}</b>
                  </p>
                  <p className="person-home">{chuRe.queQuan}</p>
                </Reveal>

                <Reveal className="person-card" anim="right" delay={120}>
                  <div className="person-photo">
                    <SafeImg src={IMAGES.bride} alt={coDau.tenDayDu} />
                  </div>
                  <div className="person-role">Cô dâu</div>
                  <h3 className="person-name">{coDau.tenDayDu}</h3>
                  <p className="person-parents">
                    Con gái ông <b>{coDau.bo}</b>
                    <br />
                    và bà <b>{coDau.me}</b>
                  </p>
                  <p className="person-home">{coDau.queQuan}</p>
                </Reveal>
              </div>
            </section>

            {/* ===== 3) NGÀY TRỌNG ĐẠI ===== */}
            <section className="page-section section-events">
              <SectionTitle sub="Trân trọng kính mời" title="Ngày trọng đại" />
              <div className="event-list">
                {events.map((item, i) => (
                  <EventCard key={item.id} item={item} index={i} />
                ))}
              </div>
            </section>

            {/* ===== 4) DRESSCODE ===== */}
            <section className="page-section section-dresscode">
              <SectionTitle sub="Gợi ý trang phục" title="Dresscode" />
              <div className="dress-list">
                {dresscode.map((c, i) => (
                  <Reveal key={c.mau} className="dress-item" anim="zoom" delay={i * 100}>
                    <span className="dress-circle" style={{ background: c.mau }} />
                    <span className="dress-name">{c.ten}</span>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* ===== 5) TIMELINE ===== */}
            <section className="page-section section-timeline">
              <SectionTitle sub={`Ngày ${leCuoi.ngayDuongLich}`} title="Timeline" />
              <div className="timeline">
                {lichTrinhLeCuoi.map((item, i) => (
                  <Reveal key={item.thoiGian + item.suKien} className="timeline-item" delay={i * 60}>
                    <div className="timeline-time">
                      <b>{item.thoiGian}</b>
                      <span>{leCuoi.ngayDuongLich}</span>
                    </div>
                    <div className="timeline-dot" />
                    <div className="timeline-text">{item.suKien}</div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* ===== 6) HÌNH ẢNH ===== */}
            <section className="page-section section-gallery">
              <SectionTitle sub="Khoảnh khắc" title="Album hình cưới" />
              <div className="gallery-grid">
                {previewImages.map((src, i) => (
                  <Reveal
                    key={`${src}-${i}`}
                    anim={galleryAnims[i % galleryAnims.length]}
                    delay={(i % 2) * 120}
                    className="gallery-item"
                  >
                    <button
                      type="button"
                      className="gallery-btn"
                      onClick={() => setCarouselIndex(i)}
                      aria-label={`Xem ảnh ${i + 1}`}
                    >
                      <SafeImg src={src} alt={`Ảnh cưới ${i + 1}`} />
                    </button>
                  </Reveal>
                ))}
              </div>
              <button type="button" className="btn-outline gallery-all" onClick={() => setCarouselIndex(0)}>
                Xem tất cả ({GALLERY_IMAGES.length} ảnh)
              </button>
            </section>

            {/* ===== 7) COUNTDOWN ===== */}
            <section className="page-section section-countdown">
              <SectionTitle sub="Chỉ còn" title="Đếm ngược" />
              <Reveal anim="zoom">
                <Countdown target={new Date(thoiDiemCuoi.batDau).getTime()} />
              </Reveal>
            </section>

            {/* ===== 8) LỜI NHẮN CÓ SẴN ===== */}
            <section className="page-section section-wishes">
              <SectionTitle sub="Sổ lưu bút" title="Lời chúc từ mọi người" />
              <div className="wish-list">
                {sortedWishes.slice(0, 3).map((w, i) => (
                  <Reveal key={w.id} delay={i * 80}>
                    <WishItem wish={w} />
                  </Reveal>
                ))}
              </div>
              {sortedWishes.length > 3 && (
                <button type="button" className="btn-outline" onClick={() => setWishesOpen(true)}>
                  Xem tất cả ({sortedWishes.length})
                </button>
              )}
            </section>

            {/* ===== 9) LỜI NHẮN & XÁC NHẬN THAM DỰ ===== */}
            <section className="page-section section-rsvp">
              <SectionTitle sub="Xác nhận tham dự" title="Gửi lời nhắn" />
              <Reveal className="rsvp-wrap">
                <RsvpForm onSubmit={handleRsvp} />
              </Reveal>
            </section>

            {/* ===== 10) PHONG BAO MỪNG CƯỚI (2 MÃ QR) ===== */}
            <section className="page-section section-gift">
              <SectionTitle sub="Gửi lời chúc & quà mừng" title="Phong bao mừng cưới" />
              <Reveal anim="up">
                <GiftEnvelope />
              </Reveal>
            </section>

            {/* ===== 11) LỜI CẢM ƠN ===== */}
            <section className="page-section section-thanks">
              <Reveal anim="zoom" className="thanks-photo">
                <SafeImg src={THANKS_IMAGE} alt="Lời cảm ơn" />
              </Reveal>
              <Reveal className="thanks-body" delay={120}>
                <div className="thanks-script">Cảm ơn</div>
                <p className="thanks-text">{loiCamOn}</p>
                <div className="thanks-names">
                  {groom} &amp; {bride}
                </div>
              </Reveal>
            </section>
          </div>
        </div>
      )}

      {carouselIndex !== null && (
        <GalleryCarousel images={GALLERY_IMAGES} startIndex={carouselIndex} onClose={() => setCarouselIndex(null)} />
      )}
      {wishesOpen && <WishesModal wishes={sortedWishes} onClose={() => setWishesOpen(false)} />}
    </div>
  );
};

export default WeddingInvite;