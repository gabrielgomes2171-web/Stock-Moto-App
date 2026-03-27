# Stock-Moto-App
📱 Tela de Login - React Native (Expo)

📌 Descrição Geral

A tela de login permite que o usuário acesse o aplicativo por meio de autenticação.  
Ela oferece duas opções principais:

- Login tradicional (usuário e senha)
- Login com conta Google (interface visual com ícone)

A interface foi desenvolvida com foco em simplicidade, usabilidade e design moderno.

---

🎯 Objetivo

- Permitir autenticação do usuário
- Facilitar o acesso ao sistema
- Oferecer login rápido com Google
- Disponibilizar recuperação de senha e cadastro

---

🧱 Estrutura da Tela

🔹 Container Principal
- Fundo escuro (`#101010`)
- Conteúdo centralizado
- Espaçamento interno

---

🔹 Logo do Aplicativo
- Exibida com componente `Image`
- Caminho: `../assets/images/logo.png`
- Dimensão atual: `450x200`

---

🔹 Botão "Continue com Google"

- Componente: `TouchableOpacity`
- Layout horizontal (`flexDirection: 'row'`)
- Contém:
  - Ícone do Google
  - Texto descritivo

📌 Características:
- Fundo branco
- Alinhamento central
- Espaçamento entre elementos

📁 Ícone: ../assets/images/iconegoogle.jpg

---

🔹 Campos de Entrada

👤 Usuário
- Placeholder: "Usuario"

🔒 Senha
- Placeholder: "Senha"
- Propriedade: `secureTextEntry`

📌 Estilo:
- Fundo branco
- Bordas arredondadas
- Borda leve

---

🔹 Botão de Login
-	Componente: TouchableOpacity 
-	Texto: "ENTRAR NA CONTA" 
🎨 Estilo:
- Cor: Laranja (`#f4882f`)
- Texto branco
- Centralizado
-	Bordas arredondadas 

---

🔹 Rodapé

Contém:
- "Esqueceu a senha?"
- "Cadastre-se aqui"
📌 Layout horizontal com espaçamento

---
🎨 Estilização
Utiliza `StyleSheet.create()`.
Paleta de cores:
- Fundo: Preto (#101010)
- Inputs: Branco
- Botão principal: Laranja
- Botão Google: Branco

---

⚙️ Funcionalidades

✔ Interface de login pronta  
✔ Inputs configurados  
✔ Botão Google com ícone  
✔ Layout organizado  
✔ Preparado para integração com backend  

---

🚧 Melhorias Futuras

- Integração com autenticação real (API)
- Login com Google usando Expo Auth
- Validação de campos
- Mensagens de erro
- Navegação entre telas
- Responsividade (ajuste da logo)

---

🧪 Tecnologias Utilizadas

- React Native
- Expo Go
- JavaScript
- StyleSheet API
- Expo Vector Icons

---

🔄 Fluxo de Uso

1. Usuário abre o app  
2. Visualiza a tela de login  
3. Escolhe:
Login com Google  
Ou login com usuário e senha  
4. Clica em "Entrar na conta"  
5. Sistema realiza autenticação (futuro)

---

📌 Considerações Técnicas

- Botão Google atualmente apenas visual
- Ícone carregado localmente
- Importação de ícones pronta para uso futuro
- Layout pode ser ajustado para diferentes telas

---

🏁 Conclusão

A tela de login apresenta uma interface moderna, organizada e pronta para evolução com integração de autenticação real.

---

📸 Preview da Tela

![Tela de Login](StockMoto/assets/login.png)


