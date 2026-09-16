// Viewport helpers. The sections style themselves inline, and inline styles
// can't carry media queries — so anything that has to change shape on a phone
// asks these hooks instead.

const useMediaQuery = (query) => {
  const [matches, setMatches] = React.useState(() => {
    if (!window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  React.useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(query);
    const on = (e) => setMatches(e.matches);
    setMatches(mq.matches);
    if (mq.addEventListener) {
      mq.addEventListener("change", on);
      return () => mq.removeEventListener("change", on);
    }
    // Safari < 14
    mq.addListener(on);
    return () => mq.removeListener(on);
  }, [query]);

  return matches;
};

// Phone and small tablet: every multi-column layout collapses to one column.
const useIsMobile = () => useMediaQuery("(max-width: 860px)");
// Narrow phone: even two-up card pairs go single file.
const useIsNarrow = () => useMediaQuery("(max-width: 560px)");
// Touch input — no hover, so "move your cursor" copy is replaced by "drag".
const useIsTouch = () => useMediaQuery("(hover: none)");

Object.assign(window, { useMediaQuery, useIsMobile, useIsNarrow, useIsTouch });
