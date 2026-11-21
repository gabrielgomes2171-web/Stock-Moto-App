import type { FirebaseApp } from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  type Auth,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Android/iOS: o Firebase Auth precisa ser inicializado com
 * persistência em AsyncStorage; sem isso a sessão fica só em memória
 * e o usuário é deslogado sempre que o app é reiniciado.
 *
 * initializeAuth só pode ser chamado uma vez por app. Se o módulo for
 * reavaliado (ex.: Fast Refresh), reaproveita a instância existente.
 */
export function criarAuth(app: FirebaseApp): Auth {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    if ((error as { code?: string })?.code === 'auth/already-initialized') {
      return getAuth(app);
    }
    throw error;
  }
}
