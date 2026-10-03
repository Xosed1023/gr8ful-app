import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

/** Cancelar el menú nativo también rechaza la promesa; no es un error real. */
const isCancellation = (error: unknown) =>
  /cancel|abort/i.test(error instanceof Error ? `${error.name} ${error.message}` : String(error));

function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, base64] = dataUrl.split(",");
  const mime = /data:([^;]+)/.exec(meta)?.[1] ?? "image/png";
  const bytes = atob(base64);
  const buffer = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) buffer[i] = bytes.charCodeAt(i);
  return new Blob([buffer], { type: mime });
}

/** Navegador (desarrollo): Web Share con archivo si existe; si no, descarga. */
async function shareOnWeb(dataUrl: string, fileName: string) {
  const file = new File([dataUrlToBlob(dataUrl)], fileName, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
    } catch (error) {
      if (!isCancellation(error)) throw error;
    }
    return;
  }
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  link.click();
}

/**
 * Comparte la imagen (data URL PNG) con el menú del sistema: la guarda como archivo
 * temporal en la caché y se la entrega como adjunto. Cancelar no es un error.
 */
export async function shareImage(dataUrl: string, dialogTitle: string): Promise<void> {
  const fileName = `gr8ful-${Date.now()}.png`;

  if (!Capacitor.isNativePlatform()) {
    await shareOnWeb(dataUrl, fileName);
    return;
  }

  await Filesystem.writeFile({
    path: fileName,
    data: dataUrl.split(",")[1],
    directory: Directory.Cache,
  });
  const { uri } = await Filesystem.getUri({ path: fileName, directory: Directory.Cache });

  try {
    await Share.share({ files: [uri], dialogTitle });
  } catch (error) {
    if (!isCancellation(error)) throw error;
  }
}
