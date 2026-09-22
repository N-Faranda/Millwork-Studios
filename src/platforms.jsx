// PLATFORMS FIGURE — Plough page, "one tool, every bench".
// A technical drawing of the same screen at three scales (phone, tablet,
// desktop). One task travels the line on all three at once, to show that it
// is one product, synced, rather than three separate apps.

const { useT, useIsMobile, useMediaQuery } = window;

// Positions are in SVG user units. The desktop drawing reads small → large,
// left to right; on a phone the monitor goes on top and the two handhelds
// sit side by side underneath it.
const PLATFORM_LAYOUT = {
  wide: {
    vb: [1120, 600],
    dimFs: 11,
    devices: {
      phone: { x: 20, y: 250, w: 130, h: 270 },
      tablet: { x: 200, y: 170, w: 240, h: 320 },
      desktop: { x: 500, y: 80, w: 600, h: 375 },
    },
    leaders: [
      { x1: 150, x2: 200, y: 380 },
      { x1: 440, x2: 500, y: 300 },
    ],
  },
  narrow: {
    vb: [400, 640],
    dimFs: 10,
    devices: {
      desktop: { x: 20, y: 44, w: 360, h: 225 },
      phone: { x: 20, y: 372, w: 112, h: 233 },
      tablet: { x: 172, y: 344, w: 208, h: 278 },
    },
    leaders: [{ x1: 132, x2: 172, y: 480 }],
  },
};

const DIM_LABEL = { phone: "375 PT", tablet: "768 PT", desktop: "1440 PX" };

// Cards already waiting in each column; the travelling card joins at the end.
const COLUMN_CARDS = [2, 1, 2];

const ACCENT_TINT = "rgba(184, 69, 30, 0.09)";
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

const Card = ({ x = 0, y = 0, w, h, accent }) => (
  <g>
    <rect
      x={x} y={y} width={w} height={h}
      rx={Math.min(4, h * 0.12)}
      fill={accent ? ACCENT_TINT : "var(--paper)"}
      stroke={accent ? "var(--accent)" : "var(--ink-faint)"}
      strokeWidth={1}
    />
    <rect
      x={x + h * 0.22} y={y + h * 0.26}
      width={w * 0.52} height={Math.max(2, h * 0.12)}
      rx={1}
      fill={accent ? "var(--accent)" : "var(--ink-soft)"}
      opacity={0.75}
    />
    <rect
      x={x + h * 0.22} y={y + h * 0.52}
      width={w * 0.32} height={Math.max(2, h * 0.1)}
      rx={1}
      fill="var(--ink-faint)"
    />
    <circle
      cx={x + w - h * 0.3} cy={y + h - h * 0.3} r={h * 0.1}
      fill="none" stroke="var(--ink-faint)" strokeWidth={1}
    />
  </g>
);

// Width dimension above a device, with extension lines down to its corners.
const Dimension = ({ x, w, top, fs, label }) => {
  const y = top - 26;
  const lw = label.length * fs * 0.62 + 12;
  const mid = x + w / 2;
  return (
    <g style={{ fontFamily: "var(--mono)" }}>
      {[x, x + w].map((ex) => (
        <line
          key={ex} x1={ex} y1={y + 5} x2={ex} y2={top - 5}
          stroke="var(--ink-faint)" strokeWidth={0.75} strokeDasharray="2 2"
        />
      ))}
      <line x1={x} y1={y} x2={x + w} y2={y} stroke="var(--ink-mute)" strokeWidth={0.75} />
      <line x1={x} y1={y - 4} x2={x} y2={y + 4} stroke="var(--ink-mute)" strokeWidth={0.75} />
      <line x1={x + w} y1={y - 4} x2={x + w} y2={y + 4} stroke="var(--ink-mute)" strokeWidth={0.75} />
      <rect x={mid - lw / 2} y={y - fs * 0.7} width={lw} height={fs * 1.4} fill="var(--paper)" />
      <text
        x={mid} y={y + fs * 0.36}
        textAnchor="middle" fontSize={fs} letterSpacing="0.08em" fill="var(--ink-mute)"
      >
        {label}
      </text>
    </g>
  );
};

const Device = ({ kind, box, step, cols, dimFs, dim }) => {
  const { x, y, w, h } = box;
  const bezel = Math.max(6, Math.round(w * { desktop: 0.022, tablet: 0.06, phone: 0.07 }[kind]));
  const rx = { desktop: 6, tablet: w * 0.08, phone: w * 0.17 }[kind];
  const sx = x + bezel;
  const sy = y + bezel;
  const sw = w - bezel * 2;
  const sh = h - bezel * 2;

  const notch = kind === "phone" ? 12 : 0;
  const tb = Math.min(26, Math.max(16, sw * 0.045));
  const barY = sy + notch;
  const pad = Math.max(6, sw * 0.02);
  const bodyY = barY + tb + pad;

  // monitor stand
  const stand = kind === "desktop" && (() => {
    const cx = x + w / 2;
    const nh = h * 0.14;
    const bw = w * 0.28;
    return (
      <g>
        <path
          d={`M${cx - w * 0.05} ${y + h} L${cx - w * 0.07} ${y + h + nh} L${cx + w * 0.07} ${y + h + nh} L${cx + w * 0.05} ${y + h} Z`}
          fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.1}
        />
        <rect x={cx - bw / 2} y={y + h + nh} width={bw} height={6} rx={3}
          fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.1} />
      </g>
    );
  })();

  let body;
  if (kind === "phone") {
    // Segmented control for the three stages; the list shows the active one.
    const aw = sw - pad * 2;
    const segH = Math.max(12, sw * 0.12);
    const listY = bodyY + segH + pad;
    const ch = Math.max(24, sw * 0.27);
    const cg = pad * 0.8;
    body = (
      <g>
        <rect x={sx + pad} y={bodyY} width={aw} height={segH} rx={segH / 2}
          fill="var(--rule-soft)" stroke="var(--rule)" strokeWidth={0.75} />
        <rect
          x={sx + pad} y={bodyY} width={aw / 3} height={segH} rx={segH / 2}
          fill="var(--paper)" stroke="var(--accent)" strokeWidth={1}
          style={{ transform: `translate(${(step * aw) / 3}px, 0px)`, transition: `transform 0.7s ${EASE}` }}
        />
        <g key={step} className="mw-card-in">
          <Card x={sx + pad} y={listY} w={aw} h={ch} accent />
        </g>
        {[1, 2, 3].map((i) =>
          listY + i * (ch + cg) + ch < sy + sh - pad ? (
            <Card key={i} x={sx + pad} y={listY + i * (ch + cg)} w={aw} h={ch} />
          ) : null
        )}
      </g>
    );
  } else {
    const sbw = kind === "desktop" ? sw * 0.16 : 0;
    const cx0 = sx + sbw + pad;
    const aw = sx + sw - pad - cx0;
    const g = pad;
    const colW = (aw - g * 2) / 3;
    const fs = Math.min(9, (colW - 8) / 7.2);
    const cardY = bodyY + fs + pad * 0.9;
    const ch = Math.min(48, Math.max(24, colW * 0.34));
    const cg = pad * 0.8;
    const slot = COLUMN_CARDS[step];
    body = (
      <g>
        {sbw > 0 && (
          <g>
            <line x1={sx + sbw} y1={barY + tb} x2={sx + sbw} y2={sy + sh}
              stroke="var(--rule)" strokeWidth={0.75} />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={sx + pad} y={bodyY + i * 14} width={sbw * (i === 0 ? 0.62 : 0.5)} height={4} rx={1}
                fill={i === 0 ? "var(--ink-soft)" : "var(--ink-faint)"} opacity={i === 0 ? 0.7 : 1} />
            ))}
          </g>
        )}
        {cols.map((label, c) => {
          const colX = cx0 + c * (colW + g);
          return (
            <g key={c}>
              <text x={colX + 2} y={bodyY + fs * 0.8} fontSize={fs} letterSpacing="0.06em"
                fill="var(--ink-mute)" style={{ fontFamily: "var(--mono)" }}>
                {label}
              </text>
              <rect x={colX} y={cardY - pad * 0.5} width={colW} height={sy + sh - pad - (cardY - pad * 0.5)}
                rx={3} fill="var(--rule-soft)" />
              {Array.from({ length: COLUMN_CARDS[c] }).map((_, i) => (
                <Card key={i} x={colX + 3} y={cardY + i * (ch + cg)} w={colW - 6} h={ch} />
              ))}
            </g>
          );
        })}
        <g
          style={{
            transform: `translate(${cx0 + step * (colW + g) + 3}px, ${cardY + slot * (ch + cg)}px)`,
            transition: `transform 0.9s ${EASE}`,
          }}
        >
          <Card w={colW - 6} h={ch} accent />
        </g>
      </g>
    );
  }

  return (
    <g>
      <Dimension x={x} w={w} top={y} fs={dimFs} label={dim} />
      {stand}
      <rect x={x} y={y} width={w} height={h} rx={rx} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.25} />
      <rect x={sx} y={sy} width={sw} height={sh} rx={Math.max(2, rx - bezel)}
        fill="var(--paper)" stroke="var(--rule)" strokeWidth={0.75} />
      {notch > 0 && (
        <rect x={sx + sw * 0.34} y={sy + 4} width={sw * 0.32} height={5} rx={2.5} fill="var(--ink)" />
      )}
      {/* top bar: mark, name, sync light */}
      <circle cx={sx + tb * 0.55} cy={barY + tb / 2} r={tb * 0.17} fill="none" stroke="var(--ink)" strokeWidth={1} />
      {sw > 180 && (
        <text x={sx + tb * 0.95} y={barY + tb / 2 + tb * 0.13} fontSize={tb * 0.36} letterSpacing="0.1em"
          fill="var(--ink)" style={{ fontFamily: "var(--mono)" }}>
          PLOUGH
        </text>
      )}
      <circle key={step} className="mw-sync" cx={sx + sw - tb * 0.55} cy={barY + tb / 2} r={tb * 0.13} fill="var(--ink-faint)" />
      <line x1={sx} y1={barY + tb} x2={sx + sw} y2={barY + tb} stroke="var(--rule)" strokeWidth={0.75} />
      {body}
    </g>
  );
};

const PlatformsFigure = () => {
  const { t } = useT();
  const isMobile = useIsMobile();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [step, setStep] = React.useState(0);
  const [focus, setFocus] = React.useState(null);

  React.useEffect(() => {
    if (reduced) { setStep(1); return; }
    const id = setInterval(() => setStep((s) => (s + 1) % 3), 2400);
    return () => clearInterval(id);
  }, [reduced]);

  const L = isMobile ? PLATFORM_LAYOUT.narrow : PLATFORM_LAYOUT.wide;
  const p = t.platforms;

  return (
    <React.Fragment>
      {/* the drawing sheet */}
      <figure
        style={{
          border: "1px solid var(--rule)",
          backgroundImage: "radial-gradient(var(--rule) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          backgroundPosition: "12px 12px",
          padding: isMobile ? "24px 14px 16px" : "40px 40px 24px",
        }}
      >
        <svg
          viewBox={`0 0 ${L.vb[0]} ${L.vb[1]}`}
          role="img"
          aria-label={p.aria}
          style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }}
        >
          {L.leaders.map((l, i) => (
            <g key={i}>
              <line x1={l.x1 + 4} y1={l.y} x2={l.x2 - 4} y2={l.y}
                stroke="var(--ink-mute)" strokeWidth={0.9} strokeDasharray="3 3" />
              <circle cx={l.x1} cy={l.y} r={2.5} fill="var(--ink)" />
              <circle cx={l.x2} cy={l.y} r={2.5} fill="var(--ink)" />
              {!reduced && (
                <circle
                  key={step}
                  className="mw-travel"
                  cx={l.x1} cy={l.y} r={3}
                  fill="var(--accent)"
                  style={{ "--dx": `${l.x2 - l.x1}px`, animationDelay: `${i * 0.25}s` }}
                />
              )}
            </g>
          ))}
          {Object.entries(L.devices).map(([kind, box]) => (
            <g
              key={kind}
              style={{
                opacity: focus === null || focus === kind ? 1 : 0.25,
                transition: "opacity 0.4s ease",
              }}
            >
              <Device kind={kind} box={box} step={step} cols={p.cols} dimFs={L.dimFs} dim={DIM_LABEL[kind]} />
            </g>
          ))}
        </svg>

        <figcaption
          style={{
            marginTop: isMobile ? 16 : 24,
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.1em",
            color: "var(--ink-mute)",
          }}
        >
          <span>FIG. 01 — ONE TOOL, THREE BENCHES</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span
              key={step}
              className="mw-sync-dot"
              style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ink-faint)" }}
            />
            SYNCED — SAME DATA, EVERY SCREEN
          </span>
        </figcaption>
      </figure>

      {/* three benches */}
      <div
        style={{
          marginTop: isMobile ? 44 : 64,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: isMobile ? 30 : 36,
          borderTop: "1px solid var(--rule)",
          paddingTop: 36,
        }}
      >
        {p.benches.map((b) => {
          const on = focus === b.key;
          return (
            <div
              key={b.key}
              onMouseEnter={() => setFocus(b.key)}
              onMouseLeave={() => setFocus(null)}
              onClick={() => setFocus(on ? null : b.key)}
              style={{ cursor: "default" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div
                  style={{
                    width: 28,
                    height: 1,
                    background: on ? "var(--accent)" : "var(--ink-mute)",
                    opacity: on ? 1 : 0.5,
                    transition: "background 0.3s ease, opacity 0.3s ease",
                  }}
                />
                <span className="kicker" style={{ color: on ? "var(--ink)" : undefined }}>
                  {b.label}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontSize: isMobile ? 26 : 28,
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                  marginBottom: 10,
                }}
              >
                {b.t}
              </div>
              <div style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--ink-mute)", maxWidth: 360 }}>
                {b.d}
              </div>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

Object.assign(window, { PlatformsFigure });
