export function getApiBase() {
  // If REACT_APP_CODESPACE_NAME is explicitly provided prefer it
  const CODESPACE = process.env.REACT_APP_CODESPACE_NAME;
  if (CODESPACE) return `https://${CODESPACE}-8000.app.github.dev`;

  const host = window.location.hostname || 'localhost';

  // Codespaces exposes forwarded ports as '<name>-<port>.app.github.dev'
  if (host.endsWith('.app.github.dev')) {
    // replace trailing '-<port>' with '-8000' (if present) so backend URL uses port 8000 subdomain
    const m = host.match(/^(.*)-\d+\.app\.github\.dev$/);
    if (m && m[1]) {
      return `https://${m[1]}-8000.app.github.dev`;
    }
    // fallback to using same host over HTTPS
    return `https://${host}`;
  }

  // Local development: use port 8000 on the same host
  return `http://${host}:8000`;
}

export const API_BASE = getApiBase();
