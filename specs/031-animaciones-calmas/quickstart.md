# Quickstart: Animaciones Calmas (fase 1)

Requiere `npm run build && npx cap sync ios|android` y ejecutar en el teléfono.

1. **Bienvenida**: el logo, el texto, los puntos y el botón entran uno tras otro; el texto rotativo cambia con fundidos largos.
2. **Pasos del onboarding**: título, subtítulo y opciones entran escalonados. Elige una opción: la tarjeta se tiñe sin rebote, el resto se atenúa, el contenido se funde y entra el siguiente paso.
3. **Indicador de pasos**: el punto activo se desliza sin rebotar; el brillo y el aro del texto «Paso x de 5» son lentos.
4. **Botón atrás** (y gesto de deslizar en iOS): la pantalla anterior reaparece con fundido; el gesto sigue al dedo.
5. **Carga**: los destellos y la barra siguen la misma cadencia suave.
6. **Pestañas** (Home/Favoritos/Ajustes): no cambian respecto a antes.
7. **Reducir movimiento** (Ajustes del sistema → Accesibilidad): todo se muestra sin animación.
8. Comprueba que ninguna pantalla parpadea, se salta ni tiene movimientos bruscos.
