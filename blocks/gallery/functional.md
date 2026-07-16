# Ficha Funcional: gallery

## Visión General
Bloque de galería de imágenes con diseño "masonry" en desktop y "scroller horizontal" en móvil.
Estrategia de carga: Lazy (normalmente va después del Hero y Overview).

## Modelo Universal Editor
- **Imágenes (Items)**: Repetible. Cada item es una simple imagen.

## DOM de Entrada (Matriz EDS)
En AEM, el autor inserta múltiples imágenes, lo que genera filas (divs) con `picture` dentro.
```html
<div class="gallery">
  <div>
    <div><picture>...</picture></div>
  </div>
  <div>
    <div><picture>...</picture></div>
  </div>
  <!-- ... -->
</div>
```

## DOM de Salida (Decorado)
Para replicar el diseño de Lovable, necesitamos generar DOS contenedores (uno para móvil y otro para desktop) o bien usar un único DOM con CSS que lo adapte.
Optaremos por un único DOM estructurado inteligentemente para que con Media Queries actúe como Flex Scroll (móvil) o Grid (desktop).

```html
<div class="gallery-wrapper">
  <div class="gallery-grid">
    <div class="gallery-item item-1"><picture>...</picture></div>
    <div class="gallery-item item-2"><picture>...</picture></div>
    <div class="gallery-item item-3"><picture>...</picture></div>
    <div class="gallery-item item-4"><picture>...</picture></div>
    <div class="gallery-item item-5">
      <picture>...</picture>
      <div class="gallery-overlay">+ X fotos</div>
    </div>
  </div>
</div>
```
