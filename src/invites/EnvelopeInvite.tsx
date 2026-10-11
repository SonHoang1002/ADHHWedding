import { FC, ReactElement, useState } from "react";
import InviteBody from "./InviteBody";
import { inviteData as d } from "./inviteData";
import "./invites.css";
import "./EnvelopeInvite.css";

interface EnvelopeInviteProps {
  onBack: () => void;
}

const EnvelopeInvite: FC<EnvelopeInviteProps> = ({ onBack }): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className={`iv-root env-root${open ? " is-open" : ""}`}>
      <div className="iv-bg">
        <img src={`${process.env.PUBLIC_URL}/start_image_background.jpg`} alt="" />
      </div>

      <div className="iv-frame">
        <button type="button" className="iv-back" onClick={onBack}>
          ‹ Chọn thiệp khác
        </button>

        <div className="iv-scroll">
          <InviteBody theme="env" />
        </div>

        <button
          type="button"
          className="iv-cover env-cover"
          onClick={() => setOpen(true)}
          aria-label="Mở thiệp mời"
        >
          <span className="env-cover-title">Trân trọng kính mời</span>

          <span className="env-box" aria-hidden="true">
            <span className="env-lid">
              <span className="env-monogram">
                {d.groom.charAt(0)}
                <i>&amp;</i>
                {d.bride.charAt(0)}
              </span>
            </span>
            <span className="env-body">
              <span className="env-names">
                {d.groom} <b>&amp;</b> {d.bride}
              </span>
              <span className="env-date">{d.date}</span>
            </span>
          </span>

          <span className="env-cover-hint">Chạm để mở thiệp</span>
        </button>
      </div>
    </div>
  );
};

export default EnvelopeInvite;
