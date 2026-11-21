import type { Persistence, ReactNativeAsyncStorage } from 'firebase/auth';

/**
 * O build React Native de firebase/auth exporta getReactNativePersistence,
 * mas os tipos públicos do pacote (condição "types") não o declaram.
 * Use somente em arquivos *.native.ts — na web essa função não existe.
 */
declare module 'firebase/auth' {
  export function getReactNativePersistence(
    storage: ReactNativeAsyncStorage
  ): Persistence;
}
