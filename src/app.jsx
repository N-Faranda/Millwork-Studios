// App composition + language state.

const { Nav, Hero, Bench, Manifesto, Products, Contact, Footer, I18N, LangCtx } = window;

const App = () => {
  // English unless the visitor has already picked a language
  const [lang, setLangState] = React.useState(() => {
    try {
      const saved = localStorage.getItem("mw_lang");
      if (saved === "en" || saved === "it") return saved;
    } catch (e) {}
    return "en";
  });
  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem("mw_lang", l); } catch (e) {}
    document.documentElement.lang = l;
  };
  React.useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const ctx = React.useMemo(() => ({ lang, setLang, t: I18N[lang] }), [lang]);

  return (
    <LangCtx.Provider value={ctx}>
      <Nav />
      <Hero />
      <Bench />
      <Manifesto />
      <Products />
      <Contact />
      <Footer />
    </LangCtx.Provider>
  );
};

const mount = () => {
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
  // hide splash
  setTimeout(() => {
    const s = document.getElementById("splash");
    if (s) s.classList.add("hidden");
  }, 80);
  scrollToHash();
};

// Links from other pages (e.g. plough.html → index.html#contact) arrive before
// React has rendered the target, so the browser can't jump there on its own.
const scrollToHash = () => {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;
  const jump = () => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
    return !!el;
  };
  let tries = 0;
  const wait = () => {
    if (jump()) {
      // fonts landing late can shift the layout — settle once more
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(jump);
    } else if (++tries < 60) {
      setTimeout(wait, 50);
    }
  };
  wait();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
