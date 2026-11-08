// Tiny localStorage wrapper. Namespaced + JSON-serialized + era-scoped where it matters.

const NS = "prismos:v1";

export const State = {
  // Global (not era-specific)
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(`${NS}:${key}`);
      return raw == null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try { localStorage.setItem(`${NS}:${key}`, JSON.stringify(value)); } catch {}
  },
  del(key) {
    try { localStorage.removeItem(`${NS}:${key}`); } catch {}
  },

  // Era-scoped
  eraGet(era, key, fallback = null) {
    return this.get(`era:${era}:${key}`, fallback);
  },
  eraSet(era, key, value) {
    this.set(`era:${era}:${key}`, value);
  },
};

export const SetupState = {
  isComplete() { return !!State.get("setup:complete"); },
  markComplete(data) {
    State.set("setup:complete", true);
    State.set("setup:data", data || {});
  },
  reset() {
    State.del("setup:complete");
    State.del("setup:data");
  },
  user() {
    return (State.get("setup:data", {}) || {}).name || "Friend";
  }
};
