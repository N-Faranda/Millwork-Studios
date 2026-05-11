// All page sections live here. Editorial monochrome, OpenAI-inspired layout.

const { useT } = window;

// ─────────────────────────────────────────────────────────────────────────────
// NAV
const Nav = () => {
  const { t, lang, setLang } = useT();
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const navStyle = {
    position: "fixed",
    top: 0, left: 0, right: 0,
    zIndex: 50,
    padding: scrolled ? "14px 32px" : "22px 32px",
    transition: "all 0.35s ease",
    background: scrolled ? "rgba(243, 240, 233, 0.85)" : "transparent",
    backdropFilter: scrolled ? "blur(12px)" : "none",
    WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
    borderBottom: scrolled ? "1px solid var(--rule)" : "1px solid transparent",
  };

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
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            history.replaceState(null, "", window.location.pathname);
          }}
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

        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <NavLink href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>{lang === "it" ? "Home" : "Home"}</NavLink>
          <NavLink href="#products">{t.nav.products}</NavLink>
          <NavLink href="#studio">{t.nav.studio}</NavLink>
          <NavLink href="#contact">{t.nav.contact}</NavLink>
          <LangToggle lang={lang} setLang={setLang} />
        </div>
      </div>
    </nav>
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
  const wrapRef = React.useRef(null);

  return (
    <section
      id="top"
      ref={wrapRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        paddingTop: 110,
        paddingBottom: 80,
        overflow: "hidden",
      }}
    >
      <ParticleField />

      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 64,
          alignItems: "center",
          minHeight: "calc(100vh - 110px)",
        }}
      >
        {/* Text column */}
        <div>
          <div className="kicker" style={{ marginBottom: 36 }}>
            {t.hero.kicker}
          </div>
          <h1
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 400,
              fontSize: "clamp(44px, 6.2vw, 92px)",
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              color: "var(--ink)",
              maxWidth: "12.5ch",
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
              marginTop: 36,
              maxWidth: 460,
              fontSize: 17,
              lineHeight: 1.55,
              color: "var(--ink-soft)",
            }}
          >
            {t.hero.sub}
          </p>

          <div
            style={{
              marginTop: 56,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 28,
                height: 1,
                background: "var(--ink-mute)",
                opacity: 0.5,
              }}
            />
            <span
              className="kicker"
              style={{ color: "var(--ink-mute)", fontSize: 11 }}
            >
              {t.hero.hint}
            </span>
          </div>
        </div>

        {/* Windmill column */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Windmill size={560} />

          {/* Coordinate ticks / editorial annotation */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 24,
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--ink-mute)",
              letterSpacing: "0.1em",
            }}
          >
            FIG. 01 — MILL, IN SECTION
          </div>
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 24,
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--ink-mute)",
              letterSpacing: "0.1em",
              textAlign: "right",
            }}
          >
            INTERACTIVE — MOVE CURSOR
          </div>
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

// ─────────────────────────────────────────────────────────────────────────────
// MANIFESTO
const Manifesto = () => {
  const { t } = useT();
  return (
    <section
      id="studio"
      style={{ padding: "140px 0 120px", position: "relative" }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2.2fr",
            gap: 80,
            alignItems: "start",
          }}
        >
          <div style={{ position: "sticky", top: 120 }}>
            <div className="kicker">{t.manifesto.kicker}</div>
            <div style={{ marginTop: 32 }}>
              <AsciiMill />
            </div>
          </div>

          <div>
            <h2
              style={{
                fontFamily: "var(--sans)",
                fontWeight: 400,
                fontSize: "clamp(34px, 4vw, 56px)",
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                maxWidth: "20ch",
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
                marginTop: 56,
                maxWidth: 620,
                display: "flex",
                flexDirection: "column",
                gap: 22,
                fontSize: 17,
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
                marginTop: 88,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 36,
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
        padding: "44px 44px 36px",
        minHeight: 520,
        overflow: "hidden",
        transition: "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* faint blade pattern in background — grid panels like windmill sails */}
      <div
        style={{
          position: "absolute",
          right: -120,
          bottom: -120,
          width: 520,
          height: 520,
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
          minHeight: 440,
          justifyContent: "space-between",
          gap: 40,
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
              fontSize: "clamp(48px, 5.5vw, 88px)",
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
              fontSize: 18,
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
            justifyContent: "space-between",
            alignItems: "flex-end",
            paddingTop: 24,
            borderTop: "1px solid rgba(243, 240, 233, 0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 24,
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
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        background: "transparent",
        border: "1px dashed var(--rule)",
        padding: "44px 44px 36px",
        minHeight: 520,
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
            fontSize: 56,
            lineHeight: 1,
            color: "var(--ink-faint)",
            marginBottom: 16,
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
  return (
    <section id="products" style={{ padding: "140px 0 120px", borderTop: "1px solid var(--rule)" }}>
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 64,
            gap: 48,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div className="kicker">{t.products.kicker}</div>
            <h2
              style={{
                fontFamily: "var(--sans)",
                fontWeight: 400,
                fontSize: "clamp(34px, 4vw, 56px)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                marginTop: 28,
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
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
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
        padding: "140px 0 140px",
        borderTop: "1px solid var(--rule)",
        background: "var(--paper-2)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 80,
            alignItems: "start",
          }}
        >
          <div>
            <div className="kicker">{t.contact.kicker}</div>
            <h2
              style={{
                fontFamily: "var(--sans)",
                fontWeight: 400,
                fontSize: "clamp(40px, 5vw, 72px)",
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
                marginTop: 28,
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

          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            {/* Email card */}
            <a
              href={`mailto:${t.contact.email}`}
              onContextMenu={onCopy}
              onClick={onCopy}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "28px 32px",
                background: "var(--paper)",
                border: "1px solid var(--rule)",
                transition: "all 0.3s ease",
                gap: 24,
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
              <div>
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
                    fontSize: "clamp(20px, 2.4vw, 30px)",
                    letterSpacing: "-0.015em",
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
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
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
  return (
    <footer
      style={{
        padding: "72px 0 40px",
        borderTop: "1px solid var(--rule)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
            gap: 48,
            alignItems: "start",
          }}
        >
          <div>
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
            marginTop: 64,
            paddingTop: 24,
            borderTop: "1px solid var(--rule)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
