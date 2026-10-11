import { FC, ReactElement, useState } from "react";
import InviteBody from "./InviteBody";
import { inviteData as d } from "./inviteData";
import "./invites.css";
import "./MinimalInvite.css";

interface MinimalInviteProps {
  onBack: () => void;
}

const MinimalInvite: FC<MinimalInviteProps> = ({ onBack }): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className={`iv-root min-root${open ? " is-open" : ""}`}>
      <div className="iv-bg">
        <img src={`${process.env.PUBLIC_URL}/start_image_background.jpg`} alt="" />
      </div>

      <div className="iv-frame">
        <button type="button" className="iv-back" onClick={onBack}>
          ‹ Chọn thiệp khác
        </button>

        <div className="iv-scroll">
          <InviteBody theme="min" />
        </div>

        <button
          type="button"
          className="iv-cover min-cover"
          onClick={() => setOpen(true)}
          aria-label="Mở thiệp mời"
        >
          <span className="min-panel min-panel-left" aria-hidden="true">
            <span className="min-vert">Huy Hiếu</span>
          </span>
          <span className="min-panel min-panel-right" aria-hidden="true">
            <span className="min-vert">Ánh Dương</span>
          </span>

          <span className="min-center">
            <span className="min-monogram">
              {d.groom.charAt(0)}
              <i>&amp;</i>
              {d.bride.charAt(0)}
            </span>
            <span className="min-date">{d.date}</span>
            <span className="min-cover-hint">Chạm để mở thiệp</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default MinimalInvite;
