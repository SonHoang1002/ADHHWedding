import { useEffect, useRef, useState, FC, ReactElement } from "react";
import "./WeddingInvite.css";
import BackgroundHeartsLayer from "./BackgroundHeartLayer";

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
  location = "Vĩnh Yên, Phú Thọ",
  onComplete = () => { },
}): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);
  const [showImage, setShowImage] = useState<boolean>(false);
  const [showText, setShowText] = useState<boolean>(false);
  const timers = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const handleToggle = (): void => {
    setOpen((currentlyOpen: boolean) => {
      const next = !currentlyOpen;
      if (next) {
        // 1. Đợi nắp thiệp mở xong (650ms) -> Hiện ảnh scale ra từ giữa
        const imgTimer = setTimeout(() => {
          setShowImage(true);

          // 2. Đợi ảnh scale xong (700ms) -> Bắt đầu animation Text
          const textTimer = setTimeout(() => {
            setShowText(true);
            if (onComplete) {
              const callbackTimer = setTimeout(onComplete, 1200);
              timers.current.push(callbackTimer);
            }
          }, 700);
          timers.current.push(textTimer);

        }, 650);
        timers.current.push(imgTimer);
      } else {
        timers.current.forEach(clearTimeout);
        timers.current = [];
        setShowImage(false);
        setShowText(false);
      }
      return next;
    });
  };

  return (
    <div className="wedding-invite">
      <BackgroundHeartsLayer />

      <div className={`invite-content${open ? " is-open" : ""}`}>
        <div className="invite-heading">TRÂN TRỌNG KÍNH MỜI</div>
        <div className="invite-word">Em DẸO</div>

        <div
          className={`envelope${open ? " is-open" : ""}`}
          aria-label={open ? "Đóng thiệp mời" : "Mở thiệp mời"}
          aria-pressed={open}
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

      {/* ẢNH SCALE TỪ GIỮA MÀN HÌNH */}
      <img
        className={`center-burst-image${showImage ? " is-visible" : ""}`}
        src="/start_image_background.jpg"
        alt=""
        aria-hidden="true"
      />

      {/* CỤM TEXT ANIMATION TẠI VỊ TRÍ GIỮA MÀN HÌNH (50%, 50%) */}
      <div className={`center-text-overlay${showText ? " is-visible" : ""}`}>
        <div className="overlay-names">
          {groom} <span className="overlay-amp">&amp;</span> {bride}
        </div>
        <div className="overlay-divider" />
        <div className="overlay-date">{date}</div>
        <div className="overlay-location">{location}</div>
      </div>
    </div>
  );
};

export default WeddingInvite;