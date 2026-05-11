// Wind particle field — drifting dots on canvas, gently displaced by the cursor.
// Stays subtle so it doesn't fight the editorial layout.

const ParticleField = ({ density = 0.00012, opacity = 0.55 }) => {
  const canvasRef = React.useRef(null);
  const stateRef = React.useRef({
    parts: [],
    w: 0, h: 0,
    mx: -9999, my: -9999,
    hasMouse: false,
    raf: 0,
  });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const s = stateRef.current;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      s.w = r.width;
      s.h = r.height;
      canvas.width = Math.floor(r.width * dpr);
      canvas.height = Math.floor(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.max(40, Math.floor(s.w * s.h * density));
      s.parts = new Array(target).fill(0).map(() => spawn(true));
    };

    const spawn = (random) => ({
      x: random ? Math.random() * s.w : -10,
      y: Math.random() * s.h,
      vx: 0.15 + Math.random() * 0.5,
      vy: (Math.random() - 0.5) * 0.05,
      r: Math.random() < 0.85 ? 0.8 : 1.6,
      a: 0.25 + Math.random() * 0.55,
      life: 0,
    });

    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      s.mx = e.clientX - r.left;
      s.my = e.clientY - r.top;
      s.hasMouse = true;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("pointermove", onMove);

    const tick = () => {
      ctx.clearRect(0, 0, s.w, s.h);
      ctx.fillStyle = `rgba(17, 17, 16, ${opacity})`;

      for (let i = 0; i < s.parts.length; i++) {
        const p = s.parts[i];

        // cursor displacement — gentle radial push
        if (s.hasMouse) {
          const dx = p.x - s.mx;
          const dy = p.y - s.my;
          const d2 = dx * dx + dy * dy;
          const reach = 140;
          if (d2 < reach * reach && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = (1 - d / reach) * 0.6;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }

        // damping toward base flow
        p.vx = p.vx * 0.94 + 0.32 * 0.06;
        p.vy = p.vy * 0.92;

        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;

        if (p.x > s.w + 4 || p.y < -4 || p.y > s.h + 4) {
          Object.assign(p, spawn(false));
        }

        const alpha = p.a;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointermove", onMove);
    };
  }, [density, opacity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

window.ParticleField = ParticleField;
