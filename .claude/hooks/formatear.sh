#!/bin/sh
# formatear.sh formatea con Prettier el archivo que Claude Code acaba de crear o editar (hook PostToolUse de Edit y Write).

# Saca tool_input.file_path del JSON que llega por la entrada estandar; queda vacio si no hay ruta o el JSON no es valido.
FILE_PATH=$(node -e '
try {
  const hookInput = JSON.parse(require("node:fs").readFileSync(0, "utf8"));
  process.stdout.write(hookInput.tool_input?.file_path ?? "");
} catch {
  // Sin JSON valido no hay ruta que formatear.
}
')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

if ! PRETTIER_OUTPUT=$(cd "${CLAUDE_PROJECT_DIR:-.}" && npx prettier --write --ignore-unknown "$FILE_PATH" 2>&1); then
  echo "Prettier no pudo formatear $FILE_PATH:" >&2
  echo "$PRETTIER_OUTPUT" >&2
  exit 2
fi
