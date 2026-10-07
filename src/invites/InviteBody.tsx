import { CSSProperties, FC, ReactElement } from "react";
import { inviteData as d } from "./inviteData";

type Theme = "env" | "min" | "floral";

interface InviteBodyProps {
  theme: Theme;
}

const stagger = (index: number): CSSProperties => ({
  transitionDelay: `${Math.min(index * 60, 200)}ms`,
});

const InviteBody: FC<InviteBodyProps> = ({ theme }): ReactElement => (
  <div className={`iv-body theme-${theme}`}>
    <p className="iv-eyebrow rv" style={stagger(0)}>
      Trân trọng kính mời
    </p>

    <h1 className="iv-names rv" style={stagger(1)}>
      <span>{d.groom}</span>
      <em className="iv-amp">&amp;</em>
      <span>{d.bride}</span>
    </h1>

    <div className="iv-date rv" style={stagger(2)}>
      <span className="iv-date-main">{d.date}</span>
      <span className="iv-date-sub">
        {d.weekday} · {d.lunar}
      </span>
    </div>

    <div className="iv-divider rv" style={stagger(3)} />

    <div className="iv-parents rv" style={stagger(3)}>
      <p>
        <b>Nhà trai:</b> {d.groomFull} – con {d.groomParents}, quê {d.groomHome}
      </p>
      <p>
        <b>Nhà gái:</b> {d.brideFull} – con {d.brideParents}, quê {d.brideHome}
      </p>
    </div>

    <section className="iv-events">
      {d.events.map((event, i) => (
        <article className="iv-event rv" style={stagger(4 + i)} key={event.title}>
          <h2 className="iv-event-title">{event.title}</h2>
          <p className="iv-event-time">
            {event.date} · {event.time}
          </p>
          {event.lunar && <p className="iv-event-lunar">{event.lunar}</p>}
          <p className="iv-event-place">{event.place}</p>
        </article>
      ))}
    </section>

    <section className="iv-timeline rv" style={stagger(8)}>
      <h3 className="iv-timeline-title">Trình tự buổi lễ</h3>
      <ol>
        {d.timeline.map((item) => (
          <li key={`${item.thoiGian}-${item.suKien}`}>
            <span className="tl-time">{item.thoiGian}</span>
            <span className="tl-text">{item.suKien}</span>
          </li>
        ))}
      </ol>
    </section>

    <p className="iv-closing rv" style={stagger(9)}>
      {d.closing}
    </p>
  </div>
);

export default InviteBody;
