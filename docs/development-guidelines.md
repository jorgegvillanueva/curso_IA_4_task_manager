# Development Guidelines — Todo Inteligente MVP

> Referencia técnica rápida para desarrollo con React + TypeScript + Material UI.
> Decisiones tomadas. No negociar sin motivo justificado.

---

## 1. Stack tecnológico

| Capa          | Decisión                                     |
| ------------- | -------------------------------------------- |
| Framework     | React 18                                     |
| Lenguaje      | TypeScript                                   |
| Build tool    | Vite                                         |
| UI components | Material UI (MUI) v6                         |
| Design system | Material Design                              |
| Estado        | useState / useReducer (sin librería externa) |
| HTTP          | fetch nativo                                 |
| Testing       | Vitest + Testing Library (si aplica)         |

Herramientas de calidad:

- [ ] ESLint usa `eslint.config.js` con flat config.
- [ ] ESLint debe cubrir reglas recomendadas de JavaScript, TypeScript, React y React Hooks, mas reglas de consistencia de importaciones.
- [ ] Prettier define el formato de codigo.
- [ ] `eslint-config-prettier` debe quedar al final de la configuracion de ESLint para evitar conflictos con Prettier.
- [ ] Ejecutar `npm run check` antes de cerrar cambios relevantes.

---

## 2. Estructura de carpetas

```
src/
  components/       # Componentes de UI reutilizables
  features/         # Lógica y componentes por feature (si crece)
  hooks/            # Custom hooks
  services/         # Llamadas a APIs externas
  types/            # Tipos e interfaces TypeScript
  utils/            # Funciones puras auxiliares
  App.tsx
  main.tsx
```

Reglas:

- [ ] Un archivo por componente. Sin barrel exports innecesarios.
- [ ] `services/` solo para I/O externo (APIs). Sin lógica de negocio.
- [ ] `utils/` solo para funciones puras sin efectos.
- [ ] No crear subcarpetas hasta que existan más de 5 archivos del mismo tipo.

---

## 3. Convenciones de nombres

| Elemento         | Convención                     | Ejemplo            |
| ---------------- | ------------------------------ | ------------------ |
| Componente       | PascalCase                     | `TaskItem.tsx`     |
| Hook             | camelCase con `use`            | `useTaskList.ts`   |
| Servicio         | camelCase con sufijo `Service` | `aiIceService.ts`  |
| Tipo / Interface | PascalCase                     | `Task`, `IceScore` |
| Utilidad         | camelCase                      | `calculateIce.ts`  |
| Constante        | UPPER_SNAKE_CASE               | `MAX_ICE_VALUE`    |
| Props type       | `ComponentNameProps`           | `TaskItemProps`    |

Reglas:

- [ ] No abreviar nombres salvo si son universales (`id`, `url`, `api`).
- [ ] Nombrar por intención, no por implementación.

---

## 4. Componentes — organización y responsabilidades

| Componente      | Responsabilidad                                |
| --------------- | ---------------------------------------------- |
| `App.tsx`       | Estado raíz, coordinación de acciones          |
| `TaskForm.tsx`  | Formulario de creación + trigger cálculo ICE   |
| `TaskList.tsx`  | Listado ordenado por ICE                       |
| `TaskItem.tsx`  | Visualización y acciones de una tarea          |
| `IceFields.tsx` | Inputs manuales Impacto / Confianza / Esfuerzo |

Reglas:

- [ ] Un componente = una responsabilidad.
- [ ] Props tipadas con `type` o `interface`, nunca inline en más de 2 props.
- [ ] Sin lógica de negocio dentro de JSX. Extraer a función o hook.
- [ ] Sin llamadas a APIs directamente en componentes.
- [ ] Máximo ~100 líneas por componente. Si supera, dividir.

---

## 5. Hooks

Reglas:

- [ ] Usar `useState` para estado local simple.
- [ ] Usar `useReducer` si hay más de 3 campos relacionados que cambian juntos.
- [ ] Usar `useMemo` para calcular la lista ordenada por ICE.
- [ ] Extraer a custom hook si la lógica supera 20 líneas o se reutiliza.
- [ ] No usar `useEffect` para derivar estado; usar `useMemo`.
- [ ] Nombrar custom hooks describiendo qué devuelven, no qué hacen internamente.

Ejemplo de custom hook apropiado: `useTaskManager` (gestiona CRUD de tareas).

---

## 6. Gestión del estado

Reglas:

- [ ] Estado global en `App.tsx` (proyecto pequeño, no justifica Context ni Redux).
- [ ] Pasar estado hacia abajo mediante props.
- [ ] Pasar acciones como callbacks tipados.
- [ ] No mutar estado directamente; siempre crear nuevo objeto/array.
- [ ] La puntuación ICE se calcula con `useMemo`, no se almacena.
- [ ] Estado de carga y error co-locados con la operación que los genera.

```ts
// Tipo de tarea (referencia)
type TaskStatus = 'pending' | 'completed';
interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  impact: number;
  confidence: number;
  effort: number;
}
```

---

## 7. Llamadas a API

Reglas:

- [ ] Toda llamada externa va en `src/services/`.
- [ ] Los servicios devuelven `Promise<T>` con tipo explícito.
- [ ] El componente/hook llama al servicio; nunca `fetch` directo en JSX.
- [ ] Validar la respuesta antes de usarla (valores entre 1-10 para ICE).
- [ ] Nunca exponer API keys en el cliente; usar variables de entorno (`import.meta.env`).
- [ ] Manejar siempre el caso de red caída y respuesta malformada.

```ts
// Firma esperada del servicio IA
async function getIceSuggestion(description: string): Promise<IceScore>;
```

---

## 8. Manejo de errores y estados de carga

| Estado             | Solución                                            |
| ------------------ | --------------------------------------------------- |
| Cargando           | Prop `loading: boolean` + `CircularProgress` de MUI |
| Error de API       | Prop `error: string \| null` + `Alert` de MUI       |
| Respuesta inválida | Validar en el servicio; lanzar error descriptivo    |
| Fallback manual    | Siempre permitir edición manual de campos ICE       |

Reglas:

- [ ] Estado `loading` y `error` siempre juntos como par.
- [ ] Mostrar error con mensaje legible para el usuario, no el error técnico.
- [ ] Resetear `error` al iniciar una nueva operación.
- [ ] No ocultar errores en `console.log`; tratarlos o propagarlos.

---

## 9. Librerías aprobadas

| Librería              | Uso                   | Estado                 |
| --------------------- | --------------------- | ---------------------- |
| `@mui/material`       | Componentes UI        | ✅ Aprobada            |
| `@mui/icons-material` | Iconos                | ✅ Aprobada            |
| `@emotion/react`      | Estilos (peer de MUI) | ✅ Aprobada            |
| `@emotion/styled`     | Estilos (peer de MUI) | ✅ Aprobada            |
| `vite`                | Build                 | ✅ Aprobada            |
| `vitest`              | Testing               | ✅ Aprobada (opcional) |

Reglas:

- [ ] No añadir librerías sin justificación explícita.
- [ ] Preferir funcionalidad nativa de React o JS antes de añadir dependencia.
- [ ] Sin librería de formularios (no justificado para este tamaño).
- [ ] Sin librería de estado global (Context o prop drilling suficiente).
- [ ] Sin librería de routing (aplicación de una sola página).

---

## 10. Principios generales

- [ ] Claridad sobre brevedad. Código legible > código corto.
- [ ] Tipos explícitos. Sin `any`. Sin `as` salvo en parseo externo validado.
- [ ] Funciones pequeñas con única responsabilidad.
- [ ] No optimizar hasta que haya un problema medible.
- [ ] No sobrearquitectar: si cabe en un archivo, no crear carpeta.
