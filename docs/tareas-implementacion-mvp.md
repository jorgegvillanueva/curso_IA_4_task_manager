# Tareas de implementacion del MVP

Plan de implementacion ordenado para el Gestor de Tareas Inteligente con modelo ICE.
Las tareas estan pensadas para una aplicacion React 18 + TypeScript + Vite + Material UI, manteniendo el alcance didactico del MVP y evitando arquitectura innecesaria.

## 1. Preparar la base tecnica y el modelo de dominio

### Que se va a cambiar

- Crear o revisar la estructura base del proyecto con Vite, React 18, TypeScript y Material UI.
- Definir los tipos principales del dominio: tarea, estado de tarea y valores ICE.
- Crear utilidades puras para calcular y validar la puntuacion ICE.
- Dejar preparada la aplicacion para trabajar sin backend ni persistencia real.

### Archivos o areas afectadas

- `src/main.tsx`
- `src/App.tsx`
- `src/types/`
- `src/utils/`
- Configuracion de Vite, TypeScript y dependencias MUI si todavia no existen.

### Verificacion

- La aplicacion arranca correctamente en desarrollo.
- TypeScript compila sin errores.
- La funcion de calculo ICE devuelve `(impact * confidence) / effort`.
- La validacion solo acepta valores de Impacto, Confianza y Esfuerzo entre 1 y 10.

## 2. Implementar gestion local de tareas

### Que se va a cambiar

- Gestionar el listado de tareas desde el estado raiz de `App.tsx`.
- Implementar acciones para crear, completar, editar y eliminar tareas.
- Calcular la lista ordenada por ICE de mayor a menor como dato derivado, sin guardar `iceScore` en cada tarea.
- Mantener el estado simple con `useState` o `useReducer`, sin librerias externas.

### Archivos o areas afectadas

- `src/App.tsx`
- `src/hooks/useTaskManager.ts`, si la logica supera un tamano razonable.
- `src/types/Task.ts`
- `src/utils/calculateIce.ts`

### Verificacion

- Se puede anadir una tarea al estado local.
- Se puede marcar una tarea como pendiente o completada.
- Se puede eliminar una tarea.
- Las tareas aparecen ordenadas por ICE descendente.
- Las tareas completadas se mantienen en la lista con estado diferenciado.

## 3. Construir la interfaz principal de tareas

### Que se va a cambiar

- Crear la pantalla principal con `AppBar`, contador de tareas y accion para crear una nueva tarea.
- Implementar `TaskList` para mostrar tareas ordenadas.
- Implementar `TaskItem` con titulo, descripcion, estado, puntuacion ICE y acciones.
- Implementar `EmptyState` para el caso sin tareas.
- Aplicar Material UI de forma consistente con los bocetos de `docs/app-screens.svg`.

### Archivos o areas afectadas

- `src/components/AppHeader.tsx`
- `src/components/EmptyState.tsx`
- `src/components/TaskList.tsx`
- `src/components/TaskItem.tsx`
- `src/App.tsx`

### Verificacion

- Con cero tareas se muestra el estado vacio y una accion para crear tarea.
- Con tareas existentes se muestra una lista clara, escaneable y ordenada.
- Cada tarea permite completar y eliminar.
- Las tareas completadas tienen un estilo visual diferente.
- La interfaz respeta patrones de Material UI y no mezcla logica de negocio dentro del JSX.

## 4. Implementar formulario de creacion y edicion manual de ICE

### Que se va a cambiar

- Crear `TaskFormDialog` como modal para nueva tarea y posible edicion.
- Implementar campos de titulo y descripcion.
- Implementar `IceFields` para editar manualmente Impacto, Confianza y Esfuerzo.
- Implementar `IceScoreBadge` para mostrar la puntuacion ICE calculada en tiempo real.
- Validar que el titulo sea obligatorio y que los valores ICE sean validos antes de guardar.

### Archivos o areas afectadas

- `src/components/TaskFormDialog.tsx`
- `src/components/IceFields.tsx`
- `src/components/IceScoreBadge.tsx`
- `src/App.tsx`
- `src/utils/validateIceScore.ts`

### Verificacion

- El usuario puede abrir y cerrar el formulario.
- El boton de guardar queda deshabilitado si faltan datos obligatorios.
- El usuario puede introducir o ajustar manualmente los valores ICE.
- La puntuacion ICE se actualiza al cambiar Impacto, Confianza o Esfuerzo.
- Al guardar, la tarea aparece en la lista ordenada por prioridad.

## 5. Integrar sugerencia ICE con IA y estados de operacion

### Que se va a cambiar

- Crear `aiIceService` para encapsular la llamada HTTP a una API gratuita de IA.
- Construir el prompt recomendado en la documentacion y exigir una respuesta JSON simple.
- Validar la respuesta externa antes de aplicarla al formulario.
- Mostrar estado de carga mientras se calcula la sugerencia.
- Mostrar errores legibles cuando falle la red, la API o el formato de respuesta.
- Mantener siempre disponible el fallback manual.

### Archivos o areas afectadas

- `src/services/aiIceService.ts`
- `src/components/IceSuggestionPanel.tsx`
- `src/components/TaskFormDialog.tsx`
- `src/types/IceScore.ts`
- Variables de entorno de Vite para configurar la API si aplica.

### Verificacion

- El usuario puede pedir una sugerencia ICE desde la descripcion de la tarea.
- Durante la llamada se muestra un estado de carga.
- Una respuesta valida rellena Impacto, Confianza y Esfuerzo.
- Una respuesta invalida o un error de API muestra un mensaje comprensible.
- Aunque la IA falle, el usuario puede completar los valores manualmente y guardar la tarea.

## Orden recomendado de ejecucion

1. Base tecnica y modelo de dominio.
2. Gestion local de tareas.
3. Interfaz principal de tareas.
4. Formulario y edicion manual de ICE.
5. Integracion con IA, carga y errores.

Este orden permite tener una aplicacion funcional de forma temprana y anadir la IA al final, cuando el flujo manual ya este probado.
