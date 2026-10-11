import { FC, ReactElement } from "react";
import { inviteData as d } from "./inviteData";
import "./invites.css";
import "./InviteHome.css";

export type InviteKind = "env" | "min" | "floral" | "pink";

interface InviteHomeProps {
  onSelect: (kind: InviteKind) => void;
}

const OPTIONS: Array<{ kind: InviteKind; label: string; desc: string }> = [
  { kind: "env", label: "Phong bì cổ điển", desc: "Nắp bì bung ra khi chạm" },
  { kind: "min", label: "Tối giản hiện đại", desc: "Hai cánh trượt sang hai bên" },
  { kind: "floral", label: "Thiệp hoa", desc: "Hai nửa giấy mở như thiệp gấp" },
  { kind: "pink", label: "Hồng pastel", desc: "Nhiều phần, cuộn dài như mẫu" },
];

const InviteHome: FC<InviteHomeProps> = ({ onSelect }): ReactElement => (
  <div className="iv-root home-root is-open">
    <div className="iv-bg">
      <img src={`${process.env.PUBLIC_URL}/start_image_background.jpg`} alt="" />
    </div>

    <div className="iv-frame">
      <div className="iv-scroll home-scroll">
        <div className="iv-body home-body">
          <p className="iv-eyebrow home-rv" style={{ transitionDelay: "0ms" }}>
            Trân trọng kính mời
          </p>

          <h1 className="iv-names home-rv" style={{ transitionDelay: "40ms" }}>
            <span>{d.groom}</span>
            <em className="iv-amp">&amp;</em>
            <span>{d.bride}</span>
          </h1>

          <div className="iv-date home-rv" style={{ transitionDelay: "80ms" }}>
            <span className="iv-date-main">{d.date}</span>
            <span className="iv-date-sub">
              {d.weekday} · {d.lunar}
            </span>
          </div>

          <p className="home-pick home-rv" style={{ transitionDelay: "120ms" }}>
            Chọn một bản thiệp
          </p>

          <div className="home-options">
            {OPTIONS.map((option, index) => (
              <button
                key={option.kind}
                type="button"
                className="home-option home-rv"
                style={{ transitionDelay: `${160 + index * 20}ms` }}
                onClick={() => onSelect(option.kind)}
              >
                <span className="home-option-label">{option.label}</span>
                <span className="home-option-desc">{option.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default InviteHome;
