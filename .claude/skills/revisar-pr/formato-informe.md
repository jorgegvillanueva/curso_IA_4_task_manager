# Formato del informe

Usa estas secciones en este orden. Cada afirmación lleva su evidencia.

## Revisión de la PR #<n>: <título>

**Veredicto:** aprobable | aprobable con cambios | no aprobable

<Una o dos frases con el motivo principal.>

- **Aprobable:** se cumplen todos los criterios que se pueden verificar, el proceso es correcto y no hay hallazgos bloqueantes ni importantes.
- **Aprobable con cambios:** hay hallazgos importantes o menores que se pueden corregir sin rehacer la PR.
- **No aprobable:** algún criterio no se cumple, la CI está en rojo o hay un hallazgo bloqueante.

Lo que no se puede verificar no cambia el veredicto: va en «Pendientes de verificar».

### Criterios de aceptación de #<issue>

| #   | Criterio   | Estado                                                    | Evidencia                                 |
| --- | ---------- | --------------------------------------------------------- | ----------------------------------------- |
| 1   | <criterio> | ✅ Se cumple / ❌ No se cumple / ❓ No se puede verificar | `archivo:línea`, salida de la CI o commit |

### Hallazgos

De mayor a menor gravedad: bloqueante, importante, menor. Si no hay, escribe «Sin hallazgos».

#### 1. <Título corto> (<gravedad>, <error demostrado | riesgo sin demostrar>)

- **Evidencia:** `archivo:línea` o salida que lo muestra.
- **Impacto:** qué falla o puede fallar, y a quién afecta.
- **Comprobación sugerida:** cómo confirmarlo o descartarlo.

### CI y commits

- **CI del último commit (`<sha>`):** en verde, en rojo o sin checks, con cada check y su resultado.
- **Proceso:** rama base, formato de la rama y «Closes #n», cada uno con ✅ o ❌.

| Commit  | Mensaje         | commitlint                             |
| ------- | --------------- | -------------------------------------- |
| `<sha>` | <primera línea> | ✅ / ❌ <motivo> / ❓ no está en local |

### Pendientes de verificar

Lo que no se ha podido comprobar y cómo comprobarlo; por ejemplo, pruebas manuales con `npm run dev`.
