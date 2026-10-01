import { useEffect, useRef, useState, FC, ReactElement } from "react";
import "./WeddingInvite.css";
import BackgroundHeartsLayer from "./BackgroundHeartLayer";
import { chuRe, coDau, ngayChinhThuc } from "../Constant";

interface WeddingInviteProps {
  groom?: string;
  bride?: string;
  date?: string;
  onComplete?: () => void;
}

const WeddingInvite: FC<WeddingInviteProps> = ({
  groom = chuRe.ten,
  bride = coDau.ten,
  date = ngayChinhThuc,
  onComplete = () => { },
}): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);
  const [stage, setStage] = useState<"idle" | "up200" | "scaleCenter">("idle");
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
        // Giai đoạn 1: Chờ nắp mở (650ms) -> Ảnh bay dọc lên trên 200px
        const timer1 = setTimeout(() => {
          setStage("up200");

          // Giai đoạn 2: Nhô lên xong (sau 600ms) -> Chuyển sang scale up từ giữa màn hình
          const timer2 = setTimeout(() => {
            setStage("scaleCenter");
            if (onComplete) {
              const callbackTimer = setTimeout(onComplete, 800);
              timers.current.push(callbackTimer);
            }
          }, 600);
          timers.current.push(timer2);

        }, 650);
        timers.current.push(timer1);
      } else {
        timers.current.forEach(clearTimeout);
        timers.current = [];
        setStage("idle");
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

          {/* CHỈ DÙNG 1 ẢNH DUY NHẤT */}
          <img
            className={`envelope-image ${stage === "up200" ? "is-up200" : ""} ${stage === "scaleCenter" ? "is-scale-center" : ""}`}
            src="/start_image_background.jpg"
            alt=""
          />

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
  );
};

export default WeddingInvite;