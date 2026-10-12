# Alcance funcional del MVP: Gestor de Tareas Inteligente con modelo ICE

## 1. Objetivo del MVP

Construir una aplicación sencilla en React para gestionar tareas personales y priorizarlas mediante el modelo ICE:

- **Impacto**: valor o beneficio esperado de completar la tarea.
- **Confianza**: seguridad sobre la importancia o viabilidad de la tarea.
- **Esfuerzo**: coste estimado para realizarla.

El MVP debe permitir crear tareas, calcular una puntuación ICE a partir de una descripción usando una API gratuita de IA y ordenar visualmente las tareas según su prioridad.

La aplicación está pensada para un curso de React, por lo que debe priorizar claridad, simplicidad y aprendizaje por encima de una arquitectura compleja.

## 2. Funcionalidades incluidas

### 2.1 Crear tarea

El usuario podrá crear una tarea introduciendo:

- Título.
- Descripción.

Al crearla, la tarea se añadirá al listado con estado pendiente.

### 2.2 Calcular ICE con IA

El usuario podrá solicitar el cálculo automático del ICE a partir de la descripción de la tarea.

La IA deberá devolver valores numéricos para:

- Impacto: de 1 a 10.
- Confianza: de 1 a 10.
- Esfuerzo: de 1 a 10.

La aplicación calculará la puntuación final con la fórmula:

```text
ICE = (Impacto * Confianza) / Esfuerzo
```

La respuesta de la IA deberá transformarse a un objeto simple:

```js
{
  impact: 8,
  confidence: 7,
  effort: 4
}
```

Si la API falla, la aplicación mostrará un mensaje de error comprensible y permitirá introducir los valores manualmente.

### 2.3 Edición manual de ICE

El usuario podrá ajustar manualmente los valores de Impacto, Confianza y Esfuerzo.

Esto permite que el MVP siga funcionando aunque:

- La API gratuita no esté disponible.
- La respuesta de IA no sea adecuada.
- El usuario quiera corregir la estimación.

### 2.4 Listado de tareas

La aplicación mostrará las tareas en una lista sencilla con:

- Título.
- Descripción.
- Estado.
- Impacto.
- Confianza.
- Esfuerzo.
- Puntuación ICE calculada.

Las tareas se ordenarán por ICE de mayor a menor para destacar las más prioritarias.

### 2.5 Cambiar estado de una tarea

El usuario podrá marcar una tarea como:

- Pendiente.
- Completada.

Las tareas completadas podrán mantenerse en la lista con un estilo visual diferenciado.

### 2.6 Eliminar tarea

El usuario podrá eliminar una tarea del listado.

La eliminación será local y no requerirá confirmación avanzada para mantener la simplicidad del MVP.

### 2.7 Estado de carga y errores

La aplicación deberá mostrar estados básicos cuando:

- Se está calculando el ICE con IA.
- La API responde con error.
- La respuesta de la API no tiene el formato esperado.

## 3. Funcionalidades excluidas

El MVP no incluye:

- Backend.
- Autenticación.
- Persistencia real.
- Paginación.
- Multiusuario.
- Tags o etiquetas.
- Roles de usuario.
- Notificaciones.
- Fechas límite.
- Subtareas.
- Filtros avanzados.
- Sincronización entre dispositivos.

## 4. Modelo de tarea

Una tarea puede representarse con una estructura simple:

```js
{
  id: "task-1",
  title: "Preparar clase de React",
  description: "Crear ejemplos prácticos sobre componentes y estado",
  status: "pending",
  impact: 8,
  confidence: 7,
  effort: 4,
  iceScore: 14
}
```

La propiedad `iceScore` puede calcularse dinámicamente en lugar de guardarse, para evitar datos duplicados.

## 5. Flujo principal de usuario

1. El usuario escribe el título y la descripción de una tarea.
2. Pulsa el botón para calcular ICE con IA.
3. La aplicación muestra un estado de carga.
4. La API devuelve Impacto, Confianza y Esfuerzo.
5. La aplicación calcula la puntuación ICE.
6. El usuario revisa o ajusta los valores.
7. El usuario guarda la tarea.
8. La tarea aparece en el listado ordenado por prioridad.
9. El usuario puede completarla o eliminarla.

## 6. Prompt recomendado para la IA

El prompt debe pedir una respuesta simple y fácil de parsear:

```text
Analiza la siguiente tarea y estima sus valores ICE.

Tarea:
"{description}"

Devuelve solo JSON válido con este formato:
{
  "impact": number,
  "confidence": number,
  "effort": number
}

Reglas:
- impact debe estar entre 1 y 10.
- confidence debe estar entre 1 y 10.
- effort debe estar entre 1 y 10.
- No añadas explicación.
```

La aplicación deberá validar que los valores recibidos están entre 1 y 10 antes de usarlos.

## 7. Criterios de aceptación

El MVP se considera completo cuando:

- El usuario puede crear una tarea con título y descripción.
- El usuario puede calcular valores ICE usando una API gratuita de IA.
- El usuario puede editar manualmente Impacto, Confianza y Esfuerzo.
- La aplicación calcula correctamente la puntuación ICE.
- Las tareas se muestran ordenadas de mayor a menor ICE.
- El usuario puede marcar tareas como completadas.
- El usuario puede eliminar tareas.
- La aplicación muestra estados de carga y error al llamar a la IA.
- La aplicación funciona sin backend, autenticación ni persistencia real.

## 8. Alcance recomendado para el curso

Este MVP es adecuado para practicar:

- Componentes.
- Props.
- Estado con `useState`.
- Eventos de formulario.
- Renderizado condicional.
- Listas y keys.
- Cálculos derivados con `useMemo`.
- Llamadas HTTP con `fetch`.
- Manejo básico de errores.
- Separación simple entre componentes, servicios y utilidades.

No se recomienda introducir gestores globales de estado, routing, backend o arquitectura avanzada en esta primera versión.
