# Feature Specification: Completar Banners AdMob por Tarjeta

**Feature Branch**: `011-completar-banners-admob-card`

**Created**: 2026-09-18

**Status**: ⚠️ Deuda técnica — IDs calculados, sin render real

**Input**: Deuda técnica identificada en exploración de código.

## Estado actual

`src/components/home/CardsContainer.tsx` calcula un `adBannerId` por tarjeta según idioma y plataforma (variables de entorno `VITE_*_EN_CARD`, `VITE_*_ES_CARD`, `VITE_*_FR_CARD`) y lo pasa como prop a `CardPhrase`. `CardPhrase.tsx` recibe esa prop e importa los tipos `BannerAdOptions`, `BannerAdPosition`, `BannerAdSize` de `@capacitor-community/admob`, pero nunca los usa para renderizar un banner real.

## Decisión requerida antes de planear

No está claro si esta feature sigue siendo deseada como está (banner fijo por tarjeta) dado que ya existen intersticiales cada 45s y rewarded ads — agregar banners por tarjeta puede sobrecargar de anuncios la experiencia. **Requiere `/speckit-clarify` con decisión de producto explícita**: ¿se completa el banner, o se elimina el código muerto (`adBannerId`, imports sin usar) porque se decidió no usar banners?

## Requirements *(mandatory, condicionados a decisión de producto)*

- **FR-001** *(si se completa)*: `CardPhrase.tsx` DEBE renderizar un `BannerAd` usando el `adBannerId` recibido, respetando idioma y plataforma.
- **FR-001-alt** *(si se descarta)*: Eliminar `adBannerId` de `CardsContainer.tsx`/`CardPhrase.tsx` y los imports sin usar, junto con las env vars de banner que queden huérfanas.

## Success Criteria *(mandatory)*

- **SC-001**: No queda código muerto relacionado a banners (imports sin usar, props calculadas y nunca consumidas) — cualquiera sea la decisión.

## Assumptions

- Ninguna asumida — esta spec bloquea en `/speckit-clarify` hasta que el usuario decida entre completar o eliminar.
