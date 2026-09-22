// BENCH — the tool rail.
// A strip of workshop tools hanging from a rail, each one a platform the
// studio builds for. The rail slides like a marquee; its speed follows the
// windmill in the hero (MILL_WIND), and the tools lean back as it speeds up.

const { useT, useIsMobile, useIsTouch, useMediaQuery, MILL_WIND } = window;

// Each tool is drawn in a 60 × 150 box, hanging from a peg at (30, 0).
const TOOL_STROKE = { fill: "var(--paper)", stroke: "var(--ink)", strokeWidth: 1.4, strokeLinejoin: "round" };

const TOOLS = {
  chisel: (
    <g {...TOOL_STROKE}>
      <rect x={22} y={18} width={16} height={52} rx={7} />
      <circle cx={30} cy={26} r={2.6} />
      <rect x={24} y={70} width={12} height={7} />
      <path d="M26 77 L34 77 L35.5 140 L24.5 140 Z" />
      <line x1={24.8} y1={131} x2={35.2} y2={131} />
    </g>
  ),
  wrench: (
    <g {...TOOL_STROKE}>
      <circle cx={30} cy={27} r={9} />
      <circle cx={30} cy={27} r={3.6} />
      <rect x={26} y={35} width={8} height={84} rx={2} />
      <path d="M24.5 141 A13 13 0 1 1 35.5 141 L35.5 131 L24.5 131 Z" />
    </g>
  ),
  square: (
    <g {...TOOL_STROKE}>
      <path d="M16 18 L56 18 L56 27 L28 27 L28 142 L16 142 Z" />
      <circle cx={30} cy={22.5} r={2.2} />
      {[40, 52, 64, 76, 88, 100, 112, 124, 136].map((y, i) => (
        <line key={y} x1={28} y1={y} x2={i % 2 ? 24 : 22} y2={y} strokeWidth={1} />
      ))}
    </g>
  ),
  saw: (
    <g {...TOOL_STROKE}>
      <rect x={15} y={17} width={30} height={34} rx={9} />
      <rect x={23} y={25} width={14} height={14} rx={5} />
      <path d="M17 51 L43 51 L37 143 L27 143 Z" />
      <path
        d="M17 51 L16 56 L18 59 L17 64 L19 67 L18 72 L20 75 L19 80 L21 83 L20 88 L22 91 L21 96 L23 99 L22 104 L24 107 L23 112 L25 115 L24 120 L26 123 L25 128 L27 131 L26 136 L27 143"
        fill="none" strokeWidth={1}
      />
    </g>
  ),
  caliper: (
    <g {...TOOL_STROKE}>
      <rect x={26} y={18} width={8} height={124} rx={1.5} />
      <circle cx={30} cy={24} r={2.2} />
      <path d="M34 32 L52 32 L48 44 L34 44 Z" />
      <rect x={22} y={66} width={16} height={28} rx={2} />
      <path d="M38 70 L52 70 L48 80 L38 80 Z" />
      {[104, 110, 116, 122, 128, 134].map((y, i) => (
        <line key={y} x1={26} y1={y} x2={i % 2 ? 29 : 31} y2={y} strokeWidth={1} />
      ))}
    </g>
  ),
  hammer: (
    <g {...TOOL_STROKE}>
      <path d="M12 20 L46 20 Q50 20 50 25 L50 33 L12 33 Q9 26.5 12 20 Z" />
      <circle cx={30} cy={26.5} r={2.2} />
      <rect x={26.5} y={33} width={7} height={108} rx={3} />
      <line x1={26.5} y1={118} x2={33.5} y2={118} strokeWidth={1} />
    </g>
  ),
  pliers: (
    <g strokeLinecap="round" fill="none">
      {/* outlined handles: a wide ink stroke with a paper stroke inside it */}
      {["M28 22 Q23 36 28 50 Q20 95 17 142", "M32 22 Q37 36 32 50 Q40 95 43 142"].map((d) => (
        <g key={d}>
          <path d={d} stroke="var(--ink)" strokeWidth={7.5} />
          <path d={d} stroke="var(--paper)" strokeWidth={4.7} />
        </g>
      ))}
      <circle cx={30} cy={50} r={3.4} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.4} />
    </g>
  ),
};

const RAIL_ITEMS = [
  { tool: "chisel", word: "iOS" },
  { tool: "wrench", word: "Android" },
  { tool: "square", word: "macOS" },
  { tool: "saw", word: "Windows" },
  { tool: "caliper", word: "Web" },
  { tool: "hammer", word: "Offline" },
  { tool: "pliers", word: "Sync" },
];

const RailItem = ({ item, caption, index, isMobile, toolRef }) => {
  const h = isMobile ? 132 : 196;
  const serif = index % 2 === 1;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: isMobile ? 14 : 22,
        paddingRight: isMobile ? 40 : 72,
        flexShrink: 0,
      }}
    >
      <svg
        width={(h * 60) / 150}
        height={h}
        viewBox="0 -2 60 152"
        aria-hidden="true"
        style={{ display: "block", overflow: "visible", flexShrink: 0 }}
      >
        <g ref={toolRef}>
          {/* peg from the rail */}
          <line x1={30} y1={-2} x2={30} y2={22} stroke="var(--ink-mute)" strokeWidth={1.2} />
          {TOOLS[item.tool]}
          <circle cx={30} cy={22} r={1.4} fill="var(--ink)" />
        </g>
      </svg>
      <div style={{ paddingTop: h * 0.3, whiteSpace: "nowrap" }}>
        <div
          style={
            serif
              ? {
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: isMobile ? 50 : "clamp(56px, 6.2vw, 96px)",
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                }
              : {
                  fontFamily: "var(--sans)",
                  fontWeight: 400,
                  fontSize: isMobile ? 44 : "clamp(48px, 5.4vw, 84px)",
                  lineHeight: 1,
                  letterSpacing: "-0.035em",
                }
          }
        >
          {item.word}
        </div>
        <div className="kicker" style={{ marginTop: isMobile ? 12 : 16, fontSize: 10.5 }}>
          {caption}
        </div>
      </div>
    </div>
  );
};

const Bench = () => {
  const { t } = useT();
  const isMobile = useIsMobile();
  const isTouch = useIsTouch();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const b = t.bench;

  const stripRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const groupRef = React.useRef(null);
  const toolRefs = React.useRef([]);
  const hoverRef = React.useRef(false);

  React.useEffect(() => {
    const strip = stripRef.current;
    const track = trackRef.current;
    const group = groupRef.current;
    if (!strip || !track || !group) return;
    if (reduced) {
      track.style.transform = "none";
      toolRefs.current.forEach((g) => g && g.removeAttribute("transform"));
      return;
    }

    let raf = null;
    let last = performance.now();
    let offset = 0;
    let speed = 40; // px/s
    let lean = 0; // degrees

    const tick = (now) => {
      const dt = Math.min(50, now - last) / 1000;
      last = now;

      // idle drift plus whatever the mill is doing; hovering slows it to read
      const wind = Math.min(8, Math.abs((MILL_WIND && MILL_WIND.velocity) || 0));
      let target = 36 + wind * 70;
      if (hoverRef.current) target *= 0.2;
      speed += (target - speed) * Math.min(1, dt * 2.5);

      const w = group.offsetWidth;
      offset = w ? (offset + speed * dt) % w : 0;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;

      // tools trail the rail: lean back with speed, plus a slow sway of their own
      const targetLean = Math.min(14, (speed - 36) * 0.045);
      lean += (targetLean - lean) * Math.min(1, dt * 3);
      const tSec = now / 1000;
      toolRefs.current.forEach((g, i) => {
        if (!g) return;
        const sway = Math.sin(tSec * 1.4 + i * 1.7) * (1.2 + lean * 0.15);
        // the rail runs left, so a trailing tool swings its foot to the right (negative angle)
        g.setAttribute("transform", `rotate(${(sway - lean).toFixed(2)} 30 -2)`);
      });

      raf = requestAnimationFrame(tick);
    };

    // only run while the strip is on screen
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && raf === null) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    });
    io.observe(strip);

    return () => {
      io.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [reduced, isMobile]);

  const group = (copy) => (
    <div ref={copy === 0 ? groupRef : null} style={{ display: "flex", flexShrink: 0 }} aria-hidden={copy === 1 ? "true" : undefined}>
      {RAIL_ITEMS.map((item, i) => (
        <RailItem
          key={item.word}
          item={item}
          caption={b.captions[i]}
          index={i}
          isMobile={isMobile}
          toolRef={(el) => { toolRefs.current[copy * RAIL_ITEMS.length + i] = el; }}
        />
      ))}
    </div>
  );

  return (
    <section
      id="bench"
      style={{
        padding: isMobile ? "88px 0 64px" : "130px 0 96px",
        position: "relative",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: isMobile ? 24 : 48,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div className="kicker">{b.kicker}</div>
            <h2
              style={{
                fontFamily: "var(--sans)",
                fontWeight: 400,
                fontSize: isMobile ? "clamp(28px, 7.4vw, 44px)" : "clamp(34px, 4vw, 56px)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                marginTop: isMobile ? 18 : 28,
              }}
            >
              {b.h2a}
              <em style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400 }}>{b.h2b}</em>
            </h2>
          </div>
          <p style={{ maxWidth: 400, fontSize: 15, lineHeight: 1.55, color: "var(--ink-mute)" }}>{b.sub}</p>
        </div>
      </div>

      {/* the rail — full bleed, on a pegboard */}
      <div
        ref={stripRef}
        onMouseEnter={() => { hoverRef.current = true; }}
        onMouseLeave={() => { hoverRef.current = false; }}
        style={{
          position: "relative",
          marginTop: isMobile ? 48 : 72,
          padding: isMobile ? "0 0 36px" : "0 0 52px",
          overflow: "hidden",
          backgroundImage: "radial-gradient(var(--rule) 1.2px, transparent 1.2px)",
          backgroundSize: "18px 18px",
          backgroundPosition: "9px 14px",
          borderBottom: "1px solid var(--rule)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
          maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
        }}
      >
        {/* the rail itself stays put; the pegs slide along it */}
        <div style={{ height: 8, borderTop: "1.5px solid var(--ink)", borderBottom: "1px solid var(--ink-faint)", background: "var(--paper)" }} />
        <div
          ref={trackRef}
          style={{
            display: "flex",
            width: "max-content",
            paddingLeft: isMobile ? 20 : 32,
            willChange: "transform",
          }}
        >
          {group(0)}
          {group(1)}
        </div>
      </div>

      <div className="container">
        <div
          style={{
            marginTop: isMobile ? 22 : 28,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div style={{ width: 28, height: 1, flexShrink: 0, background: "var(--ink-mute)", opacity: 0.5 }} />
          <span className="kicker">{isTouch ? b.hintTouch : b.hint}</span>
        </div>
      </div>
    </section>
  );
};

Object.assign(window, { Bench });
