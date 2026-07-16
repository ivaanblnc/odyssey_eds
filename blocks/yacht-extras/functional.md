# Ficha Funcional: yacht-extras

## Visión General
Bloque para mostrar los servicios adicionales ("a la carta") del yate.
Estrategia de carga: Lazy.

## Modelo Universal Editor
- **Eyebrow**: Texto simple ("A la carta")
- **Title**: Texto rico ("Servicios adicionales.")
- **Description**: Párrafo ("Añade a tu chárter...")
- **Extras (Items)**: Repetible. Cada item tiene:
  - `name`: Servicio (ej. "Chef privado")
  - `price`: Precio (ej. "€ 480 / día")

## DOM de Entrada (Matriz EDS)
```html
<div class="yacht-extras">
  <div><div>A la carta</div></div>
  <div><div>Servicios adicionales.</div></div>
  <div><div>Añade a tu chárter...</div></div>
  <div>
    <div>Chef privado a bordo</div>
    <div>€ 480 / día</div>
  </div>
  <!-- ... -->
</div>
```

## DOM de Salida (Decorado)
```html
<div class="yacht-extras-wrapper">
  <div class="yacht-extras-left">
    <div class="yacht-extras-eyebrow">A la carta</div>
    <h2 class="yacht-extras-title">Servicios adicionales.</h2>
    <p class="yacht-extras-description">Añade a tu chárter...</p>
  </div>
  <div class="yacht-extras-right">
    <ul class="yacht-extras-list">
      <li class="yacht-extras-item">
        <span class="yacht-extras-name">Chef privado</span>
        <span class="yacht-extras-price">€ 480 / día</span>
      </li>
    </ul>
  </div>
</div>
```
