import { chromium } from "playwright";
const PORT = process.argv[2] || "5231";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.addInitScript(() => {
  for (const [k, v] of Object.entries({ language: "es", gender: "W", name: "Ana", onboardingCompleted: "true", tutorialDone: "true" }))
    localStorage.setItem(k, v);
});
await page.goto(`http://localhost:${PORT}/tabs/home`, { waitUntil: "networkidle" });
await page.waitForTimeout(4500);
const dbFav = () =>
  page.evaluate(
    () =>
      new Promise((res) => {
        const o = indexedDB.open("motivationalPhrasesDB");
        o.onsuccess = () => {
          const r = o.result.transaction("phrases").objectStore("phrases").getAll();
          r.onsuccess = () => res(r.result.filter((p) => p.isFavorite === true).map((p) => p.id));
        };
      })
  );
const icon = () =>
  page.evaluate(() => {
    const el = document.querySelector('.phrase-card button[aria-label="Favorite"] ion-icon');
    return String(el?.getAttribute("icon") ?? el?.icon ?? "").length === 259 ? "GUARDADA" : "normal";
  });
const todayId = () => page.evaluate(() => { const p = JSON.parse(localStorage.getItem("dailyPlan")); const d = new Date(); const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; return p.days.find((x) => x.date === k).phraseId; });
const tab = (name) => page.locator("ion-tab-button", { hasText: name }).first().evaluate((b) => b.click());
const card = () => page.locator(".phrase-card").first().click({ force: true });
const heart = () => page.locator('button[aria-label="Favorite"]').first().evaluate((b) => b.click());
const wait = (ms = 700) => page.waitForTimeout(ms);
let mismatches = 0;
let currentB = null;
const state = async (label) => {
  const base = await dbFav();
  const ic = await icon();
  // Desde que existe la frase B, el icono debe reflejar si B está guardada en la base
  const bad = currentB !== null && (ic === "GUARDADA") !== base.includes(currentB);
  if (bad) mismatches++;
  console.log(label.padEnd(46), "base:", JSON.stringify(base), "icono:", ic, bad ? "  <-- DESINCRONIZADO" : "");
};

// Frase A: se guarda como favorita
await card(); await wait(1200);
const A = await todayId();
await heart(); await wait();
await card(); await wait();
console.log("frase A =", A);

// La frase del día cambia a B (lo mismo que hace «Renovar inspiración» o el cambio de día)
const B = await page.evaluate((a) => {
  const p = JSON.parse(localStorage.getItem("dailyPlan"));
  const d = new Date();
  const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const entry = p.days.find((x) => x.date === k);
  entry.phraseId = a === 40 ? 41 : 40;
  localStorage.setItem("dailyPlan", JSON.stringify(p));
  Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
  document.dispatchEvent(new Event("visibilitychange"));
  return entry.phraseId;
}, A);
await wait(1500);
currentB = B;
console.log("frase B =", B, "(la app ya debería mostrar B)");

await card(); await wait(1200);
await state("Home con B abierta (B no guardada)");
await heart(); await wait();
await state("tras guardar B");
await card(); await wait(500);
await tab("Favoritos"); await wait(1200);
console.log("tarjetas en Favoritos:", await page.locator(".fav-card").count());
// quitar B (la más reciente puede estar en cualquier posición: se quita la que sea B por texto del base)
// La lista sale ordenada por id: B ocupa el primer lugar si su id es menor que el de A
const removeIndexOfB = B < A ? 0 : 1;
await page.locator(".fav-remove").nth(removeIndexOfB).evaluate((el) => el.click());
await wait(800);
console.log("tras quitar B en Favoritos, base:", JSON.stringify(await dbFav()));
await tab("Diario"); await wait(1500);
await card(); await wait(1200);
await state("al volver a Home (B NO está guardada)");
await heart(); await wait();
await state("tras 1.ª pulsación");
await heart(); await wait();
await state("tras 2.ª pulsación");
await card(); await wait(500);
await tab("Favoritos"); await wait(1200);
console.log("tarjetas en Favoritos al final:", await page.locator(".fav-card").count(), "| base:", JSON.stringify(await dbFav()));
console.log(`RESULTADO desincronizaciones: ${mismatches}`);
await browser.close();
