import { View, Text, StyleSheet, Image } from 'react-native';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type ItemProps= {
    nome: string;
    codigo: string;
    categoria: string;
    quantidade: number;
    minimo: number;
    imagem: any;
};

function ItemAlerta({
    nome,
    codigo,
    categoria,
    quantidade,
    minimo,
    imagem,
}: ItemProps) {
    const isEsgotado = quantidade === 0;

    return (
        <View style={styles.item}>
            <View style={styles.left}>
                <Image source={imagem} style={styles.img} />

                <View>
                    <Text style={styles.nome}>{nome}</Text>

                    <View style={styles.row}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{categoria}</Text>
                        </View>

                        <Text style={styles.codigo}>{codigo}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.right}>
                <Text
                    style={[
                        styles.qtd,
                        { color: isEsgotado ? '#FF3B3B' : '#FF3B3B'},
                    ]}
                >
                    {quantidade} Uni.
                </Text>

                <Text style={styles.min}>min: {minimo}</Text>
            </View>
        </View>
    );
}

export default function Alertas() {
    return (
        <View style={styles.container}>
            <Header title='Alertas' showSettings/>

            <View style={styles.content}>
                <Text style={styles.titulo}>Alerta de Estoque</Text>
                <Text style={styles.subtitulo}>
                    Peças que precisam de Atenção
                </Text>   

                <Text style={styles.esgotado}>❗ Esgotados (1)</Text>

                <ItemAlerta
                    nome='Vela de Ignição'
                    codigo='#VL - 001'
                    categoria='ELÉTRICA'
                    quantidade={0}
                    minimo={10}
                    imagem={require('../assets/images/velas.png')}
                />

                <Text style={styles.baixo}>⚠️ Estoque Baixo (3)</Text>

                <ItemAlerta
                    nome="Filtro Ar"
                    codigo="#FA - 001"
                    categoria="FILTRO"
                    quantidade={2}
                    minimo={5}
                    imagem={require("../assets/images/filtroar.png")}
                />

                <ItemAlerta
                   nome="Cdi Eletrônico"
                    codigo="#EL - 001"
                    categoria="ELÉTRICA"
                    quantidade={1}
                    minimo={3}
                    imagem={require("../assets/images/cdieletronico.png")}
                />

                <ItemAlerta
                    nome="Pneu Pirelli CG 160 (TR)"
                    codigo="#PN - 005"
                    categoria="PNEU"
                    quantidade={10}
                    minimo={20}
                    imagem={require("../assets/images/pneupirelli.png")}
                />
            </View>

            <Footer active='alertas' />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },

  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
  },

  titulo: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  subtitulo: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 15,
  },

  esgotado: {
    color: "#ff3b3b",
    fontWeight: "bold",
    marginBottom: 10,
  },

  baixo: {
    color: "#ffc107",
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },

  item: {
    backgroundColor: "#2b2b2b",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  img: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#444",
  },

  nome: {
    color: "#fff",
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 3,
  },

  badge: {
    backgroundColor: "#ff8c00",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  badgeText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "bold",
  },

  codigo: {
    color: "#bbb",
    fontSize: 12,
  },

  right: {
    alignItems: "flex-end",
  },

  qtd: {
    fontWeight: "bold",
    fontSize: 14,
  },

  min: {
    color: "#bbb",
    fontSize: 11,
  },
});