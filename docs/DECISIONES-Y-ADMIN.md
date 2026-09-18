# Decisiones vigentes y administración del sitio

Este documento describe el estado aprobado, los parámetros reutilizables y la arquitectura objetivo. No es un registro de cada corrección. Al cambiar una decisión, actualizar aquí su estado vigente; Git conserva el historial técnico.

## Estado y fuente del proyecto

Repositorio: https://github.com/mbelenrenna/EPI
URL definitiva publicada: https://www.escueladelpensamientointuitivo.com/inspiraccion/nivel-2/
Cloudflare Pages sigue alojando los archivos; el Worker epi-web-routes sirve únicamente la landing y páginas legales en www. CNAME www mantiene d236a02jhneff0.cloudfront.net con proxy habilitado; /school y los restantes recorridos siguen apuntando a Systeme. No se migraron cursos a campus todavía. MX y registros de correo no se modificaron. La ruta antigua de www /programas/inspiraccion-nivel-2/ redirige a la definitiva.
Reglamento completo, literal, versión 2026-09-18: /legal/reglamento-interno/. Copia por versión: /legal/reglamento-interno/2026-09-18/. Condiciones particulares de Nivel 2 G4: /legal/inspiraccion-nivel-2-g4/. Condición de cancelación exactamente aprobada por Belén. Contacto institucional y destino de notificaciones: info@escueladelpensamientointuitivo.com.
Formulario de arrepentimiento: /arrepentimiento/. Apps Script de la Escuela actualizado y autorizado. Belén confirmó registro privado en Sheets, código visible y recepción de ambos correos, al equipo y al participante. Llegaron a Spam: entrega a Recibidos pendiente de optimización. El frontend usa POST /arrepentimiento/enviar en el Worker (mismo origen), que valida y reenvía al Apps Script: no consultar el POST de Google directamente desde el navegador. Los reintentos mantienen el mismo ID para no duplicar pedidos. Fuente servidor: scripts/EPI-inscripciones.gs; registro de aceptación con documento, fecha de servidor, versión y hash. IP verificada y Jotform posterior siguen pendientes.
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
La landing temporal es independiente: los logos del encabezado y footer no enlazan a la Home/hub aún en preparación. Escala móvil contenida: títulos de sección 25px, presentación 32px, lectura general 15px; controles de formulario 16px. Fotos y espaciados móviles compactos sin modificar la escala de escritorio.
Diez testimonios aportados por Agustín en el documento de revisión como participantes de Nivel 2, agrupados en cambios de percepción y cambios concretos. Conservar la redacción de las citas y los nombres abreviados proporcionados. Guadalupe figura sólo como Guadalupe F, sin niveles ni Formación.
Footer desktop: logo a la izquierda, contactos y correo institucional a la derecha, legales debajo del copyright con tipografía coherente. Mobile: logo primero, contactos después, copyright y legales al final con separador sutil y escala compacta. Botón de Arrepentimiento sólo en el footer de la landing, sin franja superior. Favicon: símbolo del logo actual sin texto, generado como SVG desde el bitmap aprobado, sin alterar el archivo original.

## Parámetros vigentes de Nivel 2

- Ruta permanente publicada: /inspiraccion/nivel-2/ (sin año ni generación en URL). La ruta antigua /programas/inspiraccion-nivel-2/ de www redirige a ella.
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

Circuito reforzado de aceptación preparado en scripts/EPI-aceptaciones.gs: respaldo privado Drive con sello técnico HMAC, correos a ambos destinatarios con reglamento adjunto y enlace de confirmación explícita. Pruebas locales aprobadas; falta instalar/autorizar y actualizar Apps Script, y prueba real. No afirmar que está desplegado por haber subido el código a GitHub. Guía independiente del chat: docs/ACEPTACION-ELECTRONICA.md. No es firma digital certificada ni almacenamiento inmutable; IP e identidad documental no verificadas.

“Sistema de reservas” nombra exclusivamente el flujo de InspirAcción Nivel 2 de la Escuela: formulario, Apps Script, planilla y Systeme. No se reutilizan cuentas, código operativo, contactos ni configuraciones de Nati.

Formulario básico -> Apps Script de la cuenta de la Escuela -> Google Sheets y contacto/etiquetas en Systeme.
Después de guardar, se muestran instrucciones de pago y WhatsApp preparado. La persona adjunta el comprobante y envía: no hay notificación automática a Jose sólo por completar el formulario.
Equipo verifica el pago. Planilla controla pagos/saldo y estados; sincronización periódica con Systeme.
Etiqueta principal NIVEL 2 - G4; estados administrados Reserva iniciada, Pago confirmado, Inscripción completa, Cancelado, No continuó; interés en Formación separado.
Claves sólo del lado servidor/propiedades del script; nunca en el admin público ni en Git.
Formulario posterior previsto en Jotform para datos del proceso y aceptación documentada; condiciones esenciales conocidas y aceptación registrada antes de pagar. Validación legal y mecanismo de firma pendientes. No confundir el formulario básico previo al pago de la landing con este formulario posterior.

### Reglamento y evidencia de aceptación

Por autorización expresa de Belén, se publicó literalmente el reglamento entregado, versión 2026-09-18, con enlace desde aceptación y footer. La copia de esa versión debe conservarse para acreditar el documento aceptado. Las condiciones particulares incluyen exactamente: «Una vez vencido el plazo legal de revocación aplicable, no se realizan devoluciones por cancelación voluntaria del participante». La publicación técnica no acredita una revisión jurídica del reglamento; ésta sigue pendiente.

Preparar Jotform desde la cuenta de la Escuela. Registro previsto: nombre completo, email, tipo/número de DNI o pasaporte y país emisor, programa/generación, identificador de envío, aceptación expresa sin premarcar, versión y copia exacta del reglamento aceptado, fecha/hora de servidor e IP capturada por el proveedor. Mostrar fecha/hora argentina conservando el instante original. Verificar captura y exportación real mediante prueba antes de afirmar que funciona. Pedir número de documento no equivale a verificar identidad; no exigir foto del documento por defecto.

Checkbox aprobado, último campo antes de enviar: «He leído y acepto el Reglamento Interno y Términos de Participación de EPI.». Enlazar únicamente el nombre del documento al texto completo. Guardar evidencia en almacenamiento privado de la Escuela y enviar copia al participante. Valorar Jotform Sign con trazabilidad y verificación por correo si se busca evidencia adicional, sin presentarlo como firma digital certificada ni garantía de validez jurídica.

La aceptación posterior no debe ser la primera oportunidad de leer y aceptar las condiciones: incluir aceptación registrada también antes de mostrar los medios de pago. No sustituir simplemente el consentimiento de datos sin revisar el aviso de privacidad; no convertirlo en consentimiento de marketing. Revisar por separado confidencialidad y autorización para difusión pública de imagen/voz.

Footer aprobado: copyright en su renglón; debajo, Reglamento Interno y Términos de Participación, condiciones particulares y Botón de Arrepentimiento. Nota bajo el botón de pago: «Cupos limitados, las condiciones de inscripción, pago y baja están detalladas en el reglamento interno». Texto pequeño gris sin caja ni icono.

Pendientes: revisión legal del documento, formulario Jotform real e IP verificada, integración de su evidencia con Sheets/Systeme, restricciones de acceso y conservación de datos, prueba de aceptación previa al pago desde el dominio definitivo. El checkbox, la IP y el documento son evidencia, no una garantía jurídica por sí solos.

Configuración vigente en content/nivel2/legal.json: URL, versión y aprobación del reglamento publicado. Documento obligatorio y checkbox sin premarcar antes de mostrar los medios de pago. El Apps Script registra aceptación, fecha del servidor, documento, versión y hash en Aceptaciones. No reutilizar una versión existente para modificar el texto legal.

## Administración objetivo

Dos perfiles sobre la misma herramienta, con permisos aplicados por el servidor:

Identidades aprobadas: Agustín accede con info@escueladelpensamientointuitivo.com; Belén con belitaablues@gmail.com como desarrolladora. Servicios y propiedad institucional bajo las cuentas de la Escuela; el email personal de Belén es un acceso autorizado. No compartir credenciales ni deducir roles en el navegador. El admin debe permitir iniciar sesión con esas identidades; no exigir que Agustín manipule Git ni dar acceso técnico completo al repositorio para editar contenidos. La edición y publicación deben poder realizarse sin Codex, con guía de uso y recuperación guardada en el proyecto.

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

www mantiene el destino CNAME de Systeme con proxy Cloudflare: sólo las rutas explícitas de landing y legales se sirven desde Pages. El acceso anterior /school/course/inspiraccion2 respondió HTTP 200 tras la publicación; los cursos no se migraron. campus está preparado en DNS, pero su raíz devuelve 404: no presentarlo como acceso operativo ni reemplazar enlaces de alumnos todavía.
El acceso actual de comunidad responde; falta probar acceso autenticado a cursos.
Pendientes reales: prueba ARS con endpoint actual, interés en Formación y todas las transiciones administrativas.
El checkbox de Formación no lleva aclaración adicional. La cotización muestra valor y fecha/hora de actualización; se conserva blue venta de DólarHoy como referencia de cálculo.
La publicación actual fue manual por Cloudflare Pages; actualizar GitHub no acredita conexión automática GitHub -> Pages.
