import type { FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

/**
 * Web: getAuth() já usa persistência local do navegador
 * (IndexedDB, com fallback para localStorage), então a sessão
 * sobrevive ao recarregar a página.
 *
 * Android/iOS usam authInstance.native.ts (resolvido pelo Metro).
 */
export function criarAuth(app: FirebaseApp): Auth {
  return getAuth(app);
}
