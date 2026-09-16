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
- Build command: `exit 0` (opcional).
- Build output directory: `/`.

Los cursos, la comunidad y los accesos de alumnos permanecen alojados en Systeme.

## Decisiones y administración

- [Decisiones vigentes, parámetros y admin](docs/DECISIONES-Y-ADMIN.md).
- [Norte del proyecto](NORTE-DEL-PROYECTO.md).
- [Voz editorial](VOZ-Y-CRITERIOS.md).

El admin es una implementación pendiente, no una función ya disponible. La landing aprobada se conserva mientras Agustín revisa los textos.

Pruebas de la landing: ejecutar `node verificar-landing.cjs`.

Git conserva historial técnico; la documentación describe decisiones finales, no cada corrección. No publicar claves ni datos de alumnos en este repositorio público.
