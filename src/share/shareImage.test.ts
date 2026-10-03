import { beforeEach, describe, expect, it, vi } from "vitest";

const fs = vi.hoisted(() => ({
  writeFile: vi.fn().mockResolvedValue({ uri: "file:///cache/x.png" }),
  getUri: vi.fn().mockResolvedValue({ uri: "file:///cache/x.png" }),
}));
const share = vi.hoisted(() => ({ share: vi.fn().mockResolvedValue({}) }));
const platform = vi.hoisted(() => ({ native: true }));

vi.mock("@capacitor/filesystem", () => ({
  Filesystem: fs,
  Directory: { Cache: "CACHE" },
}));
vi.mock("@capacitor/share", () => ({ Share: share }));
vi.mock("@capacitor/core", () => ({
  Capacitor: { isNativePlatform: () => platform.native },
}));

import { shareImage } from "./shareImage";

const DATA_URL = "data:image/png;base64,AAAA";

describe("shareImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    platform.native = true;
    share.share.mockResolvedValue({});
  });

  it("guarda el PNG en la caché y lo comparte como archivo", async () => {
    await shareImage(DATA_URL, "Compartir");
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.objectContaining({ data: "AAAA", directory: "CACHE", path: expect.stringMatching(/^gr8ful-\d+\.png$/) })
    );
    expect(share.share).toHaveBeenCalledWith({
      files: ["file:///cache/x.png"],
      dialogTitle: "Compartir",
    });
  });

  it("cancelar el menú del sistema no lanza error", async () => {
    share.share.mockRejectedValueOnce(new Error("Share canceled"));
    await expect(shareImage(DATA_URL, "Compartir")).resolves.toBeUndefined();
  });

  it("un fallo real sí se propaga", async () => {
    share.share.mockRejectedValueOnce(new Error("disk full"));
    await expect(shareImage(DATA_URL, "Compartir")).rejects.toThrow("disk full");
  });

  it("un fallo al guardar el archivo se propaga", async () => {
    fs.writeFile.mockRejectedValueOnce(new Error("no space"));
    await expect(shareImage(DATA_URL, "Compartir")).rejects.toThrow("no space");
    expect(share.share).not.toHaveBeenCalled();
  });

  it("en web, sin Web Share de archivos, descarga la imagen", async () => {
    platform.native = false;
    const click = vi.fn();
    const anchor = { click, href: "", download: "" } as unknown as HTMLAnchorElement;
    const create = vi.spyOn(document, "createElement").mockReturnValue(anchor);
    Object.defineProperty(navigator, "canShare", { value: undefined, configurable: true });
    await shareImage(DATA_URL, "Compartir");
    expect(click).toHaveBeenCalled();
    expect(anchor.download).toMatch(/^gr8ful-\d+\.png$/);
    expect(fs.writeFile).not.toHaveBeenCalled();
    create.mockRestore();
  });
});
