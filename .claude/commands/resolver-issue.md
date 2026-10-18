---
description: Resuelve una issue de GitHub siguiendo el flujo del proyecto
argument-hint: [numero-issue]
disable-model-invocation: true
allowed-tools: Bash(git branch --show-current)
---

Rama actual: !`git branch --show-current`

Resuelve la issue #$ARGUMENTS siguiendo «Ramas y pull requests» de CLAUDE.md:

1. Lee la issue por MCP. Si alguna de sus dependencias sigue abierta, para.
2. Crea la rama desde dev y propón un plan. Espera mi aprobación.
3. Haz el cambio y ejecuta npm run check.
4. Comprueba los criterios de aceptación uno a uno.
5. Valida el mensaje con npx commitlint --extends @commitlint/config-conventional y haz el commit.
6. Abre la PR contra dev con Closes #$ARGUMENTS y la lista de criterios. No la mergees.
