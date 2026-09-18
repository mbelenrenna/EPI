# Escuela del Pensamiento Intuitivo

Sitio web público de la Escuela del Pensamiento Intuitivo.

## Estructura

- `/`: página principal.
- `/programas/inspiraccion-nivel-1/`: InspirAcción Nivel 1.
- `/programas/inspiraccion-nivel-2/`: InspirAcción Nivel 2.
- `/content/`: contenidos estructurados consumidos por la Home.

## Publicación

El proyecto es un sitio estático preparado para Cloudflare Pages.

- Framework preset: `None`.
- Los cambios de contenido requieren generar HTML y publicar el artefacto completo; `exit 0` no compila los textos de Nivel 2.
- Build output directory: `/`.

Los cursos, la comunidad y los accesos de alumnos permanecen alojados en Systeme.

## Decisiones y administración

- [Decisiones vigentes, parámetros y admin](docs/DECISIONES-Y-ADMIN.md).
- [Norte del proyecto](NORTE-DEL-PROYECTO.md).
- [Voz editorial](VOZ-Y-CRITERIOS.md).
- [Aceptación electrónica: activación, respaldo y pruebas](docs/ACEPTACION-ELECTRONICA.md).

URL publicada: https://www.escueladelpensamientointuitivo.com/inspiraccion/nivel-2/.
El admin privado y la publicación automática son implementaciones en curso, no funciones ya disponibles. La landing aprobada se conserva.

## Editar contenidos hoy

- Textos por sección: `content/nivel2/textos.json`.
- Plantilla: `templates/nivel2.html`. No editar el HTML generado directamente.
- Estilos e interacciones: `programas/inspiraccion-nivel-2/nivel2.css` y `nivel2.js`.
- Reglamento y condiciones: `content/nivel2/legal.json` y documento versionado; no sobrescribir acuerdos aceptados.
- Backend privado desplegado en la cuenta Google de la Escuela: fuente `scripts/EPI-inscripciones.gs`. La API key permanece en propiedades del script, nunca aquí.

Desde la raíz del repositorio:

```sh
node scripts/build-favicon.cjs
node scripts/build-nivel2.cjs programas/inspiraccion-nivel-2/index.html
node scripts/check-nivel2.cjs
node scripts/check-revocation.mjs
```

Estos comandos generan y verifican localmente: no publican por sí solos. El proyecto Pages usa por ahora subida manual; hacer push a GitHub no actualiza la web automáticamente. El Worker `infra/routing` mantiene los cursos de Systeme fuera de sus rutas.

Pruebas de la landing: ejecutar `node verificar-landing.cjs`.

Git conserva historial técnico; la documentación describe decisiones finales, no cada corrección. No publicar claves ni datos de alumnos en este repositorio público.
