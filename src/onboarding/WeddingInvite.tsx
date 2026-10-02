import { useEffect, useRef, useState, FC, ReactElement } from "react";
import "./WeddingInvite.css";

interface WeddingInviteProps {
  groom?: string;
  bride?: string;
  date?: string;
  location?: string;
  onComplete?: () => void;
}

const WeddingInvite: FC<WeddingInviteProps> = ({
  groom = "Huy Hiếu",
  bride = "Ánh Dương",
  date = "12.12.2026",
  location = "Hải Dương",
  onComplete = () => {},
}): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);
  const [envelopeGone, setEnvelopeGone] = useState<boolean>(false);
  const [showImage, setShowImage] = useState<boolean>(false);
  const [showText, setShowText] = useState<boolean>(false);
  const [calendarVisible, setCalendarVisible] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const timers = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  // Intersection Observer theo dõi khi người dùng cuộn tới phần Lịch
  useEffect(() => {
    if (!envelopeGone) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCalendarVisible(true);
          }
        });
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.25, // Kích hoạt sớm hơn một chút để animation sẵn sàng trước khi dừng cuộn
      }
    );

    if (calendarRef.current) {
      observer.observe(calendarRef.current);
    }

    return () => observer.disconnect();
  }, [envelopeGone]);

  const handleToggle = (): void => {
    if (open) return;
    setOpen(true);

    // 1. Mở nắp thiệp (600ms)
    const fadeEnvelopeTimer = setTimeout(() => {
      // 2. Ẩn thiệp, kích hoạt trang ảnh + cụm text
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

  const handleScrollDown = (): void => {
    calendarRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Dữ liệu tạo lịch Tháng 12/2026
  const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const calendarDays: Array<number | null> = [
    null, null, 1, 2, 3, 4, 5,
    6, 7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31
  ];

  return (
    <div className={`wedding-app-root${envelopeGone ? " is-scrollable" : ""}`}>
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
              <svg
                className="envelope-flap-line"
                viewBox="0 0 100 70"
                preserveAspectRatio="none"
              >
                <polyline
                  points="0,10 50,70 100,10"
                  fill="none"
                  stroke="#d9c48a"
                  strokeWidth="1"
                />
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

      {/* ================= CONTAINER CUỘN MƯỢT LIỀN MẠCH ================= */}
      {envelopeGone && (
        <div className="main-scroll-sections" ref={scrollContainerRef}>
          {/* TRANG 1: ẢNH CƯỚI & THÔNG TIN */}
          <section className="section-photo-hero">
            <img
              className={`center-burst-image${showImage ? " is-visible" : ""}`}
              src="/start_image_background.jpg"
              alt="Wedding Background"
            />

            <div className={`center-text-overlay${showText ? " is-visible" : ""}`}>
              <div className="overlay-names">
                {groom} <span className="overlay-amp">&amp;</span> {bride}
              </div>
              <div className="overlay-divider" />
              <div className="overlay-date">{date}</div>
              <div className="overlay-location">{location}</div>

              <button
                className="scroll-down-hint"
                onClick={handleScrollDown}
                title="Cuộn xuống xem lịch"
              >
                <span>LỊCH ĐÁM CƯỚI</span>
                <svg className="arrow-down-icon" viewBox="0 0 24 24">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" fill="currentColor" />
                </svg>
              </button>
            </div>
          </section>

          {/* TRANG 2: LỊCH THÁNG 12 / 2026 */}
          <section
            ref={calendarRef}
            className={`section-calendar${calendarVisible ? " is-animated" : ""}`}
          >
            <div className="calendar-card">
              <div className="calendar-header">
                <div className="calendar-subtitle">SAVE THE DATE</div>
                <h2 className="calendar-title">THÁNG 12 / 2026</h2>
                <div className="calendar-gold-line" />
              </div>

              <div className="calendar-grid-header">
                {daysOfWeek.map((day, idx) => (
                  <div key={idx} className="day-name">{day}</div>
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

              <div className="calendar-footer">
                <div className="wedding-countdown-tag">
                  <span>Huy Hiếu &amp; Ánh Dương</span>
                  <p>Rất hân hạnh được đón tiếp quý khách!</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default WeddingInvite;