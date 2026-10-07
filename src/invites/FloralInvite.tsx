import { FC, ReactElement, useState } from "react";
import InviteBody from "./InviteBody";
import { inviteData as d } from "./inviteData";
import "./invites.css";
import "./FloralInvite.css";

interface FloralInviteProps {
  onBack: () => void;
}

const FloralInvite: FC<FloralInviteProps> = ({ onBack }): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className={`iv-root floral-root${open ? " is-open" : ""}`}>
      <div className="iv-bg">
        <img src={`${process.env.PUBLIC_URL}/start_image_background.jpg`} alt="" />
      </div>

      <div className="iv-frame">
        <button type="button" className="iv-back" onClick={onBack}>
          ‹ Chọn thiệp khác
        </button>

        <div className="iv-scroll">
          <InviteBody theme="floral" />
        </div>

        <button
          type="button"
          className="iv-cover floral-cover"
          onClick={() => setOpen(true)}
          aria-label="Mở thiệp mời"
        >
          <span className="floral-half floral-top" aria-hidden="true" />
          <span className="floral-half floral-bottom" aria-hidden="true" />

          <span className="floral-center">
            <img
              className="floral-flower"
              src={`${process.env.PUBLIC_URL}/onboarding_flower.png`}
              alt=""
            />
            <span className="floral-cover-title">Save the date</span>
            <span className="floral-cover-names">
              {d.groom} <i>&amp;</i> {d.bride}
            </span>
            <span className="floral-cover-date">{d.date}</span>
            <span className="floral-cover-hint">Chạm để mở thiệp</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default FloralInvite;
