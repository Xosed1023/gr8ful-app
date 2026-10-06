# Quickstart: Racha de Días

Requiere `npm run build && npx cap sync ios` y compilar en el iPhone.

## Ver la racha
1. Con el onboarding terminado, abre Home: la píldora muestra la racha (1 en una instalación nueva).
2. Cierra y vuelve a abrir el mismo día: no cambia.

## Simular días (consola del Web Inspector de Safari)
La racha vive en `localStorage.streak` con `lastDay` en `YYYY-MM-DD`.

- **Día siguiente**: `localStorage.streak = JSON.stringify({current:5,best:5,lastDay:"<ayer>"})` y recarga → 6.
- **Rescate**: `lastDay` de anteayer con `current:5` y recarga → aparece el aviso. «Ver anuncio» → 6; «Empezar de nuevo» → 1.
- **Pérdida**: `lastDay` de hace 3 días o más → 1, sin aviso.
- **Cerrar sin decidir**: con el aviso abierto, cierra la app y ábrela: reaparece.
- **Segundo plano**: deja la app en segundo plano, cambia `lastDay` a ayer y vuelve: cuenta el día.

## Textos
Cambia el idioma en Ajustes y comprueba la píldora y el aviso en ES, EN y FR; también en mujer/hombre y en claro/oscuro.
