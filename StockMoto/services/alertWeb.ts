import { Alert, AlertButton, Platform } from 'react-native';

// No navegador, o Alert.alert do React Native não mostra nada e os botões
// (ex.: "Sim" para adicionar/remover peça) nunca são chamados.
// Aqui ele é trocado pelas caixas do próprio navegador (alert/confirm).
function alertWeb(title: string, message?: string, buttons?: AlertButton[]) {
  const texto = [title, message].filter(Boolean).join('\n\n');

  if (!buttons || buttons.length <= 1) {
    window.alert(texto);
    buttons?.[0]?.onPress?.();
    return;
  }

  const cancelar = buttons.find((b) => b.style === 'cancel');
  const confirmar = [...buttons].reverse().find((b) => b.style !== 'cancel');

  if (window.confirm(texto)) {
    confirmar?.onPress?.();
  } else {
    cancelar?.onPress?.();
  }
}

if (Platform.OS === 'web') {
  Alert.alert = alertWeb;
}
