# Gestor de Tareas ICE

App web para gestionar tareas personales y priorizarlas con el modelo ICE. Una IA (Google Gemini) sugiere los valores. Es material de un curso de React: prima la claridad y la simplicidad sobre la arquitectura.

Stack: React, TypeScript en modo `strict`, Vite y Material UI siguiendo Material Design. No hay backend ni persistencia: el estado vive en memoria y la IA se llama con `fetch` desde el navegador.

## Comandos

```sh
npm install
cp .env.example .env   # y rellena VITE_GEMINI_API_KEY
npm run dev            # servidor de desarrollo
npm run check          # tipos + lint + formato; debe pasar antes de dar un cambio por cerrado
npm run lint:fix       # corrige lo que ESLint puede arreglar solo
npm run format         # aplica Prettier
npm run build          # tipos + build de producción en dist/
```

- No hay tests ni script `test`. No instales Vitest ni Testing Library ni escribas tests hasta que se pida expresamente; a partir de entonces serán obligatorios.
- Sin clave de Gemini la app funciona; solo falla la sugerencia con IA, que muestra un mensaje.

## Ramas y pull requests

Git flow con dos ramas fijas, protegidas en GitHub con rulesets:

- `dev` es la rama por defecto y la de integración. Cada issue sale de `dev` en una rama `issue-<numero>-<descripcion-corta>`, y su PR va siempre contra `dev` con `Closes #<numero>` en la descripción.
- `main` es la rama estable. Solo acepta PRs desde `dev` (lo comprueba el check `solo-desde-dev` de `.github/workflows/solo-desde-dev.yml`) y se mergean con merge commit.
- Para mergear en `dev`, la PR necesita la aprobación del code owner (`.github/CODEOWNERS`), todos los hilos resueltos y ningún conflicto.
- No hagas push directo ni force push a `dev` ni a `main`. Tampoco apruebes ni mergees PRs, ni uses `gh pr merge --admin` para saltarte las reglas: eso lo hace el propietario del repositorio.

## Arquitectura

### Capas y dependencias

| Carpeta           | Responsabilidad                                         | Puede importar                                  |
| ----------------- | ------------------------------------------------------- | ----------------------------------------------- |
| `src/components/` | UI con MUI                                              | `hooks/`, `utils/`, `types/`, otros componentes |
| `src/hooks/`      | Estado y orquestación                                   | `services/`, `utils/`, `types/`                 |
| `src/services/`   | Solo I/O externo y validación de lo que devuelve la API | `utils/`, `types/`                              |
| `src/utils/`      | Funciones puras, sin efectos                            | `types/`                                        |
| `src/types/`      | Tipos e interfaces, sin lógica                          | `types/`                                        |

- Los componentes nunca llaman a servicios: lo hacen los hooks.
- Los servicios no contienen lógica de negocio ni código de React.
- No uses barrel exports (`index.ts`).
- No crees carpetas ni subcarpetas nuevas mientras no haya más de 5 archivos del mismo tipo que lo justifiquen.

### Componentes y flujo de datos

```text
App.tsx (useTaskManager)          dueño de las tareas y de abrir/cerrar el formulario
├─ AppHeader                      título y contador de tareas
├─ EmptyState | TaskList          EmptyState si no hay tareas
│               └─ TaskItem       tarjeta con completar, editar y eliminar
│                  └─ IceScoreBadge
├─ Fab                            abre el formulario vacío
└─ TaskFormDialog                 crear y editar (useTaskForm + useIceSuggestion)
   ├─ IceSuggestionPanel          botón de IA, carga, error y resultado; solo presentación
   ├─ IceFields                   sliders de Impacto, Confianza y Esfuerzo
   └─ IceScoreBadge
useIceSuggestion → aiIceService.getIceSuggestion → API de Gemini
```

- `App.tsx` pasa `sortedTasks` hacia abajo por props. Las acciones (`onCreateTask`, `onToggleStatus`, `onEdit`, `onDelete`, `onSave`, `onClose`) suben como callbacks tipados.
- `TaskList` no ordena: pinta las tareas en el orden que recibe.

### Dónde va el código nuevo

| Qué                                   | Dónde y cómo se llama                                                          |
| ------------------------------------- | ------------------------------------------------------------------------------ |
| Componente de UI                      | `src/components/NombrePascal.tsx`, uno por archivo, `export default`           |
| Lógica con estado o que usa servicios | `src/hooks/useAlgo.ts`, export con nombre                                      |
| Llamada a una API externa             | `src/services/algoService.ts`, export con nombre                               |
| Cálculo o validación pura             | `src/utils/verboAlgo.ts`, export con nombre                                    |
| Tipo compartido                       | `src/types/NombrePascal.ts`                                                    |
| Estado global                         | `App.tsx`, o `useTaskManager` si es de tareas                                  |
| Tema de MUI                           | `src/main.tsx`                                                                 |
| Variable de entorno                   | Prefijo `VITE_`, en `.env.example` y en `ImportMetaEnv` de `src/vite-env.d.ts` |

## Estado

- Usa `useState` para estado simple y `useReducer` cuando hay más de 3 campos relacionados que cambian juntos (como en `useTaskForm`).
- Extrae la lógica a un custom hook si pasa de 20 líneas o se reutiliza. Nombra cada hook por lo que devuelve.
- El estado global vive en `App.tsx` y baja por props. No uses Context.
- No mutes el estado: crea siempre un objeto o un array nuevo.
- No guardes datos derivados en el estado ni los calcules con `useEffect`. La puntuación ICE no es un campo de `Task`: se calcula con `calculateIce` al renderizar. La lista ordenada se deriva con `useMemo`.

## Integración con Gemini

- Todo lo de Gemini vive en `src/services/aiIceService.ts`: modelo (`GEMINI_MODEL`), URL, timeout, `responseSchema`, prompt (`buildIcePrompt`) y mensajes de error.
- El texto del prompt es parte de la especificación: no lo cambies salvo que se pida. Lleva tildes a propósito; es la única excepción a la regla de textos sin tildes.
- La IA recibe el título y la descripción unidos por un salto de línea (`taskText` de `useTaskForm`).
- El servicio valida la respuesta con `isValidIceValue` antes de devolverla, aunque la petición ya fuerce un `responseSchema`.
- La clave se lee de `import.meta.env.VITE_GEMINI_API_KEY` y viaja en la cabecera `x-goog-api-key`, nunca en la URL.
- Sin backend, Vite incluye la clave en el JavaScript que recibe el navegador. Vale para el uso local del curso: no publiques la app con una clave real.

## Errores y carga

- Cada operación asíncrona expone `loading: boolean` y `error: string | null` juntos, en el hook que la lanza. Al empezar, resetea `error` y el resultado anterior.
- En la UI, `loading` se muestra con `CircularProgress` y `error` con `Alert` de MUI.
- Ante un fallo de red, un error HTTP o una respuesta no válida, el servicio lanza `AiIceServiceError` con un mensaje para el usuario: falta la clave, clave no válida, límite gratuito superado, servicio no disponible, sin conexión o formato inesperado.
- El hook muestra el mensaje de `AiIceServiceError`. Para cualquier otro error muestra un mensaje genérico, nunca el error técnico.
- No ocultes errores en `console.log`: trátalos o propágalos.

## Reglas de dominio

- ICE = (Impacto × Confianza) / Esfuerzo. Cada valor es un entero de 1 a 10 (`MIN_ICE_VALUE` y `MAX_ICE_VALUE` en `validateIceScore.ts`). La puntuación se muestra con un decimal.
- Crear y editar usan el mismo modal, `TaskFormDialog`. Al editar se abre con los datos de la tarea.
- En una tarea nueva, Impacto, Confianza y Esfuerzo empiezan en `null` (sin valor), no en 1.
- Guardar solo se habilita si el título tiene texto tras `trim()` y los tres valores son válidos. `useTaskForm` lo expresa con `taskToSave`, que vale `null` mientras no se puede guardar.
- Cancelar, ✕, Escape o clic fuera del modal descartan los cambios.
- El botón de IA se habilita si hay título o descripción. Una sugerencia válida rellena los tres valores y muestra qué sugirió la IA. Pedir otra borra el error o la sugerencia anterior.
- La IA nunca bloquea: el usuario puede ajustar los valores a mano y guardar aunque la sugerencia falle.
- Las tareas nuevas empiezan en `pending`. El estado alterna entre `pending` y `completed`.
- La lista se ordena por ICE de mayor a menor. Las completadas siguen en la lista, con estilo atenuado.
- Eliminar es inmediato y no pide confirmación.

## Requisitos sin implementar

Forman parte del alcance, pero el código aún no los cumple. No los des por hechos. Cuando se implementen, pasa la regla a «Reglas de dominio» y quítala de aquí.

- El chip de `IceScoreBadge` cambia de color según la prioridad: gris si la tarea está completada o faltan valores, verde si ICE ≥ 10, naranja si 5 ≤ ICE < 10 y rojo si ICE < 5. Hoy usa `primary` o gris.
- Al guardar se muestra el aviso «Tarea guardada». Debe vivir en `App.tsx`, porque `TaskFormDialog` se desmonta al guardar.

## Fuera de alcance

- No añadas backend, autenticación, persistencia (las tareas se pierden al recargar; no uses `localStorage`), paginación, multiusuario, roles, etiquetas, notificaciones, fechas límite, subtareas, filtros avanzados ni sincronización entre dispositivos.
- Los bocetos (`docs/app-screens.png` y `design/app-screens.svg`) son solo una referencia visual: si contradicen este archivo, manda este archivo. No implementes la etiqueta «NUEVA» ni los menús ☰ y ⋮ de la barra superior.

## Convenciones de código

- Encima de cada función va un comentario de una línea, en español, que empieza por su nombre: `// calculateIce devuelve la puntuacion ICE ...`.
- Escribe los textos de la interfaz y los comentarios sin tildes ni ñ, como el código existente.
- Las constantes van en `UPPER_SNAKE_CASE`.
- Las props se tipan con una `interface` llamada `NombreComponenteProps`. No uses tipos inline con más de 2 props.
- No abrevies nombres, salvo los universales (`id`, `url`, `api`).
- No pongas lógica de negocio en el JSX: extráela a una función del archivo o a un hook.
- Mantén cada componente por debajo de unas 100 líneas; si las supera, divídelo. `TaskFormDialog` y `TaskItem` ya las superan: no los hagas crecer; si les añades algo, extrae antes un subcomponente.
- No uses `as`, salvo al parsear datos externos que después se validan. La única excepción existente es `getElementById('root')` en `main.tsx`.
- Los servicios devuelven `Promise<T>` con el tipo explícito.
- Los estilos van en la prop `sx` de MUI. No hay archivos CSS.

## Dependencias

- No añadas librerías sin una justificación explícita. Antes usa React, MUI o JavaScript nativo.
- No añadas librerías de formularios, de estado global, de routing ni clientes HTTP: se usa `fetch` nativo.

## Trampas conocidas

- `TaskFormDialog` solo está montado mientras el formulario está abierto (`isFormOpen && …` en `App.tsx`) y su `Dialog` lleva `open` fijo. Así `useReducer` se inicializa de nuevo con la tarea elegida cada vez. No lo dejes siempre montado controlando `open`: el formulario conservaría los datos anteriores.
- Prettier también revisa los `.md`. Después de editar documentación, ejecuta `npm run format`.
