# Quickstart: Mensaje de Racha Restaurada

Requiere compilar en el teléfono (el anuncio es nativo). Para provocar el aviso de rescate, en la consola del WebView (en Android, la página «Gr8ful» de `chrome://inspect`, no los marcos de `googleads`):

```js
const k=d=>{const x=new Date();x.setDate(x.getDate()-d);return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0")};
localStorage.streak=JSON.stringify({current:5,best:5,lastDay:k(2)}); location.reload()
```

1. Aparece «¡Casi pierdes tu racha!» con «5 días».
2. Pulsa **Ver anuncio y conservarla** y completa el anuncio.
3. Al volver, el aviso se desvanece y aparece **«¡Racha restaurada!»**: la llama respira, se lee 5 y enseguida sube suavemente a **6**, con un háptico suave.
4. Sin tocar nada, a los ~3,5 s todo se desvanece y en Home la píldora muestra 6.
5. Repite y **toca en cualquier punto** del mensaje: se retira de inmediato.
6. Repite y elige **Empezar de nuevo**: no aparece el mensaje y la racha es 1.
7. Repite y **cierra el anuncio antes de tiempo**: no hay mensaje; sale el error y puedes reintentar.
8. Prueba en **modo oscuro**, con **mujer y hombre**, y en **ES, EN y FR**.
9. Con «Reducir movimiento» activado en el sistema, el mensaje aparece sin animaciones y ya con 6.
10. Con los hápticos desactivados en Ajustes, no vibra.
