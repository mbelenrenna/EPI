# Circuito de aceptación electrónica

## Estado

Código preparado y probado localmente. No dar por activo hasta instalar, autorizar Drive/correo y actualizar la misma implementación Apps Script de la Escuela, y completar una prueba real. No es firma digital certificada ni asesoramiento jurídico.

## Activar sin depender del chat

1. Desde la raíz del proyecto, ejecutar `node scripts/compilar-apps-script.cjs`. Genera `output/EPI-AppsScript-completo.gs`, con el backend completo y el reglamento literal incorporado. El archivo generado está excluido de Git; las fuentes están en `scripts/EPI-inscripciones.gs` y `scripts/EPI-aceptaciones.gs`.
2. Abrir el Apps Script de la Escuela vinculado a la URL /exec actual. Reemplazar el contenido completo de Código.gs con el archivo generado. No borrar propiedades del script ni su API key de Systeme. No añadirlo debajo de la versión anterior.
3. Guardar, elegir `instalarAceptaciones`, ejecutar y autorizar acceso a Drive y envío de correos con la cuenta institucional.
4. Implementar → Gestionar implementaciones → implementación web actual → lápiz → Nueva versión → Implementar. Mantener la misma URL /exec, ejecución como la Escuela y acceso Cualquiera. No crear un proyecto distinto.
5. La consulta GET sin parámetros debe devolver `acceptanceVersion: 2`.
6. Completar una inscripción claramente identificada como PRUEBA, usando un correo propio. Confirmar respaldo privado, ambos emails y adjuntos. Abrir el enlace del correo y pulsar Confirmar; verificar fecha y estado en Aceptaciones. No simular pago confirmado.

## Qué se registra

Checkbox obligatorio sin premarcar, nombre, email y documento declarados; programa; instante del servidor UTC y zona Argentina; versión, copia exacta y SHA-256 del reglamento; cláusula particular de cancelación; ID único de aceptación.

El servidor calcula el hash esperado desde el reglamento incorporado: no confía en el hash enviado por el navegador. Guarda un JSON privado en Drive y un sello HMAC con clave privada de propiedades del script. La hoja contiene ID, enlace al respaldo, sello, estados de envío y fecha de confirmación del email. Los datos originales para los correos se leen del respaldo, no de celdas editables.

Los correos se disparan únicamente DESPUÉS de que el equipo marque un pago verificado en Seguimiento (primer o segundo pago confirmado, importe reconocido mayor que cero, sin cancelación/baja). Un formulario o comprobante recibido no son confirmación de pago. El chequeo corre cada cinco minutos. No esperar necesariamente el pago total: una reserva realmente verificada habilita la constancia; ésta no sustituye la validación del requisito de Nivel 1 ni certifica el cupo.

Se conserva el registro privado de la aceptación previo al pago para acreditar qué condiciones se aceptaron antes de transferir; antes de confirmar un pago no salen esos correos. Los dos correos posteriores llevan el reglamento literal como TXT y la constancia JSON. La persona recibe además un enlace privado firmado técnicamente y confirma con un POST explícito. Abrir el enlace no confirma, para evitar confirmaciones por escáneres de correo. Se guarda la confirmación como un evento separado; no se sobrescribe el registro original. La confirmación acredita acceso al correo, no verificación documental de identidad.

Reintentos de correo cada cinco minutos mediante el disparador legal existente. El estado Enviado significa que Google aceptó el envío, no que llegó a Recibidos. Monitorear Spam, cuotas y estados pendientes. Reenvíos idénticos del formulario en un intervalo de 30 minutos reutilizan la aceptación más reciente; posteriores aceptaciones quedan como registros nuevos.

## Dónde consultarlo

- Planilla institucional: pestaña Aceptaciones. No editar los datos probatorios ni crear filas como si fueran envíos de alumnos.
- Drive de la Escuela: carpeta EPI · Evidencias privadas de aceptación; la instalación muestra su enlace en el registro. Los archivos se crean privados, no públicos.
- Correo institucional y correo del participante: copias enviadas y adjuntos con ID.
- No publicar respaldos, DNI, emails de alumnos, tokens ni la clave ACCEPTANCE_SEAL_KEY en GitHub.

## Límites y conservación

Una edición del JSON sin conocer la clave se detecta mediante HMAC. El propietario de Drive/Apps Script conserva poderes de edición/eliminación y acceso a la clave: esto NO es almacenamiento inmutable ni un sello de tiempo independiente, y NO protege contra un administrador con todos esos permisos. Las copias enviadas a ambos correos aportan respaldo separado; preservar originales y controles de acceso. El historial de Sheets no sustituye los respaldos.

No captura IP ni verifica que el documento declarado pertenezca a la persona. Jotform/firma especializada y revisión jurídica siguen como módulos pendientes. No se convierten filas antiguas en aceptaciones nuevas ni se atribuye confirmación retroactiva. La confirmación no significa pago/cupo confirmado, no convierte el consentimiento en marketing y no limita derechos legales.

Si cambian las condiciones, crear nueva versión y actualizar frontend y backend coordinadamente. No sobrescribir la copia aceptada. El titular jurídico debe definir conservación, acceso y privacidad con asesoramiento profesional.
