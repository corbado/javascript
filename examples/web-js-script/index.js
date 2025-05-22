var CorbadoSharedUtil = (() => {
  var d = Object.defineProperty;
  var E = Object.getOwnPropertyDescriptor;
  var g = Object.getOwnPropertyNames;
  var u = Object.prototype.hasOwnProperty;
  var T = (t, e) => {
      for (var o in e) d(t, o, { get: e[o], enumerable: !0 });
    },
    f = (t, e, o, n) => {
      if ((e && typeof e == 'object') || typeof e == 'function')
        for (let s of g(e))
          !u.call(t, s) && s !== o && d(t, s, { get: () => e[s], enumerable: !(n = E(e, s)) || n.enumerable });
      return t;
    };
  var k = t => f(d({}, '__esModule', { value: !0 }), t);
  var P = {};
  T(P, { TelemetryEventRequest: () => r, TelemetryEventType: () => l, sendEvent: () => y });
  var l = (n => (
      (n.EXAMPLE_APPLICATION_OPENED = 'EXAMPLE_APPLICATION_OPENED'),
      (n.PACKAGE_METADATA = 'PACKAGE_METADATA'),
      (n.METHOD_CALLED = 'METHOD_CALLED'),
      n
    ))(l || {}),
    r = class {
      payload;
      sdkVersion;
      sdkName;
      identifier;
      type;
      constructor(e) {
        (this.payload = e.payload),
          (this.sdkVersion = e.sdkVersion),
          (this.sdkName = e.sdkName),
          (this.identifier = e.identifier),
          (this.type = e.type);
      }
      toJson() {
        let e = { identifier: this.identifier, type: this.type.toString() };
        return (
          this.payload != null && (e.payload = JSON.stringify(this.payload)),
          this.sdkVersion != null && (e.sdk_version = this.sdkVersion),
          this.sdkName != null && (e.sdk = this.sdkName),
          e
        );
      }
      toJsonString() {
        return JSON.stringify(this.toJson());
      }
    };
  var A = 'https://telemetry.cloud.corbado.io/v1/',
    h = 'telemetryEvents',
    N = 500;
  async function y({ type: t, payload: e, sdkVersion: o, sdkName: n, identifier: s, debugMode: p = !1 }) {
    let a = new r({ type: t, sdkVersion: o, sdkName: n, identifier: s, payload: e });
    if (p) {
      console.log('Telemetry event:', a.toJsonString());
      return;
    }
    let m = `${A}${h}`;
    try {
      let i = new AbortController(),
        c = setTimeout(() => i.abort(), N);
      await fetch(m, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: a.toJsonString(),
        signal: i.signal,
      }),
        clearTimeout(c);
    } catch {}
  }
  return k(P);
})();
