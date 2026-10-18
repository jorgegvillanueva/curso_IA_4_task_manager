---
description: Revisa una pull request de este repositorio cuando se pide revisarla o validarla. Comprueba los criterios de aceptación de la issue que cierra, las reglas de CLAUDE.md, el proceso de ramas y commits y la CI, y devuelve un informe con veredicto. No la uses para explicar código, para revisar cambios que todavía no están en una PR ni para resolver issues.
argument-hint: [numero-pr]
context: fork
agent: revisor-pr
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash(git diff *)
  - Bash(git log *)
  - Bash(git branch --show-current)
  - Bash(npx commitlint *)
  - mcp__github__pull_request_read
  - mcp__github__list_pull_requests
  - mcp__github__issue_read
  - mcp__github__get_commit
  - mcp__github__get_file_contents
  - mcp__github__actions_list
  - mcp__github__actions_get
  - mcp__github__get_job_logs
---

# Revisar una pull request

Revisa una PR del repositorio `jorgegvillanueva/curso_IA_4_task_manager` y devuelve un informe. Trabajas en un contexto aparte y no ves la conversación principal: todo lo que necesitas está en estas instrucciones.

- PR que hay que revisar: «$ARGUMENTS». Si está vacío, revisa la PR abierta de la rama actual.
- Rama actual: !`git branch --show-current`

## Límites

Solo lees e informas. Nunca comentas en la PR, no la apruebas, no pides cambios, no la mergeas, no editas archivos y no haces commit, push, `git fetch` ni cambios de rama. Si crees que algo debería publicarse en GitHub, dilo en el informe: lo decide el usuario en la conversación principal.

## Procedimiento

1. **Reúne los datos con el MCP de GitHub.**
   - Sin número de PR, busca con `list_pull_requests` la PR abierta cuya rama origen sea la rama actual. Si no hay ninguna, para y dilo.
   - Con `pull_request_read`, lee `get` (título, descripción y ramas base y origen), `get_commits`, `get_files`, `get_diff` y `get_check_runs`, que da el estado de la CI del último commit.
   - Con `issue_read`, lee la issue que cierra la descripción con «Closes #n». Si no cierra ninguna, anótalo como hallazgo y sigue.
   - Si algún check ha fallado, lee el log del job con `get_job_logs`.
2. **Lee CLAUDE.md** de la rama base con `get_file_contents` y aplica las reglas que afecten a los archivos cambiados. Si la PR modifica CLAUDE.md, revisa también ese cambio. Cita cada regla por su sección en lugar de copiarla.
3. **Comprueba los criterios de aceptación** de la issue uno a uno: se cumple, no se cumple o no se puede verificar. Cada estado lleva evidencia: `archivo:línea`, salida de la CI o commit. Lo que afirma la descripción de la PR no es evidencia por sí solo: compruébalo en el diff o en la CI.
4. **Comprueba el proceso** según «Ramas y pull requests» de CLAUDE.md:
   - La PR va contra `dev`.
   - La rama sigue el formato `issue-<numero>-<descripcion>`, y el número coincide con el de «Closes #n».
   - La descripción incluye «Closes #n».
   - Cada mensaje de commit pasa commitlint: `git log --format=%B -n 1 <sha> | npx commitlint --extends @commitlint/config-conventional`. Con `--extends` funciona aunque todavía no exista `commitlint.config.cjs`. Si el commit no está en local, márcalo como «no se puede verificar»; no hagas fetch.
   - La CI está en verde. Que no haya checks no es lo mismo que una CI en verde: dilo.
5. **Señala los cambios fuera del alcance** de la issue.
6. **Separa los errores demostrados de los riesgos sin demostrar.** Un error demostrado tiene evidencia que lo muestra; un riesgo es algo que podría fallar y no has podido comprobar. No inventes hallazgos: si no hay defectos, dilo.
7. **Devuelve el informe** con el formato de [formato-informe.md](formato-informe.md).

## Trampa: el disco puede no ser la PR

Los archivos del disco son los de la rama en la que esté el usuario, que puede no ser la de la PR. Para citar `archivo:línea`, usa la versión de la rama de la PR: el diff, `get_file_contents` con esa rama como `ref`, o `git diff` y `git log` sobre ella si está en local.
