# Plan: Loader del anuncio

- `src/ads/rewardedLoading.ts`: estado global mínimo (`useSyncExternalStore`).
- `src/ads/rewarded.ts`: marca «cargando» al empezar, lo apaga con el evento `Showed` del plugin o al terminar; reentrada bloqueada; límite de 15 s sobre `prepare`; opción `notifyFailure` para avisar con un toast (`toastController` de `@ionic/core`).
- `src/ads/RewardedLoader.tsx/.css`: overlay en portal (z-index por encima del rescate), ∞ con trazo animado, retraso de 250 ms, `role="status"`.
- `src/ads/rewardedCopy.ts`: textos EN/ES/FR.
- `App.tsx` monta `<RewardedLoader />`; `MainHome.tsx` llama a `showRewarded({ notifyFailure: true })`.
