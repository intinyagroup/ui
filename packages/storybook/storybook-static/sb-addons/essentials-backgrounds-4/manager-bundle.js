try {
  (() => {
    var re = Object.create;
    var Y = Object.defineProperty;
    var ie = Object.getOwnPropertyDescriptor;
    var ae = Object.getOwnPropertyNames;
    var ce = Object.getPrototypeOf,
      se = Object.prototype.hasOwnProperty;
    var E = ((e) =>
      typeof require < "u"
        ? require
        : typeof Proxy < "u"
          ? new Proxy(e, {
              get: (o, c) => (typeof require < "u" ? require : o)[c],
            })
          : e)(function (e) {
      if (typeof require < "u") return require.apply(this, arguments);
      throw Error('Dynamic require of "' + e + '" is not supported');
    });
    var M = (e, o) => () => (e && (o = e((e = 0))), o);
    var le = (e, o) => () => (
      o || e((o = { exports: {} }).exports, o),
      o.exports
    );
    var ue = (e, o, c, r) => {
      if ((o && typeof o == "object") || typeof o == "function")
        for (let i of ae(o))
          !se.call(e, i) &&
            i !== c &&
            Y(e, i, {
              get: () => o[i],
              enumerable: !(r = ie(o, i)) || r.enumerable,
            });
      return e;
    };
    var Ie = (e, o, c) => (
      (c = e != null ? re(ce(e)) : {}),
      ue(
        o || !e || !e.__esModule
          ? Y(c, "default", { value: e, enumerable: !0 })
          : c,
        e,
      )
    );
    var p = M(() => {});
    var h = M(() => {});
    var f = M(() => {});
    var X = le((Q, K) => {
      p();
      h();
      f();
      (function (e) {
        if (typeof Q == "object" && typeof K < "u") K.exports = e();
        else if (typeof define == "function" && define.amd) define([], e);
        else {
          var o;
          (typeof window < "u" || typeof window < "u"
            ? (o = window)
            : typeof self < "u"
              ? (o = self)
              : (o = this),
            (o.memoizerific = e()));
        }
      })(function () {
        var e, o, c;
        return (function r(i, d, s) {
          function t(a, I) {
            if (!d[a]) {
              if (!i[a]) {
                var l = typeof E == "function" && E;
                if (!I && l) return l(a, !0);
                if (n) return n(a, !0);
                var y = new Error("Cannot find module '" + a + "'");
                throw ((y.code = "MODULE_NOT_FOUND"), y);
              }
              var m = (d[a] = { exports: {} });
              i[a][0].call(
                m.exports,
                function (b) {
                  var S = i[a][1][b];
                  return t(S || b);
                },
                m,
                m.exports,
                r,
                i,
                d,
                s,
              );
            }
            return d[a].exports;
          }
          for (var n = typeof E == "function" && E, u = 0; u < s.length; u++)
            t(s[u]);
          return t;
        })(
          {
            1: [
              function (r, i, d) {
                i.exports = function (s) {
                  if (typeof Map != "function" || s) {
                    var t = r("./similar");
                    return new t();
                  } else return new Map();
                };
              },
              { "./similar": 2 },
            ],
            2: [
              function (r, i, d) {
                function s() {
                  return (
                    (this.list = []),
                    (this.lastItem = void 0),
                    (this.size = 0),
                    this
                  );
                }
                ((s.prototype.get = function (t) {
                  var n;
                  if (this.lastItem && this.isEqual(this.lastItem.key, t))
                    return this.lastItem.val;
                  if (((n = this.indexOf(t)), n >= 0))
                    return ((this.lastItem = this.list[n]), this.list[n].val);
                }),
                  (s.prototype.set = function (t, n) {
                    var u;
                    return this.lastItem && this.isEqual(this.lastItem.key, t)
                      ? ((this.lastItem.val = n), this)
                      : ((u = this.indexOf(t)),
                        u >= 0
                          ? ((this.lastItem = this.list[u]),
                            (this.list[u].val = n),
                            this)
                          : ((this.lastItem = { key: t, val: n }),
                            this.list.push(this.lastItem),
                            this.size++,
                            this));
                  }),
                  (s.prototype.delete = function (t) {
                    var n;
                    if (
                      (this.lastItem &&
                        this.isEqual(this.lastItem.key, t) &&
                        (this.lastItem = void 0),
                      (n = this.indexOf(t)),
                      n >= 0)
                    )
                      return (this.size--, this.list.splice(n, 1)[0]);
                  }),
                  (s.prototype.has = function (t) {
                    var n;
                    return this.lastItem && this.isEqual(this.lastItem.key, t)
                      ? !0
                      : ((n = this.indexOf(t)),
                        n >= 0 ? ((this.lastItem = this.list[n]), !0) : !1);
                  }),
                  (s.prototype.forEach = function (t, n) {
                    var u;
                    for (u = 0; u < this.size; u++)
                      t.call(
                        n || this,
                        this.list[u].val,
                        this.list[u].key,
                        this,
                      );
                  }),
                  (s.prototype.indexOf = function (t) {
                    var n;
                    for (n = 0; n < this.size; n++)
                      if (this.isEqual(this.list[n].key, t)) return n;
                    return -1;
                  }),
                  (s.prototype.isEqual = function (t, n) {
                    return t === n || (t !== t && n !== n);
                  }),
                  (i.exports = s));
              },
              {},
            ],
            3: [
              function (r, i, d) {
                var s = r("map-or-similar");
                i.exports = function (a) {
                  var I = new s(!1),
                    l = [];
                  return function (y) {
                    var m = function () {
                      var b = I,
                        S,
                        P,
                        v = arguments.length - 1,
                        w = Array(v + 1),
                        O = !0,
                        T;
                      if ((m.numArgs || m.numArgs === 0) && m.numArgs !== v + 1)
                        throw new Error(
                          "Memoizerific functions should always be called with the same number of arguments",
                        );
                      for (T = 0; T < v; T++) {
                        if (
                          ((w[T] = { cacheItem: b, arg: arguments[T] }),
                          b.has(arguments[T]))
                        ) {
                          b = b.get(arguments[T]);
                          continue;
                        }
                        ((O = !1),
                          (S = new s(!1)),
                          b.set(arguments[T], S),
                          (b = S));
                      }
                      return (
                        O &&
                          (b.has(arguments[v])
                            ? (P = b.get(arguments[v]))
                            : (O = !1)),
                        O ||
                          ((P = y.apply(null, arguments)),
                          b.set(arguments[v], P)),
                        a > 0 &&
                          ((w[v] = { cacheItem: b, arg: arguments[v] }),
                          O ? t(l, w) : l.push(w),
                          l.length > a && n(l.shift())),
                        (m.wasMemoized = O),
                        (m.numArgs = v + 1),
                        P
                      );
                    };
                    return (
                      (m.limit = a),
                      (m.wasMemoized = !1),
                      (m.cache = I),
                      (m.lru = l),
                      m
                    );
                  };
                };
                function t(a, I) {
                  var l = a.length,
                    y = I.length,
                    m,
                    b,
                    S;
                  for (b = 0; b < l; b++) {
                    for (m = !0, S = 0; S < y; S++)
                      if (!u(a[b][S].arg, I[S].arg)) {
                        m = !1;
                        break;
                      }
                    if (m) break;
                  }
                  a.push(a.splice(b, 1)[0]);
                }
                function n(a) {
                  var I = a.length,
                    l = a[I - 1],
                    y,
                    m;
                  for (
                    l.cacheItem.delete(l.arg), m = I - 2;
                    m >= 0 &&
                    ((l = a[m]), (y = l.cacheItem.get(l.arg)), !y || !y.size);
                    m--
                  )
                    l.cacheItem.delete(l.arg);
                }
                function u(a, I) {
                  return a === I || (a !== a && I !== I);
                }
              },
              { "map-or-similar": 1 },
            ],
          },
          {},
          [3],
        )(3);
      });
    });
    p();
    h();
    f();
    p();
    h();
    f();
    p();
    h();
    f();
    p();
    h();
    f();
    var g = __REACT__,
      {
        Children: Ee,
        Component: Re,
        Fragment: D,
        Profiler: Be,
        PureComponent: Pe,
        StrictMode: we,
        Suspense: xe,
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: Le,
        cloneElement: Me,
        createContext: De,
        createElement: Ue,
        createFactory: Ge,
        createRef: Ne,
        forwardRef: Fe,
        isValidElement: He,
        lazy: je,
        memo: R,
        startTransition: qe,
        unstable_act: ze,
        useCallback: U,
        useContext: Ke,
        useDebugValue: Ve,
        useDeferredValue: Ye,
        useEffect: We,
        useId: $e,
        useImperativeHandle: Ze,
        useInsertionEffect: Je,
        useLayoutEffect: Qe,
        useMemo: W,
        useReducer: Xe,
        useRef: eo,
        useState: G,
        useSyncExternalStore: oo,
        useTransition: no,
        version: to,
      } = __REACT__;
    p();
    h();
    f();
    var so = __STORYBOOK_API__,
      {
        ActiveTabs: lo,
        Consumer: uo,
        ManagerContext: Io,
        Provider: mo,
        RequestResponseError: po,
        addons: N,
        combineParameters: ho,
        controlOrMetaKey: fo,
        controlOrMetaSymbol: go,
        eventMatchesShortcut: bo,
        eventToShortcut: yo,
        experimental_MockUniversalStore: So,
        experimental_UniversalStore: Co,
        experimental_requestResponse: _o,
        experimental_useUniversalStore: ko,
        isMacLike: Ao,
        isShortcutTaken: vo,
        keyToSymbol: To,
        merge: Oo,
        mockChannel: Eo,
        optionOrAltSymbol: Ro,
        shortcutMatchesShortcut: Bo,
        shortcutToHumanString: Po,
        types: $,
        useAddonState: wo,
        useArgTypes: xo,
        useArgs: Lo,
        useChannel: Mo,
        useGlobalTypes: Do,
        useGlobals: x,
        useParameter: L,
        useSharedState: Uo,
        useStoryPrepared: Go,
        useStorybookApi: No,
        useStorybookState: Fo,
      } = __STORYBOOK_API__;
    p();
    h();
    f();
    var Ko = __STORYBOOK_COMPONENTS__,
      {
        A: Vo,
        ActionBar: Yo,
        AddonPanel: Wo,
        Badge: $o,
        Bar: Zo,
        Blockquote: Jo,
        Button: Qo,
        ClipboardCode: Xo,
        Code: en,
        DL: on,
        Div: nn,
        DocumentWrapper: tn,
        EmptyTabContent: rn,
        ErrorFormatter: an,
        FlexBar: cn,
        Form: sn,
        H1: ln,
        H2: un,
        H3: In,
        H4: dn,
        H5: mn,
        H6: pn,
        HR: hn,
        IconButton: B,
        IconButtonSkeleton: fn,
        Icons: gn,
        Img: bn,
        LI: yn,
        Link: Sn,
        ListItem: Cn,
        Loader: _n,
        Modal: kn,
        OL: An,
        P: vn,
        Placeholder: Tn,
        Pre: On,
        ProgressSpinner: En,
        ResetWrapper: Rn,
        ScrollArea: Bn,
        Separator: Pn,
        Spaced: wn,
        Span: xn,
        StorybookIcon: Ln,
        StorybookLogo: Mn,
        Symbols: Dn,
        SyntaxHighlighter: Un,
        TT: Gn,
        TabBar: Nn,
        TabButton: Fn,
        TabWrapper: Hn,
        Table: jn,
        Tabs: qn,
        TabsState: zn,
        TooltipLinkList: F,
        TooltipMessage: Kn,
        TooltipNote: Vn,
        UL: Yn,
        WithTooltip: H,
        WithTooltipPure: Wn,
        Zoom: $n,
        codeCommon: Zn,
        components: Jn,
        createCopyToClipboardFunction: Qn,
        getStoryHref: Xn,
        icons: et,
        interleaveSeparators: ot,
        nameSpaceClassNames: nt,
        resetComponents: tt,
        withReset: rt,
      } = __STORYBOOK_COMPONENTS__;
    p();
    h();
    f();
    var lt = __STORYBOOK_ICONS__,
      {
        AccessibilityAltIcon: ut,
        AccessibilityIcon: It,
        AccessibilityIgnoredIcon: dt,
        AddIcon: mt,
        AdminIcon: pt,
        AlertAltIcon: ht,
        AlertIcon: ft,
        AlignLeftIcon: gt,
        AlignRightIcon: bt,
        AppleIcon: yt,
        ArrowBottomLeftIcon: St,
        ArrowBottomRightIcon: Ct,
        ArrowDownIcon: _t,
        ArrowLeftIcon: kt,
        ArrowRightIcon: At,
        ArrowSolidDownIcon: vt,
        ArrowSolidLeftIcon: Tt,
        ArrowSolidRightIcon: Ot,
        ArrowSolidUpIcon: Et,
        ArrowTopLeftIcon: Rt,
        ArrowTopRightIcon: Bt,
        ArrowUpIcon: Pt,
        AzureDevOpsIcon: wt,
        BackIcon: xt,
        BasketIcon: Lt,
        BatchAcceptIcon: Mt,
        BatchDenyIcon: Dt,
        BeakerIcon: Ut,
        BellIcon: Gt,
        BitbucketIcon: Nt,
        BoldIcon: Ft,
        BookIcon: Ht,
        BookmarkHollowIcon: jt,
        BookmarkIcon: qt,
        BottomBarIcon: zt,
        BottomBarToggleIcon: Kt,
        BoxIcon: Vt,
        BranchIcon: Yt,
        BrowserIcon: Wt,
        ButtonIcon: $t,
        CPUIcon: Zt,
        CalendarIcon: Jt,
        CameraIcon: Qt,
        CameraStabilizeIcon: Xt,
        CategoryIcon: er,
        CertificateIcon: or,
        ChangedIcon: nr,
        ChatIcon: tr,
        CheckIcon: rr,
        ChevronDownIcon: ir,
        ChevronLeftIcon: ar,
        ChevronRightIcon: cr,
        ChevronSmallDownIcon: sr,
        ChevronSmallLeftIcon: lr,
        ChevronSmallRightIcon: ur,
        ChevronSmallUpIcon: Ir,
        ChevronUpIcon: dr,
        ChromaticIcon: mr,
        ChromeIcon: pr,
        CircleHollowIcon: hr,
        CircleIcon: Z,
        ClearIcon: fr,
        CloseAltIcon: gr,
        CloseIcon: br,
        CloudHollowIcon: yr,
        CloudIcon: Sr,
        CogIcon: Cr,
        CollapseIcon: _r,
        CommandIcon: kr,
        CommentAddIcon: Ar,
        CommentIcon: vr,
        CommentsIcon: Tr,
        CommitIcon: Or,
        CompassIcon: Er,
        ComponentDrivenIcon: Rr,
        ComponentIcon: Br,
        ContrastIcon: Pr,
        ContrastIgnoredIcon: wr,
        ControlsIcon: xr,
        CopyIcon: Lr,
        CreditIcon: Mr,
        CrossIcon: Dr,
        DashboardIcon: Ur,
        DatabaseIcon: Gr,
        DeleteIcon: Nr,
        DiamondIcon: Fr,
        DirectionIcon: Hr,
        DiscordIcon: jr,
        DocChartIcon: qr,
        DocListIcon: zr,
        DocumentIcon: Kr,
        DownloadIcon: Vr,
        DragIcon: Yr,
        EditIcon: Wr,
        EllipsisIcon: $r,
        EmailIcon: Zr,
        ExpandAltIcon: Jr,
        ExpandIcon: Qr,
        EyeCloseIcon: Xr,
        EyeIcon: ei,
        FaceHappyIcon: oi,
        FaceNeutralIcon: ni,
        FaceSadIcon: ti,
        FacebookIcon: ri,
        FailedIcon: ii,
        FastForwardIcon: ai,
        FigmaIcon: ci,
        FilterIcon: si,
        FlagIcon: li,
        FolderIcon: ui,
        FormIcon: Ii,
        GDriveIcon: di,
        GithubIcon: mi,
        GitlabIcon: pi,
        GlobeIcon: hi,
        GoogleIcon: fi,
        GraphBarIcon: gi,
        GraphLineIcon: bi,
        GraphqlIcon: yi,
        GridAltIcon: Si,
        GridIcon: j,
        GrowIcon: Ci,
        HeartHollowIcon: _i,
        HeartIcon: ki,
        HomeIcon: Ai,
        HourglassIcon: vi,
        InfoIcon: Ti,
        ItalicIcon: Oi,
        JumpToIcon: Ei,
        KeyIcon: Ri,
        LightningIcon: Bi,
        LightningOffIcon: Pi,
        LinkBrokenIcon: wi,
        LinkIcon: xi,
        LinkedinIcon: Li,
        LinuxIcon: Mi,
        ListOrderedIcon: Di,
        ListUnorderedIcon: Ui,
        LocationIcon: Gi,
        LockIcon: Ni,
        MarkdownIcon: Fi,
        MarkupIcon: Hi,
        MediumIcon: ji,
        MemoryIcon: qi,
        MenuIcon: zi,
        MergeIcon: Ki,
        MirrorIcon: Vi,
        MobileIcon: Yi,
        MoonIcon: Wi,
        NutIcon: $i,
        OutboxIcon: Zi,
        OutlineIcon: Ji,
        PaintBrushIcon: Qi,
        PaperClipIcon: Xi,
        ParagraphIcon: ea,
        PassedIcon: oa,
        PhoneIcon: na,
        PhotoDragIcon: ta,
        PhotoIcon: q,
        PhotoStabilizeIcon: ra,
        PinAltIcon: ia,
        PinIcon: aa,
        PlayAllHollowIcon: ca,
        PlayBackIcon: sa,
        PlayHollowIcon: la,
        PlayIcon: ua,
        PlayNextIcon: Ia,
        PlusIcon: da,
        PointerDefaultIcon: ma,
        PointerHandIcon: pa,
        PowerIcon: ha,
        PrintIcon: fa,
        ProceedIcon: ga,
        ProfileIcon: ba,
        PullRequestIcon: ya,
        QuestionIcon: Sa,
        RSSIcon: Ca,
        RedirectIcon: _a,
        ReduxIcon: ka,
        RefreshIcon: J,
        ReplyIcon: Aa,
        RepoIcon: va,
        RequestChangeIcon: Ta,
        RewindIcon: Oa,
        RulerIcon: Ea,
        SaveIcon: Ra,
        SearchIcon: Ba,
        ShareAltIcon: Pa,
        ShareIcon: wa,
        ShieldIcon: xa,
        SideBySideIcon: La,
        SidebarAltIcon: Ma,
        SidebarAltToggleIcon: Da,
        SidebarIcon: Ua,
        SidebarToggleIcon: Ga,
        SpeakerIcon: Na,
        StackedIcon: Fa,
        StarHollowIcon: Ha,
        StarIcon: ja,
        StatusFailIcon: qa,
        StatusIcon: za,
        StatusPassIcon: Ka,
        StatusWarnIcon: Va,
        StickerIcon: Ya,
        StopAltHollowIcon: Wa,
        StopAltIcon: $a,
        StopIcon: Za,
        StorybookIcon: Ja,
        StructureIcon: Qa,
        SubtractIcon: Xa,
        SunIcon: ec,
        SupportIcon: oc,
        SweepIcon: nc,
        SwitchAltIcon: tc,
        SyncIcon: rc,
        TabletIcon: ic,
        ThumbsUpIcon: ac,
        TimeIcon: cc,
        TimerIcon: sc,
        TransferIcon: lc,
        TrashIcon: uc,
        TwitterIcon: Ic,
        TypeIcon: dc,
        UbuntuIcon: mc,
        UndoIcon: pc,
        UnfoldIcon: hc,
        UnlockIcon: fc,
        UnpinIcon: gc,
        UploadIcon: bc,
        UserAddIcon: yc,
        UserAltIcon: Sc,
        UserIcon: Cc,
        UsersIcon: _c,
        VSCodeIcon: kc,
        VerifiedIcon: Ac,
        VideoIcon: vc,
        WandIcon: Tc,
        WatchIcon: Oc,
        WindowsIcon: Ec,
        WrenchIcon: Rc,
        XIcon: Bc,
        YoutubeIcon: Pc,
        ZoomIcon: wc,
        ZoomOutIcon: xc,
        ZoomResetIcon: Lc,
        iconList: Mc,
      } = __STORYBOOK_ICONS__;
    p();
    h();
    f();
    var Fc = __STORYBOOK_CLIENT_LOGGER__,
      {
        deprecate: Hc,
        logger: z,
        once: jc,
        pretty: qc,
      } = __STORYBOOK_CLIENT_LOGGER__;
    var V = Ie(X());
    p();
    h();
    f();
    var Qc = __STORYBOOK_THEMING__,
      {
        CacheProvider: Xc,
        ClassNames: es,
        Global: os,
        ThemeProvider: ns,
        background: ts,
        color: rs,
        convert: is,
        create: as,
        createCache: cs,
        createGlobal: ss,
        createReset: ls,
        css: us,
        darken: Is,
        ensure: ds,
        ignoreSsrWarning: ms,
        isPropValid: ps,
        jsx: hs,
        keyframes: fs,
        lighten: gs,
        styled: ee,
        themes: bs,
        typography: ys,
        useTheme: Ss,
        withTheme: Cs,
      } = __STORYBOOK_THEMING__;
    p();
    h();
    f();
    function oe(e) {
      for (var o = [], c = 1; c < arguments.length; c++)
        o[c - 1] = arguments[c];
      var r = Array.from(typeof e == "string" ? [e] : e);
      r[r.length - 1] = r[r.length - 1].replace(/\r?\n([\t ]*)$/, "");
      var i = r.reduce(function (t, n) {
        var u = n.match(/\n([\t ]+|(?!\s).)/g);
        return u
          ? t.concat(
              u.map(function (a) {
                var I, l;
                return (l =
                  (I = a.match(/[\t ]/g)) === null || I === void 0
                    ? void 0
                    : I.length) !== null && l !== void 0
                  ? l
                  : 0;
              }),
            )
          : t;
      }, []);
      if (i.length) {
        var d = new RegExp(
          `
[	 ]{`.concat(Math.min.apply(Math, i), "}"),
          "g",
        );
        r = r.map(function (t) {
          return t.replace(
            d,
            `
`,
          );
        });
      }
      r[0] = r[0].replace(/^\r?\n/, "");
      var s = r[0];
      return (
        o.forEach(function (t, n) {
          var u = s.match(/(?:^|\n)( *)$/),
            a = u ? u[1] : "",
            I = t;
          (typeof t == "string" &&
            t.includes(`
`) &&
            (I = String(t)
              .split(
                `
`,
              )
              .map(function (l, y) {
                return y === 0 ? l : "".concat(a).concat(l);
              }).join(`
`)),
            (s += I + r[n + 1]));
        }),
        s
      );
    }
    var ne = "storybook/background",
      C = "backgrounds",
      de = {
        light: { name: "light", value: "#F8F8F8" },
        dark: { name: "dark", value: "#333" },
      },
      me = R(function () {
        let e = L(C),
          [o, c, r] = x(),
          [i, d] = G(!1),
          { options: s = de, disable: t = !0 } = e || {};
        if (t) return null;
        let n = o[C] || {},
          u = n.value,
          a = n.grid || !1,
          I = s[u],
          l = !!r?.[C],
          y = Object.keys(s).length;
        return g.createElement(pe, {
          length: y,
          backgroundMap: s,
          item: I,
          updateGlobals: c,
          backgroundName: u,
          setIsTooltipVisible: d,
          isLocked: l,
          isGridActive: a,
          isTooltipVisible: i,
        });
      }),
      pe = R(function (e) {
        let {
            item: o,
            length: c,
            updateGlobals: r,
            setIsTooltipVisible: i,
            backgroundMap: d,
            backgroundName: s,
            isLocked: t,
            isGridActive: n,
            isTooltipVisible: u,
          } = e,
          a = U(
            (I) => {
              r({ [C]: I });
            },
            [r],
          );
        return g.createElement(
          D,
          null,
          g.createElement(
            B,
            {
              key: "grid",
              active: n,
              disabled: t,
              title: "Apply a grid to the preview",
              onClick: () => a({ value: s, grid: !n }),
            },
            g.createElement(j, null),
          ),
          c > 0
            ? g.createElement(
                H,
                {
                  key: "background",
                  placement: "top",
                  closeOnOutsideClick: !0,
                  tooltip: ({ onHide: I }) =>
                    g.createElement(F, {
                      links: [
                        ...(o
                          ? [
                              {
                                id: "reset",
                                title: "Reset background",
                                icon: g.createElement(J, null),
                                onClick: () => {
                                  (a({ value: void 0, grid: n }), I());
                                },
                              },
                            ]
                          : []),
                        ...Object.entries(d).map(([l, y]) => ({
                          id: l,
                          title: y.name,
                          icon: g.createElement(Z, {
                            color: y?.value || "grey",
                          }),
                          active: l === s,
                          onClick: () => {
                            (a({ value: l, grid: n }), I());
                          },
                        })),
                      ].flat(),
                    }),
                  onVisibleChange: i,
                },
                g.createElement(
                  B,
                  {
                    disabled: t,
                    key: "background",
                    title: "Change the background of the preview",
                    active: !!o || u,
                  },
                  g.createElement(q, null),
                ),
              )
            : null,
        );
      }),
      he = ee.span(
        ({ background: e }) => ({
          borderRadius: "1rem",
          display: "block",
          height: "1rem",
          width: "1rem",
          background: e,
        }),
        ({ theme: e }) => ({
          boxShadow: `${e.appBorderColor} 0 0 0 1px inset`,
        }),
      ),
      fe = (e, o = [], c) => {
        if (e === "transparent") return "transparent";
        if (o.find((i) => i.value === e) || e) return e;
        let r = o.find((i) => i.name === c);
        if (r) return r.value;
        if (c) {
          let i = o.map((d) => d.name).join(", ");
          z.warn(oe`
        Backgrounds Addon: could not find the default color "${c}".
        These are the available colors for your story based on your configuration:
        ${i}.
      `);
        }
        return "transparent";
      },
      te = (0, V.default)(1e3)((e, o, c, r, i, d) => ({
        id: e || o,
        title: o,
        onClick: () => {
          i({ selected: c, name: o });
        },
        value: c,
        right: r ? g.createElement(he, { background: c }) : void 0,
        active: d,
      })),
      ge = (0, V.default)(10)((e, o, c) => {
        let r = e.map(({ name: i, value: d }) =>
          te(null, i, d, !0, c, d === o),
        );
        return o !== "transparent"
          ? [te("reset", "Clear background", "transparent", null, c, !1), ...r]
          : r;
      }),
      be = { default: null, disable: !0, values: [] },
      ye = R(function () {
        let e = L(C, be),
          [o, c] = G(!1),
          [r, i] = x(),
          d = r[C]?.value,
          s = W(() => fe(d, e.values, e.default), [e, d]);
        Array.isArray(e) &&
          z.warn(
            "Addon Backgrounds api has changed in Storybook 6.0. Please refer to the migration guide: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md",
          );
        let t = U(
          (n) => {
            i({ [C]: { ...r[C], value: n } });
          },
          [e, r, i],
        );
        return e.disable
          ? null
          : g.createElement(
              H,
              {
                placement: "top",
                closeOnOutsideClick: !0,
                tooltip: ({ onHide: n }) =>
                  g.createElement(F, {
                    links: ge(e.values, s, ({ selected: u }) => {
                      (s !== u && t(u), n());
                    }),
                  }),
                onVisibleChange: c,
              },
              g.createElement(
                B,
                {
                  key: "background",
                  title: "Change the background of the preview",
                  active: s !== "transparent" || o,
                },
                g.createElement(q, null),
              ),
            );
      }),
      Se = R(function () {
        let [e, o] = x(),
          { grid: c } = L(C, { grid: { disable: !1 } });
        if (c?.disable) return null;
        let r = e[C]?.grid || !1;
        return g.createElement(
          B,
          {
            key: "background",
            active: r,
            title: "Apply a grid to the preview",
            onClick: () => o({ [C]: { ...e[C], grid: !r } }),
          },
          g.createElement(j, null),
        );
      });
    N.register(ne, () => {
      N.add(ne, {
        title: "Backgrounds",
        type: $.TOOL,
        match: ({ viewMode: e, tabId: o }) =>
          !!(e && e.match(/^(story|docs)$/)) && !o,
        render: () =>
          FEATURES?.backgroundsStoryGlobals
            ? g.createElement(me, null)
            : g.createElement(
                D,
                null,
                g.createElement(ye, null),
                g.createElement(Se, null),
              ),
      });
    });
  })();
} catch (e) {
  console.error(
    "[Storybook] One of your manager-entries failed: " + import.meta.url,
    e,
  );
}
