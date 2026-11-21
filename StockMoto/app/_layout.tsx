import { Stack } from 'expo-router';
import TelaCarregando from '../components/TelaCarregando';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { UserProvider } from '../contexts/UserContext';

/**
 * Proteção das rotas:
 * - Sem sessão: só as telas de autenticação ficam acessíveis; qualquer
 *   tela interna redireciona para /login.
 * - Com sessão: as telas de autenticação redirecionam para /inicial.
 * Ao mudar o estado de login, o Expo Router remove do histórico as telas
 * que ficaram bloqueadas (o "voltar" não retorna para elas).
 *
 * Toda rota nova em app/ precisa ser listada em um dos grupos abaixo;
 * rotas não listadas ficam sem proteção.
 */
function RootNavigator() {
  const { usuario, carregando } = useAuth();

  // Não monta o Stack (nem redireciona) até saber se há sessão salva.
  // Assim um acesso direto/recarregamento de rota interna não cai no
  // login por engano enquanto a sessão é restaurada.
  if (carregando) {
    return <TelaCarregando />;
  }

  const autenticado = usuario !== null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!autenticado} redirectTo="/inicial">
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/cadastre-se" />
        <Stack.Screen name="(auth)/esqueceu-senha" />
        <Stack.Screen name="(auth)/verificar-email" />
        <Stack.Screen name="(auth)/redefinir-senha" />
      </Stack.Protected>

      <Stack.Protected guard={autenticado} redirectTo="/login">
        <Stack.Screen name="inicial" />
        <Stack.Screen name="estoque" />
        <Stack.Screen name="estoquehonda" />
        <Stack.Screen name="estoquefan160" />
        <Stack.Screen name="estoquestart160" />
        <Stack.Screen name="estoquetitan160" />
        <Stack.Screen name="estoquecargo160" />
        <Stack.Screen name="capacetes" />
        <Stack.Screen name="bau" />
        <Stack.Screen name="cadastrar" />
        <Stack.Screen name="alertas" />
        <Stack.Screen name="orcamentos" />
        <Stack.Screen name="criarorcamento" />
        <Stack.Screen name="editarorcamento" />
        <Stack.Screen name="perfil" />
        <Stack.Screen name="configuracoes" />
        <Stack.Screen name="modal" />
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function Layout() {
  return (

    <AuthProvider>
      <UserProvider>

        <RootNavigator />

      </UserProvider>
    </AuthProvider>

  );
}
