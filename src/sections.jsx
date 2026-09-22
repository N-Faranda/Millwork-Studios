// All page sections live here. Editorial monochrome, OpenAI-inspired layout.

const { useT, useIsMobile, useIsNarrow, useIsTouch } = window;

// ─────────────────────────────────────────────────────────────────────────────
// NAV
const Nav = () => {
  const { t, lang, setLang } = useT();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // the drawer is a phone affordance — never leave it hanging on a wider window
  React.useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  const solid = scrolled || open;

  const navStyle = {
    position: "fixed",
    top: 0, left: 0, right: 0,
    zIndex: 50,
    padding: isMobile
      ? (solid ? "12px 20px" : "16px 20px")
      : (solid ? "14px 32px" : "22px 32px"),
    transition: "padding 0.35s ease, background 0.35s ease, border-color 0.35s ease",
    // the open drawer needs an opaque sheet — blurred hero text behind the
    // links is unreadable
    background: open ? "var(--paper)" : solid ? "rgba(243, 240, 233, 0.85)" : "transparent",
    backdropFilter: solid ? "blur(12px)" : "none",
    WebkitBackdropFilter: solid ? "blur(12px)" : "none",
    borderBottom: solid ? "1px solid var(--rule)" : "1px solid transparent",
  };

  const toTop = (e) => {
    e.preventDefault();
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", window.location.pathname);
  };

  const items = [
    { label: "Home", href: "#top", onClick: toTop },
    { label: t.nav.products, href: "#products" },
    { label: t.nav.studio, href: "#studio" },
    { label: t.nav.contact, href: "#contact" },
  ];

  return (
    <nav style={navStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1440,
          margin: "0 auto",
        }}
      >
        <a
          href="#top"
          onClick={toTop}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          <MillMark size={20} />
          <span
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 500,
              fontSize: 15,
              letterSpacing: "-0.01em",
            }}
          >
            Millwork Studios
          </span>
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 28 }}>
          {!isMobile &&
            items.map((it) => (
              <NavLink key={it.href} href={it.href} onClick={it.onClick}>
                {it.label}
              </NavLink>
            ))}
          <LangToggle lang={lang} setLang={setLang} />
          {isMobile && <MenuButton open={open} onClick={() => setOpen((o) => !o)} />}
        </div>
      </div>

      {isMobile && (
        <div
          style={{
            maxHeight: open ? 320 : 0,
            opacity: open ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.35s ease, opacity 0.25s ease",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", paddingTop: 10 }}>
            {items.map((it) => (
              <a
                key={it.href}
                href={it.href}
                onClick={(e) => {
                  if (it.onClick) it.onClick(e);
                  setOpen(false);
                }}
                style={{
                  padding: "14px 2px",
                  fontSize: 17,
                  letterSpacing: "-0.01em",
                  color: "var(--ink-soft)",
                  borderTop: "1px solid var(--rule-soft)",
                }}
              >
                {it.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// Hamburger that folds into a cross when the drawer is open.
const MenuButton = ({ open, onClick }) => {
  const { t } = useT();
  return (
    <button
      onClick={onClick}
      aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
      aria-expanded={open}
      style={{
        width: 40,
        height: 40,
        marginRight: -8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
      }}
    >
      {[0, 1].map((i) => (
        <span
          key={i}
          style={{
            display: "block",
            width: 20,
            height: 1.5,
            background: "var(--ink)",
            transition: "transform 0.3s ease",
            transform: open
              ? `translateY(${i === 0 ? 3.25 : -3.25}px) rotate(${i === 0 ? 45 : -45}deg)`
              : "none",
          }}
        />
      ))}
    </button>
  );
};

const NavLink = ({ href, children, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    style={{
      fontFamily: "var(--sans)",
      fontSize: 14,
      fontWeight: 400,
      color: "var(--ink-soft)",
      transition: "color 0.2s ease",
      position: "relative",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-soft)")}
  >
    {children}
  </a>
);

const LangToggle = ({ lang, setLang }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      fontFamily: "var(--mono)",
      fontSize: 11,
      letterSpacing: "0.1em",
      border: "1px solid var(--rule)",
      borderRadius: 999,
      padding: 2,
    }}
  >
    {["en", "it"].map((code) => (
      <button
        key={code}
        onClick={() => setLang(code)}
        style={{
          padding: "5px 10px",
          borderRadius: 999,
          background: lang === code ? "var(--ink)" : "transparent",
          color: lang === code ? "var(--paper)" : "var(--ink-mute)",
          transition: "all 0.2s ease",
          textTransform: "uppercase",
        }}
      >
        {code}
      </button>
    ))}
  </div>
);

// Tiny static windmill icon for nav (no animation, just the mark)
const MillMark = ({ size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M9 22 L10.2 13 L13.8 13 L15 22 Z" fill="currentColor" stroke="none" />
    <path d="M10.2 13 Q12 10 13.8 13 Z" fill="currentColor" stroke="none" />
    <line x1="12" y1="11.5" x2="5" y2="4.5" />
    <line x1="12" y1="11.5" x2="19" y2="4.5" />
    <line x1="12" y1="11.5" x2="5" y2="18.5" />
    <line x1="12" y1="11.5" x2="19" y2="18.5" />
    <circle cx="12" cy="11.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// HERO
const Hero = () => {
  const { t } = useT();
  const isMobile = useIsMobile();
  const isTouch = useIsTouch();
  const wrapRef = React.useRef(null);

  const annotations = (
    <React.Fragment>
      <div style={annotStyle(isMobile, "left")}>{t.hero.fig}</div>
      <div style={annotStyle(isMobile, "right")}>
        {isTouch ? t.hero.interactiveTouch : t.hero.interactive}
      </div>
    </React.Fragment>
  );

  return (
    <section
      id="top"
      ref={wrapRef}
      style={{
        position: "relative",
        minHeight: isMobile ? "auto" : "100vh",
        paddingTop: isMobile ? 96 : 110,
        paddingBottom: isMobile ? 56 : 80,
        overflow: "hidden",
      }}
    >
      <ParticleField density={isMobile ? 0.00007 : 0.00012} />

      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          // minmax(0, …) lets the mill column shrink below the mill's own
          // width between the tablet and desktop sizes, instead of overflowing
          gridTemplateColumns: isMobile ? "1fr" : "1.1fr minmax(0, 1fr)",
          gap: isMobile ? 48 : 64,
          alignItems: "center",
          minHeight: isMobile ? 0 : "calc(100vh - 110px)",
        }}
      >
        {/* Text column */}
        <div>
          <div className="kicker" style={{ marginBottom: isMobile ? 24 : 36 }}>
            {t.hero.kicker}
          </div>
          <h1
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 400,
              fontSize: isMobile ? "clamp(38px, 9.5vw, 60px)" : "clamp(44px, 6.2vw, 92px)",
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              color: "var(--ink)",
              maxWidth: isMobile ? "none" : "12.5ch",
            }}
          >
            {t.hero.h1a}{" "}
            <em
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontWeight: 400,
                letterSpacing: "-0.01em",
              }}
            >
              {t.hero.h1b}
            </em>{" "}
            {t.hero.h1c}{" "}
            <em
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontWeight: 400,
                letterSpacing: "-0.01em",
              }}
            >
              {t.hero.h1d}
            </em>{" "}
            {t.hero.h1e}
          </h1>

          <p
            style={{
              marginTop: isMobile ? 26 : 36,
              maxWidth: 460,
              fontSize: isMobile ? 16 : 17,
              lineHeight: 1.55,
              color: "var(--ink-soft)",
            }}
          >
            {t.hero.sub}
          </p>

          <div
            style={{
              marginTop: isMobile ? 32 : 56,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 28,
                height: 1,
                flexShrink: 0,
                background: "var(--ink-mute)",
                opacity: 0.5,
              }}
            />
            <span
              className="kicker"
              style={{ color: "var(--ink-mute)", fontSize: 11 }}
            >
              {isTouch ? t.hero.hintTouch : t.hero.hint}
            </span>
          </div>
        </div>

        {/* Windmill column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Windmill size={isMobile ? "min(86vw, 380px)" : 560} />

          {/* Coordinate ticks / editorial annotation */}
          {isMobile ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 4,
              }}
            >
              {annotations}
            </div>
          ) : (
            annotations
          )}
        </div>
      </div>

      {/* Section divider rule */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 1,
          background: "var(--rule)",
        }}
      />
    </section>
  );
};

// On desktop the two ticks sit in the corners of the mill panel; on a phone
// they line up as a caption strip underneath it.
const annotStyle = (isMobile, side) => ({
  position: isMobile ? "static" : "absolute",
  left: isMobile || side === "right" ? undefined : 0,
  right: isMobile || side === "left" ? undefined : 0,
  top: isMobile || side === "right" ? undefined : 24,
  bottom: isMobile || side === "left" ? undefined : 24,
  fontFamily: "var(--mono)",
  fontSize: 10,
  color: "var(--ink-mute)",
  letterSpacing: "0.1em",
  textAlign: side === "right" ? "right" : "left",
});

// ─────────────────────────────────────────────────────────────────────────────
// MANIFESTO
const Manifesto = () => {
  const { t } = useT();
  const isMobile = useIsMobile();
  return (
    <section
      id="studio"
      style={{
        padding: isMobile ? "88px 0 72px" : "140px 0 120px",
        position: "relative",
        borderTop: "1px solid var(--rule)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 2.2fr",
            gap: isMobile ? 44 : 80,
            alignItems: "start",
          }}
        >
          <div style={isMobile ? {} : { alignSelf: "stretch", display: "flex", flexDirection: "column" }}>
            <div className="kicker">{t.manifesto.kicker}</div>
            <div style={{ marginTop: 32, flex: 1 }}>
              <DriftingMill vertical={!isMobile} />
            </div>
          </div>

          <div>
            <h2
              style={{
                fontFamily: "var(--sans)",
                fontWeight: 400,
                fontSize: isMobile ? "clamp(28px, 7.4vw, 44px)" : "clamp(34px, 4vw, 56px)",
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                maxWidth: isMobile ? "none" : "20ch",
              }}
            >
              {t.manifesto.h2a}
              <em
                style={{
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                {t.manifesto.h2b}
              </em>
              {t.manifesto.h2c}
            </h2>

            <div
              style={{
                marginTop: isMobile ? 32 : 56,
                maxWidth: 620,
                display: "flex",
                flexDirection: "column",
                gap: 22,
                fontSize: isMobile ? 16 : 17,
                lineHeight: 1.65,
                color: "var(--ink-soft)",
              }}
            >
              {t.manifesto.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* pillars */}
            <div
              style={{
                marginTop: isMobile ? 52 : 88,
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: isMobile ? 30 : 36,
                borderTop: "1px solid var(--rule)",
                paddingTop: 36,
              }}
            >
              {t.manifesto.pillars.map((p, i) => (
                <div key={i}>
                  <div
                    style={{
                      fontFamily: "var(--serif)",
                      fontStyle: "italic",
                      fontSize: 22,
                      color: "var(--ink-mute)",
                      marginBottom: 16,
                    }}
                  >
                    {p.n}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--sans)",
                      fontWeight: 500,
                      fontSize: 17,
                      letterSpacing: "-0.005em",
                      marginBottom: 8,
                    }}
                  >
                    {p.t}
                  </div>
                  <div
                    style={{
                      fontSize: 14.5,
                      lineHeight: 1.55,
                      color: "var(--ink-mute)",
                    }}
                  >
                    {p.d}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT TILE (Plough)
const PloughTile = () => {
  const { t } = useT();
  const isMobile = useIsMobile();
  const tileRef = React.useRef(null);
  const [hover, setHover] = React.useState(false);

  // hover-driven blade rotation specific to this tile
  const [angle, setAngle] = React.useState(0);
  React.useEffect(() => {
    let raf;
    let v = 0;
    let a = 0;
    const tick = () => {
      const target = hover ? 4 : 0.4;
      v += (target - v) * 0.06;
      a += v;
      setAngle(a);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hover]);

  return (
    <a
      href="plough.html"
      ref={tileRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        position: "relative",
        background: "var(--ink)",
        color: "var(--paper)",
        padding: isMobile ? "28px 24px 24px" : "44px 44px 36px",
        minHeight: isMobile ? 380 : 520,
        overflow: "hidden",
        transition: "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* faint blade pattern in background — grid panels like windmill sails */}
      <div
        style={{
          position: "absolute",
          // on a narrow tile the wheel has to sit further out, or its hub lands
          // in the middle of the card and reads as a smudge behind the text
          right: isMobile ? -140 : -120,
          bottom: isMobile ? -150 : -120,
          width: isMobile ? 380 : 520,
          height: isMobile ? 380 : 520,
          opacity: hover ? 0.18 : 0.1,
          transition: "opacity 0.5s ease",
        }}
      >
        <svg viewBox="-200 -200 400 400" width="100%" height="100%">
          <g
            transform={`rotate(${angle})`}
            stroke="var(--paper)"
            strokeWidth="1.4"
            fill="none"
          >
            {[0, 90, 180, 270].map((rot) => (
              <g key={rot} transform={`rotate(${rot})`}>
                {[0, 1, 2].map((c) =>
                  [0, 1].map((r) => (
                    <rect
                      key={`${c}-${r}`}
                      x={22 + c * 38}
                      y={-38 + r * 38}
                      width={34}
                      height={34}
                    />
                  ))
                )}
                <line x1="6" y1="0" x2="160" y2="0" />
              </g>
            ))}
            <circle r="10" fill="var(--paper)" />
          </g>
        </svg>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: isMobile ? 320 : 440,
          justifyContent: "space-between",
          gap: isMobile ? 28 : 40,
        }}
      >
        {/* Top: meta + arrow */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div
            className="kicker"
            style={{ color: "rgba(243,240,233,0.6)" }}
          >
            01 / Plough
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              border: "1px solid rgba(243,240,233,0.3)",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              transform: hover ? "rotate(-45deg)" : "rotate(0)",
              background: hover ? "var(--paper)" : "transparent",
              color: hover ? "var(--ink)" : "var(--paper)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M3 7 H 11 M 7 3 L 11 7 L 7 11" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div>
          <div
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 400,
              fontSize: isMobile ? "clamp(44px, 13vw, 64px)" : "clamp(48px, 5.5vw, 88px)",
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              marginBottom: 14,
            }}
          >
            {t.plough.title}
            <em
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontWeight: 400,
                opacity: 0.85,
                marginLeft: 4,
              }}
            >
              .
            </em>
          </div>
          <div
            style={{
              fontSize: isMobile ? 16 : 18,
              color: "rgba(243, 240, 233, 0.7)",
              maxWidth: "32ch",
              lineHeight: 1.45,
            }}
          >
            {t.plough.tag}
          </div>
        </div>

        {/* Bottom meta */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "flex-end",
            gap: isMobile ? 14 : 0,
            paddingTop: 24,
            borderTop: "1px solid rgba(243, 240, 233, 0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: isMobile ? "6px 16px" : 24,
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(243, 240, 233, 0.55)",
            }}
          >
            {t.plough.meta.map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--paper)",
            }}
          >
            {t.products.enter} →
          </span>
        </div>
      </div>
    </a>
  );
};

// "Coming soon" tile — a single subtle placeholder for the slot of future products
const SoonTile = ({ label }) => {
  const isMobile = useIsMobile();
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        background: "transparent",
        border: "1px dashed var(--rule)",
        padding: isMobile ? "28px 24px 24px" : "44px 44px 36px",
        minHeight: isMobile ? 220 : 520,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "var(--ink-mute)",
        transition: "border-color 0.3s ease",
        borderColor: hover ? "var(--ink-mute)" : "var(--rule)",
      }}
    >
      <div className="kicker">— / {label}</div>
      <div>
        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontSize: isMobile ? 40 : 56,
            lineHeight: 1,
            color: "var(--ink-faint)",
            marginBottom: isMobile ? 10 : 16,
          }}
        >
          —
        </div>
        <div style={{ fontSize: 15, maxWidth: "26ch", color: "var(--ink-mute)" }}>
          {label}
        </div>
      </div>
      <div className="kicker" style={{ alignSelf: "flex-end" }}>
        ◴
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS
const Products = () => {
  const { t } = useT();
  const isMobile = useIsMobile();
  return (
    <section
      id="products"
      style={{
        padding: isMobile ? "88px 0 72px" : "140px 0 120px",
        borderTop: "1px solid var(--rule)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: isMobile ? 40 : 64,
            gap: isMobile ? 24 : 48,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div className="kicker">{t.products.kicker}</div>
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
              {t.products.h2a}
              <em
                style={{
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                {t.products.h2b}
              </em>
            </h2>
          </div>
          <p
            style={{
              maxWidth: 380,
              fontSize: 15,
              lineHeight: 1.55,
              color: "var(--ink-mute)",
            }}
          >
            {t.products.sub}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: isMobile ? 16 : 24,
          }}
        >
          <PloughTile />
          <SoonTile label={t.products.soon} />
          <SoonTile label={t.products.soon} />
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT
const Contact = () => {
  const { t } = useT();
  const isMobile = useIsMobile();
  const isNarrow = useIsNarrow();
  const [copied, setCopied] = React.useState(false);
  const onCopy = (e) => {
    e.preventDefault();
    navigator.clipboard?.writeText(t.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section
      id="contact"
      style={{
        padding: isMobile ? "88px 0 88px" : "140px 0 140px",
        borderTop: "1px solid var(--rule)",
        background: "var(--paper-2)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1.2fr",
            gap: isMobile ? 44 : 80,
            alignItems: "start",
          }}
        >
          <div>
            <div className="kicker">{t.contact.kicker}</div>
            <h2
              style={{
                fontFamily: "var(--sans)",
                fontWeight: 400,
                fontSize: isMobile ? "clamp(32px, 8.4vw, 52px)" : "clamp(40px, 5vw, 72px)",
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
                marginTop: isMobile ? 18 : 28,
              }}
            >
              {t.contact.h2a}
              <em
                style={{
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                {t.contact.h2b}
              </em>
            </h2>
            <p
              style={{
                marginTop: 28,
                maxWidth: 380,
                fontSize: 16,
                lineHeight: 1.55,
                color: "var(--ink-soft)",
              }}
            >
              {t.contact.body}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 16 : 36 }}>
            {/* Email card */}
            <a
              href={`mailto:${t.contact.email}`}
              onContextMenu={onCopy}
              onClick={onCopy}
              style={{
                display: "flex",
                flexDirection: isNarrow ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isNarrow ? "flex-start" : "center",
                padding: isMobile ? "22px 22px" : "28px 32px",
                background: "var(--paper)",
                border: "1px solid var(--rule)",
                transition: "all 0.3s ease",
                gap: isNarrow ? 14 : 24,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--ink)";
                e.currentTarget.style.color = "var(--paper)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--paper)";
                e.currentTarget.style.color = "var(--ink)";
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  className="kicker"
                  style={{ color: "inherit", opacity: 0.55, marginBottom: 6 }}
                >
                  Email
                </div>
                <div
                  style={{
                    fontFamily: "var(--sans)",
                    fontWeight: 400,
                    fontSize: isMobile ? "clamp(15px, 4.4vw, 20px)" : "clamp(20px, 2.4vw, 30px)",
                    letterSpacing: "-0.015em",
                    overflowWrap: "anywhere",
                  }}
                >
                  {t.contact.email}
                </div>
              </div>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  opacity: 0.6,
                }}
              >
                {copied ? "✓ Copied" : "Copy →"}
              </div>
            </a>

            {/* address + hours */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isNarrow ? "1fr" : "1fr 1fr",
                gap: isMobile ? 16 : 24,
              }}
            >
              <div
                style={{
                  padding: "28px 28px",
                  background: "var(--paper)",
                  border: "1px solid var(--rule)",
                }}
              >
                <div className="kicker" style={{ marginBottom: 14 }}>
                  {t.contact.addrLabel}
                </div>
                {t.contact.addr.map((l, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: 15,
                      lineHeight: 1.5,
                      color: "var(--ink-soft)",
                    }}
                  >
                    {l}
                  </div>
                ))}
              </div>

              <div
                style={{
                  padding: "28px 28px",
                  background: "var(--paper)",
                  border: "1px solid var(--rule)",
                }}
              >
                <div className="kicker" style={{ marginBottom: 14 }}>
                  {t.contact.hoursLabel}
                </div>
                {t.contact.hours.map((l, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: 15,
                      lineHeight: 1.5,
                      color: "var(--ink-soft)",
                      fontStyle: i === 1 ? "italic" : "normal",
                      fontFamily: i === 1 ? "var(--serif)" : "var(--sans)",
                    }}
                  >
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
const Footer = () => {
  const { t } = useT();
  const isMobile = useIsMobile();
  const isNarrow = useIsNarrow();
  return (
    <footer
      style={{
        padding: isMobile ? "56px 0 32px" : "72px 0 40px",
        borderTop: "1px solid var(--rule)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isNarrow ? "1fr 1fr" : isMobile ? "1fr 1fr 1fr" : "1.6fr 1fr 1fr 1fr",
            gap: isMobile ? 32 : 48,
            alignItems: "start",
          }}
        >
          <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <MillMark size={20} />
              <span style={{ fontWeight: 500, fontSize: 15 }}>Millwork Studios</span>
            </div>
            <p
              style={{
                fontSize: 14,
                color: "var(--ink-mute)",
                maxWidth: "32ch",
                lineHeight: 1.55,
              }}
            >
              {t.footer.tag}
            </p>
          </div>

          {[
            { title: t.footer.colA, items: t.footer.colAitems },
            { title: t.footer.colB, items: t.footer.colBitems },
            { title: t.footer.colC, items: t.footer.colCitems },
          ].map((col, i) => (
            <div key={i}>
              <div className="kicker" style={{ marginBottom: 16 }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.items.map((item, j) => (
                  <a
                    key={j}
                    href="#"
                    style={{
                      fontSize: 14,
                      color: "var(--ink-soft)",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-soft)")}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: isMobile ? 44 : 64,
            paddingTop: 24,
            borderTop: "1px solid var(--rule)",
            display: "flex",
            flexDirection: isNarrow ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isNarrow ? "flex-start" : "center",
            gap: isNarrow ? 8 : 0,
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-mute)",
          }}
        >
          <span>{t.footer.copyright}</span>
          <span>45°27′51″N · 9°11′22″E</span>
        </div>
      </div>
    </footer>
  );
};

Object.assign(window, { Nav, Hero, Manifesto, Products, Contact, Footer, MillMark });
