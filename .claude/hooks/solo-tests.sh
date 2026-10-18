#!/bin/sh
# solo-tests.sh impide que el agente tester edite archivos que no sean tests de src/ (hook PreToolUse de Edit y Write).

# Saca tool_input.file_path del JSON de la entrada estandar como ruta absoluta; queda vacio si no hay ruta o el JSON no es valido.
FILE_PATH=$(node -e '
try {
  const hookInput = JSON.parse(require("node:fs").readFileSync(0, "utf8"));
  const filePath = hookInput.tool_input?.file_path ?? "";
  process.stdout.write(filePath === "" ? "" : require("node:path").resolve(filePath));
} catch {
  // Sin JSON valido no hay ruta que permitir.
}
')

case "$FILE_PATH" in
  "$CLAUDE_PROJECT_DIR"/src/*.test.ts | "$CLAUDE_PROJECT_DIR"/src/*.test.tsx)
    exit 0
    ;;
esac

echo "El agente tester solo puede editar archivos de test" >&2
exit 2
