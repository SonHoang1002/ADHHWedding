import {
  FC,
  FormEvent,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BackgroundHeartsLayer from "../onboarding/BackgroundHeartLayer";
import { inviteData as d } from "./inviteData";
import "./invites.css";
import "./PinkInvite.css";

const PHOTO = `${process.env.PUBLIC_URL}/onboarding_flower.png`;
const P = `${process.env.PUBLIC_URL}/photos`;
const IMG = {
  groom: `${P}/groom.webp`,
  bride: `${P}/bride.webp`,
  events: [
    `${P}/cover-couple.jpg`,
    `${P}/venue-gai.webp`,
    `${P}/venue-trai.webp`,
    `${P}/story.webp`,
  ],
  album: [
    `${P}/g1.webp`,
    `${P}/g4.webp`,
    `${P}/countdown.webp`,
    `${P}/thanks.webp`,
    `${P}/cover-couple.jpg`,
    `${P}/story.webp`,
  ],
  countdown: `${P}/countdown.webp`,
  thanks: `${P}/thanks.webp`,
};
const WEDDING_AT = new Date("2026-12-12T07:00:00+07:00").getTime();

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const TRACKS = [
  "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/songs/mot-doi-ed2a6f03.mp3",
  "https://pub-4ee034abad814cf5b2219f594c28724f.r2.dev/songs/ta-la-cua-nhau-b0957dcf.mp3",
];

const DRESS_COLORS = [
  { hex: "#F3C4D2", name: "Hồng pastel" },
  { hex: "#F5F5DC", name: "Kem" },
  { hex: "#FFFFFF", name: "Trắng" },
  { hex: "#E8D9C3", name: "Be" },
];

const ALBUM_ANIMS = ["up", "zoom", "left", "right", "blur", "tilt"];
const ALBUM_SHAPES = ["tall", "wide", "tall", "wide", "tall", "wide"];

const ATTEND_OPTIONS = [
  { value: "yes", label: "Có mặt", note: "Rất mong được gặp bạn" },
  { value: "maybe", label: "Có thể", note: "Mình sẽ cố gắng sắp xếp" },
  { value: "no", label: "Xin lỗi", note: "Không thể tham dự" },
];

interface Wish {
  id: number;
  text: string;
  name: string;
  phone: string;
  date: string;
}

const DEMO_WISHES: Wish[] = [
  {
    id: 1,
    text: "Chúc anh chị trăm năm hạnh phúc, luôn ngọt ngào và cùng nhau đi thật xa nhé!",
    name: "Bạn thân",
    phone: "0987 654 321",
    date: "01.11.2026",
  },
  {
    id: 2,
    text: "Hạnh phúc nhé hai em. Chúc gia đình nhỏ luôn ấm áp, vui vẻ và yêu thương.",
    name: "Người thân",
    phone: "0912 345 678",
    date: "03.11.2026",
  },
];

const pad = (value: number): string => String(value).padStart(2, "0");

const mapUrl = (place: string): string =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;

const mapEmbed = (place: string): string =>
  `https://www.google.com/maps?q=${encodeURIComponent(place)}&hl=vi&z=16&output=embed`;

const shortPlace = (place: string): string =>
  place.replace(/^Tại\s+(nhà\s+gái|nhà\s+trai)\s*:\s*/i, "");

interface HeadProps {
  eyebrow: string;
  title: string;
  sub?: string;
}

const Head: FC<HeadProps> = ({ eyebrow, title, sub }): ReactElement => (
  <header className="pk-head" data-rv>
    <p className="pk-eyebrow">{eyebrow}</p>
    <h2 className="pk-title">{title}</h2>
    {sub && <p className="pk-sub">{sub}</p>}
  </header>
);

interface PinkInviteProps {
  onBack: () => void;
}

const PinkInvite: FC<PinkInviteProps> = ({ onBack }): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);
  const [left, setLeft] = useState<number>(() =>
    Math.max(0, WEDDING_AT - Date.now())
  );
  const [wishSent, setWishSent] = useState<boolean>(false);
  const [wishErr, setWishErr] = useState<string>("");
  const [rsvpDone, setRsvpDone] = useState<string>("");
  const [rsvpErr, setRsvpErr] = useState<string>("");
  const [wishes, setWishes] = useState<Wish[]>(DEMO_WISHES);
  const [wishForm, setWishForm] = useState({ phone: "", name: "", text: "" });
  const [rsvpForm, setRsvpForm] = useState({ name: "", attend: "", count: "" });
  const [musicOn, setMusicOn] = useState<boolean>(false);
  const [track, setTrack] = useState<number>(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const guest = useMemo(() => {
    try {
      return (
        new URLSearchParams(window.location.search).get("guest")?.trim() || ""
      );
    } catch {
      return "";
    }
  }, []);

  const [groomBo, groomMe] = d.groomParents.split(", ");
  const [brideBo, brideMe] = d.brideParents.split(", ");

  const lead = useMemo(() => (new Date(2026, 11, 1).getDay() + 6) % 7, []);
  const days = useMemo(
    () =>
      Array.from({ length: 31 }, (_, i) => i + 1).reduce<number[]>(
        (acc, day) => acc.concat(day),
        Array.from({ length: lead }, () => 0)
      ),
    [lead]
  );

  const playTrack = (index: number): void => {
    const audio = audioRef.current;
    if (!audio) return;
    setTrack(index);
    audio.src = TRACKS[index];
    audio
      .play()
      .then(() => setMusicOn(true))
      .catch(() => setMusicOn(false));
  };

  const toggleMusic = (): void => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio
        .play()
        .then(() => setMusicOn(true))
        .catch(() => setMusicOn(false));
    } else {
      audio.pause();
      setMusicOn(false);
    }
  };

  const openInvite = (): void => {
    setOpen(true);
    const audio = audioRef.current;
    if (audio) {
      audio
        .play()
        .then(() => setMusicOn(true))
        .catch(() => setMusicOn(false));
    }
  };

  useEffect(() => {
    const timer = window.setInterval(
      () => setLeft(Math.max(0, WEDDING_AT - Date.now())),
      1000
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = scrollRef.current;
    if (!root) return;
    const reveal = () => {
      const bounds = root.getBoundingClientRect();
      const nodes = root.querySelectorAll<HTMLElement>("[data-rv]:not(.is-in)");
      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const inside =
          rect.bottom > bounds.top + 16 && rect.top < bounds.bottom - 16;
        if (inside) node.classList.add("is-in");
      });
    };
    reveal();
    root.addEventListener("scroll", reveal, { passive: true });
    window.addEventListener("resize", reveal);
    const safety = window.setTimeout(reveal, 1400);
    return () => {
      root.removeEventListener("scroll", reveal);
      window.removeEventListener("resize", reveal);
      window.clearTimeout(safety);
    };
  }, [open]);

  const totalSeconds = Math.floor(left / 1000);
  const counter = [
    { value: Math.floor(totalSeconds / 86400), label: "Ngày" },
    { value: Math.floor((totalSeconds % 86400) / 3600), label: "Giờ" },
    { value: Math.floor((totalSeconds % 3600) / 60), label: "Phút" },
    { value: totalSeconds % 60, label: "Giây" },
  ];

  const scrollToTarget = (): void => {
    targetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submitWish = (event: FormEvent): void => {
    event.preventDefault();
    const phone = wishForm.phone.replace(/\s+/g, "");
    const name = wishForm.name.trim();
    const text = wishForm.text.trim();
    if (!phone || phone.length < 9) {
      setWishErr("Vui lòng nhập số điện thoại hợp lệ.");
      return;
    }
    if (!name) {
      setWishErr("Vui lòng nhập tên của bạn.");
      return;
    }
    if (!text) {
      setWishErr("Vui lòng viết lời chúc của bạn.");
      return;
    }
    setWishErr("");
    setWishes((prev) => [
      {
        id: Date.now(),
        text,
        name,
        phone: wishForm.phone.trim(),
        date: new Date().toLocaleDateString("vi-VN"),
      },
      ...prev,
    ]);
    setWishForm({ phone: "", name: "", text: "" });
    setWishSent(true);
  };

  const submitRsvp = (event: FormEvent): void => {
    event.preventDefault();
    if (!rsvpForm.attend) {
      setRsvpErr("Vui lòng chọn một trong các phương án bên dưới.");
      return;
    }
    setRsvpErr("");
    const picked =
      ATTEND_OPTIONS.find((option) => option.value === rsvpForm.attend) ||
      ATTEND_OPTIONS[0];
    const who = rsvpForm.name.trim() || guest || "Quý khách";
    const head =
      picked.value === "no"
        ? "Cảm ơn bạn đã báo tin!"
        : "Đã ghi nhận tham dự!";
    const detail =
      picked.value === "no"
        ? `${who} – ${picked.note.toLowerCase()}. Chúng mình sẽ nhớ bạn.`
        : `${who} – ${picked.label}${
            rsvpForm.count ? `, ${rsvpForm.count} người` : ""
          }. Hẹn gặp bạn trong ngày vui!`;
    setRsvpDone(`${head}|${detail}`);
  };

  const resetWish = (): void => {
    setWishSent(false);
    setWishForm({ phone: "", name: "", text: "" });
  };

  return (
    <div className={`iv-root pk-root${open ? " is-open" : ""}`}>
      <div className="iv-frame">
        <button type="button" className="iv-back pk-back" onClick={onBack}>
          ‹ Chọn thiệp khác
        </button>

        <div className="iv-scroll pk-scroll" ref={scrollRef}>
          <section className="pk-hero">
            <BackgroundHeartsLayer count={22} />

            <div className="pk-hero-body">
              <p className="pk-hero-kicker">Trân trọng kính mời</p>

              <figure className="pk-hero-photo" data-rv="zoom">
                <img src={PHOTO} alt={`${d.groom} & ${d.bride}`} />
              </figure>

              <h1 className="pk-hero-names">
                <span>{d.groom}</span>
                <i>&amp;</i>
                <span>{d.bride}</span>
              </h1>

              <span className="pk-hero-rule" />

              <div className="pk-hero-meta">
                <span className="pk-hero-date">{d.date}</span>
                <span className="pk-hero-place">
                  Thứ Bảy · Vĩnh Yên – Hải Phòng, Việt Nam
                </span>
              </div>

              <span className="pk-hero-scroll">Cuộn để xem tiếp ↓</span>
            </div>

            <svg
              className="pk-wave"
              viewBox="0 0 1440 64"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M0 34C160 56 320 6 520 14C720 22 880 58 1080 52C1240 47 1360 24 1440 12V64H0Z" />
            </svg>
          </section>

          <div className="pk-cal-wrap">
            <div className="pk-cal" data-rv>
              <div className="pk-cal-head">
                <h2 className="pk-cal-month">Tháng 12, 2026</h2>
              </div>
              <p className="pk-cal-save">Save The Date</p>
              <div className="pk-cal-week">
                {WEEKDAYS.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="pk-cal-grid">
                {days.map((day, index) => (
                  <div className="pk-cal-cell" key={`${day}-${index}`}>
                    {day === 12 ? (
                      <>
                        <span className="pk-cal-heart">♡</span>
                        <span className="pk-cal-day is-day">{day}</span>
                      </>
                    ) : (
                      <span className="pk-cal-day">{day || ""}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section className="pk-sec" id="couple">
            <Head eyebrow="Chú rể & cô dâu" title="Đôi Nét Về Chúng Tôi" />
            <div className="pk-couple">
              <article className="pk-person" data-rv>
                <div className="pk-person-photo">
                  <img src={IMG.groom} alt="Chú rể" />
                </div>
                <p className="pk-person-rank">Nhà trai</p>
                <h3 className="pk-person-name">{d.groomFull}</h3>
                <div className="pk-person-parents">
                  <p>
                    Con <b>{groomBo}</b>
                  </p>
                  <p>và {groomMe}</p>
                  <p className="pk-person-home">{d.groomHome}</p>
                </div>
              </article>

              <article className="pk-person" data-rv>
                <div className="pk-person-photo">
                  <img src={IMG.bride} alt="Cô dâu" />
                </div>
                <p className="pk-person-rank">Nhà gái</p>
                <h3 className="pk-person-name">{d.brideFull}</h3>
                <div className="pk-person-parents">
                  <p>
                    Con <b>{brideBo}</b>
                  </p>
                  <p>và {brideMe}</p>
                  <p className="pk-person-home">{d.brideHome}</p>
                </div>
              </article>
            </div>
          </section>

          <section className="pk-sec pk-sec-tint" id="schedule">
            <Head eyebrow="Sự kiện" title="Ngày Trọng Đại" />
            <div className="pk-events">
              {d.events.map((event, index) => {
                const isFeast = event.title === "Tiệc cưới";
                const place = shortPlace(event.place);
                const photo = IMG.events[index] || IMG.events[0];
                return (
                  <article className="pk-event" data-rv key={event.title}>
                    <div className="pk-event-media">
                      <img src={photo} alt={event.title} />
                      <span className="pk-event-badge">🏠</span>
                    </div>
                    <div className="pk-event-body">
                      <h3>{event.title}</h3>
                      <p className="pk-event-when">
                        {event.time} · {event.date}
                      </p>
                      {event.lunar && (
                        <p className="pk-event-lunar">{event.lunar}</p>
                      )}
                      <p className="pk-event-place">{event.place}</p>

                      {isFeast && (
                        <div className="pk-map">
                          <iframe
                            title={`Bản đồ ${event.title}`}
                            src={mapEmbed(place)}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                          <a
                            className="pk-map-open"
                            href={mapUrl(place)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Mở Google Maps ↗
                          </a>
                        </div>
                      )}

                      <a
                        className="pk-btn-ghost"
                        href={mapUrl(place)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Chỉ đường
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="pk-sec" id="dresscode">
            <Head
              eyebrow="Dress code"
              title="Màu Trang Phục"
              sub="Bốn tông màu váy được yêu thích nhất – hãy chọn một trong số chúng để cùng chúng mình hòa nhịp ngày vui."
            />
            <div className="pk-dress-row" data-rv>
              {DRESS_COLORS.map((color) => (
                <div className="pk-dress-item" key={color.hex}>
                  <span
                    className="pk-dress-dot"
                    style={{ background: color.hex }}
                  />
                  <em>{color.name}</em>
                </div>
              ))}
            </div>

            <div className="pk-timeline-head" data-rv>
              <p className="pk-eyebrow">Lịch trình</p>
              <h3 className="pk-timeline-title">Timeline Tiệc Cưới</h3>
            </div>

            <ol className="pk-timeline" data-rv>
              {d.timeline.map((item) => (
                <li className="pk-tl" key={`${item.thoiGian}-${item.suKien}`}>
                  <div className="pk-tl-card">
                    <span className="pk-tl-time">{item.thoiGian}</span>
                    <h3>{item.suKien}</h3>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="pk-sec pk-sec-tint" id="album">
            <Head eyebrow="Album" title="Album Ảnh Cưới" />
            <div className="pk-album">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <figure
                  className={`pk-alb pk-alb-${ALBUM_SHAPES[index]}`}
                  data-rv={ALBUM_ANIMS[index]}
                  style={{ transitionDelay: `${(index % 2) * 90}ms` }}
                  key={index}
                >
                  <img src={IMG.album[index]} alt={`Ảnh cưới ${index + 1}`} />
                </figure>
              ))}
            </div>
            <p className="pk-more" data-rv>
              Xem tất cả (6)
            </p>
          </section>

          <section className="pk-sec" id="wishes" ref={targetRef}>
            <Head
              eyebrow="Lời chúc"
              title="Gửi Lời Chúc"
              sub="Mỗi lời chúc của Quý khách đều là niềm hạnh phúc cho gia đình chúng tôi."
            />

            {wishSent ? (
              <div className="pk-sent">
                <span>💌</span>
                <h3>Cảm ơn bạn rất nhiều!</h3>
                <p>Lời chúc của bạn đã được ghi lại. Hẹn gặp bạn trong ngày vui!</p>
                <button type="button" className="pk-btn" onClick={resetWish}>
                  Gửi lời chúc khác
                </button>
              </div>
            ) : (
              <form className="pk-form" onSubmit={submitWish} noValidate>
                <label className="pk-field pk-field-wide">
                  <span>Số điện thoại *</span>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="0901 234 567"
                    value={wishForm.phone}
                    onChange={(e) =>
                      setWishForm({ ...wishForm, phone: e.target.value })
                    }
                  />
                </label>

                <label className="pk-field pk-field-wide">
                  <span>Tên của bạn *</span>
                  <input
                    type="text"
                    placeholder="Nhập tên của bạn"
                    value={wishForm.name}
                    onChange={(e) =>
                      setWishForm({ ...wishForm, name: e.target.value })
                    }
                  />
                </label>

                <label className="pk-field pk-field-wide">
                  <span>Lời Chúc *</span>
                  <textarea
                    rows={4}
                    placeholder="Viết những lời chúc tốt đẹp đến cô dâu chú rể..."
                    value={wishForm.text}
                    onChange={(e) =>
                      setWishForm({ ...wishForm, text: e.target.value })
                    }
                  />
                </label>

                {wishErr && <p className="pk-err pk-field-wide">{wishErr}</p>}

                <button className="pk-btn pk-submit" type="submit">
                  Gửi lời chúc
                </button>
              </form>
            )}

            <div className="pk-wishes">
              {wishes.map((wish) => (
                <article className="pk-wish" key={wish.id}>
                  <p className="pk-wish-text">{wish.text}</p>
                  <div className="pk-wish-foot">
                    <div>
                      <p className="pk-wish-name">{wish.name}</p>
                      <p className="pk-wish-rel">{wish.phone}</p>
                    </div>
                    <span className="pk-wish-date">{wish.date}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="pk-sec pk-sec-tint" id="rsvp">
            <Head
              eyebrow="Tham dự"
              title="Xác Nhận Tham Dự"
              sub="Vui lòng cho chúng mình biết bạn có thể đến chung vui để gia đình chuẩn bị chu đáo nhất."
            />

            {rsvpDone ? (
              <div className="pk-sent">
                <span>🎉</span>
                <h3>{rsvpDone.split("|")[0]}</h3>
                <p>{rsvpDone.split("|")[1]}</p>
                <button
                  type="button"
                  className="pk-btn"
                  onClick={() => {
                    setRsvpDone("");
                    setRsvpForm({ name: "", attend: "", count: "" });
                  }}
                >
                  Chỉnh sửa câu trả lời
                </button>
              </div>
            ) : (
              <form className="pk-form" onSubmit={submitRsvp} noValidate>
                <label className="pk-field pk-field-wide">
                  <span>Tên của bạn</span>
                  <input
                    type="text"
                    placeholder={
                      guest ? `Khách mời: ${guest}` : "Nhập tên của bạn"
                    }
                    value={rsvpForm.name}
                    onChange={(e) =>
                      setRsvpForm({ ...rsvpForm, name: e.target.value })
                    }
                  />
                </label>

                <div className="pk-field pk-field-wide">
                  <span>Bạn có thể tham dự không?</span>
                  <div className="pk-attend">
                    {ATTEND_OPTIONS.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        className={`pk-attend-item${
                          rsvpForm.attend === option.value ? " is-on" : ""
                        }`}
                        onClick={() =>
                          setRsvpForm({ ...rsvpForm, attend: option.value })
                        }
                      >
                        <b>{option.label}</b>
                        <em>{option.note}</em>
                      </button>
                    ))}
                  </div>
                </div>

                <label className="pk-field pk-field-wide">
                  <span>Số người tham dự</span>
                  <select
                    value={rsvpForm.count}
                    onChange={(e) =>
                      setRsvpForm({ ...rsvpForm, count: e.target.value })
                    }
                  >
                    <option value="">-- Số người --</option>
                    <option value="1">1 người</option>
                    <option value="2">2 người</option>
                    <option value="3">3 người</option>
                    <option value="4">4 người</option>
                    <option value="5">5+ người</option>
                  </select>
                </label>

                {rsvpErr && <p className="pk-err pk-field-wide">{rsvpErr}</p>}

                <button className="pk-btn pk-submit" type="submit">
                  Xác nhận tham dự
                </button>
              </form>
            )}
          </section>

          <section className="pk-count">
            <img className="pk-count-img" src={IMG.countdown} alt="" />
            <span className="pk-count-veil" />
            <div className="pk-count-body" data-rv>
              <p className="pk-eyebrow pk-eyebrow-light">Save the date</p>
              <h2 className="pk-count-title">Đếm Ngược Đến Ngày Cưới</h2>
              <div className="pk-counter">
                {counter.map((unit) => (
                  <div className="pk-counter-cell" key={unit.label}>
                    <span className="pk-counter-num">{pad(unit.value)}</span>
                    <span className="pk-counter-label">{unit.label}</span>
                  </div>
                ))}
              </div>
              <div className="pk-count-when">
                <p>
                  {d.dateLong} · {d.weekday}
                </p>
                <p>• Hải Phòng · Vĩnh Yên, Việt Nam</p>
              </div>
            </div>
          </section>

          <section className="pk-sec pk-thanks">
            <figure className="pk-thanks-photo" data-rv="zoom">
              <img src={IMG.thanks} alt="Cô dâu & chú rể" />
            </figure>
            <p className="pk-eyebrow" data-rv>
              Thank you
            </p>
            <h2 className="pk-thanks-title" data-rv>
              {d.groom} và {d.bride} xin chân thành cảm ơn và hẹn gặp Quý khách
              trong ngày trọng đại!
            </h2>
            <p className="pk-thanks-note" data-rv>
              {d.closing} Sự hiện diện và những lời chúc của Quý khách là niềm
              hạnh phúc lớn đối với gia đình chúng tôi.
            </p>
            <div className="pk-foot" data-rv>
              <span>
                {d.groom} &amp; {d.bride}
              </span>
              <span>
                {d.date} · Việt Nam
              </span>
            </div>
          </section>
        </div>

        <button
          type="button"
          className="pk-fab"
          onClick={scrollToTarget}
          aria-label="Gửi lời chúc"
        >
          Gửi lời chúc 💌
        </button>

        <button
          type="button"
          className={`pk-music${musicOn ? " is-on" : ""}`}
          onClick={toggleMusic}
          aria-label={musicOn ? "Tắt nhạc" : "Bật nhạc"}
        >
          ♪
        </button>

        <audio
          ref={audioRef}
          src={TRACKS[track]}
          preload="none"
          onEnded={() => playTrack((track + 1) % TRACKS.length)}
          onPause={() => setMusicOn(false)}
          onPlay={() => setMusicOn(true)}
        />

        <button
          type="button"
          className="iv-cover pk-cover"
          onClick={openInvite}
          aria-label="Mở thiệp mời"
        >
          <span className="pk-cover-title">Trân trọng kính mời</span>

          <span className="pk-env" aria-hidden="true">
            <svg viewBox="0 0 200 132">
              <rect x="5" y="5" width="190" height="122" rx="12" />
              <path d="M5 16 L100 78 L195 16" />
              <path d="M5 124 L76 70" />
              <path d="M195 124 L124 70" />
            </svg>
            <i className="pk-env-seal">
              {d.groom.charAt(0)}
              <b>&amp;</b>
              {d.bride.charAt(0)}
            </i>
          </span>

          <span className="pk-cover-to">
            {guest ? `Kính gửi ${guest}` : `${d.groom} & ${d.bride}`}
          </span>
          <span className="pk-cover-date">{d.date}</span>
          <span className="iv-cover-hint pk-cover-hint">Chạm để mở thiệp</span>
        </button>
      </div>
    </div>
  );
};

export default PinkInvite;
