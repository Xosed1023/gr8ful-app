# Research: Actualización de Dependencias y Calidad del Código

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

No quedaban marcadores `NEEDS CLARIFICATION` en el Technical Context del plan — el alcance (solo minor/patch, sin `npm audit`, con `npx cap sync` como verificación nativa liviana) ya se resolvió en la sesión de `/speckit-clarify`. Este documento registra las decisiones técnicas necesarias para ejecutar la actualización de forma segura y repetible.

## Decisión 1: Mecanismo para aplicar los bumps menores/parche

- **Decision**: Usar `npm update` (respetando los rangos `^`/`~` ya declarados en `package.json`), seguido de `npm install` para regenerar `package-lock.json` de forma consistente.
- **Rationale**: `npm update` actualiza cada dependencia exactamente hasta la versión "Wanted" que ya reporta `npm outdated`, sin tocar el número de versión mayor declarado en `package.json`. Es la herramienta nativa de npm, no requiere instalar tooling adicional, y su comportamiento es el que la spec define como objetivo (FR-001/FR-002).
- **Alternatives considered**:
  - `npm-check-updates` (ncu): por defecto apunta a `latest` (incluye majors) salvo que se use `--target minor`; añade una dependencia de desarrollo extra solo para esta tarea puntual. Rechazada por innecesaria dado que `npm update` ya cubre el caso de uso sin instalar nada nuevo.
  - Edición manual de cada versión en `package.json`: más propenso a error humano y no aporta valor sobre `npm update` para un bump dentro del mismo rango semver.

## Decisión 2: Orden de verificación

- **Decision**: Ejecutar en este orden: (1) `npm outdated` (baseline), (2) `npm update && npm install`, (3) `npm outdated` (confirmar Current == Wanted, ningún major cruzado), (4) `npm run lint`, (5) `npm run build`, (6) `npm run test.unit`, (7) `npm run dev` + verificación manual de funciones core, (8) `npx cap sync`, (9) verificación manual del comportamiento de anuncios AdMob.
- **Rationale**: Cada paso depende del anterior y falla rápido — si `lint`/`build`/`test.unit` fallan tras el update, no tiene sentido continuar con la verificación manual (más costosa) hasta resolver o descartar esa dependencia del alcance (ver Edge Cases de la spec).
- **Alternatives considered**: Verificar todo en paralelo o solo al final — rechazada porque dificulta identificar qué dependencia concreta introdujo una regresión.

## Decisión 3: Qué hacer si una dependencia "menor/parche" en realidad rompe algo

- **Decision**: Si tras actualizar una dependencia dentro de su rango menor/parche declarado, `npm run lint`, `npm run build` o `npm run test.unit` fallan de forma atribuible a esa dependencia, se revierte esa dependencia puntual a su versión anterior y se documenta como candidata a revisión en la spec de saltos mayores (aunque nominalmente sea un bump menor, un cambio de comportamiento indica un fallo de semver del paquete, no un salto mayor real).
- **Rationale**: La spec (Edge Cases) ya contempla este escenario; mantiene el principio de bajo riesgo — no se fuerza una dependencia problemática solo por completar el 100% del listado de `npm outdated`.
- **Alternatives considered**: Forzar la actualización y arreglar el código para compatibilizar — rechazada porque excede el alcance definido ("sin cambios de comportamiento", "bajo riesgo") y se acerca al trabajo de una migración mayor.

## Decisión 4: Verificación nativa (`npx cap sync`)

- **Decision**: Ejecutar `npx cap sync` una sola vez al final, después de que `lint`/`build`/`test.unit` ya pasen, para confirmar que los plugins nativos actualizados (Capacitor core/android/ios y sus plugins, AdMob) siguen sincronizando sin errores hacia los proyectos `android/` e `ios/`.
- **Rationale**: Es la verificación acordada en la clarificación (Opción B) — liviana, no requiere abrir Android Studio/Xcode, pero cubre el riesgo real de que un plugin nativo actualizado rompa la sincronización del proyecto nativo (Principio III de la constitución).
- **Alternatives considered**: Build/ejecución completa en Android Studio/Xcode — descartada explícitamente en la clarificación por ser desproporcionada para un bump de bajo riesgo.

## Decisión 5: Auditoría de seguridad

- **Decision**: No se ejecuta ni se exige `npm audit` limpio como parte de esta spec.
- **Rationale**: Decisión explícita del usuario en la sesión de clarificación — el alcance se limita estrictamente a los criterios ya definidos (lint, build, test.unit, dev, funciones core, `npx cap sync`).
- **Alternatives considered**: Incluir `npm audit` como gate adicional — descartada por decisión explícita fuera de alcance; puede proponerse como spec futura independiente si surge la necesidad.

## Decisión 6: Regresiones nativas (CocoaPods) que exigen tocar `ios/App/Podfile`

- **Decision**: Cuando `npx cap sync ios` / `pod install` revela una regresión causada por una dependencia transitiva de CocoaPods (no declarada directamente en `package.json`), el patrón de remediación es: (1) fijar esa dependencia transitiva con un pin explícito en la zona `# Add your Pods here` del `Podfile` — nunca dentro de `capacitor_pods`, porque `cap sync` regenera ese bloque y descarta cualquier pod agregado ahí; (2) si el fallo está relacionado con el deployment target mínimo del SDK de Xcode instalado, alinear `platform :ios` al valor real ya usado por el target `App`, y agregar (o ampliar) el hook `post_install` para forzar ese mismo valor en todos los targets de `Pods.xcodeproj` (el hook `assertDeploymentTarget` de Capacitor solo sube el target si está por debajo de 14.0, no lo alinea a un valor mayor).
- **Rationale**: Es la extensión natural de la Decisión 3 (revertir/ajustar la causa concreta de una regresión) al mundo de CocoaPods, donde "revertir" una dependencia transitiva significa pinearla explícitamente en vez de solo cambiar una versión en `package.json`. Mantiene el mismo espíritu de bajo riesgo: se ajusta lo mínimo necesario para que `npx cap sync`/`pod install` vuelvan a pasar, sin migrar el plugin afectado a una versión mayor.
- **Caso real encontrado durante la implementación**: `@capacitor-community/admob@5.3.1` no fija la versión de `GoogleUserMessagingPlatform`; CocoaPods resolvió la 3.1.0, que renombró `UMPConsentStatus` → `ConsentStatus`, rompiendo la compilación de `ConsentExecutor.swift`. Se fijó `pod 'GoogleUserMessagingPlatform', '< 3.0'`. Además, `platform :ios` estaba en `14.0`, por debajo del mínimo soportado por el Xcode instalado (mínimo 15.0); se subió a `17.0` (alineado al `IPHONEOS_DEPLOYMENT_TARGET` ya configurado en el target `App`, 17.6) y se agregó el `post_install` que fuerza ese valor en todos los Pods. Ver `tasks.md` T015 para el detalle completo y el comando de verificación (`pod install --repo-update`).
- **Alternatives considered**: Migrar `@capacitor-community/admob` a una versión mayor (5.x → 8.x) probablemente trae `ConsentExecutor.swift` ya actualizado a la API nueva de UMP y evitaría el pin — rechazada por estar fuera de alcance de esta spec (solo minor/patch); queda como candidato para la spec de saltos mayores, momento en el que debería poder quitarse el pin de `GoogleUserMessagingPlatform`.
- **Efecto colateral documentado**: el iOS mínimo soportado por la app pasó de 14.0 a 17.0. No es una regresión de esta spec — es una consecuencia directa de mantener los Pods nativos sincronizados con el Xcode instalado — pero se registra acá porque no hay otro lugar en la spec original que lo capture.

## Dependencias identificadas sin cambio necesario

Según `npm outdated` al momento de crear la spec, algunas dependencias ya tienen `Current == Wanted` (no requieren acción): `@testing-library/dom`, `@testing-library/user-event`, `cypress`, `ionicons`, `jsdom`, `tailwindcss` (según snapshot). Esto se reconfirma en el paso (1)/(3) del orden de verificación antes de dar la tarea por completa.
