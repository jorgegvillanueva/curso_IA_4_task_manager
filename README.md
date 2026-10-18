# Gestor de Tareas ICE

Aplicación web para gestionar tareas y priorizarlas con el modelo ICE, con sugerencias de una IA (Google Gemini).

## Lanzar la aplicación

Necesitas Node.js y npm.

```sh
npm install
cp .env.example .env
```

Abre `.env` y pon tu clave de Gemini en `VITE_GEMINI_API_KEY` (se consigue gratis en https://aistudio.google.com/apikey). Sin clave la aplicación funciona, pero no puede sugerir valores con IA.

```sh
npm run dev
```

Abre en el navegador la dirección que muestra la consola (normalmente http://localhost:5173).

## Compilar

```sh
npm run build
```

Comprueba los tipos y genera la versión de producción en la carpeta `dist/`.

La clave de Gemini queda incluida en el JavaScript compilado: no publiques esa versión con una clave real.

## MCP de GitHub

`.mcp.json` configura el servidor MCP de GitHub para Claude Code. Necesita la variable de entorno `GITHUB_PAT`, con un token de acceso personal de GitHub. No escribas el token en `.mcp.json`: el archivo está versionado.

## Plugin LSP de TypeScript

`.claude/settings.json` activa el plugin `typescript-lsp` del marketplace oficial de Claude Code. Conecta Claude con un servidor de lenguaje de TypeScript, así que Claude ve los errores de tipos justo después de cada edición y puede ir a la definición de un símbolo o buscar sus referencias. Necesita el servidor instalado globalmente:

```sh
npm install -g typescript-language-server typescript
```

## Documentación

- `docs/app-screens.png`: bocetos de las pantallas.
