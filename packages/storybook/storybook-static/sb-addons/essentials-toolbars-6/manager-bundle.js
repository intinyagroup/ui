try {
  (() => {
    var a = __REACT__,
      {
        Children: se,
        Component: ie,
        Fragment: ue,
        Profiler: ce,
        PureComponent: pe,
        StrictMode: me,
        Suspense: de,
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: be,
        cloneElement: _e,
        createContext: Se,
        createElement: ye,
        createFactory: Te,
        createRef: fe,
        forwardRef: Oe,
        isValidElement: ve,
        lazy: Ce,
        memo: Ae,
        startTransition: Ie,
        unstable_act: ge,
        useCallback: O,
        useContext: Ee,
        useDebugValue: xe,
        useDeferredValue: ke,
        useEffect: E,
        useId: Pe,
        useImperativeHandle: Re,
        useInsertionEffect: he,
        useLayoutEffect: Le,
        useMemo: Be,
        useReducer: Me,
        useRef: h,
        useState: L,
        useSyncExternalStore: Ne,
        useTransition: De,
        version: Ue,
      } = __REACT__;
    var We = __STORYBOOK_API__,
      {
        ActiveTabs: Fe,
        Consumer: Ge,
        ManagerContext: Ke,
        Provider: Ye,
        RequestResponseError: $e,
        addons: x,
        combineParameters: qe,
        controlOrMetaKey: ze,
        controlOrMetaSymbol: Ze,
        eventMatchesShortcut: Je,
        eventToShortcut: Qe,
        experimental_MockUniversalStore: Xe,
        experimental_UniversalStore: et,
        experimental_requestResponse: tt,
        experimental_useUniversalStore: ot,
        isMacLike: rt,
        isShortcutTaken: nt,
        keyToSymbol: at,
        merge: lt,
        mockChannel: st,
        optionOrAltSymbol: it,
        shortcutMatchesShortcut: ut,
        shortcutToHumanString: ct,
        types: B,
        useAddonState: pt,
        useArgTypes: mt,
        useArgs: dt,
        useChannel: bt,
        useGlobalTypes: M,
        useGlobals: k,
        useParameter: _t,
        useSharedState: St,
        useStoryPrepared: yt,
        useStorybookApi: N,
        useStorybookState: Tt,
      } = __STORYBOOK_API__;
    var At = __STORYBOOK_COMPONENTS__,
      {
        A: It,
        ActionBar: gt,
        AddonPanel: Et,
        Badge: xt,
        Bar: kt,
        Blockquote: Pt,
        Button: Rt,
        ClipboardCode: ht,
        Code: Lt,
        DL: Bt,
        Div: Mt,
        DocumentWrapper: Nt,
        EmptyTabContent: Dt,
        ErrorFormatter: Ut,
        FlexBar: jt,
        Form: Vt,
        H1: wt,
        H2: Ht,
        H3: Wt,
        H4: Ft,
        H5: Gt,
        H6: Kt,
        HR: Yt,
        IconButton: D,
        IconButtonSkeleton: $t,
        Icons: P,
        Img: qt,
        LI: zt,
        Link: Zt,
        ListItem: Jt,
        Loader: Qt,
        Modal: Xt,
        OL: eo,
        P: to,
        Placeholder: oo,
        Pre: ro,
        ProgressSpinner: no,
        ResetWrapper: ao,
        ScrollArea: lo,
        Separator: U,
        Spaced: so,
        Span: io,
        StorybookIcon: uo,
        StorybookLogo: co,
        Symbols: po,
        SyntaxHighlighter: mo,
        TT: bo,
        TabBar: _o,
        TabButton: So,
        TabWrapper: yo,
        Table: To,
        Tabs: fo,
        TabsState: Oo,
        TooltipLinkList: j,
        TooltipMessage: vo,
        TooltipNote: Co,
        UL: Ao,
        WithTooltip: V,
        WithTooltipPure: Io,
        Zoom: go,
        codeCommon: Eo,
        components: xo,
        createCopyToClipboardFunction: ko,
        getStoryHref: Po,
        icons: Ro,
        interleaveSeparators: ho,
        nameSpaceClassNames: Lo,
        resetComponents: Bo,
        withReset: Mo,
      } = __STORYBOOK_COMPONENTS__;
    var F = { type: "item", value: "" },
      G = (o, t) => ({
        ...t,
        name: t.name || o,
        description: t.description || o,
        toolbar: {
          ...t.toolbar,
          items: t.toolbar.items.map((e) => {
            let r = typeof e == "string" ? { value: e, title: e } : e;
            return (
              r.type === "reset" &&
                t.toolbar.icon &&
                ((r.icon = t.toolbar.icon), (r.hideIcon = !0)),
              { ...F, ...r }
            );
          }),
        },
      }),
      K = ["reset"],
      Y = (o) => o.filter((t) => !K.includes(t.type)).map((t) => t.value),
      _ = "addon-toolbars",
      $ = async (o, t, e) => {
        (e &&
          e.next &&
          (await o.setAddonShortcut(_, {
            label: e.next.label,
            defaultShortcut: e.next.keys,
            actionName: `${t}:next`,
            action: e.next.action,
          })),
          e &&
            e.previous &&
            (await o.setAddonShortcut(_, {
              label: e.previous.label,
              defaultShortcut: e.previous.keys,
              actionName: `${t}:previous`,
              action: e.previous.action,
            })),
          e &&
            e.reset &&
            (await o.setAddonShortcut(_, {
              label: e.reset.label,
              defaultShortcut: e.reset.keys,
              actionName: `${t}:reset`,
              action: e.reset.action,
            })));
      },
      q = (o) => (t) => {
        let {
            id: e,
            toolbar: { items: r, shortcuts: n },
          } = t,
          c = N(),
          [S, i] = k(),
          l = h([]),
          u = S[e],
          v = O(() => {
            i({ [e]: "" });
          }, [i]),
          C = O(() => {
            let s = l.current,
              m = s.indexOf(u),
              d = m === s.length - 1 ? 0 : m + 1,
              p = l.current[d];
            i({ [e]: p });
          }, [l, u, i]),
          A = O(() => {
            let s = l.current,
              m = s.indexOf(u),
              d = m > -1 ? m : 0,
              p = d === 0 ? s.length - 1 : d - 1,
              b = l.current[p];
            i({ [e]: b });
          }, [l, u, i]);
        return (
          E(() => {
            n &&
              $(c, e, {
                next: { ...n.next, action: C },
                previous: { ...n.previous, action: A },
                reset: { ...n.reset, action: v },
              });
          }, [c, e, n, C, A, v]),
          E(() => {
            l.current = Y(r);
          }, []),
          a.createElement(o, { cycleValues: l.current, ...t })
        );
      },
      w = ({ currentValue: o, items: t }) =>
        o != null && t.find((e) => e.value === o && e.type !== "reset"),
      z = ({ currentValue: o, items: t }) => {
        let e = w({ currentValue: o, items: t });
        if (e) return e.icon;
      },
      Z = ({ currentValue: o, items: t }) => {
        let e = w({ currentValue: o, items: t });
        if (e) return e.title;
      },
      J = ({
        active: o,
        disabled: t,
        title: e,
        icon: r,
        description: n,
        onClick: c,
      }) =>
        a.createElement(
          D,
          { active: o, title: n, disabled: t, onClick: t ? () => {} : c },
          r &&
            a.createElement(P, { icon: r, __suppressDeprecationWarning: !0 }),
          e ? `\xA0${e}` : null,
        ),
      Q = ({
        right: o,
        title: t,
        value: e,
        icon: r,
        hideIcon: n,
        onClick: c,
        disabled: S,
        currentValue: i,
      }) => {
        let l =
            r &&
            a.createElement(P, {
              style: { opacity: 1 },
              icon: r,
              __suppressDeprecationWarning: !0,
            }),
          u = {
            id: e ?? "_reset",
            active: i === e,
            right: o,
            title: t,
            disabled: S,
            onClick: c,
          };
        return (r && !n && (u.icon = l), u);
      },
      X = q(
        ({
          id: o,
          name: t,
          description: e,
          toolbar: {
            icon: r,
            items: n,
            title: c,
            preventDynamicIcon: S,
            dynamicTitle: i,
          },
        }) => {
          let [l, u, v] = k(),
            [C, A] = L(!1),
            s = l[o],
            m = !!s,
            d = o in v,
            p = r,
            b = c;
          (S || (p = z({ currentValue: s, items: n }) || p),
            i && (b = Z({ currentValue: s, items: n }) || b),
            !b && !p && console.warn(`Toolbar '${t}' has no title or icon`));
          let H = O(
            (g) => {
              u({ [o]: g });
            },
            [o, u],
          );
          return a.createElement(
            V,
            {
              placement: "top",
              tooltip: ({ onHide: g }) => {
                let W = n
                  .filter(({ type: I }) => {
                    let R = !0;
                    return (I === "reset" && !s && (R = !1), R);
                  })
                  .map((I) =>
                    Q({
                      ...I,
                      currentValue: s,
                      disabled: d,
                      onClick: () => {
                        (H(I.value), g());
                      },
                    }),
                  );
                return a.createElement(j, { links: W });
              },
              closeOnOutsideClick: !0,
              onVisibleChange: A,
            },
            a.createElement(J, {
              active: C || m,
              disabled: d,
              description: e || "",
              icon: p,
              title: b || "",
            }),
          );
        },
      ),
      ee = () => {
        let o = M(),
          t = Object.keys(o).filter((e) => !!o[e].toolbar);
        return t.length
          ? a.createElement(
              a.Fragment,
              null,
              a.createElement(U, null),
              t.map((e) => {
                let r = G(e, o[e]);
                return a.createElement(X, { key: e, id: e, ...r });
              }),
            )
          : null;
      };
    x.register(_, () =>
      x.add(_, {
        title: _,
        type: B.TOOL,
        match: ({ tabId: o }) => !o,
        render: () => a.createElement(ee, null),
      }),
    );
  })();
} catch (e) {
  console.error(
    "[Storybook] One of your manager-entries failed: " + import.meta.url,
    e,
  );
}
