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
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
