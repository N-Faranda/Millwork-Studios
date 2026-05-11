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

const AsciiMill = () => {
  const [theta, setTheta] = React.useState(0);
  const [hover, setHover] = React.useState(false);
  const thetaRef = React.useRef(0);

  React.useEffect(() => {
    let raf;
    let last = performance.now();
    const targetSpeed = hover ? 4.2 : 1.15; // rad/sec
    let speed = hover ? 2 : 1.15;
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // ease toward target speed so hover transitions feel natural
      speed += (targetSpeed - speed) * Math.min(1, dt * 4);
      thetaRef.current += speed * dt;
      setTheta(thetaRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hover]);

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

window.AsciiMill = AsciiMill;
