import { Redirect } from 'expo-router';

export default function Index() {
  // "/" só é acessível com sessão (ver app/_layout.tsx); sem sessão o
  // guard já redireciona para /login.
  return <Redirect href="/inicial" />;
  }