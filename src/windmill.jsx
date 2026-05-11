// Interactive windmill: blades carry angular velocity, picked up from mouse motion.
// Cursor proximity adds a passive torque (the wind). Pure SVG, transform on a <g>.

const Windmill = ({ size = 520, idleSpin = 0.08 }) => {
  const wrapRef = React.useRef(null);
  const bladeRef = React.useRef(null);
  const stateRef = React.useRef({
    angle: 0,
    velocity: 0.6, // initial gentle spin
    lastT: performance.now(),
    mx: 0, my: 0,
    cx: 0, cy: 0,
    lastMx: 0, lastMy: 0,
    hasMouse: false,
  });

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const blade = bladeRef.current;
    if (!wrap || !blade) return;

    const updateCenter = () => {
      const r = wrap.getBoundingClientRect();
      stateRef.current.cx = r.left + r.width / 2;
      stateRef.current.cy = r.top + r.height / 2;
    };
    updateCenter();
    window.addEventListener("resize", updateCenter);
    window.addEventListener("scroll", updateCenter, { passive: true });

    const onMove = (e) => {
      const s = stateRef.current;
      s.lastMx = s.mx;
      s.lastMy = s.my;
      s.mx = e.clientX;
      s.my = e.clientY;
      s.hasMouse = true;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("pointermove", onMove);

    let raf;
    const tick = (now) => {
      const s = stateRef.current;
      const dt = Math.min(50, now - s.lastT) / 1000;
      s.lastT = now;

      // base wind (idle drift)
      let torque = idleSpin;

      if (s.hasMouse) {
        // distance falloff
        const dx = s.mx - s.cx;
        const dy = s.my - s.cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const reach = 700;
        const proximity = Math.max(0, 1 - dist / reach); // 0..1

        // mouse speed adds gust
        const vx = s.mx - s.lastMx;
        const vy = s.my - s.lastMy;
        const speed = Math.sqrt(vx * vx + vy * vy);
        torque += proximity * 0.9 + Math.min(speed * 0.25, 12);

        // cursor side (left/right) adds direction — feels like cursor is pushing the blade
        // positive dx (cursor to the right) => rotate clockwise (positive angle)
        torque += (dx / reach) * proximity * 4;
      }

      // integrate with friction
      s.velocity += torque * dt * 2.2;
      s.velocity *= Math.pow(0.86, dt * 60); // friction
      // cap
      s.velocity = Math.max(-30, Math.min(30, s.velocity));

      s.angle += s.velocity;
      blade.setAttribute("transform", `rotate(${s.angle} 200 210)`);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", updateCenter);
      window.removeEventListener("scroll", updateCenter);
    };
  }, [idleSpin]);

  // Geometry: viewBox 400x400. Hub at (200, 175). 4 sails in an X (matching logo).
  // Each sail = thin shaft + a 3x2 grid panel sitting on ONE side of the shaft,
  // so each sail is visibly individual when the wheel rotates.
  const sail = (rotation) => {
    const cellW = 22;
    const cellH = 22;
    const gap = 2;
    const panelStartX = 18;
    const shaftLen = panelStartX + 3 * (cellW + gap) + 2; // tip of arm
    const cells = [];
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        cells.push(
          <rect
            key={`${r}-${c}`}
            x={panelStartX + c * (cellW + gap)}
            y={3 + r * (cellH + gap)}
            width={cellW}
            height={cellH}
            fill="var(--paper)"
            stroke="currentColor"
            strokeWidth="2.4"
          />
        );
      }
    }
    return (
      <g transform={`rotate(${rotation})`}>
        <line
          x1="4"
          y1="0"
          x2={shaftLen}
          y2="0"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {cells}
      </g>
    );
  };

  return (
    <div
      ref={wrapRef}
      style={{
        width: size,
        height: size,
        color: "var(--ink)",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <svg viewBox="0 0 400 400" width="100%" height="100%" aria-hidden="true">
        {/* faint ground line */}
        <path
          d="M 30 320 Q 200 312 370 320"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.5"
        />

        {/* mill body — silhouette */}
        <g>
          {/* trapezoid body */}
          <path
            d="M 158 320 L 168 200 L 232 200 L 242 320 Z"
            fill="currentColor"
          />
          {/* roof / cap */}
          <path
            d="M 168 200 Q 200 160 232 200 Z"
            fill="currentColor"
          />
          {/* arched door */}
          <path
            d="M 188 320 L 188 282 Q 188 268 200 268 Q 212 268 212 282 L 212 320 Z"
            fill="var(--paper)"
          />
          {/* small upper window */}
          <circle cx="200" cy="240" r="5" fill="var(--paper)" opacity="0.0" />
        </g>

        {/* blades — rotate around hub (200, 162). Sails arranged at 45/135/225/315 to form the X. */}
        <g ref={bladeRef} transform="rotate(0 200 210)">
          <g transform="translate(200 210)">
            {sail(45)}
            {sail(135)}
            {sail(225)}
            {sail(315)}
            {/* central hub block (matches logo's small rectangular axle) */}
            <rect x="-7" y="-7" width="14" height="14" fill="currentColor" />
            <circle cx="0" cy="0" r="3" fill="var(--paper)" />
          </g>
        </g>
      </svg>
    </div>
  );
};

window.Windmill = Windmill;
