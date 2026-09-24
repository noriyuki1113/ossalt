import "@testing-library/jest-dom";

// jsdom doesn't implement scrollIntoView; Index.tsx calls it after a
// search-submit setTimeout that can still be pending when a test's DOM is
// torn down, throwing "scrollIntoView is not a function" as an unhandled
// rejection that fails the whole vitest run even though every test passed.
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || (() => {});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
