# Decisiones vigentes y administración del sitio

Este documento describe el estado aprobado, los parámetros reutilizables y la arquitectura objetivo. No es un registro de cada corrección. Al cambiar una decisión, actualizar aquí su estado vigente; Git conserva el historial técnico.

## Estado y fuente del proyecto

Repositorio: https://github.com/mbelenrenna/EPI
Publicación actual de prueba: https://escuela-pensamiento-intuitivo.pages.dev/programas/inspiraccion-nivel-2/
La landing consolidada es la versión visual aprobada por Belén en escritorio y celular. Los cambios editoriales de Agustín se revisan primero en su Google Doc y luego se aplican; no sincronizar ese documento automáticamente con la web.
Documento de revisión: https://docs.google.com/document/d/1C2L1rb85k8ReD59DzyUU3skldS4_pCgS69gmmW0XwnA/edit
El documento es accesible mediante el conector. La devolución de Agustín se aplica por pedido de Belén, con correcciones ortográficas y sintácticas sin introducir ideas nuevas. Los comentarios editoriales no aparecen en la web.

## Referencias permanentes

NORTE-DEL-PROYECTO.md: objetivo, identidad y control integral obligatorio.
VOZ-Y-CRITERIOS.md: voz editorial y límites de redacción.
Este archivo: arquitectura, parámetros de operación y administración.
No subir conversaciones, presupuestos personales, listados de alumnos, comprobantes ni claves al repositorio público. No mantener copias de prueba como páginas navegables.

## Diseño y recorrido aprobados

Lora y Montserrat; paleta e imágenes reales de la Escuela. Escala tipográfica contenida, botones redondeados, fondos diferenciados y lectura legible.
InspirAcción es entrenamiento y experiencia, no un catálogo de cursos. Nivel 2 es continuidad de Nivel 1.
Invitaciones visibles después de identificación, experiencia, formato, beneficio y testimonios; inscripción directa desde navegación.
Menú móvil, anclas nativas suaves, foco de teclado, reducción de movimiento y preguntas desplegables. Contacto con Jose; no tapar campos con elementos flotantes.
Diez testimonios aportados por Agustín en el documento de revisión como participantes de Nivel 2, agrupados en cambios de percepción y cambios concretos. Conservar la redacción de las citas y los nombres abreviados proporcionados. Guadalupe incluye referencia a N1, N2 y Formación.

## Parámetros vigentes de Nivel 2

- Ruta permanente prevista: /programas/inspiraccion-nivel-2/ (sin año ni generación en URL).
- Generación: 4. Cursada: enero y febrero de 2027; dos meses. Fecha exacta de inicio no confirmada.
- Requisito comunicado: certificado de InspirAcción Nivel 1. La verificación sigue a cargo del equipo; no exigir carga de documento sin definir ese proceso.
- Hasta 15/10/2026 inclusive: valor USD 300; reserva USD 150; saldo USD 150 hasta 05/01/2027.
- Desde 16/10/2026 hasta 05/11/2026 inclusive: valor USD 350; reserva USD 175; saldo USD 175 hasta 05/01/2027.
- Después del 05/11/2026: valor USD 400; pago completo. Cierre definitivo de inscripción pendiente; no inventar fecha.
- Cupos limitados, sin publicar cantidad de inscritos no verificada.
- Dólar de referencia ARS: blue venta de DólarHoy; mostrar actualización y no reutilizar una cotización fallida como actual.
- PayPal: 5% de recargo. Otras monedas/condiciones especiales: consulta humana.
- Jose es Josefina, sin tilde: WhatsApp +52 1 998 179 7419.
- Beneficio: 40% en sesiones con Agus mientras sea alumno regular entrenando en cualquier formato.
- Formación: comienza marzo de 2027, para quienes completaron Nivel 2. Duración y valores no confirmados.

Las fechas/valores están hoy en JavaScript de la landing y Apps Script. Esto NO es todavía una fuente única administrable. Antes de habilitar edición debe eliminarse esa duplicación; el servidor decide el importe, el navegador lo muestra. Zona horaria comercial confirmada: America/Argentina/Buenos_Aires. La landing usa esa zona, independiente de la zona local del dispositivo; el código guardado de Apps Script también la usa.

## Operación actual

“Sistema de reservas” nombra exclusivamente el flujo de InspirAcción Nivel 2 de la Escuela: formulario, Apps Script, planilla y Systeme. No se reutilizan cuentas, código operativo, contactos ni configuraciones de Nati.

Formulario básico -> Apps Script de la cuenta de la Escuela -> Google Sheets y contacto/etiquetas en Systeme.
Después de guardar, se muestran instrucciones de pago y WhatsApp preparado. La persona adjunta el comprobante y envía: no hay notificación automática a Jose sólo por completar el formulario.
Equipo verifica el pago. Planilla controla pagos/saldo y estados; sincronización periódica con Systeme.
Etiqueta principal NIVEL 2 - G4; estados administrados Reserva iniciada, Pago confirmado, Inscripción completa, Cancelado, No continuó; interés en Formación separado.
Claves sólo del lado servidor/propiedades del script; nunca en el admin público ni en Git.
Formulario posterior previsto en Jotform para datos del proceso y aceptación documentada; condiciones esenciales conocidas antes de pagar. Validación legal y mecanismo de firma pendientes.

## Administración objetivo

Dos perfiles sobre la misma herramienta, con permisos aplicados por el servidor:

| Perfil | Puede administrar | Requiere trabajo técnico |
|---|---|---|
| Agustín editor | Textos, CTA, enlaces aprobados, imágenes dentro de formatos definidos; fechas/valores de etapas existentes si se le habilita | Nuevas reglas, integraciones, arquitectura o cambios de diseño |
| Belén administradora | Contenidos, ediciones, etapas, fechas/valores, apertura/cierre, mensajes y parámetros habilitados; publicar/restaurar | Nuevos algoritmos, seguridad, pasarelas, nuevos campos o integraciones requieren desarrollo |

No bloquear cambios simples artificialmente para justificar mantenimiento. La configuración de una regla existente no es una nueva lógica. Alcance y permisos editoriales se acuerdan explícitamente; el rol técnico no expone secretos.
Hasta contar con admin, mantenimiento manual pactado; la propuesta comercial detallada permanece fuera del repositorio público.

### Interfaz requerida

- Acceso privado con cuentas individuales, no contraseña/key incrustada en HTML.
- Selector Home/programa/edición y campos legibles agrupados por sección.
- Formularios para texto, fecha, valor, porcentaje y URL; no editar HTML/JS.
- Guardar borrador, vista previa real desktop/mobile, publicar y restaurar.
- Resumen de diferencias antes de publicar; advertir cambios que afectan pagos.
- Vista de cronograma: “vigente hoy” y etapas futuras sin mostrarlas como opciones comerciales al alumno.
- Acceso útil para Belén también, sin depender de Codex para operación diaria.

### Fuente única y controles

Base inicial separada en este repositorio:

- templates/nivel2.html: estructura y atributos de la landing.
- content/nivel2/textos.json: textos agrupados por sección; extraídos del HTML aprobado sin redacción nueva.
- content/nivel2/comercial.json: parámetros preparados de esta edición; zona horaria comercial y cierre no confirmados. NO conectado aún al navegador ni Apps Script.
- scripts/build-nivel2.cjs: genera HTML de revisión desde plantilla y textos, escapando contenido. La prueba inicial generó HTML idéntico al aprobado.

Ejemplo: node scripts/build-nivel2.cjs output/nivel2-preview.html

El HTML de Nivel 2 se genera desde la plantilla y los textos separados; el compilador admite campos y listas de testimonios, escapando el contenido. No editar el HTML generado por separado. La publicación sigue siendo manual; falta automatizar su generación y despliegue. El admin escribirá en esta misma fuente; no importará/exportará copias manuales que se desactualicen.
El Google Doc es revisión editorial, no una fuente automática de publicación. Guardar borradores no equivale a publicar; un cambio sólo llega a la web al aprobar/publicar y terminar exitosamente el despliegue.

Separar contenido, configuración comercial y lógica técnica. El motor consume datos validados compartidos por web y backend; no mantener precios distintos en front y servidor.
Separar programa estable de edición/generación. IDs y rutas estables; no modificar acuerdos ya confirmados al editar futuras etapas.
Validar fechas ordenadas/no superpuestas, valores positivos, reserva/saldo/recargo, moneda, URLs seguras y contenido sin scripts.
Por cada reserva guardar edición, etapa, valor y cotización aceptados. Cambios futuros no recalculan contratos anteriores indiscriminadamente.
El servidor verifica permisos, calcula etapa vigente y valida entrada; ocultar controles en frontend no basta.
Versionado interno para publicación/restauración, aun sin documentar cada cambio editorial en archivos narrativos.
No mezclar admin de contenidos con gestión académica completa. Sheets/Systeme se conservan inicialmente; tablero de alumnos es un módulo separado.

### Decisión tecnológica pendiente

Elegir CMS con autenticación/roles y publicación compatible con GitHub/Cloudflare, o admin propio con backend privado. No seleccionar por apariencia solamente ni construir un panel público que sólo descargue JSON.
Comparar costo, permisos, vista previa, rollback, edición comercial y vínculo con Apps Script antes de contratar/conectar una plataforma.
El admin completo y nuevas automatizaciones no se consideran incluidos automáticamente en la optimización ya presupuestada; acordar el módulo correspondiente.

## Siguiente implementación

1. Sincronizar repositorio aprobado sin cambiar textos esperando feedback.
2. Confirmar zona horaria comercial y quién puede publicar valores.
3. Extraer contenidos a esquema reutilizable y pruebas que mantengan diseño/render actual.
4. Centralizar configuración front/backend sin modificar reservas existentes.
5. Conectar admin autenticado con borradores, validación, preview y publicación.
6. Probar edición de un texto, fecha y etapa sin Codex; seguridad y recuperación.
7. Capacitación breve de Agustín y Belén y guía de uso.

## Publicación y cierre pendientes

### Footer único

La landing temporal integra “Seguí en contacto con la Escuela”, Instagram de Escuela, Instagram de Agus, podcast y solicitar sesión en un solo footer. Accesos apilados también en desktop, con íconos de Instagram y Spotify. Instagram de Agus confirmado por Belén: https://www.instagram.com/agustintrowell/.
Al construir el ecosistema, extraer un único componente/footer compartido por todas las páginas y una única colección de enlaces. Conservar esos cuatro accesos básicos y sumar navegación/acceso alumno pertinente. No mantener versiones independientes por página.
Los textos de la devolución de Agustín se aplican según la interpretación confirmada por Belén: mantener etiquetas de cursada/duración, botones originales de presentación, cuerpo de continuidad a la derecha, negritas y agrupación de testimonios. No conservar párrafos reemplazados como contenido adicional.

www sigue apuntando a infraestructura anterior; campus no resuelve según revisión del 16/09/2026. No modificar DNS sin coordinar Systeme, Hostinger y enlaces /school/* de alumnos.
El acceso actual de comunidad responde; falta probar acceso autenticado a cursos.
Pendientes reales: prueba ARS con endpoint actual, interés en Formación y todas las transiciones administrativas.
El checkbox de Formación no lleva aclaración adicional. La cotización muestra valor y fecha/hora de actualización; se conserva blue venta de DólarHoy como referencia de cálculo.
La publicación actual fue manual por Cloudflare Pages; actualizar GitHub no acredita conexión automática GitHub -> Pages.
