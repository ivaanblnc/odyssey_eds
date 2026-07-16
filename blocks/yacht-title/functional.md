# Bloque: Yacht Title (Hero Banner del Yate)

## Visión General
Bloque de encabezado principal para la página de detalle del Yate. Muestra la información crítica (nombre, categoría, precio, base) con tipografía de alto impacto. 
- **Estrategia de Carga:** Eager (Crítico para LCP)

## Modelo Universal Editor
El autor configurará el bloque insertando una tabla con 6 filas estructuradas de pares clave/valor.

### Campos Configurables (No repetibles):
1. **Category:** Categoría y año (ej: Catamarán de lujo · 2023 · Signature)
2. **Title:** Nombre de la embarcación (ej: Sunreef 60)
3. **Subtitle:** Nombre específico o apodo (ej: Aeolus)
4. **Price Prefix:** Etiqueta previa al precio (ej: Desde / semana)
5. **Price:** Precio (ej: € 28.900)
6. **Base:** Puerto base (ej: Base · Gouvia Marina)

## DOM de Entrada (Matriz EDS)
AEM entregará el siguiente marcado plano de divs instrumentado (simplificado):
```html
<div class="yacht-title">
  <div>
    <div>Category</div>
    <div>Catamarán de lujo · 2023 · Signature</div>
  </div>
  <div>
    <div>Title</div>
    <div>Sunreef 60</div>
  </div>
  ...
</div>
```

## DOM de Salida (Decorado)
El script transformará la matriz a la siguiente estructura semántica sin utilizar `innerHTML` para preservar la instrumentación `urn:aem:connection`:
```html
<div class="yacht-title" data-block-name="yacht-title" data-block-status="loaded">
  <div class="yacht-title__container">
    <div class="yacht-title__title-col">
      <div class="yacht-title__category">Catamarán de lujo · 2023 · Signature</div>
      <h1 class="yacht-title__heading">
        <span class="yacht-title__main-title">Sunreef 60</span><br>
        <em class="yacht-title__subtitle">Aeolus</em>
      </h1>
    </div>
    <div class="yacht-title__price-col">
      <div class="yacht-title__price-prefix">Desde / semana</div>
      <div class="yacht-title__price-val">€ 28.900</div>
      <div class="yacht-title__base">Base · Gouvia Marina</div>
    </div>
  </div>
</div>
```
