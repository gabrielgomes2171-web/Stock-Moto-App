import EstoqueAcessorio from "@/components/EstoqueAcessorio";

// Peças com Categoria "Baú", "Baús" ou "Bauleto" aparecem aqui
export default function Baus() {
  return (
    <EstoqueAcessorio
      tituloHeader="Baús"
      titulo="BAÚS"
      imagem={require("@/assets/images/bau.png")}
      categorias={["BAÚ", "BAÚS", "BAULETO"]}
      categoriaCadastro="BAÚ"
      textoBotaoCadastro="Cadastrar baú"
    />
  );
}
