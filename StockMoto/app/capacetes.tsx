import EstoqueAcessorio from "@/components/EstoqueAcessorio";

// Peças com Categoria "Capacete" ou "Capacetes" aparecem aqui
export default function Capacetes() {
  return (
    <EstoqueAcessorio
      tituloHeader="Capacetes"
      titulo="CAPACETES"
      imagem={require("@/assets/images/capacete.png")}
      categorias={["CAPACETE", "CAPACETES"]}
      categoriaCadastro="CAPACETES"
      textoBotaoCadastro="Cadastrar capacete"
    />
  );
}
