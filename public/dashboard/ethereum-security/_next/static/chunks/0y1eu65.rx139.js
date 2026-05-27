(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
	'object' == typeof document ? document.currentScript : void 0,
	95057,
	(e, t, n) => {
		'use strict';
		Object.defineProperty(n, '__esModule', { value: !0 });
		var r = {
			formatUrl: function () {
				return l;
			},
			formatWithValidation: function () {
				return c;
			},
			urlObjectKeys: function () {
				return s;
			},
		};
		for (var i in r)
			Object.defineProperty(n, i, { enumerable: !0, get: r[i] });
		let o = e.r(90809)._(e.r(98183)),
			a = /https?|ftp|gopher|file/;
		function l(e) {
			let { auth: t, hostname: n } = e,
				r = e.protocol || '',
				i = e.pathname || '',
				l = e.hash || '',
				s = e.query || '',
				c = !1;
			(t = t ? encodeURIComponent(t).replace(/%3A/i, ':') + '@' : ''),
				e.host
					? (c = t + e.host)
					: n &&
						((c = t + (~n.indexOf(':') ? `[${n}]` : n)),
						e.port && (c += ':' + e.port)),
				s &&
					'object' == typeof s &&
					(s = String(o.urlQueryToSearchParams(s)));
			let d = e.search || (s && `?${s}`) || '';
			return (
				r && !r.endsWith(':') && (r += ':'),
				e.slashes || ((!r || a.test(r)) && !1 !== c)
					? ((c = '//' + (c || '')),
						i && '/' !== i[0] && (i = '/' + i))
					: c || (c = ''),
				l && '#' !== l[0] && (l = '#' + l),
				d && '?' !== d[0] && (d = '?' + d),
				(i = i.replace(/[?#]/g, encodeURIComponent)),
				(d = d.replace('#', '%23')),
				`${r}${c}${i}${d}${l}`
			);
		}
		let s = [
			'auth',
			'hash',
			'host',
			'hostname',
			'href',
			'path',
			'pathname',
			'port',
			'protocol',
			'query',
			'search',
			'slashes',
		];
		function c(e) {
			return l(e);
		}
	},
	18581,
	(e, t, n) => {
		'use strict';
		Object.defineProperty(n, '__esModule', { value: !0 }),
			Object.defineProperty(n, 'useMergedRef', {
				enumerable: !0,
				get: function () {
					return i;
				},
			});
		let r = e.r(71645);
		function i(e, t) {
			let n = (0, r.useRef)(null),
				i = (0, r.useRef)(null);
			return (0, r.useCallback)(
				r => {
					if (null === r) {
						let e = n.current;
						e && ((n.current = null), e());
						let t = i.current;
						t && ((i.current = null), t());
					} else
						e && (n.current = o(e, r)), t && (i.current = o(t, r));
				},
				[e, t],
			);
		}
		function o(e, t) {
			if ('function' != typeof e)
				return (
					(e.current = t),
					() => {
						e.current = null;
					}
				);
			{
				let n = e(t);
				return 'function' == typeof n ? n : () => e(null);
			}
		}
		('function' == typeof n.default ||
			('object' == typeof n.default && null !== n.default)) &&
			void 0 === n.default.__esModule &&
			(Object.defineProperty(n.default, '__esModule', { value: !0 }),
			Object.assign(n.default, n),
			(t.exports = n.default));
	},
	73668,
	(e, t, n) => {
		'use strict';
		Object.defineProperty(n, '__esModule', { value: !0 }),
			Object.defineProperty(n, 'isLocalURL', {
				enumerable: !0,
				get: function () {
					return o;
				},
			});
		let r = e.r(18967),
			i = e.r(52817);
		function o(e) {
			if (!(0, r.isAbsoluteUrl)(e)) return !0;
			try {
				let t = (0, r.getLocationOrigin)(),
					n = new URL(e, t);
				return n.origin === t && (0, i.hasBasePath)(n.pathname);
			} catch (e) {
				return !1;
			}
		}
	},
	84508,
	(e, t, n) => {
		'use strict';
		Object.defineProperty(n, '__esModule', { value: !0 }),
			Object.defineProperty(n, 'errorOnce', {
				enumerable: !0,
				get: function () {
					return r;
				},
			});
		let r = e => {};
	},
	22016,
	(e, t, n) => {
		'use strict';
		Object.defineProperty(n, '__esModule', { value: !0 });
		var r = {
			default: function () {
				return x;
			},
			useLinkStatus: function () {
				return j;
			},
		};
		for (var i in r)
			Object.defineProperty(n, i, { enumerable: !0, get: r[i] });
		let o = e.r(90809),
			a = e.r(43476),
			l = o._(e.r(71645)),
			s = e.r(95057),
			c = e.r(8372),
			d = e.r(18581),
			u = e.r(18967),
			m = e.r(5550);
		e.r(33525);
		let h = e.r(88540),
			f = e.r(91949),
			p = e.r(73668),
			g = e.r(9396);
		function x(t) {
			var n, r;
			let i,
				o,
				x,
				[j, w] = (0, l.useOptimistic)(f.IDLE_LINK_STATUS),
				v = (0, l.useRef)(null),
				{
					href: y,
					as: C,
					children: N,
					prefetch: k = null,
					passHref: S,
					replace: M,
					shallow: _,
					scroll: D,
					onClick: E,
					onMouseEnter: L,
					onTouchStart: P,
					legacyBehavior: O = !1,
					onNavigate: A,
					transitionTypes: U,
					ref: $,
					unstable_dynamicOnHover: F,
					...T
				} = t;
			(i = N),
				O &&
					('string' == typeof i || 'number' == typeof i) &&
					(i = (0, a.jsx)('a', { children: i }));
			let R = l.default.useContext(c.AppRouterContext),
				I = !1 !== k,
				B =
					!1 !== k
						? null === (r = k) || 'auto' === r
							? g.FetchStrategy.PPR
							: g.FetchStrategy.Full
						: g.FetchStrategy.PPR,
				V = 'string' == typeof (n = C || y) ? n : (0, s.formatUrl)(n);
			if (O) {
				if (i?.$$typeof === Symbol.for('react.lazy'))
					throw Object.defineProperty(
						Error(
							"`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag.",
						),
						'__NEXT_ERROR_CODE',
						{ value: 'E863', enumerable: !1, configurable: !0 },
					);
				o = l.default.Children.only(i);
			}
			let z = O ? o && 'object' == typeof o && o.ref : $,
				H = l.default.useCallback(
					e => (
						null !== R &&
							(v.current = (0, f.mountLinkInstance)(
								e,
								V,
								R,
								B,
								I,
								w,
							)),
						() => {
							v.current &&
								((0, f.unmountLinkForCurrentNavigation)(
									v.current,
								),
								(v.current = null)),
								(0, f.unmountPrefetchableInstance)(e);
						}
					),
					[I, V, R, B, w],
				),
				K = {
					ref: (0, d.useMergedRef)(H, z),
					onClick(t) {
						O || 'function' != typeof E || E(t),
							O &&
								o.props &&
								'function' == typeof o.props.onClick &&
								o.props.onClick(t),
							!R ||
								t.defaultPrevented ||
								(function (t, n, r, i, o, a, s) {
									if ('u' > typeof window) {
										let c,
											{ nodeName: d } = t.currentTarget;
										if (
											('A' === d.toUpperCase() &&
												(((c =
													t.currentTarget.getAttribute(
														'target',
													)) &&
													'_self' !== c) ||
													t.metaKey ||
													t.ctrlKey ||
													t.shiftKey ||
													t.altKey ||
													(t.nativeEvent &&
														2 ===
															t.nativeEvent
																.which))) ||
											t.currentTarget.hasAttribute(
												'download',
											)
										)
											return;
										if (!(0, p.isLocalURL)(n)) {
											i &&
												(t.preventDefault(),
												location.replace(n));
											return;
										}
										if ((t.preventDefault(), a)) {
											let e = !1;
											if (
												(a({
													preventDefault: () => {
														e = !0;
													},
												}),
												e)
											)
												return;
										}
										let { dispatchNavigateAction: u } =
											e.r(99781);
										l.default.startTransition(() => {
											u(
												n,
												i ? 'replace' : 'push',
												!1 === o
													? h.ScrollBehavior.NoScroll
													: h.ScrollBehavior.Default,
												r.current,
												s,
											);
										});
									}
								})(t, V, v, M, D, A, U);
					},
					onMouseEnter(e) {
						O || 'function' != typeof L || L(e),
							O &&
								o.props &&
								'function' == typeof o.props.onMouseEnter &&
								o.props.onMouseEnter(e),
							R &&
								I &&
								(0, f.onNavigationIntent)(
									e.currentTarget,
									!0 === F,
								);
					},
					onTouchStart: function (e) {
						O || 'function' != typeof P || P(e),
							O &&
								o.props &&
								'function' == typeof o.props.onTouchStart &&
								o.props.onTouchStart(e),
							R &&
								I &&
								(0, f.onNavigationIntent)(
									e.currentTarget,
									!0 === F,
								);
					},
				};
			return (
				(0, u.isAbsoluteUrl)(V)
					? (K.href = V)
					: (O && !S && ('a' !== o.type || 'href' in o.props)) ||
						(K.href = (0, m.addBasePath)(V)),
				(x = O
					? l.default.cloneElement(o, K)
					: (0, a.jsx)('a', { ...T, ...K, children: i })),
				(0, a.jsx)(b.Provider, { value: j, children: x })
			);
		}
		e.r(84508);
		let b = (0, l.createContext)(f.IDLE_LINK_STATUS),
			j = () => (0, l.useContext)(b);
		('function' == typeof n.default ||
			('object' == typeof n.default && null !== n.default)) &&
			void 0 === n.default.__esModule &&
			(Object.defineProperty(n.default, '__esModule', { value: !0 }),
			Object.assign(n.default, n),
			(t.exports = n.default));
	},
	88143,
	(e, t, n) => {
		'use strict';
		function r({
			widthInt: e,
			heightInt: t,
			blurWidth: n,
			blurHeight: i,
			blurDataURL: o,
			objectFit: a,
		}) {
			let l = n ? 40 * n : e,
				s = i ? 40 * i : t,
				c = l && s ? `viewBox='0 0 ${l} ${s}'` : '';
			return `%3Csvg xmlns='http://www.w3.org/2000/svg' ${c}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${c ? 'none' : 'contain' === a ? 'xMidYMid' : 'cover' === a ? 'xMidYMid slice' : 'none'}' style='filter: url(%23b);' href='${o}'/%3E%3C/svg%3E`;
		}
		Object.defineProperty(n, '__esModule', { value: !0 }),
			Object.defineProperty(n, 'getImageBlurSvg', {
				enumerable: !0,
				get: function () {
					return r;
				},
			});
	},
	87690,
	(e, t, n) => {
		'use strict';
		Object.defineProperty(n, '__esModule', { value: !0 });
		var r = {
			VALID_LOADERS: function () {
				return o;
			},
			imageConfigDefault: function () {
				return a;
			},
		};
		for (var i in r)
			Object.defineProperty(n, i, { enumerable: !0, get: r[i] });
		let o = ['default', 'imgix', 'cloudinary', 'akamai', 'custom'],
			a = {
				deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
				imageSizes: [32, 48, 64, 96, 128, 256, 384],
				path: '/dashboard/ethereum-security/_next/image',
				loader: 'default',
				loaderFile: '',
				domains: [],
				disableStaticImages: !1,
				minimumCacheTTL: 14400,
				formats: ['image/webp'],
				maximumDiskCacheSize: void 0,
				maximumRedirects: 3,
				maximumResponseBody: 5e7,
				dangerouslyAllowLocalIP: !1,
				dangerouslyAllowSVG: !1,
				contentSecurityPolicy:
					"script-src 'none'; frame-src 'none'; sandbox;",
				contentDispositionType: 'attachment',
				localPatterns: void 0,
				remotePatterns: [],
				qualities: [75],
				unoptimized: !1,
				customCacheHandler: !1,
			};
	},
	8927,
	(e, t, n) => {
		'use strict';
		Object.defineProperty(n, '__esModule', { value: !0 }),
			Object.defineProperty(n, 'getImgProps', {
				enumerable: !0,
				get: function () {
					return c;
				},
			}),
			e.r(33525);
		let r = e.r(43369),
			i = e.r(88143),
			o = e.r(87690),
			a = ['-moz-initial', 'fill', 'none', 'scale-down', void 0];
		function l(e) {
			return void 0 !== e.default;
		}
		function s(e) {
			return void 0 === e
				? e
				: 'number' == typeof e
					? Number.isFinite(e)
						? e
						: NaN
					: 'string' == typeof e && /^[0-9]+$/.test(e)
						? parseInt(e, 10)
						: NaN;
		}
		function c(
			{
				src: e,
				sizes: t,
				unoptimized: n = !1,
				priority: d = !1,
				preload: u = !1,
				loading: m,
				className: h,
				quality: f,
				width: p,
				height: g,
				fill: x = !1,
				style: b,
				overrideSrc: j,
				onLoad: w,
				onLoadingComplete: v,
				placeholder: y = 'empty',
				blurDataURL: C,
				fetchPriority: N,
				decoding: k = 'async',
				layout: S,
				objectFit: M,
				objectPosition: _,
				lazyBoundary: D,
				lazyRoot: E,
				...L
			},
			P,
		) {
			var O;
			let A,
				U,
				$,
				{
					imgConf: F,
					showAltText: T,
					blurComplete: R,
					defaultLoader: I,
				} = P,
				B = F || o.imageConfigDefault;
			if ('allSizes' in B) A = B;
			else {
				let e = [...B.deviceSizes, ...B.imageSizes].sort(
						(e, t) => e - t,
					),
					t = B.deviceSizes.sort((e, t) => e - t),
					n = B.qualities?.sort((e, t) => e - t);
				A = { ...B, allSizes: e, deviceSizes: t, qualities: n };
			}
			if (void 0 === I)
				throw Object.defineProperty(
					Error(
						'images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config',
					),
					'__NEXT_ERROR_CODE',
					{ value: 'E163', enumerable: !1, configurable: !0 },
				);
			let V = L.loader || I;
			delete L.loader, delete L.srcSet;
			let z = '__next_img_default' in V;
			if (z) {
				if ('custom' === A.loader)
					throw Object.defineProperty(
						Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),
						'__NEXT_ERROR_CODE',
						{ value: 'E252', enumerable: !1, configurable: !0 },
					);
			} else {
				let e = V;
				V = t => {
					let { config: n, ...r } = t;
					return e(r);
				};
			}
			if (S) {
				'fill' === S && (x = !0);
				let e = {
					intrinsic: { maxWidth: '100%', height: 'auto' },
					responsive: { width: '100%', height: 'auto' },
				}[S];
				e && (b = { ...b, ...e });
				let n = { responsive: '100vw', fill: '100vw' }[S];
				n && !t && (t = n);
			}
			let H = '',
				K = s(p),
				q = s(g);
			if ((O = e) && 'object' == typeof O && (l(O) || void 0 !== O.src)) {
				let t = l(e) ? e.default : e;
				if (!t.src)
					throw Object.defineProperty(
						Error(
							`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(t)}`,
						),
						'__NEXT_ERROR_CODE',
						{ value: 'E460', enumerable: !1, configurable: !0 },
					);
				if (!t.height || !t.width)
					throw Object.defineProperty(
						Error(
							`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(t)}`,
						),
						'__NEXT_ERROR_CODE',
						{ value: 'E48', enumerable: !1, configurable: !0 },
					);
				if (
					((U = t.blurWidth),
					($ = t.blurHeight),
					(C = C || t.blurDataURL),
					(H = t.src),
					!x)
				)
					if (K || q) {
						if (K && !q) {
							let e = K / t.width;
							q = Math.round(t.height * e);
						} else if (!K && q) {
							let e = q / t.height;
							K = Math.round(t.width * e);
						}
					} else (K = t.width), (q = t.height);
			}
			let Q = !d && !u && ('lazy' === m || void 0 === m);
			(!(e = 'string' == typeof e ? e : H) ||
				e.startsWith('data:') ||
				e.startsWith('blob:')) &&
				((n = !0), (Q = !1)),
				A.unoptimized && (n = !0),
				z &&
					!A.dangerouslyAllowSVG &&
					e.split('?', 1)[0].endsWith('.svg') &&
					(n = !0);
			let Z = s(f),
				W = Object.assign(
					x
						? {
								position: 'absolute',
								height: '100%',
								width: '100%',
								left: 0,
								top: 0,
								right: 0,
								bottom: 0,
								objectFit: M,
								objectPosition: _,
							}
						: {},
					T ? {} : { color: 'transparent' },
					b,
				),
				G =
					R || 'empty' === y
						? null
						: 'blur' === y
							? `url("data:image/svg+xml;charset=utf-8,${(0, i.getImageBlurSvg)({ widthInt: K, heightInt: q, blurWidth: U, blurHeight: $, blurDataURL: C || '', objectFit: W.objectFit })}")`
							: `url("${y}")`,
				X = a.includes(W.objectFit)
					? 'fill' === W.objectFit
						? '100% 100%'
						: 'cover'
					: W.objectFit,
				J = G
					? {
							backgroundSize: X,
							backgroundPosition: W.objectPosition || '50% 50%',
							backgroundRepeat: 'no-repeat',
							backgroundImage: G,
						}
					: {},
				Y = (function ({
					config: e,
					src: t,
					unoptimized: n,
					width: i,
					quality: o,
					sizes: a,
					loader: l,
				}) {
					if (n) {
						if (t.startsWith('/') && !t.startsWith('//')) {
							let e = (0, r.getDeploymentId)();
							if (e) {
								let n = t.indexOf('?');
								if (-1 !== n) {
									let r = new URLSearchParams(t.slice(n + 1));
									r.get('dpl') ||
										(r.append('dpl', e),
										(t =
											t.slice(0, n) +
											'?' +
											r.toString()));
								} else t += `?dpl=${e}`;
							}
						}
						return { src: t, srcSet: void 0, sizes: void 0 };
					}
					let { widths: s, kind: c } = (function (
							{ deviceSizes: e, allSizes: t },
							n,
							r,
						) {
							if (r) {
								let n = /(^|\s)(1?\d?\d)vw/g,
									i = [];
								for (let e; (e = n.exec(r)); )
									i.push(parseInt(e[2]));
								if (i.length) {
									let n = 0.01 * Math.min(...i);
									return {
										widths: t.filter(t => t >= e[0] * n),
										kind: 'w',
									};
								}
								return { widths: t, kind: 'w' };
							}
							return 'number' != typeof n
								? { widths: e, kind: 'w' }
								: {
										widths: [
											...new Set(
												[n, 2 * n].map(
													e =>
														t.find(t => t >= e) ||
														t[t.length - 1],
												),
											),
										],
										kind: 'x',
									};
						})(e, i, a),
						d = s.length - 1;
					return {
						sizes: a || 'w' !== c ? a : '100vw',
						srcSet: s
							.map(
								(n, r) =>
									`${l({ config: e, src: t, quality: o, width: n })} ${'w' === c ? n : r + 1}${c}`,
							)
							.join(', '),
						src: l({ config: e, src: t, quality: o, width: s[d] }),
					};
				})({
					config: A,
					src: e,
					unoptimized: n,
					width: K,
					quality: Z,
					sizes: t,
					loader: V,
				}),
				ee = Q ? 'lazy' : m;
			return {
				props: {
					...L,
					loading: ee,
					fetchPriority: N,
					width: K,
					height: q,
					decoding: k,
					className: h,
					style: { ...W, ...J },
					sizes: Y.sizes,
					srcSet: Y.srcSet,
					src: j || Y.src,
				},
				meta: {
					unoptimized: n,
					preload: u || d,
					placeholder: y,
					fill: x,
				},
			};
		}
	},
	98879,
	(e, t, n) => {
		'use strict';
		Object.defineProperty(n, '__esModule', { value: !0 }),
			Object.defineProperty(n, 'default', {
				enumerable: !0,
				get: function () {
					return l;
				},
			});
		let r = e.r(71645),
			i = 'u' < typeof window,
			o = i ? () => {} : r.useLayoutEffect,
			a = i ? () => {} : r.useEffect;
		function l(e) {
			let { headManager: t, reduceComponentsToState: n } = e;
			function l() {
				if (t && t.mountedInstances) {
					let e = r.Children.toArray(
						Array.from(t.mountedInstances).filter(Boolean),
					);
					t.updateHead(n(e));
				}
			}
			return (
				i && (t?.mountedInstances?.add(e.children), l()),
				o(
					() => (
						t?.mountedInstances?.add(e.children),
						() => {
							t?.mountedInstances?.delete(e.children);
						}
					),
				),
				o(
					() => (
						t && (t._pendingUpdate = l),
						() => {
							t && (t._pendingUpdate = l);
						}
					),
				),
				a(
					() => (
						t &&
							t._pendingUpdate &&
							(t._pendingUpdate(), (t._pendingUpdate = null)),
						() => {
							t &&
								t._pendingUpdate &&
								(t._pendingUpdate(), (t._pendingUpdate = null));
						}
					),
				),
				null
			);
		}
	},
	25633,
	(e, t, n) => {
		'use strict';
		Object.defineProperty(n, '__esModule', { value: !0 });
		var r = {
			default: function () {
				return p;
			},
			defaultHead: function () {
				return u;
			},
		};
		for (var i in r)
			Object.defineProperty(n, i, { enumerable: !0, get: r[i] });
		let o = e.r(55682),
			a = e.r(90809),
			l = e.r(43476),
			s = a._(e.r(71645)),
			c = o._(e.r(98879)),
			d = e.r(42732);
		function u() {
			return [
				(0, l.jsx)('meta', { charSet: 'utf-8' }, 'charset'),
				(0, l.jsx)(
					'meta',
					{ name: 'viewport', content: 'width=device-width' },
					'viewport',
				),
			];
		}
		function m(e, t) {
			return 'string' == typeof t || 'number' == typeof t
				? e
				: t.type === s.default.Fragment
					? e.concat(
							s.default.Children.toArray(t.props.children).reduce(
								(e, t) =>
									'string' == typeof t || 'number' == typeof t
										? e
										: e.concat(t),
								[],
							),
						)
					: e.concat(t);
		}
		e.r(33525);
		let h = ['name', 'httpEquiv', 'charSet', 'itemProp'];
		function f(e) {
			let t, n, r, i;
			return e
				.reduce(m, [])
				.reverse()
				.concat(u().reverse())
				.filter(
					((t = new Set()),
					(n = new Set()),
					(r = new Set()),
					(i = {}),
					e => {
						let o = !0,
							a = !1;
						if (
							e.key &&
							'number' != typeof e.key &&
							e.key.indexOf('$') > 0
						) {
							a = !0;
							let n = e.key.slice(e.key.indexOf('$') + 1);
							t.has(n) ? (o = !1) : t.add(n);
						}
						switch (e.type) {
							case 'title':
							case 'base':
								n.has(e.type) ? (o = !1) : n.add(e.type);
								break;
							case 'meta':
								for (let t = 0, n = h.length; t < n; t++) {
									let n = h[t];
									if (e.props.hasOwnProperty(n))
										if ('charSet' === n)
											r.has(n) ? (o = !1) : r.add(n);
										else {
											let t = e.props[n],
												r = i[n] || new Set();
											('name' !== n || !a) && r.has(t)
												? (o = !1)
												: (r.add(t), (i[n] = r));
										}
								}
						}
						return o;
					}),
				)
				.reverse()
				.map((e, t) => {
					let n = e.key || t;
					return s.default.cloneElement(e, { key: n });
				});
		}
		let p = function ({ children: e }) {
			let t = (0, s.useContext)(d.HeadManagerContext);
			return (0, l.jsx)(c.default, {
				reduceComponentsToState: f,
				headManager: t,
				children: e,
			});
		};
		('function' == typeof n.default ||
			('object' == typeof n.default && null !== n.default)) &&
			void 0 === n.default.__esModule &&
			(Object.defineProperty(n.default, '__esModule', { value: !0 }),
			Object.assign(n.default, n),
			(t.exports = n.default));
	},
	18556,
	(e, t, n) => {
		'use strict';
		Object.defineProperty(n, '__esModule', { value: !0 }),
			Object.defineProperty(n, 'ImageConfigContext', {
				enumerable: !0,
				get: function () {
					return o;
				},
			});
		let r = e.r(55682)._(e.r(71645)),
			i = e.r(87690),
			o = r.default.createContext(i.imageConfigDefault);
	},
	65856,
	(e, t, n) => {
		'use strict';
		Object.defineProperty(n, '__esModule', { value: !0 }),
			Object.defineProperty(n, 'RouterContext', {
				enumerable: !0,
				get: function () {
					return r;
				},
			});
		let r = e.r(55682)._(e.r(71645)).default.createContext(null);
	},
	70965,
	(e, t, n) => {
		'use strict';
		function r(e, t) {
			let n = e || 75;
			return t?.qualities?.length
				? t.qualities.reduce(
						(e, t) => (Math.abs(t - n) < Math.abs(e - n) ? t : e),
						t.qualities[0],
					)
				: n;
		}
		Object.defineProperty(n, '__esModule', { value: !0 }),
			Object.defineProperty(n, 'findClosestQuality', {
				enumerable: !0,
				get: function () {
					return r;
				},
			});
	},
	1948,
	(e, t, n) => {
		'use strict';
		Object.defineProperty(n, '__esModule', { value: !0 }),
			Object.defineProperty(n, 'default', {
				enumerable: !0,
				get: function () {
					return a;
				},
			});
		let r = e.r(70965),
			i = e.r(43369);
		function o({ config: e, src: t, width: n, quality: a }) {
			let l = (0, i.getDeploymentId)();
			if (t.startsWith('/') && !t.startsWith('//')) {
				let e = t.indexOf('?');
				if (-1 !== e) {
					let n = new URLSearchParams(t.slice(e + 1)),
						r = n.get('dpl');
					if (r) {
						(l = r), n.delete('dpl');
						let i = n.toString();
						t = t.slice(0, e) + (i ? '?' + i : '');
					}
				}
			}
			if (
				t.startsWith('/') &&
				t.includes('?') &&
				e.localPatterns?.length === 1 &&
				'**' === e.localPatterns[0].pathname &&
				'' === e.localPatterns[0].search
			)
				throw Object.defineProperty(
					Error(`Image with src "${t}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),
					'__NEXT_ERROR_CODE',
					{ value: 'E871', enumerable: !1, configurable: !0 },
				);
			let s = (0, r.findClosestQuality)(a, e);
			return `${e.path}?url=${encodeURIComponent(t)}&w=${n}&q=${s}${t.startsWith('/') && l ? `&dpl=${l}` : ''}`;
		}
		o.__next_img_default = !0;
		let a = o;
	},
	5500,
	(e, t, n) => {
		'use strict';
		Object.defineProperty(n, '__esModule', { value: !0 }),
			Object.defineProperty(n, 'Image', {
				enumerable: !0,
				get: function () {
					return w;
				},
			});
		let r = e.r(55682),
			i = e.r(90809),
			o = e.r(43476),
			a = i._(e.r(71645)),
			l = r._(e.r(74080)),
			s = r._(e.r(25633)),
			c = e.r(8927),
			d = e.r(87690),
			u = e.r(18556);
		e.r(33525);
		let m = e.r(65856),
			h = r._(e.r(1948)),
			f = e.r(18581),
			p = {
				deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
				imageSizes: [32, 48, 64, 96, 128, 256, 384],
				qualities: [75],
				path: '/dashboard/ethereum-security/_next/image',
				loader: 'default',
				dangerouslyAllowSVG: !1,
				unoptimized: !0,
			};
		function g(e, t, n, r, i, o, a) {
			let l = e?.src;
			e &&
				e['data-loaded-src'] !== l &&
				((e['data-loaded-src'] = l),
				('decode' in e ? e.decode() : Promise.resolve())
					.catch(() => {})
					.then(() => {
						if (e.parentElement && e.isConnected) {
							if (('empty' !== t && i(!0), n?.current)) {
								let t = new Event('load');
								Object.defineProperty(t, 'target', {
									writable: !1,
									value: e,
								});
								let r = !1,
									i = !1;
								n.current({
									...t,
									nativeEvent: t,
									currentTarget: e,
									target: e,
									isDefaultPrevented: () => r,
									isPropagationStopped: () => i,
									persist: () => {},
									preventDefault: () => {
										(r = !0), t.preventDefault();
									},
									stopPropagation: () => {
										(i = !0), t.stopPropagation();
									},
								});
							}
							r?.current && r.current(e);
						}
					}));
		}
		function x(e) {
			return a.use ? { fetchPriority: e } : { fetchpriority: e };
		}
		'u' < typeof window && (globalThis.__NEXT_IMAGE_IMPORTED = !0);
		let b = (0, a.forwardRef)(
			(
				{
					src: e,
					srcSet: t,
					sizes: n,
					height: r,
					width: i,
					decoding: l,
					className: s,
					style: c,
					fetchPriority: d,
					placeholder: u,
					loading: m,
					unoptimized: h,
					fill: p,
					onLoadRef: b,
					onLoadingCompleteRef: j,
					setBlurComplete: w,
					setShowAltText: v,
					sizesInput: y,
					onLoad: C,
					onError: N,
					...k
				},
				S,
			) => {
				let M = (0, a.useCallback)(
						e => {
							e &&
								(N && (e.src = e.src),
								e.complete && g(e, u, b, j, w, h, y));
						},
						[e, u, b, j, w, N, h, y],
					),
					_ = (0, f.useMergedRef)(S, M);
				return (0, o.jsx)('img', {
					...k,
					...x(d),
					loading: m,
					width: i,
					height: r,
					decoding: l,
					'data-nimg': p ? 'fill' : '1',
					className: s,
					style: c,
					sizes: n,
					srcSet: t,
					src: e,
					ref: _,
					onLoad: e => {
						g(e.currentTarget, u, b, j, w, h, y);
					},
					onError: e => {
						v(!0), 'empty' !== u && w(!0), N && N(e);
					},
				});
			},
		);
		function j({ isAppRouter: e, imgAttributes: t }) {
			let n = {
				as: 'image',
				imageSrcSet: t.srcSet,
				imageSizes: t.sizes,
				crossOrigin: t.crossOrigin,
				referrerPolicy: t.referrerPolicy,
				...x(t.fetchPriority),
			};
			return e && l.default.preload
				? (l.default.preload(t.src, n), null)
				: (0, o.jsx)(s.default, {
						children: (0, o.jsx)(
							'link',
							{
								rel: 'preload',
								href: t.srcSet ? void 0 : t.src,
								...n,
							},
							'__nimg-' + t.src + t.srcSet + t.sizes,
						),
					});
		}
		let w = (0, a.forwardRef)((e, t) => {
			let n = (0, a.useContext)(m.RouterContext),
				r = (0, a.useContext)(u.ImageConfigContext),
				i = (0, a.useMemo)(() => {
					let e = p || r || d.imageConfigDefault,
						t = [...e.deviceSizes, ...e.imageSizes].sort(
							(e, t) => e - t,
						),
						n = e.deviceSizes.sort((e, t) => e - t),
						i = e.qualities?.sort((e, t) => e - t);
					return {
						...e,
						allSizes: t,
						deviceSizes: n,
						qualities: i,
						localPatterns:
							'u' < typeof window
								? r?.localPatterns
								: e.localPatterns,
					};
				}, [r]),
				{ onLoad: l, onLoadingComplete: s } = e,
				f = (0, a.useRef)(l);
			(0, a.useEffect)(() => {
				f.current = l;
			}, [l]);
			let g = (0, a.useRef)(s);
			(0, a.useEffect)(() => {
				g.current = s;
			}, [s]);
			let [x, w] = (0, a.useState)(!1),
				[v, y] = (0, a.useState)(!1),
				{ props: C, meta: N } = (0, c.getImgProps)(e, {
					defaultLoader: h.default,
					imgConf: i,
					blurComplete: x,
					showAltText: v,
				});
			return (0, o.jsxs)(o.Fragment, {
				children: [
					(0, o.jsx)(b, {
						...C,
						unoptimized: N.unoptimized,
						placeholder: N.placeholder,
						fill: N.fill,
						onLoadRef: f,
						onLoadingCompleteRef: g,
						setBlurComplete: w,
						setShowAltText: y,
						sizesInput: e.sizes,
						ref: t,
					}),
					N.preload
						? (0, o.jsx)(j, { isAppRouter: !n, imgAttributes: C })
						: null,
				],
			});
		});
		('function' == typeof n.default ||
			('object' == typeof n.default && null !== n.default)) &&
			void 0 === n.default.__esModule &&
			(Object.defineProperty(n.default, '__esModule', { value: !0 }),
			Object.assign(n.default, n),
			(t.exports = n.default));
	},
	94909,
	(e, t, n) => {
		'use strict';
		Object.defineProperty(n, '__esModule', { value: !0 });
		var r = {
			default: function () {
				return d;
			},
			getImageProps: function () {
				return c;
			},
		};
		for (var i in r)
			Object.defineProperty(n, i, { enumerable: !0, get: r[i] });
		let o = e.r(55682),
			a = e.r(8927),
			l = e.r(5500),
			s = o._(e.r(1948));
		function c(e) {
			let { props: t } = (0, a.getImgProps)(e, {
				defaultLoader: s.default,
				imgConf: {
					deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
					imageSizes: [32, 48, 64, 96, 128, 256, 384],
					qualities: [75],
					path: '/dashboard/ethereum-security/_next/image',
					loader: 'default',
					dangerouslyAllowSVG: !1,
					unoptimized: !0,
				},
			});
			for (let [e, n] of Object.entries(t)) void 0 === n && delete t[e];
			return { props: t };
		}
		let d = l.Image;
	},
	57688,
	(e, t, n) => {
		t.exports = e.r(94909);
	},
	58116,
	e => {
		'use strict';
		var t = e.i(43476),
			n = e.i(71645);
		class r extends Error {}
		function i(e, t, n, i) {
			if (0 === e.size || t <= 0) {
				let t = new Map();
				for (let n of e.keys()) t.set(n, 0);
				return t;
			}
			let o = n > 0 ? n : t;
			if (0 >= [...e.values()].reduce((e, t) => e + t, 0)) {
				let t = new Map();
				for (let n of e.keys()) t.set(n, 0);
				return t;
			}
			return (function ({
				raw: e,
				totalPool: t,
				minFloor: n,
				maxCap: i,
			}) {
				let o = (function (e, t) {
						let n = [...e.values()].reduce((e, t) => e + t, 0),
							i = new Map();
						if (0 === t) {
							for (let t of e.keys()) i.set(t, 0);
							return i;
						}
						if (n <= 0)
							throw new r(
								'Cannot normalize allocations to the pool: total raw allocation is zero.',
							);
						for (let [r, o] of e) i.set(r, (o / n) * t);
						return i;
					})(e, t),
					a = new Set();
				for (;;) {
					let e = 0;
					for (let [t, n] of o)
						n > i && ((e += n - i), o.set(t, i), a.add(t));
					let t = [];
					for (let e of o.keys()) a.has(e) || t.push(e);
					if (0 === e) break;
					if (0 === t.length)
						throw new r(
							'Max cap overflow cannot be redistributed: all projects are already at max cap.',
						);
					let n = 0;
					for (let e of t) n += o.get(e) ?? 0;
					if (n <= 0)
						throw new r(
							'Max cap overflow cannot be redistributed: eligible projects have zero allocation weight.',
						);
					for (let r of t) {
						let t = o.get(r) ?? 0,
							i = t / n;
						o.set(r, t + e * i);
					}
				}
				let l = new Set(),
					s = 0;
				for (let [e, t] of o)
					!a.has(e) && t < n && ((s += n - t), o.set(e, n), l.add(e));
				for (; s > 0; ) {
					let e = [];
					for (let [t, r] of o)
						a.has(t) || (!l.has(t) && r > n && e.push(t));
					let t = 0;
					for (let r of e) t += (o.get(r) ?? 0) - n;
					if (t <= 0)
						throw new r(
							`Cannot enforce minimum floor: below-floor projects need ${s.toFixed(2)}, but non-max middle projects have no surplus above the floor.`,
						);
					if (s > t)
						throw new r(
							`Cannot enforce minimum floor without violating freeze rules: below-floor projects need ${s.toFixed(2)}, but non-max middle projects only have ${t.toFixed(2)} available above the floor.`,
						);
					for (let i of e) {
						let e = o.get(i) ?? 0,
							a = (s * (e - n)) / t,
							l = e - a;
						if ((o.set(i, l), l < n - 1e-9))
							throw new r(
								`Internal error: project ${i} was cut below min_floor. The surplus-proportional cut should never do this.`,
							);
					}
					s = 0;
				}
				for (let [e, t] of o) {
					if (t < n - 1e-9)
						throw new r(
							`Project ${e} is still below the minimum floor.`,
						);
					if (t > i + 1e-9)
						throw new r(`Project ${e} is above the maximum cap.`);
				}
				let c = 0;
				for (let e of o.values()) c += e;
				if (Math.abs(c - t) > 1e-9)
					throw new r(
						`Final allocations (${c.toFixed(2)}) do not sum to the total pool (${t.toFixed(2)}). This indicates a redistribution bug or infeasible cap/floor settings.`,
					);
				return o;
			})({ raw: e, totalPool: t, minFloor: i > 0 ? i : 0, maxCap: o });
		}
		function o(e, t, n) {
			let o,
				a,
				l = performance.now(),
				s = [],
				c = 2100 * n.matchingPoolEth,
				d = n.capPercent > 0 ? c * n.capPercent : 0,
				u = n.floorEth > 0 ? 2100 * n.floorEth : 0,
				m = e.donations;
			t.antiGaming4xOthers &&
				(m = (function (e) {
					let t = new Map(),
						n = new Map();
					for (let r of e) {
						let e = t.get(r.donorId) ?? new Map();
						t.set(r.donorId, e),
							e.set(
								r.projectKey,
								(e.get(r.projectKey) ?? 0) + r.amountUSD,
							),
							n.set(
								r.donorId,
								(n.get(r.donorId) ?? 0) + r.amountUSD,
							);
					}
					let r = new Map();
					for (let [e, i] of t) {
						let t = n.get(e) ?? 0,
							o = new Map();
						for (let [e, n] of i) {
							let r = Math.max(0, t - n);
							if (0 === r && n > 0) {
								o.set(e, n);
								continue;
							}
							let i = 4 * r;
							o.set(e, Math.min(n, i));
						}
						r.set(e, o);
					}
					let i = new Map();
					for (let t of e) {
						let e = `${t.donorId}\u0000${t.projectKey}`,
							n = i.get(e) ?? [];
						i.set(e, n), n.push(t);
					}
					let o = [];
					for (let [e, t] of i) {
						let [n, i] = e.split('\0'),
							a = r.get(n)?.get(i) ?? 0,
							l = t.reduce((e, t) => e + t.amountUSD, 0);
						if (l <= 0 || a <= 0) {
							for (let e of t) o.push({ ...e, amountUSD: 0 });
							continue;
						}
						if (a >= l) {
							for (let e of t) o.push(e);
							continue;
						}
						let s = a / l;
						for (let e of t)
							o.push({ ...e, amountUSD: e.amountUSD * s });
					}
					return o;
				})(m));
			let h = (function (e, t) {
					let n = new Map();
					for (let r of e) {
						if (
							('only_badgeholders' === t.badgeHolderMode &&
								!r.isBadgeholder) ||
							('only_non_badgeholders' === t.badgeHolderMode &&
								r.isBadgeholder) ||
							(t.qfEligibleOnly && !r.isMatchingEligible) ||
							((t.tikOnly || t.finnOnly) &&
								!(
									(t.tikOnly && r.isTIK) ||
									(t.finnOnly && r.isFINN)
								)) ||
							!(r.amountUSD > 0) ||
							r.isSelfDonation
						)
							continue;
						let e =
								Math.round(
									((function (e, t) {
										let n =
											'boost_4x' === t.badgeHolderMode &&
											e.isBadgeholder
												? 4
												: 1;
										return e.amountUSD * n;
									})(r, t) +
										Number.EPSILON) *
										10,
								) / 10,
							i = `${r.donorId}\u0000${r.projectKey}`,
							o = n.get(i);
						o ||
							((o = {
								donorId: r.donorId,
								projectKey: r.projectKey,
								projectName: r.projectName,
								amount: 0,
								originalUsd: 0,
								tik: 0,
								finn: 0,
							}),
							n.set(i, o)),
							(o.amount += e),
							(o.originalUsd += r.amountUSD),
							r.isTIK && (o.tik += r.amountUSD),
							r.isFINN && (o.finn += r.amountUSD);
					}
					return [...n.values()];
				})(m, t).filter(e => e.amount >= n.minDonationUsd),
				f = (function (e) {
					let t = new Map(),
						n = new Map(),
						r = [],
						i = [],
						o = e => {
							let n = t.get(e);
							return (
								void 0 === n &&
									((n = r.length), t.set(e, n), r.push(e)),
								n
							);
						},
						a = e => {
							let t = n.get(e);
							return (
								void 0 === t &&
									((t = i.length), n.set(e, t), i.push(e)),
								t
							);
						},
						l = new Map(),
						s = new Map();
					for (let t of e) {
						if (!(t.amount > 0)) continue;
						let e = o(t.donorId),
							n = a(t.projectKey),
							r = l.get(e);
						r || ((r = new Map()), l.set(e, r)),
							r.set(n, (r.get(n) ?? 0) + t.amount);
						let i = s.get(n);
						i || ((i = new Map()), s.set(n, i)),
							i.set(e, (i.get(e) ?? 0) + t.amount);
					}
					return { donors: r, projects: i, byDonor: l, byProject: s };
				})(
					h.map(e => ({
						donorId: e.donorId,
						projectKey: e.projectKey,
						amount: e.amount,
					})),
				);
			o =
				'COCM' === t.algorithm
					? (function (e, { harsh: t = !1 } = {}) {
							let n = e.projects.length,
								r = e.donors.length,
								i = new Float64Array(n);
							if (0 === n || 0 === r) return i;
							let o = new Float64Array(r);
							for (let [t, n] of e.byDonor) {
								let e = 0;
								for (let t of n.values()) e += t;
								o[t] = e;
							}
							let a = new Float64Array(n);
							for (let [t, n] of e.byProject) {
								let e = 0;
								for (let t of n.values()) e += t;
								a[t] = e;
							}
							let l = new Float64Array(n * n);
							for (let [t, r] of e.byDonor) {
								let e = o[t];
								if (e <= 0) continue;
								let i = [];
								for (let [e, t] of r)
									i.push({ p: e, amount: t });
								for (let t = 0; t < i.length; t++) {
									let { p: r, amount: o } = i[t],
										s = a[r];
									if (s <= 0) continue;
									let c = o / s,
										d = r * n;
									for (let t = 0; t < i.length; t++) {
										let { p: n, amount: r } = i[t],
											o = r / e;
										l[d + n] += c * o;
									}
								}
							}
							let s = new Map();
							for (let [t, r] of e.byDonor) {
								let e = o[t];
								if (e <= 0) continue;
								let i = new Float64Array(n);
								for (let [t, o] of r) {
									let r = o / e,
										a = t * n;
									for (let e = 0; e < n; e++)
										i[e] += r * l[a + e];
								}
								for (let e of r.keys()) i[e] < 1 && (i[e] = 1);
								s.set(t, i);
							}
							let c = new Float64Array(n * n);
							for (let r = 0; r < n; r++) {
								let a = e.byProject.get(r);
								if (!a || 0 === a.size) continue;
								for (let [r, i] of (c.fill(0), a)) {
									if (i <= 0) continue;
									let a = o[r];
									if (a <= 0) continue;
									let l = s.get(r);
									if (!l) continue;
									let d = Math.sqrt(i),
										u = new Float64Array(n);
									if (t)
										for (let e = 0; e < n; e++)
											u[e] = (1 - l[e]) * i;
									else
										for (let e = 0; e < n; e++)
											u[e] = l[e] * d + (1 - l[e]) * i;
									let m = e.byDonor.get(r);
									if (m)
										for (let [e, t] of m) {
											let r = t / a;
											if (0 !== r)
												for (let t = 0; t < n; t++)
													c[t * n + e] += u[t] * r;
										}
								}
								let l = 0;
								for (let e = 0; e < n; e++) {
									let t = e * n;
									for (let r = 0; r < n; r++) {
										if (e === r) continue;
										let i = c[t + r] * c[r * n + e];
										i > 0 && (l += Math.sqrt(i));
									}
								}
								i[r] = l > 0 ? l : 0;
							}
							return i;
						})(f, { harsh: !1 })
					: (function (e) {
							let t = e.projects.length,
								n = new Float64Array(t);
							for (let r = 0; r < t; r++) {
								let t = e.byProject.get(r);
								if (!t) continue;
								let i = 0,
									o = 0;
								for (let e of t.values())
									e <= 0 || ((i += Math.sqrt(e)), (o += e));
								(n[r] = i * i - o), n[r] < 0 && (n[r] = 0);
							}
							return n;
						})(f);
			let p = new Map();
			for (let t of e.projects) p.set(t, 0);
			for (let e = 0; e < f.projects.length; e++)
				p.set(f.projects[e], o[e]);
			try {
				a = i(p, c, d, u);
			} catch (t) {
				if (t instanceof r) {
					s.push(
						`Cap/floor infeasible: ${t.message}. Falling back to no-cap, no-floor distribution.`,
					);
					try {
						a = i(p, c, 0, 0);
					} catch (n) {
						let t = n instanceof Error ? n.message : String(n);
						for (let n of (s.push(
							`Pool distribution failed even without cap/floor: ${t}.`,
						),
						(a = new Map()),
						e.projects))
							a.set(n, 0);
					}
				} else throw t;
			}
			let g = (function (e) {
					let t = new Map();
					for (let n of e) {
						let e = t.get(n.projectKey);
						e ||
							((e = { totalUsd: 0, contributors: new Set() }),
							t.set(n.projectKey, e)),
							(e.totalUsd += n.originalUsd),
							e.contributors.add(n.donorId);
					}
					return t;
				})(h),
				x = (function (e) {
					let t = new Map();
					for (let n of e.donations)
						n.isTIK &&
							t.set(
								n.projectKey,
								(t.get(n.projectKey) ?? 0) + n.amountUSD,
							);
					return t;
				})(e),
				b = (function (e) {
					let t = new Map();
					for (let n of e.donations)
						n.isFINN &&
							t.set(
								n.projectKey,
								(t.get(n.projectKey) ?? 0) + n.amountUSD,
							);
					return t;
				})(e),
				j = e.projects.map(e => {
					let t = g.get(e),
						n = a.get(e) ?? 0;
					return {
						projectName: e,
						totalDonationsUSD: t?.totalUsd ?? 0,
						contributorCount: t?.contributors.size ?? 0,
						matchingUSD: n,
						matchingEth: n / 2100,
						rank: 0,
						tikReceived: x.get(e) ?? 0,
						finnReceived: b.get(e) ?? 0,
					};
				});
			j.sort((e, t) =>
				t.matchingUSD !== e.matchingUSD
					? t.matchingUSD - e.matchingUSD
					: t.totalDonationsUSD - e.totalDonationsUSD,
			),
				j.forEach((e, t) => {
					e.rank = t + 1;
				});
			let w = 0;
			for (let e of j) w += e.matchingUSD;
			let v = 0,
				y = new Set(),
				C = 0;
			for (let e of j)
				(v += e.totalDonationsUSD), e.totalDonationsUSD > 0 && (C += 1);
			for (let e of h) y.add(e.donorId);
			return {
				settings: t,
				projects: j,
				totalMatchedUSD: w,
				totalEligibleDonationsUSD: v,
				eligibleDonorCount: y.size,
				fundedProjectCount: C,
				computeMs: performance.now() - l,
				warnings: s,
			};
		}
		let a = '/dashboard/ethereum-security/data-scrubbed-public.csv',
			l = [
				'email',
				'voter',
				'payoutAddress',
				'payout_address',
				'safeTransactionId',
				'safe_transaction_id',
				'tokenAddress',
				'token_address',
				'recurringDonationId',
				'recurring_donation_id',
			],
			s = {
				projectName: [
					'project_name',
					'projectname',
					'project',
					'name',
					'title',
				],
				donorLabel: [
					'donor_label',
					'donor_id',
					'donor',
					'userid',
					'user_id',
				],
				currency: ['currency'],
				amountUsd: [
					'amountusd',
					'amount_usd',
					'amount usd',
					'usd_amount',
					'usd',
				],
				isBadgeholder: [
					'isbadgeholder',
					'is_badgeholder',
					'badgeholder',
					'is_badge_holder',
					'badge_holder',
				],
				isMatchingEligible: [
					'isqfeligible',
					'is_qf_eligible',
					'qf_eligible',
					'qfeligible',
					'ismatchingeligible',
					'is_matching_eligible',
				],
				isSelfDonation: ['isselfdonation'],
			};
		class c extends Error {}
		function d(e) {
			if (null == e) return !1;
			let t = String(e).trim().toLowerCase();
			return (
				'true' === t ||
				't' === t ||
				'1' === t ||
				'yes' === t ||
				'y' === t
			);
		}
		async function u() {
			let e;
			try {
				e = await fetch(a, { cache: 'no-store' });
			} catch (t) {
				let e = t instanceof Error ? t.message : String(t);
				throw new c(
					`Failed to fetch ${a}: ${e}. Make sure data.csv is placed at public/data.csv.`,
				);
			}
			if (!e.ok) {
				if (404 === e.status)
					throw new c(
						`data.csv not found at ${a}. Place the Ethereum Security QF round export at public/data.csv and reload.`,
					);
				throw new c(`Failed to fetch ${a}: HTTP ${e.status}.`);
			}
			return (function (e) {
				let { headers: t, rows: n } = (function (e) {
					let t = [],
						n = [],
						r = '',
						i = !1,
						o = 0;
					for (; o < e.length; ) {
						let a = e[o];
						if (i) {
							if ('"' === a) {
								if ('"' === e[o + 1]) {
									(r += '"'), (o += 2);
									continue;
								}
								(i = !1), o++;
								continue;
							}
							(r += a), o++;
							continue;
						}
						if ('"' === a) {
							(i = !0), o++;
							continue;
						}
						if (',' === a) {
							n.push(r), (r = ''), o++;
							continue;
						}
						if ('\n' === a || '\r' === a) {
							let i = '\r' === a && '\n' === e[o + 1];
							n.push(r),
								(r = ''),
								t.push(n),
								(n = []),
								(o += i ? 2 : 1);
							continue;
						}
						(r += a), o++;
					}
					for (
						(r.length > 0 || n.length > 0) &&
						(n.push(r), t.push(n));
						t.length > 0 && t[t.length - 1].every(e => '' === e);

					)
						t.pop();
					if (0 === t.length) return { headers: [], rows: [] };
					let a = t[0].map(e => e.trim()),
						l = [];
					for (let e = 1; e < t.length; e++) {
						let n = t[e],
							r = {};
						for (let e = 0; e < a.length; e++) r[a[e]] = n[e] ?? '';
						l.push(r);
					}
					return { headers: a, rows: l };
				})(e);
				if (0 === t.length)
					throw new c('data.csv appears to be empty.');
				let r = new Map(t.map(e => [e.toLowerCase().trim(), e]));
				for (let e of l) {
					let t = r.get(e.toLowerCase());
					if (
						t &&
						n.find(e => {
							let n = (e[t] ?? '').trim();
							return (
								'' !== n &&
								'null' !== n.toLowerCase() &&
								'n/a' !== n.toLowerCase()
							);
						})
					)
						throw new c(
							`data.csv contains non-empty values in the forbidden column "${t}". Scrub this column before deploying the dashboard — it would expose donor PII.`,
						);
				}
				let i = (function (e) {
					let t = {};
					for (let n of Object.keys(s))
						t[n] = (function (e, t) {
							let n = new Map(
								e.map(e => [e.toLowerCase().trim(), e]),
							);
							for (let e of t) {
								let t = n.get(e.toLowerCase());
								if (t) return t;
							}
							return null;
						})(e, s[n]);
					return t;
				})(t);
				if (!i.projectName)
					throw new c(
						`data.csv is missing a project name column (expected one of: ${s.projectName.join(', ')}).`,
					);
				if (!i.donorLabel)
					throw new c(
						`data.csv is missing a donor identifier column (expected one of: ${s.donorLabel.join(', ')}).`,
					);
				if (!i.amountUsd)
					throw new c(
						`data.csv is missing a USD amount column (expected one of: ${s.amountUsd.join(', ')}).`,
					);
				let o = ((n[0] ?? {})[i.donorLabel] ?? '').trim(),
					a = /^Donor\s+\d+$/i.test(o),
					u = a
						? new Map()
						: (function (e, t) {
								let n = new Map(),
									r = 0;
								for (let i of e) {
									let e = (i[t] ?? '').trim();
									'' !== e &&
										'null' !== e.toLowerCase() &&
										(n.has(e) ||
											((r += 1), n.set(e, `Donor ${r}`)));
								}
								return n;
							})(n, i.donorLabel),
					m = [],
					h = 0;
				for (let e of n) {
					let t = (e[i.projectName] ?? '').trim(),
						n = (e[i.donorLabel] ?? '').trim(),
						r = (function (e) {
							if (null == e) return NaN;
							let t = String(e)
								.replace(/[$,\s]/g, '')
								.trim();
							if ('' === t || 'null' === t.toLowerCase())
								return NaN;
							let n = Number(t);
							return Number.isFinite(n) ? n : NaN;
						})(e[i.amountUsd]);
					if ('' === t || '' === n || !Number.isFinite(r)) {
						h += 1;
						continue;
					}
					let o = a ? n : (u.get(n) ?? n),
						l = i.currency
							? (e[i.currency] ?? '').trim().toLowerCase()
							: '',
						s = 'tik' === l,
						c = 'finn' === l,
						f = !!i.isBadgeholder && d(e[i.isBadgeholder]),
						p = !!i.isSelfDonation && d(e[i.isSelfDonation]),
						g = !i.isMatchingEligible || d(e[i.isMatchingEligible]);
					m.push({
						projectName: t,
						projectKey: t,
						donorId: o,
						isTIK: s,
						isFINN: c,
						amountUSD: r,
						isBadgeholder: f,
						isMatchingEligible: g,
						isSelfDonation: p,
					});
				}
				let f = new Set(),
					p = new Set(),
					g = 0;
				for (let e of m)
					f.add(e.projectName), p.add(e.donorId), (g += e.amountUSD);
				return {
					dataset: {
						donations: m,
						projects: [...f].sort((e, t) => e.localeCompare(t)),
						donors: [...p].sort((e, t) => {
							let n = Number(e.replace(/[^0-9]/g, '')),
								r = Number(t.replace(/[^0-9]/g, ''));
							return Number.isFinite(n) && Number.isFinite(r)
								? n - r
								: e.localeCompare(t);
						}),
						totalUSD: g,
					},
					droppedRows: h,
					donorsAlreadyAbstract: a,
				};
			})(await e.text());
		}
		var m = e.i(22016),
			h = e.i(57688);
		function f(e, t) {
			let { title: n = t, ...r } = e;
			return { title: n, rest: r };
		}
		function p(e) {
			let { title: n = 'TheDAO', alt: r, ...i } = e;
			return (0, t.jsx)(h.default, {
				src: '/dashboard/ethereum-security/dao-logo.png',
				width: 250,
				height: 250,
				alt: r ?? n,
				'aria-label': n,
				...i,
			});
		}
		function g(e) {
			let { title: n, rest: r } = f(e, 'Giveth');
			return (0, t.jsxs)('svg', {
				viewBox: '0 0 66 66',
				'aria-label': n,
				role: 'img',
				fill: 'none',
				xmlns: 'http://www.w3.org/2000/svg',
				...r,
				children: [
					(0, t.jsx)('path', {
						d: 'M66 33C66 14.7746 51.2254 0 33 0C14.7746 0 0 14.7746 0 33C0 51.2254 14.7746 66 33 66C51.2254 66 66 51.2254 66 33Z',
						fill: '#5326EC',
					}),
					(0, t.jsx)('path', {
						d: 'M57.6117 33.6118C57.5632 34.3074 57.5462 35.0076 57.4613 35.6981C56.561 43.031 53.1509 48.9069 47.1649 53.2095C42.6933 56.4245 37.6464 57.925 32.1493 57.7341C25.7926 57.5149 20.3123 55.142 15.7169 50.7299C15.6746 50.6892 15.6756 50.5267 15.7169 50.4833C21.4485 44.7255 27.1855 38.9735 32.9279 33.2273C33.0637 33.1027 33.2393 33.0306 33.4233 33.0242C41.4868 33.0141 49.5501 33.0113 57.6134 33.0156L57.6117 33.6118Z',
						fill: 'var(--text-primary, #f4f6ff)',
					}),
					(0, t.jsx)('path', {
						d: 'M33.5295 8.25C34.2075 8.3016 34.8868 8.3317 35.5623 8.4049C39.518 8.835 43.1611 10.1447 46.4916 12.3341C46.5142 12.3511 46.5358 12.3694 46.5564 12.3888L44.451 14.496C43.9927 14.9546 43.5374 15.4164 43.0737 15.8692C43.0443 15.8882 43.0108 15.8997 42.9761 15.9028C42.9413 15.9058 42.9063 15.9003 42.8742 15.8866C39.5212 13.9519 35.9119 13.0621 32.0465 13.2172C23.3982 13.5667 15.8589 19.7097 13.7852 28.1334C12.5017 33.3526 13.2158 38.3109 15.8589 42.9907C15.8841 43.0352 15.8855 43.1333 15.8552 43.1617C14.7078 44.3209 13.5564 45.4772 12.4011 46.6305C12.3898 46.6418 12.3759 46.651 12.3496 46.6722C12.2408 46.5033 12.1314 46.3398 12.0284 46.1729C9.1779 41.5515 7.9196 36.5286 8.3267 31.1069C9.1755 19.8363 17.5397 10.6028 28.6695 8.642C29.7948 8.4439 30.9457 8.3936 32.0844 8.275L32.3169 8.25H33.5295Z',
						fill: 'var(--text-primary, #f4f6ff)',
					}),
					(0, t.jsx)('path', {
						d: 'M46.0391 23.1909C46.041 22.1616 46.3986 21.1648 47.0508 20.3702C47.7031 19.5756 48.6098 19.0322 49.6165 18.8326C50.6232 18.633 51.6679 18.7894 52.5725 19.2753C53.4772 19.7613 54.186 20.5466 54.5783 21.4977C54.9707 22.4488 55.0223 23.5068 54.7243 24.4918C54.4264 25.4767 53.7973 26.3277 52.9442 26.8998C52.0912 27.4719 51.0668 27.7299 50.0454 27.6297C49.024 27.5296 48.0688 27.0775 47.3424 26.3505C46.9287 25.9357 46.6006 25.4431 46.377 24.9009C46.1533 24.3587 46.0385 23.7776 46.0391 23.1909Z',
						fill: 'var(--text-primary, #f4f6ff)',
					}),
				],
			});
		}
		function x(e) {
			let { title: n, rest: r } = f(e, 'Quantstamp'),
				i = 'var(--text-primary, #f4f6ff)';
			return (0, t.jsxs)('svg', {
				viewBox: '0 0 162 28',
				fill: 'none',
				xmlns: 'http://www.w3.org/2000/svg',
				'aria-label': n,
				role: 'img',
				...r,
				children: [
					(0, t.jsx)('path', {
						d: 'M63.787 22.0278H60.3455V20.909C59.7222 21.6187 58.7105 22.2639 57.291 22.2639C54.9683 22.2639 53.4404 20.6716 53.4404 18.1978V10.6914H56.882V17.3822C56.882 18.5229 57.3763 19.2533 58.495 19.2533C59.4422 19.2533 60.3455 18.5862 60.3455 17.2531V10.6914H63.787V22.029V22.0278Z',
						fill: i,
					}),
					(0, t.jsx)('path', {
						d: 'M65.3145 18.8665C65.3145 16.5218 67.2939 15.5747 69.6812 15.2314L72.2195 14.8017V14.6081C72.2195 13.7693 71.7678 13.2312 70.6491 13.2312C69.6593 13.2312 69.1432 13.661 68.9277 14.5862L65.6358 14.0919C66.1301 12.0917 67.916 10.4568 70.7988 10.4568C73.6816 10.4568 75.5965 11.8117 75.5965 14.4584V18.8251C75.5965 19.4058 75.812 19.5787 76.4791 19.4923V22.0305C74.4997 22.3531 73.1666 21.9879 72.5859 21.0189C71.8324 21.7931 70.7148 22.2448 69.2296 22.2448C66.9494 22.2448 65.3145 20.8679 65.3145 18.8677V18.8665ZM72.2195 17.0161L70.24 17.3813C69.3367 17.5323 68.6696 17.833 68.6696 18.6291C68.6696 19.3389 69.2077 19.726 70.0245 19.726C71.1652 19.726 72.2195 19.1234 72.2195 17.962V17.0149V17.0161Z',
						fill: i,
					}),
					(0, t.jsx)('path', {
						d: 'M78.2771 10.6917H81.7187V11.8324C82.342 11.1008 83.3962 10.4556 84.8376 10.4556C87.1604 10.4556 88.6237 12.0686 88.6237 14.5436V22.0305H85.1821V15.5333C85.1821 14.3926 84.7086 13.5538 83.5898 13.5538C82.6427 13.5538 81.7174 14.221 81.7174 15.554V22.0293H78.2759V10.6917H78.2771Z',
						fill: i,
					}),
					(0, t.jsx)('path', {
						d: 'M91.3711 13.5316H89.9297V10.6914H91.3711V7.55176H94.77V10.6926H96.9857V13.5328H94.77V18.1151C94.77 19.0622 95.2643 19.2338 96.125 19.2338C96.534 19.2338 96.7276 19.2119 97.1147 19.1693V21.9876C96.5121 22.074 95.8669 22.1385 95.05 22.1385C92.597 22.1385 91.3711 21.3205 91.3711 18.9977V13.534V13.5316Z',
						fill: i,
					}),
					(0, t.jsx)('path', {
						d: 'M100.192 18.0484C101.117 19.0601 102.58 19.6615 103.806 19.6615C104.71 19.6615 105.463 19.3608 105.463 18.7582C105.463 18.0058 104.71 17.9194 102.903 17.5968C101.032 17.2316 99.0305 16.7361 99.0305 14.2843C99.0305 11.9822 101.075 10.4543 103.871 10.4543C105.915 10.4543 107.721 11.2286 108.669 12.261L106.947 14.4766C106.087 13.5733 104.968 13.0778 103.849 13.0778C103.01 13.0778 102.472 13.4004 102.472 13.9166C102.472 14.5399 103.139 14.6263 104.516 14.8844C106.56 15.2935 108.84 15.7877 108.84 18.3479C108.84 20.9081 106.56 22.263 103.677 22.263C101.698 22.263 99.4603 21.5959 98.4072 20.37L100.193 18.0472L100.192 18.0484Z',
						fill: i,
					}),
					(0, t.jsx)('path', {
						d: 'M111.206 13.5316H109.765V10.6914H111.206V7.55176H114.605V10.6926H116.821V13.5328H114.605V18.1151C114.605 19.0622 115.099 19.2338 115.96 19.2338C116.369 19.2338 116.563 19.2119 116.95 19.1693V21.9876C116.347 22.074 115.702 22.1385 114.885 22.1385C112.433 22.1385 111.206 21.3205 111.206 18.9977V13.534V13.5316Z',
						fill: i,
					}),
					(0, t.jsx)('path', {
						d: 'M118.35 18.8665C118.35 16.5218 120.33 15.5747 122.717 15.2314L125.255 14.8017V14.6081C125.255 13.7693 124.804 13.2312 123.685 13.2312C122.695 13.2312 122.179 13.661 121.964 14.5862L118.672 14.0919C119.166 12.0917 120.952 10.4568 123.835 10.4568C126.717 10.4568 128.632 11.8117 128.632 14.4584V18.8251C128.632 19.4058 128.848 19.5787 129.515 19.4923V22.0305C127.536 22.3531 126.203 21.9879 125.621 21.0189C124.868 21.7931 123.749 22.2448 122.264 22.2448C119.984 22.2448 118.349 20.8679 118.349 18.8677L118.35 18.8665ZM125.255 17.0161L123.276 17.3813C122.373 17.5323 121.705 17.833 121.705 18.6291C121.705 19.3389 122.244 19.726 123.06 19.726C124.201 19.726 125.254 19.1234 125.254 17.962V17.0149L125.255 17.0161Z',
						fill: i,
					}),
					(0, t.jsx)('path', {
						d: 'M134.555 22.0281H131.113V10.6917H134.555V11.8324C135.178 11.1008 136.212 10.4556 137.653 10.4556C139.008 10.4556 140.127 11.0363 140.772 12.0041C141.417 11.2943 142.536 10.4556 144.278 10.4556C146.58 10.4556 148.108 12.0686 148.108 14.5436V22.0305H144.666V15.5333C144.666 14.3926 144.215 13.5538 143.118 13.5538C142.215 13.5538 141.332 14.221 141.332 15.554V22.0293H137.89V15.5321C137.89 14.3914 137.46 13.5526 136.342 13.5526C135.439 13.5526 134.556 14.2197 134.556 15.5528V22.0281H134.555Z',
						fill: i,
					}),
					(0, t.jsx)('path', {
						d: 'M153.265 20.9105V25.8154H149.824V10.6917H153.265V11.8324C153.911 11.0156 154.987 10.4556 156.342 10.4556C159.461 10.4556 161.225 13.1229 161.225 16.3721C161.225 19.6213 159.461 22.2667 156.342 22.2667C154.987 22.2667 153.911 21.7079 153.265 20.9117V20.9105ZM153.243 16.6728C153.243 18.3723 154.169 19.3401 155.459 19.3401C156.965 19.3401 157.761 18.1142 157.761 16.3709C157.761 14.6276 156.965 13.4017 155.459 13.4017C154.169 13.4017 153.243 14.3476 153.243 16.069V16.6716V16.6728Z',
						fill: i,
					}),
					(0, t.jsxs)('g', {
						children: [
							(0, t.jsx)('path', {
								d: 'M37.5288 8.22388C34.327 11.4256 34.3283 16.6166 37.5288 19.8171C40.7305 23.0188 45.9203 23.0188 49.122 19.8171C52.3237 16.6154 52.3237 11.4256 49.122 8.22388C45.9215 5.02336 40.7293 5.02336 37.5288 8.22388ZM46.6957 17.3908C44.8343 19.2522 41.8176 19.2522 39.955 17.3908C38.0936 15.5294 38.0936 12.5127 39.955 10.6501C41.8164 8.78753 44.8343 8.78875 46.6957 10.6501C48.5571 12.5115 48.5571 15.5294 46.6957 17.3908Z',
								fill: i,
							}),
							(0, t.jsx)('path', {
								d: 'M44.5095 12.8286L42.1035 15.2346L49.603 22.7341L52.009 20.3281L44.5095 12.8286Z',
								fill: i,
							}),
						],
					}),
					(0, t.jsx)('path', {
						d: 'M25.2737 13.9992C25.2737 11.807 24.6432 9.65035 23.4378 7.81403L27.8783 3.35056L24.5505 0L20.11 4.46347C16.3692 2.00831 11.5293 2.00831 7.78845 4.46347L3.33791 0L0 3.35056L4.44043 7.81403C1.996 11.5777 1.996 16.4324 4.44043 20.1961L0 24.6494L3.33791 28L7.77833 23.5365C11.5191 25.9917 16.3591 25.9917 20.0999 23.5365L24.5404 28L27.8783 24.6494L23.4378 20.186C24.6432 18.3497 25.2855 16.2048 25.2737 14.0008V13.9992ZM7.33159 13.9992C7.33159 11.2911 8.96009 8.84601 11.4618 7.83764C13.9636 6.82758 16.8311 7.43631 18.7007 9.38729C20.5703 11.3383 21.076 14.242 19.9634 16.7089L15.6039 12.3247L12.2761 15.6753L16.6356 20.0595C14.5941 20.9768 12.2188 20.8048 10.3374 19.5772C8.46783 18.3497 7.33159 16.2486 7.33159 14.0008V13.9992Z',
						fill: i,
					}),
				],
			});
		}
		function b(e) {
			let { title: n, rest: r } = f(e, 'Wintermute');
			return (0, t.jsxs)('svg', {
				viewBox: '0 0 182 28',
				fill: 'none',
				xmlns: 'http://www.w3.org/2000/svg',
				'aria-label': n,
				role: 'img',
				...r,
				children: [
					(0, t.jsx)('path', {
						fillRule: 'evenodd',
						clipRule: 'evenodd',
						d: 'M23.3407 0.243096L24.3598 0L32.3324 15.7598L32.0844 16.4886L16.3988 24L15.9336 24L0.247958 16.4891L0 15.7602L7.97258 0.000480536L8.99165 0.243577V14.718L15.7886 8.03381L16.5438 8.0338L23.3407 14.7175V0.243096ZM24.0981 16.5409L18.8908 21.6124L29.4807 16.5412L24.0981 16.5409ZM30.9758 15.4643L24.4178 15.4639V2.50063L30.9758 15.4643ZM16.7047 22.2381L23.1093 16.0005L16.7047 9.70262V22.2381ZM15.6277 9.70267V22.2381L9.22308 16.001L15.6277 9.70267ZM7.91459 15.4644L1.35652 15.4648L7.91459 2.50111V15.4644ZM2.85182 16.5417L13.4414 21.6125L8.23424 16.5414L2.85182 16.5417Z',
						fill: '#00F554',
					}),
					(0, t.jsx)('text', {
						x: '44',
						y: '19.5',
						fill: '#00F554',
						fontFamily: 'Inter, Arial, sans-serif',
						fontSize: '18',
						fontWeight: '700',
						letterSpacing: '0',
						children: 'Wintermute',
					}),
				],
			});
		}
		function j({ children: e, content: n }) {
			return (0, t.jsxs)('span', {
				className: 'group/tooltip relative inline-flex items-center',
				children: [
					e,
					(0, t.jsx)('span', {
						role: 'tooltip',
						className:
							'pointer-events-none absolute left-1/2 top-full z-50 mt-2 hidden w-max max-w-[min(220px,calc(100vw-2rem))] -translate-x-1/2 rounded-md border border-white/20 bg-[color:var(--bg-deep)] px-2.5 py-1.5 text-[11px] font-normal normal-case leading-snug tracking-normal text-ink-2 shadow-xl group-hover/tooltip:block group-focus-within/tooltip:block',
						children: n,
					}),
				],
			});
		}
		function w({ content: e }) {
			return (0, t.jsx)(j, {
				content: e,
				children: (0, t.jsx)('span', {
					tabIndex: 0,
					'aria-label': 'string' == typeof e ? e : 'More information',
					role: 'img',
					className:
						'inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/25 bg-white/10 text-[10px] font-semibold leading-none text-ink-2 transition-colors hover:border-white/35 hover:bg-white/15 hover:text-white',
					children: '?',
				}),
			});
		}
		function v({
			label: e,
			value: n,
			hint: r,
			tooltip: i,
			accent: o = 'default',
			className: a = '',
		}) {
			let l =
				'purple' === o
					? 'text-giveth-soft'
					: 'teal' === o
						? 'text-match'
						: 'neon' === o
							? 'text-neon'
							: 'tik' === o
								? 'text-tik-soft'
								: 'finn' === o
									? 'text-finn-soft'
									: 'text-ink';
			return (0, t.jsxs)('div', {
				className: `glass rounded-xl px-4 py-3 ${a}`,
				children: [
					(0, t.jsxs)('div', {
						className:
							'flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-ink-3',
						children: [
							(0, t.jsx)('span', { children: e }),
							i ? (0, t.jsx)(w, { content: i }) : null,
						],
					}),
					(0, t.jsx)('div', {
						className: `mt-1 text-2xl font-semibold tracking-tight tnum ${l}`,
						children: n,
					}),
					r
						? (0, t.jsx)('div', {
								className: 'mt-1 text-[11px] text-ink-3 tnum',
								children: r,
							})
						: null,
				],
			});
		}
		function y({
			checked: e,
			onChange: n,
			label: r,
			description: i,
			disabled: o,
			tone: a = 'default',
		}) {
			return (0, t.jsxs)('button', {
				type: 'button',
				role: 'switch',
				'aria-checked': e,
				disabled: o,
				onClick: () => n(!e),
				className: `group flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${e ? { default: 'border-giveth/45 bg-giveth/8', tik: 'border-tik/45 bg-tik/10', finn: 'border-finn/45 bg-finn/10' }[a] : 'border-white/15 bg-white/8 hover:bg-white/12 hover:border-white/20'} ${o ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`,
				children: [
					(0, t.jsx)('span', {
						'aria-hidden': !0,
						className: `mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${e ? { default: 'bg-giveth', tik: 'bg-tik', finn: 'bg-finn' }[a] : 'bg-white/15 group-hover:bg-white/20'}`,
						children: (0, t.jsx)('span', {
							className: `h-4 w-4 rounded-full bg-white transition-transform ${e ? 'translate-x-4' : 'translate-x-0.5'}`,
						}),
					}),
					(0, t.jsxs)('span', {
						className: 'min-w-0 flex-1',
						children: [
							(0, t.jsx)('span', {
								className: 'block text-sm font-medium text-ink',
								children: r,
							}),
							i
								? (0, t.jsx)('span', {
										className:
											'mt-0.5 block text-xs text-ink-3 leading-snug',
										children: i,
									})
								: null,
						],
					}),
				],
			});
		}
		function C({ value: e, onChange: n, options: r, ariaLabel: i }) {
			return (0, t.jsx)('div', {
				role: 'radiogroup',
				'aria-label': i,
				className: 'flex flex-wrap gap-1.5',
				children: r.map(r => {
					let i = r.value === e;
					return (0, t.jsxs)(
						'button',
						{
							type: 'button',
							role: 'radio',
							'aria-checked': i,
							onClick: () => n(r.value),
							className: `flex-1 min-w-[7rem] rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${i ? 'border-giveth/55 bg-giveth/14 text-white shadow-[0_0_0_1px_rgba(255,59,58,0.25)]' : 'border-white/15 bg-white/8 text-ink-2 hover:bg-white/12'}`,
							children: [
								(0, t.jsx)('span', {
									className: 'block',
									children: r.label,
								}),
								r.hint
									? (0, t.jsx)('span', {
											className:
												'mt-0.5 block text-[10px] font-normal text-ink-3',
											children: r.hint,
										})
									: null,
							],
						},
						r.value,
					);
				}),
			});
		}
		function N({ children: e, tone: n = 'neutral', size: r = 'sm' }) {
			return (0, t.jsx)('span', {
				className: `inline-flex items-center gap-1 rounded-full border font-medium ${{ neutral: 'border-white/15 bg-white/8 text-ink-2', purple: 'border-giveth/45 bg-giveth/12 text-giveth-soft', teal: 'border-match/40 bg-match/12 text-match-soft', neon: 'border-neon/40 bg-neon/12 text-neon', tik: 'border-tik/45 bg-tik/12 text-tik-soft', finn: 'border-finn/45 bg-finn/12 text-finn-soft', rose: 'border-badge/45 bg-badge/12 text-badge', danger: 'border-danger/45 bg-danger/15 text-danger' }[n]} ${{ sm: 'text-[11px] px-2 py-0.5', xs: 'text-[10px] px-1.5 py-0.5' }[r]}`,
				children: e,
			});
		}
		function k({
			title: e,
			subtitle: n,
			right: r,
			children: i,
			className: o = '',
		}) {
			return (0, t.jsxs)('section', {
				className: `glass rounded-2xl ${o}`,
				children: [
					(e || r) &&
						(0, t.jsxs)('header', {
							className:
								'flex items-start justify-between gap-3 px-4 pt-3.5 pb-2.5',
							children: [
								(0, t.jsxs)('div', {
									className: 'min-w-0',
									children: [
										e
											? (0, t.jsx)('h2', {
													className:
														'text-sm font-semibold tracking-tight text-ink',
													children: e,
												})
											: null,
										n
											? (0, t.jsx)('p', {
													className:
														'mt-0.5 text-xs text-ink-3 leading-snug',
													children: n,
												})
											: null,
									],
								}),
								r
									? (0, t.jsx)('div', {
											className: 'shrink-0',
											children: r,
										})
									: null,
							],
						}),
					(0, t.jsx)('div', { className: 'px-4 pb-4', children: i }),
				],
			});
		}
		function S({
			value: e,
			onChange: n,
			min: r = 0,
			max: i,
			step: o = 0.001,
			unit: a,
			hint: l,
			label: s,
			tooltip: c,
			disabled: d = !1,
		}) {
			return (0, t.jsxs)('label', {
				className: 'block',
				children: [
					s
						? (0, t.jsxs)('span', {
								className:
									'mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-ink-3',
								children: [
									(0, t.jsx)('span', { children: s }),
									c ? (0, t.jsx)(w, { content: c }) : null,
								],
							})
						: null,
					(0, t.jsxs)('div', {
						className: `flex items-center gap-2 rounded-lg border border-white/15 px-2.5 py-1.5 focus-within:border-giveth/55 ${d ? 'bg-white/[0.04] opacity-55' : 'bg-white/8'}`,
						children: [
							(0, t.jsx)('input', {
								type: 'number',
								inputMode: 'decimal',
								value: Number.isFinite(e) ? e : '',
								disabled: d,
								onChange: e => {
									let t = Number(e.target.value);
									!d && Number.isFinite(t) && n?.(t);
								},
								min: r,
								max: i,
								step: o,
								className: `w-full bg-transparent text-sm tnum outline-none ${d ? 'cursor-not-allowed text-ink-3' : 'text-white'}`,
							}),
							a
								? (0, t.jsx)('span', {
										className:
											'text-[11px] uppercase tracking-wider text-ink-3',
										children: a,
									})
								: null,
						],
					}),
					l
						? (0, t.jsx)('div', {
								className: 'mt-1 text-[11px] text-ink-3 tnum',
								children: l,
							})
						: null,
				],
			});
		}
		let M = ['Security', 'Evolutionary', 'Rewarding', 'Back'],
			_ = new Set(['evolutionary', 'back']);
		function D({ comparisonOn: e, onToggleComparison: r }) {
			let i = (function (e) {
					let [t, r] = n.useState(0),
						[i, o] = n.useState(0),
						[a, l] = n.useState(!1);
					n.useEffect(() => {
						let n = i === (e[t] ?? '').length && !a,
							s = 0 === i && a,
							c = window.setTimeout(
								() => {
									if (n) return void l(!0);
									if (s) {
										l(!1), r(t => (t + 1) % e.length);
										return;
									}
									o(e => e + (a ? -1 : 1));
								},
								n ? 1250 : s ? 180 : a ? 44 : 72,
							);
						return () => window.clearTimeout(c);
					}, [a, i, t, e]);
					let s = e[t] ?? '',
						c = _.has(s.toLowerCase()) ? 'green' : 'red';
					return { text: s.slice(0, i), tone: c };
				})(M),
				o = 'green' === i.tone ? 'text-neon' : 'text-dao-red',
				a = 'green' === i.tone ? 'text-neon/70' : 'text-dao-red/70';
			return (0, t.jsx)('header', {
				className:
					'sticky top-0 z-40 border-b border-white/15 bg-[color:var(--bg-deep)]/96 backdrop-blur-xl',
				children: (0, t.jsxs)('div', {
					className:
						'mx-auto flex max-w-[1480px] items-center justify-between gap-3 px-5 py-3 sm:gap-6',
					children: [
						(0, t.jsxs)('div', {
							className:
								'flex min-w-0 items-center gap-3 sm:gap-4',
							children: [
								(0, t.jsx)(p, { className: 'h-7 w-auto' }),
								(0, t.jsx)('span', {
									className:
										'hidden h-6 w-px bg-white/15 md:block',
								}),
								(0, t.jsxs)('div', {
									className:
										'flex min-w-0 flex-col leading-tight',
									children: [
										(0, t.jsxs)('div', {
											className:
												'flex items-baseline gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-3 sm:text-[11px] sm:tracking-[0.16em]',
											children: [
												(0, t.jsx)('span', {
													children: 'THEDAO IS',
												}),
												(0, t.jsxs)('span', {
													className: `inline-flex min-w-[5.8rem] sm:min-w-[7.6rem] ${o}`,
													'aria-label': `TheDAO is ${i.text}`,
													children: [
														i.text,
														(0, t.jsx)('span', {
															className: `ml-0.5 animate-pulse ${a}`,
															'aria-hidden': !0,
															children: '|',
														}),
													],
												}),
											],
										}),
										(0, t.jsx)('span', {
											className:
												'hidden text-[11px] text-ink-3 md:inline',
											children:
												'Ethereum Security QF Round',
										}),
									],
								}),
							],
						}),
						(0, t.jsxs)('div', {
							className: 'flex items-center gap-2 sm:gap-3',
							children: [
								(0, t.jsx)('span', {
									className:
										'hidden text-[11px] uppercase tracking-[0.18em] text-ink-3 md:inline',
									children: 'Powered by',
								}),
								(0, t.jsx)(m.default, {
									href: 'https://giveth.io',
									target: '_blank',
									rel: 'noreferrer',
									'aria-label': 'Visit Giveth',
									className: 'hidden sm:inline-flex',
									children: (0, t.jsx)(g, {
										className: 'h-5 w-auto',
									}),
								}),
								(0, t.jsx)('span', {
									className:
										'hidden h-6 w-px bg-white/15 lg:block',
								}),
								(0, t.jsx)('span', {
									className:
										'hidden h-6 w-px bg-white/15 sm:block',
								}),
								(0, t.jsxs)('button', {
									type: 'button',
									onClick: () => r(!e),
									'aria-label': e
										? 'Hide scenario comparison'
										: 'Show scenario comparison',
									className: `inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${e ? 'border-dao-red/55 bg-dao-red/12 text-white' : 'border-white/15 bg-white/8 text-ink-2 hover:bg-white/16 hover:text-white'}`,
									'aria-pressed': e,
									children: [
										(0, t.jsx)(E, { active: e }),
										(0, t.jsx)(j, {
											content: e
												? 'Return to a single scenario view.'
												: 'Compare two matching configurations side by side.',
											children: (0, t.jsx)('span', {
												className: 'hidden sm:inline',
												children: e
													? 'Hide comparison'
													: 'Compare scenarios',
											}),
										}),
									],
								}),
							],
						}),
					],
				}),
			});
		}
		function E({ active: e }) {
			return (0, t.jsxs)('svg', {
				width: '14',
				height: '14',
				viewBox: '0 0 14 14',
				'aria-hidden': !0,
				fill: 'none',
				stroke: 'currentColor',
				strokeWidth: '1.5',
				children: [
					(0, t.jsx)('path', { d: 'M3 2v10M11 2v10' }),
					(0, t.jsx)('path', {
						d: 'M3 4h3M3 8h3M11 6h-3M11 10h-3',
						strokeLinecap: 'round',
					}),
					e
						? (0, t.jsx)('circle', {
								cx: '7',
								cy: '7',
								r: '1.4',
								fill: 'currentColor',
								stroke: 'none',
							})
						: null,
				],
			});
		}
		function L(e, t) {
			return Number.isFinite(e)
				? t?.compact && Math.abs(e) >= 1e4
					? '$' +
						e.toLocaleString('en-US', {
							notation: 'compact',
							maximumFractionDigits: 2,
						})
					: e.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD',
							maximumFractionDigits: 2,
						})
				: '—';
		}
		function P(e, t = 3) {
			return Number.isFinite(e)
				? `${e.toLocaleString('en-US', { maximumFractionDigits: t, minimumFractionDigits: 0 })} ETH`
				: '—';
		}
		function O(e) {
			return Number.isFinite(e)
				? e.toLocaleString('en-US', { maximumFractionDigits: 0 })
				: '—';
		}
		function A({ dataset: e, config: n, onConfigChange: r }) {
			let i = 2100 * n.matchingPoolEth;
			return (0, t.jsxs)('section', {
				className: 'relative overflow-hidden',
				children: [
					(0, t.jsx)('div', {
						className: 'grid-overlay absolute inset-0 -z-10',
						'aria-hidden': !0,
					}),
					(0, t.jsxs)('div', {
						className: 'mx-auto max-w-[1480px] px-5 pt-8 pb-4',
						children: [
							(0, t.jsxs)('div', {
								className:
									'grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-end',
								children: [
									(0, t.jsxs)('div', {
										children: [
											(0, t.jsx)('h1', {
												className:
													'font-display text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.05] tracking-tight text-white',
												children:
													"TheDAO's Ethereum Security QF Round",
											}),
											(0, t.jsx)('p', {
												className:
													'mt-3 max-w-2xl text-sm text-ink-2 leading-relaxed',
												children:
													'TheDAO Security Fund wants to see Ethereum become safer to use than banks. To achieve this mission we run DAO-style rounds to fund Ethereum security initiatives. This round was the first of many.',
											}),
											(0, t.jsxs)('p', {
												className:
													'mt-3 max-w-2xl text-sm text-ink-2 leading-relaxed',
												children: [
													'This dashboard lets you explore how different QF settings would have reshaped matching outcomes for the first Ethereum Security QF Round.',
													" To learn more about TheDAO's mission visit",
													' ',
													(0, t.jsx)('a', {
														href: 'https://thedao.fund',
														target: '_blank',
														rel: 'noreferrer',
														className:
															'font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white',
														children: 'thedao.fund',
													}),
													' ',
													'and follow us on X:',
													' ',
													(0, t.jsx)('a', {
														href: 'https://x.com/thedaofund',
														target: '_blank',
														rel: 'noreferrer',
														className:
															'font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white',
														children: '@thedaofund',
													}),
													'.',
												],
											}),
											(0, t.jsxs)('div', {
												className:
													'mt-5 flex flex-wrap items-center gap-x-5 gap-y-3',
												children: [
													(0, t.jsx)('span', {
														className:
															'text-[10px] uppercase tracking-[0.18em] text-ink-3',
														children:
															'With Support From',
													}),
													(0, t.jsx)('a', {
														href: 'https://www.wintermute.com/',
														target: '_blank',
														rel: 'noreferrer',
														'aria-label':
															'Visit Wintermute',
														className:
															'inline-flex opacity-90 transition-opacity hover:opacity-100',
														children: (0, t.jsx)(
															b,
															{
																className:
																	'h-6 w-auto',
															},
														),
													}),
													(0, t.jsx)('a', {
														href: 'https://quantstamp.com/',
														target: '_blank',
														rel: 'noreferrer',
														'aria-label':
															'Visit Quantstamp',
														className:
															'inline-flex opacity-90 transition-opacity hover:opacity-100',
														children: (0, t.jsx)(
															x,
															{
																className:
																	'h-5 w-auto',
															},
														),
													}),
												],
											}),
											(0, t.jsx)('p', {
												className:
													'mt-2 max-w-2xl text-xs text-ink-3 leading-relaxed',
											}),
										],
									}),
									(0, t.jsxs)('div', {
										className:
											'glass-strong rounded-2xl p-4',
										children: [
											(0, t.jsx)('div', {
												className:
													'mb-2 text-[10px] uppercase tracking-[0.18em] text-ink-3',
												children: 'Round configuration',
											}),
											(0, t.jsxs)('div', {
												className:
													'grid grid-cols-2 gap-3',
												children: [
													(0, t.jsx)(S, {
														label: 'Matching pool',
														tooltip:
															'Total ETH available to match donations with QF.',
														value: n.matchingPoolEth,
														onChange: e =>
															r({
																...n,
																matchingPoolEth:
																	Math.max(
																		0,
																		e,
																	),
															}),
														step: 0.1,
														min: 0,
														unit: 'ETH',
														hint: `≈ ${L(i, { compact: !0 })} @ ${L(2100)}/ETH`,
													}),
													(0, t.jsx)(S, {
														label: 'MAX MATCHING',
														tooltip:
															'The maximum % of total matching that any one project can get.',
														value:
															Math.round(
																1e3 *
																	n.capPercent,
															) / 10,
														onChange: e =>
															r({
																...n,
																capPercent:
																	Math.max(
																		0,
																		Math.min(
																			100,
																			e,
																		),
																	) / 100,
															}),
														step: 0.5,
														min: 0,
														max: 100,
														unit: '%',
														hint:
															n.capPercent > 0
																? `≈ ${L(i * n.capPercent, { compact: !0 })} per project`
																: 'No cap',
													}),
													(0, t.jsx)(S, {
														label: 'MIN MATCHING',
														tooltip:
															"Any projects that would have gotten less than the minimum amount after the max matching is applied, are raised to this 'floor', with the difference taken proportionally from all other projects below the max matching.",
														value: n.floorEth,
														onChange: e =>
															r({
																...n,
																floorEth:
																	Math.max(
																		0,
																		e,
																	),
															}),
														step: 0.001,
														min: 0,
														unit: 'ETH',
														hint:
															n.floorEth > 0
																? `≈ ${L(2100 * n.floorEth, { compact: !0 })} per project`
																: 'No floor',
													}),
													(0, t.jsx)(S, {
														label: 'Min donation',
														tooltip:
															'Donations below this USD threshold are excluded from matching calculations.',
														value: n.minDonationUsd,
														step: 0.5,
														min: 0,
														unit: 'USD',
														disabled: !0,
													}),
												],
											}),
										],
									}),
								],
							}),
							(0, t.jsxs)('div', {
								className:
									'mt-6 grid grid-cols-2 gap-3 md:grid-cols-4',
								children: [
									(0, t.jsx)(v, {
										label: 'Matching pool',
										value: P(n.matchingPoolEth, 2),
										hint: L(i, { compact: !1 }),
										tooltip:
											'Total matching budget used by the simulator. Adjust this in the top right.',
									}),
									(0, t.jsx)(v, {
										label: 'Projects in QF Round',
										value: O(e.projects.length),
										hint: '',
										tooltip:
											'Projects included in the loaded QF Round dataset.',
									}),
									(0, t.jsx)(v, {
										label: 'Unique donors',
										value: O(e.donors.length),
										hint: '',
										tooltip:
											'The number of unique addresses that made donations in the QF Round.',
									}),
									(0, t.jsx)(v, {
										label: 'Total donated',
										value: L(e.totalUSD, { compact: !0 }),
										hint: `${(function (e, t = 1) {
											return Number.isFinite(e)
												? `${e.toLocaleString('en-US', { maximumFractionDigits: t, minimumFractionDigits: t })}%`
												: '—';
										})(
											(e.totalUSD / Math.max(i, 1)) * 100,
										)} of pool`,
										tooltip:
											'Direct donations in the dataset before simulated matching.',
									}),
								],
							}),
						],
					}),
				],
			});
		}
		function U(e, t) {
			switch (t) {
				case 'rankA':
					return e.rankA;
				case 'name':
					return e.projectName;
				case 'contributors':
					return e.contributorCount;
				case 'totalUsd':
					return e.totalDonationsUSD;
				case 'tik':
					return e.tikReceived;
				case 'matchA':
					return e.matchA;
				case 'wintermuteA':
					return e.wintermuteA;
				case 'matchB':
					return e.matchB;
				case 'wintermuteB':
					return e.wintermuteB;
				case 'deltaPct':
					return e.deltaPct;
			}
		}
		function $({ primary: e, secondary: r }) {
			let [i, o] = n.useState(''),
				[a, l] = n.useState('rankA'),
				[s, c] = n.useState('asc'),
				d = n.useMemo(
					() =>
						(function (e, t) {
							let n = new Map();
							if (t)
								for (let e of t.projects)
									n.set(e.projectName, e);
							let r = e.totalMatchedUSD,
								i = t?.totalMatchedUSD ?? 0;
							return e.projects.map(e => {
								let o = t
										? (n.get(e.projectName) ?? null)
										: null,
									a = r > 0 ? (e.matchingUSD / r) * 2e5 : 0,
									l =
										o && i > 0
											? (o.matchingUSD / i) * 2e5
											: null,
									s = null;
								return (
									o &&
										(s =
											0 === e.matchingUSD &&
											0 === o.matchingUSD
												? 0
												: 0 === e.matchingUSD
													? 1 / 0
													: ((o.matchingUSD -
															e.matchingUSD) /
															e.matchingUSD) *
														100),
									{
										projectName: e.projectName,
										contributorCount: e.contributorCount,
										totalDonationsUSD: e.totalDonationsUSD,
										tikReceived: e.tikReceived,
										matchA: e.matchingUSD,
										ethA: e.matchingEth,
										rankA: e.rank,
										wintermuteA: a,
										wintermuteAEth: a / 2100,
										matchB: o?.matchingUSD ?? null,
										ethB: o?.matchingEth ?? null,
										wintermuteB: l,
										wintermuteBEth:
											null == l ? null : l / 2100,
										rankB: o?.rank ?? null,
										deltaPct: s,
									}
								);
							});
						})(e, r),
					[e, r],
				),
				u = n.useMemo(
					() =>
						[
							...(i.trim()
								? d.filter(e =>
										e.projectName
											.toLowerCase()
											.includes(i.toLowerCase()),
									)
								: d),
						].sort((e, t) =>
							(function (e, t, n, r) {
								let i = 'asc' === r ? 1 : -1,
									o = U(e, n),
									a = U(t, n);
								if (
									'string' == typeof o &&
									'string' == typeof a
								)
									return o.localeCompare(a) * i;
								let l = null == o ? -1 / 0 : o,
									s = null == a ? -1 / 0 : a;
								return l !== s &&
									(Number.isFinite(l) || Number.isFinite(s))
									? (l < s ? -1 : 1) * i
									: 0;
							})(e, t, a, s),
						),
					[d, i, a, s],
				),
				m = n.useMemo(() => {
					let e = 0;
					for (let t of d)
						t.matchA > e && (e = t.matchA),
							null != t.matchB && t.matchB > e && (e = t.matchB);
					return e || 1;
				}, [d]),
				h = e => {
					a === e
						? c(e => ('asc' === e ? 'desc' : 'asc'))
						: (l(e), c('name' === e ? 'asc' : 'desc'));
				};
			return (0, t.jsxs)('div', {
				className:
					'glass flex h-[64dvh] lg:h-full flex-col rounded-2xl',
				children: [
					(0, t.jsxs)('header', {
						className:
							'flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-white/15',
						children: [
							(0, t.jsx)('div', {
								className: 'min-w-0',
								children: (0, t.jsxs)('div', {
									className: 'flex items-center gap-2',
									children: [
										(0, t.jsx)('h2', {
											className:
												'text-sm font-semibold tracking-tight',
											children: r
												? 'Matching Results Scenario A versus Scenario B'
												: 'Scenario A Matching Results',
										}),
										(0, t.jsx)(w, {
											content:
												'Projected matching outcomes for the currently selected scenario settings.',
										}),
									],
								}),
							}),
							(0, t.jsxs)('label', {
								className: 'relative w-full max-w-[260px]',
								children: [
									(0, t.jsx)('span', {
										className: 'sr-only',
										children: 'Search projects',
									}),
									(0, t.jsx)('input', {
										type: 'search',
										value: i,
										onChange: e => o(e.target.value),
										placeholder: 'Search project…',
										className:
											'w-full rounded-lg border border-white/15 bg-white/8 px-3 py-1.5 text-sm text-white placeholder:text-ink-3 outline-none focus:border-giveth/50',
									}),
								],
							}),
						],
					}),
					(0, t.jsx)('div', {
						className: r
							? 'thin-scroll min-h-0 flex-1 overflow-auto max-h-[64dvh]'
							: 'relative min-h-0 flex-1',
						children: (0, t.jsx)('div', {
							className: r
								? 'contents'
								: 'thin-scroll absolute inset-0 overflow-auto',
							children: (0, t.jsxs)('table', {
								className:
									'w-full table-fixed border-separate border-spacing-0 text-left text-sm',
								children: [
									(0, t.jsxs)('colgroup', {
										children: [
											(0, t.jsx)('col', {
												className: 'w-11',
											}),
											(0, t.jsx)('col', {
												className: r
													? 'w-[19%]'
													: 'w-[24%]',
											}),
											(0, t.jsx)('col', {
												className: 'w-20',
											}),
											(0, t.jsx)('col', {
												className: 'w-24',
											}),
											(0, t.jsx)('col', {
												className: 'w-24',
											}),
											(0, t.jsx)('col', {
												className: 'w-28',
											}),
											(0, t.jsx)('col', {
												className: 'w-28',
											}),
											r
												? (0, t.jsxs)(t.Fragment, {
														children: [
															(0, t.jsx)('col', {
																className:
																	'w-28',
															}),
															(0, t.jsx)('col', {
																className:
																	'w-28',
															}),
															(0, t.jsx)('col', {
																className:
																	'w-20',
															}),
														],
													})
												: null,
										],
									}),
									(0, t.jsx)('thead', {
										className:
											'sticky top-0 z-10 bg-[color:var(--bg-elevated)]/95 backdrop-blur',
										children: (0, t.jsxs)('tr', {
											className:
												'text-[10px] uppercase tracking-[0.16em] text-ink-3',
											children: [
												(0, t.jsx)(F, {
													label: '#',
													tooltip:
														'Scenario A rank by matching amount.',
													k: 'rankA',
													sortKey: a,
													sortDir: s,
													onSort: h,
													align: 'left',
												}),
												(0, t.jsx)(F, {
													label: 'Project',
													tooltip: 'Project name.',
													k: 'name',
													sortKey: a,
													sortDir: s,
													onSort: h,
												}),
												(0, t.jsx)(F, {
													label: 'Contributors',
													tooltip:
														'Unique donors counted for the project.',
													k: 'contributors',
													sortKey: a,
													sortDir: s,
													onSort: h,
													align: 'right',
												}),
												(0, t.jsx)(F, {
													label: 'Total donations',
													tooltip:
														'Direct donations before simulated matching.',
													k: 'totalUsd',
													sortKey: a,
													sortDir: s,
													onSort: h,
													align: 'right',
												}),
												(0, t.jsx)(F, {
													label: (0, t.jsx)('span', {
														className:
															'inline-flex items-center gap-1 text-tik',
														children:
															' CertiK Tokens',
													}),
													tooltip:
														'TIK token donations received by the project.',
													k: 'tik',
													sortKey: a,
													sortDir: s,
													onSort: h,
													align: 'right',
												}),
												(0, t.jsx)(F, {
													label: r
														? 'Wintermute A'
														: 'Wintermute',
													tooltip:
														"Wintermute's fixed $200,000 contribution allocated by the same percentage as Scenario A matching.",
													k: 'wintermuteA',
													sortKey: a,
													sortDir: s,
													onSort: h,
													align: 'right',
												}),
												(0, t.jsx)(F, {
													label: r
														? 'Match A'
														: 'Matching',
													tooltip:
														'Simulated matching allocated under Scenario A.',
													k: 'matchA',
													sortKey: a,
													sortDir: s,
													onSort: h,
													align: 'right',
												}),
												r
													? (0, t.jsxs)(t.Fragment, {
															children: [
																(0, t.jsx)(F, {
																	label: 'Wintermute B',
																	tooltip:
																		"Wintermute's fixed $200,000 contribution allocated by the same percentage as Scenario B matching.",
																	k: 'wintermuteB',
																	sortKey: a,
																	sortDir: s,
																	onSort: h,
																	align: 'right',
																}),
																(0, t.jsx)(F, {
																	label: 'Match B',
																	tooltip:
																		'Simulated matching allocated under Scenario B.',
																	k: 'matchB',
																	sortKey: a,
																	sortDir: s,
																	onSort: h,
																	align: 'right',
																}),
																(0, t.jsx)(F, {
																	label: 'Δ vs A',
																	tooltip:
																		'Percentage change from Scenario A to Scenario B.',
																	k: 'deltaPct',
																	sortKey: a,
																	sortDir: s,
																	onSort: h,
																	align: 'right',
																}),
															],
														})
													: null,
											],
										}),
									}),
									(0, t.jsxs)('tbody', {
										children: [
											u.map((e, n) => {
												var i;
												let o =
													null == e.deltaPct
														? 'neutral'
														: e.deltaPct > 0.5
															? 'neon'
															: e.deltaPct < -0.5
																? 'rose'
																: 'neutral';
												return (0, t.jsxs)(
													'tr',
													{
														className: `group ${n % 2 == 0 ? '' : 'bg-white/[0.018]'} hover:bg-giveth/8 transition-colors`,
														children: [
															(0, t.jsx)('td', {
																className:
																	'px-3 py-2.5 align-middle',
																children: (0,
																t.jsx)(T, {
																	rank: e.rankA,
																}),
															}),
															(0, t.jsxs)('td', {
																className:
																	'px-2 py-2.5 align-middle',
																children: [
																	(0, t.jsx)(
																		'div',
																		{
																			className:
																				'overflow-hidden text-ellipsis font-medium leading-tight text-ink [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]',
																			title: e.projectName,
																			children:
																				e.projectName,
																		},
																	),
																	null !=
																		e.rankB &&
																	e.rankB !==
																		e.rankA
																		? (0,
																			t.jsxs)(
																				'div',
																				{
																					className:
																						'mt-0.5 text-[10px] text-ink-3',
																					children:
																						[
																							'Scenario B rank: ',
																							(0,
																							t.jsxs)(
																								'span',
																								{
																									className:
																										'tnum text-ink-2',
																									children:
																										[
																											'#',
																											e.rankB,
																										],
																								},
																							),
																							' ',
																							e.rankB <
																							e.rankA
																								? (0,
																									t.jsxs)(
																										'span',
																										{
																											className:
																												'text-neon',
																											children:
																												[
																													'↑',
																													e.rankA -
																														e.rankB,
																												],
																										},
																									)
																								: (0,
																									t.jsxs)(
																										'span',
																										{
																											className:
																												'text-badge',
																											children:
																												[
																													'↓',
																													e.rankB -
																														e.rankA,
																												],
																										},
																									),
																						],
																				},
																			)
																		: null,
																],
															}),
															(0, t.jsx)('td', {
																className:
																	'px-3 py-2.5 text-right align-middle tnum text-ink-2',
																children: O(
																	e.contributorCount,
																),
															}),
															(0, t.jsx)('td', {
																className:
																	'px-3 py-2.5 text-right align-middle tnum text-ink-2',
																children: L(
																	e.totalDonationsUSD,
																	{
																		compact:
																			!0,
																	},
																),
															}),
															(0, t.jsx)('td', {
																className:
																	'px-3 py-2.5 text-right align-middle tnum text-tik-soft',
																children:
																	e.tikReceived >
																	0
																		? Number.isFinite(
																				(i =
																					e.tikReceived),
																			) &&
																			0 !==
																				i
																			? i.toLocaleString(
																					'en-US',
																					{
																						maximumFractionDigits: 2,
																					},
																				)
																			: '—'
																		: (0,
																			t.jsx)(
																				'span',
																				{
																					className:
																						'text-ink-3',
																					children:
																						'—',
																				},
																			),
															}),
															(0, t.jsx)('td', {
																className:
																	'px-3 py-2.5 text-right align-middle',
																children: (0,
																t.jsx)(R, {
																	usd: e.wintermuteA,
																	eth: e.wintermuteAEth,
																	maxMatch:
																		null,
																	tone: 'green',
																}),
															}),
															(0, t.jsx)('td', {
																className:
																	'px-3 py-2.5 text-right align-middle',
																children: (0,
																t.jsx)(R, {
																	usd: e.matchA,
																	eth: e.ethA,
																	maxMatch: m,
																	tone: 'teal',
																}),
															}),
															r
																? (0, t.jsxs)(
																		t.Fragment,
																		{
																			children:
																				[
																					(0,
																					t.jsx)(
																						'td',
																						{
																							className:
																								'px-3 py-2.5 text-right align-middle',
																							children:
																								null ==
																									e.wintermuteB ||
																								null ==
																									e.wintermuteBEth
																									? (0,
																										t.jsx)(
																											'span',
																											{
																												className:
																													'text-ink-3',
																												children:
																													'—',
																											},
																										)
																									: (0,
																										t.jsx)(
																											R,
																											{
																												usd: e.wintermuteB,
																												eth: e.wintermuteBEth,
																												maxMatch:
																													null,
																												tone: 'green',
																											},
																										),
																						},
																					),
																					(0,
																					t.jsx)(
																						'td',
																						{
																							className:
																								'px-3 py-2.5 text-right align-middle',
																							children:
																								(0,
																								t.jsx)(
																									R,
																									{
																										usd:
																											e.matchB ??
																											0,
																										eth:
																											e.ethB ??
																											0,
																										maxMatch:
																											m,
																										tone: 'purple',
																									},
																								),
																						},
																					),
																					(0,
																					t.jsx)(
																						'td',
																						{
																							className:
																								'px-3 py-2.5 text-right align-middle',
																							children:
																								null ==
																								e.deltaPct
																									? (0,
																										t.jsx)(
																											'span',
																											{
																												className:
																													'text-ink-3',
																												children:
																													'—',
																											},
																										)
																									: (0,
																										t.jsx)(
																											N,
																											{
																												tone: o,
																												size: 'xs',
																												children:
																													Number.isFinite(
																														e.deltaPct,
																													)
																														? (function (
																																e,
																																t = 1,
																															) {
																																if (
																																	!Number.isFinite(
																																		e,
																																	)
																																)
																																	return '—';
																																let n =
																																	e >
																																	0
																																		? '+'
																																		: '';
																																return `${n}${e.toLocaleString('en-US', { maximumFractionDigits: t, minimumFractionDigits: t })}%`;
																															})(
																																e.deltaPct,
																															)
																														: '+∞%',
																											},
																										),
																						},
																					),
																				],
																		},
																	)
																: null,
														],
													},
													e.projectName,
												);
											}),
											0 === u.length
												? (0, t.jsx)('tr', {
														children: (0, t.jsx)(
															'td',
															{
																colSpan: r
																	? 10
																	: 7,
																className:
																	'px-3 py-12 text-center text-ink-3',
																children:
																	'No projects match this filter.',
															},
														),
													})
												: null,
										],
									}),
								],
							}),
						}),
					}),
				],
			});
		}
		function F({
			label: e,
			tooltip: n,
			k: r,
			sortKey: i,
			sortDir: o,
			onSort: a,
			align: l = 'left',
		}) {
			let s = i === r,
				c = 'string' == typeof e ? e : 'column';
			return (0, t.jsx)('th', {
				scope: 'col',
				className: `px-3 py-2 ${'right' === l ? 'text-right' : 'text-left'}`,
				children: (0, t.jsxs)('button', {
					type: 'button',
					'aria-label': `Sort by ${c}`,
					title: n ? String(n) : `Sort by ${c}`,
					className: `inline-flex items-center gap-1 transition-colors ${s ? 'text-ink' : 'text-ink-3 hover:text-ink-2'}`,
					onClick: () => a(r),
					children: [
						e,
						(0, t.jsx)('span', {
							'aria-hidden': !0,
							className: `text-[8px] ${s ? 'opacity-100' : 'opacity-30'}`,
							children: s ? ('asc' === o ? '▲' : '▼') : '▾',
						}),
					],
				}),
			});
		}
		function T({ rank: e }) {
			let n = 1 === e,
				r = 2 === e,
				i = 3 === e;
			return (0, t.jsx)('span', {
				className: `inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-[11px] font-semibold tnum ${n ? 'border border-amber-300/55 bg-amber-300/15 text-white' : r ? 'border border-slate-300/55 bg-slate-300/15 text-white' : i ? 'border border-amber-700/55 bg-amber-700/15 text-white' : 'border border-white/15 bg-white/8 text-ink-2'}`,
				children: e,
			});
		}
		function R({ usd: e, eth: n, maxMatch: r, tone: i }) {
			let o = r && r > 0 ? Math.min(100, (e / r) * 100) : 0;
			return e <= 0
				? (0, t.jsx)('div', {
						className: 'text-right',
						children: (0, t.jsx)('div', {
							className: 'text-ink-3 tnum',
							children: '$0',
						}),
					})
				: (0, t.jsxs)('div', {
						className: 'text-right',
						children: [
							(0, t.jsx)('div', {
								className: `font-semibold tnum ${'teal' === i ? 'text-match-soft' : 'green' === i ? 'text-neon' : 'text-giveth-soft'}`,
								children: L(e, { compact: !0 }),
							}),
							(0, t.jsx)('div', {
								className: 'text-[10px] text-ink-3 tnum',
								children: P(n, 3),
							}),
							r &&
								(0, t.jsx)('div', {
									className:
										'mt-1 h-1 w-20 max-w-full ml-auto overflow-hidden rounded-full bg-white/15',
									children: (0, t.jsx)('div', {
										className: `h-full ${'teal' === i ? 'bg-match/28' : 'green' === i ? 'bg-neon/30' : 'bg-giveth/30'}`,
										style: { width: `${o}%` },
									}),
								}),
						],
					});
		}
		function I(e, t) {
			return e && t ? 'cap_and_floor' : e ? 'cap' : t ? 'floor' : 'none';
		}
		function B({ side: e, roundConfig: n, settings: r, onChange: i }) {
			var o, a;
			let l = (e, t) => i({ ...r, [e]: t }),
				s = 'cap' === (o = r.matchingLimits) || 'cap_and_floor' === o,
				c = 'floor' === (a = r.matchingLimits) || 'cap_and_floor' === a;
			return (0, t.jsx)(k, {
				className: 'h-full',
				title: (0, t.jsxs)('div', {
					className: 'flex items-center gap-2',
					children: [
						(0, t.jsxs)(N, {
							tone: 'A' === e ? 'purple' : 'teal',
							size: 'sm',
							children: ['Scenario ', e],
						}),
						(0, t.jsx)('span', {
							className: 'text-ink',
							children: 'Calculation settings',
						}),
					],
				}),
				subtitle: (0, t.jsx)('span', {
					className: 'block',
					children:
						'Choose which donations count and how matching is calculated.',
				}),
				right: null,
				children: (0, t.jsxs)('div', {
					className: 'flex flex-col gap-5',
					children: [
						(0, t.jsx)(z, {
							label: 'Algorithm',
							tooltip:
								'Choose the matching formula used to distribute the pool.',
							children: (0, t.jsx)(C, {
								ariaLabel: 'Algorithm',
								value: r.algorithm,
								onChange: e => l('algorithm', e),
								options: [
									{
										value: 'QF',
										label: 'Regular QF',
										hint: 'Classic QF. More unique donors means more matching.',
									},
									{
										value: 'COCM',
										label: 'COCM',
										hint: 'The QF model used in this QF Round. Looks at donation patterns and rewards broad, diverse support.',
									},
								],
							}),
						}),
						(0, t.jsx)(z, {
							label: 'Badge holder donations',
							tooltip:
								'ETHSecurity Badge holders are selected security experts. Use these options to count, boost, include, or exclude their donations in the matching calculation.',
							children: (0, t.jsx)(C, {
								ariaLabel: 'Badge holder treatment',
								value: r.badgeHolderMode,
								onChange: e => l('badgeHolderMode', e),
								options: [
									{
										value: 'normal',
										label: 'Same as others',
										hint: 'Badge holder donations count 1x',
									},
									{
										value: 'boost_4x',
										label: '4x boost',
										hint: '$1 counts as $4',
									},
									{
										value: 'only_badgeholders',
										label: 'Badge holders only',
										hint: 'All other donations excluded',
									},
									{
										value: 'only_non_badgeholders',
										label: 'No Badge holders',
										hint: 'Badge holder donations excluded',
									},
								],
							}),
						}),
						(0, t.jsx)(z, {
							label: 'DONOR ELIGIBILITY',
							tooltip:
								"QF-eligible donors are donors who passed the QF Round's uniqueness checks. Choose whether to count every address or only QF-eligible donors.",
							children: (0, t.jsx)(C, {
								ariaLabel: 'QF eligibility',
								value: r.qfEligibleOnly ? 'qf' : 'all',
								onChange: e => l('qfEligibleOnly', 'qf' === e),
								options: [
									{
										value: 'all',
										label: 'All donors',
										hint: 'No uniqueness check',
									},
									{
										value: 'qf',
										label: 'QF-eligible only',
										hint: 'Only unique donors',
									},
								],
							}),
						}),
						(0, t.jsx)(z, {
							label: 'PER-PROJECT MATCHING LIMITS',
							tooltip:
								'Adjust the maximum and minimum allowable matching at the top right of this page.',
							children: (0, t.jsxs)('div', {
								role: 'group',
								'aria-label': 'Matching limits',
								className: 'flex flex-wrap gap-1.5',
								children: [
									(0, t.jsx)(V, {
										active: 'none' === r.matchingLimits,
										label: 'No max or min',
										hint: 'Raw distribution',
										onClick: () =>
											l('matchingLimits', 'none'),
									}),
									(0, t.jsx)(V, {
										active: s,
										label: (function (e) {
											if (e <= 0) return 'No max';
											let t = Math.round(1e3 * e) / 10;
											return `${t}% max`;
										})(n.capPercent),
										hint: 'Maximum per project',
										onClick: () =>
											l('matchingLimits', I(!s, c)),
									}),
									(0, t.jsx)(V, {
										active: c,
										label: (function (e) {
											if (e <= 0) return 'No min';
											let t = e.toLocaleString('en-US', {
												maximumFractionDigits: 3,
												minimumFractionDigits: 0,
											});
											return `${t} ETH min`;
										})(n.floorEth),
										hint: 'Minimum per project',
										onClick: () =>
											l('matchingLimits', I(s, !c)),
									}),
								],
							}),
						}),
						(0, t.jsx)(z, {
							label: 'Adjustments',
							tooltip:
								'Optional filters and safeguards for special analyses.',
							children: (0, t.jsx)('div', {
								className: 'flex flex-col gap-2',
								children: (0, t.jsx)(y, {
									checked: r.antiGaming4xOthers,
									onChange: e => l('antiGaming4xOthers', e),
									label: '80/20 Rule',
									description:
										'A donor’s donation to one project can count only up to 4x what they gave to all other projects combined.',
								}),
							}),
						}),
						(0, t.jsx)(z, {
							label: 'ONLY TIK AND FINN',
							tooltip:
								'Limit matching to selected tokens. If both are on, donations in TIK and FINN are counted. If none are on, all eligible donation tokens are counted.',
							children: (0, t.jsxs)('div', {
								className: 'flex flex-col gap-2',
								children: [
									(0, t.jsx)(y, {
										checked: r.tikOnly,
										onChange: e => l('tikOnly', e),
										label: 'TIK donations',
										description:
											'Include CertiK Token donations',
										tone: 'tik',
									}),
									(0, t.jsx)(y, {
										checked: r.finnOnly,
										onChange: e => l('finnOnly', e),
										label: 'FINN donations',
										description:
											'Include Ethereum Security Finney donations',
										tone: 'finn',
									}),
								],
							}),
						}),
					],
				}),
			});
		}
		function V({ active: e, label: n, hint: r, onClick: i }) {
			return (0, t.jsxs)('button', {
				type: 'button',
				'aria-pressed': e,
				onClick: i,
				className: `flex-1 min-w-[7rem] rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${e ? 'border-giveth/55 bg-giveth/14 text-white shadow-[0_0_0_1px_rgba(255,59,58,0.25)]' : 'border-white/15 bg-white/8 text-ink-2 hover:bg-white/12'}`,
				children: [
					(0, t.jsx)('span', { className: 'block', children: n }),
					r
						? (0, t.jsx)('span', {
								className:
									'mt-0.5 block text-[10px] font-normal text-ink-3',
								children: r,
							})
						: null,
				],
			});
		}
		function z({ label: e, tooltip: n, hint: r, children: i }) {
			return (0, t.jsxs)('div', {
				children: [
					(0, t.jsx)('div', {
						className:
							'mb-1.5 flex items-baseline justify-between gap-2',
						children: (0, t.jsxs)('span', {
							className:
								'flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-ink-3',
							children: [
								(0, t.jsx)('span', { children: e }),
								n ? (0, t.jsx)(w, { content: n }) : null,
							],
						}),
					}),
					i,
					r
						? (0, t.jsx)('div', {
								className:
									'mt-2 text-[11px] text-ink-3 leading-snug',
								children: r,
							})
						: null,
				],
			});
		}
		function H() {
			return (0, t.jsxs)('div', {
				className:
					'mx-auto flex max-w-[1480px] flex-col items-center justify-center px-5 py-32 text-center',
				children: [
					(0, t.jsx)(p, { className: 'h-9 w-auto opacity-90' }),
					(0, t.jsx)('div', {
						className:
							'mt-8 h-1 w-48 overflow-hidden rounded-full bg-white/15',
						children: (0, t.jsx)('div', {
							className: 'qfc-shimmer h-full w-full',
						}),
					}),
					(0, t.jsx)('div', {
						className: 'mt-4 text-sm text-ink-2',
						children: 'Loading QF Round dataset…',
					}),
					(0, t.jsx)('div', {
						className: 'mt-1 text-xs text-ink-3',
						children: 'Fetching data.csv and abstracting donors',
					}),
				],
			});
		}
		function K({ message: e, onRetry: r }) {
			let [i, o] = n.useState(!0);
			return (
				n.useEffect(() => {
					let e = window.setTimeout(() => o(!1), 2e3);
					return () => window.clearTimeout(e);
				}, [e]),
				(0, t.jsxs)('div', {
					className: 'mx-auto max-w-[920px] px-5 py-10',
					children: [
						(0, t.jsx)('div', {
							className: 'min-h-[3.25rem]',
							children: i
								? (0, t.jsx)('div', {
										role: 'status',
										'aria-live': 'polite',
										className:
											'mb-4 rounded-xl border border-[#6f4b1f] bg-[#3a2a1a] px-4 py-3 text-sm font-medium text-[#fbd38d] shadow-2xl',
										children: e,
									})
								: null,
						}),
						(0, t.jsx)('h1', {
							className:
								'font-display text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.05] tracking-tight text-white',
							children: "TheDAO's Ethereum Security QF Round",
						}),
						(0, t.jsxs)('div', {
							className: 'glass-strong mt-6 rounded-2xl p-8',
							children: [
								(0, t.jsxs)('div', {
									className: 'flex items-center gap-3',
									children: [
										(0, t.jsx)('span', {
											className:
												'inline-flex h-9 w-9 items-center justify-center rounded-lg bg-danger/15 text-danger',
											children: '!',
										}),
										(0, t.jsxs)('div', {
											children: [
												(0, t.jsx)('h2', {
													className:
														'text-lg font-semibold text-ink',
													children:
														"Couldn't load the dataset",
												}),
												(0, t.jsxs)('p', {
													className:
														'text-sm text-ink-3',
													children: [
														'Place an Ethereum Security QF Round export at ',
														(0, t.jsx)('code', {
															className:
																'rounded bg-white/15 px-1 py-0.5 font-mono text-[12px]',
															children:
																'public/data.csv',
														}),
														', then reload.',
													],
												}),
											],
										}),
									],
								}),
								(0, t.jsxs)('div', {
									className: 'mt-5 flex items-center gap-3',
									children: [
										(0, t.jsx)('button', {
											type: 'button',
											onClick: r,
											className:
												'rounded-lg bg-giveth px-4 py-2 text-sm font-semibold text-[color:var(--bg-deep)] shadow-[0_0_24px_rgba(255,179,192,0.26)] hover:bg-giveth-soft transition-colors',
											children: 'Retry loading data',
										}),
										(0, t.jsx)('span', {
											className: 'text-xs text-ink-3',
											children:
												'CSV must include project_name, donor_label, amount_usd, currency, isBadgeholder, isMatchingIncluded.',
										}),
									],
								}),
							],
						}),
					],
				})
			);
		}
		let q = [
				'Wintermute',
				'Quantstamp',
				'CertiK',
				'Sigma Prime',
				'Certora',
				'ChainSecurity',
				'OtterSec',
			],
			Q = [
				{
					label: 'WTF is COCM',
					href: 'https://github.com/Giveth/qf-calculator/blob/main/fundingutils.py#L211',
				},
				{
					label: 'Open source calculator',
					href: 'https://github.com/Giveth/qf-calculator',
				},
			];
		function Z() {
			return (0, t.jsx)('footer', {
				className:
					'mt-12 border-t border-white/15 bg-[color:var(--bg-deep)]/80',
				children: (0, t.jsxs)('div', {
					className: 'mx-auto max-w-[1480px] px-5 py-10',
					children: [
						(0, t.jsxs)('div', {
							className: 'grid gap-8 lg:grid-cols-[1.3fr_1fr]',
							children: [
								(0, t.jsx)('div', {
									children: (0, t.jsx)('p', {
										className:
											'mt-4 max-w-md text-sm leading-relaxed text-ink-2',
										children:
											"This dashboard is an educational sandbox for exploring how QF settings reshape matching outcomes for TheDAO's Ethereum Security QF Round. Powered by Giveth.",
									}),
								}),
								(0, t.jsxs)('div', {
									children: [
										(0, t.jsx)('div', {
											className:
												'text-[10px] uppercase tracking-[0.22em] text-ink-3',
											children: 'Supporters',
										}),
										(0, t.jsx)('ul', {
											className:
												'mt-3 grid gap-1.5 text-xs sm:grid-cols-3',
											children: q.map(e =>
												(0, t.jsx)(
													'li',
													{
														className:
															'rounded-md border border-white/15 bg-white/8 px-2.5 py-1.5 text-ink-2',
														children: e,
													},
													e,
												),
											),
										}),
									],
								}),
							],
						}),
						(0, t.jsxs)('div', {
							className:
								'mt-8 flex flex-col items-start justify-between gap-3 border-t border-white/15 pt-4 text-[11px] text-ink-3 md:flex-row md:items-center',
							children: [
								(0, t.jsx)('div', {
									className: 'tnum',
									children:
										'v0.1 · TheDAO × Giveth · All rights reserved.',
								}),
								(0, t.jsx)('div', {
									className: 'flex flex-wrap gap-x-4 gap-y-2',
									children: Q.map(e =>
										(0, t.jsx)(
											'a',
											{
												href: e.href,
												target: '_blank',
												rel: 'noreferrer',
												className:
													'text-ink-2 underline decoration-white/25 underline-offset-4 hover:text-white hover:decoration-white',
												children: e.label,
											},
											e.href,
										),
									),
								}),
							],
						}),
					],
				}),
			});
		}
		let W = {
				matchingPoolEth: 637.4274,
				capPercent: 0.05,
				floorEth: 0.3333,
				minDonationUsd: 1,
			},
			G = {
				algorithm: 'COCM',
				badgeHolderMode: 'boost_4x',
				qfEligibleOnly: !0,
				matchingLimits: 'cap_and_floor',
				antiGaming4xOthers: !1,
				tikOnly: !1,
				finnOnly: !1,
			},
			X = {
				algorithm: 'COCM',
				badgeHolderMode: 'boost_4x',
				qfEligibleOnly: !0,
				matchingLimits: 'cap_and_floor',
				antiGaming4xOthers: !0,
				tikOnly: !1,
				finnOnly: !1,
			};
		function J(e, t) {
			switch (t) {
				case 'cap':
					return { ...e, floorEth: 0 };
				case 'floor':
					return { ...e, capPercent: 0 };
				case 'cap_and_floor':
					return e;
				default:
					return { ...e, capPercent: 0, floorEth: 0 };
			}
		}
		function Y({ computing: e }) {
			return (0, t.jsx)('div', {
				className:
					'glass flex h-[60dvh] items-center justify-center rounded-2xl text-sm text-ink-3',
				children: e ? 'Computing matching…' : 'Waiting for results.',
			});
		}
		function ee() {
			return (0, t.jsx)('div', {
				className:
					'pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center',
				children: (0, t.jsxs)('div', {
					className:
						'glass-strong inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-ink-2',
					children: [
						(0, t.jsx)('span', {
							className:
								'inline-block h-2 w-2 animate-pulse rounded-full bg-giveth',
						}),
						'Computing matching…',
					],
				}),
			});
		}
		function et({ message: e }) {
			let [r, i] = n.useState(!0);
			return (n.useEffect(() => {
				let e = window.setTimeout(() => i(!1), 4e3);
				return () => window.clearTimeout(e);
			}, []),
			r)
				? (0, t.jsx)('div', {
						className:
							'pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center px-5',
						children: (0, t.jsx)('div', {
							role: 'status',
							'aria-live': 'polite',
							className:
								'max-w-[920px] rounded-xl border border-[#6f4b1f] bg-[#3a2a1a] px-4 py-3 text-sm font-medium leading-snug text-[#fbd38d] shadow-2xl',
							children: e,
						}),
					})
				: null;
		}
		e.s(
			[
				'default',
				0,
				function () {
					let [e, r] = n.useState({ status: 'loading' }),
						[i, a] = n.useState(W),
						[l, s] = n.useState(G),
						[d, m] = n.useState(X),
						[h, f] = n.useState(!1),
						[p, g] = n.useState(null),
						x = n.useRef(null),
						b = n.useCallback(() => {
							r({ status: 'loading' }),
								u()
									.then(e =>
										r({
											status: 'ready',
											dataset: e.dataset,
											meta: {
												droppedRows: e.droppedRows,
												donorsAlreadyAbstract:
													e.donorsAlreadyAbstract,
											},
										}),
									)
									.catch(e => {
										r({
											status: 'error',
											message:
												e instanceof c ||
												e instanceof Error
													? e.message
													: String(e),
										});
									});
						}, []);
					n.useEffect(() => {
						let e = setTimeout(b, 0);
						return () => clearTimeout(e);
					}, [b]);
					let [j, w] = n.useState({
						A: null,
						B: null,
						computing: !1,
					});
					n.useEffect(() => {
						if ('ready' !== e.status) return;
						let t = !1,
							n = setTimeout(() => {
								t || w(e => ({ ...e, computing: !0 }));
							}, 0),
							r = setTimeout(() => {
								try {
									let n = o(
											e.dataset,
											l,
											J(i, l.matchingLimits),
										),
										r = h
											? o(
													e.dataset,
													d,
													J(i, d.matchingLimits),
												)
											: null;
									t || w({ A: n, B: r, computing: !1 });
								} catch (e) {
									t ||
										w({
											A: {
												settings: l,
												projects: [],
												totalMatchedUSD: 0,
												totalEligibleDonationsUSD: 0,
												eligibleDonorCount: 0,
												fundedProjectCount: 0,
												computeMs: 0,
												warnings: [
													e instanceof Error
														? e.message
														: String(e),
												],
											},
											B: null,
											computing: !1,
										});
								}
							}, 30);
						return () => {
							(t = !0), clearTimeout(n), clearTimeout(r);
						};
					}, [e, l, d, h, i]);
					let v =
						[
							...(j.A?.warnings.map(e => `Scenario A: ${e}`) ??
								[]),
							...(j.B?.warnings.map(e => `Scenario B: ${e}`) ??
								[]),
						][0] ?? null;
					if (
						(n.useEffect(() => {
							if (!v) {
								x.current = null;
								return;
							}
							if (x.current === v) return;
							x.current = v;
							let e = window.setTimeout(() => {
								g({ id: Date.now(), message: v });
							}, 250);
							return () => window.clearTimeout(e);
						}, [v]),
						'loading' === e.status)
					)
						return (0, t.jsxs)(t.Fragment, {
							children: [
								(0, t.jsx)(D, {
									comparisonOn: h,
									onToggleComparison: f,
								}),
								(0, t.jsx)(H, {}),
							],
						});
					if ('error' === e.status)
						return (0, t.jsxs)(t.Fragment, {
							children: [
								(0, t.jsx)(D, {
									comparisonOn: h,
									onToggleComparison: f,
								}),
								(0, t.jsx)(K, {
									message: e.message,
									onRetry: b,
								}),
							],
						});
					let y = e.dataset;
					return (0, t.jsxs)(t.Fragment, {
						children: [
							(0, t.jsx)(D, {
								comparisonOn: h,
								onToggleComparison: f,
							}),
							p
								? (0, t.jsx)(et, { message: p.message }, p.id)
								: null,
							(0, t.jsx)(A, {
								dataset: y,
								config: i,
								onConfigChange: a,
							}),
							(0, t.jsxs)('main', {
								className: 'mx-auto max-w-[1480px] px-5 pb-10',
								children: [
									(0, t.jsxs)('div', {
										className: `grid gap-4 ${h ? 'lg:grid-cols-2' : 'items-stretch lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]'}`,
										children: [
											(0, t.jsx)(B, {
												side: 'A',
												roundConfig: i,
												settings: l,
												onChange: s,
												computeMs: j.A?.computeMs,
												totalMatchedUSD:
													j.A?.totalMatchedUSD,
											}),
											h
												? (0, t.jsx)(B, {
														side: 'B',
														roundConfig: i,
														settings: d,
														onChange: m,
														computeMs:
															j.B?.computeMs,
														totalMatchedUSD:
															j.B
																?.totalMatchedUSD,
													})
												: (0, t.jsx)('div', {
														className:
															'min-w-0 h-full',
														children: j.A
															? (0, t.jsx)($, {
																	primary:
																		j.A,
																	secondary:
																		null,
																})
															: (0, t.jsx)(Y, {
																	computing:
																		j.computing,
																}),
													}),
										],
									}),
									h
										? (0, t.jsx)('div', {
												className: 'mt-4',
												children:
													j.A && j.B
														? (0, t.jsx)($, {
																primary: j.A,
																secondary: j.B,
															})
														: (0, t.jsx)(Y, {
																computing:
																	j.computing,
															}),
											})
										: null,
									j.computing ? (0, t.jsx)(ee, {}) : null,
								],
							}),
							(0, t.jsx)(Z, {}),
						],
					});
				},
			],
			58116,
		);
	},
]);
