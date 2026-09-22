// ASCII windmill — sails are rendered procedurally from a continuously rotating
// angle θ, sampled onto a 32×11 character grid. The body is a fixed string
// below. This gives genuinely smooth, continuous blade rotation instead of
// stepped frames.

const GRID_W = 32;
const GRID_H = 11;
const HUB_X = 16;
const HUB_Y = 5;
const BLADE_LEN = 8.5;
const BLADE_HALF_W = 1.3;

// Sample 4 blades at theta, theta+90°, theta+180°, theta+270° onto a char grid.
// Compress y by 0.5 because monospace chars are ~2× taller than wide, so blades
// stay visually square instead of stretching vertically.
const renderSails = (theta) => {
  const grid = [];
  for (let y = 0; y < GRID_H; y++) grid.push(new Array(GRID_W).fill(" "));

  for (let b = 0; b < 4; b++) {
    const a = theta + (b * Math.PI) / 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    for (let t = 0.7; t <= BLADE_LEN; t += 0.22) {
      for (let w = -BLADE_HALF_W; w <= BLADE_HALF_W; w += 0.35) {
        const wx = c * t - s * w;
        const wy = s * t + c * w;
        const px = Math.round(HUB_X + wx);
        const py = Math.round(HUB_Y - wy * 0.5);
        if (px < 0 || px >= GRID_W || py < 0 || py >= GRID_H) continue;
        // leave a tiny gap around the hub so [◉] reads cleanly
        if (Math.abs(px - HUB_X) <= 1 && py === HUB_Y) continue;
        grid[py][px] = "▦";
      }
    }
  }

  // hub overlay
  grid[HUB_Y][HUB_X - 1] = "[";
  grid[HUB_Y][HUB_X] = "◉";
  grid[HUB_Y][HUB_X + 1] = "]";

  return grid.map((r) => r.join("")).join("\n");
};

// Tapered tower with arched doorway, flared base, ground line extending past.
// Apex (┴) sits directly under the hub (col 16) so the shaft reads continuous.
const BODY =
`              ╱─┴─╲
             ╱     ╲
            ╱       ╲
            │  ╭─╮  │
            │  │ │  │
            │  │ │  │
            │  └─┘  │
           ╱─────────╲
        ─────────────────`;

// wind annotation derived from theta so it shifts continuously with rotation
const windFor = (theta) => {
  const norm = ((theta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const deg = (norm * 180) / Math.PI;
  const arrows = ["→", "↘", "↓", "↙", "←", "↖", "↑", "↗"];
  const arrow = arrows[Math.floor(((deg + 22.5) % 360) / 45) % 8];
  const kt = 6 + Math.round(8 + 6 * Math.sin(theta * 0.5));
  return {
    dir: arrow,
    deg: String(Math.round(deg)).padStart(3, "0") + "°",
    kt: String(kt).padStart(2, "0"),
  };
};

// gustRef (optional) adds rad/sec on top of the idle spin — the drifting
// wrapper below feeds it with scroll speed.
const AsciiMill = ({ gustRef }) => {
  const [theta, setTheta] = React.useState(0);
  const [hover, setHover] = React.useState(false);
  const thetaRef = React.useRef(0);

  React.useEffect(() => {
    let raf;
    let last = performance.now();
    const baseSpeed = hover ? 4.2 : 1.15; // rad/sec
    let speed = hover ? 2 : 1.15;
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const targetSpeed = baseSpeed + ((gustRef && gustRef.current) || 0);
      // ease toward target speed so hover transitions feel natural
      speed += (targetSpeed - speed) * Math.min(1, dt * 4);
      thetaRef.current += speed * dt;
      setTheta(thetaRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hover, gustRef]);

  const w = windFor(theta);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ fontFamily: "var(--mono)", cursor: "default", color: "var(--ink-soft)" }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--ink-mute)",
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          paddingLeft: 8,
          paddingRight: 8,
          marginBottom: 10,
          maxWidth: 280,
        }}
      >
        <span>fig.II — mill, in motion</span>
        <span>{w.deg}</span>
      </div>
      <pre
        style={{
          fontSize: 11,
          lineHeight: 1.18,
          letterSpacing: "0.02em",
          whiteSpace: "pre",
          margin: 0,
        }}
      >
        {renderSails(theta) + "\n" + BODY}
      </pre>
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--ink-mute)",
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          paddingLeft: 8,
          paddingRight: 8,
          marginTop: 10,
          maxWidth: 280,
        }}
      >
        <span>wind {w.dir}</span>
        <span>{w.kt} kt</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DRIFTING MILL — the ASCII mill travels along a dashed guide as the section
// scrolls past. Vertical in the desktop side column, horizontal on a phone.
// It trails the scroll with a little lag, gets pushed sideways by scroll speed,
// and its sails spin faster while the page is moving.
const DriftingMill = ({ vertical }) => {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const trackRef = React.useRef(null);
  const millRef = React.useRef(null);
  const markerRef = React.useRef(null);
  const readoutRef = React.useRef(null);
  const gustRef = React.useRef(0);

  React.useEffect(() => {
    const track = trackRef.current;
    const mill = millRef.current;
    const marker = markerRef.current;
    const readout = readoutRef.current;
    if (!track || !mill || !marker) return;
    if (reduced) {
      mill.style.transform = "none";
      marker.style.transform = "none";
      gustRef.current = 0;
      return;
    }

    let raf = null;
    let last = performance.now();
    let lastScroll = window.scrollY;
    let pos = null; // along the guide, px
    let sway = 0; // across the guide, px
    let scrollV = 0; // px/s, smoothed

    const tick = (now) => {
      const dt = Math.max(0.001, Math.min(0.05, (now - last) / 1000));
      last = now;

      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const mw = mill.offsetWidth;
      const mh = mill.offsetHeight;

      let target, p;
      if (vertical) {
        // descend the column over the whole time it crosses the screen — slower
        // than the page, so it reads as drifting rather than pinned
        const range = Math.max(0, rect.height - mh);
        p = Math.max(0, Math.min(1, (vh * 0.7 - rect.top) / (rect.height + vh * 0.1)));
        target = p * range;
      } else {
        // cross the column while the block rises from 85% to 25% of the screen
        const range = Math.max(0, rect.width - mw);
        p = Math.max(0, Math.min(1, (vh * 0.85 - rect.top) / (vh * 0.6)));
        target = p * range;
      }
      if (pos === null) pos = target;
      pos += (target - pos) * Math.min(1, dt * 3.5);

      const y = window.scrollY;
      const v = (y - lastScroll) / dt;
      lastScroll = y;
      scrollV += (v - scrollV) * Math.min(1, dt * 6);

      const swayMax = vertical ? 34 : 8;
      const swayTarget = Math.max(-swayMax, Math.min(swayMax, scrollV * (vertical ? 0.025 : 0.008)));
      sway += (swayTarget - sway) * Math.min(1, dt * 4);
      const tilt = sway * (vertical ? 0.1 : 0.25);

      gustRef.current = Math.min(7, Math.abs(scrollV) / 260);

      mill.style.transform = vertical
        ? `translate3d(${sway.toFixed(1)}px, ${pos.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg)`
        : `translate3d(${pos.toFixed(1)}px, ${sway.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg)`;
      marker.style.transform = vertical
        ? `translate3d(0, ${(pos + mh * 0.42).toFixed(1)}px, 0)`
        : `translate3d(${(pos + mw * 0.5).toFixed(1)}px, 0, 0)`;
      if (readout) readout.textContent = String(Math.round(p * 100)).padStart(3, "0");

      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && raf === null) {
        last = performance.now();
        lastScroll = window.scrollY;
        raf = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
        gustRef.current = 0;
      }
    });
    io.observe(track);

    return () => {
      io.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [vertical, reduced]);

  const guideColor = "var(--ink-faint)";
  const readoutStyle = {
    fontFamily: "var(--mono)",
    fontSize: 9.5,
    letterSpacing: "0.12em",
    color: "var(--ink-mute)",
    whiteSpace: "nowrap",
  };

  if (vertical) {
    return (
      <div ref={trackRef} style={{ position: "relative", height: "100%", paddingLeft: 28 }}>
        {/* dashed guide with ticks */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: 7,
            borderLeft: `1px dashed ${guideColor}`,
            backgroundImage: `repeating-linear-gradient(to bottom, ${guideColor} 0 1px, transparent 1px 48px)`,
            backgroundSize: "7px 100%",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          ref={markerRef}
          aria-hidden="true"
          style={{ position: "absolute", left: -3.5, top: 0, display: "flex", alignItems: "center", gap: 8, willChange: "transform" }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ink)", flexShrink: 0 }} />
        </div>
        <div ref={millRef} style={{ width: "max-content", willChange: "transform", transformOrigin: "50% 0" }}>
          <AsciiMill gustRef={gustRef} />
          <div style={{ ...readoutStyle, marginTop: 14, paddingLeft: 8 }}>
            ↓ <span ref={readoutRef}>000</span> / 100
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={trackRef} style={{ position: "relative", paddingBottom: 22 }}>
      <div ref={millRef} style={{ width: "max-content", willChange: "transform", transformOrigin: "50% 100%" }}>
        <AsciiMill gustRef={gustRef} />
      </div>
      {/* dashed guide with ticks */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0, height: 7,
          borderBottom: `1px dashed ${guideColor}`,
          backgroundImage: `repeating-linear-gradient(to right, ${guideColor} 0 1px, transparent 1px 40px)`,
        }}
      />
      <div
        ref={markerRef}
        aria-hidden="true"
        style={{ position: "absolute", left: -3.5, bottom: 3, willChange: "transform" }}
      >
        <span style={{ display: "block", width: 8, height: 8, borderRadius: "50%", background: "var(--ink)" }} />
      </div>
      <div style={{ ...readoutStyle, position: "absolute", right: 0, bottom: -20 }}>
        → <span ref={readoutRef}>000</span> / 100
      </div>
    </div>
  );
};

Object.assign(window, { AsciiMill, DriftingMill });
