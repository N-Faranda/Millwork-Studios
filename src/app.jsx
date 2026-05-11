// App composition + language state.

const { Nav, Hero, Manifesto, Products, Contact, Footer, I18N, LangCtx } = window;

const App = () => {
  // detect saved or browser lang
  const [lang, setLangState] = React.useState(() => {
    try {
      const saved = localStorage.getItem("mw_lang");
      if (saved === "en" || saved === "it") return saved;
    } catch (e) {}
    const nav = (navigator.language || "en").toLowerCase();
    return nav.startsWith("it") ? "it" : "en";
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
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
