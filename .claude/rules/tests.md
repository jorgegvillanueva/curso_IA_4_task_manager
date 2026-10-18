---
paths:
  - 'src/**/*.test.{ts,tsx}'
---

# Convenciones de tests

- Los tests van junto al archivo que prueban, con su mismo nombre: `calculateIce.ts` → `calculateIce.test.ts`. Usa `.test.tsx` solo si el test renderiza JSX. No crees carpetas de tests.
- Importa `describe`, `it`, `expect` y `vi` desde `vitest`: no hay globales.
- Un `describe` por función, hook o componente. El texto de cada `it` describe el comportamiento esperado, en español y sin tildes ni ñ, como los comentarios del código.
- La regla del comentario encima de cada función no se aplica a los callbacks de `describe` ni de `it`.
- Prueba la API pública del módulo. No exportes funciones internas solo para poder probarlas.
- Cubre los casos límite y de error, no solo el caso normal. Usa `it.each` para la misma comprobación con varios valores.
- Nunca llames a servicios reales. Simula `fetch` con `vi.stubGlobal('fetch', ...)` y las variables de entorno con `vi.stubEnv(...)`, y restáuralos en `afterEach` con `vi.unstubAllGlobals()` y `vi.unstubAllEnvs()`.
- Los tests cumplen las mismas reglas que el código: TypeScript `strict`, ESLint y sin `as` salvo al parsear datos externos.
- Ejecuta `npm run test` antes de dar un cambio por cerrado. `npm run check` también lo ejecuta.
