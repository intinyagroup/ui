try {
  (() => {
    var A = __STORYBOOK_API__,
      {
        ActiveTabs: S,
        Consumer: P,
        ManagerContext: h,
        Provider: R,
        RequestResponseError: b,
        addons: n,
        combineParameters: k,
        controlOrMetaKey: E,
        controlOrMetaSymbol: O,
        eventMatchesShortcut: T,
        eventToShortcut: g,
        experimental_MockUniversalStore: U,
        experimental_UniversalStore: j,
        experimental_requestResponse: v,
        experimental_useUniversalStore: f,
        isMacLike: I,
        isShortcutTaken: x,
        keyToSymbol: C,
        merge: M,
        mockChannel: D,
        optionOrAltSymbol: N,
        shortcutMatchesShortcut: B,
        shortcutToHumanString: K,
        types: V,
        useAddonState: q,
        useArgTypes: G,
        useArgs: L,
        useChannel: Y,
        useGlobalTypes: $,
        useGlobals: H,
        useParameter: Q,
        useSharedState: w,
        useStoryPrepared: z,
        useStorybookApi: F,
        useStorybookState: J,
      } = __STORYBOOK_API__;
    var e = "storybook/links",
      u = {
        NAVIGATE: `${e}/navigate`,
        REQUEST: `${e}/request`,
        RECEIVE: `${e}/receive`,
      };
    n.register(e, (o) => {
      o.on(u.REQUEST, ({ kind: i, name: a }) => {
        let m = o.storyId(i, a);
        o.emit(u.RECEIVE, m);
      });
    });
  })();
} catch (e) {
  console.error(
    "[Storybook] One of your manager-entries failed: " + import.meta.url,
    e,
  );
}
