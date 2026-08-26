# met-hub — Client Slice Deep Review (ClientReview2)

Scope: all ~62 files under `client/`, plus `public/sw.js` and `public/manifest.json`.
Supporting files read for cross-boundary verification: `common/controller.ts`, `common/allStationsCfgClient.ts`, `common/sensor.ts`, `common/units.ts`.
Method: full line-by-line read; every claim checked against surrounding context. Items marked **[INFERENCE]** depend on server response shape not visible in this slice.

Severity counts: **critical 0 · high 4 · medium 8 · low 10 · nit 6**

Security verdict up front: no XSS sinks (`dangerouslySetInnerHTML`/`innerHTML`/`eval` absent), no tokens in localStorage, SSE/API paths correctly excluded from SW caching, external-station access gated by `station.public`. The real issues are async-correctness and error-handling.

---

## HIGH

### H1. Station fetch failure leaves spinner stuck forever AND wipes current readings
- File: `common/controller.ts:119-130` (drives `client/station/stationData.ts`)
- Excerpt:
  ```ts
  this.stationData.setLoading(true);
  const newData = await this.privateFetch(...);
  this.stationData.setData(newData);
  if (newData != null) this.stationData.setLoading(false);
  ```
- Why wrong: `privateFetch` returns `null` on any network/HTTP failure. Two consequences: (1) `setLoading(false)` is skipped, so the refresh icon in `StationHeader` spins forever; (2) `setData(null)` executes its else-branch `this.data = {} as IStationData`, erasing every currently displayed reading. One failed poll (60 s interval) blanks the whole CURRENT DATA panel with no error state.
- Fix:
  ```ts
  const newData = await this.privateFetch(
    this.url(`/api/getLastData/station/${this.stationCfg.STATION_ID}`),
  );
  if (newData != null) this.stationData.setData(newData);
  this.stationData.setLoading(false);
  ```

### H2. Out-of-order chart responses overwrite newer data (race)
- File: `client/charts/chartsCtrl.ts:46-148`
- Why wrong: `load()` is fired from three sources — the 60 s auto-reload timer (`setStation`, line 27), range/page/sensor Listboxes, and the header refresh button — with no request sequencing, abort, or stale-response token. Rapid interactions (e.g. pick "1 year", then "1 hour") let the slower older request resolve last and replace `hdata`/`cdata`, showing year-range data labelled as 1-hour (the `cdata.range` travels with whichever response wins). Same applies when switching stations.
- Fix: keep a monotonically increasing `requestId` (or `AbortController`) captured before `await`; after the fetch, discard the result if a newer load started:
  ```ts
  const seq = ++this.loadSeq;
  ...
  const newData = await response.json();
  if (seq !== this.loadSeq) return;
  ```

### H3. Forecast race: wrong station's forecast can be displayed
- File: `client/forecast/forecastCtrl.ts:32-92`
- Why wrong: `setStation()` calls `fetchData()` + `fetchAstronomicalData()`, and `start()` also polls both every 30 min. Neither function serializes or cancels in-flight requests. Switching station A→B quickly can let A's response resolve after B's; `setForecast(A)` then renders station A's forecast/sunrise/sunset under station B. Unlike ChartsCtrl there isn't even a timer reset on `setStation`.
- Fix: capture `const station = this.forecastData.station` (and/or a sequence number) before `await`; after the fetch, bail if `this.forecastData.station !== station`.

### H4. Google login: no error handling → silent failure and unhandled rejection
- File: `client/about.tsx:12-33` (called fire-and-forget from `client/header/headerDropdown.tsx:16-18`)
- Excerpt:
  ```ts
  const res = await fetch("/api/googleLogin", {...});
  const data = await res.json();
  authCtrl.setAuth(data.given_name, ...);
  ```
- Why wrong: `res.ok` is never checked and the promise is not awaited/caught by the caller. A 500/network failure makes `res.json()` throw or yields an error body whose fields are `undefined`; the rejection is unhandled and the user gets zero feedback — the login button just appears dead. `data.expiresAt` being `undefined` would also poison `checkAuth` comparisons.
- Fix: wrap in try/catch, check `res.ok`, surface an error state next to the button.

---

## MEDIUM

### M1. Forecast refresh: loading flag never cleared on failure
- File: `client/forecast/forecastCtrl.ts:42,57-60`
- Why wrong: `setLoading(true)` runs inside `try`, but `setLoading(false)` only on the success path (line 57). Any HTTP/network error leaves `loading === true` forever → the ForecastHeader refresh icon spins indefinitely; catch only logs. Mirrors H1.
- Fix: `finally { this.forecastData.setLoading(false); }`.

### M2. Astronomical data wiped before fetch — lost on failed refresh
- File: `client/forecast/forecastCtrl.ts:64`
- Why wrong: `fetchAstronomicalData` sets `astronomicalData = null` before the request; `setAstronomicalData` derives `sunrise`/`sunset` only on success. On any failed refresh (or transient offline), previously correct sunrise/sunset disappear from the UI ("–") even though the data didn't change. Classic wipe-before-fetch.
- Fix: assign into the store only after a successful parse; never pre-null.

### M3. Chart load wipes chart + stats on HTTP error / empty body
- File: `client/charts/chartsCtrl.ts:91,98`
- Excerpt: `this.chartsData.setNewData(false, [], new CData());`
- Why wrong: on `!response.ok` (thrown afterwards but wipe already done) or `newData == null`, the current chart and Min/Avg/Max stats are replaced with empty data and default `CData` instead of keeping last-good data and surfacing an error. A single failing poll blanks the historical panel.
- Fix: keep previous `hdata`/`cdata`; set an `error` observable and render it.

### M4. Newly added station never appears in the selector until reload
- File: `client/header/headerModal.tsx:46-51`, `client/header/headerStationsList.tsx:31`, `common/allStationsCfgClient.ts`
- Why wrong: after `addStation` succeeds nothing calls `appContext.fetchCfg()`. The dropdown options come from the static `AllStationsCfgClient.map`, which is repopulated only inside `fetchAllStationsCfg` (login/profile/logout flows). So the new station is missing from the list until a full page reload or re-login. Note also that `headerData.allStations` exists as observable state but the listbox ignores it in favor of the static map — two divergent sources of truth.
- Fix: call `appContext.fetchCfg()` after a successful add (and have the listbox read `headerData.allStations`).

### M5. Add-station modal state never resets; double-submit possible
- File: `client/header/headerModal.tsx:24-52,110-127`
- Why wrong: closing via Cancel/Done/onClose doesn't reset `step2/id/error/passkey/...`. Reopening "Add new station" shows the previous run's step-2 instructions (including the old station id and passkey). Also the Submit button has no busy/disabled state, so a slow `addStation` allows duplicate submissions creating duplicate stations.
- Fix: reset state when dialog closes (`onClose` → clear all local state) and disable Submit while submitting.

### M6. Station switch shows previous station's trend sparklines
- File: `client/station/stationData.ts:75-84`
- Why wrong: `setStation(station)` resets `raindata/dailyET0/loading/oldData` but not `data`/`trendData`. Numeric values are masked by `old ? null : value`, but the `Trend` sparklines receive no such gating, so station B renders station A's last-hour shape (and `Time` shows A's amber timestamp) until B's first fetch lands. On a slow/failing fetch it persists.
- Fix: also clear `this.data = {} as IStationData` and reset `trendData` in `setStation`, or pass `old` into `Trend` and blank it.

### M7. Unguarded array indexing of `raindata` can crash the whole app
- File: `client/station/stationFloatingRain.tsx:18,29,40,...` (indices 0–7)
- Why wrong: each cell does `parseFloat(raindata[i].sum)` guarded only by `raindata == null`. If the API returns fewer than 8 aggregates (partial history, schema change), `raindata[3]` is `undefined` and `.sum` throws inside render → ErrorBoundary blanks the entire application. **[INFERENCE]** assumes server may return short arrays; the guard's existence suggests that possibility.
- Fix: `(raindata[i]?.sum != null ? parseFloat(raindata[i].sum) : null)`.

### M8. `logout()` unhandled rejection skips post-logout reload
- File: `client/auth/authCtrl.ts:88-92`
- Why wrong: local auth is cleared, then `await fetch("/api/logout", {})` — network failure rejects, is unhandled by the Menu `onClick`, and `appContext.fetchCfg()` never runs, leaving the stations list stale for the anonymous view while UI already switched to logged-out.
- Fix: try/catch around the fetch; always run `fetchCfg()` in `finally`.

---

## LOW

### L1. Dead token plumbing: `access_token` is never set anywhere
- File: `client/auth/authData.ts:16-18,63-64`, `client/auth/authCtrl.ts:17-19`
- Why wrong: `getAccessToken()` always returns `null` — `access_token`/`refresh_token` are declared, observed, and nulled in `cancelAuth` but never assigned (the `refreshToken` param is always passed `null`). Vestigial auth-token code misleads readers about where auth lives (server session cookie).
- Fix: delete `access_token`, `refresh_token`, `getAccessToken`, and the `refreshToken` parameter.

### L2. `GoCtrl`/`GoData` are dead code, and the one method is a no-op
- File: `client/go/goData.ts:15-19`, `client/go/goCtrl.ts:3-17`
- Why wrong: nothing imports either class. Even if used, `setForecastData` builds a local `new ForecastData()`, populates it, and discards it — `forecastData` array is never touched. `GoCtrl.start()` is fully commented out.
- Fix: delete the `go/` directory.

### L3. Vestigial retry/time state: `.try`, `setTime`, offsets
- Files: `client/station/stationData.ts:82,107-118`, `client/dom/domData.ts:65,78-89`, `client/forecast/forecastData.ts:332,348,354-371`
- Why wrong: `try` is only ever assigned `0` (never incremented). `StationData.setTime`/`DomData.setTime` have no callers (only `headerData.setTime` is scheduled). `offset1h/setOffset1h/setOffset6h` are written nowhere except one `console.debug` in `forecastCharts.tsx:476`.
- Fix: remove the dead fields/methods.

### L4. Config load fails silently — selector vanishes without explanation
- File: `client/index.tsx:108-126`, `common/allStationsCfgClient.ts:14-38`
- Why wrong: `fetchAllStationsCfg` swallows all errors and returns `null`; `fetchCfg` then calls `setStation(null)` → blank main area, hidden selector, no message/retry. For a weather dashboard a "can't reach server" state matters.
- Fix: distinguish empty-vs-error; render an error card with retry.

### L5. External `?id=` view leaks into saved default station
- File: `client/index.tsx:87-88,120-123`
- Why wrong: `setStation` unconditionally writes `localStorage.lastStationID`, including for external public stations opened via `?id=`. On the next visit without `?id`, if that id happens to exist in the user's cfg it becomes the default selection — surprising cross-session behavior. **[INFERENCE]** impact depends on what `/api/getAllStationsCfg` returns for anonymous users.
- Fix: persist only selections made through the dropdown, not URL-driven ones.

### L6. Stats parse treats numeric `0` as missing
- File: `client/charts/chartsCtrl.ts:101-111`
- Why wrong: `newData.stats.min ? parseFloat(newData.stats.min) : null` uses truthiness; a numeric `0` (as opposed to string `"0"`) becomes `null` and drops out of Min/Avg display. **[INFERENCE]** depends on server emitting strings.
- Fix: `!= null` checks instead of truthiness.

### L7. XAxis config inconsistent between charts
- Files: `client/charts/chart.tsx:96-103` vs `client/charts/rainChart.tsx:62-69`, `client/charts/windDirChart.tsx:48-55`, `client/charts/charts.tsx:78-85` (ET0RainChart)
- Why wrong: `chart.tsx` correctly passes `type="number"` with `scale="time"`; the others omit `type="number"`, mixing categorical defaults with a time scale. For ET0RainChart this is a `BarChart` on a continuous time axis — Recharts computes bar width from band width, which is degenerate on point/time scales; bars can collapse to near-zero width. **[INFERENCE]** visual result depends on recharts version.
- Fix: use `type="number"` + `scale="time"` everywhere (or a band axis with formatted tick labels for bars).

### L8. `WindDirChart` silently renders nothing for any other ykey
- File: `client/charts/windDirChart.tsx:26-95`
- Why wrong: the entire body is wrapped in `ykey === "winddir" && (...)`, so any future sensor routed here draws an empty box with no indication why. Currently unreachable-dead branch since it's only mounted for `chartType === "winddir"`.
- Fix: drop the conditional or render a fallback.

### L9. `ForecastDay.getAirTemperatureMin(): string` returns `undefined`
- File: `client/forecast/forecastData.ts:113-115`
- Why wrong: `return this.air_temperature_min?.toFixed(0)` violates the declared return type; unlike the `Forecast6h` twin (which returns `"-"`), missing min renders as React-nothing instead of a dash placeholder.
- Fix: return `"-"` when null, matching `Forecast6h.getAirTemperatureMin`.

### L10. `authCtrl.checkAuth` polls every second for the app lifetime
- File: `client/auth/authCtrl.ts:24-32`
- Why wrong: 1 Hz interval forever (even logged-out; guarded by `expiresAt !== null` but never torn down), and expiry is detected at most 1 s late anyway. Harmless-ish but wasteful; timers are never cleared anywhere (acceptable only because AppContext is a singleton).
- Fix: poll at 30–60 s, or compute remaining time and schedule a single timeout; expose `stop()`.

---

## NIT

### N1. Invalid HTML: `<li>` directly inside `<div>`
- File: `client/header/headerModal.tsx:196-238` (multiple step-2 blocks)
- Fix: wrap lists in `<ul>`/`<ol>` or use styled `<div>`s.

### N2. Console noise in production render paths
- Files: `client/app.tsx:13-16`, `client/homepage.tsx:22`, `client/about.tsx:36`, `client/index.tsx:80,97,110`, `client/charts/chartsMap.tsx:34`, `client/charts/chartsCtrl.ts:81`, `client/forecast/forecastCharts.tsx:475-477`, `client/forecast/forecastChart.tsx:186`, `client/forecast/forecastChartTemp.tsx:180`
- Fix: strip debug logs or gate behind `process.env.NODE_ENV !== "production"`.

### N3. Theme color mismatch between manifest and HTML meta
- Files: `public/manifest.json` (`#121214`) vs `client/index.html:23` (`#0b0d14`)
- Fix: pick one value.

### N4. Unused prop threading: `Room.authData`
- File: `client/dom/room.tsx:21` — declared, never destructured/used; all five call sites in `domRoomsUp/DomRoomsDown` pass it.
- Fix: drop the prop.

### N5. Pervasive `any`
- Examples: `onClick: any` (`numberDataWithTrend.tsx:13`, `room.tsx:22-23`), `children?: any` (`container/heading/text.tsx`), `hdata: any` (`chartsData.ts:55`), `forecast/astronomicalData: any` (`forecastData.ts:308-310`), `measurement: null as any` (`headerModal.tsx:42`), tooltip props `{ active, payload, label }: any`, `timer: any` ×3.
- Fix: type handlers as `() => void`, children as `React.ReactNode`, payloads minimally.

### N6. Login handler lives in the About page module
- File: `client/about.tsx:12` — `handleGoogleLogin` exported from `about.tsx` and imported by `headerDropdown.tsx`.
- Fix: move to `auth/`.

---

## Verified non-issues (checked, deliberately OK)

- MobX usage: stores use `makeObservable` + action-batched wholesale replacement; `calculate()` mutating day objects happens inside the same action as the map swap, so observers see consistent state. Shallow-observable mutation trap avoided.
- `HeaderCurrentTime` isolates the 1 Hz clock re-render away from the rest of the Header tree — good pattern.
- All `.map()` lists have keys (verbose composite keys in forecast tables, but present).
- SW caching excludes `/api`, `/events` (SSE), upload endpoints, and foreign hosts; stale-while-revalidate with per-asset precache failure tolerance is sound. Minor note: cached HTML is served one revision stale after deploys (inherent SWR tradeoff).
- No XSS sinks; no secrets/tokens persisted client-side; `lastStationID` is the only localStorage key.
- `Trend` domain math guards nulls/non-negative clamping correctly; `dateFormatter` ordinal suffix logic handles 11th/12th/13th correctly despite looking fragile.
