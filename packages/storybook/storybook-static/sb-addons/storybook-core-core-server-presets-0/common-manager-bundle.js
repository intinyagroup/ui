try {
  (() => {
    var P = __STORYBOOK_API__,
      {
        ActiveTabs: h,
        Consumer: g,
        ManagerContext: f,
        Provider: O,
        RequestResponseError: T,
        addons: u,
        combineParameters: j,
        controlOrMetaKey: k,
        controlOrMetaSymbol: R,
        eventMatchesShortcut: U,
        eventToShortcut: v,
        experimental_MockUniversalStore: x,
        experimental_UniversalStore: M,
        experimental_requestResponse: C,
        experimental_useUniversalStore: w,
        isMacLike: B,
        isShortcutTaken: E,
        keyToSymbol: I,
        merge: K,
        mockChannel: N,
        optionOrAltSymbol: G,
        shortcutMatchesShortcut: L,
        shortcutToHumanString: Y,
        types: q,
        useAddonState: D,
        useArgTypes: F,
        useArgs: H,
        useChannel: V,
        useGlobalTypes: z,
        useGlobals: J,
        useParameter: Q,
        useSharedState: W,
        useStoryPrepared: X,
        useStorybookApi: Z,
        useStorybookState: $,
      } = __STORYBOOK_API__;
    var d = (() => {
        let e;
        return (
          typeof window < "u"
            ? (e = window)
            : typeof globalThis < "u"
              ? (e = globalThis)
              : typeof window < "u"
                ? (e = window)
                : typeof self < "u"
                  ? (e = self)
                  : (e = {}),
          e
        );
      })(),
      m = "tag-filters",
      p = "static-filter";
    u.register(m, (e) => {
      let a = Object.entries(d.TAGS_OPTIONS ?? {}).reduce((o, t) => {
        let [r, l] = t;
        return (l.excludeFromSidebar && (o[r] = !0), o);
      }, {});
      e.experimental_setFilter(p, (o) => {
        let t = o.tags ?? [];
        return (
          (t.includes("dev") || o.type === "docs") &&
          t.filter((r) => a[r]).length === 0
        );
      });
    });
  })();
} catch (e) {
  console.error(
    "[Storybook] One of your manager-entries failed: " + import.meta.url,
    e,
  );
}
