# Ficha Funcional: yacht-specs

## Visión General
Bloque para mostrar las especificaciones técnicas de un yate en un layout de grid de 3 columnas (desktop).
Estrategia de carga: Eager / Lazy (según posición, típicamente debajo del fold, así que Lazy).

## Modelo Universal Editor
- **Título**: Texto rico o simple ("Especificaciones")
- **Subtítulo/Eyebrow**: Texto simple ("Ficha técnica")
- **Elementos (Items)**: Repetible. Cada item tiene:
  - `label`: Nombre de la especificación (ej. "Eslora")
  - `value`: Valor (ej. "18.20 m")

## DOM de Entrada (Matriz EDS)
En AEM, el autor configura una tabla. Las dos primeras filas pueden ser el eyebrow y el título. El resto de filas son las especificaciones.
```html
<div class="yacht-specs">
  <div>
    <div>Ficha técnica</div>
  </div>
  <div>
    <div>Especificaciones</div>
  </div>
  <div>
    <div>Eslora</div>
    <div>18.20 m</div>
  </div>
  <div>
    <div>Manga</div>
    <div>9.45 m</div>
  </div>
  <!-- ... más filas ... -->
</div>
```

## DOM de Salida (Decorado)
```html
<div class="yacht-specs bg-mist">
  <div class="yacht-specs-wrapper">
    <div class="yacht-specs-eyebrow">Ficha técnica</div>
    <h2 class="yacht-specs-title">Especificaciones</h2>
    <div class="yacht-specs-grid">
      <div class="yacht-specs-item">
        <span class="yacht-specs-label">Eslora</span>
        <span class="yacht-specs-value">18.20 m</span>
      </div>
      <div class="yacht-specs-item">
        <span class="yacht-specs-label">Manga</span>
        <span class="yacht-specs-value">9.45 m</span>
      </div>
    </div>
  </div>
</div>
```
