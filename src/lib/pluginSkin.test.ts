import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getPluginSkin, resetPluginSkinForTests, setPluginSkin, usePluginSkin } from "./pluginSkin";

const prefersDark = (dark: boolean) =>
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches: dark && query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as MediaQueryList,
  );

// window.matchMedia comes from src/test/setup.ts (jsdom ships none)
beforeEach(() => {
  window.localStorage.clear();
  resetPluginSkinForTests();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("plugin skin", () => {
  it("follows the OS theme on a first visit", () => {
    prefersDark(true);
    expect(getPluginSkin()).toBe("night");
    resetPluginSkinForTests();
    prefersDark(false);
    expect(getPluginSkin()).toBe("daylight");
  });

  it("remembers a choice over the OS theme", () => {
    prefersDark(true);
    setPluginSkin("daylight");
    resetPluginSkinForTests();
    expect(getPluginSkin()).toBe("daylight");
  });

  it("still switches when storage is blocked", () => {
    prefersDark(false);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(getPluginSkin()).toBe("daylight");
    setPluginSkin("night");
    expect(getPluginSkin()).toBe("night");
  });

  it("re-renders every subscriber when the skin flips", () => {
    prefersDark(false);
    const a = renderHook(() => usePluginSkin());
    const b = renderHook(() => usePluginSkin());
    expect(a.result.current[0]).toBe("daylight");
    act(() => a.result.current[1]("night"));
    expect(a.result.current[0]).toBe("night");
    expect(b.result.current[0]).toBe("night");
  });
});
